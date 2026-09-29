'use client';
import {useEffect,useState} from 'react';
const API=process.env.NEXT_PUBLIC_API_URL||'/api/v1';
type Finance={vat:{collected:number;deductible:number;net:number};period:{from:string;to:string}};
export default function VatPage(){
 const [data,setData]=useState<Finance|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 async function load(){const org=localStorage.getItem('sahlbiz_org')||'';const r=await fetch(API+'/analytics/finance',{credentials:'include',headers:{'x-organization-id':org}});if(!r.ok){setError('Impossible de charger les données TVA.');setData(null)}else setData(await r.json());setLoading(false)}
 useEffect(()=>{load();const onOrg=()=>load();window.addEventListener('sahlbiz-org-change',onOrg);return()=>window.removeEventListener('sahlbiz-org-change',onOrg)},[]);
 if(loading)return <div className="py-16 text-center text-gray-500">Chargement…</div>;
 if(error)return <div className="rounded-xl border bg-red-50 p-5 text-sm text-red-700">{error}</div>;
 const v=data?.vat||{collected:0,deductible:0,net:0};
 return <section className="space-y-6"><div><h1 className="text-2xl font-bold">TVA</h1><p className="text-sm text-gray-500">Position TVA calculée depuis les écritures comptables de l’organisation active.</p></div><div className="grid md:grid-cols-3 gap-4">{[['TVA collectée',v.collected],['TVA déductible',v.deductible],['Position nette',v.net]].map(([label,value])=><div key={String(label)} className="bg-white border rounded-xl p-5"><div className="text-sm text-gray-500">{label}</div><div className="text-2xl font-bold mt-2">{Number(value).toLocaleString('fr-MA')} MAD</div></div>)}</div><div className="rounded-xl border bg-white p-5 text-sm text-gray-600">Cette vue ne génère pas de fichier de télé-déclaration et ne présente pas de ventilation fiscale fictive. Les détails par taux nécessitent des données comptables suffisamment structurées côté API.</div></section>
}