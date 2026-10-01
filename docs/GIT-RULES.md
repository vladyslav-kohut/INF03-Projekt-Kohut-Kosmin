# Zasady pracy z Git

Dokument określa zasady korzystania z systemu kontroli wersji Git podczas realizacji projektu **EduResource Manager**.

Celem ustalenia wspólnych zasad jest zachowanie czytelnej historii zmian, ograniczenie liczby konfliktów oraz zapewnienie możliwości wzajemnej weryfikacji kodu przez członków zespołu.

---

## 1. Model pracy z gałęziami

Główną gałęzią projektu jest:

`main`

Gałąź `main` powinna zawsze zawierać stabilną i sprawdzoną wersję projektu.

Bezpośrednie commitowanie do `main` jest zabronione.

Każde nowe zadanie, funkcjonalność lub poprawka realizowana jest na osobnej gałęzi utworzonej na podstawie aktualnej wersji `main`.

Podstawowy proces pracy:

`main → nowa gałąź → implementacja → commit → push → Pull Request → Code Review → merge → main`

Po zakończeniu i scaleniu zadania gałąź może zostać usunięta.

---

## 2. Nazewnictwo gałęzi

Nazwy gałęzi powinny jednoznacznie określać rodzaj oraz zakres wykonywanej pracy.

Stosowany format:

`typ/krótki-opis`

Dozwolone typy:

- `feature/` – implementacja nowej funkcjonalności,
- `fix/` – poprawianie błędów,
- `docs/` – zmiany dokumentacji,
- `test/` – prace związane z testowaniem,
- `refactor/` – zmiany struktury kodu bez zmiany jego działania.

Przykłady:

```text
feature/login-ui
feature/resources-crud
feature/loan-system
feature/database-setup

fix/login-validation
fix/resource-status

docs/git-rules
docs/user-manual

test/login-validation
test/resources-crud

refactor/api-handler
```

Zasady nazewnictwa:

- używamy małych liter,
- nie używamy spacji,
- nie używamy polskich znaków,
- słowa oddzielamy znakiem `-`,
- nazwa powinna być krótka i jasno opisywać zadanie.

Jeżeli zadanie posiada numer na tablicy Trello, można uwzględnić go w nazwie gałęzi.

Przykład:

```text
feature/21-resources-list
```

---

## 3. Zasady tworzenia commitów

Każdy commit powinien reprezentować jedną logiczną zmianę.

Nie należy umieszczać wielu niezależnych zmian w jednym dużym commicie.

Format wiadomości commita:

`typ: krótki opis zmiany`

Stosowane typy:

- `feat:` – nowa funkcjonalność,
- `fix:` – poprawka błędu,
- `style:` – zmiany wyglądu, CSS lub formatowania,
- `refactor:` – przebudowa kodu bez dodawania nowych funkcji,
- `docs:` – zmiany dokumentacji,
- `test:` – dodawanie lub aktualizacja testów,
- `chore:` – konfiguracja projektu i zmiany techniczne.

Przykłady poprawnych commitów:

```text
feat: add login form

feat: implement resource filtering

feat: add resource creation form

fix: prevent empty resource name

fix: correct loan status update

style: improve resources table layout

refactor: simplify api request handler

docs: add git workflow rules

test: add login validation cases

chore: create initial project structure
```

Należy unikać nieprecyzyjnych wiadomości, takich jak:

```text
update
fix
changes
test
final
poprawki
dziala
nowa wersja
```

Commity powinny być wykonywane regularnie podczas pracy, a nie dopiero po zakończeniu całego zadania.

---

## 4. Pull Request

Każda ukończona funkcjonalność lub poprawka musi zostać scalona z gałęzią `main` za pomocą Pull Request.

Pull Request powinien zawierać:

- krótki opis wykonanych zmian,
- informację, czego dotyczy zadanie,
- informacje o ewentualnych problemach lub ograniczeniach,
- możliwość sprawdzenia zmian przez drugiego członka zespołu.

Przykładowy tytuł:

```text
Implementacja interfejsu logowania
```

Przykładowy opis:

```text
Dodano:
- formularz logowania,
- walidację wymaganych pól,
- obsługę komunikatów błędów,
- podstawowe style formularza.
```

Pull Request nie powinien być scalany przez autora bez wcześniejszego Code Review drugiego członka zespołu.

---

## 5. Code Review

Każdy Pull Request powinien zostać sprawdzony przez drugiego członka zespołu.

Osoba wykonująca Code Review powinna zweryfikować:

- zgodność kodu z wymaganiami zadania,
- poprawność działania funkcjonalności,
- czytelność kodu,
- nazewnictwo zmiennych i funkcji,
- brak niepotrzebnego lub powtarzającego się kodu,
- poprawność walidacji danych,
- brak oczywistych błędów,
- zgodność zmian z pozostałą częścią projektu.

Jeżeli zostaną znalezione problemy, reviewer dodaje komentarz w Pull Request.

Autor zmian powinien poprawić zgłoszone problemy i wykonać kolejny commit.

Po zaakceptowaniu zmian Pull Request może zostać scalony z `main`.

---

## 6. Zasady mergowania zmian

Zmiany mogą zostać scalone z `main` tylko wtedy, gdy:

- zadanie zostało zakończone,
- funkcjonalność działa poprawnie,
- kod został wysłany do repozytorium,
- utworzono Pull Request,
- drugi członek zespołu wykonał Code Review,
- wszystkie istotne uwagi zostały rozwiązane.

Po wykonaniu merge:

1. należy pobrać aktualną wersję `main`,
2. sprawdzić poprawność działania aplikacji,
3. zamknąć lub przenieść odpowiednie zadanie w Trello do kolumny `Done`,
4. usunąć niepotrzebną gałąź funkcyjną.

---

## 7. Rozwiązywanie konfliktów

Konflikty należy rozwiązywać na bieżąco.

Przed rozpoczęciem nowego zadania należy upewnić się, że lokalna gałąź `main` jest aktualna.

Przykład:

```bash
git checkout main
git pull
```

Jeżeli podczas scalania wystąpi konflikt:

1. sprawdzić pliki wskazane przez Git,
2. porównać obie wersje kodu,
3. wspólnie ustalić poprawną wersję, jeżeli konflikt dotyczy kodu obu programistów,
4. ręcznie usunąć znaczniki konfliktu,
5. przetestować aplikację,
6. wykonać commit rozwiązujący konflikt.

Nie należy automatycznie usuwać zmian drugiego członka zespołu bez ich wcześniejszego sprawdzenia.

---

## 8. Powiązanie Git z Trello

Każda większa funkcjonalność powinna posiadać odpowiadające jej zadanie na tablicy Trello.

Przykład:

Karta Trello:

`Frontend: Lista zasobów`

Gałąź:

```text
feature/resources-list
```

Commity:

```text
feat: add resources table
feat: add resource status badges
feat: implement resource search
```

Po utworzeniu Pull Request zadanie może zostać przeniesione do kolumny:

`Code Review`

Po zaakceptowaniu i scaleniu zmian:

`Done`

---

## 9. Podsumowanie workflow

Standardowy przebieg realizacji zadania:

1. Wybrać zadanie z Trello.
2. Zaktualizować lokalną gałąź `main`.
3. Utworzyć nową gałąź.
4. Zaimplementować zadanie.
5. Regularnie wykonywać commity.
6. Wysłać gałąź do repozytorium.
7. Utworzyć Pull Request.
8. Drugi członek zespołu wykonuje Code Review.
9. Poprawić ewentualne uwagi.
10. Scalić zmiany z `main`.
11. Sprawdzić działanie aplikacji.
12. Przenieść zadanie w Trello do `Done`.

---

## 10. Najważniejsze zasady

- Nie commitujemy bezpośrednio do `main`.
- Każde zadanie realizujemy na osobnej gałęzi.
- Stosujemy ustalone nazwy gałęzi i commitów.
- Każdy Pull Request jest sprawdzany przez drugiego członka zespołu.
- Konflikty rozwiązujemy wspólnie i na bieżąco.
- Po każdym merge sprawdzamy działanie aplikacji.
- Git i Trello powinny odzwierciedlać rzeczywisty stan projektu.
