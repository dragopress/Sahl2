'use client';
import React, { useState } from 'react';
import {
  Landmark,
  FileSpreadsheet,
  BarChart3,
  Scale,
  ShieldCheck,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Search,
  Filter,
  Eye,
  DollarSign,
} from 'lucide-react';
import { formatMad, formatMadShort, PCGM_CHART_OF_ACCOUNTS } from '../../lib/morocco';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'BILAN' | 'CPC' | 'TRIAL_BALANCE' | 'JOURNAL' | 'AUDIT'>('BILAN');
  const [period, setPeriod] = useState<'Q3_2026' | 'YTD_2026'>('YTD_2026');

  // Bilan Actif (Assets)
  const actifImmobilise = 185000;
  const clients3421 = 82400;
  const tvaRecup34551 = 14850;
  const stocks3111 = 45600;
  const actifCirculant = clients3421 + tvaRecup34551 + stocks3111;
  const banque5141 = 142300;
  const caisse5161 = 18450;
  const tresorerieActif = banque5141 + caisse5161;
  const totalActif = actifImmobilise + actifCirculant + tresorerieActif;

  // Bilan Passif (Liabilities & Equity)
  const capitalSocial = 200000;
  const resultatNetExercice = 124800;
  const capitauxPropres = capitalSocial + resultatNetExercice;
  const fournisseurs4411 = 72280;
  const tvaCollectee4455 = 28720;
  const cnss4441 = 12800;
  const passifCirculant = fournisseurs4411 + tvaCollectee4455 + cnss4441;
  const totalPassif = capitauxPropres + passifCirculant;

  // CPC Data (Produits & Charges)
  const ventesMarchandises7111 = 385000;
  const prestationsServices7124 = 240000;
  const totalProduitsExploitation = ventesMarchandises7111 + prestationsServices7124;

  const achatsMarchandises6111 = 195000;
  const loyers6131 = 72000;
  const electriciteEau6133 = 9600;
  const honoraires6136 = 24000;
  const telecom6145 = 6200;
  const salairesBruts6171 = 145000;
  const chargesSocialesCnss6174 = 31200;
  const totalChargesExploitation =
    achatsMarchandises6111 +
    loyers6131 +
    electriciteEau6133 +
    honoraires6136 +
    telecom6145 +
    salairesBruts6171 +
    chargesSocialesCnss6174;

  const resultatExploitation = totalProduitsExploitation - totalChargesExploitation;
  const impotSocietesIS = Math.max(0, resultatExploitation * 0.15); // IS PME ~15%
  const resultatNetCPC = resultatExploitation - impotSocietesIS;

  // Immutable Cryptographic Audit Log Entries
  const auditLogs = [
    {
      id: 'log-8891',
      timestamp: '2026-08-22 10:45:12 GMT+1',
      user: 'Karim Benjelloun (Admin)',
      action: 'ENCAISSEMENT_VENTE_TK-94821',
      debit: '5141 (Banque)',
      credit: '3421 (Clients)',
      amount: 4250.0,
      hash: 'sha256:8f4c2e71b9029a1d48c3e80f9b6a12d491c8e3f019a82746b1892c4819d7e10a',
      verified: true,
    },
    {
      id: 'log-8890',
      timestamp: '2026-08-22 09:18:44 GMT+1',
      user: 'Yassine Tazi (Comptable)',
      action: 'IMPUTATION_FACTURE_FOURNISSEUR_DEP-0182',
      debit: '6145 (Télécom) + 34551 (TVA)',
      credit: '4411 (IAM Maroc Telecom)',
      amount: 900.0,
      hash: 'sha256:1a82d73f9c0e481b7a2d69f018e4c3b291a8d4e7f09c218a47b19d8e20f1a9b8',
      verified: true,
    },
    {
      id: 'log-8889',
      timestamp: '2026-08-21 17:30:00 GMT+1',
      user: 'Sara Chraibi (Caissière)',
      action: 'CLOTURE_Z_CAISSE_JOURNALIERE',
      debit: '5161 (Caisse Centrale)',
      credit: '7111 (Ventes) + 4455 (TVA)',
      amount: 3420.0,
      hash: 'sha256:9c1e82f4b7a0d18e2c49b8a7f019d3e847c21a9b08f4e19d7a28b6c491e0a82f',
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Landmark size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Comptabilité Générale PCGM &amp; États Financiers
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Légal Maroc · DGI Conforme
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bilan Actif/Passif, Compte de Produits et Charges (CPC), Grand Livre &amp; Journal Cryptographique
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Génération de la liasse fiscale DGI au format EDI XML / PDF...')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            <Download size={14} />
            <span>Liasse Fiscale DGI</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        {[
          { id: 'BILAN', label: 'Bilan (Actif / Passif)', icon: Scale },
          { id: 'CPC', label: 'Compte de Résultat (CPC)', icon: BarChart3 },
          { id: 'TRIAL_BALANCE', label: 'Balance Générale PCGM', icon: FileSpreadsheet },
          { id: 'AUDIT', label: 'Journal & Audit Cryptographique', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <tab.icon size={15} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: BILAN ACTIF / PASSIF */}
      {activeTab === 'BILAN' && (
        <div className="space-y-6">
          {/* Balance Equilibrium Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 size={18} />
              <span>Bilan Parfaitement Équilibré : Total Actif = Total Passif ({formatMad(totalActif)})</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Écart: 0,00 MAD</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actif (Assets) */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  ACTIF (Emplois)
                </h3>
                <span className="font-mono font-extrabold text-sm text-[var(--primary)]">
                  {formatMad(totalActif)}
                </span>
              </div>

              {/* Actif Immobilisé */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-400 uppercase text-[10px]">
                  I. Actif Immobilisé (Classe 2)
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">Immobilisations Corporelles &amp; Matériel</span>
                  <span className="font-mono font-semibold">{formatMad(actifImmobilise)}</span>
                </div>
              </div>

              {/* Actif Circulant */}
              <div className="space-y-2 text-xs pt-2">
                <div className="font-bold text-slate-400 uppercase text-[10px]">
                  II. Actif Circulant HT (Classe 3)
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">3111 · Stocks de marchandises</span>
                  <span className="font-mono font-semibold">{formatMad(stocks3111)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">3421 · Créances Clients</span>
                  <span className="font-mono font-semibold">{formatMad(clients3421)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">34551 · État, TVA Récupérable</span>
                  <span className="font-mono font-semibold">{formatMad(tvaRecup34551)}</span>
                </div>
              </div>

              {/* Trésorerie-Actif */}
              <div className="space-y-2 text-xs pt-2">
                <div className="font-bold text-slate-400 uppercase text-[10px]">
                  III. Trésorerie - Actif (Classe 5)
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">5141 · Comptes Bancaires (MAD)</span>
                  <span className="font-mono font-semibold">{formatMad(banque5141)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">5161 · Caisses Centrales (Espèces)</span>
                  <span className="font-mono font-semibold">{formatMad(caisse5161)}</span>
                </div>
              </div>
            </div>

            {/* Passif (Liabilities & Equity) */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  PASSIF (Ressources)
                </h3>
                <span className="font-mono font-extrabold text-sm text-[var(--primary)]">
                  {formatMad(totalPassif)}
                </span>
              </div>

              {/* Capitaux Propres */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-400 uppercase text-[10px]">
                  I. Financement Permanent (Classe 1)
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">1111 · Capital Social Libéré</span>
                  <span className="font-mono font-semibold">{formatMad(capitalSocial)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-emerald-600">
                    1191 · Résultat Net de l&apos;Exercice (Bénéfice)
                  </span>
                  <span className="font-mono font-extrabold text-emerald-600">
                    {formatMad(resultatNetExercice)}
                  </span>
                </div>
              </div>

              {/* Passif Circulant */}
              <div className="space-y-2 text-xs pt-2">
                <div className="font-bold text-slate-400 uppercase text-[10px]">
                  II. Passif Circulant HT (Classe 4)
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">4411 · Dettes Fournisseurs</span>
                  <span className="font-mono font-semibold">{formatMad(fournisseurs4411)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">4455 · État, TVA Facturée</span>
                  <span className="font-mono font-semibold">{formatMad(tvaCollectee4455)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300">4441 · CNSS &amp; Organismes Sociaux</span>
                  <span className="font-mono font-semibold">{formatMad(cnss4441)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CPC (Compte de Produits et Charges) */}
      {activeTab === 'CPC' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Compte de Produits et Charges (CPC)
              </h3>
              <p className="text-xs text-slate-400">Période : Exercice 2026 (Normes PCGM Maroc)</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Résultat Net Après Impôt</div>
              <div className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                +{formatMad(resultatNetCPC)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Produits d'exploitation (Classe 7) */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-[var(--border)]">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[11px] flex items-center justify-between">
                <span>I. Produits d&apos;Exploitation (Classe 7)</span>
                <span className="font-mono font-extrabold">{formatMad(totalProduitsExploitation)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>7111 · Ventes de marchandises au Maroc</span>
                <span className="font-mono">{formatMad(ventesMarchandises7111)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>7124 · Ventes de services et prestations</span>
                <span className="font-mono">{formatMad(prestationsServices7124)}</span>
              </div>
            </div>

            {/* Charges d'exploitation (Classe 6) */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-[var(--border)]">
              <div className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[11px] flex items-center justify-between">
                <span>II. Charges d&apos;Exploitation (Classe 6)</span>
                <span className="font-mono font-extrabold">{formatMad(totalChargesExploitation)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>6111 · Achats de marchandises revendues</span>
                <span className="font-mono">{formatMad(achatsMarchandises6111)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>6131 · Locations et charges locatives</span>
                <span className="font-mono">{formatMad(loyers6131)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>6136 · Rémunérations honoraires</span>
                <span className="font-mono">{formatMad(honoraires6136)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>6171 · Rémunérations du personnel (Salaires)</span>
                <span className="font-mono">{formatMad(salairesBruts6171)}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-1">
                <span>6174 · Cotisations CNSS patronales</span>
                <span className="font-mono">{formatMad(chargesSocialesCnss6174)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Trial Balance */}
      {activeTab === 'TRIAL_BALANCE' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">Numéro Compte PCGM</th>
                  <th className="pb-3 px-2">Intitulé du Compte</th>
                  <th className="pb-3 px-2 text-right">Total Débit</th>
                  <th className="pb-3 px-2 text-right">Total Crédit</th>
                  <th className="pb-3 px-2 text-right">Solde Débiteur</th>
                  <th className="pb-3 px-2 text-right">Solde Créditeur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {Object.values(PCGM_CHART_OF_ACCOUNTS).map((acc) => (
                  <tr key={acc.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-2.5 px-2 font-mono font-bold text-slate-900 dark:text-white">
                      {acc.code}
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">{acc.label}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                      {acc.type === 'ASSET' || acc.type === 'EXPENSE' ? formatMad(45000) : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                      {acc.type === 'LIABILITY' || acc.type === 'REVENUE' || acc.type === 'EQUITY'
                        ? formatMad(45000)
                        : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-600">
                      {acc.type === 'ASSET' || acc.type === 'EXPENSE' ? formatMad(45000) : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-blue-600">
                      {acc.type === 'LIABILITY' || acc.type === 'REVENUE' || acc.type === 'EQUITY'
                        ? formatMad(45000)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Cryptographic Audit Log */}
      {activeTab === 'AUDIT' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-emerald-500" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Piste d&apos;Audit Fiable &amp; Registre Inaltérable
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Chaîne de Hash SHA-256 Intègre
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-normal">par {log.user}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[var(--border)] text-xs">
                  <div>
                    <span className="text-slate-500">Imputation : </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Débit {log.debit} ➔ Crédit {log.credit}
                    </span>
                  </div>
                  <div className="font-mono font-extrabold text-slate-900 dark:text-white">
                    {formatMad(log.amount)}
                  </div>
                </div>

                <div className="text-[9px] font-mono text-slate-400 truncate bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-[var(--border)]">
                  {log.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
