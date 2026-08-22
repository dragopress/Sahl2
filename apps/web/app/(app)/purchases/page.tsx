'use client';
import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  CreditCard,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Eye,
  Download,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatMad, formatMadShort } from '../../lib/morocco';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierIce: string;
  date: string;
  deliveryDate: string;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  step: 'PO_ORDERED' | 'GOODS_RECEIVED' | 'INVOICED' | 'PAID' | 'RETURNED';
  receptionStatus: 'NONE' | 'PARTIAL' | 'COMPLETE';
  matchingStatus: 'MATCHED' | 'DISCREPANCY' | 'PENDING';
  itemsCount: number;
}

const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: 'po-1',
    orderNumber: 'BCF-2026-0042',
    supplierName: 'Fournitures Papeterie du Sud SARL',
    supplierIce: '001928374650012',
    date: '2026-08-18',
    deliveryDate: '2026-08-20',
    totalHt: 14200.0,
    totalTva: 2840.0,
    totalTtc: 17040.0,
    step: 'PAID',
    receptionStatus: 'COMPLETE',
    matchingStatus: 'MATCHED',
    itemsCount: 8,
  },
  {
    id: 'po-2',
    orderNumber: 'BCF-2026-0043',
    supplierName: 'Grossiste Informatique Maroc SA',
    supplierIce: '002819284756102',
    date: '2026-08-20',
    deliveryDate: '2026-08-23',
    totalHt: 38500.0,
    totalTva: 7700.0,
    totalTtc: 46200.0,
    step: 'GOODS_RECEIVED',
    receptionStatus: 'PARTIAL',
    matchingStatus: 'PENDING',
    itemsCount: 15,
  },
  {
    id: 'po-3',
    orderNumber: 'BCF-2026-0044',
    supplierName: 'Atlas Électroménager & Bureau',
    supplierIce: '003918274659102',
    date: '2026-08-21',
    deliveryDate: '2026-08-25',
    totalHt: 8900.0,
    totalTva: 1780.0,
    totalTtc: 10680.0,
    step: 'PO_ORDERED',
    receptionStatus: 'NONE',
    matchingStatus: 'PENDING',
    itemsCount: 4,
  },
  {
    id: 'po-4',
    orderNumber: 'BCF-2026-0045',
    supplierName: 'Laboratoires & Hygiène Pro Maroc',
    supplierIce: '001294817294821',
    date: '2026-08-14',
    deliveryDate: '2026-08-16',
    totalHt: 6400.0,
    totalTva: 1280.0,
    totalTtc: 7680.0,
    step: 'INVOICED',
    receptionStatus: 'COMPLETE',
    matchingStatus: 'MATCHED',
    itemsCount: 6,
  },
];

const STEPS = [
  { id: '1', name: '1. Commande (BC)', desc: 'Bon de Commande émis', icon: ShoppingBag, color: 'text-blue-500' },
  { id: '2', name: '2. Réception (BR)', desc: 'Contrôle & Entrée en stock', icon: Truck, color: 'text-amber-500' },
  { id: '3', name: '3. Facture (FF)', desc: 'Rapprochement 3-Way', icon: FileText, color: 'text-purple-500' },
  { id: '4', name: '4. Règlement', desc: 'Paiement Fournisseur 4411', icon: CreditCard, color: 'text-emerald-500' },
  { id: '5', name: '5. Retours / Avoirs', desc: 'Gestion des non-conformités', icon: RotateCcw, color: 'text-rose-500' },
];

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(INITIAL_PURCHASES);
  const [activeTab, setActiveTab] = useState<'WORKFLOW' | 'AGING' | 'STATEMENTS'>('WORKFLOW');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // New PO Modal
  const [newPoModalOpen, setNewPoModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState('Fournitures Papeterie du Sud SARL');
  const [newSupplierIce, setNewSupplierIce] = useState('001928374650012');
  const [newTotalHt, setNewTotalHt] = useState(12500);

  function handleCreatePo() {
    const tva = newTotalHt * 0.2;
    const newPo: PurchaseOrder = {
      id: `po-${Date.now()}`,
      orderNumber: `BCF-2026-00${purchases.length + 46}`,
      supplierName: newSupplier,
      supplierIce: newSupplierIce,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      totalHt: newTotalHt,
      totalTva: tva,
      totalTtc: newTotalHt + tva,
      step: 'PO_ORDERED',
      receptionStatus: 'NONE',
      matchingStatus: 'PENDING',
      itemsCount: 5,
    };
    setPurchases([newPo, ...purchases]);
    setNewPoModalOpen(false);
  }

  function advanceStep(orderId: string) {
    setPurchases((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.step === 'PO_ORDERED') return { ...o, step: 'GOODS_RECEIVED', receptionStatus: 'COMPLETE' };
        if (o.step === 'GOODS_RECEIVED') return { ...o, step: 'INVOICED', matchingStatus: 'MATCHED' };
        if (o.step === 'INVOICED') return { ...o, step: 'PAID' };
        return o;
      })
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Cycle des Achats &amp; Fournisseurs
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Workflow en 5 Étapes
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bons de commande, réceptions, factures fournisseurs, rapprochement 3-way &amp; PCGM 6111
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewPoModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            <Plus size={15} />
            <span>Nouveau Bon de Commande (BC)</span>
          </button>
        </div>
      </div>

      {/* 5-Step Visual Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {STEPS.map((s, idx) => (
          <div
            key={s.id}
            className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--border)] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{s.name}</span>
                <s.icon size={16} className={s.color} />
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {s.desc}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[var(--border)] text-[10px] text-slate-400 flex items-center justify-between">
              <span>Étape {idx + 1}/5</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {purchases.filter((p) => {
                  if (idx === 0) return p.step === 'PO_ORDERED';
                  if (idx === 1) return p.step === 'GOODS_RECEIVED';
                  if (idx === 2) return p.step === 'INVOICED';
                  if (idx === 3) return p.step === 'PAID';
                  return p.step === 'RETURNED';
                }).length}{' '}
                dossier(s)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        {[
          { id: 'WORKFLOW', label: 'Commandes & Workflow en Cours' },
          { id: 'AGING', label: 'Échéancier des Dettes (0-90j+)' },
          { id: 'STATEMENTS', label: 'Relevés de Comptes Fournisseurs' },
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

      {/* Main Tab Content */}
      {activeTab === 'WORKFLOW' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">N° Commande</th>
                  <th className="pb-3 px-2">Fournisseur &amp; ICE</th>
                  <th className="pb-3 px-2">Date &amp; Livraison</th>
                  <th className="pb-3 px-2 text-right">Montant HT</th>
                  <th className="pb-3 px-2 text-right">TTC (MAD)</th>
                  <th className="pb-3 px-2 text-center">Étape Workflow</th>
                  <th className="pb-3 px-2 text-center">Rapprochement</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                      {p.orderNumber}
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{p.supplierName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ICE: {p.supplierIce}</div>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                      <div>{p.date}</div>
                      <div className="text-[10px] text-slate-400">Prévu: {p.deliveryDate}</div>
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono text-slate-600 dark:text-slate-300">
                      {formatMad(p.totalHt)}
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      {formatMad(p.totalTtc)}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.step === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : p.step === 'INVOICED'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : p.step === 'GOODS_RECEIVED'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {p.step === 'PO_ORDERED'
                          ? '1. BC Émis'
                          : p.step === 'GOODS_RECEIVED'
                          ? '2. Réceptionné'
                          : p.step === 'INVOICED'
                          ? '3. Facturé'
                          : '4. Réglé'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.matchingStatus === 'MATCHED'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {p.matchingStatus === 'MATCHED' ? '3-Way OK' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {p.step !== 'PAID' && (
                        <button
                          onClick={() => advanceStep(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all inline-flex items-center gap-1"
                        >
                          <span>Avancer</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                      {p.step === 'PAID' && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 size={12} />
                          Complet
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supplier Aging Analysis Tab */}
      {activeTab === 'AGING' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Échéancier des Dettes Fournisseurs (Balance Âgée)
            </h3>
            <p className="text-xs text-slate-400">Répartition des dettes selon l&apos;ancienneté d&apos;échéance</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                0 à 30 Jours
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {formatMad(46200)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Échéances normales</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                31 à 60 Jours
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {formatMad(18400)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Dettes à planifier</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                61 à 90 Jours
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {formatMad(7680)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Attention retards</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                &gt; 90 Jours
              </div>
              <div className="text-xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1">
                {formatMad(0)}
              </div>
              <div className="text-[10px] text-emerald-500 mt-1 font-semibold">Aucun litige critique</div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Statement of Accounts Tab */}
      {activeTab === 'STATEMENTS' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Relevé de Compte Fournisseur (Extrait PCGM 4411)
              </h3>
              <p className="text-xs text-slate-400">Historique des mouvements Débit / Crédit</p>
            </div>
            <button
              onClick={() => alert('Génération du relevé certifié au format PDF...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download size={14} />
              <span>Exporter PDF</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
              <span>Grossiste Informatique Maroc SA (ICE: 002819284756102)</span>
              <span className="font-mono text-amber-500">Solde Créditeur : {formatMad(46200)}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Conditions de règlement: 60 jours fin de mois par Virement ou Traite bancaire.
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {newPoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Nouveau Bon de Commande Fournisseur (BC)
              </h3>
              <button onClick={() => setNewPoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Raison Sociale du Fournisseur
                </label>
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ICE Fournisseur (15 chiffres)
                </label>
                <input
                  type="text"
                  value={newSupplierIce}
                  onChange={(e) => setNewSupplierIce(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Montant Estimé HT (MAD)
                </label>
                <input
                  type="number"
                  value={newTotalHt}
                  onChange={(e) => setNewTotalHt(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-sm font-mono font-bold outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>TVA (20%) :</span>
                  <span className="font-mono">{formatMad(newTotalHt * 0.2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Total TTC :</span>
                  <span className="font-mono text-[var(--primary)]">{formatMad(newTotalHt * 1.2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreatePo}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
            >
              Émettre le Bon de Commande &amp; Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
