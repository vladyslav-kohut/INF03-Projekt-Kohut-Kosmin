# Wymagania EduResource Manager

## Użytkownicy
- **Administrator** zarządza zasobami, rejestruje wypożyczenia i korzysta z raportów.
- **Użytkownik** przegląda zasoby i swoje wypożyczenia; może potwierdzić zwrot przypisanego zasobu.

## Wymagania funkcjonalne
| ID | Wymaganie |
|---|---|
| FR-01 | Logowanie adresem e-mail i hasłem. |
| FR-02 | Rozróżnienie ról Administrator i Użytkownik oraz ograniczenie funkcji administracyjnych. |
| FR-03 | Zalogowany użytkownik może wyświetlić listę aktywnych zasobów. |
| FR-04 | Administrator może dodawać, edytować i usuwać (archiwizować) zasoby. |
| FR-05 | Zasób ma nazwę, numer seryjny/katalogowy, kategorię, stan techniczny, lokalizację i status. |
| FR-06 | Wyszukiwanie zasobów po nazwie/numerze i filtrowanie po kategorii/lokalizacji. |
| FR-07 | Administrator może przypisać dostępny zasób użytkownikowi i ustawić termin zwrotu. |
| FR-08 | Nie można wypożyczyć zasobu niedostępnego, uszkodzonego ani już wypożyczonego. |
| FR-09 | Administrator lub właściciel aktywnego wypożyczenia może zarejestrować zwrot. |
| FR-10 | Lista wypożyczeń rozróżnia aktywne i zakończone; użytkownik widzi tylko swoje. |
| FR-11 | Administrator może wyświetlić raport zasobów uszkodzonych i nieprzetestowanych. |
| FR-12 | Status zasobu: dostępny, wypożyczony, w naprawie lub zutylizowany. |

## Wymagania niefunkcjonalne
| ID | Wymaganie |
|---|---|
| NFR-01 | Aplikacja działa lokalnie przez Apache w XAMPP, bez frameworków. |
| NFR-02 | Dane są przechowywane w MySQL/MariaDB z kodowaniem UTF-8. |
| NFR-03 | PHP używa mysqli; zapytania z danymi użytkownika korzystają z prepared statements. |
| NFR-04 | Hasła są przechowywane jako skróty przez password_hash i sprawdzane przez password_verify. |
| NFR-05 | Uprawnienia administracyjne są sprawdzane po stronie PHP. |
| NFR-06 | Backend ponownie waliduje dane z formularzy. |
| NFR-07 | Frontend komunikuje się z PHP przez HTTP i JSON, bez frameworka JS. |
| NFR-08 | Interfejs ma czytelne polskie etykiety i działa w aktualnej przeglądarce komputerowej. |
| NFR-09 | Błędy nie ujawniają haseł, konfiguracji ani szczegółów SQL. |

## Kryterium odbioru MVP
Można zalogować się z odpowiednią rolą, przeglądać i filtrować zasoby, zarządzać nimi jako administrator, obsłużyć wypożyczenie i zwrot oraz wyświetlić wymagane raporty.