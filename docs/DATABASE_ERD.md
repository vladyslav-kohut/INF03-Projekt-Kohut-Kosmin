# Model bazy danych — ERD

```mermaid
erDiagram
    UZYTKOWNICY ||--o{ WNIOSKI_WYPOZYCZENIA : sklada
    ZASOBY ||--o{ WNIOSKI_WYPOZYCZENIA : dotyczy
    UZYTKOWNICY ||--o{ WNIOSKI_WYPOZYCZENIA : rozpatruje
    WNIOSKI_WYPOZYCZENIA ||--o| WYPOZYCZENIA : tworzy
    ZASOBY ||--o{ WYPOZYCZENIA : historia
    UZYTKOWNICY ||--o{ WYPOZYCZENIA : wypozycza
    UZYTKOWNICY ||--o{ WYPOZYCZENIA : wydaje
    UZYTKOWNICY ||--o{ HISTORIA_DZIALAN : wykonuje

    UZYTKOWNICY {
        int id_uzytkownika PK
        varchar imie_i_nazwisko
        varchar email UK
        varchar haslo_hash
        enum rola
        boolean aktywny
        timestamp data_utworzenia
    }

    ZASOBY {
        int id_zasobu PK
        varchar nazwa
        varchar numer_katalogowy UK
        varchar kategoria
        enum stan_techniczny
        varchar lokalizacja
        enum status
        boolean aktywny
        timestamp data_utworzenia
        timestamp data_aktualizacji
    }

    WNIOSKI_WYPOZYCZENIA {
        int id_wniosku PK
        int id_zasobu FK
        int id_wnioskujacego FK
        date planowany_termin_zwrotu
        enum status
        int id_rozpatrujacego FK
        datetime data_rozpatrzenia
        varchar komentarz_administratora
        timestamp data_zlozenia
    }

    WYPOZYCZENIA {
        int id_wypozyczenia PK
        int id_wniosku FK_UK
        int id_zasobu FK
        int id_wypozyczajacego FK
        int id_wydajacego FK
        timestamp data_wydania
        date termin_zwrotu
        datetime data_zwrotu
    }

    HISTORIA_DZIALAN {
        int id_zdarzenia PK
        int id_administratora FK
        varchar typ_zdarzenia
        varchar typ_obiektu
        int id_obiektu
        varchar opis
        timestamp data_zdarzenia
    }
```

## Co oznaczają tabele
- `uzytkownicy`: konta i role.
- `zasoby`: wyposażenie szkoły.
- `wnioski_wypozyczenia`: prośby użytkowników i decyzje administratora.
- `wypozyczenia`: faktycznie wydane rzeczy; `data_zwrotu` pusta oznacza, że rzecz nie została zwrócona.
- `historia_dzialan`: ważne czynności administratora, np. zaakceptowanie prośby, zmiana zasobu lub rejestracja zwrotu.

Po zaakceptowaniu wniosku powstaje jeden wpis w `wypozyczenia`. Odrzucony wniosek zostaje w historii, ale nie tworzy wypożyczenia. Administrator widzi całą historię; zwykły użytkownik tylko własne wnioski i wypożyczenia.

Nazwy tabel i kolumn są zgodne z `database/schema.sql`.