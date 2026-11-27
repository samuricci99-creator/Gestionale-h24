const fs=require('fs');
const els={};
function el(id){return els[id]||(els[id]={id,innerHTML:"",value:"",textContent:"",style:{},handlers:{},addEventListener(t,f){(this.handlers[t]=this.handlers[t]||[]).push(f)}});}
el("mac").value="0";el("op").value="Zona Nord";el("zf").value="";el("sf").value="";el("ff").value="";
global.document={getElementById:el,querySelector:()=>el(".sim")};
global.navigator={language:'it-IT'};global.T=eval(fs.readFileSync(''+__dirname+'/../i18n.js','utf8')+';T');el('lg').value='it';global.documentElement={};global.document.documentElement={};const js=fs.readFileSync(''+__dirname+'/.check.js','utf8');
global.setInterval=f=>{global.__tick=f;return 0};eval(js);el('lg').value='it';(el('lg').handlers.change||[]).forEach(f=>f({}));
function click(id,attrs){const btn={dataset:attrs,closest:s=>s==="button"||s==="[data-q]"&&attrs.q!==undefined?btn:null};
  (el(id).handlers.click||[]).forEach(f=>f({target:btn}));}
// KPI titolare sui dati di esempio: 6 segnalazioni, 1 risolta, 4 nuove, 17%.
// Tempi di presa in carico: Giulia 16 min (n. 4) e 13 min (n. 6) → media 14,5 → 15 min. Marco e Luca: nessun dato.
const k=globalThis.__kpi();
const ko=(c,l)=>{if(!c){console.log("FAIL",l,JSON.stringify(k));process.exit(1);}};
ko(k.tot===6,"chiamate totali 6");
ko(k.ok===1,"riuscite 1");
ko(k.wait===4,"in attesa 4");
ko(k.pct===17,"percentuale 17");
const g=k.ops.find(o=>o.nome==="Giulia"),mar=k.ops.find(o=>o.nome==="Marco"),lu=k.ops.find(o=>o.nome==="Luca");
ko(g.avg===15&&g.n===2,"Giulia 15 min su 2 prese");
ko(mar.avg===null&&mar.n===0,"Marco senza dati");
ko(lu.avg===null,"Luca senza dati");
console.log("TITOLARE OK");
