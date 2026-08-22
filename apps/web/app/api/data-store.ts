// Central in-memory store for SahlBiz demo data
export interface Customer {
  id: string;
  name: string;
  type: 'COMPANY' | 'INDIVIDUAL';
  ice?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  type: 'PRODUCT' | 'SERVICE';
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
  unit: string;
  stock: number;
  minimumStock: number;
  active: boolean;
  category?: { id: string; name: string };
}

export interface Quote {
  id: string;
  number: string;
  customerId: string;
  customer?: Customer;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED';
  issuedAt: string;
  validUntil: string;
  notes?: string;
  items: any[];
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customer?: Customer;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
  issuedAt: string;
  dueAt: string;
  notes?: string;
  items: any[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  paidAt: string;
  method: string;
  reference: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  netAmount: number;
  incurredAt: string;
  description: string;
  status: 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED';
  paymentMethod: string;
}

export interface Supplier {
  id: string;
  name: string;
  ice?: string;
  phone?: string;
  email?: string;
  paymentTermsDays: number;
}

export interface Project {
  id: string;
  name: string;
  customerId?: string;
  customer?: Customer;
  budget: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueAt?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  mimeType: string;
  sizeBytes: number;
  currentVersion: number;
  expiresAt?: string;
  tags?: { id: string; name: string }[];
  createdAt: string;
}

export interface DataStore {
  orgs: any[];
  user: { id: string; name: string; email: string };
  customers: Customer[];
  categories: { id: string; name: string }[];
  products: Product[];
  quotes: Quote[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  suppliers: Supplier[];
  projects: Project[];
  tasks: Task[];
  warehouses: any[];
  documents: DocumentItem[];
  notifications: any[];
}

// Initial Moroccan SME seed data
export const store: DataStore = {
  orgs: [
    {
      organizationId: 'org-demo-1',
      organization: {
        id: 'org-demo-1',
        name: 'SahlBiz Casablanca SARL',
        slug: 'demo',
        ice: '001234567890123',
      },
      role: 'OWNER',
    },
  ],
  user: {
    id: 'user-demo-1',
    name: 'Karim Bennani',
    email: 'admin@sahlbiz.ma',
  },
  customers: [
    { id: 'c1', name: 'Atlas Services SARL', type: 'COMPANY' as const, ice: '002345678901234', phone: '+212 522 12 34 56', email: 'contact@atlasservices.ma', createdAt: '2026-08-01' },
    { id: 'c2', name: 'Maroc Telecom Technologies', type: 'COMPANY' as const, ice: '003456789012345', phone: '+212 537 98 76 54', email: 'achats@mtt.ma', createdAt: '2026-08-05' },
    { id: 'c3', name: 'Riad & Spa Marrakech', type: 'COMPANY' as const, ice: '004567890123456', phone: '+212 524 44 55 66', email: 'finance@riadmarrakech.ma', createdAt: '2026-08-10' },
    { id: 'c4', name: 'Youssef El Amrani', type: 'INDIVIDUAL' as const, phone: '+212 661 22 33 44', email: 'youssef.amrani@gmail.com', createdAt: '2026-08-12' },
  ],
  categories: [
    { id: 'cat1', name: 'Prestations de Services & Conseil' },
    { id: 'cat2', name: 'Matériel Informatique & Réseau' },
    { id: 'cat3', name: 'Licences & Abonnements SaaS' },
  ],
  products: [
    { id: 'p1', sku: 'SRV-DEV-01', name: 'Développement Web & Mobile sur mesure', type: 'SERVICE' as const, purchasePrice: 0, sellingPrice: 4500, taxRate: 20, unit: 'jour/h', stock: 100, minimumStock: 10, active: true, category: { id: 'cat1', name: 'Prestations de Services & Conseil' } },
    { id: 'p2', sku: 'SRV-CONS-02', name: 'Conseil & Audit Fiscal Marocain', type: 'SERVICE' as const, purchasePrice: 0, sellingPrice: 6000, taxRate: 20, unit: 'jour/h', stock: 50, minimumStock: 5, active: true, category: { id: 'cat1', name: 'Prestations de Services & Conseil' } },
    { id: 'p3', sku: 'MAT-SRV-10', name: 'Serveur Tour Dell PowerEdge T150', type: 'PRODUCT' as const, purchasePrice: 11000, sellingPrice: 16500, taxRate: 20, unit: 'unité', stock: 4, minimumStock: 2, active: true, category: { id: 'cat2', name: 'Matériel Informatique & Réseau' } },
    { id: 'p4', sku: 'LIC-SAAS-12', name: 'Abonnement Annuel Plateforme Cloud B2B', type: 'SERVICE' as const, purchasePrice: 1200, sellingPrice: 2400, taxRate: 20, unit: 'an', stock: 999, minimumStock: 0, active: true, category: { id: 'cat3', name: 'Licences & Abonnements SaaS' } },
  ],
  quotes: [
    {
      id: 'q1',
      number: 'DEV-2026-0042',
      customerId: 'c1',
      subtotal: 35000,
      discount: 0,
      tax: 7000,
      total: 42000,
      status: 'SENT' as const,
      issuedAt: '2026-08-10',
      validUntil: '2026-09-10',
      notes: 'Modalités : 40% à la commande, solde à la livraison.',
      items: [
        { id: 'qi1', description: 'Développement module CRM sur-mesure', quantity: 6, unitPrice: 4500, taxRate: 20, lineSubtotal: 27000, lineTax: 5400, lineTotal: 32400 },
        { id: 'qi2', description: 'Formation et accompagnement équipe (2 sessions)', quantity: 2, unitPrice: 4000, taxRate: 20, lineSubtotal: 8000, lineTax: 1600, lineTotal: 9600 },
      ],
    },
    {
      id: 'q2',
      number: 'DEV-2026-0043',
      customerId: 'c3',
      subtotal: 16500,
      discount: 500,
      tax: 3200,
      total: 19200,
      status: 'ACCEPTED' as const,
      issuedAt: '2026-08-12',
      validUntil: '2026-09-12',
      notes: 'Installation comprise.',
      items: [
        { id: 'qi3', description: 'Serveur Tour Dell PowerEdge T150', quantity: 1, unitPrice: 16500, taxRate: 20, lineSubtotal: 16500, lineTax: 3300, lineTotal: 19800 },
      ],
    },
  ],
  invoices: [
    {
      id: 'inv1',
      number: 'FAC-2026-0101',
      customerId: 'c2',
      subtotal: 75000,
      discount: 0,
      tax: 15000,
      total: 90000,
      status: 'PAID' as const,
      issuedAt: '2026-08-01',
      dueAt: '2026-08-31',
      notes: 'Règlement par virement bancaire Attijariwafa.',
      items: [
        { id: 'ii1', description: 'Prestation d’ingénierie et architecture Cloud (Mois de Juillet)', quantity: 1, unitPrice: 75000, taxRate: 20, lineSubtotal: 75000, lineTax: 15000, lineTotal: 90000 },
      ],
    },
    {
      id: 'inv2',
      number: 'FAC-2026-0102',
      customerId: 'c1',
      subtotal: 28000,
      discount: 0,
      tax: 5600,
      total: 33600,
      status: 'SENT' as const,
      issuedAt: '2026-08-05',
      dueAt: '2026-08-25',
      notes: 'Échéance à 20 jours.',
      items: [
        { id: 'ii2', description: 'Audit cybersécurité et infrastructure réseau', quantity: 1, unitPrice: 28000, taxRate: 20, lineSubtotal: 28000, lineTax: 5600, lineTotal: 33600 },
      ],
    },
  ],
  payments: [
    { id: 'pay1', invoiceId: 'inv1', amount: 90000, paidAt: '2026-08-14', method: 'VIREMENT', reference: 'VIR-ATT-8839201' },
  ],
  expenses: [
    { id: 'exp1', category: 'LOYER', amount: 12000, taxRate: 0, taxAmount: 0, netAmount: 12000, incurredAt: '2026-08-01', description: 'Loyer bureaux Twin Center Casablanca', status: 'PAID' as const, paymentMethod: 'BANK' },
    { id: 'exp2', category: 'CLOUD_IT', amount: 4800, taxRate: 20, taxAmount: 800, netAmount: 4000, incurredAt: '2026-08-03', description: 'Serveurs Cloud AWS & Domaines', status: 'PAID' as const, paymentMethod: 'CARD' },
    { id: 'exp3', category: 'HONORAIRES', amount: 8400, taxRate: 20, taxAmount: 1400, netAmount: 7000, incurredAt: '2026-08-08', description: 'Honoraires Expert-Comptable T3', status: 'APPROVED' as const, paymentMethod: 'BANK' },
  ],
  suppliers: [
    { id: 'sup1', name: 'Dell Technologies Maroc', ice: '001928374650192', phone: '+212 522 99 88 77', email: 'sales@dell.ma', paymentTermsDays: 30 },
    { id: 'sup2', name: 'Maroc Telecom Entreprises', ice: '002837465019283', phone: '+212 537 77 66 55', email: 'pro@iam.ma', paymentTermsDays: 30 },
    { id: 'sup3', name: 'Cabinet Fiduciaire Al Maghrib', ice: '003746501928374', phone: '+212 522 33 44 55', email: 'contact@fiduciaire-casa.ma', paymentTermsDays: 15 },
  ],
  projects: [
    { id: 'prj1', name: 'Transformation Digitale Atlas', customerId: 'c1', budget: 150000, status: 'ACTIVE' as const, createdAt: '2026-07-15' },
    { id: 'prj2', name: 'Migration Infrastructure Cloud MTT', customerId: 'c2', budget: 280000, status: 'ACTIVE' as const, createdAt: '2026-08-01' },
    { id: 'prj3', name: 'Portail Réservations Riad', customerId: 'c3', budget: 65000, status: 'COMPLETED' as const, createdAt: '2026-06-01' },
  ],
  tasks: [
    { id: 'tsk1', title: 'Valider le cahier des charges avec Atlas Services', projectId: 'prj1', status: 'DONE' as const, dueAt: '2026-08-12' },
    { id: 'tsk2', title: 'Déployer les instances Kubernetes de production', projectId: 'prj2', status: 'IN_PROGRESS' as const, dueAt: '2026-08-25' },
    { id: 'tsk3', title: 'Déclaration TVA mensuelle Juillet', status: 'TODO' as const, dueAt: '2026-08-20' },
  ],
  warehouses: [
    { id: 'w1', name: 'Dépôt Principal Ain Sebaâ', code: 'DEP-CASA-01', active: true, isDefault: true },
    { id: 'w2', name: 'Stock Agence Rabat Agdal', code: 'DEP-RBT-02', active: true, isDefault: false },
  ],
  documents: [
    { id: 'doc1', name: 'Contrat_Cadre_Atlas_Services_2026.pdf', category: 'CONTRACT', mimeType: 'application/pdf', sizeBytes: 2450000, currentVersion: 1, expiresAt: '2027-08-01', createdAt: '2026-08-02T10:00:00Z', tags: [{ id: 't1', name: 'Atlas' }, { id: 't2', name: 'Contrat' }] },
    { id: 'doc2', name: 'Statuts_Societe_SahlBiz_Certifies.pdf', category: 'COMPANY', mimeType: 'application/pdf', sizeBytes: 5120000, currentVersion: 2, createdAt: '2026-01-15T09:00:00Z', tags: [{ id: 't3', name: 'Juridique' }] },
    { id: 'doc3', name: 'Attestation_Fiscale_Regularite_2026.pdf', category: 'RECEIPT', mimeType: 'application/pdf', sizeBytes: 1250000, currentVersion: 1, expiresAt: '2026-12-31', createdAt: '2026-08-05T14:30:00Z', tags: [{ id: 't4', name: 'DGI' }] },
  ],
  notifications: [
    { id: 'n1', type: 'OVERDUE_INVOICE', title: 'Facture en approche d’échéance', message: 'La facture FAC-2026-0102 pour Atlas Services (33 600 MAD) arrive à échéance le 25/08/2026.', readAt: null, createdAt: '2026-08-16T08:00:00Z' },
    { id: 'n2', type: 'LOW_STOCK', title: 'Alerte stock faible', message: 'Serveur Tour Dell PowerEdge T150 : 4 unités restantes au Dépôt Ain Sebaâ.', readAt: null, createdAt: '2026-08-15T11:20:00Z' },
    { id: 'n3', type: 'CASHFLOW_RISK', title: 'Déclaration TVA mensuelle', message: 'N’oubliez pas de télédéclarer votre TVA du mois précédent avant le 20/08/2026.', readAt: null, createdAt: '2026-08-14T09:00:00Z' },
  ],
};
