<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers.php';

wymagaj_metody('GET');
wymagaj_administratora();

$typ = isset($_GET['typ']) ? $_GET['typ'] : 'uszkodzone';

if ($typ === 'uszkodzone') {
    $stmt = $polaczenie->query(
        "SELECT id_zasobu, nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status
         FROM zasoby
         WHERE aktywny = 1 AND stan_techniczny = 'uszkodzony'
         ORDER BY lokalizacja, nazwa"
    );
    odpowiedz_json(['typ' => $typ, 'dane' => $stmt->fetch_all(MYSQLI_ASSOC)]);
}

if ($typ === 'niesprawdzone') {
    $stmt = $polaczenie->query(
        "SELECT id_zasobu, nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status
         FROM zasoby
         WHERE aktywny = 1 AND stan_techniczny = 'niesprawdzony'
         ORDER BY lokalizacja, nazwa"
    );
    odpowiedz_json(['typ' => $typ, 'dane' => $stmt->fetch_all(MYSQLI_ASSOC)]);
}

if ($typ === 'przeterminowane') {
    $stmt = $polaczenie->query(
        "SELECT w.id_wypozyczenia, w.termin_zwrotu, z.id_zasobu, z.nazwa AS nazwa_zasobu,
                u.id_uzytkownika, u.imie_i_nazwisko, u.email
         FROM wypozyczenia w
         INNER JOIN zasoby z ON z.id_zasobu = w.id_zasobu
         INNER JOIN uzytkownicy u ON u.id_uzytkownika = w.id_wypozyczajacego
         WHERE w.data_zwrotu IS NULL AND w.termin_zwrotu < CURRENT_DATE()
         ORDER BY w.termin_zwrotu, z.nazwa"
    );
    odpowiedz_json(['typ' => $typ, 'dane' => $stmt->fetch_all(MYSQLI_ASSOC)]);
}

if ($typ === 'historia') {
    $stmt = $polaczenie->query(
        'SELECT h.id_zdarzenia, h.typ_zdarzenia, h.typ_obiektu, h.id_obiektu,
                h.opis, h.data_zdarzenia, u.id_uzytkownika, u.imie_i_nazwisko, u.rola
         FROM historia_dzialan h
         INNER JOIN uzytkownicy u ON u.id_uzytkownika = h.id_wykonujacego
         ORDER BY h.data_zdarzenia DESC
         LIMIT 200'
    );
    odpowiedz_json(['typ' => $typ, 'dane' => $stmt->fetch_all(MYSQLI_ASSOC)]);
}

odpowiedz_json(['blad' => 'Nieznany typ raportu.'], 400);
