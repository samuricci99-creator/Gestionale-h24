# Assistenza distributori (prototipo)

Servizio per distributori automatici: il cliente scansiona un QR sulla macchina e segnala un problema.
Il sistema riconosce macchina, zona e operatore dal codice nel QR, e avvisa l'operatore di zona.
Lingua di lavoro con l'autore (Samuele): italiano.

## Stato
Prototipo funzionante in una sola pagina (`index.html`) + due script:
- `i18n.js`: traduzioni del percorso cliente in 10 lingue (it, en, es, fr, de, ro, sq, ar [RTL], uk, zh). Traduzioni mie, da far rivedere a madrelingua (privacy e rimborso soprattutto).
- `qr.js`: generatore QR autonomo (byte mode, correzione M, versioni 1-6). Verificato con un lettore indipendente (OpenCV).
- Era pubblicato come artifact privato su claude.ai (slug bf925e02-5246-44fe-a778-11670afcc8fc). I dati vivono solo in memoria: si perdono ricaricando.

Test: `./tests/run.sh` (solo Node, nessuna dipendenza). Il simulatore dell'orario è stato tolto dall'interfaccia; i test usano `globalThis.__clock(giorno, minuti, secondi)`.

## Regole di prodotto già decise
- Gestore = titolare dei dati; Samuele = fornitore. Dati raccolti: solo contatto per il rimborso, niente IBAN.
- Assistenza aperta lun-ven 8:30:00-18:30:59 (fuso Europe/Rome, orario reale, controllo ogni secondo). Weekend = come la notte. Festivi NON gestiti.
- Di notte il servizio aiuta comunque il cliente con domande standard e consigli (flusso guidato). Le segnalazioni notturne arrivano all'operatore come riepilogo al mattino, tranne quelle urgenti (pericolo: fumo, scintille, acqua).
- Flusso cliente guidato: problema -> (pagamento, errore display, consigli "prova prima questi passaggi" con uscita "ha funzionato" per evitare falsi allarmi) -> importo -> prodotto -> foto -> rimborso -> contatto.
- Rimborso: tre scelte. "Rimborso sull'app" è proposto e segnato "Consigliato" (previa verifica di una persona con telecamere o altri sistemi), "Monete dal distributore" (accordo con l'operatore di zona), "Solo segnalazione".
- Contatto: telefono (prefisso a scelta, cifre massime per paese, spazi automatici) oppure email validata. Obbligatorio solo se si chiede il rimborso.
- Zone/operatori: Nord (Marco), Centro (Giulia), Sud (Luca) di esempio. Ogni operatore vede solo la sua zona.
- Operatore di zona e operatore sul campo sono la stessa persona: una sola schermata "Operatore" con due sezioni, Segnalazioni (notifiche della sua zona) e Macchine (solo le macchine della sua zona, con segnalazioni aperte, QR, prova scansione e "Aggiungi macchina" con la sua zona già scelta). Schede in alto: Cliente, Operatore, Centro assistenza (il vecchio link `#campo` apre Operatore > Macchine).
- Flusso intervento: l'operatore prende in carico e vede la scheda (dove si trova la macchina: luogo, come trovarla, matricola, gestore; cosa ha segnalato il cliente; recapito). Sul posto compila il "rapporto di intervento": causa (elenco CAUSE), cosa ha fatto, esito (risolto / serve un altro intervento), rimborso (dovuto per errore della macchina con importo confermato, già dato sul posto in monete, non dovuto con motivo). Risolto = segnalazione chiusa. Dopo "Prendo in carico" si può tornare indietro: avviso con "Annulla" e pulsante "Annulla presa in carico" sulla scheda (finché non c'è un rapporto); la segnalazione torna tra le nuove. Il rapporto si compila in una schermata a parte (si apre con "Sono sul posto", sostituisce la lista, "‹ Da fare" per tornare, bozza conservata, pulsante "Invia al centro assistenza" sempre visibile in basso).
- Il centro assistenza emette i rimborsi: legge rapporto e segnalazione, poi "Rimborso emesso" oppure "Non rimborsare" con motivo da comunicare al cliente. Filtro e contatori "Rimborsi da emettere". Prima del rapporto non si rimborsa.
- Macchina: il QR contiene solo l'indirizzo con il codice macchina (es. https://tuodominio.it/s/OSP-03), nessun dato personale. Il GPS non si usa.
- Flusso "Aggiungi macchina" (operatore sul campo): numero macchina, matricola, luogo, punto preciso, zona, gestore, tipo, note -> "Genera QR code" -> adesivo pronto + prova scansione. Controlli: codice e matricola unici.

## Convenzioni tecniche della pagina
- Tutto in `index.html`; script inline dentro un blocco `{ ... }`; eventi per delega; nessun `alert/confirm`.
- Stile misto Apple + Revolut: base bianca, schede grigio chiaro molto arrotondate, pulsanti a pillola neri (bianchi di notte), banner con icona in un cerchio colorato, avviso scuro con "Annulla", font di sistema (SF su Apple, Inter altrove), barra in alto traslucida con le schede a controllo segmentato. Sfondo sempre bianco: tema chiaro forzato anche se il telefono è in modalità scura (le variabili `light-dark()` restano, pronte se un giorno si vuole la modalità scura); pulsanti >=44px.
- Testi del cliente passano da `tr(chiave)` e `ot(valoreItaliano)`. Le risposte si salvano con i valori italiani canonici (es. "Soldi trattenuti"), solo la visualizzazione è tradotta. Operatore e pannello restano in italiano.
- Download del QR: nell'artifact serviva la capability `downloads`; fuori da claude.ai è un normale download di file.

## Da fare (in ordine consigliato)
1. Archivio dati vero (macchine, segnalazioni, operatori).
2. Notifiche reali all'operatore (SMS/WhatsApp/push) con conferma "preso in carico" ed escalation dopo X minuti.
3. Login e ruoli (operatore di zona, centro assistenza, gestore multi-cliente).
4. Codici QR non indovinabili (parte casuale nell'indirizzo) + limiti anti-spam.
5. Privacy: informativa, tempi di conservazione, cancellazione, accordo titolare/fornitore. Chiedere sempre a Samuele gli aspetti legali PRIMA di scrivere documenti, e preferire documenti minimali.
6. Segnalazioni doppie raggruppate; stati del rimborso (da verificare, approvato, pagato) con tetto di importo; link di stato per il cliente; traduzione automatica del testo libero per l'operatore; festività e orari per zona; stampa adesivi in blocco; statistiche.
7. Sostituire il dominio segnaposto `tuodominio.it` in `index.html` (costante `URLB`) prima di stampare adesivi veri.

## Aperto
- Esiste ancora una base Airtable "Assistenza Distributori – MVP" creata all'inizio e poi abbandonata. Non toccarla senza richiesta esplicita di Samuele.
