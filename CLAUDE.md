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
- Assistenza aperta (fuso Europe/Rome, orario reale, controllo ogni secondo): lun-ven 8:59:59-12:00:59 e 13:59:59-18:00:59; sabato 8:59:59-14:00:59; domenica chiusa tutto il giorno. La pausa a metà giornata conta come chiusura. Nei testi: apre "alle 9:00" / "alle 14:00", chiude "alle 12:00" / "18:00" / sabato "14:00". Festivi NON gestiti. Fasce definite in `SLOTS` (`index.html`); gli orari nei testi sono parametri `{t}` in `i18n.js`.
- Di notte il servizio aiuta comunque il cliente con domande standard e consigli (flusso guidato). Le segnalazioni notturne arrivano all'operatore come riepilogo al mattino, tranne quelle urgenti (pericolo: fumo, scintille, acqua).
- Flusso cliente guidato: problema -> (pagamento, errore display, consigli "prova prima questi passaggi" con uscita "ha funzionato" per evitare falsi allarmi) -> importo -> prodotto -> foto -> rimborso -> contatto.
- Rimborso: tre scelte. "Rimborso sull'app" è proposto e segnato "Consigliato" (previa verifica di una persona con telecamere o altri sistemi), "Monete dal distributore" (accordo con l'operatore di zona), "Solo segnalazione".
- Contatto: telefono (prefisso a scelta, cifre massime per paese, spazi automatici) oppure email validata. Sempre obbligatorio (deciso da Samuele): serve per mandare al cliente il link di stato.
- Fine segnalazione: "Grazie per la tua segnalazione. La valuteremo al più presto e ti aggiorneremo." e avviso che è partito un SMS o un'email con il link di stato (`tuodominio.it/t/<numero>-<codice>`; nel prototipo l'invio è simulato e il link apre la pagina `#t-<numero>-<codice>`, che mostra lo stato senza altre verifiche). Il codice casuale rende il link non indovinabile.
- Zone/operatori: Nord (Marco), Centro (Giulia), Sud (Luca) di esempio. Ogni operatore vede solo la sua zona.
- Operatore di zona e operatore sul campo sono la stessa persona: una sola schermata "Operatore" con due sezioni, Segnalazioni (notifiche della sua zona) e Macchine (solo le macchine della sua zona, con segnalazioni aperte, QR, prova scansione e "Aggiungi macchina" con la sua zona già scelta). Schede in alto: Cliente, Operatore, Centro assistenza (il vecchio link `#campo` apre Operatore > Macchine).
- Flusso intervento: l'operatore prende in carico e vede la scheda (dove si trova la macchina: luogo, come trovarla, matricola, gestore; cosa ha segnalato il cliente; recapito). Sul posto compila il "rapporto di intervento": causa (elenco CAUSE), cosa ha fatto, esito (risolto / serve un altro intervento), rimborso (dovuto per errore della macchina con importo confermato, già dato sul posto in monete, non dovuto con motivo). Risolto = segnalazione chiusa. L'esito si sceglie per primo; con "Non risolto" si scrive solo il perché (obbligatorio) più note facoltative, senza causa né rimborso: il lavoro resta "In lavorazione" e il rimborso si decide al rapporto successivo. Le scelte a spunta si tolgono toccandole di nuovo. Dopo "Prendo in carico" si può tornare indietro: avviso con "Annulla" e pulsante "Annulla presa in carico" sulla scheda (finché non c'è un rapporto); la segnalazione torna tra le nuove. Il rapporto si compila in una schermata a parte (si apre con "Sono sul posto", sostituisce la lista, "‹ Da fare" per tornare, bozza conservata, pulsante "Invia al centro assistenza" sempre visibile in basso).
- Barra di stato a passaggi (come il tracciamento di un pacco) su ogni lavoro: Richiesta, Presa in carico, In lavorazione ("Sono sul posto"), Lavoro eseguito (rapporto con esito risolto), con l'orario di ogni passaggio. La vedono l'operatore (in cima alla scheda), il centro (nel dettaglio) e il cliente (dopo l'invio, tradotta, si aggiorna da sola). L'operatore ha solo la sua schermata: niente scheda Cliente né barra delle schede.
- Cliente: "Segui la tua segnalazione" in cima alla prima domanda. Mostra "Le tue segnalazioni" inviate da quel telefono (in memoria) e una ricerca per numero; se la segnalazione ha un recapito, serve anche il telefono o l'email usati. La scheda mostra la barra di stato e lo stato del rimborso (in verifica, emesso, nessuno, da decidere dopo il tecnico). Tradotto in 10 lingue.
- Schermata Titolare (solo ruolo titolare, prima scheda): chiamate totali (= segnalazioni ricevute), riuscite (= risolte), in attesa (= nuove, nessuno le ha prese), percentuale riuscite, e tempo di risposta medio per operatore (da arrivo `t` a presa in carico `ts[1]`, in minuti). Calcolo in `kpiTit()`; test in `tests/titolare.test.js`.
- Il centro assistenza emette i rimborsi: legge rapporto e segnalazione, poi "Rimborso emesso" oppure "Non rimborsare" con motivo da comunicare al cliente. Filtro e contatori "Rimborsi da emettere". Prima del rapporto non si rimborsa.
- Macchina: il QR contiene solo l'indirizzo con il codice macchina (es. https://tuodominio.it/s/OSP-03), nessun dato personale. Il GPS non si usa.
- Flusso "Aggiungi macchina" (operatore sul campo): numero macchina, matricola, luogo, punto preciso, zona, gestore, tipo, note -> "Genera QR code" -> adesivo pronto + prova scansione. Controlli: codice e matricola unici.

## Convenzioni tecniche della pagina
- Tutto in `index.html`; script inline dentro un blocco `{ ... }`; eventi per delega; nessun `alert/confirm`.
- Stile pulito tra Apple e Revolut, un solo foglio di stile coerente in testa a `index.html` (nessuna sovrascrittura a strati): pagina bianco sporco morbido (#f3f3f0, non accecante), gruppi su grigio caldo (#e9e9e5), superfici interne quasi bianche (#fafaf8), pulsanti a pillola blu (#0071e3), avvisi e banner bianchi con contorno scuro sottile e icona in un cerchio colorato chiaro, font di sistema (SF su Apple, Inter altrove). Solo tema chiaro, scelto di proposito; niente `light-dark()`. Pulsanti >=44px.
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
