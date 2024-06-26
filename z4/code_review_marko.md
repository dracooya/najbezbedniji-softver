# **Aplikacija za potpisivanje elektronskih sertifikata**

Tech Stack

Backend:

- Java
- Spring Boot

Frontend:

- Angular (koristeći material)

# **Opis**

Fokus ovog projekta je bio kreiranje softvera za potpisivanje digitalnih sertifikata sa akcentom na bezbednosti. Sa ovim u vidu, nije bio očekivan ogroman broj propusta u bezbednosti. Ovo je bila pogrešna pretpostavka. Najverovatniji razlog propustima je to što se razvojni tim prvi put sretao sa ovakvim problemima i na nevešt način se izborio sa njima.

Aplikacija je namenjena za tri vrste korisnika:

1. **Neregistrovani korisnici** - Imaju veoma ograničen skup funkcionalnosti, većinom je fokus bio na registrovanim korisnicima.
2. **Registrovani korisnici** \- Ovi korisnici mogu da pregledaju svoje sertifikate. Mogu da vide javne sertifikate drugih korisnika, i root sertifikate. Mogu da podnose zahteve za kreiranje end sertifikata. Mogu da dobiju pristup svojim sertifikatima i da ih sačuvaju lokalno.
3. **Administratori** \- Poseduju root sertifikate. Imaju uvid u registrovane korisnike i njihove sertifikate. Imaju pregled zahteva za kreiranje sertifikata. Imaju mogućnost da prihvate ili odbiju kreiranje sertifikata.

Članovi razvojnog tima

- Maja Varga SV54/2020
- Marko Milijanović SV56/2020
- Vuk Radmilović SV73/2020

# **Defekti**

- **Nedostatak autorizacije u endpointima**:
  - Postoji ogroman broj endpointova koji nemaju pravilno odrađenu autorizaciju. Postoje čak i neki endpointovi koji su duplikati, gde postoji i verzija sa autorizacijom i bez autorizacije, i moguće je koristiti i jednu i drugu. Između ostalog ovo je zbog toga što se projekat radio i za angular frontend i za mobilnu aplikaciju, gde je negde korišćen JWT token a negde ne, i gde je to sve na kraju usklađeno na veoma nebezbedan način. Zbog ovoga je izložena ogromna količina privatnih podataka i cela aplikacija je kompromitovana
  - **Preporuka**: Implementirati mehanizme autorizacije za sve endpointe kako bi se osiguralo da samo autorizovani korisnici mogu pristupiti svojim privatnim informacijama.
- **Mail i lozinka za slanje mailova su izloženi**
  - Osetljivi podaci poput maila i lozinke za slanje mailova su izloženi riziku jer su hardkodovani u konfiguracionom fajlu application.properties, umesto da se čuvaju kao environment varijable.
  - **Preporuka**: Premestiti osetljive podatke (mail i lozinka) iz application.properties u environment varijable radi bolje sigurnosti.
- **Secret za JWT izložen**
  - JWT token je hardkodovan i lako je doći do njega.
  - **Preporuka**: JWT treba čuvati u environment variabli ili uz pomoć eksterne aplikacije.
- **Linter**
  - Korišćen je MegaLinter.
  - Linter je otkrio različite probleme sa stilom koda kao što su nekonzistentnost u razmacima, imenovanju, nekorišćenje readonly ključne reči kad god je to moguće.
    - **Preporuka**: Koristiti lintere sa jasnim pravilima i bilo dozvoljavati im da prave promene u kodu ili ispratiti njihove preporuke.
  - Čuvanje šifre za bazu u kogu.
    - Ista preporuka kao i za JWT
  - Linter je uoćio da je oko 12% koda duplirano, što smanjuje čitljivost i otežava održavanje.
    - **Preporuka**: Refaktorisati kod kako bi se eliminisali duplikati i nepotrebne verzije fajlova. Koristiti principe DRY (Don't Repeat Yourself) i SOLID kako bi se poboljšala modularnost i čitljivost koda.

![](repeat.png)

  -Na frontu je pronađen određeni broj orphan tagova.
    - **Preporuka** Obratiti veću pažnju pri pisanju fronta
  - Takođe je pronašao leak tajni na gitu, u jednom trenutku je tajna bila commitovana na git
    - **Preporuka** Kao i za JWT
  -  Mnoge stilske greške kao što su neiskorišćeni importi, nedostaju dokumentacije, linije koda su predugačke, imena promenljivih i funkcija su nekonzistentna, a magični brojevi se koriste direktno u kodu.
    - **Preporuka**: Ostaviti vreme za refaktorisanje koda.

![](vulnerabilities3.png)

# **Vreme**

- Ovaj projekat je analizirao Marko Milijanović za oko 3 sata
