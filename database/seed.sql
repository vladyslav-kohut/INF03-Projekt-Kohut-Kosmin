USE eduresource_manager;

-- Rozbudowany zestaw danych demonstracyjnych.
-- Skrypt jest idempotentny: ponowne uruchomienie nie tworzy duplikatów,
-- ponieważ każdy rekord jest wstawiany tylko wtedy, gdy nie istnieje.
-- Uruchomienie opcjonalne — po database/schema.sql i database/dane_przykladowe.sql.

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Komputer stacjonowy HP', 'DEMO-006', 'Sprzet komputerowy', 'sprawny', 'Pracownia komputerowa 1', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-006');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Monitor Dell 24', 'DEMO-007', 'Sprzet komputerowy', 'sprawny', 'Pracownia komputerowa 1', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-007');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Tablica interaktywna', 'DEMO-008', 'Sprzet audiowizualny', 'sprawny', 'Sala 12', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-008');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Rzutnik multimedialny', 'DEMO-009', 'Sprzet audiowizualny', 'niesprawdzony', 'Sala 5', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-009');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Laptop Dell', 'DEMO-010', 'Sprzet komputerowy', 'uszkodzony', 'Magazyn szkolny', 'w_naprawie'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-010');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Zestaw mikroskopow', 'DEMO-011', 'Pomoce naukowe', 'sprawny', 'Pracownia biologiczna', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-011');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Model szkieletu czlowieka', 'DEMO-012', 'Pomoce naukowe', 'niesprawdzony', 'Pracownia biologiczna', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-012');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Pilka do siatkowki', 'DEMO-013', 'Sprzet sportowy', 'sprawny', 'Sala gimnastyczna', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-013');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Skrzynia przyborow sportowych', 'DEMO-014', 'Sprzet sportowy', 'sprawny', 'Sala gimnastyczna', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-014');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Slownik jezyka polskiego', 'DEMO-015', 'Ksiegarnia', 'sprawny', 'Biblioteka', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-015');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Podrecznik do matematyki', 'DEMO-016', 'Ksiegarnia', 'uszkodzony', 'Biblioteka', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-016');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Drukarka laserowa', 'DEMO-017', 'Sprzet komputerowy', 'niesprawdzony', 'Kancelaria', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-017');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Wzmacniacz glosnikowy', 'DEMO-018', 'Sprzet audiowizualny', 'uszkodzony', 'Magazyn szkolny', 'zutylizowany'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-018');

-- Przykładowy oczekujący wniosek użytkownika o projektor (DEMO-001).
INSERT INTO wnioski_wypozyczenia (id_zasobu, id_wnioskujacego, planowany_termin_zwrotu)
SELECT z.id_zasobu, u.id_uzytkownika, DATE_ADD(CURDATE(), INTERVAL 5 DAY)
FROM zasoby z
INNER JOIN uzytkownicy u ON u.email = 'uczen@eduresource.local'
WHERE z.numer_katalogowy = 'DEMO-001'
  AND NOT EXISTS (
      SELECT 1 FROM wnioski_wypozyczenia w
      WHERE w.id_zasobu = z.id_zasobu
        AND w.id_wnioskujacego = u.id_uzytkownika
        AND w.status = 'oczekujacy'
  );

-- Przykładowe rozpatrzone wypożyczenie: laptop Lenovo (DEMO-002) wydany do zwrotu za 7 dni.
INSERT INTO wnioski_wypozyczenia
    (id_zasobu, id_wnioskujacego, planowany_termin_zwrotu, status, id_rozpatrujacego, data_rozpatrzenia)
SELECT z.id_zasobu, u.id_uzytkownika, DATE_ADD(CURDATE(), INTERVAL 7 DAY),
       'zaakceptowany', a.id_uzytkownika, NOW()
FROM zasoby z
INNER JOIN uzytkownicy u ON u.email = 'uczen@eduresource.local'
INNER JOIN uzytkownicy a ON a.email = 'admin@eduresource.local'
WHERE z.numer_katalogowy = 'DEMO-002'
  AND NOT EXISTS (
      SELECT 1 FROM wypozyczenia x
      INNER JOIN zasoby zz ON zz.id_zasobu = x.id_zasobu
      WHERE zz.numer_katalogowy = 'DEMO-002' AND x.data_zwrotu IS NULL
  );

INSERT INTO wypozyczenia (id_wniosku, id_zasobu, id_wypozyczajacego, id_wydajacego, termin_zwrotu)
SELECT w.id_wniosku, w.id_zasobu, w.id_wnioskujacego, w.id_rozpatrujacego,
       DATE_ADD(CURDATE(), INTERVAL 7 DAY)
FROM wnioski_wypozyczenia w
INNER JOIN zasoby z ON z.id_zasobu = w.id_zasobu
WHERE z.numer_katalogowy = 'DEMO-002'
  AND w.status = 'zaakceptowany'
  AND NOT EXISTS (SELECT 1 FROM wypozyczenia x WHERE x.id_wniosku = w.id_wniosku);

UPDATE zasoby SET status = 'wypozyczony'
WHERE numer_katalogowy = 'DEMO-002'
  AND aktywny = 1
  AND status = 'dostepny'
  AND EXISTS (SELECT 1 FROM wypozyczenia x WHERE x.id_zasobu = zasoby.id_zasobu AND x.data_zwrotu IS NULL);
