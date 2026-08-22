'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Receipt,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Smartphone,
  Send,
  Zap,
  Lock,
  FileCheck,
  Search,
  Check,
  HelpCircle,
  ChevronDown,
  Clock,
  Coins,
  Store,
  BarChart3,
  Users,
  Percent,
  Printer,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';
import Section from './components/ui/Section';
import StatCard from './components/ui/StatCard';
import { MOROCCAN_VAT_RATES } from './lib/morocco';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [activeHeroTab, setActiveHeroTab] = useState<'pos' | 'invoicing' | 'kreddy' | 'cpc' | 'ocr'>('pos');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Tax Simulator State
  const [simMonthlyRevenue, setSimMonthlyRevenue] = useState(120000);
  const [simGrossMarginPercent, setSimGrossMarginPercent] = useState(35);
  const [simVatRate, setSimVatRate] = useState(20);
  const [simOperatingExpenses, setSimOperatingExpenses] = useState(18000);

  // Derived simulator calculations
  const simPurchasesHT = simMonthlyRevenue * (1 - simGrossMarginPercent / 100);
  const simVatCollected = (simMonthlyRevenue * simVatRate) / 100;
  const simVatDeductible = ((simPurchasesHT + simOperatingExpenses) * simVatRate) / 100;
  const simNetVatPayable = Math.max(0, simVatCollected - simVatDeductible);
  const simGrossProfit = simMonthlyRevenue - simPurchasesHT;
  const simNetOperatingProfit = simGrossProfit - simOperatingExpenses;
  const simAnnualProfitEstimate = simNetOperatingProfit * 12;

  // Moroccan IS brackets calculation
  let simEstimatedAnnualIS = 0;
  if (simAnnualProfitEstimate <= 300000) {
    simEstimatedAnnualIS = simAnnualProfitEstimate * 0.10;
  } else if (simAnnualProfitEstimate <= 1000000) {
    simEstimatedAnnualIS = 30000 + (simAnnualProfitEstimate - 300000) * 0.20;
  } else {
    simEstimatedAnnualIS = 30000 + 140000 + (simAnnualProfitEstimate - 1000000) * 0.35;
  }

  const faqItems = [
    {
      q: "SahlBiz est-il 100% conforme aux exigences de la DGI et du Code Général des Impôts (CGI) ?",
      a: "Absolument. SahlBiz intègre nativement toutes les exigences réglementaires marocaines : validation systématique de l'ICE à 15 chiffres, mentions légales obligatoires (IF, RC, Patente, CNSS, Capital Social), ventilation selon les taux de TVA marocains (0%, 7%, 10%, 14%, 20%), alerte de plafonnement des espèces à 5 000 MAD (Art. 193 CGI) et journal d'audit immuable SHA-256.",
    },
    {
      q: "Comment fonctionne la validation de l'ICE (Identifiant Commun de l'Entreprise) ?",
      a: "Chaque ICE saisi est vérifié instantanément par notre algorithme de validation selon les règles de la DGI (15 chiffres, clé de contrôle et statut fiscal). Cela vous protège contre tout risque de rejet de déductibilité de charges lors de vos déclarations fiscales.",
    },
    {
      q: "Qu'est-ce que le module 'Kreddy' et comment s'effectue la relance WhatsApp ?",
      a: "Kreddy digitalise le traditionnel 'carnet de crédit' (karné) des commerces et TPME marocains. Il calcule automatiquement la balance âgée de vos créances (0-30j, 31-60j, 61-90j, >90j) et vous permet d'envoyer en 1 clic un rappel personnalisé par WhatsApp en Darija marocaine (en caractères arabes ou latins) ou en Français courtois.",
    },
    {
      q: "Mon expert-comptable ou fiduciaire peut-il exploiter directement les données ?",
      a: "Oui. Toutes vos ventes, achats et opérations de caisse sont imputés automatiquement selon le Plan Comptable Général Marocain (PCGM - Classes 1 à 7). Vous pouvez exporter en un clic le Grand Livre, la Balance, le Bilan Actif/Passif, le CPC et le fichier de télédéclaration SIMPL-TVA.",
    },
    {
      q: "Comment fonctionne l'alerte sur le plafond de 5 000 MAD en espèces (Art. 193 CGI) ?",
      a: "Dès qu'une transaction au comptant ou en caisse POS atteint ou dépasse 5 000 MAD TTC, SahlBiz affiche une alerte de conformité fiscale invitant à fractionner ou à privilégier un mode de règlement bancaire (Virement, Chèque, Carte CMI) afin de préserver la déductibilité fiscale.",
    },
    {
      q: "Mes données sont-elles sécurisées et protégées selon la loi 09-08 de la CNDP ?",
      a: "Oui. Toutes vos données sont hébergées sur des infrastructures sécurisées avec chiffrement de bout en bout et sauvegardes automatiques quotidiennes. SahlBiz applique scrupuleusement les exigences de la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP - Loi n° 09-08).",
    },
    {
      q: "Peut-on utiliser SahlBiz sur tablette ou smartphone au point de vente ?",
      a: "Parfaitement. L'interface de caisse POS et le tableau de bord sont 100% responsives et fonctionnent de manière fluide sur ordinateurs de bureau, tablettes iPad / Android et smartphones, avec support des imprimantes thermiques 80mm et 58mm.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Shared Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conforme DGI • Code Général des Impôts & PCGM Maroc</span>
              <span className="hidden sm:inline text-emerald-400">•</span>
              <span className="hidden sm:inline font-medium">Loi de Finances 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Le Système d&apos;Exploitation Intégré des{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
                TPME & Commerces
              </span>{' '}
              au Maroc
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Caisse tactile POS, facturation certifiée DGI avec validation ICE, gestion des créances Kreddy avec relance WhatsApp en Darija, et comptabilité marocaine unifiée.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                id="hero-primary-cta-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all active:scale-95"
              >
                <span>Démarrer l&apos;essai gratuit (14 jours)</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#interactive-demo"
                id="hero-secondary-cta-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-base shadow-xs transition-all"
              >
                <span>Voir la Démo Interactive</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                Validation ICE 15 Chiffres
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                Plafond Espèces Art. 193 (5 000 MAD)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                Plan Comptable PCGM (1-7)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                Relance Kreddy WhatsApp
              </span>
            </div>
          </div>

          {/* Interactive Hero Preview Frame */}
          <div id="interactive-demo" className="mt-14 sm:mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-xs">
              {/* Window Bar */}
              <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      sahlbiz-maroc-app.live
                    </span>
                  </div>

                  {/* Interactive Demo Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('pos')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeHeroTab === 'pos'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Caisse POS & Z-Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('invoicing')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeHeroTab === 'invoicing'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Facturation & ICE
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('kreddy')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeHeroTab === 'kreddy'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Kreddy (WhatsApp)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('cpc')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        activeHeroTab === 'cpc'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      Bilan & CPC PCGM
                    </button>
                  </div>
                </div>

                {/* Tab Content Display */}
                <div className="pt-5 min-h-[360px] flex flex-col justify-between">
                  {activeHeroTab === 'pos' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-white">Vente en cours #POS-2026-084</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            Caisse Ouverte
                          </span>
                        </div>
                        <div className="space-y-2 bg-slate-950/80 rounded-xl p-3 border border-slate-800">
                          <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                            <div>
                              <div className="font-medium text-slate-200">Huile d&apos;Olive Extra Vierge 5L (Terroir Atlas)</div>
                              <div className="text-[10px] text-slate-400">Qte: 2 x 140.00 MAD (TVA 20%)</div>
                            </div>
                            <span className="font-mono font-bold text-emerald-400">280.00 MAD</span>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                            <div>
                              <div className="font-medium text-slate-200">Couscous Fin Beldi 10kg</div>
                              <div className="text-[10px] text-slate-400">Qte: 1 x 95.00 MAD (TVA 0%)</div>
                            </div>
                            <span className="font-mono font-bold text-emerald-400">95.00 MAD</span>
                          </div>
                          <div className="flex items-center justify-between text-xs py-1.5">
                            <div>
                              <div className="font-medium text-slate-200">Thé Vert Gunpowder Qualité Supérieure</div>
                              <div className="text-[10px] text-slate-400">Qte: 3 x 28.00 MAD (TVA 14%)</div>
                            </div>
                            <span className="font-mono font-bold text-emerald-400">84.00 MAD</span>
                          </div>
                        </div>

                        {/* Article 193 Compliance Banner */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300">
                          <span className="flex items-center gap-1.5 font-medium">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            Total TTC : 459.00 MAD &lt; Plafond Espèces Art. 193 (5 000 MAD)
                          </span>
                          <span className="text-emerald-400 font-bold">100% Conforme</span>
                        </div>
                      </div>

                      {/* Payment Allocation */}
                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-300 mb-2">Modes de Paiement</div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400">Espèces</span>
                              <span className="font-mono font-bold text-white">200.00 MAD</span>
                            </div>
                            <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400">Terminal CMI</span>
                              <span className="font-mono font-bold text-white">259.00 MAD</span>
                            </div>
                            <div className="flex justify-between p-2 rounded bg-slate-900/40 border border-slate-800/50 text-slate-500">
                              <span>Kreddy (Crédit)</span>
                              <span className="font-mono">0.00 MAD</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          href="/pos"
                          className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Printer size={14} />
                          <span>Valider & Imprimer Ticket Z</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'invoicing' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Facture Vente #FAC-2026-0042</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              Payée
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Client : ATLAS LOGISTICS SARL • Casablanca
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-400 text-sm">48 600.00 MAD TTC</div>
                          <div className="text-[10px] text-slate-400">TVA 20% incluse (8 100 MAD)</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">ICE Client (15 chiffres)</span>
                          <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1">
                            <BadgeCheck size={13} />
                            002847192000049
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Identifiant Fiscal (IF)</span>
                          <span className="font-mono text-slate-300">49182740</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Registre Commerce (RC)</span>
                          <span className="font-mono text-slate-300">51294 Casablanca</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Règlement</span>
                          <span className="font-medium text-slate-300">Virement Attijariwafa</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400">Workflow 1-clic : Devis ➔ BC ➔ BL ➔ Facture ➔ Écriture PCGM</span>
                        <Link href="/invoices" className="text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                          <span>Accéder aux Factures</span>
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'kreddy' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Total Kreddy En Cours</span>
                          <span className="font-mono font-bold text-amber-400 text-lg">34 850 MAD</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">14 clients au carnet</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Retard &gt; 30 Jours</span>
                          <span className="font-mono font-bold text-rose-400 text-lg">8 200 MAD</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">3 relances requises</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Taux de Recouvrement</span>
                          <span className="font-mono font-bold text-emerald-400 text-lg">91.4%</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">+28% ce mois</span>
                        </div>
                      </div>

                      {/* WhatsApp Reminder Preview */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <Send size={13} />
                            Relance WhatsApp 1-Clic (Darija Marocaine)
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Client: Si Mohamed Tazi (2 400 MAD)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800/80 leading-relaxed">
                          &quot;Salam Si Mohamed, netmenna tkoun bikhir. Rappel m3ak 3la le solde de 2 400 MAD dyal la commande du 10/08. Chokran lik.&quot;
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link href="/kreddy" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                          <span>Ouvrir le Carnet Kreddy</span>
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'cpc' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Chiffre d&apos;Affaires HT (711)</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">480 000 MAD</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Achats Consommés (611)</span>
                          <span className="font-mono font-bold text-slate-200 text-sm">290 000 MAD</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Charges d&apos;Exploit. (613/614)</span>
                          <span className="font-mono font-bold text-slate-200 text-sm">62 000 MAD</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Résultat Net d&apos;Exploit.</span>
                          <span className="font-mono font-bold text-teal-300 text-sm">128 000 MAD</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="text-emerald-400" size={16} />
                          <div>
                            <span className="font-bold text-white">Bilan Actif/Passif & CPC PCGM</span>
                            <span className="text-slate-400 text-[11px] block">Équilibré en temps réel (Total Actif = Total Passif)</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                          Export SIMPL-TVA Prêt
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <Link href="/finance" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                          <span>Consulter les États Comptables</span>
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Bottom Strip */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-400" />
                      Environnement Chiffré & Sauvegarde Quotidienne CNDP
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <span>Tester l&apos;application complète</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reusable StatCards Section: Proven ROI & Performance */}
      <Section
        id="metrics"
        background="muted"
        title="La solution préférée des TPME marocaines pour sécuriser leur gestion"
        subtitle="Des résultats concrets mesurés auprès de plus de 1 200 commerçants, ateliers et PME au Maroc."
        centered
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            id="stat-recovery"
            label="Recouvrement Créances Kreddy"
            value="+32%"
            change="14 jours"
            changeType="positive"
            trendLabel="vs 48j moyenne marocaine"
            icon={<CreditCard size={20} />}
            description="Réduction drastique des impayés grâce aux rappels WhatsApp en Darija."
            badge="ROI Immédiat"
          />

          <StatCard
            id="stat-compliance"
            label="Risque de Rejet Fiscal DGI"
            value="0%"
            change="100% Conforme"
            changeType="positive"
            trendLabel="ICE + Mentions légales"
            icon={<ShieldCheck size={20} />}
            description="Contrôle systématique des 15 chiffres ICE et plafonnement des espèces."
            variant="highlight"
          />

          <StatCard
            id="stat-pos"
            label="Gain de Temps en Caisse & Clôture"
            value="45 min/j"
            change="-80%"
            changeType="positive"
            trendLabel="Erreurs de caisse"
            icon={<Receipt size={20} />}
            description="Rapport Z automatique, pointage des encaissements CMI et espèces."
          />

          <StatCard
            id="stat-accounting"
            label="Clôture Comptable & SIMPL-TVA"
            value="1 Clic"
            change="PCGM 1-7"
            changeType="positive"
            trendLabel="Écritures équilibrées"
            icon={<FileSpreadsheet size={20} />}
            description="Grand Livre et Bilan directement exploitables par votre fiduciaire."
          />
        </div>
      </Section>

      {/* Why SahlBiz: Moroccan Tax & Legal Compliance Section */}
      <Section
        id="why-sahlbiz"
        background="default"
        badge="Fiscalité & DGI Maroc"
        badgeIcon={<ShieldCheck size={14} />}
        title="Pourquoi choisir SahlBiz face aux logiciels génériques étrangers ?"
        subtitle="Un ERP étranger ne connaît ni l'ICE, ni l'Article 193 du CGI, ni le carnet Kreddy. SahlBiz a été pensé dès le premier jour pour les spécificités économiques et légales du Maroc."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: ICE Validation */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <BadgeCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Validation Stricte de l&apos;ICE (15 Chiffres)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Vérification automatique de l&apos;Identifiant Commun de l&apos;Entreprise dès la création d&apos;un client ou fournisseur. Évite tout rejet de déductibilité fiscale de vos factures par les inspecteurs de la DGI.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Conforme Directive DGI</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 2: Article 193 CGI */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Plafond Espèces Art. 193 CGI (5 000 MAD)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Alerte intelligente et verrouillage de conformité lorsqu&apos;un paiement en espèces dépasse 5 000 MAD TTC, garantissant que vos charges restent 100% déductibles de l&apos;Impôt sur les Sociétés (IS).
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>Protection Déductibilité IS</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 3: Real VAT Rates */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <Percent size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Taux de TVA Marocains Exacts (CGI)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Prise en charge intégrale des taux officiels (0%, 7%, 10%, 14%, 20%) avec ventilation automatique entre TVA collectée et déductible, prête pour l&apos;exportation sur le portail SIMPL-TVA.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Articles 89 à 100 CGI</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 4: PCGM Standard */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-800">
              <FileSpreadsheet size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Plan Comptable Général Marocain (PCGM)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Chaque opération génère des écritures en partie double équilibrées (Classes 1 à 7). Votre fiduciaire reçoit des exports propres sans ressaisie manuelle.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>Classes 1 à 7 Standardisées</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 5: Kreddy Darija */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-800">
              <Smartphone size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Kreddy & Relance WhatsApp en Darija
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Remplacez les carnets papier par un suivi digitalisé des dettes clients. Envoyez des messages de courtoisie par WhatsApp en Darija marocaine ou Français en 1 clic.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span>Adapté aux Usages Marocains</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 6: Audit & Security */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Journal d&apos;Audit Immuable SHA-256
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Traçabilité inaltérable de chaque facture émise, modification et rapport Z. Conforme aux standards de sécurité les plus rigoureux et à la Loi 09-08 de la CNDP.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Preuve d&apos;Intégrité Légale</span>
              <Check size={14} />
            </div>
          </div>
        </div>
      </Section>

      {/* Feature Overview: Deep Dive Modules */}
      <Section
        id="features"
        background="subtle"
        badge="Modules Intégrés"
        badgeIcon={<Layers size={14} />}
        title="Tout ce dont votre entreprise a besoin au quotidien"
        subtitle="Un écosystème modulaire et intuitif où chaque outil communique avec les autres en temps réel."
        centered
      >
        <div className="space-y-12 sm:space-y-16">
          {/* Module 1: POS & Caisse */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Receipt size={14} />
                Point de Vente & Caisse Tactile
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Encaissez rapidement, clôturez sans stress avec le Z-Report automatique
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Conçue pour les commerces de détail, supérettes, quincailleries, grossistes et artisans. Supporte le scan code-barres rapide, l&apos;impression thermique de tickets 80mm/58mm et les paiements fractionnés (Espèces, Terminal CMI, Virement, Crédit Kreddy).
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Rapport Z journalier avec détection automatique des écarts de caisse.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Alerte visuelle immédiate si un paiement espèces dépasse 5 000 MAD (Art. 193).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Mode hors-ligne résilient et synchronisation instantanée au rétablissement réseau.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/pos"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors"
                >
                  <span>Tester le Point de Vente</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual preview */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Store className="text-emerald-600 dark:text-emerald-400" size={18} />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Caisse Principale #01</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Z-Report Prêt
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-500 text-[10px] block">Total Ventes Jour</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">18 450.00 MAD</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-500 text-[10px] block">Nombre de Tickets</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">142 tickets</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Écart de caisse théorique vs réel :</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.00 MAD (Parfait)</span>
              </div>
            </div>
          </div>

          {/* Module 2: Invoicing & Sales Chain */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center lg:flex-row-reverse">
            <div className="space-y-5 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold">
                <FileCheck size={14} />
                Devis, Facturation & Bons de Livraison
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Générez des devis professionnels et convertissez-les en 1 clic
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Plus aucune ressaisie. Votre chaîne commerciale est fluide : <em>Devis ➔ Bon de Commande ➔ Bon de Livraison (BL) ➔ Facture Officielle ➔ Avoir</em>. Vos documents PDF intègrent automatiquement vos mentions légales complètes (ICE, IF, RC, Patente, CNSS).
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Validation automatique de l&apos;ICE client (15 chiffres) pour éviter les rejets.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Calcul précis des remises, acomptes et retenues à la source (RAS).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Envoi direct par email et WhatsApp avec suivi d&apos;ouverture en temps réel.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/invoices"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors"
                >
                  <span>Créer une Facture Conforme</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual preview */}
            <div className="lg:order-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">FACTURE #FAC-2026-0091</span>
                  <span className="text-[10px] text-slate-400 block">SOCIETE TRAVAUX ATLAS SARL</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  ICE Validé
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Total HT :</span>
                  <span>35 000.00 MAD</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>TVA (20%) :</span>
                  <span>7 000.00 MAD</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total TTC :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">42 000.00 MAD</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Mentions légales : IF 491820 • RC 49821 Casablanca</span>
                <span className="text-emerald-500 font-semibold">Téléchargeable PDF A4</span>
              </div>
            </div>
          </div>

          {/* Module 3: Kreddy & OCR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold">
                <Sparkles size={14} />
                OCR Factures & Recouvrement Kreddy
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Numérisez vos factures papier et récupérez votre trésorerie bloquée
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Prenez en photo une facture fournisseur papier : notre moteur OCR extrait automatiquement le nom du fournisseur, son ICE, la date, le montant HT et la TVA. En parallèle, suivez les encours clients sur Kreddy pour ne plus jamais oublier un dirham dehors.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Scan instantané des tickets carburant, quittances et factures fournisseurs.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Balance âgée Kreddy en 4 tranches (0-30j, 31-60j, 61-90j, &gt;90j).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Relances WhatsApp automatiques et personnalisables en Darija & Français.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/kreddy"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-teal-600 dark:hover:bg-teal-400 transition-colors"
                >
                  <span>Découvrir Kreddy</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Visual preview */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="text-teal-600 dark:text-teal-400" size={18} />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Carnet de Recouvrement Kreddy</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Total : 28 400 MAD
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Société BTP Nord</span>
                    <span className="text-[10px] text-slate-500 block">Retard : 18 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-500">6 500 MAD</span>
                    <button type="button" className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Atelier Alami Marrakech</span>
                    <span className="text-[10px] text-slate-500 block">Retard : 4 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">2 800 MAD</span>
                    <button type="button" className="p-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Moroccan Tax & Profit Calculator Section */}
      <Section
        id="tax-simulator"
        background="default"
        badge="Simulateur Fiscal DGI"
        badgeIcon={<Coins size={14} />}
        title="Simulez vos impôts et votre trésorerie nette en direct"
        subtitle="Ajustez vos paramètres mensuels pour estimer immédiatement votre TVA nette exigible, votre résultat d'exploitation et votre barème d'Impôt sur les Sociétés (IS) au Maroc."
        centered
      >
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="sim-revenue-input" className="text-slate-700 dark:text-slate-300">Chiffre d&apos;Affaires Mensuel (HT)</label>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {simMonthlyRevenue.toLocaleString('fr-FR')} MAD
                  </span>
                </div>
                <input
                  id="sim-revenue-input"
                  type="range"
                  min="20000"
                  max="500000"
                  step="5000"
                  value={simMonthlyRevenue}
                  onChange={(e) => setSimMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="sim-margin-input" className="text-slate-700 dark:text-slate-300">Taux de Marge Brute</label>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {simGrossMarginPercent}%
                  </span>
                </div>
                <input
                  id="sim-margin-input"
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={simGrossMarginPercent}
                  onChange={(e) => setSimGrossMarginPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="sim-expenses-input" className="text-slate-700 dark:text-slate-300">Charges & Frais Généraux Mensuels (HT)</label>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {simOperatingExpenses.toLocaleString('fr-FR')} MAD
                  </span>
                </div>
                <input
                  id="sim-expenses-input"
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  value={simOperatingExpenses}
                  onChange={(e) => setSimOperatingExpenses(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sim-vat-rate-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Taux de TVA Principal (CGI)
                </label>
                <div className="grid grid-cols-4 gap-2" id="sim-vat-rate-select">
                  {[0, 7, 10, 20].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSimVatRate(rate)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        simVatRate === rate
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center justify-between">
                  <span>Résultats Fiscaux Estimés</span>
                  <span className="text-[10px] font-normal text-slate-400">Barème DGI 2026</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">TVA Mensuelle Collectée :</span>
                    <span className="font-mono font-bold text-white">
                      {simVatCollected.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} MAD
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">TVA Mensuelle Déductible :</span>
                    <span className="font-mono font-bold text-slate-300">
                      - {simVatDeductible.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} MAD
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-emerald-300 font-semibold">TVA Nette à Verser à l&apos;État :</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {simNetVatPayable.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} MAD/mois
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Résultat d&apos;Exploitation Brut (Annuel) :</span>
                    <span className="font-mono font-bold text-teal-300">
                      {simAnnualProfitEstimate.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} MAD/an
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-amber-300 font-semibold">Estimation Impôt sur Sociétés (IS) :</span>
                    <span className="font-mono font-bold text-amber-400">
                      ~ {simEstimatedAnnualIS.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} MAD/an
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-snug">
                SahlBiz génère automatiquement vos déclarations de TVA et vos écritures de fin d&apos;exercice sans aucune formule manuelle.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Pricing Section */}
      <Section
        id="pricing"
        background="muted"
        badge="Tarification Transparente"
        badgeIcon={<CreditCard size={14} />}
        title="Des forfaits clairs et accessibles pour toutes les TPME"
        subtitle="Tarifs en Dirhams Marocains (MAD). Facturation mensuelle ou annuelle sans engagement. 14 jours d'essai gratuit complet."
        centered
      >
        {/* Toggle Billing Period */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className={`text-sm font-semibold cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Facturation Mensuelle
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={billingPeriod === 'yearly'}
            id="billing-period-toggle-btn"
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              billingPeriod === 'yearly' ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-sm font-semibold flex items-center gap-2 cursor-pointer ${
              billingPeriod === 'yearly'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            onClick={() => setBillingPeriod('yearly')}
          >
            <span>Paiement Annuel</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              -20% Économie
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Plan 1: Starter */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Starter Auto-Entrepreneur / Artisan
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {billingPeriod === 'yearly' ? '119' : '149'}
                </span>
                <span className="text-sm font-semibold text-slate-500">MAD / mois</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Idéal pour les indépendants, artisans et commerçants individuels qui souhaitent facturer proprement.
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Factures & Devis illimités</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Validation ICE 15 chiffres automatique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Caisse POS basique (1 terminal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Kreddy : jusqu&apos;à 25 clients au carnet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Export PDF conforme avec logo</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              id="plan-starter-btn"
              className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-center transition-colors block"
            >
              Commencer l&apos;Essai Gratuit
            </Link>
          </div>

          {/* Plan 2: Pro TPME (Featured) */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-2 border-emerald-500 shadow-2xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
              Le Plus Choisi par les PME
            </div>

            <div className="space-y-4 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Pro TPME & Commerces
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {billingPeriod === 'yearly' ? '239' : '299'}
                </span>
                <span className="text-sm font-semibold text-slate-400">MAD / mois</span>
              </div>
              <p className="text-xs text-slate-300">
                La suite complète pour les boutiques, grossistes, ateliers et sociétés SARL en développement.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2 font-medium">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Tout du plan Starter, plus :</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Caisse POS illimitée + Z-Report auto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Kreddy illimité + Relances WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>OCR Factures Fournisseurs (50/mois)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Gestion des stocks & Alertes de rupture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Comptabilité PCGM (Bilan & CPC en direct)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Jusqu&apos;à 3 utilisateurs avec rôles distincts</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              id="plan-pro-btn"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center shadow-lg shadow-emerald-600/30 transition-all block"
            >
              Essayer Pro Gratuitement (14j)
            </Link>
          </div>

          {/* Plan 3: Entreprise */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Entreprise & Multi-Dépôts
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {billingPeriod === 'yearly' ? '479' : '599'}
                </span>
                <span className="text-sm font-semibold text-slate-500">MAD / mois</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pour les structures multi-magasins, distributeurs et entreprises exigeant un suivi complet.
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 font-medium">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Tout du plan Pro, plus :</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Multi-sociétés & Multi-points de vente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>OCR Factures Fournisseurs illimité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Utilisateurs & Caissiers illimités</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Export SIMPL-TVA & Télédéclarations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Accompagnement & Formation personnalisée</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              id="plan-enterprise-btn"
              className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-center transition-colors block"
            >
              Contacter l&apos;Équipe Ventes
            </Link>
          </div>
        </div>

        {/* Moroccan Invoicing Trust Note */}
        <div className="mt-10 max-w-2xl mx-auto text-center text-xs text-slate-500 dark:text-slate-400">
          Toutes nos formules incluent une facture marocaine officielle avec TVA 20% déductible, votre ICE et IF. Aucun frais caché ni engagement de durée.
        </div>
      </Section>

      {/* FAQ Section */}
      <Section
        id="faq"
        background="default"
        badge="Foire Aux Questions"
        badgeIcon={<HelpCircle size={14} />}
        title="Questions fréquentes sur la conformité et l'utilisation de SahlBiz"
        subtitle="Tout ce que vous devez savoir pour démarrer sereinement au Maroc."
        centered
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* High-Converting Bottom CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-tr from-emerald-900 via-slate-900 to-slate-950 text-white border-t border-emerald-800/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#05966933_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
            <Sparkles size={14} />
            <span>Installation Immédiate • Aucune Carte Bancaire Requise</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Prêt à simplifier la gestion de votre entreprise au Maroc ?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Rejoignez dès aujourd&apos;hui les commerçants, entrepreneurs et artisans qui ont fait le choix de la sérénité fiscale et de la rentabilité avec SahlBiz.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              id="footer-bottom-cta-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Démarrer mon Essai Gratuit (14 jours)</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/pos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-colors"
            >
              <span>Tester la Caisse POS</span>
            </Link>
          </div>

          <div className="pt-4 text-xs text-slate-400 flex items-center justify-center gap-6">
            <span>✓ 100% Conforme DGI & Loi 09-08</span>
            <span>✓ Support client au Maroc (WhatsApp & Téléphone)</span>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
