
const cfg=window.PROMPT_EMPIRE_CONFIG, products=window.PRODUCTS;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let cart=JSON.parse(localStorage.getItem("pe_cart")||"[]");
let activeCategory="All";

function money(n){return new Intl.NumberFormat("en-US",{style:"currency",currency:cfg.currency}).format(n)}
function renderProducts(){
 const q=$("#search").value.toLowerCase().trim();
 const list=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)));
 $("#productGrid").innerHTML=list.map(p=>`
 <article class="card">
   <div class="card-art"><div><div style="font-size:38px">♛</div><strong>${p.name}</strong><br><small>${p.category}</small></div></div>
   <h3>${p.name}</h3><p>${p.description}</p>
   <div class="price-row"><span class="price">${money(p.price)}</span><button class="btn secondary" onclick="showProduct('${p.slug}')">VIEW PACK</button></div>
 </article>`).join("");
}
function categories(){
 const cats=["All",...new Set(products.map(p=>p.category))];
 $("#filters").innerHTML=cats.map(c=>`<button class="filter ${c==="All"?"active":""}" data-cat="${c}">${c}</button>`).join("");
 $$(".filter").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts()})
}
window.showProduct=function(slug){
 const p=products.find(x=>x.slug===slug);
 let inc="";
 if(p.includes){inc=`<h4>Included packs</h4><ul>${p.includes.map(s=>`<li>${products.find(x=>x.slug===s)?.name||s}</li>`).join("")}</ul>`}
 $("#modalContent").innerHTML=`<div class="card-art" style="height:260px"><div><div style="font-size:58px">♛</div><h2>${p.name}</h2></div></div><h2>${p.name}</h2><p>${p.description}</p>${inc}<p><strong>Instant digital access.</strong> Built for practical use with organized, ready-to-customize prompts.</p><div class="price-row"><span class="price">${money(p.price)}</span><button class="btn" onclick="addToCart('${p.slug}')">ADD TO BAG</button></div>`;
 $("#productModal").classList.add("open");
}
window.addToCart=function(slug){if(!cart.includes(slug))cart.push(slug);saveCart();$("#productModal").classList.remove("open");$("#cartDrawer").classList.add("open")}
function saveCart(){localStorage.setItem("pe_cart",JSON.stringify(cart));renderCart()}
function renderCart(){
 $("#cartCount").textContent=cart.length;
 const items=cart.map(s=>products.find(p=>p.slug===s)).filter(Boolean);
 $("#cartItems").innerHTML=items.length?items.map(p=>`<div class="cart-item"><div><strong>${p.name}</strong><br><small>${money(p.price)}</small></div><button class="iconbtn" onclick="removeCart('${p.slug}')">×</button></div>`).join(""):"<p>Your bag is empty.</p>";
 $("#cartTotal").textContent=money(items.reduce((a,b)=>a+b.price,0));
}
window.removeCart=function(slug){cart=cart.filter(s=>s!==slug);saveCart()}
window.checkout=function(){
 if(!cart.length)return alert("Your bag is empty.");
 if(cart.length===1){
   const link=cfg.stripeLinks[cart[0]];
   if(link){location.href=link;return}
 }
 alert("Add your Stripe Payment Link(s) in config.js. For multi-item checkout, create a Stripe bundle/product link or direct buyers to individual product checkout links.");
}
$("#search").addEventListener("input",renderProducts);
$("#cartBtn").onclick=()=>$("#cartDrawer").classList.add("open");
$("#closeCart").onclick=()=>$("#cartDrawer").classList.remove("open");
$("#closeModal").onclick=()=>$("#productModal").classList.remove("open");
$("#productModal").onclick=e=>{if(e.target.id==="productModal")e.currentTarget.classList.remove("open")};
categories();renderProducts();renderCart();

(function(){const p=new URLSearchParams(location.search),ref=p.get("ref");if(ref){localStorage.setItem("pe_affiliate",JSON.stringify({id:ref,expires:Date.now()+30*24*60*60*1000}));if(cfg.backendUrl)fetch(cfg.backendUrl+"?action=trackClick",{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({affiliate_id:ref,landing_url:location.href,referrer:document.referrer,user_agent:navigator.userAgent})}).catch(()=>{})}})();
window.getAffiliateId=function(){try{const v=JSON.parse(localStorage.getItem("pe_affiliate")||"null");if(!v||v.expires<Date.now()){localStorage.removeItem("pe_affiliate");return ""}return v.id||""}catch(e){return ""}};
