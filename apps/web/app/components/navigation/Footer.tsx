import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Receipt,
  Sparkles,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-black border-t border-slate-800">
      {/* Top Banner: Moroccan Fiscal & Legal Compliance */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="font-semibold text-white block">Conforme DGI & CGI</span>
                <span className="text-slate-400 text-[11px]">
                  Articles 89–100 (TVA) et Art. 193 (Plafond espèces 5 000 MAD)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <FileCheck size={18} />
              </div>
              <div>
                <span className="font-semibold text-white block">Normes PCGM & SIMPL</span>
                <span className="text-slate-400 text-[11px]">
                  Plan Comptable Général Marocain (Classes 1 à 7) & Export SIMPL-TVA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <span className="font-semibold text-white block">Protection des Données</span>
                <span className="text-slate-400 text-[11px]">
                  Conformité stricte Loi n° 09-08 (CNDP) & Chiffrement SHA-256
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-700/20">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white">
                  Sahl<span className="text-emerald-400">Biz</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Le système d&apos;exploitation des TPME & Commerces au Maroc
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SahlBiz centralise la facturation légale, la caisse tactile POS, le recouvrement Kreddy, la gestion des achats et la comptabilité marocaine au sein d&apos;une plateforme unifiée 100% conforme à la législation fiscale en vigueur.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400 flex-shrink-0" />
                <span>Casablanca Finance City & Technopark, Maroc</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-400 flex-shrink-0" />
                <span>contact@sahlbiz.ma | support@sahlbiz.ma</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 flex-shrink-0" />
                <span>+212 (0) 5 22 00 00 00 (Lundi - Samedi, 8h30 - 19h)</span>
              </div>
            </div>
          </div>

          {/* Col 1: Modules & Produits */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Modules Métiers
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/pos" className="hover:text-emerald-400 transition-colors">
                  Caisse POS & Z-Report
                </Link>
              </li>
              <li>
                <Link href="/invoices" className="hover:text-emerald-400 transition-colors">
                  Facturation & Devis Maroc
                </Link>
              </li>
              <li>
                <Link href="/kreddy" className="hover:text-emerald-400 transition-colors">
                  Kreddy & Relance WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/expenses" className="hover:text-emerald-400 transition-colors">
                  OCR Factures Fournisseurs
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-emerald-400 transition-colors">
                  Gestion des Stocks & Alertes
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-emerald-400 transition-colors">
                  Comptabilité PCGM & Bilan
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                  Chantiers & Rentabilité
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Fiscalité & Conformité Maroc */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Fiscalité & Normes
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="#compliance" className="hover:text-emerald-400 transition-colors">
                  Conformité DGI Maroc
                </Link>
              </li>
              <li>
                <Link href="#compliance" className="hover:text-emerald-400 transition-colors">
                  Vérificateur ICE 15 Chiffres
                </Link>
              </li>
              <li>
                <Link href="/finance/vat" className="hover:text-emerald-400 transition-colors">
                  Taux TVA (0%, 7%, 10%, 14%, 20%)
                </Link>
              </li>
              <li>
                <Link href="#compliance" className="hover:text-emerald-400 transition-colors">
                  Plafond Espèces Art. 193 CGI
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-emerald-400 transition-colors">
                  Plan Comptable PCGM (1 à 7)
                </Link>
              </li>
              <li>
                <Link href="/finance/vat" className="hover:text-emerald-400 transition-colors">
                  Télédéclaration SIMPL-TVA
                </Link>
              </li>
              <li>
                <Link href="#compliance" className="hover:text-emerald-400 transition-colors">
                  Audit Trail Cryptographique
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ressources & Légal */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Légal & Sécurité
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Espace Client Sécurisé
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-emerald-400 transition-colors">
                  Protection Loi 09-08 (CNDP)
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-emerald-400 transition-colors">
                  Conditions Générales d&apos;Utilisation
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-emerald-400 transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-emerald-400 transition-colors">
                  Sauvegardes Quotidiennes & SLA 99.9%
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Accès Démo Directe</span>
                  <ExternalLink size={11} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Avis de Conformité Légale & Réglementaire au Royaume du Maroc</span>
            </div>
            <p>
              SahlBiz est conçu pour assister les entreprises marocaines (Sociétés SARL, SARL-AU, SA, SNC, Auto-entrepreneurs et Personnes Physiques) dans le strict respect des lois fiscales nationales (Code Général des Impôts - CGI, dispositions de la Loi de Finances annuelle, directives de la Direction Générale des Impôts - DGI).
            </p>
            <p>
              Le logiciel intègre la validation obligatoire de l&apos;Identifiant Commun de l&apos;Entreprise (ICE) à 15 chiffres, le blocage préventif des paiements en espèces dépassant 5 000 MAD (Art. 193 CGI), la génération d&apos;écritures équilibrées selon le Plan Comptable Général Marocain (PCGM) et la protection absolue des données à caractère personnel conformément aux exigences de la CNDP (Loi n° 09-08).
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} SahlBiz Maroc SARL. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>RC Casablanca 498214</span>
            <span>•</span>
            <span>IF 52918402</span>
            <span>•</span>
            <span>ICE 002938471000084</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Fait avec fierté au Maroc 🇲🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
