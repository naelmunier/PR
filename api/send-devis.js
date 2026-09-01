/**
 * PR Logistics — Envoi d'une demande de devis par email via Brevo.
 * Portage de l'ancien `public/send-devis.php` (Vercel n'exécute pas PHP).
 *
 * Deux emails partent : une confirmation au client dans sa langue, et une
 * notification interne toujours en français.
 */

import {
  PR_EMAIL, PR_NOM, esc, validEmail, row, section, dateFr, reference,
  sendBrevoEmail, guard,
} from './_brevo.js';

export default async function handler(req, res) {
  const ctx = guard(req, res);
  if (!ctx) return;
  const { apiKey, body: input } = ctx;

  for (const field of ['nom', 'email', 'pdf_base64']) {
    if (!input[field]) {
      return res.status(400).json({ error: `Champ manquant : ${field}` });
    }
  }

  const clientEmail = validEmail(input.email);
  if (!clientEmail) return res.status(400).json({ error: 'Adresse email invalide' });

  const lang = input.lang === 'en' ? 'en' : 'fr';
  const en = lang === 'en';

  const nom = esc(input.nom);
  const telephone = esc(input.telephone);
  const message = esc(input.message);
  const service = esc(input.service);
  const lots = Array.isArray(input.lots) ? input.lots : [];

  const departVille = esc(input.depart_ville);
  const departDept = esc(input.depart_dept);
  const arriveVille = esc(input.arrivee_ville);
  const arriveDept = esc(input.arrivee_dept);
  const tracVehicule = esc(input.trac_vehicule);
  const tracPoids = esc(input.trac_poids);
  const tracPoidsU = esc(input.trac_poids_unite || 't');
  const tracDate = esc(input.trac_date);

  const stockVille = esc(input.stock_ville);
  const stockDept = esc(input.stock_dept);
  const stockPoids = esc(input.stock_poids);
  const stockPoidsU = esc(input.stock_poids_unite || 't');
  const stockDuree = esc(input.stock_duree);
  const stockEntree = esc(input.stock_date_entree);
  const stockSortie = esc(input.stock_date_sortie);
  const stockConds = Array.isArray(input.stock_conditions) ? input.stock_conditions.map(esc) : [];

  const depotOp = esc(input.depot_operation);
  const depotNb = esc(input.depot_nb);
  const depotType = esc(input.depot_type_cont);
  const depotDate = esc(input.depot_date);
  const depotPort = esc(input.depot_port);
  const depotPoids = esc(input.depot_poids);
  const depotPoidsU = esc(input.depot_poids_unite || 't');

  // ── Libellés ────────────────────────────────────────────────────
  const servicesFr = {
    depotage: 'Dépotage / Empotage',
    stockage: 'Stockage',
    traction: 'Traction',
    transport: 'Transport & Livraison',
  };
  const servicesEn = {
    depotage: 'Devanning / Stuffing',
    stockage: 'Storage',
    traction: 'Traction',
    transport: 'Transport & Delivery',
  };
  const serviceLabel = (en ? servicesEn : servicesFr)[service] ?? service;
  const serviceLabelFr = servicesFr[service] ?? service;

  const opLabel = (isEn) => {
    if (depotOp === 'depotage') return isEn ? 'Devanning (Container → Warehouse)' : 'Dépotage (Conteneur → Entrepôt)';
    if (depotOp === 'empotage') return isEn ? 'Stuffing (Warehouse → Container)' : 'Empotage (Entrepôt → Conteneur)';
    return '';
  };
  const contLabel = (isEn) => ({
    20: "20' Standard",
    40: "40' Standard",
    '40hc': "40' High Cube",
    '45hc': "45' High Cube",
    reefer: isEn ? 'Refrigerated (Reefer)' : 'Réfrigéré (Reefer)',
    autre: isEn ? 'Other / Special' : 'Autre / Spécial',
  }[depotType] ?? depotType);

  const totalPalettes = lots.reduce((n, lot) => n + (parseInt(lot.palettes, 10) || 0), 0);
  const ref = reference('DEV');
  const date = dateFr();

  // ── Tableau des lots ────────────────────────────────────────────
  const lotsRows = (isEn) => lots.map((lot, i) => {
    const pal = esc(lot.palettes);
    const bg = i % 2 === 0 ? '#ffffff' : '#f9f9f9';
    const palText = isEn ? `${pal} pallet(s)` : `${pal} palette(s)`;
    return `
    <tr style='background:${bg};'>
      <td style='padding:8px 12px; color:#666; font-weight:600;'>Lot ${i + 1}</td>
      <td style='padding:8px 12px;'>${palText}</td>
      <td style='padding:8px 12px;'>${esc(lot.taille)}</td>
      <td style='padding:8px 12px;'>${esc(lot.type)}</td>
      <td style='padding:8px 12px;'>${esc(lot.contenu)}</td>
    </tr>`;
  }).join('');

  const lotsTable = (isEn) => `
    <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse; font-size:13px; margin-top:8px;'>
      <thead>
        <tr style='background:#e30613; color:#fff;'>
          <th style='padding:8px 12px; text-align:left;'>Lot</th>
          <th style='padding:8px 12px; text-align:left;'>${isEn ? 'Pallets' : 'Palettes'}</th>
          <th style='padding:8px 12px; text-align:left;'>Format</th>
          <th style='padding:8px 12px; text-align:left;'>Type</th>
          <th style='padding:8px 12px; text-align:left;'>${isEn ? 'Content' : 'Contenu'}</th>
        </tr>
      </thead>
      <tbody>
        ${lotsRows(isEn)}
        <tr style='background:#fff3f3; font-weight:700;'>
          <td colspan='1' style='padding:8px 12px; color:#e30613;'>TOTAL</td>
          <td style='padding:8px 12px; color:#e30613;'>${totalPalettes} ${isEn ? 'pallet(s)' : 'palette(s)'}</td>
          <td colspan='3'></td>
        </tr>
      </tbody>
    </table>`;

  const blocMarchandise = (isEn) => lotsTable(isEn) + (message
    ? `<p style='margin-top:12px; font-size:13px;'><strong>${isEn ? 'Additional information' : 'Informations complémentaires'} :</strong><br>${message}</p>`
    : '');

  // ── Coordonnées client ──────────────────────────────────────────
  const blocCoordonnees = (isEn) =>
    row(isEn ? 'Name / Company' : 'Nom / Société', nom)
    + row('Email', clientEmail)
    + row(isEn ? 'Phone' : 'Téléphone', telephone);

  // ── Détails selon le service ────────────────────────────────────
  const blocDetails = (isEn) => {
    if (service === 'depotage') {
      return row(isEn ? 'Operation type' : "Type d'opération", opLabel(isEn))
        + row(isEn ? 'Number of containers' : 'Nombre de conteneurs', depotNb ? `${depotNb} ${isEn ? 'container(s)' : 'conteneur(s)'}` : '')
        + row(isEn ? 'Container type' : 'Type de conteneur', contLabel(isEn))
        + row(isEn ? 'Requested date' : 'Date souhaitée', depotDate)
        + row('Port / Terminal', depotPort)
        + row(isEn ? 'Estimated weight' : 'Poids estimé', depotPoids ? `${depotPoids} ${depotPoidsU}` : '');
    }
    if (service === 'transport') {
      return row(isEn ? 'Pickup address' : 'Adresse de départ', departVille ? `${departVille} (${departDept})` : '')
        + row(isEn ? 'Delivery address' : 'Adresse de livraison', arriveVille ? `${arriveVille} (${arriveDept})` : '');
    }
    if (service === 'traction') {
      return row(isEn ? 'Pickup point' : "Point d'enlèvement", departVille ? `${departVille} (${departDept})` : '')
        + row(isEn ? 'Delivery point' : 'Point de livraison', arriveVille ? `${arriveVille} (${arriveDept})` : '')
        + row(isEn ? 'Vehicle type' : 'Type de véhicule', tracVehicule)
        + row(isEn ? 'Total weight' : 'Poids total', tracPoids ? `${tracPoids} ${tracPoidsU}` : '')
        + row(isEn ? 'Requested date' : 'Date souhaitée', tracDate);
    }
    if (service === 'stockage') {
      const site = stockVille
        ? `${stockVille} (${stockDept})`
        : (isEn ? 'Le Havre Port — 76700 Rogerville (PR Logistics warehouse)' : 'Port du Havre — 76700 Rogerville (entrepôt PR Logistics)');
      return row(isEn ? 'Storage site' : 'Site de stockage', site)
        + row(isEn ? 'Desired duration' : 'Durée souhaitée', stockDuree)
        + row(isEn ? 'Entry date' : "Date d'entrée", stockEntree)
        + row(isEn ? 'Estimated exit date' : 'Date de sortie estimée', stockSortie)
        + row(isEn ? 'Estimated weight' : 'Poids estimé', stockPoids ? `${stockPoids} ${stockPoidsU}` : '')
        + row(isEn ? 'Special conditions' : 'Conditions particulières', stockConds.join(', '));
    }
    return '';
  };

  const titreDetails = (isEn) => (isEn ? {
    depotage: 'Operation details',
    transport: 'Transport',
    traction: 'Traction route',
    stockage: 'Storage conditions',
  } : {
    depotage: "Détails de l'opération",
    transport: 'Transport',
    traction: 'Itinéraire de traction',
    stockage: 'Conditions de stockage',
  })[service] ?? (isEn ? 'Details' : 'Détails');

  // ── Email 1 : confirmation client ───────────────────────────────
  const txt = en ? {
    tagline: 'Logistics &amp; transport provider · Le Havre',
    title: 'Your quote request has been received ✅',
    intro: `Hello <strong>${nom}</strong>, thank you for your request. Our team has received it and will send you a personalised quote within 24 hours.`,
    summary: 'Summary',
    ref: 'Reference', date: 'Date', service: 'Service requested',
    coords: 'Your details',
    cargo: `Cargo details (${totalPalettes} pallet(s))`,
    contact: "For any questions, contact us at <a href='mailto:lehavre@pr-logistics.fr' style='color:#e30613;'>lehavre@pr-logistics.fr</a> or call <strong>+33 2 32 72 48 03</strong>.",
    subject: `Your PR Logistics quote request (${ref})`,
  } : {
    tagline: 'Prestataire logistique &amp; transport · Le Havre',
    title: 'Votre demande de devis a bien été reçue ✅',
    intro: `Bonjour <strong>${nom}</strong>, merci pour votre demande. Notre équipe l'a reçue et vous enverra un devis personnalisé sous 24h.`,
    summary: 'Récapitulatif',
    ref: 'Référence', date: 'Date', service: 'Service demandé',
    coords: 'Vos coordonnées',
    cargo: `Détails de la marchandise (${totalPalettes} palette(s))`,
    contact: "Pour toute question, contactez-nous à <a href='mailto:lehavre@pr-logistics.fr' style='color:#e30613;'>lehavre@pr-logistics.fr</a> ou au <strong>02.32.72.48.03</strong>.",
    subject: `Votre demande de devis PR Logistics (${ref})`,
  };

  const htmlClient = `
<!DOCTYPE html>
<html lang='${lang}'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#e30613;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:22px;font-weight:700;'>PR Logistics</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;'>${txt.tagline}</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>
    <h2 style='margin:0 0 8px;font-size:18px;color:#1d1d1f;'>${txt.title}</h2>
    <p style='margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;'>${txt.intro}</p>

    ${section(txt.summary, row(txt.ref, ref) + row(txt.date, date) + row(txt.service, serviceLabel))}

    ${section(txt.coords, blocCoordonnees(en))}

    ${section(titreDetails(en), blocDetails(en))}

    ${section(txt.cargo, blocMarchandise(en))}

    <p style='font-size:13px;color:#666;line-height:1.6;margin-top:8px;'>${txt.contact}</p>
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

  // ── Email 2 : notification interne, toujours en français ────────
  const langBadge = en
    ? " <span style='background:#1b2a4a;color:#a0b4d0;font-size:11px;padding:2px 7px;border-radius:10px;margin-left:8px;'>🇬🇧 EN</span>"
    : '';

  const htmlPR = `
<!DOCTYPE html>
<html lang='fr'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#1b2a4a;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:18px;font-weight:700;'>🔔 Nouvelle demande de devis — ${serviceLabelFr}${langBadge}</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;'>Reçue le ${date} · Réf. ${ref}</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>

    ${section('Client', blocCoordonnees(false), '#1b2a4a')}

    ${section(titreDetails(false), blocDetails(false), '#1b2a4a')}

    ${section(`Marchandise (${totalPalettes} palette(s))`, blocMarchandise(false), '#1b2a4a')}

  </td></tr>

  <tr><td style='background:#f5f5f7;padding:16px 36px;border-top:1px solid #e8e8e8;'>
    <p style='margin:0;font-size:12px;color:#999;text-align:center;'>Email généré automatiquement · pr-logistics.fr</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // ── Envoi ───────────────────────────────────────────────────────
  let sujetPR = `Demande de devis — ${nom} — ${serviceLabelFr}`;
  if (departVille) sujetPR += ` — ${departVille} → ${arriveVille}`;

  const pdf = String(input.pdf_base64).replace(/^data:application\/pdf;base64,/, '');
  const piecesJointes = [{ content: pdf, name: `Devis_PR_Logistics_${ref}.pdf` }];

  const [r1, r2] = await Promise.all([
    sendBrevoEmail({ apiKey, to: clientEmail, toName: nom, subject: txt.subject, html: htmlClient, attachments: piecesJointes }),
    sendBrevoEmail({ apiKey, to: PR_EMAIL, toName: PR_NOM, subject: sujetPR, html: htmlPR, attachments: piecesJointes }),
  ]);

  if (r1.code === 201 && r2.code === 201) {
    return res.status(200).json({ success: true, ref });
  }
  return res.status(500).json({
    error: "Erreur lors de l'envoi des emails",
    details1: r1.body,
    details2: r2.body,
  });
}
