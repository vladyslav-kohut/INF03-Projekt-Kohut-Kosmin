<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');
session_start();

if (!isset($_SESSION['uzytkownik'])) {
    http_response_code(401);
    echo json_encode(['blad' => 'Zaloguj się, aby kontynuować.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'dane' => $_SESSION['uzytkownik']
], JSON_UNESCAPED_UNICODE);
