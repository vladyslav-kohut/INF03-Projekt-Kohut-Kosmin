# Arkusz testów funkcjonalnych

Testy wykonano ręcznie w środowisku XAMPP przez żądania `fetch` w konsoli przeglądarki. Wyniki dotyczą lokalnej kopii projektu użytej podczas testów.

| ID | Przypadek testowy | Oczekiwany wynik | Uzyskany wynik | Status |
|---|---|---|---|---|
| T01 | Logowanie administratora z prawidłowym hasłem | Zwrócenie danych administratora i roli `administrator` | Zwrócono konto Administrator testowy z rolą `administrator` | Zgodny |
| T02 | Logowanie użytkownika z prawidłowym hasłem | Zwrócenie danych użytkownika i roli `uzytkownik` | Zwrócono konto Użytkownik testowy z rolą `uzytkownik` | Zgodny |
| T03 | Logowanie z nieprawidłowym hasłem | Odrzucenie logowania, odpowiedź HTTP 401 | Serwer zwrócił HTTP 401 Unauthorized | Zgodny |
| T04 | Pobranie listy zasobów przez zalogowanego użytkownika | Udostępnienie listy, odpowiedź HTTP 200 | Serwer zwrócił HTTP 200 | Zgodny |
| T05 | Dostęp użytkownika do raportu historii administratora | Odmowa dostępu, odpowiedź HTTP 403 | Serwer zwrócił HTTP 403 Forbidden | Zgodny |
| T06 | Próba zaakceptowania wniosku przez zwykłego użytkownika | Odmowa operacji, odpowiedź HTTP 403 | Serwer zwrócił HTTP 403 Forbidden | Zgodny |
| T07 | Złożenie wniosku o wypożyczenie dostępnego zasobu | Utworzenie wniosku ze statusem oczekującym, odpowiedź HTTP 201 | Serwer zwrócił HTTP 201 Created; utworzono nowy wniosek | Zgodny |
| T08 | Zaakceptowanie oczekującego wniosku przez administratora | Zaakceptowanie wniosku i utworzenie wypożyczenia | Operacja administratora zakończyła się powodzeniem; wniosek i wypożyczenie były widoczne na liście | Zgodny |
| T09 | Zwrócenie wypożyczonego zasobu przez administratora | Zapisanie zwrotu i ponowne udostępnienie zasobu | API potwierdziło zwrot; zasób ponownie miał status `dostepny` | Zgodny |
| T10 | Odrzucenie nowego wniosku przez administratora | Zmiana statusu wniosku na `odrzucony`, odpowiedź HTTP 200 | Serwer zwrócił HTTP 200 dla decyzji administratora | Zgodny |
| T11 | Ponowna zmiana decyzji dla już zaakceptowanego wniosku | Zablokowanie zmiany zakończonego wniosku | Serwer zwrócił HTTP 409 Conflict; wcześniejsza decyzja pozostała bez zmian | Zgodny |
| T12 | Zapis zdarzeń w historii działań | Rejestrowanie złożenia wniosku, jego akceptacji i zwrotu | Raport historii zawierał zdarzenia `zlozono_wniosek`, `zaakceptowano_wniosek` i `zarejestrowano_zwrot` | Zgodny |

## Wniosek

Wszystkie opisane przypadki testowe zakończyły się zgodnie z oczekiwaniami. Testy potwierdziły podstawowe działanie logowania, kontroli uprawnień, obsługi wniosków i wypożyczeń oraz historii działań.

## Zakres testów

Testy wykonano ręcznie na lokalnej kopii backendu uruchomionej w XAMPP. Nie obejmowały jeszcze integracji z interfejsem użytkownika ani testów obciążeniowych. Integrację należy sprawdzić po połączeniu API z frontendem.
