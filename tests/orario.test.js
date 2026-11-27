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

const chk=(c,l)=>{if(!c){console.log("FAIL",l);process.exit(1)}console.log("ok",l)};
const st=()=>el("status").textContent;
const at=(d,h,m,s)=>{globalThis.__clock(d,h*60+m,s);return /aperta/.test(st());};
// Lun-ven 9:00:00-12:59:59 e 14:00:00-18:59:59; sabato 9:00:00-14:59:59; domenica chiuso
chk(at(1,8,59,59)===false,"mar 08:59:59 chiuso");
chk(at(1,9,0,0)===true,"mar 09:00:00 aperto");
chk(at(1,12,59,59)===true,"mar 12:59:59 aperto");
chk(at(1,13,0,0)===false&&/oggi alle 14:00/.test(el("cust").innerHTML),"mar 13:00:00 pausa pranzo, riapre oggi alle 14:00");
chk(at(1,13,59,59)===false,"mar 13:59:59 chiuso");
chk(at(1,14,0,0)===true,"mar 14:00:00 aperto");
chk(at(1,18,59,59)===true,"mar 18:59:59 aperto");
chk(at(1,19,0,0)===false&&/domani alle 9:00/.test(el("cust").innerHTML),"mar 19:00:00 chiuso, riapre domani alle 9:00");
chk(at(1,10,0,0)&&/fino alle 13:00/.test(st()),"mattina: aperta fino alle 13:00");
chk(at(1,15,0,0)&&/fino alle 19:00/.test(st()),"pomeriggio: aperta fino alle 19:00");
chk(at(4,19,0,0)===false&&/domani alle 9:00/.test(el("cust").innerHTML),"venerdì sera riapre sabato alle 9:00");
chk(at(5,8,59,59)===false,"sab 08:59:59 chiuso");
chk(at(5,9,0,0)===true,"sab 09:00:00 aperto");
chk(at(5,13,0,0)===true,"sab 13:00 aperto (nessuna pausa)");
chk(at(5,14,59,59)===true&&/fino alle 15:00/.test(st()),"sab 14:59:59 aperto, fino alle 15:00");
chk(at(5,15,0,0)===false&&/lunedì alle 9:00/.test(el("cust").innerHTML),"sab 15:00:00 chiuso, riapre lunedì alle 9:00");
chk(at(6,0,0,0)===false&&at(6,9,0,0)===false&&at(6,12,0,0)===false&&at(6,16,0,0)===false&&at(6,23,59,59)===false,"domenica chiuso tutto il giorno");
chk(at(6,12,0,0)===false&&/domani alle 9:00/.test(el("cust").innerHTML),"domenica riapre lunedì (domani alle 9:00)");
chk(at(0,9,0,0)===true,"lunedì 09:00 aperto");
chk(el("mode")===undefined||!el("mode").textContent,"no simulator labels");
global.__tick();
console.log("CLOCK OK");
