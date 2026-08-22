'use client';
import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Send,
  ArrowRight,
  Printer,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShoppingBag,
  Truck,
  Receipt,
  Eye,
  Download,
  Building2,
  Trash2,
} from 'lucide-react';
import { formatMad, MOROCCAN_VAT_RATES } from '../../lib/morocco';

interface QuoteDoc {
  id: string;
  number: string;
  customerName: string;
  customerIce: string;
  date: string;
  validUntil: string;
  subtotalHt: number;
  taxAmount: number;
  totalTtc: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'ORDER_CONVERTED' | 'DELIVERY_CONVERTED' | 'INVOICE_CONVERTED' | 'REJECTED';
  items: { description: string; quantity: number; unitPrice: number; taxRate: number }[];
}

const INITIAL_QUOTES: QuoteDoc[] = [
  {
    id: 'q-1',
    number: 'DEV-2026-0091',
    customerName: 'Atlas Consulting SARL',
    customerIce: '001982736450091',
    date: '2026-08-18',
    validUntil: '2026-09-18',
    subtotalHt: 18500.0,
    taxAmount: 3700.0,
    totalTtc: 22200.0,
    status: 'ACCEPTED',
    items: [
      { description: 'Installation Réseau & Câblage Cat6', quantity: 1, unitPrice: 8500, taxRate: 20 },
      { description: 'Équipements Serveur & Baie de Brassage', quantity: 2, unitPrice: 5000, taxRate: 20 },
    ],
  },
  {
    id: 'q-2',
    number: 'DEV-2026-0092',
    customerName: 'Société Maghrébine de BTP SA',
    customerIce: '002817263540082',
    date: '2026-08-20',
    validUntil: '2026-09-20',
    subtotalHt: 42000.0,
    taxAmount: 8400.0,
    totalTtc: 50400.0,
    status: 'SENT',
    items: [
      { description: 'Fourniture Matériel Bureau & Informatique', quantity: 5, unitPrice: 8400, taxRate: 20 },
    ],
  },
  {
    id: 'q-3',
    number: 'DEV-2026-0093',
    customerName: 'Kenza Alaoui (Architecte)',
    customerIce: '003192847560012',
    date: '2026-08-21',
    validUntil: '2026-09-21',
    subtotalHt: 6800.0,
    taxAmount: 1360.0,
    totalTtc: 8160.0,
    status: 'DRAFT',
    items: [
      { description: 'Mobilier Design & Éclairage Bureau', quantity: 1, unitPrice: 6800, taxRate: 20 },
    ],
  },
];

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteDoc[]>(INITIAL_QUOTES);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<QuoteDoc | null>(null);

  // New quote form
  const [customerName, setCustomerName] = useState('Atlas Consulting SARL');
  const [customerIce, setCustomerIce] = useState('001982736450091');
  const [items, setItems] = useState([
    { description: 'Prestation de Conseil & Audit', quantity: 1, unitPrice: 12000, taxRate: 20 },
  ]);

  function handleAddItem() {
    setItems([...items, { description: '', quantity: 1, unitPrice: 1000, taxRate: 20 }]);
  }

  function handleCreateQuote() {
    const ht = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
    const tax = items.reduce((acc, i) => acc + i.quantity * i.unitPrice * (i.taxRate / 100), 0);

    const newDoc: QuoteDoc = {
      id: `q-${Date.now()}`,
      number: `DEV-2026-00${quotes.length + 94}`,
      customerName,
      customerIce,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      subtotalHt: ht,
      taxAmount: tax,
      totalTtc: ht + tax,
      status: 'DRAFT',
      items,
    };

    setQuotes([newDoc, ...quotes]);
    setNewModalOpen(false);
  }

  function convertTo(quoteId: string, target: 'BC' | 'BL' | 'INVOICE') {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          const status =
            target === 'BC'
              ? 'ORDER_CONVERTED'
              : target === 'BL'
              ? 'DELIVERY_CONVERTED'
              : 'INVOICE_CONVERTED';
          return { ...q, status };
        }
        return q;
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileText size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Devis &amp; Bons Commerciaux
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Cycle Ventes : Devis ➔ BC ➔ BL ➔ Facture
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Émission de propositions commerciales, conversion en un clic &amp; aperçu PDF conforme DGI
            </p>
          </div>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
        >
          <Plus size={15} />
          <span>Créer un Nouveau Devis</span>
        </button>
      </div>

      {/* Quotes Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">N° Devis</th>
                <th className="pb-3 px-2">Client &amp; ICE</th>
                <th className="pb-3 px-2">Date &amp; Validité</th>
                <th className="pb-3 px-2 text-right">Montant HT</th>
                <th className="pb-3 px-2 text-right">Total TTC (MAD)</th>
                <th className="pb-3 px-2 text-center">Statut Cycle</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                    {q.number}
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{q.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ICE: {q.customerIce}</div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                    <div>{q.date}</div>
                    <div className="text-[10px] text-slate-400">Valide: {q.validUntil}</div>
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300">
                    {formatMad(q.subtotalHt)}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                    {formatMad(q.totalTtc)}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        q.status === 'ACCEPTED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : q.status === 'INVOICE_CONVERTED'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : q.status === 'SENT'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {q.status === 'ACCEPTED'
                        ? 'Accepté'
                        : q.status === 'INVOICE_CONVERTED'
                        ? 'Facturé'
                        : q.status === 'ORDER_CONVERTED'
                        ? 'Bon de Commande'
                        : q.status === 'SENT'
                        ? 'Envoyé'
                        : 'Brouillon'}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewQuote(q)}
                        title="Aperçu PDF Conforme"
                        className="p-1.5 rounded-xl border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        <Eye size={14} />
                      </button>

                      {q.status === 'DRAFT' && (
                        <button
                          onClick={() => {
                            setQuotes((prev) =>
                              prev.map((item) => (item.id === q.id ? { ...item, status: 'SENT' } : item))
                            );
                          }}
                          className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 flex items-center gap-1"
                        >
                          <Send size={12} />
                          <span>Envoyer</span>
                        </button>
                      )}

                      {['SENT', 'ACCEPTED'].includes(q.status) && (
                        <button
                          onClick={() => convertTo(q.id, 'INVOICE')}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 flex items-center gap-1"
                        >
                          <ArrowRight size={12} />
                          <span>Facturer</span>
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

      {/* PDF Official Moroccan Quote Preview Modal */}
      {previewQuote && (
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
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-lg border border-blue-200">
                  PROPOSITION COMMERCIALE / DEVIS
                </span>
                <div className="font-mono font-extrabold text-base text-slate-900 mt-1">
                  {previewQuote.number}
                </div>
                <div className="text-xs text-slate-500">Date: {previewQuote.date}</div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Client Destinataire :</div>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">{previewQuote.customerName}</div>
              <div className="text-slate-600 font-mono mt-0.5">ICE Client: {previewQuote.customerIce}</div>
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
                {previewQuote.items.map((it, idx) => (
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
                  <span className="font-mono">{formatMad(previewQuote.subtotalHt)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA (20%) :</span>
                  <span className="font-mono">{formatMad(previewQuote.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-400 pt-1.5">
                  <span>TOTAL TTC :</span>
                  <span className="font-mono text-emerald-700">{formatMad(previewQuote.totalTtc)}</span>
                </div>
              </div>
            </div>

            {/* Moroccan Legal Footer */}
            <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-4 space-y-0.5">
              <div>SahlBiz Technologies SARL au Capital de 200 000 DH · Patente N° 38291028 · CNSS N° 8271629</div>
              <div>Tribunal de Commerce de Casablanca · Validité de l&apos;offre : 30 jours à compter de la date d&apos;émission</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Imprimer Devis Conforme</span>
              </button>
              <button
                onClick={() => setPreviewQuote(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Nouveau Devis Commercial
              </h3>
              <button onClick={() => setNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du Client
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ICE Client (15 chiffres)
                </label>
                <input
                  type="text"
                  value={customerIce}
                  onChange={(e) => setCustomerIce(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 font-mono outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <div className="flex justify-between items-center font-bold">
                  <span>Lignes du Devis</span>
                  <button
                    onClick={handleAddItem}
                    className="text-[var(--primary)] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Plus size={12} />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].description = e.target.value;
                        setItems(newItems);
                      }}
                      className="col-span-6 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-lg p-1.5"
                    />
                    <input
                      type="number"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].quantity = Number(e.target.value);
                        setItems(newItems);
                      }}
                      className="col-span-2 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-lg p-1.5 text-center font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Prix HT"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].unitPrice = Number(e.target.value);
                        setItems(newItems);
                      }}
                      className="col-span-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-lg p-1.5 text-right font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateQuote}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
            >
              Créer le Devis &amp; Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
