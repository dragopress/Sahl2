'use client';

import {useEffect,useState} from 'react';
import {ArrowDownRight,ArrowUpRight,MoreHorizontal,RefreshCw,AlertCircle,CheckCircle2,Clock3} from 'lucide-react';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts';

const API=process.env.NEXT_PUBLIC_API_URL||'/api/v1';
type Executive={kpis:{revenue:number;receivables:number;expenses:number;payments:number;profit:number;stockValue:number}};
type Sales={topCustomers:{name:string;value:number}[];quoteCount:number;acceptedQuotes:number};
type Operations={supplierCount:number;openTasks:number;lowStock:{name:string;stock:number;minimum:number}[]};

const money=(n:number)=>new Intl.NumberFormat('fr-MA',{style:'currency',currency:'MAD',maximumFractionDigits:2}).format(Number(n)||0);

export default function Dashboard(){
 const [data,setData]=useState<{executive:Executive|null;sales:Sales|null;operations:Operations|null}>({executive:null,sales:null,operations:null});
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 async function load(){
  setLoading(true);setError('');
  const org=localStorage.getItem('sahlbiz_org')||'';
  const headers={'x-organization-id':org};
  try{
   const [a,b,c]=await Promise.all([
    fetch(`${API}/analytics/executive`,{credentials:'include',headers}),
    fetch(`${API}/analytics/sales`,{credentials:'include',headers}),
    fetch(`${API}/analytics/operations`,{credentials:'include',headers}),
   ]);
   if([a,b,c].some(r=>r.status===401||r.status===403)) throw new Error('Votre session ou votre organisation n’est plus autorisée.');
   if(!a.ok||!b.ok||!c.ok) throw new Error('Impossible de charger les données du tableau de bord.');
   setData({executive:await a.json(),sales:await b.json(),operations:await c.json()});
  }catch(e){setError(e instanceof Error?e.message:'Impossible de charger les données.')}finally{setLoading(false)}
 }
 useEffect(()=>{load();const onOrg=()=>load();window.addEventListener('sahlbiz-org-change',onOrg);return()=>window.removeEventListener('sahlbiz-org-change',onOrg)},[]);

 if(loading)return <div className="py-16 text-center text-gray-500">Chargement du tableau de bord…</div>;
 if(error)return <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"><div>{error}</div><button onClick={load} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border"><RefreshCw size={14}/>Réessayer</button></div>;

 const k=data.executive?.kpis;
 const sales=data.sales;
 const ops=data.operations;
 const cards=[
  ['CA',money(k?.revenue||0),'current'],
  ['Créances',money(k?.receivables||0),'unpaid'],
  ['Dépenses',money(k?.expenses||0),'expense'],
  ['Trésorerie',money(k?.payments||0),'cash'],
 ];
 return <div className="space-y-6">
  <div><p className="text-sm text-gray-500">Données de votre organisation</p><h1 className="text-2xl md:text-3xl font-bold mt-1">Tableau de bord</h1><p className="text-gray-500 mt-1">Indicateurs calculés à partir des données authentifiées de l’organisation active.</p></div>
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(([label,value,type])=><div key={label} className="bg-white border border-[var(--border)] rounded-xl p-5"><div className="flex justify-between"><span className="text-sm text-gray-500">{label}</span><MoreHorizontal size={18} className="text-gray-400"/></div><div className="text-2xl font-bold mt-3">{value}</div><div className="mt-2 text-xs text-gray-500">{type==='unpaid'?'Factures non réglées':type==='expense'?'Charges comptabilisées':type==='cash'?'Paiements encaissés':'Période courante'}</div></div>)}</div>
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
   <section className="xl:col-span-2 bg-white border border-[var(--border)] rounded-xl p-5"><div className="mb-5"><h2 className="font-semibold">Ventes par client</h2><p className="text-sm text-gray-500">Données issues des factures de l’organisation.</p></div><div className="h-72">{sales?.topCustomers?.length?<ResponsiveContainer width="100%" height="100%"><BarChart data={sales.topCustomers.slice(0,8)}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" hide/><YAxis/><Tooltip formatter={(v:unknown)=>money(Number(v??0))}/><Bar dataKey="value" name="CA" fill="var(--primary)"/></BarChart></ResponsiveContainer>:<div className="h-full flex items-center justify-center text-sm text-gray-500">Aucune vente disponible.</div>}</div></section>
   <section className="bg-white border border-[var(--border)] rounded-xl p-5"><h2 className="font-semibold">Activité</h2><div className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><span>Devis</span><b>{sales?.quoteCount||0}</b></div><div className="flex justify-between"><span>Devis acceptés</span><b>{sales?.acceptedQuotes||0}</b></div><div className="flex justify-between"><span>Fournisseurs actifs</span><b>{ops?.supplierCount||0}</b></div><div className="flex justify-between"><span>Tâches ouvertes</span><b>{ops?.openTasks||0}</b></div><div className="flex justify-between"><span>Stocks faibles</span><b>{ops?.lowStock?.length||0}</b></div></div></section>
  </div>
  <section className="bg-white border border-[var(--border)] rounded-xl p-5"><div className="flex justify-between items-center mb-4"><div><h2 className="font-semibold">Alertes stock</h2><p className="text-sm text-gray-500">Articles sous leur seuil minimum.</p></div></div>{ops?.lowStock?.length?<div className="space-y-2">{ops.lowStock.slice(0,8).map(x=><div key={x.name} className="flex items-center gap-3 p-3 rounded-lg border"><AlertCircle size={17}/><div className="flex-1"><div className="text-sm font-medium">{x.name}</div><div className="text-xs text-gray-500 mt-0.5">{x.stock} en stock · minimum {x.minimum}</div></div><span className="text-xs px-2 py-1 rounded bg-gray-100">Réapprovisionnement</span></div>)}</div>:<div className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 size={17}/>Aucune alerte de stock.</div>}</section>
 </div>;
}
