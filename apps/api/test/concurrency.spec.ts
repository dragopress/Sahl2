import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { SalesService } from '../src/sales/sales.service';
import { InventoryService } from '../src/inventory/inventory.service';
import { FinanceService } from '../src/finance/finance.service';

const databaseUrl = process.env.DATABASE_URL;
const integration = databaseUrl ? test : test.skip;
const prisma = new PrismaClient();
const noopAudit = { record: async () => undefined } as any;
const noopInventory = {} as InventoryService;
const request = { ip: '127.0.0.1', headers: {} } as any;

async function organization(prefix: string) {
  return prisma.organization.create({
    data: { name: `${prefix} ${Date.now()}`, slug: `${prefix.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2)}` },
  });
}

integration('concurrent payments cannot overpay an invoice', async () => {
  const org = await organization('payment-concurrency');
  try {
    const customer = await prisma.customer.create({ data: { organizationId: org.id, name: 'Concurrency Customer' } });
    const invoice = await prisma.invoice.create({
      data: {
        organizationId: org.id,
        customerId: customer.id,
        number: `INV-CONC-${Date.now()}`,
        status: 'SENT',
        subtotal: 100,
        discount: 0,
        tax: 0,
        total: 100,
      },
    });
    const sales = new SalesService(prisma as any, noopAudit, noopInventory);
    const results = await Promise.allSettled([
      sales.createPayment(org.id, 'user-a', { invoiceId: invoice.id, amount: 100, method: 'CASH' } as any, request),
      sales.createPayment(org.id, 'user-b', { invoiceId: invoice.id, amount: 100, method: 'CASH' } as any, request),
    ]);

    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
    const payments = await prisma.payment.findMany({ where: { invoiceId: invoice.id } });
    assert.equal(payments.reduce((sum, payment) => sum + Number(payment.amount), 0), 100);
    assert.equal((await prisma.invoice.findUniqueOrThrow({ where: { id: invoice.id } })).status, 'PAID');
  } finally {
    await prisma.organization.delete({ where: { id: org.id } });
  }
});

integration('concurrent stock issues cannot make warehouse stock negative', async () => {
  const org = await organization('stock-concurrency');
  try {
    const product = await prisma.product.create({ data: { organizationId: org.id, name: 'Concurrency Product', type: 'PRODUCT' } });
    const warehouse = await prisma.warehouse.create({ data: { organizationId: org.id, name: 'Main', code: `MAIN-${Date.now()}`, isDefault: true } });
    await prisma.warehouseStock.create({ data: { warehouseId: warehouse.id, productId: product.id, quantity: 10 } });
    const inventory = new InventoryService(prisma as any, noopAudit);

    const results = await Promise.allSettled([
      prisma.$transaction((tx) => (inventory as any).move(tx, {
        organizationId: org.id, warehouseId: warehouse.id, productId: product.id,
        delta: -8, type: 'SALE_ISSUE', sourceType: 'TEST', sourceId: 'issue-a',
      })),
      prisma.$transaction((tx) => (inventory as any).move(tx, {
        organizationId: org.id, warehouseId: warehouse.id, productId: product.id,
        delta: -8, type: 'SALE_ISSUE', sourceType: 'TEST', sourceId: 'issue-b',
      })),
    ]);

    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
    const stock = await prisma.warehouseStock.findUniqueOrThrow({ where: { warehouseId_productId: { warehouseId: warehouse.id, productId: product.id } } });
    assert.equal(Number(stock.quantity), 2);
  } finally {
    await prisma.organization.delete({ where: { id: org.id } });
  }
});

integration('concurrent number allocations return unique contiguous values', async () => {
  const org = await organization('sequence-concurrency');
  try {
    const sales = new SalesService(prisma as any, noopAudit, noopInventory);
    const finance = new FinanceService(prisma as any, noopAudit);
    const salesNumbers = await Promise.all(Array.from({ length: 12 }, () => prisma.$transaction((tx) => (sales as any).nextNumber(tx, org.id, 'INVOICE'))));
    const journalNumbers = await Promise.all(Array.from({ length: 12 }, () => prisma.$transaction((tx) => (finance as any).nextNumber(tx, org.id))));

    assert.equal(new Set(salesNumbers).size, 12);
    assert.equal(new Set(journalNumbers).size, 12);
    assert.deepEqual([...salesNumbers].sort(), Array.from({ length: 12 }, (_, index) => `INV-${new Date().getFullYear()}-${String(index + 1).padStart(4, '0')}`));
    assert.deepEqual([...journalNumbers].sort(), Array.from({ length: 12 }, (_, index) => `JE-${new Date().getFullYear()}-${String(index + 1).padStart(4, '0')}`));
  } finally {
    await prisma.organization.delete({ where: { id: org.id } });
  }
});

after(async () => {
  await prisma.$disconnect();
});
