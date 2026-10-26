/* APTS-MB-5: one mixing function with one shared curve and a fixed neutral scale.
   Encoded sRGB channels 0–255, integer rational coefficients, half-up rounding.
   Current source colors stay on 500. Thirteen utility colors remain fixed tokens.
   The existing Figma scales are references, not outputs of a proven authoring algorithm. */
(function(root){
'use strict';
const STEPS=[50,100,200,300,400,500,600,700,800,900];
const DENOMINATOR=1000000;
const ALPHAS=[.05,.1,.2,.3,.4,.5,.6,.7,.8,.9];
function rgb(value){if(typeof value!=='string'||value.length!==7||!/^#[0-9a-f]{6}$/i.test(value))throw new Error('Ожидается HEX в формате #RRGGBB');return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16));}
function hex(channels){return '#'+channels.map(v=>Math.max(0,Math.min(255,Math.floor(v+.5))).toString(16).padStart(2,'0')).join('').toUpperCase();}
const WEIGHTS=[48698,77660,156851,277217,617325,1000000,815154,675198,498326,319742];
function generateScale(base) {
 const channels=rgb(base);
 return Object.fromEntries(STEPS.map((step,i)=>{const k=WEIGHTS[i],t=step<500?255:0;return [step,hex(channels.map(c=>Math.floor((t*(DENOMINATOR-k)+c*k+DENOMINATOR/2)/DENOMINATOR)))];}));
}
function mobileTokens(data){
 const scales={},originals={},aliases={};
 for(const m of data.mobile){originals[m.name]={hex:m.hex,alpha:m.alpha};if(m.generateRamp!==false){scales[m.name]=Object.fromEntries(Object.entries(generateScale(m.hex)).map(([s,hex])=>[s,{hex,alpha:1}]));aliases[m.name]=m.name+'-500';}}
 scales['mb-neutral']=Object.fromEntries(Object.entries(data.sourceMobileNeutral).map(([s,hex])=>[s,{hex,alpha:1}]));
 const base={white:{hex:'#FFFFFF',alpha:1},black:{hex:'#000000',alpha:1}};
 const overlays=Object.fromEntries(['black','white'].map(kind=>['mb-overlay-'+kind,Object.fromEntries(STEPS.map((s,i)=>[s,{hex:base[kind].hex,alpha:ALPHAS[i]}]))]));
 return {scales,originals,aliases,base,overlays};
}
function cssColor(c){return c.alpha===1?c.hex:`rgb(${rgb(c.hex).join(' ')} / ${c.alpha})`;}
function cssTokens(data){const t=mobileTokens(data),lines=['/* APTS unified mobile palette. Source colors on 500; fixed utility tokens retain values. */',':root {'];for(const [name,scale]of Object.entries({...t.scales,...t.overlays}))for(const [s,c]of Object.entries(scale))lines.push(`  --${name}-${s}: ${cssColor(c)};`);for(const [name,c]of Object.entries(t.base))lines.push(`  --${name}: ${cssColor(c)};`);for(const [name,c]of Object.entries(t.originals))lines.push(`  --${name}: ${t.aliases[name]?`var(--${t.aliases[name]})`:cssColor(c)};`);lines.push('}');return lines.join('\n');}
function luminance(c){return rgb(c).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);}
function foreground(c){const l=luminance(c);return (l+.05)/.05>=1.05/(l+.05)?'#000000':'#FFFFFF';}
const api={WEIGHTS,generateScale,STEPS,DENOMINATOR,ALPHAS,rgb,hex,mobileTokens,cssColor,cssTokens,luminance,foreground};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.PaletteEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
