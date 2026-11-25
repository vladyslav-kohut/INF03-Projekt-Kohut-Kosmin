const Zasoby = {
    pojemnik: null,
    filtry: { szukaj: '', kategoria: '', lokalizacja: '', status: '', stan_techniczny: '' },
    licznikZapytania: 0,
    opoznienie: null,

    async start() {
        this.pojemnik = document.getElementById('tabela-zasobow');
        this.powiazFiltry();
        await Promise.all([this.wczytajOpcje(), this.wczytajListe()]);
    },

    powiazFiltry() {
        document.getElementById('filtr-szukaj').addEventListener('input', (zdarzenie) => {
            window.clearTimeout(this.opoznienie);
            this.opoznienie = window.setTimeout(() => {
                this.filtry.szukaj = zdarzenie.target.value.trim();
                this.wczytajListe();
            }, 300);
        });

        const mapowanie = {
            'filtr-kategoria': 'kategoria',
            'filtr-lokalizacja': 'lokalizacja',
            'filtr-status': 'status',
            'filtr-stan': 'stan_techniczny'
        };

        Object.keys(mapowanie).forEach((id) => {
            document.getElementById(id).addEventListener('change', (zdarzenie) => {
                this.filtry[mapowanie[id]] = zdarzenie.target.value;
                this.wczytajListe();
            });
        });

        document.getElementById('przycisk-wyczysc').addEventListener('click', () => {
            document.getElementById('filtr-szukaj').value = '';
            Object.keys(mapowanie).forEach((id) => {
                document.getElementById(id).value = '';
            });
            this.filtry = {
                szukaj: '',
                kategoria: '',
                lokalizacja: '',
                status: '',
                stan_techniczny: ''
            };
            this.wczytajListe();
        });
    },

    unikaty(dane, pole) {
        const zestaw = new Set();
        dane.forEach((rekord) => {
            if (rekord[pole]) {
                zestaw.add(rekord[pole]);
            }
        });
        return Array.from(zestaw).sort((a, b) => a.localeCompare(b, 'pl'));
    },

    ustawOpcje(id, tekstPierwszy, wartosci) {
        const wybierz = document.getElementById(id);
        const biezaca = wybierz.value;
        wybierz.innerHTML = '<option value="">' + UI.escape(tekstPierwszy) + '</option>' +
            wartosci.map((wartosc) =>
                '<option value="' + UI.escape(wartosc) + '">' + UI.escape(wartosc) + '</option>'
            ).join('');
        if (wartosci.includes(biezaca)) {
            wybierz.value = biezaca;
        }
    },

    async wczytajOpcje() {
        try {
            const odpowiedz = await Api.get('../api/resources.php');
            const dane = odpowiedz.dane || [];
            this.ustawOpcje('filtr-kategoria', 'Wszystkie kategorie', this.unikaty(dane, 'kategoria'));
            this.ustawOpcje('filtr-lokalizacja', 'Wszystkie lokalizacje', this.unikaty(dane, 'lokalizacja'));
        } catch (blad) {
            if (blad.kod !== 401) {
                UI.komunikat('Nie udało się wczytać listy kategorii i lokalizacji.', 'blad');
            }
        }
    },

    zbudujSciezke() {
        const parametry = new URLSearchParams();
        Object.keys(this.filtry).forEach((klucz) => {
            if (this.filtry[klucz]) {
                parametry.set(klucz, this.filtry[klucz]);
            }
        });
        const zapytanie = parametry.toString();
        return '../api/resources.php' + (zapytanie ? '?' + zapytanie : '');
    },

    async wczytajListe() {
        const numer = ++this.licznikZapytania;
        UI.laduj(this.pojemnik);

        try {
            const odpowiedz = await Api.get(this.zbudujSciezke());
            if (numer !== this.licznikZapytania) {
                return;
            }
            this.wyswietl(odpowiedz.dane || []);
        } catch (blad) {
            if (numer !== this.licznikZapytania || blad.kod === 401) {
                return;
            }
            UI.blad(this.pojemnik, blad.blad);
        }
    },

    wyswietl(dane) {
        if (!dane.length) {
            UI.pusta(this.pojemnik, 'Brak zasobów spełniających podane kryteria.');
            return;
        }

        let html = '<div class="tabela-obudowa"><table class="tabela"><thead><tr>' +
            '<th>Nazwa</th>' +
            '<th>Numer katalogowy</th>' +
            '<th>Kategoria</th>' +
            '<th>Lokalizacja</th>' +
            '<th>Stan techniczny</th>' +
            '<th>Status</th>' +
            '</tr></thead><tbody>';

        dane.forEach((zasob) => {
            html += '<tr>' +
                '<td><strong>' + UI.escape(zasob.nazwa) + '</strong></td>' +
                '<td>' + (zasob.numer_katalogowy ? UI.escape(zasob.numer_katalogowy) : '—') + '</td>' +
                '<td>' + UI.escape(zasob.kategoria) + '</td>' +
                '<td>' + UI.escape(zasob.lokalizacja) + '</td>' +
                '<td>' + UI.odznaka('stan', zasob.stan_techniczny) + '</td>' +
                '<td>' + UI.odznaka('status', zasob.status) + '</td>' +
                '</tr>';
        });

        html += '</tbody></table></div>';
        this.pojemnik.innerHTML = html;
    }
};

UI.gotowosc
    .then(() => Zasoby.start())
    .catch((blad) => {
        if (blad && blad.kod !== 401) {
            UI.komunikat(blad.blad || 'Nie udało się uruchomić strony.', 'blad');
        }
    });
