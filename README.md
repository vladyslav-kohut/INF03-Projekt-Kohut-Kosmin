# EduResource Manager

Aplikacja internetowa do zarządzania zasobami szkoły: sprzętem komputerowym, pomocy naukowych,
książek i innym wyposażeniem. System umożliwia ewidencję zasobów, kontrolę ich lokalizacji
i stanu technicznego oraz obsługę wypożyczeń.

Projekt szkolny realizowany w kwalifikacji **INF.04** (efekty INF.04.3(6) i INF.04.3(7)),
w ramach przedmiotu *Planowanie i realizowanie przedsięwzięcia programistycznego*.

---

## 1. Funkcje MVP

| Moduł | Zakres |
|---|---|
| Logowanie i role | logowanie e-mail/hasłem, role **Administrator** i **Użytkownik**, wylogowanie, kontrola uprawnień po stronie serwera |
| Zarządzanie zasobami | dodawanie, przeglądanie, edycja i archiwizacja zasobów (CRUD), tylko dla administratora |
| Wyszukiwanie i filtrowanie | wyszukiwarka po nazwie i numerze katalogowym, filtry po kategorii, lokalizacji, statusie i stanie technicznym |
| Wnioski i wypożyczenia | złożenie wniosku o dostępny zasób, akceptacja lub odrzucenie przez administratora, rejestracja zwrotu |
| Raporty | lista zasobów uszkodzonych, lista urządzeń niesprawdzonych, przeterminowane wypożyczenia, historia działań |

Statusy zasobu: `dostępny`, `wypożyczony`, `w naprawie`, `zutylizowany`.
Stany techniczne: `sprawny`, `uszkodzony`, `niesprawdzony`.

---

## 2. Technologie

| Część | Wybór |
|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+ (bez frameworków) |
| Backend | PHP 8 (bez frameworków), sesje PHP |
| Baza danych | MySQL / MariaDB |
| Dostęp do bazy | `mysqli` i wyłączne przygotowane zapytania (prepared statements) |
| Serwer lokalny | Apache dostarczany z XAMPP |
| Komunikacja | `fetch` → pliki PHP w katalogu `api/` → JSON |
| Narzędzia | Git, GitHub, Trello, Visual Studio Code |

---

## 3. Wymagania

**Sprzętowe:** komputer z procesorem obsługującym XAMPP, minimum 4 GB RAM, połączenie
z Internetem (do pobrania narzędzi i pracy w GitHub).

**Programowe:**

- XAMPP z Apache, PHP 8.x i MySQL/MariaDB,
- dowolna aktualna przeglądarka internetowa,
- Git,
- Visual Studio Code (lub inny edytor kodu).

Wszystkie użyte narzędzia są bezpłatne. Projekt nie wymaga płatnych licencji
ani zewnętrznej infrastruktury — działa w całości lokalnie.

---

## 4. Instalacja i uruchomienie

### 4.1. Pobranie projektu

```bash
git clone https://github.com/vladyslav-kohut/INF03-Projekt-Kohut-Kosmin.git
```

Skopiuj cały katalog projektu do katalogu serwera, np.:

```text
C:\xampp\htdocs\INF03-Projekt-Kohut-Kosmin\
```

### 4.2. Uruchomienie XAMPP

1. Otwórz panel sterowania XAMPP.
2. Uruchom moduły **Apache** i **MySQL**.

### 4.3. Konfiguracja połączenia z bazą danych

Plik `api/config/database.php` jest plikiem lokalnym i **nie znajduje się w repozytorium**.
Utwórz go ręcznie (razem z katalogiem `api/config/`, jeśli nie istnieje):

```php
<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $polaczenie = new mysqli(
        'localhost',
        'root',
        '',
        'eduresource_manager'
    );
    $polaczenie->set_charset('utf8mb4');
} catch (mysqli_sql_exception $blad) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['blad' => 'Nie można połączyć się z bazą danych.']);
    exit;
}
```

Dostosuj host, użytkownika i hasło do swojej instalacji XAMPP.

### 4.4. Utworzenie bazy danych

Otwórz `http://localhost/phpmyadmin` i zaimportuj po kolei:

1. `database/schema.sql` — tworzy bazę `eduresource_manager` i pięć tabel,
2. `database/dane_przykladowe.sql` — pięć przykładowych zasobów,
3. `database/seed.sql` — rozbudowany zestaw danych demonstracyjnych (opcjonalnie).

Te same pliki można wczytać z wiersza poleceń:

```bash
mysql -u root < database/schema.sql
mysql -u root < database/dane_przykladowe.sql
mysql -u root < database/seed.sql
```

### 4.5. Konta testowe

Utwórz konta demonstracyjne (skrypt uruchamiany z wiersza poleceń):

```bash
php database/konta_testowe.php
```

| Rola | E-mail | Hasło |
|---|---|---|
| Administrator | `admin@eduresource.local` | `admin123` |
| Użytkownik | `uczen@eduresource.local` | `uczen123` |

### 4.6. Uruchomienie aplikacji

Otwórz w przeglądarce:

```text
http://localhost/INF03-Projekt-Kohut-Kosmin/frontend/login.html
```

---

## 5. Struktura katalogów

```text
INF03-Projekt-Kohut-Kosmin/
├── api/                        # backend (PHP, JSON)
│   ├── config/database.php     # lokalne połączenie z bazą (nie jest w repo)
│   ├── helpers.php             # odpowiedzi JSON, sesje, uprawnienia, historia działań
│   ├── auth/                   # login.php, logout.php, me.php
│   ├── resources.php           # CRUD zasobów
│   ├── loans.php               # wnioski, wypożyczenia, zwroty
│   └── reports.php             # raporty i historia działań
├── database/
│   ├── schema.sql              # schemat bazy danych
│   ├── dane_przykladowe.sql    # przykładowe zasoby
│   ├── seed.sql                # zestaw danych demonstracyjnych
│   └── konta_testowe.php       # skrypt tworzący konta testowe
├── frontend/                   # interfejs (HTML, CSS, JavaScript)
│   ├── login.html              # ekran logowania
│   ├── index.html              # lista zasobów i filtrowanie
│   ├── loans.html              # wnioski i wypożyczenia
│   ├── reports.html            # raporty (widok administratora)
│   ├── css/                    # style
│   └── js/                     # skrypty
├── docs/                       # dokumentacja projektowa
├── README.md
└── .editorconfig
```

---

## 6. Dokumentacja projektowa

| Plik | Zawartość |
|---|---|
| `docs/REQUIREMENTS.md` | specyfikacja wymagań funkcjonalnych i niefunkcjonalnych |
| `docs/ARCHITECTURE.md` | architektura aplikacji, stos technologiczny, podział ról |
| `docs/DATABASE_ERD.md` | diagram ERD i opis tabel |
| `docs/PROJECT_SCOPE.md` | cel oraz zakres funkcjonalny MVP |
| `docs/RISK_ANALYSIS.md` | analiza ryzyka, kosztów i nakładu pracy |
| `docs/GIT-RULES.md` | zasady pracy z gałęziami, commitami i Pull Requestami |
| `docs/ARKUSZ_TESTOWY.md` | arkusz testów funkcjonalnych z wynikami |
| `docs/MAKIETA_UI.md` | makieta głównej strony oraz pliki PNG i SVG |

---

## 7. Podział ról w zespole

- **Programista A — Vladyslav (Project Lead / Backend):** architektura bazy, logika
  biznesowa, autoryzacja, API.
- **Programista B — Kosmin (Quality & Frontend Lead):** interfejs użytkownika, walidacja
  po stronie klienta, scenariusze testowe, dokumentacja końcowa.

Obaj członkowie zespołu wykonują code review i testują zintegrowane funkcje.

---

## 8. Jak pracować z repozytorium

Obowiązuje `docs/GIT-RULES.md`:

- główna gałąź to `main`, commitowanie bezpośrednio do niej jest zabronione,
- każda funkcjonalność powstaje w gałęzi `feature/...`, `fix/...` lub `docs/...`,
- commity w formacie `feat: ...`, `fix: ...`, `docs: ...`,
- scalenie do `main` wyłącznie przez Pull Request z Code Review drugiej osoby.
