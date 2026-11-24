USE eduresource_manager;

-- Przykładowe rekordy do prezentacji listy zasobów w aplikacji.
-- Ponowne uruchomienie nie doda duplikatów, bo numery katalogowe są unikalne.
INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Projektor Epson', 'DEMO-001', 'Sprzet audiowizualny', 'sprawny', 'Sala 12', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-001');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Laptop Lenovo', 'DEMO-002', 'Sprzet komputerowy', 'sprawny', 'Pracownia komputerowa 1', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-002');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Mikroskop szkolny', 'DEMO-003', 'Pomoce naukowe', 'sprawny', 'Pracownia biologiczna', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-003');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Glosnik przenosny', 'DEMO-004', 'Sprzet audiowizualny', 'uszkodzony', 'Magazyn szkolny', 'w_naprawie'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-004');

INSERT INTO zasoby (nazwa, numer_katalogowy, kategoria, stan_techniczny, lokalizacja, status)
SELECT 'Kamera cyfrowa', 'DEMO-005', 'Sprzet audiowizualny', 'niesprawdzony', 'Biblioteka', 'dostepny'
WHERE NOT EXISTS (SELECT 1 FROM zasoby WHERE numer_katalogowy = 'DEMO-005');
