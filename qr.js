const QR=(()=>{
const EXP=[],LOG=[];
{let x=1;for(let i=0;i<255;i++){EXP[i]=x;LOG[x]=i;x<<=1;if(x&256)x^=285;}for(let i=255;i<512;i++)EXP[i]=EXP[i-255];}
const mul=(a,b)=>a&&b?EXP[LOG[a]+LOG[b]]:0;
const gen=n=>{let p=[1];for(let i=0;i<n;i++){const q=new Array(p.length+1).fill(0);for(let j=0;j<p.length;j++){q[j]^=p[j];q[j+1]^=mul(p[j],EXP[i]);}p=q;}return p;};
const rs=(data,n)=>{const g=gen(n),r=new Array(n).fill(0);for(const d of data){const f=d^r[0];r.shift();r.push(0);for(let i=0;i<n;i++)r[i]^=mul(g[i+1],f);}return r;};
const VER=[null,{e:10,b:[16],a:[]},{e:16,b:[28],a:[6,18]},{e:26,b:[44],a:[6,22]},{e:18,b:[32,32],a:[6,26]},{e:24,b:[43,43],a:[6,30]},{e:16,b:[27,27,27,27],a:[6,34]}];
function modules(text){
  const bytes=[...new TextEncoder().encode(text)];
  let v=1;
  for(;v<=6;v++){const dc=VER[v].b.reduce((a,b)=>a+b,0);if(bytes.length<=Math.floor((dc*8-12)/8))break;}
  if(v>6)throw new Error("Testo troppo lungo per il QR");
  const {e,b,a}=VER[v],dc=b.reduce((x,y)=>x+y,0),bits=[];
  const put=(val,len)=>{for(let i=len-1;i>=0;i--)bits.push((val>>>i)&1);};
  put(4,4);put(bytes.length,8);bytes.forEach(x=>put(x,8));
  put(0,Math.min(4,dc*8-bits.length));
  while(bits.length%8)bits.push(0);
  const data=[];
  for(let i=0;i<bits.length;i+=8){let x=0;for(let j=0;j<8;j++)x=x<<1|bits[i+j];data.push(x);}
  for(let p=0xEC;data.length<dc;p^=0xFD)data.push(p);
  let off=0;
  const blocks=b.map(k=>{const d=data.slice(off,off+k);off+=k;return d;}),ecs=blocks.map(d=>rs(d,e)),out=[];
  for(let i=0;i<Math.max(...b);i++)blocks.forEach(d=>{if(i<d.length)out.push(d[i]);});
  for(let i=0;i<e;i++)ecs.forEach(c=>out.push(c[i]));
  const n=17+4*v,M=[...Array(n)].map(()=>Array(n).fill(false)),F=[...Array(n)].map(()=>Array(n).fill(false));
  const set=(x,y,d)=>{M[y][x]=d;F[y][x]=true;};
  for(let i=0;i<n;i++){set(6,i,i%2==0);set(i,6,i%2==0);}
  const finder=(cx,cy)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=cx+dx,y=cy+dy;if(x>=0&&x<n&&y>=0&&y<n){const d=Math.max(Math.abs(dx),Math.abs(dy));set(x,y,d!=2&&d!=4);}}};
  finder(3,3);finder(n-4,3);finder(3,n-4);
  const al=a.length;
  for(let i=0;i<al;i++)for(let j=0;j<al;j++){
    if((i==0&&j==0)||(i==0&&j==al-1)||(i==al-1&&j==0))continue;
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(a[i]+dx,a[j]+dy,Math.max(Math.abs(dx),Math.abs(dy))!=1);
  }
  const fmt=mask=>{
    const d=mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);
    const bt=((d<<10)|r)^0x5412,g=i=>((bt>>>i)&1)==1;
    for(let i=0;i<=5;i++)set(8,i,g(i));
    set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));
    for(let i=9;i<15;i++)set(14-i,8,g(i));
    for(let i=0;i<8;i++)set(n-1-i,8,g(i));
    for(let i=8;i<15;i++)set(8,n-15+i,g(i));
    set(8,n-8,true);
  };
  fmt(0);
  let k=0;
  for(let right=n-1;right>=1;right-=2){
    if(right==6)right=5;
    for(let vert=0;vert<n;vert++)for(let j=0;j<2;j++){
      const x=right-j,up=((right+1)&2)==0,y=up?n-1-vert:vert;
      if(!F[y][x]&&k<out.length*8){M[y][x]=((out[k>>>3]>>>(7-(k&7)))&1)==1;k++;}
    }
  }
  const MF=[(x,y)=>(x+y)%2==0,(x,y)=>y%2==0,(x,y)=>x%3==0,(x,y)=>(x+y)%3==0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2==0,(x,y)=>x*y%2+x*y%3==0,(x,y)=>(x*y%2+x*y%3)%2==0,(x,y)=>((x+y)%2+x*y%3)%2==0];
  const apply=m=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!F[y][x]&&MF[m](x,y))M[y][x]=!M[y][x];};
  const pen=()=>{
    let r=0;
    const lines=get=>{for(let q=0;q<n;q++){let run=1;
      for(let i=1;i<n;i++){if(get(q,i)==get(q,i-1))run++;else{if(run>=5)r+=run-2;run=1;}}
      if(run>=5)r+=run-2;
      for(let i=0;i+11<=n;i++){let s="";for(let j=0;j<11;j++)s+=get(q,i+j)?"1":"0";if(s==="10111010000"||s==="00001011101")r+=40;}}};
    lines((q,i)=>M[q][i]);lines((q,i)=>M[i][q]);
    for(let y=0;y<n-1;y++)for(let x=0;x<n-1;x++){const c=M[y][x];if(c==M[y][x+1]&&c==M[y+1][x]&&c==M[y+1][x+1])r+=3;}
    let dk=0;M.forEach(row=>row.forEach(c=>{if(c)dk++;}));
    r+=(Math.ceil(Math.abs(dk*20-n*n*10)/(n*n))-1)*10;
    return r;
  };
  let best=0,bp=Infinity;
  for(let m=0;m<8;m++){apply(m);fmt(m);const p=pen();if(p<bp){bp=p;best=m;}apply(m);}
  apply(best);fmt(best);
  return M;
}
const svg=(text,size)=>{const M=modules(text),n=M.length;let d="";
  M.forEach((row,y)=>row.forEach((c,x)=>{if(c)d+=`M${x+2} ${y+2}h1v1h-1z`;}));
  return `<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="${size}" height="${size}" viewBox="0 0 ${n+4} ${n+4}" shape-rendering="crispEdges"><rect width="${n+4}" height="${n+4}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;};
return {modules,svg};
})();
