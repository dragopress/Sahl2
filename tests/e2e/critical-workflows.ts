import assert from 'node:assert/strict';
import test from 'node:test';

const BASE_URL = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3001/api/v1').replace(/\/$/, '');

async function request(path: string, options: RequestInit = {}, cookie?: string) {
  const headers = new Headers(options.headers);
  headers.set('content-type', 'application/json');
  if (cookie) headers.set('cookie', cookie);
  const response = await fetch(`${BASE_URL}${path}`, {...options, headers});
  const text = await response.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return {response, body};
}

function sessionCookie(response: Response) {
  const h = response.headers as Headers & { getSetCookie?: () => string[] };
  const values = h.getSetCookie?.() ?? [];
  const raw = values[0] || response.headers.get('set-cookie') || '';
  const match = raw.match(/sahlbiz_session=[^;]+/);
  assert.ok(match, 'login/register must return a sahlbiz_session cookie');
  return match[0];
}

async function expectStatus(path: string, status: number, options: RequestInit = {}, cookie?: string) {
  const result = await request(path, options, cookie);
  assert.equal(result.response.status, status, `${path}: expected ${status}, got ${result.response.status}: ${JSON.stringify(result.body)}`);
  return result.body;
}

async function post(path: string, payload: unknown, cookie: string, status = 201) {
  return expectStatus(path, status, {method: 'POST', body: JSON.stringify(payload)}, cookie);
}

async function get(path: string, cookie: string, status = 200) {
  return expectStatus(path, status, {method: 'GET'}, cookie);
}

async function patch(path: string, payload: unknown, cookie: string, status = 200) {
  return expectStatus(path, status, {method: 'PATCH', body: JSON.stringify(payload)}, cookie);
}

test('critical business workflows and tenant isolation', async () => {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const register = async (label: string) => {
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: `e2e-${label}-${suffix}@example.test`,
        name: `E2E ${label}`,
        password: 'Correct-Horse-Battery-77!',
        organizationName: `E2E ${label} ${suffix}`,
      }),
    });
    assert.equal(result.response.status, 201, JSON.stringify(result.body));
    const cookie = sessionCookie(result.response);
    assert.equal(result.body.organizations.length, 1);
    return {cookie, organizationId: result.body.organizations[0].id, userId: result.body.user.id};
  };

  const a = await register('A');
  const b = await register('B');

  await get('/auth/me', a.cookie);
  await get('/auth/me', b.cookie);
  await expectStatus('/customers', 403, {method: 'GET', headers: {'x-organization-id': b.organizationId}}, a.cookie);

  const customer = await post('/customers', {name: `E2E Customer ${suffix}`, type: 'COMPANY', email: `customer-${suffix}@example.test`}, a.cookie);
  const customerId = customer.id as string;

  const bCustomers = await get('/customers', b.cookie);
  assert.equal(bCustomers.data.length, 0, 'tenant B must not see tenant A customers');
  await get(`/customers/${customerId}`, b.cookie, 404);
  await get('/customers', a.cookie);

  const product = await post('/products', {
    name: `E2E Product ${suffix}`,
    type: 'PRODUCT',
    sku: `E2E-${suffix}`,
    purchasePrice: 50,
    sellingPrice: 100,
    taxRate: 20,
    unit: 'unité',
    minimumStock: 1,
  }, a.cookie);
  const productId = product.id as string;

  await get(`/products/${productId}`, a.cookie);
  await get(`/products/${productId}`, b.cookie, 404);

  const warehouse = await post('/inventory/warehouses', {name: `E2E Main ${suffix}`, code: `E2E${Date.now()}`, isDefault: true}, a.cookie);
  const warehouseId = warehouse.id as string;
  await post('/inventory/receipts', {warehouseId, productId, quantity: 5, note: 'E2E opening receipt'}, a.cookie);

  const project = await post('/projects', {name: `E2E Project ${suffix}`, customerId, budget: 1000}, a.cookie);
  const projectId = project.id as string;
  const task = await post('/tasks', {title: `E2E Task ${suffix}`, projectId, status: 'TODO'}, a.cookie);
  await patch(`/tasks/${task.id}`, {status: 'DONE'}, a.cookie);

  const quote = await post('/quotes', {
    customerId,
    projectId,
    items: [{productId, description: product.name, quantity: 2, unitPrice: 100, taxRate: 20}],
  }, a.cookie);
  await post(`/quotes/${quote.id}/send`, {}, a.cookie);
  const invoice = await post(`/quotes/${quote.id}/convert`, {}, a.cookie);
  assert.equal(invoice.projectId, projectId);
  assert.equal(invoice.customerId, customerId);
  await post(`/invoices/${invoice.id}/send`, {}, a.cookie);

  const stock = await get(`/inventory/stock?warehouseId=${encodeURIComponent(warehouseId)}`, a.cookie);
  const productStock = stock.find((row: any) => row.productId === productId);
  assert.equal(Number(productStock.quantity), 3, 'sending a product invoice must issue stock');

  await post('/finance/accounts/seed', {}, a.cookie);
  const cash = await post('/finance/cash-accounts', {name: `E2E Bank ${suffix}`, type: 'BANK', openingBalance: 0}, a.cookie);
  const payment = await post('/payments', {invoiceId: invoice.id, amount: 240, method: 'BANK', reference: `E2E-${suffix}`}, a.cookie);
  assert.ok(payment.id);
  await post(`/finance/post/invoice/${invoice.id}`, {}, a.cookie);
  await post(`/finance/post/payment/${payment.id}?cashAccountId=${encodeURIComponent(cash.id)}`, {}, a.cookie);

  const pnl = await get('/finance/pnl', a.cookie);
  assert.equal(Number(pnl.revenue), 200, 'P&L must include the invoice revenue');
  const vat = await get('/finance/vat-report', a.cookie);
  assert.equal(Number(vat.collected), 40, 'VAT report must include collected VAT');

  const supplier = await post('/suppliers', {name: `E2E Supplier ${suffix}`, paymentTermsDays: 30}, a.cookie);
  const supplierBill = await post('/suppliers/bills', {supplierId: supplier.id, subtotal: 50, tax: 10, externalNumber: `EXT-${suffix}`}, a.cookie);
  await post(`/suppliers/bills/${supplierBill.id}/post`, {}, a.cookie);
  const supplierPayment = await post('/suppliers/payments', {
    supplierBillId: supplierBill.id,
    cashAccountId: cash.id,
    amount: 60,
    paidAt: new Date().toISOString(),
    method: 'BANK',
  }, a.cookie);
  assert.ok(supplierPayment.payment.id);

  const expense = await post('/expenses', {
    category: 'E2E Test',
    amount: 24,
    taxRate: 20,
    incurredAt: new Date().toISOString(),
    projectId,
    paymentMethod: 'BANK',
  }, a.cookie);
  await post(`/expenses/${expense.id}/approve`, {}, a.cookie);
  const paidExpense = await post(`/expenses/${expense.id}/pay`, {cashAccountId: cash.id, paidAt: new Date().toISOString()}, a.cookie);
  assert.equal(paidExpense.status, 'PAID');

  const reports = await get('/analytics/executive', a.cookie);
  assert.ok(typeof reports.kpis.revenue === 'number');
  const profitability = await get('/projects/profitability', a.cookie);
  assert.ok(Array.isArray(profitability.projects));

  const search = await get(`/search?q=${encodeURIComponent('E2E Product')}`, a.cookie);
  assert.ok(Array.isArray(search.items), 'global search must return result data');
  const bSearch = await get(`/search?q=${encodeURIComponent('E2E Product')}`, b.cookie);
  assert.equal(bSearch.items.length, 0, 'global search must be tenant-scoped');

  const docs = await get('/documents', a.cookie);
  assert.ok(Array.isArray(docs.data), 'document listing must be tenant-scoped');
  const bDocs = await get('/documents', b.cookie);
  assert.equal(bDocs.data.length, 0);

  const ai = await get('/ai/context', a.cookie);
  assert.equal(ai.organizationId, a.organizationId);

  const notifications = await get('/automation/notifications', a.cookie);
  assert.ok(Array.isArray(notifications));

  const bProject = await get(`/projects/${projectId}`, b.cookie, 404);
  assert.equal(bProject.message, 'Projet introuvable.');

  const logout = await post('/auth/logout', {}, a.cookie, 201);
  assert.equal(logout.ok, true);
  await get('/customers', a.cookie, 401);
});
