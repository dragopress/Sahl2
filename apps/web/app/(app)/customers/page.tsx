'use client';
import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  DollarSign,
} from 'lucide-react';
import { formatMad, formatMadShort, validateMoroccanIce } from '../../lib/morocco';

interface CustomerProfile {
  id: string;
  name: string;
  category: 'RETAIL' | 'SEMI_WHOLESALE' | 'WHOLESALE' | 'KEY_ACCOUNT';
  ice: string;
  ifNumber?: string;
  rcNumber?: string;
  city: string;
  phone: string;
  email: string;
  creditLimit: number;
  currentDebt: number;
  totalPurchased: number;
}

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Atlas Consulting SARL',
    category: 'KEY_ACCOUNT',
    ice: '001982736450091',
    ifNumber: '40291823',
    rcNumber: '39481 Casa',
    city: 'Casablanca (Anfa)',
    phone: '+212 661 234 567',
    email: 'contact@atlasconsulting.ma',
    creditLimit: 100000,
    currentDebt: 0,
    totalPurchased: 245000,
  },
  {
    id: 'cust-2',
    name: 'Société Maghrébine de BTP SA',
    category: 'KEY_ACCOUNT',
    ice: '002817263540082',
    ifNumber: '39102948',
    rcNumber: '18274 Tanger',
    city: 'Tanger Ville',
    phone: '+212 539 948 201',
    email: 'achats@maghrebinbtp.ma',
    creditLimit: 150000,
    currentDebt: 48500,
    totalPurchased: 520000,
  },
  {
    id: 'cust-3',
    name: 'Superette Al Baraka Casablanca',
    category: 'SEMI_WHOLESALE',
    ice: '001552948172839',
    ifNumber: '28471920',
    rcNumber: '92841 Casa',
    city: 'Casablanca (Maârif)',
    phone: '+212 662 998 877',
    email: 'albaraka.market@gmail.com',
    creditLimit: 25000,
    currentDebt: 8500,
    totalPurchased: 98000,
  },
  {
    id: 'cust-4',
    name: 'Kenza Alaoui (Architecte d’Intérieur)',
    category: 'RETAIL',
    ice: '003192847560012',
    city: 'Rabat (Agdal)',
    phone: '+212 663 112 233',
    email: 'kenza.archi@gmail.com',
    creditLimit: 20000,
    currentDebt: 11500,
    totalPurchased: 65000,
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [ice, setIce] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [category, setCategory] = useState<CustomerProfile['category']>('KEY_ACCOUNT');
  const [creditLimit, setCreditLimit] = useState(50000);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.ice.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreateCustomer() {
    if (!name) return;
    const newCust: CustomerProfile = {
      id: `cust-${Date.now()}`,
      name,
      category,
      ice: ice || '000000000000000',
      city,
      phone: phone || '+212 600 000 000',
      email: email || 'contact@client.ma',
      creditLimit,
      currentDebt: 0,
      totalPurchased: 0,
    };
    setCustomers([newCust, ...customers]);
    setNewModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Répertoire Clients &amp; CRM B2B / B2C
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                ICE Validé DGI &amp; Plafonds Kreddy
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grilles tarifaires (Particulier, Demi-gros, Grossiste, Grand Compte) &amp; Encours clients
            </p>
          </div>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
        >
          <Plus size={15} />
          <span>Ajouter un Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par raison sociale, ICE marocain ou ville..."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl py-2.5 pl-10 pr-4 text-xs outline-none shadow-sm focus:border-[var(--primary)]"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cust) => {
          const isIceValid = validateMoroccanIce(cust.ice).isValid;
          const debtRatio = (cust.currentDebt / cust.creditLimit) * 100;

          return (
            <div
              key={cust.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1.5">
                    {cust.category === 'KEY_ACCOUNT'
                      ? 'Grand Compte'
                      : cust.category === 'WHOLESALE'
                      ? 'Grossiste'
                      : cust.category === 'SEMI_WHOLESALE'
                      ? 'Demi-Grossiste'
                      : 'Détail / Particulier'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {cust.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>ICE: {cust.ice}</span>
                    {isIceValid && (
                      <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> DGI
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Volume Achats</div>
                  <div className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                    {formatMad(cust.totalPurchased)}
                  </div>
                </div>
              </div>

              {/* Debt & Credit Limit Progress */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Encours Kreddy (Dette Actuelle) :</span>
                  <span
                    className={`font-mono font-bold ${
                      cust.currentDebt > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {formatMad(cust.currentDebt)} / {formatMadShort(cust.creditLimit)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      debtRatio > 80 ? 'bg-rose-500' : debtRatio > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, debtRatio)}%` }}
                  />
                </div>
              </div>

              {/* Contact and Actions Footer */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Building2 size={13} className="text-slate-400" />
                    {cust.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" />
                    {cust.phone}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    title="Contacter sur WhatsApp"
                  >
                    <MessageCircle size={14} />
                  </a>
                  <button
                    onClick={() => alert(`Création rapide d'un devis pour ${cust.name}...`)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-[11px] hover:opacity-90"
                  >
                    Créer Devis
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Customer Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Nouveau Client
              </h3>
              <button onClick={() => setNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Raison Sociale / Nom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 outline-none"
                  placeholder="Ex: Société Marocaine de Distribution SARL"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ICE (Identifiant Commun de l&apos;Entreprise)</label>
                <input
                  type="text"
                  value={ice}
                  onChange={(e) => setIce(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 font-mono outline-none"
                  placeholder="001982736450091"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 outline-none"
                    placeholder="+212 661 000 000"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 outline-none"
                    placeholder="Casablanca"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catégorie Client &amp; Grille Tarifaire</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 outline-none font-semibold"
                >
                  <option value="RETAIL">Détail / Particulier (Prix Public TTC)</option>
                  <option value="SEMI_WHOLESALE">Demi-Grossiste (-5% Remise)</option>
                  <option value="WHOLESALE">Grossiste (-12% Remise)</option>
                  <option value="KEY_ACCOUNT">Grand Compte B2B (Tarif Négocié)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Plafond Crédit Kreddy (MAD)</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl py-2 px-3 font-mono font-bold outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCustomer}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
            >
              Enregistrer le Client
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
