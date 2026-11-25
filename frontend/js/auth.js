const Logowanie = {
    formularz: null,
    przycisk: null,
    komunikat: null,

    pokazBlad(tresc) {
        this.komunikat.textContent = tresc;
        this.komunikat.hidden = false;
    },

    ukryjBlad() {
        this.komunikat.hidden = true;
        this.komunikat.textContent = '';
    },

    ustawBladPola(id, jestBlad) {
        const pole = document.getElementById('pole-' + id);
        const wejscie = document.getElementById(id);
        pole.classList.toggle('pole--blad', jestBlad);
        wejscie.setAttribute('aria-invalid', jestBlad ? 'true' : 'false');
        pole.querySelector('.pole__blad').classList.toggle('ukryj', !jestBlad);
    },

    waliduj() {
        const email = document.getElementById('email').value.trim();
        const haslo = document.getElementById('haslo').value;
        const emailPoprawny = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        this.ustawBladPola('email', !emailPoprawny);
        this.ustawBladPola('haslo', haslo === '');

        return emailPoprawny && haslo !== '';
    },

    async wyslij(zdarzenie) {
        zdarzenie.preventDefault();
        this.ukryjBlad();

        if (!this.waliduj()) {
            return;
        }

        const email = document.getElementById('email').value.trim();
        const haslo = document.getElementById('haslo').value;

        this.przycisk.disabled = true;
        this.przycisk.textContent = 'Logowanie…';

        try {
            await Api.post('../api/auth/login.php', { email: email, haslo: haslo }, {
                przekieruj: false
            });
            window.location.href = 'index.html';
        } catch (blad) {
            this.pokazBlad(blad.blad);
            this.przycisk.disabled = false;
            this.przycisk.textContent = 'Zaloguj się';
            document.getElementById('haslo').value = '';
            document.getElementById('haslo').focus();
        }
    },

    start() {
        this.formularz = document.getElementById('formularz-logowania');
        this.przycisk = document.getElementById('przycisk-logowanie');
        this.komunikat = document.getElementById('komunikat');

        this.formularz.addEventListener('submit', (zdarzenie) => this.wyslij(zdarzenie));

        ['email', 'haslo'].forEach((id) => {
            document.getElementById(id).addEventListener('input', () => {
                this.ustawBladPola(id, false);
                this.ukryjBlad();
            });
        });

        Api.get('../api/auth/me.php', { przekieruj: false })
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch(() => {
            });
    }
};

Logowanie.start();
