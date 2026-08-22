'use client';
import { useState } from 'react';
import { BriefcaseBusiness, Plus, CheckCircle2, Clock3, AlertCircle, TrendingUp } from 'lucide-react';

type Deal = {
  id: string;
  title: string;
  client: string;
  amount: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'won' | 'lost';
  probability: number;
  expectedClose: string;
};

const initialDeals: Deal[] = [
  { id: '1', title: 'Refonte ERP Logistique', client: 'Maroc Fret SARL', amount: 95000, stage: 'proposal', probability: 70, expectedClose: '2026-09-15' },
  { id: '2', title: 'Abonnement Annuel Support', client: 'Atlas Digital', amount: 36000, stage: 'won', probability: 100, expectedClose: '2026-08-10' },
  { id: '3', title: 'Audit Comptable & Fiscal', client: 'Tanger Retail Group', amount: 48000, stage: 'qualified', probability: 50, expectedClose: '2026-09-30' },
  { id: '4', title: 'Licences & Déploiement Cloud', client: 'Casablanca Agro', amount: 120000, stage: 'lead', probability: 25, expectedClose: '2026-10-15' },
  { id: '5', title: 'Formation Équipe Vente', client: 'Rabat Tech Hub', amount: 18000, stage: 'won', probability: 100, expectedClose: '2026-08-01' },
];

const stages = [
  { key: 'lead', label: 'Nouveaux prospects', color: 'bg-blue-500' },
  { key: 'qualified', label: 'Qualifiés', color: 'bg-amber-500' },
  { key: 'proposal', label: 'Proposition transmise', color: 'bg-purple-500' },
  { key: 'won', label: 'Gagnés (Signés)', color: 'bg-emerald-500' },
] as const;

export default function OpportunitiesPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState(25000);
  const [stage, setStage] = useState<'lead' | 'qualified' | 'proposal' | 'won'>('lead');

  const totalPipeline = deals.reduce((acc, d) => acc + d.amount, 0);
  const weightedPipeline = deals.reduce((acc, d) => acc + (d.amount * d.probability) / 100, 0);

  function addDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !client) return;
    const newDeal: Deal = {
      id: Date.now().toString(),
      title,
      client,
      amount: Number(amount),
      stage,
      probability: stage === 'won' ? 100 : stage === 'proposal' ? 70 : stage === 'qualified' ? 50 : 25,
      expectedClose: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };
    setDeals([newDeal, ...deals]);
    setTitle('');
    setClient('');
    setIsAdding(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Pipeline commercial</p>
          <h1 className="text-2xl font-bold">Opportunités</h1>
          <p className="text-sm text-gray-500 mt-1">Suivi du cycle de vente et prévisions d'encaissements.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} />
          Nouvelle opportunité
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Pipeline</div>
          <div className="text-2xl font-bold mt-2">{totalPipeline.toLocaleString('fr-FR')} MAD</div>
          <div className="text-xs text-gray-400 mt-1">{deals.length} affaires en cours</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Valeur pondérée</div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{Math.round(weightedPipeline).toLocaleString('fr-FR')} MAD</div>
          <div className="text-xs text-emerald-600 mt-1">Prévision basée sur les probabilités</div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Taux de conversion</div>
          <div className="text-2xl font-bold text-blue-700 mt-2">64%</div>
          <div className="text-xs text-gray-400 mt-1">Moyenne 3 derniers mois</div>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={addDeal} className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-base">Ajouter une opportunité</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Intitulé du projet"
              required
              className="border rounded-lg p-2.5 text-sm"
            />
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Nom du client"
              required
              className="border rounded-lg p-2.5 text-sm"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Montant (MAD)"
              required
              className="border rounded-lg p-2.5 text-sm"
            />
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="border rounded-lg p-2.5 text-sm"
            >
              <option value="lead">Prospect</option>
              <option value="qualified">Qualifié</option>
              <option value="proposal">Proposition</option>
              <option value="won">Gagné</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stages.map((st) => {
          const stageDeals = deals.filter((d) => d.stage === st.key);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div key={st.key} className="bg-gray-50 border rounded-xl p-3.5 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                  <span className="font-semibold text-sm">{st.label}</span>
                </div>
                <span className="text-xs bg-white border px-2 py-0.5 rounded-full font-medium text-gray-600">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                Total : {stageTotal.toLocaleString('fr-FR')} MAD
              </div>

              <div className="space-y-3 flex-1">
                {stageDeals.map((deal) => (
                  <div key={deal.id} className="bg-white border rounded-lg p-3.5 shadow-sm space-y-2">
                    <div className="font-medium text-sm text-gray-900">{deal.title}</div>
                    <div className="text-xs text-gray-500">{deal.client}</div>
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <span className="font-bold text-gray-800">{deal.amount.toLocaleString('fr-FR')} MAD</span>
                      <span className="text-gray-500">{deal.expectedClose}</span>
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-400">Aucune affaire</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
