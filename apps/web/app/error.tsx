'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-2xl font-bold mb-4">
        !
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Une erreur est survenue</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm max-w-md">
        Une anomalie technique a été rencontrée. Vous pouvez recharger la page ou revenir à l&apos;accueil.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
