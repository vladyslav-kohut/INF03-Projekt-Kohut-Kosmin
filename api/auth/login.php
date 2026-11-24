<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo json_encode(['blad' => 'Dozwolona metoda: POST.']);
    exit;
}

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');
session_start();

$dane = json_decode(file_get_contents('php://input'), true);
if (!is_array($dane)) {
    http_response_code(400);
    echo json_encode(['blad' => 'Nieprawidlowe dane logowania.']);
    exit;
}

$email = isset($dane['email']) ? strtolower(trim($dane['email'])) : '';
$haslo = isset($dane['haslo']) ? $dane['haslo'] : '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($haslo) || $haslo === '') {
    http_response_code(400);
    echo json_encode(['blad' => 'Podaj poprawny e-mail i haslo.']);
    exit;
}

$stmt = $polaczenie->prepare(
    'SELECT id_uzytkownika, imie_i_nazwisko, email, haslo_hash, rola
     FROM uzytkownicy
     WHERE email = ? AND aktywny = 1
     LIMIT 1'
);
$stmt->bind_param('s', $email);
$stmt->execute();
$wynik = $stmt->get_result();
$uzytkownik = $wynik->fetch_assoc();
$stmt->close();

if (!$uzytkownik || !password_verify($haslo, $uzytkownik['haslo_hash'])) {
    http_response_code(401);
    echo json_encode(['blad' => 'Nieprawidlowy e-mail lub haslo.']);
    exit;
}

session_regenerate_id(true);
$_SESSION['uzytkownik'] = [
    'id' => (int) $uzytkownik['id_uzytkownika'],
    'imie_i_nazwisko' => $uzytkownik['imie_i_nazwisko'],
    'email' => $uzytkownik['email'],
    'rola' => $uzytkownik['rola'],
];

echo json_encode([
    'dane' => $_SESSION['uzytkownik']
], JSON_UNESCAPED_UNICODE);
