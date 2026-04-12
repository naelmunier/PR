import"./hoisted.3qPOf3_h.js";const d=document.getElementById("contactForm");d?.addEventListener("submit",l=>{l.preventDefault();const e=document.getElementById("nom").value.trim(),t=document.getElementById("email").value.trim(),o=document.getElementById("tel").value.trim(),n=document.getElementById("sujet").value,m=document.getElementById("message").value.trim();if(!e||!t||!n||!m){alert(window.I18N?window.I18N.t("contact.form.required"):"Merci de remplir tous les champs obligatoires (*).");return}const c=`demande via le site: ${n}`,i=`Nom : ${e}
Email : ${t}${o?`
Téléphone : ${o}`:""}

${m}`,s=`mailto:lehavre@pr-logistics.fr?subject=${encodeURIComponent(c)}&body=${encodeURIComponent(i)}`;window.location.href=s});
