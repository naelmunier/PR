<?php
/**
 * PR Logistics — Envoi de devis par email via Brevo (Sendinblue) API
 * Déployer sur Hostinger avec le reste du site Astro.
 *
 * Pour configurer :
 *   1. Créer un compte sur https://app.brevo.com
 *   2. Menu → SMTP & API → Clés API → Générer une clé
 *   3. Remplacer BREVO_API_KEY ci-dessous par votre clé
 */

header('Content-Type: application/json; charset=utf-8');

// ── Sécurité : uniquement les requêtes POST ──────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// ── Configuration ────────────────────────────────────────────────
define('BREVO_API_KEY', getenv('BREVO_API_KEY') ?: '');
define('PR_EMAIL',      'naelmunier22@gmail.com');
define('PR_NOM',        'PR Logistics');

// ── Lecture du corps JSON ────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Corps de requête invalide']);
    exit;
}

// ── Validation des champs requis ─────────────────────────────────
$required = ['nom', 'email', 'pdf_base64'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Champ manquant : $field"]);
        exit;
    }
}

$clientEmail = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
if (!$clientEmail) {
    http_response_code(400);
    echo json_encode(['error' => 'Adresse email invalide']);
    exit;
}

// ── Langue du client ─────────────────────────────────────────────
$lang = (isset($input['lang']) && $input['lang'] === 'en') ? 'en' : 'fr';

// ── Données du formulaire ────────────────────────────────────────
$nom          = htmlspecialchars($input['nom']          ?? '');
$telephone    = htmlspecialchars($input['telephone']    ?? '');
$message      = htmlspecialchars($input['message']      ?? '');
$lots         = $input['lots'] ?? [];
$pdfBase64    = preg_replace('/^data:application\/pdf;base64,/', '', $input['pdf_base64']);
$service      = htmlspecialchars($input['service']      ?? '');

// Transport / Traction
$departVille  = htmlspecialchars($input['depart_ville']  ?? '');
$departDept   = htmlspecialchars($input['depart_dept']   ?? '');
$arriveVille  = htmlspecialchars($input['arrivee_ville'] ?? '');
$arriveDept   = htmlspecialchars($input['arrivee_dept']  ?? '');
$tracVehicule = htmlspecialchars($input['trac_vehicule'] ?? '');
$tracPoids    = htmlspecialchars($input['trac_poids']    ?? '');
$tracPoidsU   = htmlspecialchars($input['trac_poids_unite'] ?? 't');
$tracDate     = htmlspecialchars($input['trac_date']     ?? '');

// Stockage
$stockVille   = htmlspecialchars($input['stock_ville']        ?? '');
$stockDept    = htmlspecialchars($input['stock_dept']         ?? '');
$stockPoids   = htmlspecialchars($input['stock_poids']        ?? '');
$stockPoidsU  = htmlspecialchars($input['stock_poids_unite']  ?? 't');
$stockDuree   = htmlspecialchars($input['stock_duree']        ?? '');
$stockEntree  = htmlspecialchars($input['stock_date_entree']  ?? '');
$stockSortie  = htmlspecialchars($input['stock_date_sortie']  ?? '');
$stockConds   = is_array($input['stock_conditions'] ?? null) ? array_map('htmlspecialchars', $input['stock_conditions']) : [];

// Dépotage / Empotage
$depotOp      = htmlspecialchars($input['depot_operation']   ?? '');
$depotNb      = htmlspecialchars($input['depot_nb']          ?? '');
$depotType    = htmlspecialchars($input['depot_type_cont']   ?? '');
$depotDate    = htmlspecialchars($input['depot_date']        ?? '');
$depotPort    = htmlspecialchars($input['depot_port']        ?? '');
$depotPoids   = htmlspecialchars($input['depot_poids']       ?? '');
$depotPoidsU  = htmlspecialchars($input['depot_poids_unite'] ?? 't');

// ── Labels bilingues ─────────────────────────────────────────────
$serviceLabels = $lang === 'en' ? [
    'depotage'  => 'Devanning / Stuffing',
    'stockage'  => 'Storage',
    'traction'  => 'Traction',
    'transport' => 'Transport & Delivery',
] : [
    'depotage'  => 'Dépotage / Empotage',
    'stockage'  => 'Stockage',
    'traction'  => 'Traction',
    'transport' => 'Transport & Livraison',
];
$serviceLabel = $serviceLabels[$service] ?? $service;

if ($lang === 'en') {
    $depotOpLabel = $depotOp === 'depotage' ? 'Devanning (Container → Warehouse)' : ($depotOp === 'empotage' ? 'Stuffing (Warehouse → Container)' : '');
} else {
    $depotOpLabel = $depotOp === 'depotage' ? 'Dépotage (Conteneur → Entrepôt)' : ($depotOp === 'empotage' ? 'Empotage (Entrepôt → Conteneur)' : '');
}

$conteneurLabels = [
    '20'     => "20' Standard",
    '40'     => "40' Standard",
    '40hc'   => "40' High Cube",
    '45hc'   => "45' High Cube",
    'reefer' => $lang === 'en' ? 'Refrigerated (Reefer)' : 'Réfrigéré (Reefer)',
    'autre'  => $lang === 'en' ? 'Other / Special' : 'Autre / Spécial',
];
$depotTypeLabel = $conteneurLabels[$depotType] ?? $depotType;

// Total palettes
$totalPalettes = 0;
foreach ($lots as $lot) {
    $totalPalettes += intval($lot['palettes'] ?? 0);
}

// Référence (identique à celle générée côté JS si transmise, sinon on recrée)
$ref  = 'DEV-' . strtoupper(substr(time(), -6));
$date = (new DateTime())->format('d/m/Y à H:i');

// ── Construction des lignes de lots (HTML) ────────────────────────
$lotsHtml = '';
$lotLabel = $lang === 'en' ? 'Lot' : 'Lot';
foreach ($lots as $i => $lot) {
    $num     = $i + 1;
    $pal     = htmlspecialchars($lot['palettes'] ?? '');
    $taille  = htmlspecialchars($lot['taille']   ?? '');
    $type    = htmlspecialchars($lot['type']      ?? '');
    $contenu = htmlspecialchars($lot['contenu']   ?? '');
    $bg      = $i % 2 === 0 ? '#ffffff' : '#f9f9f9';
    $palText = $lang === 'en' ? "$pal pallet(s)" : "$pal palette(s)";
    $lotsHtml .= "
    <tr style='background:$bg;'>
      <td style='padding:8px 12px; color:#666; font-weight:600;'>$lotLabel $num</td>
      <td style='padding:8px 12px;'>$palText</td>
      <td style='padding:8px 12px;'>$taille</td>
      <td style='padding:8px 12px;'>$type</td>
      <td style='padding:8px 12px;'>$contenu</td>
    </tr>";
}

// ── Template email commun (tableau de lots) ───────────────────────
function buildLotsTable(string $lotsHtml, int $totalPalettes, string $lang = 'fr'): string {
    $hLot     = 'Lot';
    $hPal     = $lang === 'en' ? 'Pallets'  : 'Palettes';
    $hFormat  = $lang === 'en' ? 'Format'   : 'Format';
    $hType    = $lang === 'en' ? 'Type'     : 'Type';
    $hContent = $lang === 'en' ? 'Content'  : 'Contenu';
    $tTotal   = 'TOTAL';
    $tPal     = $lang === 'en' ? "$totalPalettes pallet(s)" : "$totalPalettes palette(s)";
    return "
    <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse; font-size:13px; margin-top:8px;'>
      <thead>
        <tr style='background:#e30613; color:#fff;'>
          <th style='padding:8px 12px; text-align:left;'>$hLot</th>
          <th style='padding:8px 12px; text-align:left;'>$hPal</th>
          <th style='padding:8px 12px; text-align:left;'>$hFormat</th>
          <th style='padding:8px 12px; text-align:left;'>$hType</th>
          <th style='padding:8px 12px; text-align:left;'>$hContent</th>
        </tr>
      </thead>
      <tbody>
        $lotsHtml
        <tr style='background:#fff3f3; font-weight:700;'>
          <td colspan='1' style='padding:8px 12px; color:#e30613;'>$tTotal</td>
          <td style='padding:8px 12px; color:#e30613;'>$tPal</td>
          <td colspan='3'></td>
        </tr>
      </tbody>
    </table>";
}

// ── Helpers HTML ────────────────────────────────────────────────
function row(string $label, string $value): string {
    if (!$value) return '';
    return "<p style='margin:4px 0; font-size:13px;'><strong>$label :</strong> $value</p>";
}

function section(string $titre, string $contenu, string $accent = '#e30613'): string {
    if (!trim($contenu)) return '';
    return "
    <div style='background:#f9f9f9; border-radius:8px; padding:20px 24px; margin-bottom:20px;'>
      <h3 style='margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:$accent;'>$titre</h3>
      $contenu
    </div>";
}

// ── Blocs de contenu par service ─────────────────────────────────

// Coordonnées client (commun)
if ($lang === 'en') {
    $blocCoordonnees = row('Name / Company', $nom)
        . row('Email', $clientEmail)
        . ($telephone ? "<p style='margin:4px 0; font-size:13px;'><strong>Phone :</strong> $telephone</p>" : '');
} else {
    $blocCoordonnees = row('Nom / Société', $nom)
        . row('Email', $clientEmail)
        . ($telephone ? "<p style='margin:4px 0; font-size:13px;'><strong>Téléphone :</strong> $telephone</p>" : '');
}

// Détails selon le service
$blocDetails = '';
$addInfoLabel = $lang === 'en' ? 'Additional information' : 'Informations complémentaires';
$blocMarchandise = buildLotsTable($lotsHtml, $totalPalettes, $lang)
    . ($message ? "<p style='margin-top:12px; font-size:13px;'><strong>$addInfoLabel :</strong><br>$message</p>" : '');

if ($service === 'depotage') {
    if ($lang === 'en') {
        $blocDetails = row('Operation type', $depotOpLabel)
            . row('Number of containers', $depotNb ? "$depotNb container(s)" : '')
            . row('Container type', $depotTypeLabel)
            . row('Requested date', $depotDate)
            . row('Port / Terminal', $depotPort)
            . row('Estimated weight', $depotPoids ? "$depotPoids $depotPoidsU" : '');
    } else {
        $blocDetails = row('Type d\'opération', $depotOpLabel)
            . row('Nombre de conteneurs', $depotNb ? "$depotNb conteneur(s)" : '')
            . row('Type de conteneur', $depotTypeLabel)
            . row('Date souhaitée', $depotDate)
            . row('Port / Terminal', $depotPort)
            . row('Poids estimé', $depotPoids ? "$depotPoids $depotPoidsU" : '');
    }
} elseif ($service === 'transport') {
    if ($lang === 'en') {
        $blocDetails = row('Pickup address', $departVille ? "$departVille ($departDept)" : '')
            . row('Delivery address', $arriveVille ? "$arriveVille ($arriveDept)" : '');
    } else {
        $blocDetails = row('Adresse de départ', $departVille ? "$departVille ($departDept)" : '')
            . row('Adresse de livraison', $arriveVille ? "$arriveVille ($arriveDept)" : '');
    }
} elseif ($service === 'traction') {
    if ($lang === 'en') {
        $blocDetails = row('Pickup point', $departVille ? "$departVille ($departDept)" : '')
            . row('Delivery point', $arriveVille ? "$arriveVille ($arriveDept)" : '')
            . row('Vehicle type', $tracVehicule)
            . row('Total weight', $tracPoids ? "$tracPoids $tracPoidsU" : '')
            . row('Requested date', $tracDate);
    } else {
        $blocDetails = row('Point d\'enlèvement', $departVille ? "$departVille ($departDept)" : '')
            . row('Point de livraison', $arriveVille ? "$arriveVille ($arriveDept)" : '')
            . row('Type de véhicule', $tracVehicule)
            . row('Poids total', $tracPoids ? "$tracPoids $tracPoidsU" : '')
            . row('Date souhaitée', $tracDate);
    }
} elseif ($service === 'stockage') {
    $condsStr = !empty($stockConds) ? implode(', ', $stockConds) : '';
    if ($lang === 'en') {
        $siteStockage = $stockVille ? "$stockVille ($stockDept)" : 'Le Havre Port — 76700 Rogerville (PR Logistics warehouse)';
        $blocDetails  = row('Storage site', $siteStockage)
            . row('Desired duration', $stockDuree)
            . row('Entry date', $stockEntree)
            . row('Estimated exit date', $stockSortie)
            . row('Estimated weight', $stockPoids ? "$stockPoids $stockPoidsU" : '')
            . row('Special conditions', $condsStr);
    } else {
        $siteStockage = $stockVille ? "$stockVille ($stockDept)" : 'Port du Havre — 76700 Rogerville (entrepôt PR Logistics)';
        $blocDetails  = row('Site de stockage', $siteStockage)
            . row('Durée souhaitée', $stockDuree)
            . row('Date d\'entrée', $stockEntree)
            . row('Date de sortie estimée', $stockSortie)
            . row('Poids estimé', $stockPoids ? "$stockPoids $stockPoidsU" : '')
            . row('Conditions particulières', $condsStr);
    }
}

// Titres des sections selon le service
if ($lang === 'en') {
    $titreDetails = [
        'depotage'  => 'Operation details',
        'transport' => 'Transport',
        'traction'  => 'Traction route',
        'stockage'  => 'Storage conditions',
    ][$service] ?? 'Details';
} else {
    $titreDetails = [
        'depotage'  => 'Détails de l\'opération',
        'transport' => 'Transport',
        'traction'  => 'Itinéraire de traction',
        'stockage'  => 'Conditions de stockage',
    ][$service] ?? 'Détails';
}

// ── Email 1 : Confirmation client (bilingue) ────────────────────
if ($lang === 'en') {
    $htmlLang       = 'en';
    $tagline        = 'Logistics &amp; transport provider · Le Havre';
    $titleConfirm   = 'Your quote request has been received ✅';
    $introText      = "Hello <strong>$nom</strong>, thank you for your request. Our team has received it and will send you a personalised quote within 24 hours.";
    $sectionSummary = 'Summary';
    $labelRef       = 'Reference';
    $labelDate      = 'Date';
    $labelService   = 'Service requested';
    $sectionCoords  = 'Your details';
    $sectionCargo   = "Cargo details ($totalPalettes pallet(s))";
    $contactLine    = "For any questions, contact us at <a href='mailto:lehavre@pr-logistics.fr' style='color:#e30613;'>lehavre@pr-logistics.fr</a> or call <strong>+33 2 32 72 48 03</strong>.";
    $subjectClient  = "Your PR Logistics quote request ($ref)";
} else {
    $htmlLang       = 'fr';
    $tagline        = 'Prestataire logistique &amp; transport · Le Havre';
    $titleConfirm   = 'Votre demande de devis a bien été reçue ✅';
    $introText      = "Bonjour <strong>$nom</strong>, merci pour votre demande. Notre équipe l'a reçue et vous enverra un devis personnalisé sous 24h.";
    $sectionSummary = 'Récapitulatif';
    $labelRef       = 'Référence';
    $labelDate      = 'Date';
    $labelService   = 'Service demandé';
    $sectionCoords  = 'Vos coordonnées';
    $sectionCargo   = "Détails de la marchandise ($totalPalettes palette(s))";
    $contactLine    = "Pour toute question, contactez-nous à <a href='mailto:lehavre@pr-logistics.fr' style='color:#e30613;'>lehavre@pr-logistics.fr</a> ou au <strong>02.32.72.48.03</strong>.";
    $subjectClient  = "Votre demande de devis PR Logistics ($ref)";
}

$htmlClient = "
<!DOCTYPE html>
<html lang='$htmlLang'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#e30613;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:22px;font-weight:700;'>PR Logistics</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;'>$tagline</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>
    <h2 style='margin:0 0 8px;font-size:18px;color:#1d1d1f;'>$titleConfirm</h2>
    <p style='margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;'>$introText</p>

    " . section($sectionSummary,
        "<p style='margin:4px 0;font-size:13px;'><strong>$labelRef :</strong> $ref</p>"
      . "<p style='margin:4px 0;font-size:13px;'><strong>$labelDate :</strong> $date</p>"
      . "<p style='margin:4px 0;font-size:13px;'><strong>$labelService :</strong> $serviceLabel</p>"
    ) . "

    " . section($sectionCoords, $blocCoordonnees) . "

    " . section($titreDetails, $blocDetails) . "

    " . section($sectionCargo, $blocMarchandise) . "

    <p style='font-size:13px;color:#666;line-height:1.6;margin-top:8px;'>$contactLine</p>
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
</html>";

// ── Email 2 : Notification interne PR Logistics (toujours en FR) ──
// Labels FR pour l'email interne (indépendant de la langue du client)
$serviceLabels_FR = [
    'depotage'  => 'Dépotage / Empotage',
    'stockage'  => 'Stockage',
    'traction'  => 'Traction',
    'transport' => 'Transport & Livraison',
];
$serviceLabel_FR = $serviceLabels_FR[$service] ?? $service;

$blocCoordonnees_FR = row('Nom / Société', $nom)
    . row('Email', $clientEmail)
    . ($telephone ? "<p style='margin:4px 0; font-size:13px;'><strong>Téléphone :</strong> $telephone</p>" : '');

$titreDetails_FR = [
    'depotage'  => 'Détails de l\'opération',
    'transport' => 'Transport',
    'traction'  => 'Itinéraire de traction',
    'stockage'  => 'Conditions de stockage',
][$service] ?? 'Détails';

if ($service === 'depotage') {
    $depotOpLabel_FR = $depotOp === 'depotage' ? 'Dépotage (Conteneur → Entrepôt)' : ($depotOp === 'empotage' ? 'Empotage (Entrepôt → Conteneur)' : '');
    $depotTypeLabel_FR = ['20'=>"20' Standard",'40'=>"40' Standard",'40hc'=>"40' High Cube",'45hc'=>"45' High Cube",'reefer'=>'Réfrigéré (Reefer)','autre'=>'Autre / Spécial'][$depotType] ?? $depotType;
    $blocDetails_FR = row('Type d\'opération', $depotOpLabel_FR)
        . row('Nombre de conteneurs', $depotNb ? "$depotNb conteneur(s)" : '')
        . row('Type de conteneur', $depotTypeLabel_FR)
        . row('Date souhaitée', $depotDate)
        . row('Port / Terminal', $depotPort)
        . row('Poids estimé', $depotPoids ? "$depotPoids $depotPoidsU" : '');
} elseif ($service === 'transport') {
    $blocDetails_FR = row('Adresse de départ', $departVille ? "$departVille ($departDept)" : '')
        . row('Adresse de livraison', $arriveVille ? "$arriveVille ($arriveDept)" : '');
} elseif ($service === 'traction') {
    $blocDetails_FR = row('Point d\'enlèvement', $departVille ? "$departVille ($departDept)" : '')
        . row('Point de livraison', $arriveVille ? "$arriveVille ($arriveDept)" : '')
        . row('Type de véhicule', $tracVehicule)
        . row('Poids total', $tracPoids ? "$tracPoids $tracPoidsU" : '')
        . row('Date souhaitée', $tracDate);
} elseif ($service === 'stockage') {
    $condsStr_FR    = !empty($stockConds) ? implode(', ', $stockConds) : '';
    $siteStockage_FR = $stockVille ? "$stockVille ($stockDept)" : 'Port du Havre — 76700 Rogerville (entrepôt PR Logistics)';
    $blocDetails_FR  = row('Site de stockage', $siteStockage_FR)
        . row('Durée souhaitée', $stockDuree)
        . row('Date d\'entrée', $stockEntree)
        . row('Date de sortie estimée', $stockSortie)
        . row('Poids estimé', $stockPoids ? "$stockPoids $stockPoidsU" : '')
        . row('Conditions particulières', $condsStr_FR);
} else {
    $blocDetails_FR = '';
}

$blocMarchandise_FR = buildLotsTable($lotsHtml, $totalPalettes, 'fr')
    . ($message ? "<p style='margin-top:12px; font-size:13px;'><strong>Informations complémentaires :</strong><br>$message</p>" : '');

$langBadge = $lang === 'en' ? " <span style='background:#1b2a4a;color:#a0b4d0;font-size:11px;padding:2px 7px;border-radius:10px;margin-left:8px;'>🇬🇧 EN</span>" : '';

$htmlPR = "
<!DOCTYPE html>
<html lang='fr'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#1b2a4a;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:18px;font-weight:700;'>🔔 Nouvelle demande de devis — $serviceLabel_FR$langBadge</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;'>Reçue le $date · Réf. $ref</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>

    " . section('Client', $blocCoordonnees_FR, '#1b2a4a') . "

    " . section($titreDetails_FR, $blocDetails_FR ?? '', '#1b2a4a') . "

    " . section("Marchandise ($totalPalettes palette(s))", $blocMarchandise_FR, '#1b2a4a') . "

  </td></tr>

  <tr><td style='background:#f5f5f7;padding:16px 36px;border-top:1px solid #e8e8e8;'>
    <p style='margin:0;font-size:12px;color:#999;text-align:center;'>Email généré automatiquement · pr-logistics.fr</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>";

// ── Fonction d'envoi via Brevo API ────────────────────────────────
function sendBrevoEmail(
    string $apiKey,
    string $toEmail,
    string $toName,
    string $fromEmail,
    string $fromName,
    string $subject,
    string $htmlContent,
    ?string $pdfBase64 = null
): array {
    $payload = [
        'sender'      => ['email' => $fromEmail, 'name' => $fromName],
        'to'          => [['email' => $toEmail, 'name' => $toName]],
        'subject'     => $subject,
        'htmlContent' => $htmlContent,
    ];
    if ($pdfBase64) {
        $payload['attachment'] = [[
            'content' => $pdfBase64,
            'name'    => 'Devis_PR_Logistics.pdf',
        ]];
    }

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'api-key: ' . $apiKey,
            'content-type: application/json',
        ],
        CURLOPT_TIMEOUT        => 15,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    return ['code' => $httpCode, 'body' => $response, 'error' => $error];
}

// ── Envoi des deux emails ─────────────────────────────────────────
// Sujet interne (toujours en FR)
$sujetPR = "Demande de devis — $nom — $serviceLabel_FR";
if ($departVille) $sujetPR .= " — $departVille → $arriveVille";

// 1) Confirmation au client — sans PDF (langue du client)
$r1 = sendBrevoEmail(
    BREVO_API_KEY,
    $clientEmail,
    $nom,
    PR_EMAIL,
    PR_NOM,
    $subjectClient,
    $htmlClient
);

// 2) Notification interne PR Logistics — avec PDF (toujours en FR)
$r2 = sendBrevoEmail(
    BREVO_API_KEY,
    PR_EMAIL,
    PR_NOM,
    PR_EMAIL,
    PR_NOM,
    $sujetPR,
    $htmlPR,
    $pdfBase64
);

// ── Réponse ───────────────────────────────────────────────────────
if ($r1['code'] === 201 && $r2['code'] === 201) {
    echo json_encode(['success' => true, 'ref' => $ref]);
} else {
    http_response_code(500);
    echo json_encode([
        'error'    => 'Erreur lors de l\'envoi des emails',
        'details1' => $r1['body'],
        'details2' => $r2['body'],
    ]);
}
