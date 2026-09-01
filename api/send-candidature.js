/**
 * PR Logistics — Réception d'une candidature par email via Brevo.
 * Portage de l'ancien `public/send-candidature.php` (Vercel n'exécute pas PHP).
 *
 * Les pièces jointes arrivent en base64 dans le corps JSON : les fonctions
 * serverless ne savent pas décoder le multipart sans dépendance externe.
 */

import {
  PR_EMAIL, PR_NOM, esc, validEmail, row, section, dateFr, reference,
  sendBrevoEmail, guard,
} from './_brevo.js';

/** Limite alignée sur le plafond de 4,5 Mo appliqué par Vercel à la requête. */
const MAX_OCTETS = 3 * 1024 * 1024;
const EXTENSIONS = ['pdf', 'doc', 'docx'];

/** Valide une pièce jointe et renvoie le format attendu par Brevo. */
function pieceJointe(fichier, prefixe, identite) {
  if (!fichier?.data || !fichier?.name) return null;
  const ext = String(fichier.name).split('.').pop().toLowerCase();
  if (!EXTENSIONS.includes(ext)) return { erreur: 'Format non accepté (PDF, DOC, DOCX uniquement)' };
  /* Le base64 pèse ~4/3 de l'original : on remonte à la taille réelle. */
  if (Math.ceil(fichier.data.length * 3 / 4) > MAX_OCTETS) {
    return { erreur: 'Fichier trop volumineux (max 3 Mo)' };
  }
  const slug = identite.replace(/[^a-zA-Z0-9_.-]/g, '_');
  return { content: fichier.data, name: `${prefixe}_${slug}.${ext}` };
}

export default async function handler(req, res) {
  const ctx = guard(req, res);
  if (!ctx) return;
  const { apiKey, body: input } = ctx;

  const prenom = esc(String(input.prenom ?? '').trim());
  const nom = esc(String(input.nom ?? '').trim());
  const tel = esc(String(input.telephone ?? '').trim());
  const poste = esc(String(input.poste ?? '').trim());
  const message = esc(String(input.message ?? '').trim());
  const typeForm = esc(String(input.type_form ?? 'spontanee').trim());

  if (!prenom || !nom || !input.email) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }
  const clientEmail = validEmail(input.email);
  if (!clientEmail) return res.status(400).json({ error: 'Adresse email invalide' });

  const identite = `${nom}_${prenom}`;

  const cv = pieceJointe(input.cv, 'CV', identite);
  if (!cv) return res.status(400).json({ error: 'CV manquant' });
  if (cv.erreur) return res.status(400).json({ error: `CV : ${cv.erreur}` });

  const lettre = pieceJointe(input.lettre, 'Lettre', identite);
  if (lettre?.erreur) return res.status(400).json({ error: `Lettre : ${lettre.erreur}` });

  const nomComplet = `${prenom} ${nom}`;
  const posteLabel = poste || 'Candidature spontanée';
  const date = dateFr();
  const ref = reference('CAND');

  const ko = (fichier) => Math.round(Math.ceil(fichier.data.length * 3 / 4) / 1024);
  let piecesInfo = `<p style='margin:4px 0; font-size:13px;'><strong>CV :</strong> ${esc(input.cv.name)} (${ko(input.cv)} Ko) ✓</p>`;
  piecesInfo += lettre
    ? `<p style='margin:4px 0; font-size:13px;'><strong>Lettre de motivation :</strong> ${esc(input.lettre.name)} (${ko(input.lettre)} Ko) ✓</p>`
    : "<p style='margin:4px 0; font-size:13px; color:#999;'><strong>Lettre de motivation :</strong> Non fournie</p>";

  const htmlPR = `
<!DOCTYPE html>
<html lang='fr'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#1b2a4a;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:18px;font-weight:700;'>📋 Nouvelle candidature — ${posteLabel}</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;'>Reçue le ${date} · Réf. ${ref}</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>

    ${section('Candidat', row('Prénom / Nom', nomComplet) + row('Email', clientEmail) + row('Téléphone', tel) + row('Poste visé', posteLabel), '#1b2a4a')}

    ${message ? section('Message / Motivation', `<p style='margin:0; font-size:13px; line-height:1.6;'>${message}</p>`, '#1b2a4a') : ''}

    ${section('Pièces jointes', piecesInfo, '#1b2a4a')}

  </td></tr>

  <tr><td style='background:#f5f5f7;padding:16px 36px;border-top:1px solid #e8e8e8;'>
    <p style='margin:0;font-size:12px;color:#999;text-align:center;'>Email généré automatiquement · pr-logistics.fr</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const htmlCandidat = `
<!DOCTYPE html>
<html lang='fr'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#e30613;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:22px;font-weight:700;'>PR Logistics</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;'>Prestataire logistique &amp; transport · Le Havre</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>
    <h2 style='margin:0 0 8px;font-size:18px;color:#1d1d1f;'>Votre candidature a bien été reçue ✅</h2>
    <p style='margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;'>
      Bonjour <strong>${prenom}</strong>, merci pour l'intérêt que vous portez à PR Logistics.<br>
      Nous avons bien reçu votre candidature pour le poste <strong>${posteLabel}</strong> et nous vous en remercions.
      Notre équipe prendra le temps de l'étudier et vous contactera si votre profil correspond à nos besoins.
    </p>

    ${section('Récapitulatif', row('Référence', ref) + row('Date', date) + row('Poste visé', posteLabel))}

    <p style='font-size:13px;color:#666;line-height:1.6;'>
      Pour toute question, contactez-nous à <a href='mailto:lehavre@pr-logistics.fr' style='color:#e30613;'>lehavre@pr-logistics.fr</a> ou au <strong>02.32.72.48.03</strong>.
    </p>
  </td></tr>

  <tr><td style='background:#f5f5f7;padding:16px 36px;border-top:1px solid #e8e8e8;'>
    <p style='margin:0;font-size:12px;color:#999;text-align:center;'>
      PR Logistics · PLPN 1 – Port 4935, 76700 Rogerville<br>
      02.32.72.48.03 · lehavre@pr-logistics.fr
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const attachments = lettre ? [cv, lettre] : [cv];
  const sujetInterne = (typeForm === 'offre' && poste)
    ? `Candidature — ${poste} — ${nomComplet}`
    : (poste ? `Candidature spontanée — ${nomComplet} — ${poste}` : `Candidature spontanée — ${nomComplet}`);

  const [r1, r2] = await Promise.all([
    sendBrevoEmail({ apiKey, to: PR_EMAIL, toName: PR_NOM, subject: sujetInterne, html: htmlPR, attachments }),
    sendBrevoEmail({ apiKey, to: clientEmail, toName: nomComplet, subject: `Votre candidature chez PR Logistics (${ref})`, html: htmlCandidat }),
  ]);

  if (r1.code === 201 && r2.code === 201) {
    return res.status(200).json({ success: true, ref });
  }
  return res.status(500).json({ error: "Erreur lors de l'envoi", details1: r1.body, details2: r2.body });
}
