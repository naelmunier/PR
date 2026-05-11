<?php
/**
 * PR Logistics — Réception de candidatures via Brevo API
 * Déployer sur Hostinger avec le reste du site Astro.
 */

ob_start(); // Capturer toute sortie parasite avant le JSON
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// ── Configuration ────────────────────────────────────────────────
define('BREVO_API_KEY', getenv('BREVO_API_KEY') ?: '');
define('PR_EMAIL',      'naelmunier22@gmail.com');
define('PR_NOM',        'PR Logistics');

// ── Lecture des champs POST ──────────────────────────────────────
$prenom   = htmlspecialchars(trim($_POST['prenom']   ?? ''));
$nom      = htmlspecialchars(trim($_POST['nom']      ?? ''));
$email    = trim($_POST['email']    ?? '');
$tel      = htmlspecialchars(trim($_POST['telephone'] ?? ''));
$poste    = htmlspecialchars(trim($_POST['poste']    ?? ''));
$message  = htmlspecialchars(trim($_POST['message']  ?? ''));

// ── Validation ───────────────────────────────────────────────────
if (!$prenom || !$nom || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs requis manquants']);
    exit;
}
$clientEmail = filter_var($email, FILTER_VALIDATE_EMAIL);
if (!$clientEmail) {
    http_response_code(400);
    echo json_encode(['error' => 'Adresse email invalide']);
    exit;
}

// ── Lecture et validation du CV ──────────────────────────────────
if (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'CV manquant ou erreur upload']);
    exit;
}

$cvFile     = $_FILES['cv'];
$cvMime     = mime_content_type($cvFile['tmp_name']);
$allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
if (!in_array($cvMime, $allowedMimes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Format CV non accepté (PDF, DOC, DOCX uniquement)']);
    exit;
}
if ($cvFile['size'] > 6 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'CV trop volumineux (max 6 Mo)']);
    exit;
}
$cvBase64   = base64_encode(file_get_contents($cvFile['tmp_name']));
$cvName     = 'CV_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nom . '_' . $prenom) . '.' . pathinfo($cvFile['name'], PATHINFO_EXTENSION);

// ── Lettre de motivation (optionnelle) ───────────────────────────
$lettreBase64 = null;
$lettreName   = null;
if (isset($_FILES['lettre']) && $_FILES['lettre']['error'] === UPLOAD_ERR_OK) {
    $lettreFile = $_FILES['lettre'];
    $lettreMime = mime_content_type($lettreFile['tmp_name']);
    if (in_array($lettreMime, $allowedMimes) && $lettreFile['size'] <= 6 * 1024 * 1024) {
        $lettreBase64 = base64_encode(file_get_contents($lettreFile['tmp_name']));
        $lettreName   = 'Lettre_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nom . '_' . $prenom) . '.' . pathinfo($lettreFile['name'], PATHINFO_EXTENSION);
    }
}

// ── Données de base ──────────────────────────────────────────────
$nomComplet = $prenom . ' ' . $nom;
$posteLabel = $poste ?: 'Candidature spontanée';
$date       = (new DateTime())->format('d/m/Y à H:i');
$ref        = 'CAND-' . strtoupper(substr(time(), -6));

// ── Helpers ──────────────────────────────────────────────────────
function row2(string $label, string $value): string {
    if (!$value) return '';
    return "<p style='margin:4px 0; font-size:13px;'><strong>$label :</strong> $value</p>";
}

function section2(string $titre, string $contenu): string {
    if (!trim($contenu)) return '';
    return "
    <div style='background:#f9f9f9; border-radius:8px; padding:20px 24px; margin-bottom:20px;'>
      <h3 style='margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#1b2a4a;'>$titre</h3>
      $contenu
    </div>";
}

// ── Email interne PR Logistics ────────────────────────────────────
$attachmentsInfo = "<p style='margin:4px 0; font-size:13px;'><strong>CV :</strong> {$cvFile['name']} (" . round($cvFile['size'] / 1024) . " Ko) ✓</p>";
if ($lettreName) {
    $attachmentsInfo .= "<p style='margin:4px 0; font-size:13px;'><strong>Lettre de motivation :</strong> {$_FILES['lettre']['name']} (" . round($_FILES['lettre']['size'] / 1024) . " Ko) ✓</p>";
} else {
    $attachmentsInfo .= "<p style='margin:4px 0; font-size:13px; color:#999;'><strong>Lettre de motivation :</strong> Non fournie</p>";
}

$htmlPR = "
<!DOCTYPE html>
<html lang='fr'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;'>
<table width='100%' cellpadding='0' cellspacing='0' style='background:#f5f5f7;padding:40px 0;'>
<tr><td align='center'>
<table width='600' cellpadding='0' cellspacing='0' style='background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);'>

  <tr><td style='background:#1b2a4a;padding:28px 36px;'>
    <h1 style='margin:0;color:#fff;font-size:18px;font-weight:700;'>📋 Nouvelle candidature — $posteLabel</h1>
    <p style='margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;'>Reçue le $date · Réf. $ref</p>
  </td></tr>

  <tr><td style='padding:32px 36px;'>

    " . section2('Candidat', row2('Prénom / Nom', $nomComplet) . row2('Email', $clientEmail) . row2('Téléphone', $tel) . row2('Poste visé', $posteLabel)) . "

    " . ($message ? section2('Message / Motivation', "<p style='margin:0; font-size:13px; line-height:1.6;'>$message</p>") : '') . "

    " . section2('Pièces jointes', $attachmentsInfo) . "

  </td></tr>

  <tr><td style='background:#f5f5f7;padding:16px 36px;border-top:1px solid #e8e8e8;'>
    <p style='margin:0;font-size:12px;color:#999;text-align:center;'>Email généré automatiquement · pr-logistics.fr</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>";

// ── Email de confirmation au candidat ─────────────────────────────
$htmlCandidat = "
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
      Bonjour <strong>$prenom</strong>, merci pour l'intérêt que vous portez à PR Logistics.<br>
      Nous avons bien reçu votre candidature pour le poste <strong>$posteLabel</strong> et nous vous en remercions.
      Notre équipe prendra le temps de l'étudier et vous contactera si votre profil correspond à nos besoins.
    </p>

    <div style='background:#f9f9f9; border-radius:8px; padding:20px 24px; margin-bottom:20px;'>
      <h3 style='margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#e30613;'>Récapitulatif</h3>
      " . row2('Référence', $ref) . "
      " . row2('Date', $date) . "
      " . row2('Poste visé', $posteLabel) . "
    </div>

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
</html>";

// ── Fonction envoi Brevo ──────────────────────────────────────────
function sendBrevoEmail2(
    string $apiKey,
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlContent,
    array  $attachments = []
): array {
    $payload = [
        'sender'      => ['email' => PR_EMAIL, 'name' => PR_NOM],
        'to'          => [['email' => $toEmail, 'name' => $toName]],
        'subject'     => $subject,
        'htmlContent' => $htmlContent,
    ];
    if (!empty($attachments)) {
        $payload['attachment'] = $attachments;
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
        CURLOPT_TIMEOUT => 20,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => $response, 'error' => $error];
}

// ── Pièces jointes pour l'email interne ──────────────────────────
$attachments = [['content' => $cvBase64, 'name' => $cvName]];
if ($lettreBase64 && $lettreName) {
    $attachments[] = ['content' => $lettreBase64, 'name' => $lettreName];
}

// ── Envoi ─────────────────────────────────────────────────────────
$typeForm = htmlspecialchars(trim($_POST['type_form'] ?? 'spontanee'));
$sujetInterne = ($typeForm === 'offre' && $poste)
    ? "Candidature — $poste — $nomComplet"
    : ($poste ? "Candidature spontanée — $nomComplet — $poste" : "Candidature spontanée — $nomComplet");

$r1 = sendBrevoEmail2(
    BREVO_API_KEY,
    PR_EMAIL,
    PR_NOM,
    $sujetInterne,
    $htmlPR,
    $attachments
);

$r2 = sendBrevoEmail2(
    BREVO_API_KEY,
    $clientEmail,
    $nomComplet,
    "Votre candidature chez PR Logistics ($ref)",
    $htmlCandidat
);

if ($r1['code'] === 201 && $r2['code'] === 201) {
    echo json_encode(['success' => true, 'ref' => $ref]);
} else {
    http_response_code(500);
    echo json_encode([
        'error'    => 'Erreur lors de l\'envoi',
        'details1' => $r1['body'],
        'details2' => $r2['body'],
    ]);
}
