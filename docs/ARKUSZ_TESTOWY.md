# Arkusz testów funkcjonalnych

Testy wykonano ręcznie w lokalnym środowisku XAMPP. Sprawdzono API przez żądania `fetch` w konsoli przeglądarki oraz integrację interfejsu z backendem przez strony aplikacji.

| ID | Przypadek testowy | Oczekiwany wynik | Uzyskany wynik | Status |
|---|---|---|---|---|
| T01 | Logowanie administratora z prawidłowym hasłem | Zwrócenie danych administratora i roli `administrator` | Zwrócono konto Administrator testowy z rolą `administrator` | Zgodny |
| T02 | Logowanie użytkownika z prawidłowym hasłem | Zwrócenie danych użytkownika i roli `uzytkownik` | Zwrócono konto Użytkownik testowy z rolą `uzytkownik` | Zgodny |
| T03 | Logowanie z nieprawidłowym hasłem | Odrzucenie logowania, odpowiedź HTTP 401 | Serwer zwrócił HTTP 401 Unauthorized | Zgodny |
| T04 | Pobranie listy zasobów przez zalogowanego użytkownika | Udostępnienie listy, odpowiedź HTTP 200 | Serwer zwrócił HTTP 200 | Zgodny |
| T05 | Dostęp użytkownika do raportu historii administratora | Odmowa dostępu, odpowiedź HTTP 403 | Serwer zwrócił HTTP 403 Forbidden | Zgodny |
| T06 | Próba zaakceptowania wniosku przez zwykłego użytkownika | Odmowa operacji, odpowiedź HTTP 403 | Serwer zwrócił HTTP 403 Forbidden | Zgodny |
| T07 | Złożenie wniosku o wypożyczenie dostępnego zasobu przez API | Utworzenie wniosku ze statusem oczekującym, odpowiedź HTTP 201 | Serwer zwrócił HTTP 201 Created; utworzono nowy wniosek | Zgodny |
| T08 | Zaakceptowanie oczekującego wniosku przez administratora przez API | Zaakceptowanie wniosku i utworzenie wypożyczenia | Operacja administratora zakończyła się powodzeniem; wniosek i wypożyczenie były widoczne na liście | Zgodny |
| T09 | Zwrócenie wypożyczonego zasobu przez API | Zapisanie zwrotu i ponowne udostępnienie zasobu | API potwierdziło zwrot; zasób ponownie miał status `dostepny` | Zgodny |
| T10 | Odrzucenie nowego wniosku przez administratora | Zmiana statusu wniosku na `odrzucony`, odpowiedź HTTP 200 | Serwer zwrócił HTTP 200 dla decyzji administratora | Zgodny |
| T11 | Ponowna zmiana decyzji dla już zaakceptowanego wniosku | Zablokowanie zmiany zakończonego wniosku | Serwer zwrócił HTTP 409 Conflict; wcześniejsza decyzja pozostała bez zmian | Zgodny |
| T12 | Zapis zdarzeń w historii działań | Rejestrowanie złożenia wniosku, jego akceptacji i zwrotu | Raport historii zawierał zdarzenia `zlozono_wniosek`, `zaakceptowano_wniosek` i `zarejestrowano_zwrot` | Zgodny |
| T13 | Wyświetlenie zasobów po zalogowaniu w interfejsie | Pokazanie listy zasobów i informacji o użytkowniku | Wyświetlono projektor testowy z kategorią, lokalizacją, stanem i statusem | Zgodny |
| T14 | Ograniczenie widoku zwykłego użytkownika | Ukrycie raportów administracyjnych i wyświetlenie tylko własnych wniosków oraz wypożyczeń | Użytkownik nie widział pozycji Raporty i widział wyłącznie własne wpisy | Zgodny |
| T15 | Utworzenie wniosku w interfejsie użytkownika | Pokazanie nowego wniosku ze statusem `Oczekujący` | Wniosek o projektor pojawił się na liście użytkownika ze statusem `Oczekujący` | Zgodny |
| T16 | Rozpatrzenie wniosku w interfejsie administratora | Widoczność oczekującego wniosku i możliwość decyzji administratora | Administrator zobaczył wniosek, zaakceptował go, a system utworzył aktywne wypożyczenie | Zgodny |
| T17 | Rejestracja zwrotu w interfejsie | Zapisanie daty zwrotu i usunięcie aktywnej akcji zwrotu | Po potwierdzeniu zwrotu pojawiła się data zwrotu, a zasób wrócił do statusu dostępnego | Zgodny |
| T18 | Dodanie zasobu przez formularz administratora | Zapisanie nowego zasobu i pokazanie go na liście | Zasób `Zasób testowy UI` pojawił się na liście | Zgodny |
| T19 | Edycja zasobu przez administratora | Zapisanie zmienionych danych zasobu | Nazwa została zmieniona na `Zasób testowy UI po edycji` | Zgodny |
| T20 | Archiwizacja zasobu przez administratora | Usunięcie zasobu z listy aktywnych | Testowy zasób zniknął z listy aktywnych, projektor pozostał | Zgodny |
| T21 | Wyszukiwanie zasobu po numerze katalogowym | Wyświetlenie pasującego zasobu | Wyszukanie `TEST-001` pokazało projektor testowy; przycisk Wyczyść usunął filtr | Zgodny |
| T22 | Wyświetlenie historii działań w interfejsie administratora | Pokazanie zapisanych zdarzeń z systemu | Raport historii wyświetlił zdarzenia złożenia, akceptacji, odrzucenia wniosku i zwrotu | Zgodny |

## Wniosek

Wszystkie opisane przypadki testowe zakończyły się zgodnie z oczekiwaniami. Ręcznie sprawdzono podstawową integrację frontend-backend, logowanie, kontrolę uprawnień, obsługę zasobów, wniosków, wypożyczeń, zwrotów oraz raport historii.

## Zakres testów

Testy wykonano ręcznie w lokalnym środowisku XAMPP na przykładowych danych. Nie obejmowały testów obciążeniowych ani sprawdzenia na wielu przeglądarkach i urządzeniach.
