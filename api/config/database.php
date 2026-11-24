<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $polaczenie = new mysqli(
        'localhost',
        'root',
        '',
        'eduresource_manager'
    );
    $polaczenie->set_charset('utf8mb4');
} catch (mysqli_sql_exception $blad) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['blad' => 'Nie można połączyć się z bazą danych.']);
    exit;
}
