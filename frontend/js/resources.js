const Zasoby = {
    pojemnik: null,
    filtry: { szukaj: '', kategoria: '', lokalizacja: '', status: '', stan_techniczny: '' },
    licznikZapytania: 0,
    opoznienie: null,
    biezaceZasoby: [],
    biezacyZasob: null,

    async start() {
        this.pojemnik = document.getElementById('tabela-zasobow');
        this.powiazFiltry();
        this.powiazFormularze();
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

    powiazFormularze() {
        document.getElementById('przycisk-dodaj').addEventListener('click', () => this.otworzDodaj());

        document.getElementById('formularz-zasob').addEventListener('submit', (zdarzenie) => {
            this.zapisz(zdarzenie);
        });

        document.querySelectorAll('[data-zamknij]').forEach((element) => {
            element.addEventListener('click', () => this.zamknijModale());
        });

        ['modal-zasob', 'modal-usuwanie'].forEach((id) => {
            document.getElementById(id).addEventListener('click', (zdarzenie) => {
                if (zdarzenie.target.id === id) {
                    this.zamknijModale();
                }
            });
        });

        document.getElementById('przycisk-usun-potwierdz').addEventListener('click', () => this.usun());

        this.pojemnik.addEventListener('click', (zdarzenie) => this.obsluzAkcje(zdarzenie));

        document.addEventListener('keydown', (zdarzenie) => {
            if (zdarzenie.key === 'Escape') {
                this.zamknijModale();
            }
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

    ustawListe(id, wartosci) {
        document.getElementById(id).innerHTML = wartosci.map((wartosc) =>
            '<option value="' + UI.escape(wartosc) + '"></option>'
        ).join('');
    },

    async wczytajOpcje() {
        try {
            const odpowiedz = await Api.get('../api/resources.php');
            const dane = odpowiedz.dane || [];
            const kategorie = this.unikaty(dane, 'kategoria');
            const lokalizacje = this.unikaty(dane, 'lokalizacja');

            this.ustawOpcje('filtr-kategoria', 'Wszystkie kategorie', kategorie);
            this.ustawOpcje('filtr-lokalizacja', 'Wszystkie lokalizacje', lokalizacje);
            this.ustawListe('lista-kategorii', kategorie);
            this.ustawListe('lista-lokalizacji', lokalizacje);
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
        this.biezaceZasoby = dane;

        if (!dane.length) {
            UI.pusta(this.pojemnik, 'Brak zasobów spełniających podane kryteria.');
            return;
        }

        const administrator = UI.czyAdministrator();
        let html = '<div class="tabela-obudowa"><table class="tabela"><thead><tr>' +
            '<th>Nazwa</th>' +
            '<th>Numer katalogowy</th>' +
            '<th>Kategoria</th>' +
            '<th>Lokalizacja</th>' +
            '<th>Stan techniczny</th>' +
            '<th>Status</th>' +
            (administrator ? '<th>Akcje</th>' : '') +
            '</tr></thead><tbody>';

        dane.forEach((zasob) => {
            html += '<tr>' +
                '<td><strong>' + UI.escape(zasob.nazwa) + '</strong></td>' +
                '<td>' + (zasob.numer_katalogowy ? UI.escape(zasob.numer_katalogowy) : '—') + '</td>' +
                '<td>' + UI.escape(zasob.kategoria) + '</td>' +
                '<td>' + UI.escape(zasob.lokalizacja) + '</td>' +
                '<td>' + UI.odznaka('stan', zasob.stan_techniczny) + '</td>' +
                '<td>' + UI.odznaka('status', zasob.status) + '</td>' +
                (administrator ? this.komorkaAkcji(zasob) : '') +
                '</tr>';
        });

        html += '</tbody></table></div>';
        this.pojemnik.innerHTML = html;
    },

    komorkaAkcji(zasob) {
        if (zasob.status === 'wypozyczony') {
            return '<td><span class="pole__podpowiedz">Wypożyczony</span></td>';
        }

        return '<td><div class="grupa-przyciskow">' +
            '<button class="przycisk przycisk--jasny przycisk--maly" type="button" ' +
            'data-akcja="edycja" data-id="' + zasob.id_zasobu + '">Edytuj</button>' +
            '<button class="przycisk przycisk--zagrozenie przycisk--maly" type="button" ' +
            'data-akcja="usuniecie" data-id="' + zasob.id_zasobu + '">Usuń</button>' +
            '</div></td>';
    },

    obsluzAkcje(zdarzenie) {
        const przycisk = zdarzenie.target.closest('[data-akcja]');
        if (!przycisk) {
            return;
        }

        const id = Number(przycisk.dataset.id);
        const zasob = this.biezaceZasoby.find((rekord) => rekord.id_zasobu === id);
        if (!zasob) {
            return;
        }

        if (przycisk.dataset.akcja === 'edycja') {
            this.otworzEdycja(zasob);
        } else if (przycisk.dataset.akcja === 'usuniecie') {
            this.otworzUsuwanie(zasob);
        }
    },

    pokazModal(id) {
        document.getElementById(id).hidden = false;
        document.body.style.overflow = 'hidden';
    },

    zamknijModale() {
        document.getElementById('modal-zasob').hidden = true;
        document.getElementById('modal-usuwanie').hidden = true;
        document.body.style.overflow = '';
        this.biezacyZasob = null;
        this.ukryjBladFormularza();
    },

    wyczyscBledy() {
        ['nazwa', 'numer', 'kategoria', 'lokalizacja'].forEach((nazwa) => {
            const pole = document.getElementById('pole-' + nazwa);
            pole.classList.remove('pole--blad');
            pole.querySelector('.pole__blad').classList.add('ukryj');
            document.getElementById('zasob-' + nazwa).setAttribute('aria-invalid', 'false');
        });
        this.ukryjBladFormularza();
    },

    ustawBladPola(nazwa, jestBlad) {
        const pole = document.getElementById('pole-' + nazwa);
        const wejscie = document.getElementById('zasob-' + nazwa);
        pole.classList.toggle('pole--blad', jestBlad);
        wejscie.setAttribute('aria-invalid', jestBlad ? 'true' : 'false');
        pole.querySelector('.pole__blad').classList.toggle('ukryj', !jestBlad);
    },

    pokazBladFormularza(tresc) {
        const element = document.getElementById('modal-zasob-blad');
        element.textContent = tresc;
        element.hidden = false;
    },

    ukryjBladFormularza() {
        const element = document.getElementById('modal-zasob-blad');
        element.textContent = '';
        element.hidden = true;
    },

    otworzDodaj() {
        this.biezacyZasob = null;
        document.getElementById('modal-zasob-tytul').textContent = 'Dodaj zasób';
        document.getElementById('formularz-zasob').reset();
        document.getElementById('zasob-stan').value = 'sprawny';
        document.getElementById('zasob-status').value = 'dostepny';
        this.wyczyscBledy();
        this.pokazModal('modal-zasob');
        document.getElementById('zasob-nazwa').focus();
    },

    otworzEdycja(zasob) {
        this.biezacyZasob = zasob;
        document.getElementById('modal-zasob-tytul').textContent = 'Edytuj zasób';
        document.getElementById('zasob-nazwa').value = zasob.nazwa;
        document.getElementById('zasob-numer').value = zasob.numer_katalogowy || '';
        document.getElementById('zasob-kategoria').value = zasob.kategoria;
        document.getElementById('zasob-lokalizacja').value = zasob.lokalizacja;
        document.getElementById('zasob-stan').value = zasob.stan_techniczny;
        document.getElementById('zasob-status').value =
            zasob.status === 'wypozyczony' ? 'dostepny' : zasob.status;
        this.wyczyscBledy();
        this.pokazModal('modal-zasob');
        document.getElementById('zasob-nazwa').focus();
    },

    otworzUsuwanie(zasob) {
        this.biezacyZasob = zasob;
        document.getElementById('usuwanie-nazwa').textContent = zasob.nazwa;
        this.pokazModal('modal-usuwanie');
        document.getElementById('przycisk-usun-potwierdz').focus();
    },

    walidujFormularz() {
        const nazwa = document.getElementById('zasob-nazwa').value.trim();
        const numer = document.getElementById('zasob-numer').value.trim();
        const kategoria = document.getElementById('zasob-kategoria').value.trim();
        const lokalizacja = document.getElementById('zasob-lokalizacja').value.trim();

        const bledy = {
            nazwa: nazwa === '' || nazwa.length > 150,
            numer: numer.length > 100,
            kategoria: kategoria === '' || kategoria.length > 100,
            lokalizacja: lokalizacja === '' || lokalizacja.length > 150
        };

        Object.keys(bledy).forEach((klucz) => this.ustawBladPola(klucz, bledy[klucz]));

        return !Object.values(bledy).some((jestBlad) => jestBlad);
    },

    async zapisz(zdarzenie) {
        zdarzenie.preventDefault();
        this.ukryjBladFormularza();

        if (!this.walidujFormularz()) {
            return;
        }

        const dane = {
            nazwa: document.getElementById('zasob-nazwa').value.trim(),
            numer_katalogowy: document.getElementById('zasob-numer').value.trim(),
            kategoria: document.getElementById('zasob-kategoria').value.trim(),
            lokalizacja: document.getElementById('zasob-lokalizacja').value.trim(),
            stan_techniczny: document.getElementById('zasob-stan').value,
            status: document.getElementById('zasob-status').value
        };

        const przycisk = document.getElementById('modal-zasob-zapisz');
        const bylaEdycja = !!this.biezacyZasob;
        const id = bylaEdycja ? this.biezacyZasob.id_zasobu : null;
        przycisk.disabled = true;
        przycisk.textContent = 'Zapisywanie…';

        try {
            if (bylaEdycja) {
                await Api.patch('../api/resources.php?id=' + id, dane);
            } else {
                await Api.post('../api/resources.php', dane);
            }

            this.zamknijModale();
            UI.komunikat(bylaEdycja ? 'Zasób został zaktualizowany.' : 'Zasób został dodany.', 'sukces');
            await this.wczytajOpcje();
            await this.wczytajListe();
        } catch (blad) {
            if (blad.kod !== 401) {
                this.pokazBladFormularza(blad.blad);
            }
        } finally {
            przycisk.disabled = false;
            przycisk.textContent = 'Zapisz';
        }
    },

    async usun() {
        if (!this.biezacyZasob) {
            return;
        }

        const przycisk = document.getElementById('przycisk-usun-potwierdz');
        const id = this.biezacyZasob.id_zasobu;
        przycisk.disabled = true;

        try {
            await Api.usun('../api/resources.php?id=' + id);
            this.zamknijModale();
            UI.komunikat('Zasób został zarchiwizowany.', 'sukces');
            await this.wczytajOpcje();
            await this.wczytajListe();
        } catch (blad) {
            if (blad.kod !== 401) {
                UI.komunikat(blad.blad, 'blad');
            }
        } finally {
            przycisk.disabled = false;
        }
    }
};

UI.gotowosc
    .then(() => Zasoby.start())
    .catch((blad) => {
        if (blad && blad.kod !== 401) {
            UI.komunikat(blad.blad || 'Nie udało się uruchomić strony.', 'blad');
        }
    });
