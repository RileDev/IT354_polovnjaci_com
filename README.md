# Polovnjaci.com — Studentski projekat

**Polovnjaci.com** je veb aplikacija za oglašavanje i pretragu polovnih automobila. Projekat je kreiran kao studentski rad i koristi savremene frontend tehnologije povezane sa Firebase servisima za autentifikaciju i čuvanje podataka.

---

## Tehnologije

Aplikacija je izgrađena koristeći sledeći tehnološki stek:
- **Frontend Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Stilovi:** [Tailwind CSS v4](https://tailwindcss.com/) i [Radix UI](https://www.radix-ui.com/) komponente
- **Upravljanje stanjem (State Management):** [Zustand](https://zustand-demo.pmnd.rs/)
- **Rutiranje:** [React Router v7](https://reactrouter.com/)
- **Backend & Baza podataka:** [Firebase](https://firebase.google.com/) (Authentication & Realtime Database REST API)

---

## Funkcionalnosti

- **Pretraga i filtriranje:** Detaljna pretraga automobila po markama, modelima, karoseriji, tipu goriva, ceni, godištu i kilometraži.
- **Korisnički nalozi:** Registracija, prijava (login), resetovanje lozinke i profilna stranica.
- **Upravljanje oglasima:** Prijavljeni korisnici mogu kreirati (postaviti) nove oglase sa slikama i informacijama o automobilu, kao i pregledati i brisati svoje aktivne oglase.
- **Detaljan pregled:** Prikaz specifikacija automobila, galerije slika i podataka o prodavcu.

---

## Lokalno Pokretanje Projekta

Pratite sledeće korake kako biste pokrenuli projekat na vašoj lokalnoj mašini:

### 1. Instalacija zavisnosti
Otvorite terminal u korenu projekta i pokrenite:
```bash
npm install
```

### 2. Podešavanje Firebase-a (Videti detaljno uputstvo ispod)
Kreirajte `.env` fajl u korenu projekta (kopiranjem `.env.example` šablona) i unesite vaše Firebase parametre:
```bash
cp .env.example .env
```
Popunite vrednosti u `.env` koristeći `=` umesto dvotačke (npr. `VITE_API_KEY=tvoj_api_key`).

### 3. Pokretanje u razvojnom režimu
```bash
npm run dev
```
Aplikacija će biti dostupna na lokalnoj adresi (najčešće `http://localhost:5173`).

### 4. Build za produkciju
```bash
npm run build
```
Vite će generisati optimizovan produkcioni kod u `dist/` direktorijumu.

---

## Firebase Podešavanje i Povezivanje

Projekat koristi **Firebase Authentication** za upravljanje korisnicima i **Firebase Realtime Database** za skladištenje podataka (oglasi, marke, modeli, goriva, karoserije).

### Korak 1: Kreiranje projekta na Firebase korenu konzole
1. Idite na [Firebase Console](https://console.firebase.google.com/) i kliknite na **Add project**.
2. Unesite naziv projekta (npr. `polovnjaci-com`) i pratite korake do kreiranja.
3. Nakon kreiranja projekta, dodajte **Web App** u okviru podešavanja projekta da biste dobili API ključeve.

### Korak 2: Aktiviranje Autentifikacije (Authentication)
1. U levom meniju izaberite **Build > Authentication**, pa kliknite na **Get Started**.
2. Idite na tab **Sign-in method**, izaberite **Email/Password** i omogućite (Enable) ga. Sačuvajte izmene.

### Korak 3: Kreiranje i popunjavanje Realtime Database baze
1. Izaberite **Build > Realtime Database** u levom meniju i kliknite na **Create Database**.
2. Izaberite lokaciju baze (preporučuje se evropski server npr. `europe-west1`) i kliknite na **Next**.
3. Izaberite **Start in test mode** kako bi pravila dozvolila čitanje i pisanje tokom razvoja (napomena: pravila se kasnije mogu podesiti radi sigurnosti), pa kliknite na **Enable**.
4. Kada se baza kreira, uvezite početne podatke (seeding):
   - Kliknite na tri tačke u gornjem desnom uglu panela baze podataka i izaberite **Import JSON**.
   - Izaberite fajl koji se nalazi u projektu na putanji: `db/polovnjaci.firebase.json`.
   - Potvrdite uvoz podataka. Baza će sada biti popunjena početnim markama, modelima, tipovima goriva, korisnicima i oglasima.

### Korak 4: Konfiguracija `.env` fajla
Uzmite podatke za konfiguraciju iz podešavanja vaše Firebase Web aplikacije (Project Settings > General > Your apps) i prepišite ih u `.env` fajl koji ste kreirali u korenu projekta:

```env
VITE_FIREBASE_URL=https://tvoj-projekat-default-rtdb.europe-west1.firebasedatabase.app/
VITE_API_KEY=AIzaSyA...
VITE_AUTH_DOMAIN=tvoj-projekat.firebaseapp.com
VITE_PROJECT_ID=tvoj-projekat
VITE_STORAGE_BUCKET=tvoj-projekat.appspot.com
VITE_MESSAGING_SENDER_ID=1234567890
VITE_APP_ID=1:1234567890:web:abcdef123456
```
*(Napomena: Obratite pažnju da `VITE_FIREBASE_URL` mora da se završava kosom crtom `/` i da predstavlja pun URL vaše Realtime Database baze).*

---

## Struktura Baze Podataka

Struktura u Firebase Realtime Database je organizovana na sledeći način prema uvezenom JSON-u:
- `/brands` — Spisak brendova automobila (Audi, BMW, Mercedes...)
- `/models` — Spisak modela povezanih sa brendovima preko `brandId`
- `/bodytypes` — Tipovi karoserije (Limuzina, Karavan, SUV...)
- `/fuels` — Tipovi goriva (Benzin, Dizel, Hibrid...)
- `/users` — Korisnički nalozi
- `/cars` — Aktivni oglasi automobila sa specifikacijama i slikama
