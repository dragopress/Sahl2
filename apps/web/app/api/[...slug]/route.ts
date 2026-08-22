import { NextResponse } from 'next/server';
import { store } from '../data-store';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.filter((s) => s !== 'v1').join('/');
  const url = new URL(req.url);

  if (path === 'auth/me') {
    return NextResponse.json({ user: store.user, organizations: store.orgs });
  }

  if (path === 'customers') {
    return NextResponse.json(store.customers);
  }

  if (path === 'products') {
    return NextResponse.json(store.products);
  }

  if (path === 'products/categories') {
    return NextResponse.json(store.categories);
  }

  if (path === 'quotes') {
    const list = store.quotes.map((q) => ({
      ...q,
      customer: store.customers.find((c) => c.id === q.customerId),
    }));
    return NextResponse.json(list);
  }

  if (path === 'invoices') {
    const list = store.invoices.map((inv) => ({
      ...inv,
      customer: store.customers.find((c) => c.id === inv.customerId),
    }));
    return NextResponse.json(list);
  }

  if (path === 'payments') {
    const list = store.payments.map((p) => ({
      ...p,
      invoice: store.invoices.find((i) => i.id === p.invoiceId),
    }));
    return NextResponse.json(list);
  }

  if (path === 'expenses') {
    return NextResponse.json(store.expenses);
  }

  if (path === 'suppliers') {
    return NextResponse.json(store.suppliers);
  }

  if (path === 'projects') {
    const list = store.projects.map((p) => ({
      ...p,
      customer: store.customers.find((c) => c.id === p.customerId),
    }));
    return NextResponse.json(list);
  }

  if (path === 'tasks') {
    return NextResponse.json(store.tasks);
  }

  if (path === 'inventory/warehouses') {
    return NextResponse.json(store.warehouses);
  }

  if (path === 'inventory/stock') {
    return NextResponse.json(
      store.products.map((p) => ({
        product: p,
        stock: p.stock,
        warehouse: store.warehouses[0],
      }))
    );
  }

  if (path === 'inventory/movements') {
    return NextResponse.json([
      { id: 'm1', type: 'RECEIPT', quantity: 5, occurredAt: '2026-08-01', product: store.products[2], warehouse: store.warehouses[0] },
      { id: 'm2', type: 'SALE_ISSUE', quantity: 1, occurredAt: '2026-08-12', product: store.products[2], warehouse: store.warehouses[0] },
    ]);
  }

  if (path === 'documents') {
    const q = url.searchParams.get('search')?.toLowerCase();
    const cat = url.searchParams.get('category');
    let items = store.documents;
    if (q) items = items.filter((d) => d.name.toLowerCase().includes(q));
    if (cat) items = items.filter((d) => d.category === cat);
    return NextResponse.json({ items });
  }

  if (path.startsWith('documents/') && path.endsWith('/download')) {
    return new NextResponse('PDF_DUMMY_CONTENT_SAHLBIZ_DOC', {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  }

  if (path === 'search') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const items: any[] = [];
    store.customers.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.ice?.includes(q)) {
        items.push({ id: c.id, type: 'customer', title: c.name, subtitle: `ICE: ${c.ice || 'N/A'} · ${c.phone || ''}`, href: '/customers' });
      }
    });
    store.products.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) {
        items.push({ id: p.id, type: 'product', title: p.name, subtitle: `${p.sku} · ${p.sellingPrice} MAD`, href: '/products' });
      }
    });
    store.quotes.forEach((qu) => {
      if (qu.number.toLowerCase().includes(q)) {
        items.push({ id: qu.id, type: 'quote', title: qu.number, subtitle: `${qu.total.toLocaleString()} MAD · ${qu.status}`, href: '/quotes' });
      }
    });
    store.invoices.forEach((inv) => {
      if (inv.number.toLowerCase().includes(q)) {
        items.push({ id: inv.id, type: 'invoice', title: inv.number, subtitle: `${inv.total.toLocaleString()} MAD · ${inv.status}`, href: '/invoices' });
      }
    });
    store.projects.forEach((prj) => {
      if (prj.name.toLowerCase().includes(q)) {
        items.push({ id: prj.id, type: 'project', title: prj.name, subtitle: `${prj.budget.toLocaleString()} MAD · ${prj.status}`, href: '/projects' });
      }
    });
    return NextResponse.json({ items, total: items.length });
  }

  if (path === 'analytics/executive' || path.startsWith('analytics/executive')) {
    return NextResponse.json({
      kpis: {
        revenue: 124850,
        profit: 78570,
        receivables: 33600,
        payments: 183420,
        expenses: 46280,
        stockValue: 95400,
      },
    });
  }

  if (path === 'analytics/sales' || path.startsWith('analytics/sales')) {
    return NextResponse.json({
      topCustomers: [
        { name: 'Maroc Telecom Technologies', value: 90000 },
        { name: 'Atlas Services SARL', value: 33600 },
        { name: 'Riad & Spa Marrakech', value: 19200 },
      ],
      topProducts: [
        { name: 'Serveur Cloud & Infogérance Pro', value: 45000 },
        { name: 'Audit de Sécurité & Infrastructure', value: 35000 },
        { name: 'Licence Suite Logicielle Entreprise', value: 28000 },
        { name: 'Accompagnement & Support Dédié', value: 16850 },
      ],
    });
  }

  if (path === 'analytics/operations' || path.startsWith('analytics/operations')) {
    return NextResponse.json({
      supplierCount: store.suppliers.length,
      openTasks: store.tasks.filter((t) => t.status !== 'DONE').length,
      lowStock: store.products.filter((p) => (p.stock || 0) <= (p.minimumStock || 0)).map((p) => ({
        name: p.name,
        stock: p.stock,
        minimum: p.minimumStock,
      })),
      projectMargins: store.projects.map((p: any) => ({
        name: p.name,
        margin: ((p.revenue || p.budget || 0) as number) - ((p.actualCost || 0) as number),
        taskCompletion: ((p.progress || 50) as number) / 100,
      })),
    });
  }

  if (path === 'ai/insights') {
    return NextResponse.json({
      insights: [
        {
          id: 'ins_1',
          type: 'CASHFLOW',
          priority: 'high',
          title: 'Facture en attente de règlement',
          message: 'La facture FAC-2026-0102 pour Atlas Services SARL (33 600 MAD) arrive à échéance le 25/08.',
          entityType: 'INVOICE',
        },
        {
          id: 'ins_2',
          type: 'TAX',
          priority: 'normal',
          title: 'Déclaration TVA mensuelle',
          message: 'Votre solde de TVA estimé à reverser pour la période s’élève à 18 400 MAD.',
          entityType: 'VAT',
        },
        {
          id: 'ins_3',
          type: 'STOCK',
          priority: 'normal',
          title: 'Niveau de stock optimal',
          message: 'Tous vos articles en inventaire respectent le seuil de réapprovisionnement minimal.',
          entityType: 'PRODUCT',
        },
      ],
    });
  }

  if (path === 'finance/cashflow-forecast' || path.startsWith('finance/cashflow-forecast')) {
    return NextResponse.json({
      currentBalance: 183420,
      expectedIncoming: 33600,
      expectedOutgoing: 18500,
      projectedBalance: 198520,
      daily: [
        { date: '2026-08-20', incoming: 0, outgoing: 2500, projectedBalance: 180920 },
        { date: '2026-08-22', incoming: 12000, outgoing: 0, projectedBalance: 192920 },
        { date: '2026-08-25', incoming: 21600, outgoing: 16000, projectedBalance: 198520 },
      ],
    });
  }

  if (path === 'finance/pnl') {
    return NextResponse.json({
      revenue: 124850,
      expenses: 46280,
      profit: 78570,
    });
  }

  if (path === 'finance/cash-position') {
    return NextResponse.json({
      total: 183420,
      accounts: [
        { id: 'ca1', name: 'Banque Attijariwafa MAD', balance: 145000 },
        { id: 'ca2', name: 'Caisse Principale MAD', balance: 38420 },
      ],
    });
  }

  if (path === 'finance/trial-balance') {
    return NextResponse.json([
      { code: '5141', name: 'Banque Attijariwafa', balance: 145000 },
      { code: '5161', name: 'Caisse Centrale', balance: 38420 },
      { code: '3421', name: 'Clients (Créances)', balance: 33600 },
      { code: '4411', name: 'Fournisseurs (Dettes)', balance: 18500 },
      { code: '4455', name: 'État TVA facturée', balance: 20600 },
      { code: '3455', name: 'État TVA récupérable', balance: 2200 },
      { code: '7111', name: 'Ventes de marchandises', balance: 124850 },
      { code: '6111', name: 'Achats consommés', balance: 46280 },
    ]);
  }

  if (path === 'finance/cash-accounts') {
    return NextResponse.json([
      { id: 'ca1', name: 'Banque Attijariwafa MAD', balance: 145000 },
      { id: 'ca2', name: 'Caisse Principale MAD', balance: 38420 },
    ]);
  }

  if (path === 'finance/reconciliation/lines' || path.startsWith('finance/reconciliation/lines')) {
    return NextResponse.json([
      { id: 'rl1', transactionDate: '2026-08-15', description: 'Virement client Maroc Telecom', amount: 90000, direction: 'CREDIT', status: 'MATCHED' },
      { id: 'rl2', transactionDate: '2026-08-14', description: 'Prélèvement Télécom Orange', amount: 1450, direction: 'DEBIT', status: 'MATCHED' },
      { id: 'rl3', transactionDate: '2026-08-10', description: 'Achat consommables bureau', amount: 820, direction: 'DEBIT', status: 'MATCHED' },
    ]);
  }

  if (path === 'finance/vat-report') {
    return NextResponse.json({
      collected: 20600,
      deductible: 2200,
      net: 18400,
      position: 'PAYABLE',
    });
  }

  if (path === 'suppliers/balances') {
    return NextResponse.json([
      { supplierId: 'sup1', supplierName: 'Fournisseur IT Grossiste Maroc', balance: 18500 },
    ]);
  }

  if (path === 'automation/notifications' || path === 'notifications') {
    return NextResponse.json([
      { id: 'notif_1', title: 'Facture en attente', message: 'Atlas Services SARL a une facture de 33 600 MAD arrivant à échéance sous 3 jours.', createdAt: new Date().toISOString(), readAt: null },
      { id: 'notif_2', title: 'Déclaration TVA prête', message: 'La liasse préparatoire pour la TVA du mois est prête à être vérifiée.', createdAt: new Date(Date.now() - 86400000).toISOString(), readAt: new Date().toISOString() },
    ]);
  }

  if (path === 'finance' || path === 'finance/accounts') {
    return NextResponse.json([
      { id: 'acc1', code: '5141', name: 'Banque Attijariwafa', type: 'ASSET', balance: 145000 },
      { id: 'acc2', code: '5161', name: 'Caisse Centrale', type: 'ASSET', balance: 38420 },
      { id: 'acc3', code: '3421', name: 'Clients et comptes rattachés', type: 'ASSET', balance: 33600 },
      { id: 'acc4', code: '4411', name: 'Fournisseurs', type: 'LIABILITY', balance: 18500 },
      { id: 'acc5', code: '4455', name: 'État, TVA facturée (collectée)', type: 'LIABILITY', balance: 20600 },
      { id: 'acc6', code: '3455', name: 'État, TVA récupérable (déductible)', type: 'ASSET', balance: 2200 },
      { id: 'acc7', code: '7111', name: 'Ventes de marchandises au Maroc', type: 'REVENUE', balance: 124850 },
      { id: 'acc8', code: '6111', name: 'Achats de marchandises', type: 'EXPENSE', balance: 46280 },
    ]);
  }

  if (path === 'finance/vat') {
    return NextResponse.json({
      collectedVat: 20600,
      deductibleVat: 2200,
      dueVat: 18400,
      period: 'Juillet 2026',
      deadline: '2026-08-20',
      ratesBreakdown: [
        { rate: 20, base: 103000, vat: 20600 },
        { rate: 14, base: 0, vat: 0 },
        { rate: 10, base: 0, vat: 0 },
        { rate: 7, base: 0, vat: 0 },
      ],
    });
  }

  if (path === 'finance/reconciliation') {
    return NextResponse.json({
      cashAccounts: [
        { id: 'ca1', name: 'Attijariwafa Bank MAD', balance: 145000, bankBalance: 145000, diff: 0 },
        { id: 'ca2', name: 'Banque Populaire Entreprises', balance: 25000, bankBalance: 25000, diff: 0 },
      ],
      unmatchedLines: [],
    });
  }

  if (path === 'cashflow') {
    return NextResponse.json({
      currentBalance: 183420,
      projectedInflow: 75600,
      projectedOutflow: 32400,
      projectedEndBalance: 226620,
      history: [
        { date: '01/08', solde: 142000 },
        { date: '05/08', solde: 138000 },
        { date: '10/08', solde: 165000 },
        { date: '15/08', solde: 183420 },
      ],
      forecast: [
        { date: '20/08', solde: 165020 },
        { date: '25/08', solde: 198620 },
        { date: '31/08', solde: 226620 },
      ],
    });
  }

  if (path === 'notifications') {
    return NextResponse.json(store.notifications);
  }

  if (path === 'reports' || path.startsWith('reports/')) {
    return NextResponse.json({
      revenueMonthly: [
        { month: 'Jan', revenue: 62000, expenses: 38000, profit: 24000 },
        { month: 'Fév', revenue: 78000, expenses: 42000, profit: 36000 },
        { month: 'Mar', revenue: 69000, expenses: 39000, profit: 30000 },
        { month: 'Avr', revenue: 91000, expenses: 45000, profit: 46000 },
        { month: 'Mai', revenue: 98000, expenses: 43000, profit: 55000 },
        { month: 'Juin', revenue: 124850, expenses: 46280, profit: 78570 },
      ],
      topClients: [
        { name: 'Maroc Telecom Technologies', total: 90000 },
        { name: 'Atlas Services SARL', total: 42000 },
        { name: 'Riad & Spa Marrakech', total: 19200 },
      ],
    });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.filter((s) => s !== 'v1').join('/');

  let body: any = {};
  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries());
    }
  } catch {}

  if (path === 'auth/login' || path === 'auth/register') {
    return NextResponse.json({ user: store.user, organizations: store.orgs });
  }

  if (path === 'customers') {
    const newCustomer: any = {
      id: `c${Date.now()}`,
      name: body.name || 'Nouveau client',
      type: body.type || 'COMPANY',
      ice: body.ice,
      phone: body.phone,
      email: body.email,
      createdAt: new Date().toISOString().split('T')[0],
    };
    store.customers.unshift(newCustomer);
    return NextResponse.json(newCustomer);
  }

  if (path === 'products') {
    const newProd: any = {
      id: `p${Date.now()}`,
      sku: body.sku || `SKU-${Date.now()}`,
      name: body.name || 'Nouveau Produit',
      type: body.type || 'PRODUCT',
      purchasePrice: Number(body.purchasePrice || 0),
      sellingPrice: Number(body.sellingPrice || 0),
      taxRate: Number(body.taxRate || 20),
      unit: body.unit || 'unité',
      stock: Number(body.stock || 0),
      minimumStock: Number(body.minimumStock || 0),
      active: true,
      category: store.categories[0] || { id: 'cat1', name: 'Général' },
    };
    store.products.unshift(newProd);
    return NextResponse.json(newProd);
  }

  if (path === 'quotes') {
    const num = `DEV-2026-${String(store.quotes.length + 44).padStart(4, '0')}`;
    const newQuote: any = {
      id: `q${Date.now()}`,
      number: num,
      customerId: body.customerId || store.customers[0]?.id,
      subtotal: Number(body.subtotal || 10000),
      discount: Number(body.discount || 0),
      tax: Number(body.tax || 2000),
      total: Number(body.total || 12000),
      status: 'DRAFT',
      issuedAt: body.issuedAt || new Date().toISOString().split('T')[0],
      validUntil: body.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: body.items || [],
    };
    store.quotes.unshift(newQuote);
    return NextResponse.json(newQuote);
  }

  if (path.startsWith('quotes/') && path.endsWith('/send')) {
    const qId = path.split('/')[1];
    const q = store.quotes.find((x) => x.id === qId);
    if (q) q.status = 'SENT';
    return NextResponse.json({ ok: true });
  }

  if (path.startsWith('quotes/') && path.endsWith('/convert')) {
    const qId = path.split('/')[1];
    const q = store.quotes.find((x) => x.id === qId);
    if (q) {
      q.status = 'CONVERTED';
      const newInv: any = {
        id: `inv${Date.now()}`,
        number: `FAC-2026-${String(store.invoices.length + 103).padStart(4, '0')}`,
        customerId: q.customerId,
        subtotal: q.subtotal,
        discount: q.discount,
        tax: q.tax,
        total: q.total,
        status: 'SENT',
        issuedAt: new Date().toISOString().split('T')[0],
        dueAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        items: q.items,
      };
      store.invoices.unshift(newInv);
    }
    return NextResponse.json({ ok: true });
  }

  if (path === 'invoices') {
    const num = `FAC-2026-${String(store.invoices.length + 103).padStart(4, '0')}`;
    const newInv: any = {
      id: `inv${Date.now()}`,
      number: num,
      customerId: body.customerId || store.customers[0]?.id,
      subtotal: Number(body.subtotal || 10000),
      discount: Number(body.discount || 0),
      tax: Number(body.tax || 2000),
      total: Number(body.total || 12000),
      status: 'SENT',
      issuedAt: body.issuedAt || new Date().toISOString().split('T')[0],
      dueAt: body.dueAt || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: body.items || [],
    };
    store.invoices.unshift(newInv);
    return NextResponse.json(newInv);
  }

  if (path === 'payments') {
    const newPay: any = {
      id: `pay${Date.now()}`,
      invoiceId: body.invoiceId,
      amount: Number(body.amount || 0),
      paidAt: body.paidAt || new Date().toISOString().split('T')[0],
      method: body.method || 'VIREMENT',
      reference: body.reference || `REF-${Date.now()}`,
    };
    store.payments.unshift(newPay);
    const targetInv = store.invoices.find((i) => i.id === body.invoiceId);
    if (targetInv) targetInv.status = 'PAID';
    return NextResponse.json(newPay);
  }

  if (path === 'expenses') {
    const newExp: any = {
      id: `exp${Date.now()}`,
      category: body.category || 'AUTRE',
      amount: Number(body.amount || 0),
      taxRate: Number(body.taxRate || 20),
      taxAmount: Number(body.taxAmount || 0),
      netAmount: Number(body.netAmount || 0),
      incurredAt: body.incurredAt || new Date().toISOString().split('T')[0],
      description: body.description || '',
      status: 'SUBMITTED',
      paymentMethod: body.paymentMethod || 'BANK',
    };
    store.expenses.unshift(newExp);
    return NextResponse.json(newExp);
  }

  if (path === 'suppliers') {
    const newSup: any = {
      id: `sup${Date.now()}`,
      name: body.name || 'Nouveau Fournisseur',
      ice: body.ice,
      phone: body.phone,
      email: body.email,
      paymentTermsDays: Number(body.paymentTermsDays || 30),
    };
    store.suppliers.unshift(newSup);
    return NextResponse.json(newSup);
  }

  if (path === 'projects') {
    const newPrj: any = {
      id: `prj${Date.now()}`,
      name: body.name || 'Nouveau Projet',
      customerId: body.customerId,
      budget: Number(body.budget || 50000),
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };
    store.projects.unshift(newPrj);
    return NextResponse.json(newPrj);
  }

  if (path === 'tasks') {
    const newTsk: any = {
      id: `tsk${Date.now()}`,
      title: body.title || 'Nouvelle tâche',
      projectId: body.projectId,
      status: 'TODO',
      dueAt: body.dueAt,
    };
    store.tasks.unshift(newTsk);
    return NextResponse.json(newTsk);
  }

  if (path === 'documents') {
    const newDoc: any = {
      id: `doc${Date.now()}`,
      name: (body.file?.name as string) || `Document_${Date.now()}.pdf`,
      category: body.category || 'OTHER',
      mimeType: (body.file?.type as string) || 'application/pdf',
      sizeBytes: 1500000,
      currentVersion: 1,
      expiresAt: body.expiresAt,
      createdAt: new Date().toISOString(),
      tags: [],
    };
    store.documents.unshift(newDoc);
    return NextResponse.json(newDoc);
  }

  if (path.startsWith('documents/') && path.endsWith('/versions')) {
    return NextResponse.json({ ok: true });
  }

  if (path.startsWith('expenses/') && path.endsWith('/approve')) {
    const id = path.split('/')[1];
    const exp = store.expenses.find((x) => x.id === id);
    if (exp) exp.status = 'APPROVED';
    return NextResponse.json({ ok: true, expense: exp });
  }

  if (path.startsWith('expenses/') && path.endsWith('/reject')) {
    const id = path.split('/')[1];
    const exp = store.expenses.find((x) => x.id === id);
    if (exp) exp.status = 'REJECTED';
    return NextResponse.json({ ok: true, expense: exp });
  }

  if (path.startsWith('expenses/') && path.endsWith('/pay')) {
    const id = path.split('/')[1];
    const exp = store.expenses.find((x) => x.id === id);
    if (exp) exp.status = 'PAID';
    return NextResponse.json({ ok: true, expense: exp });
  }

  if (path.startsWith('automation/notifications/') && path.endsWith('/read')) {
    const id = path.split('/')[2];
    const n = store.notifications.find((x) => x.id === id);
    if (n) n.readAt = new Date().toISOString();
    return NextResponse.json({ ok: true });
  }

  if (path.startsWith('ai/insights/') && path.endsWith('/dismiss')) {
    return NextResponse.json({ ok: true });
  }

  if (path === 'ai/ask' || path === 'ai/chat') {
    const prompt = (body.question || body.prompt || body.message || '').toLowerCase();
    let reply = "En tant qu'assistant intelligent SahlBiz adapté aux entreprises au Maroc, je suis à votre disposition pour analyser vos données d'activité, votre trésorerie et vos obligations fiscales.";
    if (prompt.includes('tresorerie') || prompt.includes('solde') || prompt.includes('cash')) {
      reply = "Votre trésorerie totale disponible s'élève à 183 420 MAD (145 000 MAD chez Attijariwafa Bank et 38 420 MAD en Caisse). Vos prévisions à 30 jours projettent un solde de 198 520 MAD.";
    } else if (prompt.includes('tva') || prompt.includes('impot') || prompt.includes('fiscal')) {
      reply = "Sur la période en cours, votre TVA collectée est de 20 600 MAD et votre TVA déductible de 2 200 MAD, soit une position nette à reverser de 18 400 MAD avant la date limite légale.";
    } else if (prompt.includes('impaye') || prompt.includes('facture') || prompt.includes('relance') || prompt.includes('client')) {
      reply = "La facture FAC-2026-0102 émise à l'attention d'Atlas Services SARL pour un montant de 33 600 MAD arrive à échéance le 25 août. Il est recommandé de programmer un rappel client.";
    } else if (prompt.includes('chiffre') || prompt.includes('ca') || prompt.includes('vente') || prompt.includes('resultat')) {
      reply = "Votre chiffre d'affaires cumulé atteint 124 850 MAD avec des charges de 46 280 MAD, générant un résultat net estimé à 78 570 MAD (marge nette de 62.9%).";
    }
    return NextResponse.json({ reply, message: reply, answer: reply });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.filter((s) => s !== 'v1').join('/');
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  if (path.startsWith('tasks/')) {
    const id = path.split('/')[1];
    const task = store.tasks.find((t) => t.id === id);
    if (task) {
      if (body.status) task.status = body.status;
      if (body.title) task.title = body.title;
    }
    return NextResponse.json(task || { ok: true });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.filter((s) => s !== 'v1').join('/');

  if (path.startsWith('customers/')) {
    const id = path.split('/')[1];
    const idx = store.customers.findIndex((c) => c.id === id);
    if (idx !== -1) store.customers.splice(idx, 1);
  } else if (path.startsWith('documents/')) {
    const id = path.split('/')[1];
    const idx = store.documents.findIndex((d) => d.id === id);
    if (idx !== -1) store.documents.splice(idx, 1);
  }

  return NextResponse.json({ ok: true });
}
