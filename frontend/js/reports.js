const Raporty = {
    typ: 'uszkodzone',
    licznikZapytania: 0,

    naglowki: {
        uszkodzone: 'Uszkodzone zasoby',
        niesprawdzone: 'Niesprawdzone urządzenia',
        przeterminowane: 'Przeterminowane wypożyczenia',
        historia: 'Historia działań'
    },

    opisy: {
        uszkodzone: 'Aktywne zasoby oznaczone jako uszkodzone.',
        niesprawdzone: 'Aktywne zasoby, których stan techniczny nie został jeszcze sprawdzony.',
        przeterminowane: 'Wypożyczenia, których termin minął, a sprzęt nie został zwrócony.',
        historia: 'Ostatnie 200 ważnych czynności wykonanych w systemie.'
    },

    zdarzenia: {
        zlozono_wniosek: 'Złożenie wniosku',
        zaakceptowano_wniosek: 'Akceptacja wniosku',
        odrzucono_wniosek: 'Odrzucenie wniosku',
        zarejestrowano_zwrot: 'Zwrot zasobu',
        dodano_zasob: 'Dodanie zasobu',
        zmieniono_zasob: 'Zmiana zasobu',
        zarchiwizowano_zasob: 'Archiwizacja zasobu'
    },

    async start() {
        if (!UI.czyAdministrator()) {
            document.getElementById('tabela-raport').innerHTML =
                '<div class="komunikat komunikat--blad">' +
                'Ta strona jest dostępna wyłącznie dla administratora.' +
                '</div>';
            document.getElementById('zakladki-raportow').classList.add('ukryj');
            document.getElementById('przycisk-odswiez').classList.add('ukryj');
            return;
        }

        this.powiazZakladki();
        await this.wczytaj();
    },

    powiazZakladki() {
        document.getElementById('zakladki-raportow').addEventListener('click', (zdarzenie) => {
            const zakladka = zdarzenie.target.closest('[data-typ]');
            if (!zakladka || zakladka.dataset.typ === this.typ) {
                return;
            }

            this.typ = zakladka.dataset.typ;
            document.querySelectorAll('.zakladka').forEach((element) => {
                element.classList.toggle(
                    'zakladka--aktywna',
                    element.dataset.typ === this.typ
                );
            });
            this.wczytaj();
        });

        document.getElementById('przycisk-odswiez').addEventListener('click', () => this.wczytaj());
    },

    async wczytaj() {
        const numer = ++this.licznikZapytania;
        const pojemnik = document.getElementById('tabela-raport');

        document.getElementById('raport-tytul').textContent = this.naglowki[this.typ];
        document.getElementById('raport-opis').textContent = this.opisy[this.typ];
        UI.laduj(pojemnik);

        try {
            const odpowiedz = await Api.get('../api/reports.php?typ=' + this.typ);
            if (numer !== this.licznikZapytania) {
                return;
            }
            this.wyswietl(odpowiedz.dane || []);
        } catch (blad) {
            if (numer !== this.licznikZapytania || blad.kod === 401) {
                return;
            }
            UI.blad(pojemnik, blad.blad);
        }
    },

    wyswietl(dane) {
        const pojemnik = document.getElementById('tabela-raport');

        if (!dane.length) {
            UI.pusta(pojemnik, 'Brak danych do wyświetlenia w tym zestawieniu.');
            return;
        }

        const naglowki = this.kolumny().map((kolumna) =>
            '<th' + (kolumna.liczba ? ' class="liczba"' : '') + '>' + kolumna.nazwa + '</th>'
        ).join('');

        const wiersze = dane.map((rekord) => {
            return '<tr>' + this.kolumny().map((kolumna) => {
                const tresc = kolumna.rysuj(rekord);
                return '<td' + (kolumna.liczba ? ' class="liczba"' : '') + '>' + tresc + '</td>';
            }).join('') + '</tr>';
        }).join('');

        pojemnik.innerHTML =
            '<p class="podsumowanie-raportu">Liczba pozycji: ' +
            dane.length + '</p>' +
            '<div class="tabela-obudowa"><table class="tabela"><thead><tr>' +
            naglowki + '</tr></thead><tbody>' + wiersze + '</tbody></table></div>';
    },

    kolumny() {
        if (this.typ === 'przeterminowane') {
            return [
                {
                    nazwa: 'Zasób',
                    rysuj: (r) => '<strong>' + UI.escape(r.nazwa_zasobu) + '</strong>'
                },
                {
                    nazwa: 'Termin zwrotu',
                    rysuj: (r) => UI.data(r.termin_zwrotu)
                },
                {
                    nazwa: 'Dni po terminie',
                    liczba: true,
                    rysuj: (r) => this.dniPoTerminie(r.termin_zwrotu)
                },
                {
                    nazwa: 'Wypożyczający',
                    rysuj: (r) => UI.escape(r.imie_i_nazwisko)
                },
                {
                    nazwa: 'E-mail',
                    rysuj: (r) => UI.escape(r.email)
                }
            ];
        }

        if (this.typ === 'historia') {
            return [
                {
                    nazwa: 'Data',
                    rysuj: (r) => UI.dataCzas(r.data_zdarzenia)
                },
                {
                    nazwa: 'Wykonujący',
                    rysuj: (r) => UI.escape(r.imie_i_nazwisko) +
                        '<br><span class="pole__podpowiedz">' +
                        (r.rola === 'administrator' ? 'Administrator' : 'Użytkownik') +
                        '</span>'
                },
                {
                    nazwa: 'Zdarzenie',
                    rysuj: (r) => '<span class="odznaka">' +
                        UI.escape(this.zdarzenia[r.typ_zdarzenia] || r.typ_zdarzenia) +
                        '</span>'
                },
                {
                    nazwa: 'Opis',
                    rysuj: (r) => UI.escape(r.opis)
                }
            ];
        }

        return [
            { nazwa: 'Nazwa', rysuj: (r) => '<strong>' + UI.escape(r.nazwa) + '</strong>' },
            {
                nazwa: 'Numer katalogowy',
                rysuj: (r) => (r.numer_katalogowy ? UI.escape(r.numer_katalogowy) : '—')
            },
            { nazwa: 'Kategoria', rysuj: (r) => UI.escape(r.kategoria) },
            { nazwa: 'Lokalizacja', rysuj: (r) => UI.escape(r.lokalizacja) },
            {
                nazwa: 'Stan techniczny',
                rysuj: (r) => UI.odznaka('stan', r.stan_techniczny)
            },
            { nazwa: 'Status', rysuj: (r) => UI.odznaka('status', r.status) }
        ];
    },

    dniPoTerminie(termin) {
        const dataTerminu = new Date(String(termin) + 'T00:00:00');
        if (Number.isNaN(dataTerminu.getTime())) {
            return '—';
        }
        const roznica = Math.floor((Date.now() - dataTerminu.getTime()) / 86400000);
        return Math.max(roznica, 0);
    }
};

UI.gotowosc
    .then(() => Raporty.start())
    .catch((blad) => {
        if (blad && blad.kod !== 401) {
            UI.komunikat(blad.blad || 'Nie udało się uruchomić strony.', 'blad');
        }
    });
