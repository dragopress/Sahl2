'use client';
import {useEffect,useState} from 'react';
import {Brain,Send,Lightbulb,AlertTriangle,CheckCircle2} from 'lucide-react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

type Insight={id?:string;type:string;priority:string;title:string;message:string;entityType?:string|null};

export default function AiPage(){
 const [insights,setInsights]=useState<Insight[]>([]); const [question,setQuestion]=useState(''); const [answer,setAnswer]=useState(''); const [loading,setLoading]=useState(true); const [asking,setAsking]=useState(false);
 const org=typeof window!=='undefined'?localStorage.getItem('sahlbiz.organizationId')||'':'';
 const headers={'Content-Type':'application/json','x-organization-id':org};
 async function load(){setLoading(true);try{const r=await fetch(`${API}/api/v1/ai/insights?limit=10`,{headers});const d=await r.json();setInsights(d.insights||[])}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function ask(e:React.FormEvent){e.preventDefault();if(!question.trim())return;setAsking(true);setAnswer('');try{const r=await fetch(`${API}/api/v1/ai/ask`,{method:'POST',headers,body:JSON.stringify({question})});const d=await r.json();setAnswer(d.answer||'Aucune réponse disponible.')}finally{setAsking(false)}}
 async function dismiss(id?:string){if(!id)return;await fetch(`${API}/api/v1/ai/insights/${id}/dismiss`,{method:'POST',headers});setInsights(x=>x.filter(i=>i.id!==id))}
 return <div className="space-y-6">
  <div><div className="flex items-center gap-2"><Brain className="text-[var(--primary)]"/><h1 className="text-2xl font-bold">Assistant SahlBiz</h1></div><p className="text-sm text-gray-500 mt-1">Des recommandations basées sur les données de votre organisation.</p></div>
  <form onSubmit={ask} className="bg-white border rounded-xl p-4 flex gap-3"><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ex. Quelle est ma trésorerie ?" className="flex-1 bg-gray-50 border rounded-lg px-3 py-2 outline-none"/><button disabled={asking} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white flex items-center gap-2"><Send size={16}/>{asking?'Analyse…':'Demander'}</button></form>
  {answer&&<div className="bg-white border rounded-xl p-5"><div className="font-semibold mb-2">Réponse</div><p className="text-sm leading-6 text-gray-700">{answer}</p></div>}
  <section><div className="flex items-center gap-2 mb-3"><Lightbulb size={18}/><h2 className="font-semibold">Ce qui mérite votre attention</h2></div>{loading?<div className="text-sm text-gray-500">Analyse en cours…</div>:<div className="grid md:grid-cols-2 gap-4">{insights.map((i,idx)=><div key={i.id||idx} className="bg-white border rounded-xl p-5"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="mt-0.5">{i.priority==='critical'||i.priority==='high'?<AlertTriangle size={18}/>:<Lightbulb size={18}/>}</div><div><div className="font-semibold">{i.title}</div><p className="text-sm text-gray-600 mt-1">{i.message}</p></div></div>{i.id&&<button onClick={()=>dismiss(i.id)} className="text-xs text-gray-500 hover:text-gray-900">Ignorer</button>}</div></div>)}{!insights.length&&<div className="bg-white border rounded-xl p-8 text-center text-sm text-gray-500"><CheckCircle2 className="mx-auto mb-2"/>Aucune recommandation active.</div>}</div>}</section>
  <div className="text-xs text-gray-400">Mode actuel : analyse locale par règles. Aucun fournisseur IA externe n'est appelé sans configuration explicite.</div>
 </div>
}
