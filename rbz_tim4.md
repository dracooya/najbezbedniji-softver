**Razvoj bezbednog softvera - domaći zadatak 1**

-   **Tim 4**

> Maja Varga SV54/2020
>
> Marko Milijanović SV56/2020
>
> Vuk Radmilović SV73/2020

**A. Hešovanje lozinki**

Na osnovu poslednjih OWASP preporuka za hešovanje lozinki, razmotrena su
3 algoritma:

> 3\. **Bcrypt** - najstariji i pouzdan za *legacy* sisteme. Otporan na
> *brute force* napade. Brzo se izvršava i zahteva najmanje memorije u
> odnosu na ostale. Pogodan za sisteme sa ograničenim računarskim
> resursima.
>
> 2\. **scrypt** - dizajniran da bude otporan i na napade sa
> specijalizovanog hardvera i paralelizovanih *brute force* napada.
> Zahteva više memorije i traje duže od prethodnog.
>
> 1\. **Argon2id -** pobednik takmičenja *Password Hashing Competition*
> 2015. godine. Trenutno najbolji algoritam po preporuci OWASP-a.
> Dizajniran da bude maksimalno otporan na GPU i paralelizovane *brute
> force* napade, ali i na *side channel* napade (eksploatišu računarske
> karakteristike koje se koriste pri implementaciji protokola i
> algoritama). Parametrizacijom se može ostvariti zadovoljavajući odnos
> **potrošnja memorije**/**brzina**.

**Argon2id** je najbezbedniji, te je i odabran za našu implementaciju
hešing mehanizma.

Parametri Argon2id algoritma su:

-   **Količina RAM memorije koju algoritam koristi -** m

-   **Broj iteracija koje se izvršavaju nad memorijom -** t

-   **Stepen paralelizma** (tj. broj niti koje izvršavaju algoritam) - p

Prema preporukama OWASP-a, preporučene vrednosti ovih parametara su:

-   m=47104 (46 MiB), t=1, p=1

-   m=19456 (19 MiB), t=2, p=1

-   m=12288 (12 MiB), t=3, p=1

-   m=9216 (9 MiB), t=4, p=1

-   m=7168 (7 MiB), t=5, p=1

Sve navedene konfiguracije nude isti nivo bezbednosti. Razlikuju se po
potrošnji RAM-a i brzini izvršavanja - prve dve opcije su memorijski
zahtevnije, dok sledeće tri zahtevaju više procesorskog vremena.
Konfiguracija se bira u odnosu na dostupne resurse u sistemu.

Za potrebe implementacije hešovanja lozinki na Java Spring Boot
platformi, **Bouncy Castle** predstavlja pouzdanog provajdera za
implementaciju Argon2id algoritma. Biblioteka je dobro dokumentovana i
redovno održavana. Omogućuje finije podešavanje parametara algoritma od
**Spring Boot Crypto** biblioteke, još jednog pouzdanog provajdera.

Na osnovu pretraga CVE (*The Common Vulnerabilities and Exposures*) i
NVD (*National Vulnerability Database*) baza podataka registrovanih
ranjivosti, argon2id implementacija u okviru Bouncy Castle biblioteke
**nema poznatih ranjivosti**.

Imajući to u vidu, najbezbedniji mehanizam hešovanja za **Java Spring
Boot** platformu podrazumeva:

-   Korišćenje **argon2id** algoritma, čija implementacija je dostupna u
    **Bouncy Castle** biblioteci

-   Korišćenje preporučenih vrednosti parametara - dobar odnos potrošnja
    memorije/brzina izvršavanja se može ostvariti postavljanjem sledećih
    parametara: **19MiB RAM memorije, 2 iteracije kroz memoriju i stepen
    paralelizacije 1 (1 nit)**

-   Uvezivanje OWASP *Dependency Check* alata u projekat, koji otkriva
    poznate ranjivosti u bibliotekama koje se koriste u projektu, što
    uključuje i Bouncy Castle

-   Redovno pokretnje alata radi provere stanja implementacije algoritma

**B. Mehanizam revizije (auditing)**

Izvršena je analiza *GCP (Google cloud platform) Operations Suit-a* sa
fokusom na logging i auditing servisima. GCP logging sistem je masivan
servis predviđen za praćenje ogromnih infrastruktura hostovanih na
GCP-u. GCP logging dozvoljava korisnicima da sakupljaju, čuvaju,
pretražuju, analiziraju i prate logove i dobijaju obaveštenja/upozorenja
o svim dešavanjima unutar kreirane cloud infrastrukture koju održavaju.

**Zahtev**: Log datoteke moraju pružiti informacije potrebne za
razrešavanje problema.

**Uspešnost**: Zahtev je u potpunosti ispunjen. GCP logging sistem
automatski loguje sve izmene i komunikaciju unutar održavane
infrastrukture. Ove informacije su dostupne kako u konzoli, tako i
pomoću korisničkog interfejsa. Ove funkcionalnosti dozvoljavaju
agregaciju logova na više nivoa (organizacija, projekat, folder), kao i
filtriranje po mnogim parametrima. Takođe, postoji sistem za *Error
reporting* i *Alerting* polise koje obaveštavaju korisnike o bitnim
dešavanjima ili greškama u sistemu, kao i načinima na koji da se reše.
Ove funkcionalnosti se u potpunosti mogu prilagođavati projektu i
potrebama korisnika, odabirom bitnih parametara i granica u kojima oni
trebaju biti, kao i kanalima obaveštavanja (e-mail, sms i dr.)

**Zahtev**: Svi događaji za koje su akteri bitni moraju biti zapisani,
sa dovoljno informacija kako akteri ne bi mogli da poriču odgovornost
(non-repudiation). Potrebno je obezbediti lako izdvajanje tih događaja.

**Uspešnost**: Ovaj zahtev je delimično ispunjen samim načinom
autentifikacije i autorizacije unutar GCP-a. Svaki korisnik i servis
poseduju svoju IAM ulogu uz pomoć koje se identifikuju unutar cloud-a.
IAM ulogama su dodeljene određene privilegije prilikom kreiranja.
Preporučena je implementacija *principle of least privilege* gde svako
ima samo dozvole koje su mu potrebne za funkcionisanje unutar sistema.
Sem što drastično ograničava sposobnosti eventualnih malicioznih aktera,
može lako da ih identifikuje. Ovo naravno nije savršeno rešenje, kako
ove privilegije dodeljuje sam dizajner sistema. Podrazumevana
podešavanja su previše opšta i daju više dozvola nego što je potrebno,
kako korisnicima, tako i servisima.

**Zahtev**: Stavke log datoteke ne smeju sadržati osetljive podatke.

**Uspešnost**: Ovaj zahtev je u potpunosti ispunjen. Osetljivi podaci
nisu potrebni za efikasno otkrivanje i uklanjanje problema, stoga nisu
čuvani unutar samih logova.

**Zahtev**: Mehanizam za logovanje mora biti pouzdan, mora obezbediti
dostupnost i integritet log datoteka.

**Uspešnost**: Ovaj zahtev je dovoljno dobro ispunjen. GCP tipično čuva
logove 30 dana, ali uz dodatnu konfiguraciju, logovi se čuvaju između 1
i 3650 dana. Dodatna opcija je da nakon isteka logova, oni budu trajno
sačuvani uz pomoć nekog od drugih GCP servisa, najčešće *Cloud
Bucket-a*, ali i drugih servisa za arhiviranje. Google daje osiguranje
da podaci neće biti izgubljeni čuvanjem rezervnih kopija na više
geografskih mesta, čime je korisnik osiguran čak i u slučaju katastrofe
u nekom od data centara. Najveća mana ovog pristupa jeste činjenica da
se naplaćuje, kao i svi ostali cloud servisi.

**Zahtev**: Stavke log datoteke moraju precizno iskazati vreme nastanka.

**Uspešnost**: Ovaj zahtev je ispunjen u potpunosti. Svaki log sadrži i
tačno vreme nastanka.

**Zahtev**: Mehanizam za logovanje mora stremiti ka tome da su logovi
uredni, da je "pretrpanost" minimalizovana.

**Uspešnost**: Ovaj zahtev je dovoljno dobro ispunjen. GCP daje opciju
pristupanja logovima pomoću *Command Line Interface-a* (CLI) i
*Graphical User Interface-a* (GUI). Takođe je podržano filtriranje i
*query-ovanje* logova čime se smanjuje "pretrpanost". Naravno, GUI uvek
može biti bolji i efikasniji, ali pruža sve funkcionalnosti potrebne za
preglednost logova.

**C. Dodatne bezbednosne kontrole**

Izvršena je analiza bezbednosnih kontrola implementiranih nad prethodnim
projektom iz Informacione Bezbednosti. Specifično, analizirana je mera
poklapanja preporučenih bezbednosnih konfiguracija sa implementacijom
heširanja i logovanja.

**Heširanje**

Korisnici pri registrovanju unose svoje lozinke koje se heširaju pomoću
BCryptPasswordEncoder-a. Te hešovane lozinke se čuvaju u bazi podataka.
Pri prijavljivanju, korisnik ponovo kuca svoju lozinku u plain text-u.
Ona se zatim hešira i upoređuje sa hešovanom lozinkom u bazi podataka.
Heš funkcija jednosmerno mapira podatke proizvoljne dužine u neke druge
podatke fiksne dužine, pružajući poverljivost.

BCryptPasswordEncoder jeste implementacija PasswordEncoder-a koja
koristi snažnu BCrypt funkciju za heširanje i koja je dostupna unutar
Spring radnog okvira u kojem je ovaj projekat rađen. Njena poslednja
verzija nema primećenih ranjivosti. BCrypt je adaptivna funkcija koja
koristi salting i cost factor kako bi povećala kompleksnost probijanja
lozinke i držala je konzistentnim tokom vremena uprkos jačanju
računarske moći. Zbog toga, funkcija zahteva više vremena za heširanje.
Ipak, probijanje lozinke je praktično nemoguće ako lozinka nije previše
jednostavna. Unutar aplikacije primenjen je regex filter koji
onemogućava korisniku da unese previše jednostavnu lozinku. Sve ovo
doprinosi tome da je heširanje primenjeno u skladu sa najboljim
praksama.

**Logovanje**

Analizirani su sledeći zahtevi i uspešnost njihovog ispunjenja na
projektu:

**Zahtev**: log datoteke moraju pružiti informacije potrebne za
razrešavanje problema.

**Uspešnost**: zahtev je većinski ispunjen. Najveći deo logova vezanih
za greške i probleme pružaju informacije vezane za to koji se tačno
problem desio, davajući dovoljno konteksta za ispravku tog problema ali
ne govoreći kako bi se tačno taj problem ispravio. Pojedini logovi
ispisuju samo poruku o internoj grešci, ali su ti logovi vezani za
korišćene biblioteke i za stvari koje nisu toliko u našoj kontroli.
Ipak, mogli bi biti precizniji i reći gde se tačno desila interna greška
kako bi lakše razrešili problem.

**Zahtev**: svi događaji za koje su akteri bitni moraju biti zapisani,
sa dovoljno informacija kako akteri ne bi mogli da poriču odgovornost
(non-repudiation). Potrebno je obezbediti lako izdvajanje tih događaja.

**Uspešnost**: zahtev je većinski ispunjen. Logovi su prilično iscrpno
odrađeni i pokrivaju događaje za koje su akteri bitni zajedno sa nekom
identifikacijom aktera. Ipak, mehanizam za lako izdvajanje tih događaja
nije obezbeđen.

**Zahtev**: stavke log datoteke ne smeju sadržati osetljive podatke.

**Uspešnost**: ovaj zahtev je ispunjen u potpunosti. Nijedan osetljiv
podatak nije podeljen u logovima.

**Zahtev**: mehanizam za logovanje mora biti pouzdan, mora obezbediti
dostupnost i integritet log datoteka.

**Uspešnost**: ovaj zahtev nije dovoljno dobro ispunjen. Logovi su
čuvani lokalno, sa jednom kopijom koja se nalazila na računaru servera.
Ako izgubimo taj računar jedan, gubimo i logove i ne znamo šta se
desilo. Ako neko neautorizovano pristupi računaru imamo isti problem kao
i potencijal za povredu integriteta logova. Neko cloud rešenje bi bolje
radilo.

**Zahtev**: stavke log datoteke moraju precizno iskazati vreme nastanka.

**Uspešnost**: ovaj zahtev je ispunjen u potpunosti. Svaki log sadrži i
tačno vreme nastanka.

**Zahtev**: mehanizam za logovanje mora stremiti ka tome da su logovi
uredni, da je "pretrpanost" minimalizovana.

**Uspešnost**: ovaj zahtev nije dovoljno dobro ispunjen. Logovi su
organizovani po datumima unutar foldera i vremenu unutar fajla. Sve
vrste logova za sve korisnike se pamte unutar istog fajla za isti dan.
Ovo može biti veoma problematično sa rastom broja korisnika i tokom
pretrage akcija specifičnih korisnika ili specifičnih izvršenih akcija.
