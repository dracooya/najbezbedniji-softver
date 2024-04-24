# **Opis Projekta**

Aplikacija služi za rukovanje korisničkim slikama što podrazumeva:

-   *Upload* slika, sa mogućnošću dodavanja imena i tagova slici

-   Svakoj slici može da se menja ime i tagovi

-   Svaka slika se može obrisati

-   Dodavanje novih albuma i premeštanje slika između njih

-   Brisanje albuma

-   Deljenje prava pristupa slikama i albumima drugim korisnicima, pri
    čemu je moguće upravljati nivoom prava (samo pregled ili pregled i
    modifikacija)

-   Ukidanje prava pristupa

-   „Lajkovanje" i ostavljanje komentara na slici

Pored toga, korisnicima je omogućena registracija i logovanje.
Aplikacija ima samo jednu ulogu, a to je sam korisnik.

Korisnički interfejs je implementiram u *React* radnom okviru, a
serverska logika u *Play* radnom okviru implementiranom u *Scala*
programskom jeziku. Aplikacija koristi *AWS S3* servis za skladištenje i
pristup slikama i *PostgreSQL* bazu podataka za sve ostale podatke.

Projekat je implementiran od strane jedne osobe (Maja Varga).

# ***Code Review***

Nad projektom je pokrenut *Mega-Linter* alat za analizu koda. Analizom
su detektovane sledeće kategorije dekefata:

-   **Ponavljanje isečaka programskog koda** - kršenje *DRY* principa
    pisanja koda

-   **Otkrivanje poverljivih informacija i kredencijala**- na *GitHub*
    platformi se nalazi tajni *AWS* ključ za pristup *S3* servisu i
    kredencijali vezani za bazu podataka

-   **Korišćenje *default* vrednosti za kredencijale** - nije promenjena
    podrazumevana lozinka za *PostgreSQL* konekciju

-   **Korišćenje starijih verzija biblioteka sa poznatim
    ranjivostima** - detektovane ranjivosti su u opsegu od *Critial*
    (*axios*) do *Low* (*zod*)

-   **Greške u pisanju CSS stilova** - sintaksne greške, pogrešno
    definisane vrednosti svojstava, korišćenje zastarelih svojstava

-   **Greške u pisanju HTML fajlova** - nedostajući *Doctype* i meta
    tagovi. Pronađeni su u okviru *Play Framework* HTML fajlova, koji
    nisu pisani od strane implementatora

-   **Nedostajuća formatiranja u *Scala* kodu** - kod vezan za *Play
    Framework,* nije pisan od strane implementatora

# **Preporuke za poboljšanje koda**

-   **Izdvajanje isečaka koda koji se ponavljaju** - smanjuje broj
    linija koda i poboljšava čitljivost. Ukoliko bi neki od isečaka
    imali ranjivost (sadrži implementacione greške, podložni su nekim
    napadima), onda bi se izmena pravila samo na jednom mestu

-   **Pravilno rukovanje poverljivim podacima** - kredencijale, tokene i
    tajne ključeve po pravilu ne bi trebalo stavljati u svom izvornom
    obliku na udaljeni repozitorijum. Takve podatke je potrebno
    enkriptovati i takve ih postavljati. Postoje i alati koji ovo rade -
    npr. **git-secret** koji radi za Git alat

-   **Korišćenje jakih kredencijala** - izmena podrazumevanih vrednosti
    kredencijala i korišćenje jakih lozinki

-   **Instalacija novijih verzija biblioteka sa detektovanim
    ranjivostima** - sve biblioteke kojima su pronađene ranjivosti imaju
    svoje novije verzije u kojima su te ranjivosti rešene. Generalno
    pravilo je da se sve biblioteke uvek ažuriraju na poslednju stabilnu
    verziju

-   **Ispravljanje pogrešno formatiranog koda pisanog od strane
    implementatora** - u ovom slučaju važi za loše formatirane CSS
    fajlove. *Mega-Linter* je alat koji ovakve greške može automatski
    rešiti, pošto su relativno jednostavne i ne utiču na logiku
    programa. Kod koji je pisan u okviru biblioteka koje se koriste i
    kod kojih su detektovani defekti su van opsega implementatora
    aplikacije. Rešenje ovakvih grešaka se može tražiti jedino u
    ažuriranju biblioteka ili otvaranje diskusije o tom problemu sa
    samim implementatorima biblioteka (često postoji opcija otvaranja
    novog *Issue*-a u okviru *GitHub* stranice odabrane biblioteke)

# **Zaključak**

Ručna analiza koda je trajala **oko 35 minuta**. U toku ručne analize je
pronađeno **6 defekata** (svi su u okviru koda koji nije deo
biblioteke/radnog okvira). Za razliku od toga, pokretanje alata za
analizu koda je trajalo **6 minuta i 22 sekunde** i pronađeno je **76
defekata**.
