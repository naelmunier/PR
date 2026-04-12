import"./hoisted.3qPOf3_h.js";const a=document.getElementById("contactForm");a?.addEventListener("submit",l=>{l.preventDefault();const e=document.getElementById("nom").value.trim(),t=document.getElementById("email").value.trim(),o=document.getElementById("tel").value.trim(),n=document.getElementById("sujet").value,m=document.getElementById("message").value.trim();if(!e||!t||!n||!m){alert("Merci de remplir tous les champs obligatoires (*).");return}const s=`demande via le site: ${n}`,c=`Nom : ${e}
Email : ${t}${o?`
Téléphone : ${o}`:""}

${m}`,i=`mailto:lehavre@pr-logistics.fr?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(c)}`;window.location.href=i});
