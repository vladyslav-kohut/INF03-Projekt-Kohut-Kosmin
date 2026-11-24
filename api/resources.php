<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers.php';

$metoda = $_SERVER['REQUEST_METHOD'];

if ($metoda === 'GET') {
    wymagaj_zalogowania();

    $warunki = ['aktywny = 1'];
    $typy = '';
    $wartosci = [];

    foreach (['kategoria', 'lokalizacja', 'status', 'stan_techniczny'] as $pole) {
        if (isset($_GET[$pole]) && trim((string) $_GET[$pole]) !== '') {
            $warunki[] = $pole . ' = ?';
            $typy .= 's';
            $wartosci[] = trim((string) $_GET[$pole]);
        }
    }

    if (isset($_GET['szukaj']) && trim((string) $_GET['szukaj']) !== '') {
        $warunki[] = '(nazwa LIKE ? OR numer_katalogowy LIKE ?)';
        $typy .= 'ss';
        $szukaj = '%' . trim((string) $_GET['szukaj']) . '%';
        $wartosci[] = $szukaj;
        $wartosci[] = $szukaj;
    }

    $sql = 'SELECT id_zasobu, nazwa, numer_katalogowy, kategoria, stan_techniczny,
                   lokalizacja, status, data_utworzenia, data_aktualizacji
            FROM zasoby
            WHERE ' . implode(' AND ', $warunki) . '
            ORDER BY nazwa';

    $stmt = $polaczenie->prepare($sql);
    if ($typy !== '') {
        $parametry = [$typy];
        foreach ($wartosci as $indeks => $wartosc) {
            $parametry[] = &$wartosci[$indeks];
        }
        call_user_func_array([$stmt, 'bind_param'], $parametry);
    }

    $stmt->execute();
    $wynik = $stmt->get_result();
    odpowiedz_json(['dane' => $wynik->fetch_all(MYSQLI_ASSOC)]);
}

if ($metoda === 'POST') {
    wymagaj_administratora();
    $dane = odczytaj_json();

    $nazwa = tekst_z_danych($dane, 'nazwa', 150);
    $numer = isset($dane['numer_katalogowy']) && trim((string) $dane['numer_katalogowy']) !== ''
        ? tekst_z_danych($dane, 'numer_katalogowy', 100)
        : null;
    $kategoria = tekst_z_danych($dane, 'kategoria', 100);
    $lokalizacja = tekst_z_danych($dane, 'lokalizacja', 150);
    $stan = isset($dane['stan_techniczny']) ? $dane['stan_techniczny'] : 'sprawny';

    if ($nazwa === null || $kategoria === null || $lokalizacja === null
        || !in_array($stan, ['sprawny', 'uszkodzony', 'niesprawdzony'], true)) {
        odpowiedz_json(['blad' => 'Sprawdź wymagane dane zasobu.'], 422);
    }

    try {
        $stmt = $polaczenie->prepare(
            'INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->bind_param('sssss', $nazwa, $numer, $kategoria, $stan, $lokalizacja);
        $stmt->execute();
    } catch (mysqli_sql_exception $blad) {
        if ((int) $blad->getCode() === 1062) {
            odpowiedz_json(['blad' => 'Ten numer katalogowy jest już używany.'], 409);
        }
        throw $blad;
    }

    odpowiedz_json(['dane' => ['id_zasobu' => $polaczenie->insert_id]], 201);
}

if ($metoda === 'PATCH') {
    wymagaj_administratora();
    $id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : false;
    if (!$id || $id < 1) {
        odpowiedz_json(['blad' => 'Nieprawidłowy identyfikator zasobu.'], 400);
    }

    $dane = odczytaj_json();
    $nazwa = tekst_z_danych($dane, 'nazwa', 150);
    $numer = isset($dane['numer_katalogowy']) && trim((string) $dane['numer_katalogowy']) !== ''
        ? tekst_z_danych($dane, 'numer_katalogowy', 100)
        : null;
    $kategoria = tekst_z_danych($dane, 'kategoria', 100);
    $lokalizacja = tekst_z_danych($dane, 'lokalizacja', 150);
    $stan = isset($dane['stan_techniczny']) ? $dane['stan_techniczny'] : '';
    $status = isset($dane['status']) ? $dane['status'] : '';

    if ($nazwa === null || $kategoria === null || $lokalizacja === null
        || !in_array($stan, ['sprawny', 'uszkodzony', 'niesprawdzony'], true)
        || !in_array($status, ['dostepny', 'w_naprawie', 'zutylizowany'], true)) {
        odpowiedz_json(['blad' => 'Sprawdź wymagane dane zasobu.'], 422);
    }

    $stmt = $polaczenie->prepare('SELECT status FROM zasoby WHERE id_zasobu = ? AND aktywny = 1');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $istniejacy = $stmt->get_result()->fetch_assoc();
    if (!$istniejacy) {
        odpowiedz_json(['blad' => 'Nie znaleziono zasobu.'], 404);
    }
    if ($istniejacy['status'] === 'wypozyczony') {
        odpowiedz_json(['blad' => 'Nie można zmienić statusu wypożyczonego zasobu.'], 409);
    }

    try {
        $stmt = $polaczenie->prepare(
            'UPDATE zasoby
             SET nazwa = ?, numer_katalogowy = ?, kategoria = ?, stan_techniczny = ?,
                 lokalizacja = ?, status = ?
             WHERE id_zasobu = ? AND aktywny = 1'
        );
        $stmt->bind_param('ssssssi', $nazwa, $numer, $kategoria, $stan, $lokalizacja, $status, $id);
        $stmt->execute();
    } catch (mysqli_sql_exception $blad) {
        if ((int) $blad->getCode() === 1062) {
            odpowiedz_json(['blad' => 'Ten numer katalogowy jest już używany.'], 409);
        }
        throw $blad;
    }

    zapisz_historie_dzialan($polaczenie, (int) $_SESSION['uzytkownik']['id'], 'zmieniono_zasob', 'zasob', (int) $id, 'Zmieniono dane zasobu: ' . $nazwa);
    odpowiedz_json(['dane' => ['zaktualizowano' => true]]);
}

if ($metoda === 'DELETE') {
    wymagaj_administratora();
    $id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : false;
    if (!$id || $id < 1) {
        odpowiedz_json(['blad' => 'Nieprawidłowy identyfikator zasobu.'], 400);
    }

    $stmt = $polaczenie->prepare('SELECT status FROM zasoby WHERE id_zasobu = ? AND aktywny = 1');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $zasob = $stmt->get_result()->fetch_assoc();
    if (!$zasob) {
        odpowiedz_json(['blad' => 'Nie znaleziono zasobu.'], 404);
    }
    if ($zasob['status'] === 'wypozyczony') {
        odpowiedz_json(['blad' => 'Nie można archiwizować wypożyczonego zasobu.'], 409);
    }

    $stmt = $polaczenie->prepare('UPDATE zasoby SET aktywny = 0 WHERE id_zasobu = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();

    zapisz_historie_dzialan($polaczenie, (int) $_SESSION['uzytkownik']['id'], 'zarchiwizowano_zasob', 'zasob', (int) $id, 'Zarchiwizowano zasób.');
    odpowiedz_json(['dane' => ['zarchiwizowano' => true]]);
}

header('Allow: GET, POST, PATCH, DELETE');
odpowiedz_json(['blad' => 'Niedozwolona metoda żądania.'], 405);
