'use client';
import {useEffect,useState} from 'react';
import {apiFetch,getOrganizationId,setOrganizationId} from '../../lib/api-client';

type OrganizationMembership = {
  organizationId: string;
  organization: {name: string};
};

export default function OrgSwitcher(){
  const [orgs,setOrgs]=useState<OrganizationMembership[]>([]);
  const [value,setValue]=useState('');

  useEffect(()=>{
    apiFetch('/auth/me',{}, {tenant:false})
      .then(r=>r.ok?r.json():Promise.reject(new Error('auth')))
      .then(d=>{
        const x=(d.organizations||[]) as OrganizationMembership[];
        setOrgs(x);
        const saved=getOrganizationId();
        setValue(x.some(o=>o.organizationId===saved)?saved:x[0]?.organizationId||'');
        if(!saved && x[0]?.organizationId) setOrganizationId(x[0].organizationId);
      })
      .catch(()=>{});
  },[]);

  function change(v:string){
    setValue(v);
    setOrganizationId(v);
  }

  return <select aria-label="Organisation" value={value} onChange={e=>change(e.target.value)} className="max-w-48 border border-gray-200 rounded-lg bg-gray-50 px-2 py-1.5 text-xs">
    {orgs.map(o=><option key={o.organizationId} value={o.organizationId}>{o.organization.name}</option>)}
  </select>;
}
