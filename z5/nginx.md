# Analiza okruženja na kojem je pokrenuta *Enginx* aplikacija

-   Na serverskoj mašini je instaliran Ubuntu 22.04.4 LTS.
  
  ![](marko_screens/screen_linux_version.png)
-   SSH komunikacija sa serverom se autentifikuje uz pomoć ključeva
  
  ![](marko_screens/screen2_ssh_setup.png)
-   Aplikacija je pokrenuta i moguće joj je pristupiti sa host računara na portu 8

  ![](marko_screens/screen3_webapp.png)
-   Operativni sistem je LTS, što znači da je redovno ažuriran. Sistem radi malo jače od sat vremena, i
    u tom vremenu nije izdat nijedan *patch*.
  
  ![](marko_screens/screen4_info.png)
-   Format vremena je UTC i ne uzima u obzir pomeranje sata.
  
  ![](marko_screens/screen5_info.png)
-   Tokom instalacije je izabrana minimalna instalacija i nisu prihvaćeni nikakvi dodatni paketi. Naknadno su instalirani paketi potrebni za funkcionisanje aplikacije i pokretanje komandi iz ovog zadatka.
  
  ![](marko_screens/screen6_info.png)
-   Postavljena su samo podrayumevana *firewall* pravila, što nije optimalno
  
  ![](marko_screens/screen7_info.png)
-   Korektno konfigurisan podrazumevani *file sistem*
  
  ![](marko_screens/screen8_info.png)
-   Pristup osetljivim fajlovima u folderu je dozvoljen isklju;ivo root nalogu i sistemski generisanim ulogama.
  
  ![](marko_screens/screen9_tables.png)
-   *Setuid* fajlovi su validni i pristup im ima isključivo vlasnik sistema.
-   Samo root user ima uid 0.
  
  ![](marko_screens/screen10_perm_40.png)
-   Šifra za korisnika *linux* je hashovana sa SHA512 algoritmom koji nije najsigurniji
  
  ![](marko_screens/screen11_pass.png)
-   Lista procesa, uključujući i one vezane za nginx
  
  ![](marko_screens/screen12_procesi.png)
-   Udp i tcp procesi
  
  ![](marko_screens/screen13_tcp_udp_proccesses.png)
    
