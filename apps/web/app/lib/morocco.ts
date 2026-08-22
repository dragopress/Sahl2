// Moroccan Business, Tax, PCGM Accounting & Localization Core Engine

export const MOROCCAN_VAT_RATES = [
  { rate: 0, label: '0% - Exonéré (Export / Biens essentiels)', code: 'TVA_0' },
  { rate: 7, label: '7% - Eau, Électricité domestique, Fournitures', code: 'TVA_7' },
  { rate: 10, label: '10% - Banques, Hôtellerie, Gaz de pétrole', code: 'TVA_10' },
  { rate: 14, label: '14% - Transport de voyageurs & Électricité MT', code: 'TVA_14' },
  { rate: 20, label: '20% - Taux normal standard (Prestations & Ventes)', code: 'TVA_20' },
] as const;

export const CASH_PAYMENT_CEILING_MAD = 5000; // Article 193 CGI Maroc: Warning if cash > 5 000 MAD

export function formatMad(amount: number | null | undefined): string {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(val)
    .replace('MAD', '')
    .trim() + ' MAD';
}

export function formatMadShort(amount: number | null | undefined): string {
  const val = Number(amount) || 0;
  if (Math.abs(val) >= 1_000_000) {
    return (val / 1_000_000).toFixed(2).replace('.', ',') + ' M MAD';
  }
  if (Math.abs(val) >= 1_000) {
    return (val / 1_000).toFixed(1).replace('.', ',') + ' k MAD';
  }
  return formatMad(val);
}

/**
 * Validates a Moroccan ICE (Identifiant Commun de l'Entreprise) - 15 digits
 */
export function validateIce(ice: string | null | undefined): { isValid: boolean; message: string } {
  if (!ice || typeof ice !== 'string') {
    return { isValid: false, message: 'ICE requis pour la conformité fiscale DGI' };
  }
  const clean = ice.trim().replace(/\s+/g, '');
  if (!/^\d{15}$/.test(clean)) {
    return { isValid: false, message: `L'ICE doit comporter exactement 15 chiffres (actuel: ${clean.length})` };
  }
  return { isValid: true, message: 'ICE conforme (15 chiffres validés)' };
}

export const validateMoroccanIce = validateIce;

/**
 * Plan Comptable Général Marocain (PCGM) Standard Accounts
 */
export interface PCGMAccount {
  code: string;
  label: string;
  type: 'ASSET' | 'LIABILITY' | 'EXPENSE' | 'REVENUE' | 'EQUITY';
  classNum: number;
}

export const PCGM_CHART_OF_ACCOUNTS: Record<string, PCGMAccount> = {
  // Classe 3 : Comptes d'actif circulant
  '3421': { code: '3421', label: 'Clients', type: 'ASSET', classNum: 3 },
  '34551': { code: '34551', label: 'État, TVA Récupérable sur les charges', type: 'ASSET', classNum: 3 },
  '34552': { code: '34552', label: 'État, TVA Récupérable sur les immobilisations', type: 'ASSET', classNum: 3 },
  '3425': { code: '3425', label: 'Clients - Effets à recevoir', type: 'ASSET', classNum: 3 },
  
  // Classe 4 : Comptes de passif circulant
  '4411': { code: '4411', label: 'Fournisseurs', type: 'LIABILITY', classNum: 4 },
  '4455': { code: '4455', label: 'État, TVA Facturée / Collectée', type: 'LIABILITY', classNum: 4 },
  '4456': { code: '4456', label: 'État, TVA Due', type: 'LIABILITY', classNum: 4 },
  '4432': { code: '4432', label: 'Rémunérations dues au personnel', type: 'LIABILITY', classNum: 4 },
  '4441': { code: '4441', label: 'CNSS & Organismes sociaux', type: 'LIABILITY', classNum: 4 },

  // Classe 5 : Comptes de trésorerie
  '5141': { code: '5141', label: 'Banques (Comptes en MAD)', type: 'ASSET', classNum: 5 },
  '5161': { code: '5161', label: 'Caisses centrales (Espèces MAD)', type: 'ASSET', classNum: 5 },
  '5111': { code: '5111', label: 'Chèques à encaisser', type: 'ASSET', classNum: 5 },

  // Classe 6 : Comptes de charges (CPC)
  '6111': { code: '6111', label: 'Achats de marchandises revendues', type: 'EXPENSE', classNum: 6 },
  '6121': { code: '6121', label: 'Achats de matières premières', type: 'EXPENSE', classNum: 6 },
  '6131': { code: '6131', label: 'Locations et charges locatives', type: 'EXPENSE', classNum: 6 },
  '6133': { code: '6133', label: 'Entretien, réparations, eau & électricité', type: 'EXPENSE', classNum: 6 },
  '6136': { code: '6136', label: 'Rémunérations d’intermédiaires et honoraires', type: 'EXPENSE', classNum: 6 },
  '6142': { code: '6142', label: 'Transports et déplacements', type: 'EXPENSE', classNum: 6 },
  '6145': { code: '6145', label: 'Frais postaux et de télécommunications', type: 'EXPENSE', classNum: 6 },
  '6147': { code: '6147', label: 'Services bancaires et commissions', type: 'EXPENSE', classNum: 6 },
  '6171': { code: '6171', label: 'Rémunérations du personnel (Salaires bruts)', type: 'EXPENSE', classNum: 6 },
  '6174': { code: '6174', label: 'Charges sociales (Cotisations patronales CNSS/AMO)', type: 'EXPENSE', classNum: 6 },
  '6181': { code: '6181', label: 'Droits d’enregistrement et de timbre', type: 'EXPENSE', classNum: 6 },

  // Classe 7 : Comptes de produits (CPC)
  '7111': { code: '7111', label: 'Ventes de marchandises au Maroc', type: 'REVENUE', classNum: 7 },
  '7124': { code: '7124', label: 'Ventes de services et prestations fournies', type: 'REVENUE', classNum: 7 },
  '7121': { code: '7121', label: 'Ventes de biens produits au Maroc', type: 'REVENUE', classNum: 7 },
};

export interface PCGMJournalEntry {
  id: string;
  date: string;
  reference: string;
  label: string;
  journal: 'VENTES' | 'ACHATS' | 'BANQUE' | 'CAISSE' | 'OD';
  lines: {
    accountCode: string;
    accountLabel: string;
    debit: number;
    credit: number;
  }[];
  isBalanced: boolean;
}

/**
 * Helper to build balanced PCGM entries
 */
export function createSalesJournalEntry(params: {
  invoiceNumber: string;
  date: string;
  customerName: string;
  amountHt: number;
  vatAmount: number;
  amountTtc: number;
  paymentMode?: 'CASH' | 'BANK' | 'CREDIT';
}): PCGMJournalEntry {
  const isCash = params.paymentMode === 'CASH';
  const isBank = params.paymentMode === 'BANK';
  const debitAccount = isCash ? '5161' : isBank ? '5141' : '3421';

  return {
    id: `pcgm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: params.date,
    reference: params.invoiceNumber,
    label: `Facture Vente ${params.invoiceNumber} - ${params.customerName}`,
    journal: 'VENTES',
    lines: [
      {
        accountCode: debitAccount,
        accountLabel: PCGM_CHART_OF_ACCOUNTS[debitAccount]?.label || 'Clients / Trésorerie',
        debit: params.amountTtc,
        credit: 0,
      },
      {
        accountCode: '7111',
        accountLabel: '7111 - Ventes de marchandises / Prestations',
        debit: 0,
        credit: params.amountHt,
      },
      {
        accountCode: '4455',
        accountLabel: '4455 - État, TVA Facturée (Collectée)',
        debit: 0,
        credit: params.vatAmount,
      },
    ],
    isBalanced: Math.abs(params.amountTtc - (params.amountHt + params.vatAmount)) < 0.01,
  };
}

/**
 * WhatsApp Kreddy Reminder Templates for Moroccan Customers
 */
export function generateWhatsAppKreddyReminder(params: {
  customerName: string;
  customerPhone?: string;
  amountDue: number;
  companyName: string;
  invoiceNumbers?: string[];
  lang: 'darija' | 'fr' | 'ar';
}): { text: string; url: string } {
  const formattedAmount = formatMad(params.amountDue);
  const invRef = params.invoiceNumbers?.length ? ` (Réf: ${params.invoiceNumbers.join(', ')})` : '';
  let text = '';

  if (params.lang === 'darija') {
    text = `Salam ${params.customerName},\n\nKanfakkrok b l-hssab li baqi l-sharika ${params.companyName} b qimat *${formattedAmount}*${invRef}.\n\nLah yjazik bikhir ila kan moumkin taswiyat l-wad3iya f a9rab waqt.\n\nChoukran bzaf l-ta3awon dyalkom! 🙏`;
  } else if (params.lang === 'ar') {
    text = `السلام عليكم ${params.customerName}،\n\nنود تذكيركم بالمبلغ المتبقي بذمتكم لصالح شركة ${params.companyName} وقدره *${formattedAmount}*${invRef}.\n\nنرجو منكم التكرم بتسوية الوضعية في أقرب الآجال.\n\nتقبلوا فائق التقدير والاحترام.`;
  } else {
    text = `Bonjour ${params.customerName},\n\nNous vous rappelons que le solde restant dû pour ${params.companyName} s'élève à *${formattedAmount}*${invRef}.\n\nMerci de bien vouloir procéder à la régularisation de votre compte dès que possible.\n\nCordialement,\nService Comptabilité - ${params.companyName}`;
  }

  const cleanPhone = (params.customerPhone || '').replace(/[^0-9]/g, '');
  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

  return { text, url };
}
