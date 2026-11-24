# Wymagania EduResource Manager

## Role i widoki
- **Użytkownik** widzi własne wnioski i wypożyczenia oraz może złożyć wniosek o dostępny zasób.
- **Administrator** ma chronioną panelem rolę: zarządza zasobami, rozpatruje wnioski, widzi wszystkie wypożyczenia i historię działań.

## Wymagania funkcjonalne
| ID | Wymaganie |
|---|---|
| FR-01 | Logowanie e-mailem i hasłem oraz wylogowanie. |
| FR-02 | System rozróżnia role administratora i użytkownika; backend kontroluje uprawnienia. |
| FR-03 | Zalogowany użytkownik może przeglądać, wyszukiwać i filtrować aktywne zasoby. |
| FR-04 | Administrator może dodawać, edytować i archiwizować zasoby. |
| FR-05 | Użytkownik może złożyć wniosek o dostępny zasób i podać planowany termin zwrotu. |
| FR-06 | Administrator może zaakceptować lub odrzucić oczekujący wniosek. |
| FR-07 | Akceptacja wniosku tworzy wypożyczenie tylko wtedy, gdy zasób nadal jest dostępny. |
| FR-08 | System zapisuje kto, jaki zasób i kiedy wypożyczył oraz termin i faktyczną datę zwrotu. |
| FR-09 | Użytkownik widzi tylko własne wnioski i wypożyczenia; administrator widzi wszystkie. |
| FR-10 | Administrator może przeglądać historię działań: rozpatrzone wnioski, zmiany zasobów i zwroty. |
| FR-11 | Administrator może wyświetlić raport zasobów uszkodzonych i nieprzetestowanych. |
| FR-12 | Status zasobu: dostępny, wypożyczony, w naprawie lub zutylizowany. |

## Wymagania niefunkcjonalne
- Aplikacja działa lokalnie w XAMPP: Apache, PHP i MySQL/MariaDB.
- Frontend używa HTML, CSS i czystego JavaScriptu; komunikacja z PHP odbywa się przez HTTP i JSON.
- PHP używa mysqli i prepared statements; hasła zapisuje przez password_hash.
- Dane wejściowe są walidowane po stronie przeglądarki i ponownie po stronie PHP.
- Interfejs, etykiety i komunikaty są w języku polskim.
- Błędy nie ujawniają haseł ani szczegółów bazy danych.

## Zakres historii
Tabela wypożyczeń przechowuje faktyczne wydania i zwroty. Osobna historia działań administratora zapisuje kto i kiedy wykonał ważną zmianę.