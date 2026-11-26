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


let last="";
const inp=(k,v)=>{const tg={dataset:{k},value:v,type:"text",selectionStart:v.length};(el("cust").handlers.input||[]).forEach(f=>f({target:tg}));last=tg.value;return tg.value;};
const sel=(k,v)=>(el("cust").handlers.change||[]).forEach(f=>f({target:{dataset:{k},value:v}}));
const shown=()=>{const m=cust().match(/data-k="cn"[^>]*value="([^"]*)"/);return m?m[1]:null;};
const chk=(c,l)=>{if(!c){console.log("FAIL",l);process.exit(1)}console.log("ok",l)};
globalThis.__clock(1,1410);click("cust",{k:"prob",v:"Altro"});
inp("other","qualcosa non va");click("cust",{act:"othergo"});click("cust",{act:"next"});
chk(/IT \+39/.test(cust())&&/RO \+40/.test(cust()),"prefix list");
chk(inp("cn","33312345678999")==="333 123 4567","IT mobile capped to 10");
chk(inp("cn","0212345678999").replace(/\D/g,"").length===10,"IT landline capped: "+last);
chk(inp("cn","33a3-12")==="333 12","non digits stripped");
sel("cp","40");chk(inp("cn","722123456789").replace(/\D/g,"").length===9,"RO capped to 9: "+last);
sel("cp","39");inp("cn","3331234567");sel("cp","40");chk(shown().replace(/\D/g,"").length===9,"prefix switch trims: "+shown());
sel("cp","39");inp("cn","33312");
(el("cust").handlers.change||[]).forEach(f=>f({target:{dataset:{k:"priv"},checked:true,type:"checkbox"}}));
click("cust",{act:"send"});need("non è completo","incomplete number error");
inp("cn","3331234567");click("cust",{act:"send"});need("registrata","complete accepted");
console.log("PHONE OK");
