CREATE DATABASE IF NOT EXISTS eduresource_manager
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eduresource_manager;

CREATE TABLE IF NOT EXISTS uzytkownicy (
    id_uzytkownika INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    imie_i_nazwisko VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    haslo_hash VARCHAR(255) NOT NULL,
    rola ENUM('administrator', 'uzytkownik') NOT NULL DEFAULT 'uzytkownik',
    aktywny TINYINT(1) NOT NULL DEFAULT 1,
    data_utworzenia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS zasoby (
    id_zasobu INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(150) NOT NULL,
    numer_katalogowy VARCHAR(100) NULL UNIQUE,
    kategoria VARCHAR(100) NOT NULL,
    stan_techniczny ENUM('sprawny', 'uszkodzony', 'niesprawdzony') NOT NULL DEFAULT 'sprawny',
    lokalizacja VARCHAR(150) NOT NULL,
    status ENUM('dostepny', 'wypozyczony', 'w_naprawie', 'zutylizowany') NOT NULL DEFAULT 'dostepny',
    aktywny TINYINT(1) NOT NULL DEFAULT 1,
    data_utworzenia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_aktualizacji TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_zasoby_kategoria (kategoria),
    INDEX idx_zasoby_lokalizacja (lokalizacja),
    INDEX idx_zasoby_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wnioski_wypozyczenia (
    id_wniosku INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_zasobu INT UNSIGNED NOT NULL,
    id_wnioskujacego INT UNSIGNED NOT NULL,
    planowany_termin_zwrotu DATE NOT NULL,
    status ENUM('oczekujacy', 'zaakceptowany', 'odrzucony') NOT NULL DEFAULT 'oczekujacy',
    id_rozpatrujacego INT UNSIGNED NULL,
    data_rozpatrzenia DATETIME NULL,
    komentarz_administratora VARCHAR(500) NULL,
    data_zlozenia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wnioski_status (status),
    INDEX idx_wnioski_wnioskujacy (id_wnioskujacego),
    CONSTRAINT fk_wnioski_zasob FOREIGN KEY (id_zasobu) REFERENCES zasoby(id_zasobu),
    CONSTRAINT fk_wnioski_wnioskujacy FOREIGN KEY (id_wnioskujacego) REFERENCES uzytkownicy(id_uzytkownika),
    CONSTRAINT fk_wnioski_rozpatrujacy FOREIGN KEY (id_rozpatrujacego) REFERENCES uzytkownicy(id_uzytkownika)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wypozyczenia (
    id_wypozyczenia INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_wniosku INT UNSIGNED NOT NULL UNIQUE,
    id_zasobu INT UNSIGNED NOT NULL,
    id_wypozyczajacego INT UNSIGNED NOT NULL,
    id_wydajacego INT UNSIGNED NOT NULL,
    data_wydania TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    termin_zwrotu DATE NOT NULL,
    data_zwrotu DATETIME NULL,
    INDEX idx_wypozyczenia_uzytkownik (id_wypozyczajacego),
    INDEX idx_wypozyczenia_termin (termin_zwrotu),
    INDEX idx_wypozyczenia_zwrot (data_zwrotu),
    CONSTRAINT fk_wypozyczenia_wniosek FOREIGN KEY (id_wniosku) REFERENCES wnioski_wypozyczenia(id_wniosku),
    CONSTRAINT fk_wypozyczenia_zasob FOREIGN KEY (id_zasobu) REFERENCES zasoby(id_zasobu),
    CONSTRAINT fk_wypozyczenia_uzytkownik FOREIGN KEY (id_wypozyczajacego) REFERENCES uzytkownicy(id_uzytkownika),
    CONSTRAINT fk_wypozyczenia_wydajacy FOREIGN KEY (id_wydajacego) REFERENCES uzytkownicy(id_uzytkownika)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historia_dzialan (
    id_zdarzenia INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_wykonujacego INT UNSIGNED NOT NULL,
    typ_zdarzenia VARCHAR(60) NOT NULL,
    typ_obiektu VARCHAR(40) NOT NULL,
    id_obiektu INT UNSIGNED NULL,
    opis VARCHAR(500) NOT NULL,
    data_zdarzenia TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_historia_data (data_zdarzenia),
    INDEX idx_historia_wykonujacy (id_wykonujacego),
    INDEX idx_historia_typ (typ_zdarzenia),
    CONSTRAINT fk_historia_wykonujacy FOREIGN KEY (id_wykonujacego) REFERENCES uzytkownicy(id_uzytkownika)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
