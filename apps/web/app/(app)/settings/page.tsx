'use client';
import { useState } from 'react';
import { Building2, Key, Users, Shield, Database, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('SahlBiz Demo · Casablanca');
  const [ice, setIce] = useState('001234567890123');
  const [ifNumber, setIfNumber] = useState('45678901');
  const [rc, setRc] = useState('123456');
  const [currency, setCurrency] = useState('MAD');
  const [defaultVat, setDefaultVat] = useState('20');
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-sm text-gray-500">Administration du compte</p>
        <h1 className="text-2xl font-bold">Paramètres de l'entreprise</h1>
        <p className="text-sm text-gray-500 mt-1">Identifiants fiscaux marocains, préférences comptables et utilisateurs.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b">
            <Building2 size={18} className="text-gray-500" />
            <h2 className="font-semibold text-base">Informations légales marocaines</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Raison sociale</label>
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Identifiant Commun de l'Entreprise (ICE)</label>
              <input
                value={ice}
                onChange={(e) => setIce(e.target.value)}
                placeholder="15 chiffres"
                maxLength={15}
                className="w-full border rounded-lg p-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Identifiant Fiscal (IF)</label>
              <input
                value={ifNumber}
                onChange={(e) => setIfNumber(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Registre du Commerce (RC)</label>
              <input
                value={rc}
                onChange={(e) => setRc(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b">
            <Database size={18} className="text-gray-500" />
            <h2 className="font-semibold text-base">Préférences de facturation & TVA</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Devise par défaut</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm"
              >
                <option value="MAD">Dirham Marocain (MAD)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Taux de TVA standard</label>
              <select
                value={defaultVat}
                onChange={(e) => setDefaultVat(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm"
              >
                <option value="20">20% (Taux normal)</option>
                <option value="14">14% (BTP, Transport, Énergie)</option>
                <option value="10">10% (Hôtellerie, Restauration, Banque)</option>
                <option value="7">7% (Eau, Électricité, Produits base)</option>
                <option value="0">0% (Exonéré / Export)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-emerald-600 text-sm font-medium flex items-center gap-1.5">
              <Check size={16} />
              Paramètres enregistrés avec succès.
            </span>
          ) : <div />}

          <button
            type="submit"
            className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Save size={16} />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
