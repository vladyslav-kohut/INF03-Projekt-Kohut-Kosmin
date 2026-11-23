# EduResource Manager — technologia i organizacja

## Wariant

Aplikacja internetowa uruchamiana lokalnie w środowisku XAMPP. Projekt używa HTML5, CSS3 i czystego JavaScriptu po stronie przeglądarki oraz PHP i MySQL/MariaDB po stronie serwera. Nie używamy frameworków.

## Wybrany stos

| Część | Narzędzia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+ (bez frameworków) |
| Backend | PHP, sesje PHP |
| Baza danych | MySQL/MariaDB z XAMPP |
| Połączenie PHP z bazą | mysqli i przygotowane zapytania SQL |
| Serwer lokalny | Apache z XAMPP |
| Kontrola wersji | Git i GitHub |
| Zarządzanie zadaniami | Trello |
| Edytor | Visual Studio Code |
| Przeglądarka | dowolna aktualna przeglądarka |

## Jak będą współpracować części

JavaScript wyśle żądania HTTP do plików PHP w katalogu `api/`. PHP sprawdzi dane i uprawnienia użytkownika, wykona zapytanie do MySQL/MariaDB przez mysqli i zwróci wynik w JSON. Apache z XAMPP udostępni frontend i PHP pod adresem localhost.

## Zasoby i koszty

Wymagane zasoby: komputery zespołu, XAMPP, Git, konta GitHub, Trello, VS Code i przeglądarka. Wymagane narzędzia są bezpłatne; osobnej infrastruktury ani płatnych licencji projekt nie wymaga.

## Sprawdzenie środowiska

Zespół sprawdził, że XAMPP działa: Apache i MySQL uruchamiają się, PHP jest obsługiwane, baza danych jest dostępna, a aplikacja otwiera się w przeglądarce przez localhost. To potwierdzenie dotyczy środowiska, które sprawdził Programista A.

## Podział ról

- **Programista A — Vladyslav (backend):** PHP, mysqli, baza danych, logika aplikacji, autoryzacja i integracja API.
- **Programista B — Kosmin (frontend):** HTML, CSS, czysty JavaScript, widoki, walidacja formularzy i testy frontendowe.
- Obaj członkowie zespołu wykonują code review i testują zintegrowane funkcje.

## Kryterium ukończenia Fazy I

- [x] Wybrano aplikację internetową.
- [x] Ustalono XAMPP, PHP, MySQL/MariaDB, mysqli, HTML, CSS i czysty JavaScript.
- [x] Określono zasoby i koszty licencji.
- [x] Sprawdzono działanie lokalnego środowiska.
- [x] Przypisano role członkom zespołu.
- [ ] Na tablicy Trello są kolumny Backlog, To Do, In Progress, Code Review i Done.
- [ ] Utworzono kamienie milowe zgodne z pięcioma fazami projektu.
- [ ] Nauczyciel zaakceptował analizę ryzyka.

