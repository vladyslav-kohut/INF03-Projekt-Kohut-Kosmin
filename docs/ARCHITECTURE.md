EduResource Manager — architektura i środowisko projektu
1. Cel dokumentu
Dokument opisuje wybór technologii, środowiska pracy oraz podstawową architekturę aplikacji EduResource Manager realizowanej w ramach projektu zespołowego na kierunku Technik programista.
Dokument realizuje zadanie z Fazy I — Planowanie przedsięwzięcia: „Wybór technologii i środowiska pracy”.
2. Wybrany wariant aplikacji
Wybrano wariant:
Aplikacja internetowa (Web App)

Aplikacja będzie uruchamiana w przeglądarce internetowej i będzie komunikować się z backendem napisanym w PHP oraz bazą danych MySQL.
Uzasadnienie wyboru
- aplikacja ma naturalny podział na frontend i backend,
- może być uruchamiana na komputerach w pracowni bez instalowania osobnego klienta,
- wybrany stos technologiczny jest zgodny z wymaganiami projektu,
- umożliwia równoległą pracę dwóch członków zespołu,
- pozwala wykorzystać HTML, CSS, JavaScript, PHP i SQL w jednym projekcie.
3. Stos technologiczny
Frontend
Technologia	Zastosowanie
HTML5	Struktura stron i elementów interfejsu
CSS3	Wygląd aplikacji, układ, responsywność
JavaScript ES6+ (Vanilla JS)	Logika interfejsu, walidacja formularzy, komunikacja z backendem


Frontend będzie realizowany bez frameworków JavaScript.
Do komunikacji z backendem zostanie wykorzystane Fetch API.
Backend
Technologia	Zastosowanie
PHP	Logika biznesowa, autoryzacja, CRUD, obsługa zapytań
PHP Sessions	Obsługa zalogowanego użytkownika i ról
PDO	Bezpieczna komunikacja PHP z bazą danych


Baza danych
Technologia	Zastosowanie
MySQL	Przechowywanie użytkowników, zasobów i wypożyczeń


Podstawowe encje:
- users — użytkownicy systemu,
- resources — zasoby szkolne,
- loans — wypożyczenia zasobów.
Szczegółowy model danych zostanie przygotowany w Fazie II w postaci diagramu ERD.
4. Podstawowa architektura aplikacji
Aplikacja będzie podzielona na trzy główne warstwy:
┌──────────────────────────────────────┐
│              FRONTEND                │
│     HTML5 + CSS3 + JavaScript        │
│                                      │
│  Interfejs / formularze / widoki     │
└──────────────────┬───────────────────┘
                   │
                   │ HTTP + JSON
                   │ Fetch API
                   ▼
┌──────────────────────────────────────┐
│               BACKEND                │
│                 PHP                  │
│                                      │
│ Autoryzacja / CRUD / logika biznesowa│
└──────────────────┬───────────────────┘
                   │
                   │ PDO / SQL
                   ▼
┌──────────────────────────────────────┐
│            BAZA DANYCH               │
│                MySQL                 │
│                                      │
│ users / resources / loans            │
└──────────────────────────────────────┘
Sposób komunikacji
1. Użytkownik wykonuje akcję w interfejsie.
2. JavaScript wysyła żądanie HTTP do backendu PHP.
3. PHP waliduje dane i wykonuje odpowiednią logikę.
4. Backend komunikuje się z bazą MySQL przez PDO.
5. PHP zwraca odpowiedź w formacie JSON.
6. JavaScript aktualizuje interfejs na podstawie odpowiedzi.
Przykładowy przepływ:
Kliknięcie „Dodaj zasób”
        ↓
Walidacja formularza w JavaScript
        ↓
POST /api/resources.php
        ↓
Walidacja danych w PHP
        ↓
INSERT do MySQL
        ↓
Odpowiedź JSON
        ↓
Aktualizacja listy zasobów
5. Środowisko programistyczne
Edytor kodu
Wybrano:
Visual Studio Code

VS Code będzie wykorzystywany do pracy z:
- HTML,
- CSS,
- JavaScript,
- PHP,
- SQL,
- plikami Markdown,
- Git.
Zalecane rozszerzenia VS Code
Rozszerzenia nie są obowiązkowe, ale mogą ułatwić pracę:
- PHP Intelephense,
- Prettier,
- GitHub Pull Requests and Issues,
- EditorConfig,
- Live Server — wyłącznie do prostych testów statycznego frontendu.
Docelowa aplikacja powinna być uruchamiana przez serwer Apache, ponieważ backend wykorzystuje PHP.
6. Wymagane oprogramowanie
Na komputerze używanym do realizacji projektu powinny być dostępne:
Narzędzie	Wymagane	Zastosowanie
Visual Studio Code	Tak	Edycja kodu
Git	Tak	Kontrola wersji
GitHub / GitLab	Tak	Repozytorium i Pull Requesty
Apache	Tak	Serwer HTTP
PHP	Tak	Backend
MySQL	Tak	Baza danych
phpMyAdmin	Opcjonalnie	Zarządzanie bazą danych
Przeglądarka internetowa	Tak	Testowanie aplikacji
Trello / GitHub Projects	Tak	Zarządzanie zadaniami
diagrams.net / Draw.io	Tak	Diagram ERD i architektura
Figma / diagrams.net	Opcjonalnie	Wireframes interfejsu
Postman	Opcjonalnie	Testowanie endpointów API


7. Wymagane zasoby techniczne
Do realizacji projektu wymagane są:
- komputer z dostępem do pracowni szkolnej lub środowiska lokalnego,
- dostęp do internetu dla GitHub/GitLab i Trello,
- lokalny serwer Apache,
- interpreter PHP,
- serwer MySQL,
- współczesna przeglądarka internetowa,
- konto GitHub/GitLab dla obu członków zespołu,
- wspólne repozytorium projektu.
Nie są wymagane płatne usługi ani komercyjne licencje.
8. Weryfikacja środowiska w pracowni
Przed rozpoczęciem implementacji należy sprawdzić dostępność i działanie środowiska.
Checklista
- [ ] Visual Studio Code uruchamia się poprawnie.
- [ ] Git jest dostępny w terminalu.
- [ ] Apache uruchamia się poprawnie.
- [ ] PHP działa poprawnie.
- [ ] MySQL uruchamia się poprawnie.
- [ ] PHP może połączyć się z MySQL.
- [ ] Projekt PHP można otworzyć przez localhost.
- [ ] Przeglądarka poprawnie wyświetla aplikację.
- [ ] Dostęp do repozytorium Git działa dla obu członków zespołu.
Polecenia kontrolne
Sprawdzenie Git:
git --version
Sprawdzenie PHP:
php --version
Sprawdzenie MySQL:
mysql --version
Prosty test PHP:
<?php
echo "PHP działa poprawnie";
?>
Po zapisaniu pliku na serwerze należy otworzyć go przez localhost i sprawdzić, czy komunikat zostaje wyświetlony.
Wynik weryfikacji
Element	Status / wersja
Visual Studio Code	Do uzupełnienia po sprawdzeniu
Git	Do uzupełnienia po sprawdzeniu
Apache	Do uzupełnienia po sprawdzeniu
PHP	Do uzupełnienia po sprawdzeniu
MySQL	Do uzupełnienia po sprawdzeniu
Połączenie PHP → MySQL	Do uzupełnienia po sprawdzeniu


9. Proponowana struktura projektu
EduResource-Manager/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── loans.html
│   ├── reports.html
│   │
│   ├── css/
│   │   ├── variables.css
│   │   ├── style.css
│   │   └── components.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── resources.js
│   │   ├── loans.js
│   │   ├── reports.js
│   │   └── ui.js
│   │
│   └── assets/
│
├── api/
│   ├── config/
│   │   └── database.php
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── me.php
│   ├── resources.php
│   ├── loans.php
│   └── reports.php
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── ARCHITEKTURA.md
│   └── GIT_RULES.md
│
└── README.md
Struktura może zostać zmodyfikowana podczas projektowania szczegółowej architektury w Fazie II.
10. Podział odpowiedzialności technologicznej
Programista A — Project Lead / Backend Lead
Główne obowiązki:
- PHP,
- MySQL,
- połączenie z bazą danych,
- logika biznesowa,
- autoryzacja,
- operacje CRUD,
- obsługa wypożyczeń,
- endpointy backendowe.
Programista B — Quality & Frontend Lead
Główne obowiązki:
- HTML5,
- CSS3,
- JavaScript ES6+,
- projekt interfejsu,
- walidacja po stronie klienta,
- komunikacja z API,
- widoki zasobów, wypożyczeń i raportów,
- testowanie i integracja widoków.
Obaj programiści uczestniczą w kodowaniu, Code Review i integracji projektu.
11. Decyzje technologiczne
Obszar	Decyzja
Typ aplikacji	Web App
Frontend	HTML5 + CSS3 + Vanilla JavaScript ES6+
Framework frontendowy	Brak
Backend	PHP
Baza danych	MySQL
Komunikacja frontend–backend	HTTP + JSON + Fetch API
Dostęp do bazy w PHP	PDO
Autoryzacja	PHP Sessions
Serwer	Apache
Edytor	Visual Studio Code
Kontrola wersji	Git + GitHub/GitLab
Zarządzanie projektem	Trello
Diagramy	diagrams.net / Draw.io


12. Kryterium ukończenia zadania z Fazy I
Zadanie „Wybór technologii i środowiska pracy” można uznać za zakończone, gdy:
- [x] Wybrano wariant aplikacji internetowej (Web App).
- [x] Wybrano HTML5, CSS3 i Vanilla JavaScript ES6+ jako technologie frontendowe.
- [x] Wybrano PHP jako technologię backendową.
- [x] Wybrano MySQL jako system zarządzania bazą danych.
- [x] Określono wymagane oprogramowanie i zasoby techniczne.
- [x] Wybrano Visual Studio Code jako główny edytor.
- [ ] Potwierdzono dostępność wymaganego oprogramowania w pracowni.
- [ ] Sprawdzono działanie PHP, Apache i MySQL na komputerach w pracowni.
Ostatnie dwa punkty wymagają fizycznej weryfikacji na komputerze używanym podczas realizacji projektu.
