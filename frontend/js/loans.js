const Wypozyczenia = {
    wnioski: [],
    wypozyczenia: [],
    biezacyWniosek: null,
    biezaceWypozyczenie: null,
    licznikZapytania: 0,

    async start() {
        this.powiazFormularze();
        this.ustawMinimalnyTermin();
        await Promise.all([this.wczytajZasoby(), this.wczytajListe()]);
    },

    ustawMinimalnyTermin() {
        const dzis = new Date();
        const dzien = String(dzis.getDate()).padStart(2, '0');
        const miesiac = String(dzis.getMonth() + 1).padStart(2, '0');
        document.getElementById('wniosek-termin').min =
            dzis.getFullYear() + '-' + miesiac + '-' + dzien;
    },

    powiazFormularze() {
        document.getElementById('formularz-wniosek').addEventListener('submit', (zdarzenie) => {
            this.zlozWniosek(zdarzenie);
        });

        document.querySelectorAll('[data-zamknij]').forEach((element) => {
            element.addEventListener('click', () => this.zamknijModale());
        });

        ['modal-decyzja', 'modal-zwrot'].forEach((id) => {
            document.getElementById(id).addEventListener('click', (zdarzenie) => {
                if (zdarzenie.target.id === id) {
                    this.zamknijModale();
                }
            });
        });

        document.getElementById('przycisk-zaakceptuj').addEventListener('click', () => {
            this.rozpatrz('zaakceptowany');
        });
        document.getElementById('przycisk-odrzuc').addEventListener('click', () => {
            this.rozpatrz('odrzucony');
        });
        document.getElementById('przycisk-zwrot-potwierdz').addEventListener('click', () => {
            this.zarejestrujZwrot();
        });

        document.getElementById('tabela-wnioski').addEventListener('click', (zdarzenie) => {
            this.obsluzAkcje(zdarzenie, 'rozpatrz');
        });
        document.getElementById('tabela-wypozyczenia').addEventListener('click', (zdarzenie) => {
            this.obsluzAkcje(zdarzenie, 'zwrot');
        });

        document.addEventListener('keydown', (zdarzenie) => {
            if (zdarzenie.key === 'Escape') {
                this.zamknijModale();
            }
        });
    },

    async wczytajZasoby() {
        const wybierz = document.getElementById('wniosek-zasob');
        const biezaca = wybierz.value;

        try {
            const odpowiedz = await Api.get('../api/resources.php?status=dostepny');
            const dane = (odpowiedz.dane || []).filter((zasob) =>
                zasob.stan_techniczny !== 'uszkodzony'
            );

            wybierz.innerHTML = '<option value="">Wybierz zasób</option>' +
                dane.map((zasob) =>
                    '<option value="' + zasob.id_zasobu + '">' +
                    UI.escape(zasob.nazwa) +
                    (zasob.lokalizacja ? ' — ' + UI.escape(zasob.lokalizacja) : '') +
                    '</option>'
                ).join('');

            if (dane.some((zasob) => String(zasob.id_zasobu) === biezaca)) {
                wybierz.value = biezaca;
            }

            const info = document.getElementById('formularz-wniosek-info');
            if (!dane.length) {
                info.textContent = 'Obecnie brak zasobów dostępnych do wypożyczenia.';
                info.hidden = false;
            } else {
                info.hidden = true;
            }
        } catch (blad) {
            if (blad.kod !== 401) {
                UI.komunikat('Nie udało się wczytać listy dostępnych zasobów.', 'blad');
            }
        }
    },

    async wczytajListe() {
        const numer = ++this.licznikZapytania;
        UI.laduj(document.getElementById('tabela-wnioski'));
        UI.laduj(document.getElementById('tabela-wypozyczenia'));

        try {
            const odpowiedz = await Api.get('../api/loans.php');
            if (numer !== this.licznikZapytania) {
                return;
            }
            this.wnioski = odpowiedz.wnioski || [];
            this.wypozyczenia = odpowiedz.wypozyczenia || [];
            this.wyswietlWnioski();
            this.wyswietlWypozyczenia();
            this.aktualizujPodsumowanie();
        } catch (blad) {
            if (numer !== this.licznikZapytania || blad.kod === 401) {
                return;
            }
            UI.blad(document.getElementById('tabela-wnioski'), blad.blad);
            UI.blad(document.getElementById('tabela-wypozyczenia'), blad.blad);
        }
    },

    aktualizujPodsumowanie() {
        const oczekujace = this.wnioski.filter((wniosek) => wniosek.status === 'oczekujacy').length;
        const aktywne = this.wypozyczenia.filter((wypozyczenie) => !wypozyczenie.data_zwrotu).length;
        const moje = this.wnioski.filter((wniosek) =>
            wniosek.id_wnioskujacego === UI.uzytkownik.id
        ).length;

        document.getElementById('podsumowanie-oczekujace').textContent = oczekujace;
        document.getElementById('podsumowanie-aktywne').textContent = aktywne;
        document.getElementById('podsumowanie-moje').textContent = moje;
    },

    wyswietlWnioski() {
        const pojemnik = document.getElementById('tabela-wnioski');
        const administrator = UI.czyAdministrator();

        document.getElementById('opis-wnioski').textContent = administrator
            ? 'Widzisz wnioski wszystkich użytkowników.'
            : 'Widzisz tylko własne wnioski.';

        if (!this.wnioski.length) {
            UI.pusta(pojemnik, 'Nie znaleziono wniosków.');
            return;
        }

        let html = '<div class="tabela-obudowa"><table class="tabela"><thead><tr>' +
            '<th>Zasób</th>' +
            '<th>Wnioskujący</th>' +
            '<th>Termin zwrotu</th>' +
            '<th>Status</th>' +
            '<th>Złożono</th>' +
            '<th>Rozstrzygnięcie</th>' +
            '<th>Komentarz</th>' +
            '</tr></thead><tbody>';

        this.wnioski.forEach((wniosek) => {
            html += '<tr>' +
                '<td><strong>' + UI.escape(wniosek.nazwa_zasobu) + '</strong><br>' +
                '<span class="pole__podpowiedz">' +
                (wniosek.numer_katalogowy ? UI.escape(wniosek.numer_katalogowy) : 'bez numeru') +
                '</span></td>' +
                '<td>' + UI.escape(wniosek.wnioskujacy) + '</td>' +
                '<td>' + UI.data(wniosek.planowany_termin_zwrotu) + '</td>' +
                '<td>' + UI.odznaka('wniosek', wniosek.status) + '</td>' +
                '<td>' + UI.dataCzas(wniosek.data_zlozenia) + '</td>' +
                this.komorkaRozstrzygniecia(wniosek, administrator) +
                '<td>' + (wniosek.komentarz_administratora
                    ? UI.escape(wniosek.komentarz_administratora)
                    : '—') + '</td>' +
                '</tr>';
        });

        html += '</tbody></table></div>';
        pojemnik.innerHTML = html;
    },

    komorkaRozstrzygniecia(wniosek, administrator) {
        if (wniosek.status !== 'oczekujacy') {
            return '<td>' + (wniosek.rozpatrujacy ? UI.escape(wniosek.rozpatrujacy) : '—') + '</td>';
        }
        if (!administrator) {
            return '<td><span class="pole__podpowiedz">Czeka na administratora</span></td>';
        }
        return '<td><button class="przycisk przycisk--maly" type="button" ' +
            'data-akcja="rozpatrz" data-id="' + wniosek.id_wniosku + '">Rozpatrz</button></td>';
    },

    wyswietlWypozyczenia() {
        const pojemnik = document.getElementById('tabela-wypozyczenia');
        const administrator = UI.czyAdministrator();

        document.getElementById('opis-wypozyczenia').textContent = administrator
            ? 'Widzisz wszystkie wydane i zwrócone zasoby.'
            : 'Widzisz tylko własne wypożyczenia.';

        if (!this.wypozyczenia.length) {
            UI.pusta(pojemnik, 'Nie znaleziono wypożyczeń.');
            return;
        }

        let html = '<div class="tabela-obudowa"><table class="tabela"><thead><tr>' +
            '<th>Zasób</th>' +
            '<th>Wypożyczający</th>' +
            '<th>Wydano</th>' +
            '<th>Termin</th>' +
            '<th>Zwrócono</th>' +
            '<th>Akcja</th>' +
            '</tr></thead><tbody>';

        this.wypozyczenia.forEach((wypozyczenie) => {
            const otwarte = !wypozyczenie.data_zwrotu;
            const mozeZwrocic = otwarte && (administrator ||
                wypozyczenie.id_wypozyczajacego === UI.uzytkownik.id);

            html += '<tr>' +
                '<td><strong>' + UI.escape(wypozyczenie.nazwa_zasobu) + '</strong><br>' +
                '<span class="pole__podpowiedz">' + UI.escape(wypozyczenie.lokalizacja || '') +
                '</span></td>' +
                '<td>' + UI.escape(wypozyczenie.wypozyczajacy) + '</td>' +
                '<td>' + UI.dataCzas(wypozyczenie.data_wydania) + '</td>' +
                '<td>' + UI.data(wypozyczenie.termin_zwrotu) + '</td>' +
                '<td>' + (wypozyczenie.data_zwrotu
                    ? UI.dataCzas(wypozyczenie.data_zwrotu)
                    : '<span class="odznaka odznaka--oczekujacy">Wypożyczony</span>') + '</td>' +
                '<td>' + (mozeZwrocic
                    ? '<button class="przycisk przycisk--maly" type="button" ' +
                      'data-akcja="zwrot" data-id="' + wypozyczenie.id_wypozyczenia + '">Zwróć</button>'
                    : '—') + '</td>' +
                '</tr>';
        });

        html += '</tbody></table></div>';
        pojemnik.innerHTML = html;
    },

    obsluzAkcje(zdarzenie, oczekiwana) {
        const przycisk = zdarzenie.target.closest('[data-akcja]');
        if (!przycisk || przycisk.dataset.akcja !== oczekiwana) {
            return;
        }

        const id = Number(przycisk.dataset.id);
        if (oczekiwana === 'rozpatrz') {
            const wniosek = this.wnioski.find((rekord) => rekord.id_wniosku === id);
            if (wniosek) {
                this.otworzDecyzje(wniosek);
            }
        } else {
            const wypozyczenie = this.wypozyczenia.find((rekord) => rekord.id_wypozyczenia === id);
            if (wypozyczenie) {
                this.otworzZwrot(wypozyczenie);
            }
        }
    },

    pokazModal(id) {
        document.getElementById(id).hidden = false;
        document.body.style.overflow = 'hidden';
    },

    zamknijModale() {
        document.getElementById('modal-decyzja').hidden = true;
        document.getElementById('modal-zwrot').hidden = true;
        document.body.style.overflow = '';
        this.biezacyWniosek = null;
        this.biezaceWypozyczenie = null;
        this.ukryjBlad('modal-decyzja-blad');
    },

    pokazBlad(id, tresc) {
        const element = document.getElementById(id);
        element.textContent = tresc;
        element.hidden = false;
    },

    ukryjBlad(id) {
        const element = document.getElementById(id);
        element.textContent = '';
        element.hidden = true;
    },

    otworzDecyzje(wniosek) {
        this.biezacyWniosek = wniosek;
        this.ukryjBlad('modal-decyzja-blad');
        document.getElementById('decyzja-komentarz').value = '';
        document.getElementById('modal-decyzja-szczegoly').innerHTML =
            '<div class="komunikat komunikat--info">' +
            '<strong>' + UI.escape(wniosek.nazwa_zasobu) + '</strong><br>' +
            'Wnioskujący: ' + UI.escape(wniosek.wnioskujacy) + '<br>' +
            'Planowany termin zwrotu: ' + UI.data(wniosek.planowany_termin_zwrotu) + '<br>' +
            'Złożono: ' + UI.dataCzas(wniosek.data_zlozenia) +
            '</div>';
        this.pokazModal('modal-decyzja');
    },

    otworzZwrot(wypozyczenie) {
        this.biezaceWypozyczenie = wypozyczenie;
        document.getElementById('zwrot-nazwa').textContent = wypozyczenie.nazwa_zasobu;
        document.getElementById('zwrot-stan').value = 'sprawny';
        this.pokazModal('modal-zwrot');
        document.getElementById('przycisk-zwrot-potwierdz').focus();
    },

    async zlozWniosek(zdarzenie) {
        zdarzenie.preventDefault();

        const wybierz = document.getElementById('wniosek-zasob');
        const termin = document.getElementById('wniosek-termin').value;
        const dzis = document.getElementById('wniosek-termin').min;

        const brakZasobu = wybierz.value === '';
        const zlyTermin = !termin || termin < dzis;

        document.getElementById('pole-wniosek-zasob').classList.toggle('pole--blad', brakZasobu);
        document.querySelector('#pole-wniosek-zasob .pole__blad').classList.toggle('ukryj', !brakZasobu);
        document.getElementById('pole-wniosek-termin').classList.toggle('pole--blad', zlyTermin);
        document.querySelector('#pole-wniosek-termin .pole__blad').classList.toggle('ukryj', !zlyTermin);

        if (brakZasobu || zlyTermin) {
            return;
        }

        const przycisk = document.getElementById('przycisk-wniosek');
        przycisk.disabled = true;
        przycisk.textContent = 'Wysyłanie…';

        try {
            await Api.post('../api/loans.php', {
                id_zasobu: Number(wybierz.value),
                planowany_termin_zwrotu: termin
            });
            UI.komunikat('Wniosek został złożony.', 'sukces');
            document.getElementById('formularz-wniosek').reset();
            await this.wczytajListe();
        } catch (blad) {
            if (blad.kod !== 401) {
                UI.komunikat(blad.blad, 'blad');
            }
        } finally {
            przycisk.disabled = false;
            przycisk.textContent = 'Złóż wniosek';
        }
    },

    async rozpatrz(decyzja) {
        if (!this.biezacyWniosek) {
            return;
        }

        const id = this.biezacyWniosek.id_wniosku;
        const komentarz = document.getElementById('decyzja-komentarz').value.trim();
        const przycisk = document.getElementById(
            decyzja === 'zaakceptowany' ? 'przycisk-zaakceptuj' : 'przycisk-odrzuc'
        );

        this.ukryjBlad('modal-decyzja-blad');
        przycisk.disabled = true;

        try {
            await Api.patch('../api/loans.php?wniosek=' + id, {
                decyzja: decyzja,
                komentarz: komentarz === '' ? null : komentarz
            });

            this.zamknijModale();
            UI.komunikat(
                decyzja === 'zaakceptowany'
                    ? 'Wniosek zaakceptowano, utworzono wypożyczenie.'
                    : 'Wniosek odrzucono.',
                'sukces'
            );
            await Promise.all([this.wczytajZasoby(), this.wczytajListe()]);
        } catch (blad) {
            if (blad.kod !== 401) {
                this.pokazBlad('modal-decyzja-blad', blad.blad);
            }
        } finally {
            przycisk.disabled = false;
        }
    },

    async zarejestrujZwrot() {
        if (!this.biezaceWypozyczenie) {
            return;
        }

        const id = this.biezaceWypozyczenie.id_wypozyczenia;
        const stan = document.getElementById('zwrot-stan').value;
        const przycisk = document.getElementById('przycisk-zwrot-potwierdz');
        przycisk.disabled = true;

        try {
            await Api.patch('../api/loans.php?wypozyczenie=' + id, {
                akcja: 'zwrot',
                stan_techniczny: stan
            });

            this.zamknijModale();
            UI.komunikat('Zwrot został zarejestrowany.', 'sukces');
            await Promise.all([this.wczytajZasoby(), this.wczytajListe()]);
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
    .then(() => Wypozyczenia.start())
    .catch((blad) => {
        if (blad && blad.kod !== 401) {
            UI.komunikat(blad.blad || 'Nie udało się uruchomić strony.', 'blad');
        }
    });
