(function(){
const C=window.PE_BACKEND_CONFIG||{provider:"local"};
const K={products:"pe_products",tickets:"pe_tickets",reviews:"pe_reviews",licenses:"pe_licenses",commissions:"pe_commissions",audit:"pe_audit"};
const id=p=>p+"-"+crypto.getRandomValues(new Uint32Array(1))[0].toString(16).toUpperCase();
const read=k=>JSON.parse(localStorage.getItem(K[k])||"[]"),write=(k,v)=>localStorage.setItem(K[k],JSON.stringify(v));
const local={
 list:async({table})=>({ok:true,data:read(table)}),
 upsert:async({table,key,row})=>{let a=read(table),i=a.findIndex(x=>String(x[key])===String(row[key]));if(i<0)a.push(row);else a[i]={...a[i],...row};write(table,a);return{ok:true,data:row}},
 create:async({table,row})=>{let a=read(table);a.push(row);write(table,a);return{ok:true,data:row}},
 update:async({table,key,value,patch})=>{let a=read(table),i=a.findIndex(x=>String(x[key])===String(value));if(i<0)return{ok:false,error:"Record not found"};a[i]={...a[i],...patch};write(table,a);return{ok:true,data:a[i]}},
 backup:async()=>({ok:true,data:Object.fromEntries(Object.keys(K).map(k=>[k,read(k)]))}),
 restore:async({data})=>{Object.entries(data||{}).forEach(([k,v])=>{if(K[k])write(k,v)});return{ok:true}}
};
async function sheets(action,body={},method="POST"){
 const u=C.sheets.webAppUrl;if(!u)return{ok:false,error:"Google Sheets Web App URL is not configured."};
 if(method==="GET"){const x=new URL(u);x.searchParams.set("action",action);Object.entries(body).forEach(([k,v])=>x.searchParams.set(k,v));return(await fetch(x)).json()}
 return(await fetch(u+"?action="+encodeURIComponent(action),{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)})).json();
}
async function sb(table,method="GET",body=null,query=""){
 if(!C.supabase.url||!C.supabase.anonKey)return{ok:false,error:"Supabase URL and anon key are not configured."};
 const r=await fetch(C.supabase.url.replace(/\/$/,"")+"/rest/v1/"+table+query,{method,headers:{apikey:C.supabase.anonKey,Authorization:"Bearer "+C.supabase.anonKey,"Content-Type":"application/json",Prefer:"return=representation,resolution=merge-duplicates"},body:body?JSON.stringify(body):null});
 let d;try{d=await r.json()}catch(e){d=[]}return r.ok?{ok:true,data:d}:{ok:false,error:d.message||"Supabase request failed"};
}
const supabase={
 list:({table})=>sb(table),
 upsert:({table,row})=>sb(table,"POST",row),
 create:({table,row})=>sb(table,"POST",row),
 update:({table,key,value,patch})=>sb(table,"PATCH",patch,"?"+key+"=eq."+encodeURIComponent(value)),
 backup:async()=>{let out={};for(const t of Object.keys(K)){let r=await sb(t);out[t]=r.ok?r.data:[]}return{ok:true,data:out}},
 restore:async()=>({ok:false,error:"Use Supabase import tools for bulk restore."})
};
const sheetsAdapter={
 list:async({table,owner_key})=>{let r=await sheets("ownerData",{owner_key},"GET");if(!r.ok)return r;const map={products:"Products",tickets:"SupportTickets",reviews:"Reviews",licenses:"Licenses",commissions:"Commissions",audit:"AuditLogs"};return{ok:true,data:(r.data||{})[map[table]]||[]}},
 upsert:({table,row,owner_key})=>sheets(table==="products"?"saveProduct":"saveLicense",{...row,owner_key}),
 create:({table,row})=>sheets(table==="tickets"?"createTicket":"createReview",row),
 update:({table,key,value,patch,owner_key})=>sheets(table==="commissions"?"markCommissionPaid":"updateTicket",{...patch,[key]:value,owner_key}),
 backup:({owner_key})=>sheets("exportBackup",{owner_key},"GET"),
 restore:({data,owner_key})=>sheets("importBackup",{backup:data,owner_key})
};
const P={local,sheets:sheetsAdapter,supabase};window.PE_DB={provider:C.provider,call:(m,a={})=>(P[C.provider]||local)[m](a)};
window.PE_UID=id;
})();