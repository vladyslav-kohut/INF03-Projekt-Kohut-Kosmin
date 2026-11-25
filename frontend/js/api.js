const Api = {
    async zadaj(sciezka, opcje = {}) {
        const naglowki = { Accept: 'application/json' };
        const fetchOpcje = {
            method: opcje.metoda || 'GET',
            credentials: 'same-origin',
            headers: naglowki
        };

        if (opcje.dane !== undefined) {
            naglowki['Content-Type'] = 'application/json';
            fetchOpcje.body = JSON.stringify(opcje.dane);
        }

        let odpowiedz;
        try {
            odpowiedz = await fetch(sciezka, fetchOpcje);
        } catch (blad) {
            throw { kod: 0, blad: 'Brak połączenia z serwerem. Spróbuj ponownie.' };
        }

        const tekst = await odpowiedz.text();
        let dane = null;
        if (tekst) {
            try {
                dane = JSON.parse(tekst);
            } catch (blad) {
                dane = null;
            }
        }

        if (odpowiedz.status === 401 && opcje.przekieruj !== false) {
            window.location.href = 'login.html';
            throw { kod: 401, blad: 'Sesja wygasła. Zaloguj się ponownie.' };
        }

        if (!odpowiedz.ok) {
            throw {
                kod: odpowiedz.status,
                blad: (dane && dane.blad) || 'Nie udało się wykonać operacji.'
            };
        }

        return dane;
    },

    get(sciezka, opcje = {}) {
        return this.zadaj(sciezka, opcje);
    },

    post(sciezka, dane, opcje = {}) {
        return this.zadaj(sciezka, Object.assign({}, opcje, { metoda: 'POST', dane: dane }));
    },

    patch(sciezka, dane, opcje = {}) {
        return this.zadaj(sciezka, Object.assign({}, opcje, { metoda: 'PATCH', dane: dane }));
    },

    usun(sciezka, opcje = {}) {
        return this.zadaj(sciezka, Object.assign({}, opcje, { metoda: 'DELETE' }));
    }
};
