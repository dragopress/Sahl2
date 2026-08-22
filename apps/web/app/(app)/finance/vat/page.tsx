'use client';
import React, { useState } from 'react';
import {
  Receipt,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
} from 'lucide-react';
import { formatMad, MOROCCAN_VAT_RATES } from '../../../lib/morocco';

export default function VatPage() {
  const [period, setPeriod] = useState<'Q2_2026' | 'Q3_2026'>('Q3_2026');
  const [regime, setRegime] = useState<'ENCAISSEMENT' | 'DEBIT'>('ENCAISSEMENT');

  // Collected VAT (TVA Facturée 4455)
  const collectedVatByRate = [
    { rate: 20, label: '20% - Taux Normal Standard', baseHt: 385000, vatAmount: 77000 },
    { rate: 14, label: '14% - Transport & Énergie MT', baseHt: 42000, vatAmount: 5880 },
    { rate: 10, label: '10% - Hôtellerie & Banques', baseHt: 18000, vatAmount: 1800 },
    { rate: 7, label: '7% - Eau, Électricité & Fournitures', baseHt: 12000, vatAmount: 840 },
    { rate: 0, label: '0% - Exonéré (Exportation)', baseHt: 65000, vatAmount: 0 },
  ];

  const totalCollectedVat = collectedVatByRate.reduce((acc, r) => acc + r.vatAmount, 0);

  // Deductible VAT (TVA Récupérable 34551 & 34552)
  const deductibleCharges34551 = 34200; // Charges d'exploitation
  const deductibleImmobilisations34552 = 18400; // Biens d'investissement
  const reportCreditTvaPrecedent = 4500; // Crédit reporté trimestre précédent
  const totalDeductibleVat = deductibleCharges34551 + deductibleImmobilisations34552 + reportCreditTvaPrecedent;

  const netVatPayable = totalCollectedVat - totalDeductibleVat;
  const isCredit = netVatPayable < 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Receipt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Déclaration de TVA Marocaine (DGI)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Régime des Encaissements
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calcul de la TVA collectée (4455), récupérable (34551/34552) &amp; Télé-déclaration SIMPL-TVA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Génération du fichier EDI XML pour le portail SIMPL-TVA DGI Maroc...')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            <Download size={14} />
            <span>Télé-déclaration SIMPL-TVA XML</span>
          </button>
        </div>
      </div>

      {/* 3 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            I. TVA Collectée / Facturée (4455)
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {formatMad(totalCollectedVat)}
          </div>
          <div className="text-[10px] text-slate-400">Sur chiffre d&apos;affaires encaissé</div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            II. TVA Déductible Totale (3455)
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {formatMad(totalDeductibleVat)}
          </div>
          <div className="text-[10px] text-emerald-500 font-medium">Charges + Immos + Crédit antérieur</div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-500">
            {isCredit ? 'Crédit de TVA à Reporter' : 'TVA Nette Due à Verser à l’État'}
          </div>
          <div
            className={`text-2xl font-extrabold font-mono ${
              isCredit ? 'text-blue-500' : 'text-purple-600 dark:text-purple-400'
            }`}
          >
            {formatMad(Math.abs(netVatPayable))}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {isCredit ? 'Reportable sur le prochain trimestre' : 'Échéance le 20 du mois suivant'}
          </div>
        </div>
      </div>

      {/* Breakdown Table by Rates */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Détail par Taux de TVA Légal Marocain (Article 89 à 100 du CGI)
          </h3>
          <p className="text-xs text-slate-400">Ventilation du chiffre d&apos;affaires taxable et des montants de TVA</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">Taux Légal Maroc</th>
                <th className="pb-3 px-2">Désignation Fiscale</th>
                <th className="pb-3 px-2 text-right">Base Imposable HT</th>
                <th className="pb-3 px-2 text-right">Montant TVA Collectée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {collectedVatByRate.map((row) => (
                <tr key={row.rate} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-white">
                    {row.rate}%
                  </td>
                  <td className="py-3 px-2 text-slate-700 dark:text-slate-300">{row.label}</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-600 dark:text-slate-300">
                    {formatMad(row.baseHt)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatMad(row.vatAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
