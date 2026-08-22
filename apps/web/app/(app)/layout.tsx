'use client';
import React from 'react';
import Link from 'next/link';
import OrgSwitcher from './org-switcher';
import ThemeSwitcher from '../theme-switcher';
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Wallet,
  BriefcaseBusiness,
  CheckSquare,
  Package,
  BarChart3,
  Settings,
  Search,
  Brain,
  Globe,
  LogOut,
  Store,
  BookOpen,
  ShoppingBag,
  Landmark,
  ShieldAlert,
} from 'lucide-react';
import CommandCenter from './command/command-palette';

const groups = [
  ['Pilotage', [['Dashboard', '/dashboard', LayoutDashboard]]],
  [
    'Caisse & Ventes',
    [
      ['Point de Vente (POS)', '/pos', Store],
      ['Kreddy (Dettes Client)', '/kreddy', BookOpen],
      ['Devis & Bons', '/quotes', FileText],
      ['Factures & Avoirs', '/invoices', Receipt],
      ['Paiements & Encaissements', '/payments', Wallet],
      ['Produits & Tarifs', '/products', Package],
    ],
  ],
  [
    'CRM & Clients',
    [
      ['Clients & ICE', '/customers', Users],
      ['Opportunités & Pipeline', '/opportunities', BriefcaseBusiness],
    ],
  ],
  [
    'Achats & Dépenses',
    [
      ['Cycle Achats (5 Étapes)', '/purchases', ShoppingBag],
      ['Fournisseurs & Échéancier', '/suppliers', Wallet],
      ['Dépenses & OCR Scanner', '/expenses', Receipt],
    ],
  ],
  [
    'Finance & Fiscalité Maroc',
    [
      ['Comptabilité PCGM & Bilan', '/finance', Landmark],
      ['Déclaration TVA DGI', '/finance/vat', Receipt],
      ['Rapprochement Bancaire', '/finance/reconciliation', BarChart3],
      ['Trésorerie Multi-Comptes', '/cashflow', BarChart3],
    ],
  ],
  [
    'Opérations & Stocks',
    [
      ['Inventaire & Dépôts', '/inventory', Package],
      ['Projets & Rentabilité', '/projects', BriefcaseBusiness],
      ['Tâches & Délais', '/tasks', CheckSquare],
    ],
  ],
  [
    'Analyse & Audit',
    [
      ['Rapports & Pilotage', '/reports', BarChart3],
      ['Documents & GED', '/documents', FileText],
    ],
  ],
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[var(--surface)] border-r border-[var(--border)] flex-col shadow-sm">
        {/* Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              S
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight leading-tight">
                Sahl<span className="text-[var(--primary)]">Biz</span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium">Business OS · Maroc</div>
            </div>
          </Link>
          <Link
            href="/"
            title="Aller sur le site public"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Globe size={15} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 overflow-y-auto flex-1 space-y-4">
          {groups.map(([label, items]) => (
            <div key={label}>
              <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {label}
              </div>
              <div className="space-y-0.5">
                {items.map(([name, href, Icon]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <Icon size={16} className="text-slate-400 group-hover:text-[var(--primary)]" />
                    <span>{name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-[var(--border)]">
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Outils &amp; IA
            </div>
            <div className="space-y-0.5">
              <Link
                href="/ai"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] dark:hover:bg-slate-800 transition-colors"
              >
                <Brain size={16} className="text-[var(--primary)]" />
                <span>Assistant IA</span>
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={16} className="text-slate-400" />
                <span>Notifications</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] dark:hover:bg-slate-800 transition-colors"
              >
                <Settings size={16} className="text-slate-400" />
                <span>Paramètres</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <div className="font-semibold text-slate-700 dark:text-slate-200">SahlBiz v0.2</div>
            <div>Maroc · DGI OK</div>
          </div>
          <Link
            href="/login"
            title="Déconnexion"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={15} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] px-4 md:px-6 flex items-center gap-3 shrink-0 shadow-sm z-30">
          <div className="flex-1 max-w-xl relative">
            <form action="/search" className="w-full">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                name="q"
                aria-label="Recherche globale"
                placeholder="Rechercher clients, factures, devis, stocks…  (⌘K)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-[var(--border)] rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <OrgSwitcher />
            <CommandCenter />
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="p-2 rounded-xl border border-[var(--border)] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary)]" />
            </Link>
            <Link
              href="/"
              title="Site vitrine"
              className="hidden sm:inline-flex p-2 rounded-xl border border-[var(--border)] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe size={16} />
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 p-1 rounded-xl border border-[var(--border)] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors pl-2 pr-3"
            >
              <div className="w-6 h-6 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold">
                SB
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline">
                Admin
              </span>
              <ChevronDown size={13} className="text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
