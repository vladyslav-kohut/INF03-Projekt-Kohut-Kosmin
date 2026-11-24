<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function odpowiedz_json($dane, $kod = 200)
{
    http_response_code($kod);
    echo json_encode($dane, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function wymagaj_metody($dozwolona)
{
    if ($_SERVER['REQUEST_METHOD'] !== $dozwolona) {
        header('Allow: ' . $dozwolona);
        odpowiedz_json(['blad' => 'Niedozwolona metoda żądania.'], 405);
    }
}

function odczytaj_json()
{
    $dane = json_decode(file_get_contents('php://input'), true);
    if (!is_array($dane)) {
        odpowiedz_json(['blad' => 'Nieprawidłowe dane JSON.'], 400);
    }

    return $dane;
}

function wymagaj_zalogowania()
{
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.use_strict_mode', '1');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_samesite', 'Lax');
        session_start();
    }

    if (!isset($_SESSION['uzytkownik'])) {
        odpowiedz_json(['blad' => 'Zaloguj się, aby kontynuować.'], 401);
    }

    return $_SESSION['uzytkownik'];
}

function wymagaj_administratora()
{
    $uzytkownik = wymagaj_zalogowania();
    if ($uzytkownik['rola'] !== 'administrator') {
        odpowiedz_json(['blad' => 'Ta czynność wymaga roli administratora.'], 403);
    }

    return $uzytkownik;
}

function tekst_z_danych($dane, $pole, $limit)
{
    if (!isset($dane[$pole]) || !is_string($dane[$pole])) {
        return null;
    }

    $wartosc = trim($dane[$pole]);
    if ($wartosc === '' || mb_strlen($wartosc, 'UTF-8') > $limit) {
        return null;
    }

    return $wartosc;
}

function zapisz_historie_dzialan($polaczenie, $idWykonujacego, $typZdarzenia, $typObiektu, $idObiektu, $opis)
{
    $stmt = $polaczenie->prepare(
        'INSERT INTO historia_dzialan
         (id_wykonujacego, typ_zdarzenia, typ_obiektu, id_obiektu, opis)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->bind_param('issis', $idWykonujacego, $typZdarzenia, $typObiektu, $idObiektu, $opis);
    $stmt->execute();
}
