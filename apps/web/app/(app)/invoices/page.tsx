'use client';
import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Send,
  Wallet,
  Eye,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  FileCheck,
  Building2,
  DollarSign,
  Layers,
} from 'lucide-react';
import { formatMad, formatMadShort, CASH_PAYMENT_CEILING_MAD } from '../../lib/morocco';

interface InvoiceDoc {
  id: string;
  number: string;
  customerName: string;
  customerIce: string;
  date: string;
  dueDate: string;
  subtotalHt: number;
  taxAmount: number;
  totalTtc: number;
  balanceDue: number;
  status: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: { description: string; quantity: number; unitPrice: number; taxRate: number }[];
}

const INITIAL_INVOICES: InvoiceDoc[] = [
  {
    id: 'inv-1',
    number: 'FAC-2026-0142',
    customerName: 'Atlas Consulting SARL',
    customerIce: '001982736450091',
    date: '2026-08-10',
    dueDate: '2026-09-10',
    subtotalHt: 24500.0,
    taxAmount: 4900.0,
    totalTtc: 29400.0,
    balanceDue: 0.0,
    status: 'PAID',
    items: [
      { description: 'Licences Annuelles Logiciel ERP & Cloud', quantity: 1, unitPrice: 24500, taxRate: 20 },
    ],
  },
  {
    id: 'inv-2',
    number: 'FAC-2026-0143',
    customerName: 'Société Maghrébine de BTP SA',
    customerIce: '002817263540082',
    date: '2026-08-15',
    dueDate: '2026-09-15',
    subtotalHt: 48500.0,
    taxAmount: 9700.0,
    totalTtc: 58200.0,
    balanceDue: 48500.0,
    status: 'PARTIALLY_PAID',
    items: [
      { description: 'Fourniture Gros Œuvre & Câblage Industriel', quantity: 2, unitPrice: 24250, taxRate: 20 },
    ],
  },
  {
    id: 'inv-3',
    number: 'FAC-2026-0144',
    customerName: 'Superette Al Baraka Casablanca',
    customerIce: '001552948172839',
    date: '2026-07-05',
    dueDate: '2026-08-05',
    subtotalHt: 7083.33,
    taxAmount: 1416.67,
    totalTtc: 8500.0,
    balanceDue: 8500.0,
    status: 'OVERDUE',
    items: [
      { description: 'Pack Caisses Enregistreuses Tactiles & Tiroirs', quantity: 1, unitPrice: 7083.33, taxRate: 20 },
    ],
  },
  {
    id: 'inv-4',
    number: 'FAC-2026-0145',
    customerName: 'Kenza Alaoui (Architecte)',
    customerIce: '003192847560012',
    date: '2026-08-21',
    dueDate: '2026-09-21',
    subtotalHt: 9583.33,
    taxAmount: 1916.67,
    totalTtc: 11500.0,
    balanceDue: 11500.0,
    status: 'SENT',
    items: [
      { description: 'Prestation Aménagement Bureau & Suivi Chantier', quantity: 1, unitPrice: 9583.33, taxRate: 20 },
    ],
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceDoc[]>(INITIAL_INVOICES);
  const [search, setSearch] = useState('');
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceDoc | null>(null);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceDoc | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<'VIREMENT' | 'CHEQUE' | 'CASH'>('VIREMENT');

  // New Invoice Modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Atlas Consulting SARL');
  const [customerIce, setCustomerIce] = useState('001982736450091');
  const [unitPrice, setUnitPrice] = useState(15000);

  function handleCreateInvoice() {
    const tax = unitPrice * 0.2;
    const ttc = unitPrice + tax;
    const newDoc: InvoiceDoc = {
      id: `inv-${Date.now()}`,
      number: `FAC-2026-0${invoices.length + 146}`,
      customerName,
      customerIce,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      subtotalHt: unitPrice,
      taxAmount: tax,
      totalTtc: ttc,
      balanceDue: ttc,
      status: 'SENT',
      items: [{ description: 'Prestations Informatiques & Services', quantity: 1, unitPrice, taxRate: 20 }],
    };

    setInvoices([newDoc, ...invoices]);
    setNewModalOpen(false);
  }

  function openPaymentModal(inv: InvoiceDoc) {
    setActiveInvoice(inv);
    setPayAmount(inv.balanceDue);
    setPaymentModalOpen(true);
  }

  function handleProcessPayment() {
    if (!activeInvoice || payAmount <= 0) return;
    setInvoices((prev) =>
      prev.map((i) => {
        if (i.id === activeInvoice.id) {
          const newBal = Math.max(0, i.balanceDue - payAmount);
          return {
            ...i,
            balanceDue: newBal,
            status: newBal === 0 ? 'PAID' : 'PARTIALLY_PAID',
          };
        }
        return i;
      })
    );
    setPaymentModalOpen(false);
  }

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalTtc, 0);
  const totalBalanceDue = invoices.reduce((acc, i) => acc + i.balanceDue, 0);
  const totalCollected = totalInvoiced - totalBalanceDue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Receipt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Facturation &amp; Avoirs
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Mentions Légales DGI &amp; ICE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Émission de factures conformes, suivi des encaissements &amp; Génération des écritures PCGM 7111/4455
            </p>
          </div>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
        >
          <Plus size={15} />
          <span>Créer une Facture</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Facturé (TTC)
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {formatMad(totalInvoiced)}
          </div>
          <div className="text-[10px] text-slate-400">{invoices.length} factures enregistrées</div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Total Encaissé (Banque / Caisse)
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {formatMad(totalCollected)}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">Taux d&apos;encaissement: {((totalCollected/totalInvoiced)*100).toFixed(0)}%</div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Solde Restant Dû (Créances 3421)
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {formatMad(totalBalanceDue)}
          </div>
          <div className="text-[10px] text-rose-500 font-medium">À recouvrer / Carnet Kreddy</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">N° Facture</th>
                <th className="pb-3 px-2">Client &amp; ICE</th>
                <th className="pb-3 px-2">Date &amp; Échéance</th>
                <th className="pb-3 px-2 text-right">Total TTC</th>
                <th className="pb-3 px-2 text-right">Reste à Payer</th>
                <th className="pb-3 px-2 text-center">Statut</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.number}
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{inv.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ICE: {inv.customerIce}</div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                    <div>{inv.date}</div>
                    <div className="text-[10px] text-slate-400">Échéance: {inv.dueDate}</div>
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                    {formatMad(inv.totalTtc)}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-extrabold">
                    <span className={inv.balanceDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}>
                      {formatMad(inv.balanceDue)}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : inv.status === 'OVERDUE'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : inv.status === 'PARTIALLY_PAID'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {inv.status === 'PAID'
                        ? 'Payée'
                        : inv.status === 'OVERDUE'
                        ? 'En Retard'
                        : inv.status === 'PARTIALLY_PAID'
                        ? 'Partielle'
                        : 'Envoyée'}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        title="Aperçu Facture DGI"
                        className="p-1.5 rounded-xl border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Eye size={14} />
                      </button>

                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => openPaymentModal(inv)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 flex items-center gap-1"
                        >
                          <Wallet size={12} />
                          <span>Encaisser</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Official Moroccan Invoice Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="text-xl font-black tracking-tight text-slate-900">
                  SAHLBIZ TECHNOLOGIES SARL
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  124 Boulevard d&apos;Anfa, 4ème étage, Casablanca
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  ICE: 001982736450091 · IF: 40291823 · RC: 39481 Casa
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-mono font-bold text-xs rounded-lg border border-emerald-200">
                  FACTURE DE VENTE CONFORME DGI
                </span>
                <div className="font-mono font-extrabold text-base text-slate-900 mt-1">
                  {previewInvoice.number}
                </div>
                <div className="text-xs text-slate-500">Date: {previewInvoice.date}</div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Client Facturé :</div>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">{previewInvoice.customerName}</div>
              <div className="text-slate-600 font-mono mt-0.5">ICE Client: {previewInvoice.customerIce}</div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-bold text-[10px] uppercase">
                  <th className="py-2">Désignation</th>
                  <th className="py-2 text-center">Qté</th>
                  <th className="py-2 text-right">Prix Unit. HT</th>
                  <th className="py-2 text-right">TVA</th>
                  <th className="py-2 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {previewInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-semibold text-slate-800">{it.description}</td>
                    <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{formatMad(it.unitPrice)}</td>
                    <td className="py-2.5 text-right font-mono">{it.taxRate}%</td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      {formatMad(it.quantity * it.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total HT :</span>
                  <span className="font-mono">{formatMad(previewInvoice.subtotalHt)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA (20%) :</span>
                  <span className="font-mono">{formatMad(previewInvoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-400 pt-1.5">
                  <span>TOTAL TTC :</span>
                  <span className="font-mono text-emerald-700">{formatMad(previewInvoice.totalTtc)}</span>
                </div>
              </div>
            </div>

            {/* Moroccan Legal Footer */}
            <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-4 space-y-0.5">
              <div>SahlBiz Technologies SARL au Capital de 200 000 DH · Patente N° 38291028 · CNSS N° 8271629</div>
              <div>Tribunal de Commerce de Casablanca · RIB Attijariwafa Bank: 007 780 0001234567890123 45</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Imprimer Facture Conforme DGI</span>
              </button>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment / Encaissement Modal */}
      {paymentModalOpen && activeInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Encaisser la Facture {activeInvoice.number}
              </h3>
              <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Montant Encaissé (MAD)</span>
                  <span className="text-slate-400">Solde: {formatMad(activeInvoice.balanceDue)}</span>
                </div>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-sm font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mode d&apos;Encaissement</label>
                <div className="grid grid-cols-3 gap-2 font-semibold">
                  {['VIREMENT', 'CHEQUE', 'CASH'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPayMode(mode as any)}
                      className={`py-2 rounded-xl border transition-all ${
                        payMode === mode
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                          : 'border-[var(--border)] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {mode === 'VIREMENT' ? 'Virement' : mode === 'CHEQUE' ? 'Chèque' : 'Espèces'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Écriture PCGM :</span>
                  <strong className="text-slate-700 dark:text-slate-300">
                    Débit {payMode === 'CASH' ? '5161' : '5141'} ➔ Crédit 3421
                  </strong>
                </div>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>Valider l&apos;Encaissement</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Nouvelle Facture de Vente
              </h3>
              <button onClick={() => setNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Raison Sociale Client</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ICE Client (15 chiffres)</label>
                <input
                  type="text"
                  value={customerIce}
                  onChange={(e) => setCustomerIce(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Montant HT (MAD)</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-sm font-mono font-bold outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>TVA (20%) :</span>
                  <span className="font-mono">{formatMad(unitPrice * 0.2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Total TTC :</span>
                  <span className="font-mono text-emerald-600">{formatMad(unitPrice * 1.2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateInvoice}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
            >
              Émettre la Facture Conforme DGI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
