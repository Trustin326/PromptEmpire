
(function(){
 const cfg=window.PROMPT_EMPIRE_CONFIG||{};
 const PKEY="pe_attribution", SID="pe_session_id";
 const sid=localStorage.getItem(SID)||("SES-"+Math.random().toString(36).slice(2)+Date.now().toString(36));
 localStorage.setItem(SID,sid);
 const q=new URLSearchParams(location.search);
 let a={}; try{a=JSON.parse(localStorage.getItem(PKEY)||"{}")}catch(e){}
 const ref=q.get("ref"), cmp=q.get("campaign")||q.get("utm_campaign"), coupon=q.get("coupon");
 if(ref||cmp||coupon){
   a={affiliate_id:ref||a.affiliate_id||"",campaign_id:cmp||a.campaign_id||"",coupon_code:coupon||a.coupon_code||"",expires:Date.now()+(cfg.attributionDays||30)*86400000};
   localStorage.setItem(PKEY,JSON.stringify(a));
 }
 if(a.expires && a.expires<Date.now()){localStorage.removeItem(PKEY);a={}}
 window.PE_ATTRIBUTION=a;
 window.peTrack=async function(event_type,extra={}){
   if(!cfg.backendUrl)return;
   try{await fetch(cfg.backendUrl+"?action=trackEvent",{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({
      event_type,session_id:sid,affiliate_id:a.affiliate_id||"",campaign_id:a.campaign_id||"",product_id:extra.product_id||"",page_url:location.href,metadata:extra
   })})}catch(e){}
 };
 if(ref&&cfg.backendUrl){
   fetch(cfg.backendUrl+"?action=trackClick",{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({
     affiliate_id:ref,campaign_id:cmp||"",landing_url:location.href,referrer:document.referrer,user_agent:navigator.userAgent
   })}).catch(()=>{});
 }
 peTrack("page_view");
 document.addEventListener("click",e=>{
   const el=e.target.closest("[data-product],[data-track]");
   if(!el)return;
   peTrack(el.dataset.track||"click",{product_id:el.dataset.product||"",label:(el.textContent||"").trim().slice(0,120)});
 });
})();
