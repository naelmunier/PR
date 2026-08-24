import"./hoisted.CFrcT3Nw.js";function k(t){const s=parseInt(t.dataset.count||"0",10),a=t.dataset.suffix||"",i=2800,l=performance.now(),d=e=>e<.5?2*e*e:-1+(4-2*e)*e;function n(e){const o=Math.min((e-l)/i,1),r=Math.round(d(o)*s);t.textContent=r.toLocaleString("fr-FR")+a,o<1&&requestAnimationFrame(n)}requestAnimationFrame(n)}const h=new IntersectionObserver(t=>{t.forEach(s=>{s.isIntersecting&&(s.target.querySelectorAll("[data-count]").forEach(a=>k(a)),h.unobserve(s.target))})},{threshold:.4});document.querySelectorAll(".bridge-stats-row").forEach(t=>h.observe(t));(()=>{const t=document.getElementById("siteModal"),s=document.getElementById("siteModalBackdrop"),a=document.getElementById("siteModalClose"),i=document.getElementById("siteModalTitle"),l=document.getElementById("siteModalBody");if(!t||!l||!i)return;function d(e){const o={};e.querySelectorAll(".hrc-data[data-key]").forEach(c=>{o[c.dataset.key]=c.innerHTML}),i.innerHTML=o.titre??"";const r=o.surface??"",m=r.indexOf("m²"),p=m>=0?r.slice(0,m+2).trim():r,w=e.querySelector('.hrc-data[data-key="mapurl"]')?.textContent?.trim()??"#",f='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',y='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/></svg>',v='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',u=(c,_)=>window.I18N?.t?.(c)??_;l.innerHTML=`
        <div class="site-modal__rows">
          <div class="site-modal__row">
            <span class="site-modal__row-ico">${f}</span>
            <span class="site-modal__row-label">${u("modal.surface","Surface")}</span>
            <span class="site-modal__row-val">${p}</span>
          </div>
          <div class="site-modal__row">
            <span class="site-modal__row-ico">${y}</span>
            <span class="site-modal__row-label">${u("modal.quais","Quais")}</span>
            <span class="site-modal__row-val">${o.quais??""}</span>
          </div>
          <a class="site-modal__row site-modal__row--map" href="${w}" target="_blank" rel="noopener noreferrer">
            <span class="site-modal__row-ico">${v}</span>
            <span class="site-modal__row-label">${u("modal.carte","Voir sur la carte")}</span>
            <span class="site-modal__row-val">
              <span class="site-modal__addr">${o.addr??""}</span>
              <svg class="site-modal__arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </span>
          </a>
        </div>
      `,t.classList.add("open"),t.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden"}function n(){t.classList.remove("open"),t.setAttribute("aria-hidden","true"),document.body.style.overflow=""}document.querySelectorAll(".hrc-card").forEach(e=>{e.addEventListener("click",()=>d(e)),e.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),d(e))})}),a?.addEventListener("click",n),s?.addEventListener("click",n),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("open")&&n()})})();
