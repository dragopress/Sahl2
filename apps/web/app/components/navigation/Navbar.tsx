'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Receipt,
  CreditCard,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import ThemeSwitcher from '../../theme-switcher';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featureItems = [
    {
      title: 'Caisse POS Tactile & Z-Report',
      desc: 'Gestion des ventes au comptoir, tickets thermiques et multi-règlements.',
      href: '/pos',
      icon: <Receipt className="text-emerald-600 dark:text-emerald-400" size={18} />,
    },
    {
      title: 'Facturation & Devis Maroc',
      desc: 'Mentions légales DGI, validation ICE 15 chiffres, conversion 1-clic.',
      href: '/invoices',
      icon: <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={18} />,
    },
    {
      title: 'Kreddy & Recouvrement',
      desc: 'Suivi des carnets de crédit, balance âgée et relances WhatsApp en Darija.',
      href: '/kreddy',
      icon: <CreditCard className="text-amber-600 dark:text-amber-400" size={18} />,
    },
    {
      title: 'Comptabilité PCGM & Bilan',
      desc: 'Plan comptable marocain, Bilan, CPC et télédéclaration SIMPL-TVA.',
      href: '/finance',
      icon: <FileSpreadsheet className="text-purple-600 dark:text-purple-400" size={18} />,
    },
    {
      title: 'Achats & Dépenses OCR',
      desc: 'Numérisation intelligente des factures fournisseurs et conformité 5k MAD.',
      href: '/expenses',
      icon: <Building2 className="text-teal-600 dark:text-teal-400" size={18} />,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs'
          : 'bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Sahl<span className="text-emerald-600 dark:text-emerald-400">Biz</span>
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={10} />
                  DGI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                Business OS Maroc
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Fonctionnalités</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    featuresDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {featuresDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Modules Opérationnels Maroc
                    </span>
                  </div>
                  <div className="space-y-1">
                    {featureItems.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="#why-sahlbiz"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Pourquoi SahlBiz
            </Link>

            <Link
              href="#compliance"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <span>Conformité DGI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </Link>

            <Link
              href="#pricing"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Tarifs
            </Link>

            <Link
              href="#faq"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitcher compact />

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Connexion
            </Link>

            <Link
              href="/dashboard"
              id="header-cta-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-95"
            >
              <span>Essai Gratuit 14 Jours</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeSwitcher compact />
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1">
              Navigation
            </div>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Fonctionnalités & Modules
            </Link>
            <Link
              href="#why-sahlbiz"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Pourquoi SahlBiz (Conformité)
            </Link>
            <Link
              href="#compliance"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Conformité Fiscale DGI & CGI
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Grille Tarifaire (MAD)
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Questions Fréquentes
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Se Connecter
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20"
            >
              <span>Démarrer l&apos;essai gratuit</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
