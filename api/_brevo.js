/**
 * Utilitaires partagés par les fonctions serverless (envoi d'emails via Brevo).
 *
 * Le site est déployé sur Vercel, qui n'exécute pas PHP : les anciens scripts
 * `public/send-*.php` étaient servis comme fichiers statiques, d'où la réponse
 * non-JSON et l'erreur côté client au moment du `res.json()`.
 */

export const PR_EMAIL = 'naelmunier22@gmail.com';
export const PR_NOM = 'PR Logistics';

/** Échappe les caractères HTML — équivalent de `htmlspecialchars` en PHP. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Validation d'email volontairement simple, alignée sur FILTER_VALIDATE_EMAIL. */
export function validEmail(value) {
  const email = String(value ?? '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : null;
}

/** Ligne « label : valeur » d'un bloc email. Renvoie '' si la valeur est vide. */
export function row(label, value) {
  if (!value) return '';
  return `<p style='margin:4px 0; font-size:13px;'><strong>${label} :</strong> ${value}</p>`;
}

/** Encart gris avec un titre en capitales. Renvoie '' si le contenu est vide. */
export function section(titre, contenu, accent = '#e30613') {
  if (!contenu || !contenu.trim()) return '';
  return `
    <div style='background:#f9f9f9; border-radius:8px; padding:20px 24px; margin-bottom:20px;'>
      <h3 style='margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:${accent};'>${titre}</h3>
      ${contenu}
    </div>`;
}

/** Date au format « 01/09/2026 à 14:32 », fuseau de Paris. */
export function dateFr() {
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map(x => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} à ${p.hour}:${p.minute}`;
}

/** Référence courte du type « DEV-123456 ». */
export function reference(prefixe) {
  return `${prefixe}-${String(Date.now()).slice(-6)}`;
}

/**
 * Envoie un email transactionnel via l'API Brevo.
 * Renvoie `{ code, body }` pour reproduire le contrat des anciens scripts PHP.
 */
export async function sendBrevoEmail({ apiKey, to, toName, subject, html, attachments }) {
  const payload = {
    sender: { email: PR_EMAIL, name: PR_NOM },
    to: [{ email: to, name: toName }],
    subject,
    htmlContent: html,
  };
  if (attachments?.length) payload.attachment = attachments;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { code: res.status, body: await res.text() };
  } catch (err) {
    return { code: 0, body: err.name === 'AbortError' ? 'Délai dépassé' : err.message };
  } finally {
    clearTimeout(timeout);
  }
}

/** Garde commune : méthode POST, clé API configurée, corps JSON exploitable. */
export function guard(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return null;
  }
  /* La clé est souvent collée avec un espace, un retour à la ligne ou des
     guillemets : Brevo répond alors « Key not found ». On nettoie avant usage. */
  const apiKey = String(process.env.BREVO_API_KEY ?? '').trim().replace(/^["']|["']$/g, '');
  if (!apiKey) {
    res.status(500).json({ error: "Service d'envoi non configuré (BREVO_API_KEY manquante)" });
    return null;
  }
  if (!apiKey.startsWith('xkeysib-')) {
    res.status(500).json({ error: "BREVO_API_KEY invalide : une clé API v3 commence par « xkeysib- »" });
    return null;
  }
  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Corps de requête invalide' });
    return null;
  }
  return { apiKey, body };
}

function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}
