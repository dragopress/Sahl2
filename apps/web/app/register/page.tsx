'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import ThemeSwitcher from '../theme-switcher';

const API = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export default function Register() {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, organizationName: org, email, password }),
      });
      if (!r.ok) {
        setError('Impossible de créer le compte. Vérifiez vos informations.');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Retour à l&apos;accueil</span>
        </Link>
        <ThemeSwitcher compact />
      </div>

      <div className="w-full max-w-lg mx-auto my-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white font-bold flex items-center justify-center text-lg shadow-md">
                S
              </div>
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Créer votre espace Sahl<span className="text-[var(--primary)]">Biz</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Essai gratuit de 14 jours · Sans engagement ni carte bancaire
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet du dirigeant / administrateur
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                minLength={2}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="ex. Karim Benjelloun"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Raison sociale de l&apos;entreprise (SARL, SA, Auto-entrepreneur)
              </label>
              <input
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                type="text"
                required
                minLength={2}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="ex. Atlas Consulting SARL"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email professionnel
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="direction@atlasconsulting.ma"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mot de passe sécurisé (12 caractères min.)
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={12}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--primary)] text-white py-3 font-semibold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50 mt-3"
            >
              {loading ? 'Création de votre organisation…' : 'Créer mon organisation'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-xs text-slate-500">
            <span>Vous avez déjà un compte ? </span>
            <Link
              href="/login"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck size={15} />
          <span>Données hébergées en conformité avec la Loi 09-08 Maroc</span>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} SahlBiz Technologies Maroc
      </div>
    </main>
  );
}
