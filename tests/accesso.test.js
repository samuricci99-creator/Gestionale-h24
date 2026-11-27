const fs=require('fs');
const els={};
function el(id){return els[id]||(els[id]={id,innerHTML:"",value:"",textContent:"",style:{},handlers:{},addEventListener(t,f){(this.handlers[t]=this.handlers[t]||[]).push(f)}});}
el("mac").value="0";el("op").value="Zona Nord";el("zf").value="";el("sf").value="";el("ff").value="";
global.document={getElementById:el,querySelector:()=>el(".sim")};
global.navigator={language:'it-IT'};global.T=eval(fs.readFileSync(''+__dirname+'/../i18n.js','utf8')+';T');el('lg').value='it';global.documentElement={};global.document.documentElement={};const js=fs.readFileSync(''+__dirname+'/.check.js','utf8');
global.setInterval=f=>{global.__tick=f;return 0};eval(js);el('lg').value='it';(el('lg').handlers.change||[]).forEach(f=>f({}));
function click(id,attrs){const btn={dataset:attrs,closest:s=>s==="button"||s==="[data-q]"&&attrs.q!==undefined?btn:null};
  (el(id).handlers.click||[]).forEach(f=>f({target:btn}));}
// Test della logica di accesso (login simulato e permessi per ruolo).
const A=globalThis.__auth;
let fail=0;const check=(c,l)=>{if(!c){console.log("FAIL",l);fail=1;}};
(async()=>{
  const ok=async(u,p)=>{try{return await A.Auth.signIn(u,p);}catch(e){return null;}};
  check(await ok("titolare","sbagliata")===null,"password errata rifiutata");
  check(await ok("sconosciuto","demo-titolare")===null,"utente sconosciuto rifiutato");
  check(await ok("  MARCO.NORD ","demo-nord")!==null,"utente senza maiuscole e spazi accettato");
  const t=await ok("titolare","demo-titolare");check(t&&t.ruolo==="titolare","ruolo titolare riconosciuto");
  const want={titolare:["operatore","centro","campo"],operatore:["operatore","campo"],centro:["centro"]};
  for(const r in want)for(const v of ["operatore","centro","campo"])check(A.canSee(r,v)===want[r].includes(v),r+" → "+v);
  check(!A.canSee("inventato","centro"),"ruolo sconosciuto senza accesso");
  check(A.ACCOUNTS.every(a=>A.ROLES[a.ruolo]),"ogni account ha un ruolo definito");
  console.log(fail?"ACCESS FAIL":"ACCESS OK");
  if(fail)process.exit(1);
})();
