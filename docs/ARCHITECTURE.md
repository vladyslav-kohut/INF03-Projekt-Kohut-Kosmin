# EduResource Manager  
## Architektura i środowisko projektu

---

## 1. Cel dokumentu

Dokument opisuje wybór technologii, środowiska pracy oraz podstawową architekturę aplikacji **EduResource Manager**, realizowanej w ramach projektu zespołowego na kierunku **Technik programista**.

Dokument realizuje zadanie z **Fazy I — Planowanie przedsięwzięcia**:

> „Wybór technologii i środowiska pracy”.

---

## 2. Wybrany wariant aplikacji

### Typ aplikacji

**Aplikacja internetowa — Web App**

Aplikacja będzie uruchamiana w przeglądarce internetowej i będzie komunikować się z backendem napisanym w PHP oraz bazą danych MySQL.

### Uzasadnienie wyboru

Wybrany wariant:

- zapewnia naturalny podział projektu na frontend i backend,
- nie wymaga instalowania osobnego klienta na komputerach w pracowni,
- jest zgodny z wymaganiami projektu,
- umożliwia równoległą pracę dwóch członków zespołu,
- pozwala wykorzystać HTML, CSS, JavaScript, PHP oraz SQL w ramach jednego projektu.

---

## 3. Stos technologiczny

### 3.1. Frontend

| Technologia | Zastosowanie |
|---|---|
| **HTML5** | Struktura stron i elementów interfejsu |
| **CSS3** | Wygląd aplikacji, układ oraz responsywność |
| **JavaScript ES6+ (Vanilla JS)** | Logika interfejsu, walidacja formularzy oraz komunikacja z backendem |

Frontend będzie realizowany **bez frameworków JavaScript**.

Do komunikacji z backendem zostanie wykorzystane **Fetch API**.

### 3.2. Backend

| Technologia | Zastosowanie |
|---|---|
| **PHP** | Logika biznesowa, autoryzacja, operacje CRUD oraz obsługa zapytań |
| **PHP Sessions** | Obsługa zalogowanego użytkownika i systemu ról |
| **PDO** | Bezpieczna komunikacja PHP z bazą danych |

### 3.3. Baza danych

| Technologia | Zastosowanie |
|---|---|
| **MySQL** | Przechowywanie danych użytkowników, zasobów oraz wypożyczeń |

Podstawowe encje systemu:

- `users` — użytkownicy systemu,
- `resources` — zasoby szkolne,
- `loans` — wypożyczenia zasobów.

Szczegółowy model danych zostanie przygotowany w **Fazie II** w postaci diagramu **ERD**.

---

## 4. Podstawowa architektura aplikacji

Aplikacja będzie podzielona na trzy główne warstwy:

```text
┌──────────────────────────────────────────┐
│                 FRONTEND                 │
│        HTML5 + CSS3 + JavaScript         │
│                                          │
│       Interfejs / formularze / widoki    │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTP + JSON
                     │ Fetch API
                     ▼
┌──────────────────────────────────────────┐
│                  BACKEND                 │
│                    PHP                   │
│                                          │
│     Autoryzacja / CRUD / logika biznesowa│
└────────────────────┬─────────────────────┘
                     │
                     │ PDO / SQL
                     ▼
┌──────────────────────────────────────────┐
│               BAZA DANYCH                │
│                   MySQL                  │
│                                          │
│         users / resources / loans        │
└──────────────────────────────────────────┘
```

### 4.1. Sposób komunikacji

1. Użytkownik wykonuje akcję w interfejsie.
2. JavaScript wysyła żądanie HTTP do backendu PHP.
3. Backend PHP waliduje otrzymane dane.
4. PHP wykonuje odpowiednią logikę biznesową.
5. Backend komunikuje się z bazą danych MySQL za pomocą PDO.
6. PHP zwraca odpowiedź w formacie JSON.
7. JavaScript aktualizuje interfejs użytkownika na podstawie otrzymanej odpowiedzi.

### 4.2. Przykładowy przepływ operacji

Przykład: dodawanie nowego zasobu.

```text
Kliknięcie „Dodaj zasób”
          ↓
Walidacja formularza w JavaScript
          ↓
POST /api/resources.php
          ↓
Walidacja danych w PHP
          ↓
INSERT do bazy MySQL
          ↓
Odpowiedź JSON
          ↓
Aktualizacja listy zasobów
```

---

## 5. Środowisko programistyczne

### 5.1. Edytor kodu

Jako główny edytor kodu wybrano:

**Visual Studio Code**

VS Code będzie wykorzystywany do pracy z:

- HTML,
- CSS,
- JavaScript,
- PHP,
- SQL,
- plikami Markdown,
- systemem kontroli wersji Git.

### 5.2. Zalecane rozszerzenia VS Code

Rozszerzenia nie są obowiązkowe, jednak mogą usprawnić pracę:

- **PHP Intelephense**,
- **Prettier**,
- **GitHub Pull Requests and Issues**,
- **EditorConfig**,
- **Live Server** — wyłącznie do prostych testów statycznego frontendu.

> Docelowa aplikacja powinna być uruchamiana przez serwer Apache, ponieważ backend wykorzystuje PHP.

---

## 6. Wymagane oprogramowanie

| Narzędzie | Wymagane | Zastosowanie |
|---|:---:|---|
| Visual Studio Code | Tak | Edycja kodu |
| Git | Tak | Kontrola wersji |
| GitHub / GitLab | Tak | Repozytorium i Pull Requesty |
| Apache | Tak | Serwer HTTP |
| PHP | Tak | Backend |
| MySQL | Tak | Baza danych |
| phpMyAdmin | Opcjonalnie | Zarządzanie bazą danych |
| Przeglądarka internetowa | Tak | Testowanie aplikacji |
| Trello / GitHub Projects | Tak | Zarządzanie zadaniami |
| diagrams.net / Draw.io | Tak | Diagram ERD i architektury |
| Figma / diagrams.net | Opcjonalnie | Wireframes interfejsu |
| Postman | Opcjonalnie | Testowanie endpointów API |

---

## 7. Wymagane zasoby techniczne

Do realizacji projektu wymagane są:

- komputer z dostępem do środowiska lokalnego lub pracowni szkolnej,
- dostęp do internetu dla GitHub/GitLab oraz Trello,
- lokalny serwer Apache,
- interpreter PHP,
- serwer MySQL,
- współczesna przeglądarka internetowa,
- konta GitHub/GitLab dla obu członków zespołu,
- wspólne repozytorium projektu.

Projekt nie wymaga płatnych usług ani komercyjnych licencji.

---

## 8. Weryfikacja środowiska w pracowni

Przed rozpoczęciem właściwej implementacji należy sprawdzić dostępność oraz poprawne działanie środowiska programistycznego.

### 8.1. Checklista

- [ ] Visual Studio Code uruchamia się poprawnie.
- [ ] Git jest dostępny w terminalu.
- [ ] Apache uruchamia się poprawnie.
- [ ] PHP działa poprawnie.
- [ ] MySQL uruchamia się poprawnie.
- [ ] PHP może połączyć się z MySQL.
- [ ] Projekt PHP można otworzyć przez `localhost`.
- [ ] Przeglądarka poprawnie wyświetla aplikację.
- [ ] Dostęp do repozytorium Git działa dla obu członków zespołu.

### 8.2. Polecenia kontrolne

Sprawdzenie Git:

```bash
git --version
```

Sprawdzenie PHP:

```bash
php --version
```

Sprawdzenie MySQL:

```bash
mysql --version
```

Prosty test PHP:

```php
<?php
echo "PHP działa poprawnie";
?>
```

Po zapisaniu pliku na serwerze należy otworzyć go przez `localhost` i sprawdzić, czy komunikat został poprawnie wyświetlony.

### 8.3. Wynik weryfikacji

| Element | Status / wersja |
|---|---|
| Visual Studio Code | Do uzupełnienia po sprawdzeniu |
| Git | Do uzupełnienia po sprawdzeniu |
| Apache | Do uzupełnienia po sprawdzeniu |
| PHP | Do uzupełnienia po sprawdzeniu |
| MySQL | Do uzupełnienia po sprawdzeniu |
| Połączenie PHP → MySQL | Do uzupełnienia po sprawdzeniu |

---

## 9. Proponowana struktura projektu

```text
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
│   │
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── me.php
│   │
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
```

Struktura projektu może zostać zmodyfikowana podczas projektowania szczegółowej architektury w **Fazie II**.

---

## 10. Podział odpowiedzialności technologicznej

### Programista A — Project Lead / Backend Lead

Główne obowiązki:

- PHP,
- MySQL,
- konfiguracja połączenia z bazą danych,
- logika biznesowa,
- autoryzacja,
- operacje CRUD,
- obsługa wypożyczeń,
- endpointy backendowe.

### Programista B — Quality & Frontend Lead

Główne obowiązki:

- HTML5,
- CSS3,
- JavaScript ES6+,
- projekt interfejsu,
- walidacja po stronie klienta,
- komunikacja z API,
- widoki zasobów, wypożyczeń i raportów,
- testowanie,
- integracja widoków.

Obaj programiści uczestniczą w:

- implementacji funkcjonalności,
- Code Review,
- testowaniu,
- integracji projektu.

---

## 11. Podsumowanie decyzji technologicznych

| Obszar | Decyzja |
|---|---|
| Typ aplikacji | Web App |
| Frontend | HTML5 + CSS3 + Vanilla JavaScript ES6+ |
| Framework frontendowy | Brak |
| Backend | PHP |
| Baza danych | MySQL |
| Komunikacja frontend–backend | HTTP + JSON + Fetch API |
| Dostęp do bazy w PHP | PDO |
| Autoryzacja | PHP Sessions |
| Serwer | Apache |
| Edytor | Visual Studio Code |
| Kontrola wersji | Git + GitHub/GitLab |
| Zarządzanie projektem | Trello |
| Diagramy | diagrams.net / Draw.io |

---

## 12. Kryterium ukończenia zadania z Fazy I

Zadanie **„Wybór technologii i środowiska pracy”** można uznać za zakończone, gdy:

- [x] Wybrano wariant aplikacji internetowej — Web App.
- [x] Wybrano HTML5, CSS3 i Vanilla JavaScript ES6+ jako technologie frontendowe.
- [x] Wybrano PHP jako technologię backendową.
- [x] Wybrano MySQL jako system zarządzania bazą danych.
- [x] Określono wymagane oprogramowanie i zasoby techniczne.
- [x] Wybrano Visual Studio Code jako główny edytor.
- [ ] Potwierdzono dostępność wymaganego oprogramowania w pracowni.
- [ ] Sprawdzono działanie PHP, Apache i MySQL na komputerach w pracowni.

Ostatnie dwa punkty wymagają fizycznej weryfikacji na komputerze wykorzystywanym podczas realizacji projektu.
