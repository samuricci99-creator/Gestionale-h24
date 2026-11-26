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
chk(at(1,8,29,59)===false,"08:29:59 closed");
chk(at(1,8,30,0)===true,"08:30:00 open");
chk(at(1,18,30,0)===true,"18:30:00 open");
chk(at(1,18,30,59)===true,"18:30:59 open");
chk(at(1,18,31,0)===false,"18:31:00 closed");
chk(at(4,18,31,0)===false&&/lunedì/.test(el("cust").innerHTML),"friday evening reopens monday");
chk(at(5,11,0,0)===false,"saturday closed");
chk(at(0,11,0,0)===true,"monday open");
chk(el("mode")===undefined||!el("mode").textContent,"no simulator labels");
global.__tick();
console.log("CLOCK OK");
