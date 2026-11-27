const fs=require('fs');
const els={};
function el(id){return els[id]||(els[id]={id,innerHTML:"",value:"",textContent:"",style:{},handlers:{},addEventListener(t,f){(this.handlers[t]=this.handlers[t]||[]).push(f)}});}
el("mac").value="0";el("op").value="Zona Nord";el("zf").value="";el("sf").value="";el("ff").value="";
global.document={getElementById:el,querySelector:()=>el(".sim")};
global.navigator={language:'it-IT'};global.T=eval(fs.readFileSync(''+__dirname+'/../i18n.js','utf8')+';T');el('lg').value='it';global.documentElement={};global.document.documentElement={};const js=fs.readFileSync(''+__dirname+'/.check.js','utf8');
global.setInterval=f=>{global.__tick=f;return 0};eval(js);el('lg').value='it';(el('lg').handlers.change||[]).forEach(f=>f({}));
function click(id,attrs){const btn={dataset:attrs,closest:s=>s==="button"||s==="[data-q]"&&attrs.q!==undefined?btn:null};
  (el(id).handlers.click||[]).forEach(f=>f({target:btn}));}
const cust=()=>el("cust").innerHTML;
const need=(s,label)=>{if(!cust().includes(s)){console.log("FAIL",label,cust().slice(0,300));process.exit(1);}console.log("ok",label);};
globalThis.__clock(1,1410);need("Assistenza chiusa","night banner at start");
need("Cosa è successo?","first question");
click("cust",{k:"prob",v:"Soldi trattenuti"});need("Come hai pagato?","pay step");
click("cust",{k:"pay",v:"Carta"});need("display mostra un errore","err step");
click("cust",{k:"err",v:"No, nessun messaggio"});need("Prima prova","try step");need("controlla se l&#39;addebito","card advice");
click("cust",{act:"next"});need("Quanto hai perso?","amt step");
click("cust",{k:"amt",v:"1.5"});need("Che prodotto volevi?","prod step");
click("cust",{act:"next"});need("Vuoi aggiungere una foto?","photo");
click("cust",{act:"next"});need("Consigliato","refund step with recommended");
click("cust",{k:"refund",v:"Rimborso sull'app"});need("Come ti ricontattiamo?","contact");
click("cust",{act:"send"});need("Lascia un telefono","validation contact");
(el("cust").handlers.input||[]).forEach(f=>f({target:{dataset:{k:"cn"},value:"333 123 4567",type:"text",selectionStart:12}}));
click("cust",{act:"send"});need("Serve il consenso","validation consent");
(el("cust").handlers.change||[]).forEach(f=>f({target:{dataset:{k:"priv"},checked:true,type:"checkbox"}}));
click("cust",{act:"send"});need("registrata","sent");need("riapre","night result text");need("Una persona verifica","verification step");
console.log("operator (night, queued?):",/dopo la chiusura/.test(el("notif").innerHTML)||/Nuova/.test(el("notif").innerHTML));
// switch to daytime
globalThis.__clock(1,660);
console.log("status:",el("status").textContent);
console.log("operator day shows night summary:",/Riepilogo della notte/.test(el("notif").innerHTML));
// danger flow
click("cust",{act:"again"});click("cust",{k:"prob",v:"Macchina guasta o pericolosa"});click("cust",{k:"danger",v:"Sì"});need("Allontanati","safe step");
click("cust",{act:"next"});need("Come ti ricontattiamo?","contact in danger flow");
(el("cust").handlers.input||[]).forEach(f=>f({target:{dataset:{k:"cn"},value:"333 123 4567",type:"text",selectionStart:12}}));
(el("cust").handlers.change||[]).forEach(f=>f({target:{dataset:{k:"priv"},checked:true,type:"checkbox"}}));
click("cust",{act:"send"});need("registrata","urgent sent");
console.log("kpi",el("mt").textContent,el("mf").textContent,el("me").textContent);

// language switching
const chg=v=>{el("lg").value=v;(el("lg").handlers.change||[]).forEach(f=>f({}));};
click("cust",{act:"again"});
chg("ro");need("Ce s-a întâmplat?","ro question");need("Aparatul mi-a reținut banii","ro option");
chg("ar");need("ماذا حدث؟","ar question");if(el("cust").dir!=="rtl"){console.log("FAIL rtl");process.exit(1)}
chg("de");if(el("cust").dir!=="ltr"){console.log("FAIL ltr");process.exit(1)}
// full flow in English, then check report lang
chg("en");click("cust",{k:"prob",v:"Prodotto non erogato"});click("cust",{k:"pay",v:"Carta"});click("cust",{k:"err",v:"No, nessun messaggio"});need("First, try these steps","en try");
click("cust",{act:"next"});click("cust",{k:"amt",v:"1"});click("cust",{act:"next"});click("cust",{act:"next"});need("Recommended","en rec");
click("cust",{k:"refund",v:"Rimborso sull'app"});need("Phone","en contact");click("cust",{k:"cm",v:"mail"});need("Email","mail mode");
(el("cust").handlers.input||[]).forEach(f=>f({target:{dataset:{k:"cmail"},value:"a@b.it",type:"text"}}));
click("cust",{act:"send"});need("Consent is required","en err");
(el("cust").handlers.change||[]).forEach(f=>f({target:{dataset:{k:"priv"},checked:true,type:"checkbox"}}));
click("cust",{act:"send"});need("registered","en sent");need("refund on the app","en refund in result");
if(!/English/.test(el("notif").innerHTML)&&!/English/.test(el("list").innerHTML)){console.log("FAIL lang tag");process.exit(1)}
// all languages have all keys
const ks=Object.keys(T.it).filter(k=>k!=="ops");let bad=0;for(const l in T){for(const k of ks)if(T[l][k]===undefined){console.log("missing",l,k);bad++}for(const o of Object.keys(T.en.ops))if(l!=="it"&&!T[l].ops[o]){console.log("missing op",l,o);bad++}}
if(bad){process.exit(1)}

// add machine flow
global.QR=eval('('+fs.readFileSync(''+__dirname+'/../qr.js','utf8').replace(/^const QR=/,'').replace(/;\s*$/,'')+')');
click("addm",{});if(!/f_code/.test(el("act").innerHTML)){console.log("FAIL form");process.exit(1)}
click("act",{gen:"1"});if(!/numero macchina/.test(el("f_err").textContent)){console.log("FAIL val code",el("f_err").textContent);process.exit(1)}
el("f_code").value="osp 03";click("act",{gen:"1"});if(!/senza spazi/.test(el("f_err").textContent)){console.log("FAIL val code2");process.exit(1)}
el("f_code").value="D-001";click("act",{gen:"1"});if(!/esiste già/.test(el("f_err").textContent)){console.log("FAIL dup code");process.exit(1)}
el("f_code").value="osp-03";click("act",{gen:"1"});if(!/matricola/.test(el("f_err").textContent)){console.log("FAIL val ser");process.exit(1)}
el("f_ser").value="SN-1";click("act",{gen:"1"});if(!/luogo/.test(el("f_err").textContent)){console.log("FAIL val luogo");process.exit(1)}
el("f_luogo").value="Ospedale San Marco";el("f_punto").value="Corridoio radiologia";el("f_zona").value="Zona Sud";el("f_gest").value="Vending Sud srl";el("f_tipo").value="Snack";
click("act",{gen:"1"});
if(!/abbinata: ecco il suo QR/.test(el("act").innerHTML)||!/<svg/.test(el("act").innerHTML)||!/OSP-03/.test(el("act").innerHTML)){console.log("FAIL result",el("act").innerHTML.slice(0,300));process.exit(1)}
console.log("ok machine added with QR");
need("Ospedale San Marco, Corridoio radiologia","customer sees new place");
if(!/OSP-03/.test(el("reg").innerHTML)){console.log("FAIL reg");process.exit(1)}
// duplicate serial
click("act",{add:"1"});el("f_code").value="OSP-04";el("f_ser").value="SN-1";el("f_luogo").value="Ospedale";el("f_punto").value="Piano 1";el("f_gest").value="X srl";click("act",{gen:"1"});
if(!/già abbinata/.test(el("f_err").textContent)){console.log("FAIL dup ser",el("f_err").textContent);process.exit(1)}
click("act",{no:"1"});
click("reg",{qr:"5"});if(!/OSP-03/.test(el("act").innerHTML)){console.log("FAIL show qr");process.exit(1)}
// report from new machine goes to Zona Sud
click("cust",{act:"again"});click("cust",{k:"prob",v:"Altro"});
(el("cust").handlers.input||[]).forEach(f=>f({target:{dataset:{k:"other"},value:"qualcosa non va",type:"text"}}));
click("cust",{act:"othergo"});click("cust",{act:"next"});
(el("cust").handlers.input||[]).forEach(f=>f({target:{dataset:{k:"cn"},value:"333 123 4567",type:"text",selectionStart:12}}));
(el("cust").handlers.change||[]).forEach(f=>f({target:{dataset:{k:"priv"},checked:true,type:"checkbox"}}));
click("cust",{act:"send"});need("registered","sent from new machine");
if(el("op").value!=="Zona Sud"){console.log("FAIL zone routing",el("op").value);process.exit(1)}
console.log("zone routing ok");
click("reset",{});
console.log("ALL OK");

