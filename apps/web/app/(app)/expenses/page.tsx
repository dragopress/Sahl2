'use client';
import React, { useState } from 'react';
import {
  Receipt,
  Scan,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Repeat,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { formatMad, PCGM_CHART_OF_ACCOUNTS } from '../../lib/morocco';

interface ExpenseItem {
  id: string;
  reference: string;
  category: string;
  pcgmAccount: string;
  supplierName: string;
  supplierIce?: string;
  amountHt: number;
  taxRate: number;
  amountTtc: number;
  date: string;
  description: string;
  status: 'DRAFT' | 'AUTO_APPROVED' | 'PENDING_MANAGER' | 'PENDING_DIRECTOR' | 'APPROVED' | 'PAID';
  isRecurring?: boolean;
  recurringFrequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  hasOcrAttachment?: boolean;
  approvalThresholdLabel: string;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    reference: 'DEP-2026-0182',
    category: 'Frais postaux & télécoms',
    pcgmAccount: '6145',
    supplierName: 'Maroc Telecom (IAM)',
    supplierIce: '001524385910293',
    amountHt: 750.0,
    taxRate: 20,
    amountTtc: 900.0,
    date: '2026-08-19',
    description: 'Abonnement Fibre Pro 100 Mbps & Lignes Mobiles',
    status: 'PAID',
    isRecurring: true,
    recurringFrequency: 'MONTHLY',
    hasOcrAttachment: true,
    approvalThresholdLabel: 'Auto-Approuvé (< 1 000 MAD)',
  },
  {
    id: 'exp-2',
    reference: 'DEP-2026-0183',
    category: 'Locations et charges locatives',
    pcgmAccount: '6131',
    supplierName: 'Foncière Anfa Office Park',
    supplierIce: '002918273645019',
    amountHt: 15000.0,
    taxRate: 20,
    amountTtc: 18000.0,
    date: '2026-08-01',
    description: 'Loyer Mensuel Bureaux Siège Casablanca',
    status: 'APPROVED',
    isRecurring: true,
    recurringFrequency: 'MONTHLY',
    hasOcrAttachment: true,
    approvalThresholdLabel: 'Approbation Admin (10k-50k MAD)',
  },
  {
    id: 'exp-3',
    reference: 'DEP-2026-0184',
    category: 'Honoraires et conseil',
    pcgmAccount: '6136',
    supplierName: 'Cabinet Fiduciaire Atlas Audit',
    supplierIce: '001827364591028',
    amountHt: 4500.0,
    taxRate: 20,
    amountTtc: 5400.0,
    date: '2026-08-15',
    description: 'Tenue comptable & Bilan semestriel',
    status: 'PENDING_MANAGER',
    isRecurring: true,
    recurringFrequency: 'MONTHLY',
    hasOcrAttachment: true,
    approvalThresholdLabel: 'Approbation Manager (1k-10k MAD)',
  },
  {
    id: 'exp-4',
    reference: 'DEP-2026-0185',
    category: 'Eau et électricité',
    pcgmAccount: '6133',
    supplierName: 'Lydec Casablanca',
    supplierIce: '001648291038472',
    amountHt: 1200.0,
    taxRate: 7,
    amountTtc: 1284.0,
    date: '2026-08-10',
    description: 'Facture Consommation Électricité Siège',
    status: 'PAID',
    isRecurring: true,
    recurringFrequency: 'MONTHLY',
    hasOcrAttachment: true,
    approvalThresholdLabel: 'Approbation Manager (1k-10k MAD)',
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [activeTab, setActiveTab] = useState<'LIST' | 'OCR' | 'RECURRING'>('LIST');
  const [search, setSearch] = useState('');
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  // New manual expense modal state
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [category, setCategory] = useState('Télécommunications');
  const [supplierName, setSupplierName] = useState('Maroc Telecom (IAM)');
  const [amountHt, setAmountHt] = useState<number>(850);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // PCGM journal entry viewer modal
  const [selectedJournalExpense, setSelectedJournalExpense] = useState<ExpenseItem | null>(null);

  function simulateOcrScan() {
    setOcrScanning(true);
    setOcrResult(null);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrResult({
        supplierName: 'Station Shell Oasis Casablanca',
        supplierIce: '001482910384756',
        date: '2026-08-22',
        invoiceNumber: 'SHELL-2026-8819',
        category: 'Transports et déplacements',
        pcgmAccount: '6142',
        amountHt: 416.67,
        taxRate: 20,
        taxAmount: 83.33,
        amountTtc: 500.0,
        confidence: '98.4%',
      });
    }, 1200);
  }

  function handleAddFromOcr() {
    if (!ocrResult) return;
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      reference: `DEP-2026-0${expenses.length + 186}`,
      category: ocrResult.category,
      pcgmAccount: ocrResult.pcgmAccount,
      supplierName: ocrResult.supplierName,
      supplierIce: ocrResult.supplierIce,
      amountHt: ocrResult.amountHt,
      taxRate: ocrResult.taxRate,
      amountTtc: ocrResult.amountTtc,
      date: ocrResult.date,
      description: `Ticket Carburant #${ocrResult.invoiceNumber}`,
      status: 'AUTO_APPROVED',
      isRecurring: false,
      hasOcrAttachment: true,
      approvalThresholdLabel: 'Auto-Approuvé (< 1 000 MAD)',
    };
    setExpenses([newExp, ...expenses]);
    setOcrResult(null);
    setActiveTab('LIST');
  }

  function handleCreateManualExpense() {
    const tva = amountHt * (taxRate / 100);
    const ttc = amountHt + tva;
    let status: ExpenseItem['status'] = 'AUTO_APPROVED';
    let label = 'Auto-Approuvé (< 1 000 MAD)';

    if (ttc >= 50000) {
      status = 'PENDING_DIRECTOR';
      label = 'Approbation Directeur (> 50k MAD)';
    } else if (ttc >= 10000) {
      status = 'PENDING_MANAGER';
      label = 'Approbation Admin (10k-50k MAD)';
    } else if (ttc >= 1000) {
      status = 'PENDING_MANAGER';
      label = 'Approbation Manager (1k-10k MAD)';
    }

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      reference: `DEP-2026-0${expenses.length + 186}`,
      category,
      pcgmAccount: category === 'Locations et charges locatives' ? '6131' : '6145',
      supplierName,
      amountHt,
      taxRate,
      amountTtc: ttc,
      date: new Date().toISOString().split('T')[0],
      description: description || `${category} - ${supplierName}`,
      status,
      isRecurring,
      approvalThresholdLabel: label,
    };

    setExpenses([newExp, ...expenses]);
    setNewModalOpen(false);
  }

  function handleApprove(id: string) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'APPROVED' } : e))
    );
  }

  function handlePay(id: string) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'PAID' } : e))
    );
  }

  const totalMonthlyExpenses = expenses.reduce((acc, e) => acc + e.amountTtc, 0);
  const totalDeductibleVat = expenses.reduce(
    (acc, e) => acc + (e.amountTtc - e.amountHt),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Receipt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dépenses, Charges &amp; Scanner OCR
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Seuils Hiérarchiques &amp; PCGM 61XX
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extraction OCR des factures fournisseurs, approbation multi-niveaux &amp; TVA déductible
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('OCR')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-500 transition-all"
          >
            <Scan size={15} />
            <span>Scanner un Reçu (OCR)</span>
          </button>
          <button
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all"
          >
            <Plus size={15} />
            <span>Nouvelle Dépense</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Dépenses TTC du Mois
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {formatMad(totalMonthlyExpenses)}
          </div>
          <div className="text-[10px] text-slate-400">Sur {expenses.length} justificatifs enregistrés</div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            TVA Déductible Récupérable (34551)
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {formatMad(totalDeductibleVat)}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">À imputer sur la déclaration DGI</div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
            En Attente d&apos;Approbation
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {formatMad(5400)}
          </div>
          <div className="text-[10px] text-amber-500 font-medium">1 dépense en attente Manager</div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        {[
          { id: 'LIST', label: 'Toutes les Dépenses' },
          { id: 'OCR', label: 'Scanner OCR Intelligent' },
          { id: 'RECURRING', label: 'Abonnements & Charges Récurrentes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Expense List */}
      {activeTab === 'LIST' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">Réf &amp; Date</th>
                  <th className="pb-3 px-2">Fournisseur &amp; Catégorie</th>
                  <th className="pb-3 px-2">Compte PCGM</th>
                  <th className="pb-3 px-2 text-right">Montant HT</th>
                  <th className="pb-3 px-2 text-right">Total TTC</th>
                  <th className="pb-3 px-2 text-center">Seuil &amp; Statut</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{exp.reference}</div>
                      <div className="text-[10px] text-slate-400">{exp.date}</div>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{exp.supplierName}</div>
                      <div className="text-[10px] text-slate-400">{exp.category}</div>
                    </td>
                    <td className="py-3.5 px-2">
                      <button
                        onClick={() => setSelectedJournalExpense(exp)}
                        className="font-mono font-bold text-[11px] text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded hover:bg-purple-500/20"
                      >
                        {exp.pcgmAccount}
                      </button>
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300">
                      {formatMad(exp.amountHt)}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      {formatMad(exp.amountTtc)}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            exp.status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : exp.status === 'APPROVED'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {exp.status === 'PAID'
                            ? 'Réglé'
                            : exp.status === 'APPROVED'
                            ? 'Approuvé'
                            : 'En Approbation'}
                        </span>
                        <div className="text-[9px] text-slate-400">{exp.approvalThresholdLabel}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {exp.status === 'PENDING_MANAGER' && (
                          <button
                            onClick={() => handleApprove(exp.id)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500"
                          >
                            Approuver
                          </button>
                        )}
                        {exp.status === 'APPROVED' && (
                          <button
                            onClick={() => handlePay(exp.id)}
                            className="px-2.5 py-1 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-bold hover:opacity-90"
                          >
                            Payer
                          </button>
                        )}
                        {exp.status === 'PAID' && (
                          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Comptabilisé
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Intelligent OCR Scanner */}
      {activeTab === 'OCR' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 mx-auto flex items-center justify-center">
              <Scan size={32} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Scanner OCR &amp; Rapprochement Automatique
            </h3>
            <p className="text-xs text-slate-400">
              Déposez votre facture fournisseur ou ticket de caisse marocain (JPG, PNG, PDF).
              L&apos;IA extrait automatiquement l&apos;ICE, le montant HT, le taux de TVA et propose le compte PCGM.
            </p>

            <div
              onClick={simulateOcrScan}
              className="border-2 border-dashed border-[var(--border)] hover:border-purple-500 rounded-3xl p-8 cursor-pointer transition-all bg-slate-50 dark:bg-slate-900/50 hover:bg-purple-500/5"
            >
              <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {ocrScanning ? 'Analyse OCR et vérification ICE DGI en cours…' : 'Cliquer pour charger ou tester un ticket exemple'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Reconnaissance automatique des mentions légales Maroc</div>
            </div>
          </div>

          {/* OCR Extraction Result */}
          {ocrResult && (
            <div className="max-w-xl mx-auto bg-slate-50 dark:bg-slate-900/80 p-5 rounded-3xl border border-[var(--border)] space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Données Extraites par OCR ({ocrResult.confidence})</h4>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded">
                  ICE Valide
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Fournisseur :</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{ocrResult.supplierName}</div>
                </div>
                <div>
                  <span className="text-slate-400">ICE :</span>
                  <div className="font-mono text-slate-800 dark:text-slate-200">{ocrResult.supplierIce}</div>
                </div>
                <div>
                  <span className="text-slate-400">Montant HT :</span>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatMad(ocrResult.amountHt)}</div>
                </div>
                <div>
                  <span className="text-slate-400">TVA ({ocrResult.taxRate}%) :</span>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatMad(ocrResult.taxAmount)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Total TTC :</span>
                  <div className="font-mono font-extrabold text-slate-900 dark:text-white">{formatMad(ocrResult.amountTtc)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Compte PCGM Proposé :</span>
                  <div className="font-mono font-bold text-purple-600">{ocrResult.pcgmAccount} (Transports)</div>
                </div>
              </div>

              <button
                onClick={handleAddFromOcr}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Check size={14} />
                <span>Valider et Enregistrer la Dépense</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Recurring Expenses Planner */}
      {activeTab === 'RECURRING' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Abonnements &amp; Charges Récurrentes Planifiées
            </h3>
            <p className="text-xs text-slate-400">
              Génération automatique des charges mensuelles (Loyers, Fibre, CNSS, Salaires)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expenses
              .filter((e) => e.isRecurring)
              .map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold text-[10px]">
                      <Repeat size={12} />
                      <span>{rec.recurringFrequency === 'MONTHLY' ? 'Mensuel' : 'Trimestriel'}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{rec.description}</div>
                    <div className="text-[10px] text-slate-400">{rec.supplierName} · Compte {rec.pcgmAccount}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                      {formatMad(rec.amountTtc)}
                    </div>
                    <div className="text-[10px] text-slate-400">Prochaine: 01/09/2026</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PCGM Journal Entry Viewer Modal */}
      {selectedJournalExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Écriture Comptable PCGM (Journal des Achats)
                </h3>
                <p className="text-xs text-slate-400">Réf: {selectedJournalExpense.reference}</p>
              </div>
              <button onClick={() => setSelectedJournalExpense(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-[var(--border)] space-y-2 text-xs font-mono">
              <div className="grid grid-cols-12 font-bold text-slate-400 pb-1 border-b border-[var(--border)] text-[10px]">
                <span className="col-span-3">Compte</span>
                <span className="col-span-5">Intitulé</span>
                <span className="col-span-2 text-right">Débit</span>
                <span className="col-span-2 text-right">Crédit</span>
              </div>
              <div className="grid grid-cols-12 text-slate-800 dark:text-slate-200">
                <span className="col-span-3 font-bold text-purple-600">{selectedJournalExpense.pcgmAccount}</span>
                <span className="col-span-5 truncate">{selectedJournalExpense.category}</span>
                <span className="col-span-2 text-right">{formatMad(selectedJournalExpense.amountHt)}</span>
                <span className="col-span-2 text-right">—</span>
              </div>
              <div className="grid grid-cols-12 text-slate-800 dark:text-slate-200">
                <span className="col-span-3 font-bold text-emerald-600">34551</span>
                <span className="col-span-5 truncate">État, TVA Récupérable</span>
                <span className="col-span-2 text-right">{formatMad(selectedJournalExpense.amountTtc - selectedJournalExpense.amountHt)}</span>
                <span className="col-span-2 text-right">—</span>
              </div>
              <div className="grid grid-cols-12 text-slate-800 dark:text-slate-200 border-t border-[var(--border)] pt-1">
                <span className="col-span-3 font-bold text-blue-600">4411 / 5141</span>
                <span className="col-span-5 truncate">Fournisseurs / Banque</span>
                <span className="col-span-2 text-right">—</span>
                <span className="col-span-2 text-right font-bold">{formatMad(selectedJournalExpense.amountTtc)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Écriture Équilibrée (Total Débit === Total Crédit)
              </span>
              <button
                onClick={() => setSelectedJournalExpense(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
