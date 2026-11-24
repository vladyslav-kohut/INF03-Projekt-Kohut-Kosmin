<?php
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Uruchom ten plik z terminala XAMPP.');
}

require_once __DIR__ . '/../api/config/database.php';

$kontaTestowe = [
    [
        'Administrator testowy',
        'admin@eduresource.local',
        'admin123',
        'administrator'
    ],
    [
        'Użytkownik testowy',
        'uczen@eduresource.local',
        'uczen123',
        'uzytkownik'
    ]
];

$stmt = $polaczenie->prepare(
    'INSERT IGNORE INTO uzytkownicy (imie_i_nazwisko, email, haslo_hash, rola)
     VALUES (?, ?, ?, ?)'
);

foreach ($kontaTestowe as $konto) {
    $imieNazwisko = $konto[0];
    $email = $konto[1];
    $hasloHash = password_hash($konto[2], PASSWORD_DEFAULT);
    $rola = $konto[3];

    $stmt->bind_param('ssss', $imieNazwisko, $email, $hasloHash, $rola);
    $stmt->execute();
}

echo "Konta testowe są gotowe.\n";
echo "Administrator: admin@eduresource.local / admin123\n";
echo "Użytkownik: uczen@eduresource.local / uczen123\n";
