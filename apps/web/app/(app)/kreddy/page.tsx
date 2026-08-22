'use client';
import React, { useState } from 'react';
import {
  BookOpen,
  Send,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  DollarSign,
  Phone,
  MessageCircle,
  Copy,
  Receipt,
  UserCheck,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import {
  formatMad,
  formatMadShort,
  generateWhatsAppKreddyReminder,
} from '../../lib/morocco';

interface KreddyCustomer {
  id: string;
  name: string;
  phone: string;
  ice: string;
  totalDue: number;
  creditLimit: number;
  oldestDueDays: number;
  invoicesCount: number;
  lastPaymentDate: string;
  status: 'HEALTHY' | 'WARNING' | 'OVERDUE' | 'BLOCKED';
}

const INITIAL_KREDDY_DATA: KreddyCustomer[] = [
  {
    id: 'k1',
    name: 'Superette Al Baraka Casablanca',
    phone: '+212661293847',
    ice: '001552948172839',
    totalDue: 8500,
    creditLimit: 15000,
    oldestDueDays: 14,
    invoicesCount: 3,
    lastPaymentDate: '2026-08-10',
    status: 'HEALTHY',
  },
  {
    id: 'k2',
    name: 'Société Maghrébine de BTP SA',
    phone: '+212662918234',
    ice: '002817263540082',
    totalDue: 48500,
    creditLimit: 50000,
    oldestDueDays: 68,
    invoicesCount: 6,
    lastPaymentDate: '2026-07-02',
    status: 'OVERDUE',
  },
  {
    id: 'k3',
    name: 'Atlas Consulting SARL',
    phone: '+212663847192',
    ice: '001982736450091',
    totalDue: 4250,
    creditLimit: 20000,
    oldestDueDays: 8,
    invoicesCount: 1,
    lastPaymentDate: '2026-08-15',
    status: 'HEALTHY',
  },
  {
    id: 'k4',
    name: 'Kenza Alaoui (Architecte d’Intérieur)',
    phone: '+212664918273',
    ice: '003192847560012',
    totalDue: 11500,
    creditLimit: 12000,
    oldestDueDays: 45,
    invoicesCount: 2,
    lastPaymentDate: '2026-07-20',
    status: 'WARNING',
  },
  {
    id: 'k5',
    name: 'Boulangerie Patisserie Médina Rabat',
    phone: '+212665019283',
    ice: '001827364500918',
    totalDue: 18900,
    creditLimit: 15000,
    oldestDueDays: 92,
    invoicesCount: 4,
    lastPaymentDate: '2026-06-18',
    status: 'BLOCKED',
  },
];

export default function KreddyPage() {
  const [customers, setCustomers] = useState<KreddyCustomer[]>(INITIAL_KREDDY_DATA);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // WhatsApp Reminder Modal State
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<KreddyCustomer | null>(null);
  const [selectedLang, setSelectedLang] = useState<'darija' | 'fr' | 'ar'>('darija');
  const [copied, setCopied] = useState(false);

  // Settlement / Payment Modal State
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [settlePaymentMode, setSettlePaymentMode] = useState<'CASH' | 'CHEQUE' | 'VIREMENT'>('VIREMENT');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.ice.includes(search) ||
      c.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = customers.reduce((acc, c) => acc + c.totalDue, 0);
  const overdueCount = customers.filter((c) => c.oldestDueDays > 30).length;
  const totalOverdueAmount = customers
    .filter((c) => c.oldestDueDays > 30)
    .reduce((acc, c) => acc + c.totalDue, 0);

  function openReminderModal(customer: KreddyCustomer) {
    setActiveCustomer(customer);
    setReminderModalOpen(true);
    setCopied(false);
  }

  function openSettleModal(customer: KreddyCustomer) {
    setActiveCustomer(customer);
    setSettleAmount(customer.totalDue);
    setSettleModalOpen(true);
  }

  function handleProcessSettlement() {
    if (!activeCustomer || settleAmount <= 0) return;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === activeCustomer.id) {
          const newDue = Math.max(0, c.totalDue - settleAmount);
          return {
            ...c,
            totalDue: newDue,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            status: newDue === 0 ? 'HEALTHY' : newDue > c.creditLimit ? 'BLOCKED' : c.status,
          };
        }
        return c;
      })
    );
    setSettleModalOpen(false);
  }

  const reminderContent = activeCustomer
    ? generateWhatsAppKreddyReminder({
        customerName: activeCustomer.name,
        customerPhone: activeCustomer.phone,
        amountDue: activeCustomer.totalDue,
        companyName: 'SahlBiz SARL Maroc',
        lang: selectedLang,
      })
    : { text: '', url: '' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Kreddy · Carnet de Dettes Client
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Suivi des Créances
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestion du crédit commercial, rappels WhatsApp b Darija &amp; Règlements PCGM 3421
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Créances En Cours (Kreddy)
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {formatMad(totalOutstanding)}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
            <span>Sur {customers.length} comptes clients actifs</span>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Créances Échues (&gt; 30 Jours)
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {formatMad(totalOverdueAmount)}
          </div>
          <div className="text-[10px] text-rose-500/80 font-medium">
            {overdueCount} clients en retard de paiement
          </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Derniers Encaissements Reçus
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {formatMad(24500)}
          </div>
          <div className="text-[10px] text-slate-400">Cette semaine via Virement &amp; Chèque</div>
        </div>
      </div>

      {/* Filters & Customer Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher par nom, ICE ou téléphone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['ALL', 'HEALTHY', 'WARNING', 'OVERDUE', 'BLOCKED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL'
                  ? 'Tous'
                  : st === 'HEALTHY'
                  ? 'Sain'
                  : st === 'WARNING'
                  ? 'Attention'
                  : st === 'OVERDUE'
                  ? 'En Retard'
                  : 'Bloqué'}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">Client &amp; Contact</th>
                <th className="pb-3 px-2">ICE Maroc</th>
                <th className="pb-3 px-2 text-right">Dette Kreddy Due</th>
                <th className="pb-3 px-2 text-right">Plafond Autorisé</th>
                <th className="pb-3 px-2 text-center">Retard</th>
                <th className="pb-3 px-2 text-center">Statut</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredCustomers.map((c) => {
                const ratio = c.creditLimit > 0 ? (c.totalDue / c.creditLimit) * 100 : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Phone size={10} />
                        {c.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-slate-600 dark:text-slate-300">
                      {c.ice}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                        {formatMad(c.totalDue)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {c.invoicesCount} facture(s) impayée(s)
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right font-mono">
                      <div className="text-slate-600 dark:text-slate-300">{formatMad(c.creditLimit)}</div>
                      <div className="w-24 ml-auto bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            ratio > 90 ? 'bg-red-500' : ratio > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, ratio)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          c.oldestDueDays > 60
                            ? 'bg-red-500/10 text-red-500'
                            : c.oldestDueDays > 30
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        <Clock size={10} />
                        {c.oldestDueDays} jours
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.status === 'HEALTHY'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : c.status === 'WARNING'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : c.status === 'OVERDUE'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {c.status === 'HEALTHY'
                          ? 'Sain'
                          : c.status === 'WARNING'
                          ? 'Plafond Proche'
                          : c.status === 'OVERDUE'
                          ? 'En Retard'
                          : 'Bloqué'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openReminderModal(c)}
                          title="Envoyer Rappel WhatsApp"
                          className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                        >
                          <MessageCircle size={15} />
                        </button>
                        <button
                          onClick={() => openSettleModal(c)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          Régler
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Reminder Modal */}
      {reminderModalOpen && activeCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Rappel WhatsApp Kreddy
                  </h3>
                  <p className="text-xs text-slate-400">Pour : {activeCustomer.name}</p>
                </div>
              </div>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex gap-2">
              {[
                { id: 'darija', label: '🇲🇦 Darija Marocaine' },
                { id: 'fr', label: '🇫🇷 Français Pro' },
                { id: 'ar', label: '🇸🇦 العربية الفصحى' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id as any)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedLang === lang.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Message Preview Box */}
            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-[var(--border)] text-xs font-sans whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
              {reminderContent.text}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reminderContent.text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-1.5"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? 'Copié !' : 'Copier le Texte'}</span>
              </button>
              <a
                href={reminderContent.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 flex items-center justify-center gap-1.5 shadow-md"
              >
                <Send size={14} />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Settlement / Encaissement Modal */}
      {settleModalOpen && activeCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Règlement de Créance Kreddy
                </h3>
                <p className="text-xs text-slate-400">Client : {activeCustomer.name}</p>
              </div>
              <button
                onClick={() => setSettleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Montant du Versement (MAD)</span>
                  <span className="text-slate-400 font-normal">Dû: {formatMad(activeCustomer.totalDue)}</span>
                </div>
                <input
                  type="number"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 text-base font-mono font-bold outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mode de Paiement
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {['VIREMENT', 'CHEQUE', 'CASH'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettlePaymentMode(mode as any)}
                      className={`py-2 rounded-xl border transition-all ${
                        settlePaymentMode === mode
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
                  <span className="text-slate-500">Imputation PCGM :</span>
                  <strong className="text-slate-700 dark:text-slate-300">Crédit 3421 (Clients)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Compte Débit :</span>
                  <strong className="text-slate-700 dark:text-slate-300">
                    {settlePaymentMode === 'CASH' ? '5161 (Caisse)' : '5141 (Banque)'}
                  </strong>
                </div>
              </div>
            </div>

            <button
              onClick={handleProcessSettlement}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Valider le Règlement &amp; Générer Reçu</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
