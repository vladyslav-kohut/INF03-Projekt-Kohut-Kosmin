<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers.php';

$metoda = $_SERVER['REQUEST_METHOD'];

if ($metoda === 'GET') {
    $uzytkownik = wymagaj_zalogowania();
    $czyAdministrator = $uzytkownik['rola'] === 'administrator';

    $warunekWnioskow = $czyAdministrator ? '' : ' WHERE w.id_wnioskujacego = ?';
    $stmt = $polaczenie->prepare(
        'SELECT w.id_wniosku, w.id_zasobu, w.id_wnioskujacego, w.planowany_termin_zwrotu,
                w.status, w.data_rozpatrzenia, w.komentarz_administratora, w.data_zlozenia,
                z.nazwa AS nazwa_zasobu, z.numer_katalogowy,
                u.imie_i_nazwisko AS wnioskujacy,
                r.imie_i_nazwisko AS rozpatrujacy
         FROM wnioski_wypozyczenia w
         INNER JOIN zasoby z ON z.id_zasobu = w.id_zasobu
         INNER JOIN uzytkownicy u ON u.id_uzytkownika = w.id_wnioskujacego
         LEFT JOIN uzytkownicy r ON r.id_uzytkownika = w.id_rozpatrujacego' . $warunekWnioskow . '
         ORDER BY w.data_zlozenia DESC'
    );
    if (!$czyAdministrator) {
        $idUzytkownika = (int) $uzytkownik['id'];
        $stmt->bind_param('i', $idUzytkownika);
    }
    $stmt->execute();
    $wnioski = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $warunekWypozyczen = $czyAdministrator ? '' : ' WHERE w.id_wypozyczajacego = ?';
    $stmt = $polaczenie->prepare(
        'SELECT w.id_wypozyczenia, w.id_wniosku, w.id_zasobu, w.id_wypozyczajacego,
                w.data_wydania, w.termin_zwrotu, w.data_zwrotu,
                z.nazwa AS nazwa_zasobu, z.numer_katalogowy, z.lokalizacja,
                u.imie_i_nazwisko AS wypozyczajacy,
                a.imie_i_nazwisko AS wydajacy
         FROM wypozyczenia w
         INNER JOIN zasoby z ON z.id_zasobu = w.id_zasobu
         INNER JOIN uzytkownicy u ON u.id_uzytkownika = w.id_wypozyczajacego
         INNER JOIN uzytkownicy a ON a.id_uzytkownika = w.id_wydajacego' . $warunekWypozyczen . '
         ORDER BY w.data_wydania DESC'
    );
    if (!$czyAdministrator) {
        $idUzytkownika = (int) $uzytkownik['id'];
        $stmt->bind_param('i', $idUzytkownika);
    }
    $stmt->execute();
    $wypozyczenia = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    odpowiedz_json([
        'wnioski' => $wnioski,
        'wypozyczenia' => $wypozyczenia
    ]);
}

$uzytkownik = wymagaj_zalogowania();

if ($metoda === 'POST') {
    $dane = odczytaj_json();
    $idZasobu = isset($dane['id_zasobu']) ? filter_var($dane['id_zasobu'], FILTER_VALIDATE_INT) : false;
    $termin = isset($dane['planowany_termin_zwrotu']) && is_string($dane['planowany_termin_zwrotu'])
        ? $dane['planowany_termin_zwrotu']
        : '';

    $data = DateTime::createFromFormat('Y-m-d', $termin);
    if (!$idZasobu || $idZasobu < 1 || !$data || $data->format('Y-m-d') !== $termin) {
        odpowiedz_json(['blad' => 'Podaj zasób i poprawny termin zwrotu.'], 422);
    }
    if ($termin < date('Y-m-d')) {
        odpowiedz_json(['blad' => 'Termin zwrotu nie może być z przeszłości.'], 422);
    }

    $stmt = $polaczenie->prepare(
        "SELECT status, stan_techniczny FROM zasoby
         WHERE id_zasobu = ? AND aktywny = 1"
    );
    $stmt->bind_param('i', $idZasobu);
    $stmt->execute();
    $zasob = $stmt->get_result()->fetch_assoc();
    if (!$zasob) {
        odpowiedz_json(['blad' => 'Nie znaleziono zasobu.'], 404);
    }
    if ($zasob['status'] !== 'dostepny' || $zasob['stan_techniczny'] === 'uszkodzony') {
        odpowiedz_json(['blad' => 'Ten zasób nie jest dostępny do wypożyczenia.'], 409);
    }

    $idUzytkownika = (int) $uzytkownik['id'];
    $stmt = $polaczenie->prepare(
        "SELECT id_wniosku FROM wnioski_wypozyczenia
         WHERE id_zasobu = ? AND id_wnioskujacego = ? AND status = 'oczekujacy'
         LIMIT 1"
    );
    $stmt->bind_param('ii', $idZasobu, $idUzytkownika);
    $stmt->execute();
    if ($stmt->get_result()->fetch_assoc()) {
        odpowiedz_json(['blad' => 'Masz już oczekujący wniosek o ten zasób.'], 409);
    }

    $stmt = $polaczenie->prepare(
        'INSERT INTO wnioski_wypozyczenia (id_zasobu, id_wnioskujacego, planowany_termin_zwrotu)
         VALUES (?, ?, ?)'
    );
    $stmt->bind_param('iis', $idZasobu, $idUzytkownika, $termin);
    $stmt->execute();
    $idWniosku = (int) $polaczenie->insert_id;
    zapisz_historie_dzialan($polaczenie, $idUzytkownika, 'zlozono_wniosek', 'wniosek', $idWniosku, 'Złożono prośbę o wypożyczenie zasobu.');

    odpowiedz_json(['dane' => ['id_wniosku' => $idWniosku, 'status' => 'oczekujacy']], 201);
}

if ($metoda === 'PATCH' && isset($_GET['wniosek'])) {
    $administrator = wymagaj_administratora();
    $idWniosku = filter_var($_GET['wniosek'], FILTER_VALIDATE_INT);
    if (!$idWniosku || $idWniosku < 1) {
        odpowiedz_json(['blad' => 'Nieprawidłowy identyfikator wniosku.'], 400);
    }

    $dane = odczytaj_json();
    $decyzja = isset($dane['decyzja']) ? $dane['decyzja'] : '';
    $komentarz = isset($dane['komentarz']) && is_string($dane['komentarz'])
        ? trim($dane['komentarz'])
        : null;
    if (!in_array($decyzja, ['zaakceptowany', 'odrzucony'], true)) {
        odpowiedz_json(['blad' => 'Wybierz akceptację albo odrzucenie wniosku.'], 422);
    }
    if ($komentarz !== null && mb_strlen($komentarz, 'UTF-8') > 500) {
        odpowiedz_json(['blad' => 'Komentarz jest za długi.'], 422);
    }

    try {
        $polaczenie->begin_transaction();

        $stmt = $polaczenie->prepare(
            'SELECT id_zasobu, id_wnioskujacego, planowany_termin_zwrotu, status
             FROM wnioski_wypozyczenia WHERE id_wniosku = ? FOR UPDATE'
        );
        $stmt->bind_param('i', $idWniosku);
        $stmt->execute();
        $wniosek = $stmt->get_result()->fetch_assoc();
        if (!$wniosek) {
            $polaczenie->rollback();
            odpowiedz_json(['blad' => 'Nie znaleziono wniosku.'], 404);
        }
        if ($wniosek['status'] !== 'oczekujacy') {
            $polaczenie->rollback();
            odpowiedz_json(['blad' => 'Ten wniosek został już rozpatrzony.'], 409);
        }

        if ($decyzja === 'zaakceptowany') {
            $stmt = $polaczenie->prepare(
                'SELECT status, stan_techniczny FROM zasoby
                 WHERE id_zasobu = ? AND aktywny = 1 FOR UPDATE'
            );
            $stmt->bind_param('i', $wniosek['id_zasobu']);
            $stmt->execute();
            $zasob = $stmt->get_result()->fetch_assoc();
            if (!$zasob || $zasob['status'] !== 'dostepny' || $zasob['stan_techniczny'] === 'uszkodzony') {
                $polaczenie->rollback();
                odpowiedz_json(['blad' => 'Zasób nie jest już dostępny.'], 409);
            }

            $idAdministratora = (int) $administrator['id'];
            $idWnioskujacego = (int) $wniosek['id_wnioskujacego'];
            $idZasobu = (int) $wniosek['id_zasobu'];
            $terminZwrotu = $wniosek['planowany_termin_zwrotu'];

            $stmt = $polaczenie->prepare(
                'INSERT INTO wypozyczenia
                 (id_wniosku, id_zasobu, id_wypozyczajacego, id_wydajacego, termin_zwrotu)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->bind_param('iiiis', $idWniosku, $idZasobu, $idWnioskujacego, $idAdministratora, $terminZwrotu);
            $stmt->execute();

            $stmt = $polaczenie->prepare("UPDATE zasoby SET status = 'wypozyczony' WHERE id_zasobu = ?");
            $stmt->bind_param('i', $idZasobu);
            $stmt->execute();
        }

        $idAdministratora = (int) $administrator['id'];
        $stmt = $polaczenie->prepare(
            'UPDATE wnioski_wypozyczenia
             SET status = ?, id_rozpatrujacego = ?, data_rozpatrzenia = NOW(), komentarz_administratora = ?
             WHERE id_wniosku = ?'
        );
        $stmt->bind_param('sisi', $decyzja, $idAdministratora, $komentarz, $idWniosku);
        $stmt->execute();

        zapisz_historie_dzialan(
            $polaczenie,
            $idAdministratora,
            $decyzja === 'zaakceptowany' ? 'zaakceptowano_wniosek' : 'odrzucono_wniosek',
            'wniosek',
            (int) $idWniosku,
            $decyzja === 'zaakceptowany' ? 'Zaakceptowano wniosek o wypożyczenie.' : 'Odrzucono wniosek o wypożyczenie.'
        );

        $polaczenie->commit();
        odpowiedz_json(['dane' => ['status' => $decyzja]]);
    } catch (Throwable $blad) {
        if ($polaczenie->errno || $polaczenie->thread_id) {
            try {
                $polaczenie->rollback();
            } catch (Throwable $pomin) {
            }
        }
        odpowiedz_json(['blad' => 'Nie udało się rozpatrzyć wniosku.'], 500);
    }
}

if ($metoda === 'PATCH' && isset($_GET['wypozyczenie'])) {
    $idWypozyczenia = filter_var($_GET['wypozyczenie'], FILTER_VALIDATE_INT);
    if (!$idWypozyczenia || $idWypozyczenia < 1) {
        odpowiedz_json(['blad' => 'Nieprawidłowy identyfikator wypożyczenia.'], 400);
    }

    $dane = odczytaj_json();
    if (!isset($dane['akcja']) || $dane['akcja'] !== 'zwrot') {
        odpowiedz_json(['blad' => 'Nieznana czynność.'], 422);
    }

    $stan = isset($dane['stan_techniczny']) ? $dane['stan_techniczny'] : null;
    if ($stan !== null && !in_array($stan, ['sprawny', 'uszkodzony', 'niesprawdzony'], true)) {
        odpowiedz_json(['blad' => 'Nieprawidłowy stan techniczny.'], 422);
    }

    try {
        $polaczenie->begin_transaction();
        $stmt = $polaczenie->prepare(
            'SELECT id_zasobu, id_wypozyczajacego, data_zwrotu
             FROM wypozyczenia WHERE id_wypozyczenia = ? FOR UPDATE'
        );
        $stmt->bind_param('i', $idWypozyczenia);
        $stmt->execute();
        $wypozyczenie = $stmt->get_result()->fetch_assoc();
        if (!$wypozyczenie) {
            $polaczenie->rollback();
            odpowiedz_json(['blad' => 'Nie znaleziono wypożyczenia.'], 404);
        }
        if ($uzytkownik['rola'] !== 'administrator'
            && (int) $wypozyczenie['id_wypozyczajacego'] !== (int) $uzytkownik['id']) {
            $polaczenie->rollback();
            odpowiedz_json(['blad' => 'Możesz zwrócić tylko swój zasób.'], 403);
        }
        if ($wypozyczenie['data_zwrotu'] !== null) {
            $polaczenie->rollback();
            odpowiedz_json(['blad' => 'Ten zasób został już zwrócony.'], 409);
        }

        $stmt = $polaczenie->prepare('SELECT stan_techniczny FROM zasoby WHERE id_zasobu = ? FOR UPDATE');
        $stmt->bind_param('i', $wypozyczenie['id_zasobu']);
        $stmt->execute();
        $zasob = $stmt->get_result()->fetch_assoc();
        $stanZasobu = $zasob ? $zasob['stan_techniczny'] : 'sprawny';
        if ($stan !== null) {
            $stanZasobu = $stan;
            $stmt = $polaczenie->prepare('UPDATE zasoby SET stan_techniczny = ? WHERE id_zasobu = ?');
            $stmt->bind_param('si', $stan, $wypozyczenie['id_zasobu']);
            $stmt->execute();
        }
        $nowyStatus = $stanZasobu === 'uszkodzony' ? 'w_naprawie' : 'dostepny';

        $stmt = $polaczenie->prepare('UPDATE wypozyczenia SET data_zwrotu = NOW() WHERE id_wypozyczenia = ?');
        $stmt->bind_param('i', $idWypozyczenia);
        $stmt->execute();

        $stmt = $polaczenie->prepare('UPDATE zasoby SET status = ? WHERE id_zasobu = ?');
        $stmt->bind_param('si', $nowyStatus, $wypozyczenie['id_zasobu']);
        $stmt->execute();

        zapisz_historie_dzialan(
            $polaczenie,
            (int) $uzytkownik['id'],
            'zarejestrowano_zwrot',
            'wypozyczenie',
            (int) $idWypozyczenia,
            'Zarejestrowano zwrot zasobu.'
        );

        $polaczenie->commit();
        odpowiedz_json(['dane' => ['zwrocono' => true]]);
    } catch (Throwable $blad) {
        try {
            $polaczenie->rollback();
        } catch (Throwable $pomin) {
        }
        odpowiedz_json(['blad' => 'Nie udało się zarejestrować zwrotu.'], 500);
    }
}

header('Allow: GET, POST, PATCH');
odpowiedz_json(['blad' => 'Niedozwolona metoda lub brak właściwego identyfikatora.'], 405);
