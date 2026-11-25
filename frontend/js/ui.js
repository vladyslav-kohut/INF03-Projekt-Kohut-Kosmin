const UI = {
    uzytkownik: null,

    escape(wartosc) {
        return String(wartosc === null || wartosc === undefined ? '' : wartosc)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    data(wartosc) {
        if (!wartosc) {
            return '—';
        }
        const czesci = String(wartosc).slice(0, 10).split('-');
        if (czesci.length === 3) {
            return czesci[2] + '.' + czesci[1] + '.' + czesci[0];
        }
        return String(wartosc);
    },

    dataCzas(wartosc) {
        if (!wartosc) {
            return '—';
        }
        const data = new Date(String(wartosc).replace(' ', 'T'));
        if (Number.isNaN(data.getTime())) {
            return this.data(wartosc);
        }
        const dzien = String(data.getDate()).padStart(2, '0');
        const miesiac = String(data.getMonth() + 1).padStart(2, '0');
        return dzien + '.' + miesiac + '.' + data.getFullYear() + ' ' +
            String(data.getHours()).padStart(2, '0') + ':' +
            String(data.getMinutes()).padStart(2, '0');
    },

    etykiety: {
        status: {
            dostepny: 'Dostępny',
            wypozyczony: 'Wypożyczony',
            w_naprawie: 'W naprawie',
            zutylizowany: 'Zutylizowany'
        },
        stan: {
            sprawny: 'Sprawny',
            uszkodzony: 'Uszkodzony',
            niesprawdzony: 'Niesprawdzony'
        },
        wniosek: {
            oczekujacy: 'Oczekujący',
            zaakceptowany: 'Zaakceptowany',
            odrzucony: 'Odrzucony'
        }
    },

    odznaka(grupa, klucz) {
        const etykieta = this.etykiety[grupa][klucz] || klucz || '—';
        return '<span class="odznaka odznaka--' + this.escape(klucz) + '">' +
            this.escape(etykieta) + '</span>';
    },

    komunikat(tresc, typ) {
        let pojemnik = document.getElementById('powiadomienia');
        if (!pojemnik) {
            pojemnik = document.createElement('div');
            pojemnik.id = 'powiadomienia';
            pojemnik.className = 'powiadomienia';
            document.body.appendChild(pojemnik);
        }

        const element = document.createElement('div');
        element.className = 'powiadomienie' + (typ ? ' powiadomienie--' + typ : '');
        element.textContent = tresc;
        pojemnik.appendChild(element);
        window.setTimeout(() => element.remove(), 4000);
    },

    laduj(pojemnik) {
        pojemnik.innerHTML = '<div class="stan stan--ladowanie">Ładowanie danych…</div>';
    },

    pusta(pojemnik, tekst) {
        pojemnik.innerHTML = '<div class="pula-pusta">' + this.escape(tekst) + '</div>';
    },

    blad(pojemnik, tresc) {
        pojemnik.innerHTML = '<div class="komunikat komunikat--blad">' +
            this.escape(tresc) + '</div>';
    },

    czyAdministrator() {
        return !!this.uzytkownik && this.uzytkownik.rola === 'administrator';
    },

    przygotujNaglowek() {
        const nazwa = document.getElementById('uzytkownik-nazwa');
        const rola = document.getElementById('uzytkownik-rola');
        if (nazwa) {
            nazwa.textContent = this.uzytkownik.imie_i_nazwisko;
        }
        if (rola) {
            rola.textContent = this.czyAdministrator() ? 'Administrator' : 'Użytkownik';
        }

        document.querySelectorAll('[data-admin]').forEach((element) => {
            element.classList.toggle('ukryj', !this.czyAdministrator());
        });

        document.querySelectorAll('[data-wyloguj]').forEach((element) => {
            element.addEventListener('click', async () => {
                try {
                    await Api.post('../api/auth/logout.php', {});
                } catch (blad) {
                }
                window.location.href = 'login.html';
            });
        });
    },

    przygotujNawigacje() {
        const biezacy = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.sidebar__link').forEach((link) => {
            const cel = link.getAttribute('href');
            link.classList.toggle('sidebar__link--aktywny', cel === biezacy);
        });
    },

    async start() {
        const odpowiedz = await Api.get('../api/auth/me.php');
        this.uzytkownik = odpowiedz.dane;
        this.przygotujNaglowek();
        this.przygotujNawigacje();
        return this.uzytkownik;
    }
};

UI.gotowosc = UI.start();
