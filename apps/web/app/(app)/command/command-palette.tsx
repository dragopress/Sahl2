'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BarChart3, CheckSquare, FileText, LayoutDashboard, Package, Plus, Receipt, Search, UserPlus, Users, Wallet, X } from 'lucide-react';

const commands = [
  { id:'create-customer', label:'Créer un client', keywords:'client customer nouveau', href:'/customers', icon:UserPlus, group:'Créer' },
  { id:'create-invoice', label:'Créer une facture', keywords:'facture invoice vente', href:'/invoices?create=1', icon:Receipt, group:'Créer' },
  { id:'create-quote', label:'Créer un devis', keywords:'devis quote vente', href:'/quotes?create=1', icon:FileText, group:'Créer' },
  { id:'create-payment', label:'Enregistrer un paiement', keywords:'paiement payment encaissement', href:'/payments?create=1', icon:Wallet, group:'Créer' },
  { id:'create-expense', label:'Créer une dépense', keywords:'dépense expense frais', href:'/expenses?create=1', icon:Wallet, group:'Créer' },
  { id:'create-task', label:'Créer une tâche', keywords:'tâche task action', href:'/tasks?create=1', icon:CheckSquare, group:'Créer' },
  { id:'create-project', label:'Créer un projet', keywords:'projet project', href:'/projects?create=1', icon:Package, group:'Créer' },
  { id:'dashboard', label:'Aller au tableau de bord', keywords:'dashboard accueil pilotage', href:'/dashboard', icon:LayoutDashboard, group:'Naviguer' },
  { id:'customers', label:'Aller aux clients', keywords:'clients crm', href:'/customers', icon:Users, group:'Naviguer' },
  { id:'quotes', label:'Aller aux devis', keywords:'devis quotes', href:'/quotes', icon:FileText, group:'Naviguer' },
  { id:'invoices', label:'Aller aux factures', keywords:'factures invoices', href:'/invoices', icon:Receipt, group:'Naviguer' },
  { id:'projects', label:'Aller aux projets', keywords:'projets', href:'/projects', icon:Package, group:'Naviguer' },
  { id:'reports', label:'Aller aux rapports', keywords:'rapports analytics analyse', href:'/reports', icon:BarChart3, group:'Naviguer' },
];

type Command = typeof commands[number];

export default function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(c => `${c.label} ${c.keywords}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target && ['INPUT','TEXTAREA','SELECT'].includes(target.tagName);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen(v => !v); setQuickOpen(false);
      } else if (!editing && event.key.toLowerCase() === 'n') {
        event.preventDefault(); setQuickOpen(v => !v); setOpen(false);
      } else if (event.key === 'Escape') {
        setOpen(false); setQuickOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 0); } }, [open]);
  useEffect(() => { setSelected(i => Math.min(i, Math.max(filtered.length - 1, 0))); }, [filtered.length]);

  function choose(command: Command) { setOpen(false); window.location.assign(command.href); }

  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label="Ouvrir la palette de commandes" className="hidden md:flex items-center gap-2 text-xs text-gray-500 border border-gray-200 bg-gray-50 rounded-lg px-2.5 py-1.5 hover:bg-gray-100">
      <span className="font-medium">⌘ K</span><span>Commandes</span>
    </button>
    <button type="button" onClick={() => setQuickOpen(true)} aria-label="Créer rapidement" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-sm"><Plus size={16}/>Créer</button>

    {open && <div className="fixed inset-0 z-50 bg-black/30 p-4 md:p-10" onMouseDown={() => setOpen(false)}>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border" onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b px-4 py-3"><Search size={18} className="text-gray-400"/><input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{ if(e.key==='ArrowDown'){e.preventDefault();setSelected(i=>Math.min(i+1,filtered.length-1));} if(e.key==='ArrowUp'){e.preventDefault();setSelected(i=>Math.max(i-1,0));} if(e.key==='Enter'&&filtered[selected]){e.preventDefault();choose(filtered[selected]);}}} placeholder="Rechercher une commande…" className="flex-1 outline-none text-sm"/><kbd className="text-[11px] text-gray-400">ESC</kbd></div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? <div className="p-10 text-center text-sm text-gray-500">Aucune commande trouvée.</div> : filtered.map((c,i)=>{const Icon=c.icon;return <button key={c.id} onClick={()=>choose(c)} className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left ${i===selected?'bg-gray-100':'hover:bg-gray-50'}`}><div className="w-9 h-9 rounded-lg bg-gray-50 border flex items-center justify-center"><Icon size={17}/></div><div className="flex-1"><div className="text-sm font-medium">{c.label}</div><div className="text-xs text-gray-400">{c.group}</div></div><ArrowRight size={16} className="text-gray-300"/></button>})}
        </div>
        <div className="border-t px-4 py-2 text-[11px] text-gray-400 flex gap-4"><span>↑↓ naviguer</span><span>Entrée ouvrir</span><span>Esc fermer</span></div>
      </div>
    </div>}

    {quickOpen && <div className="fixed inset-0 z-50 bg-black/30 p-4 md:p-10" onMouseDown={() => setQuickOpen(false)}>
      <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl border p-5" onMouseDown={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Créer rapidement</h2><p className="text-sm text-gray-500 mt-1">Choisissez ce que vous voulez ajouter.</p></div><button onClick={()=>setQuickOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18}/></button></div>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">{commands.filter(c=>c.group==='Créer').map(c=>{const Icon=c.icon;return <Link key={c.id} href={c.href} onClick={()=>setQuickOpen(false)} className="flex items-center gap-3 rounded-xl border p-4 hover:border-gray-300 hover:bg-gray-50"><div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Icon size={18}/></div><div className="flex-1 text-sm font-medium">{c.label}</div><ArrowRight size={16} className="text-gray-400"/></Link>})}</div>
        <div className="mt-5 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">Astuce : appuyez sur <strong>N</strong> depuis n'importe quelle page pour ouvrir ce menu.</div>
      </div>
    </div>}
  </>;
}
