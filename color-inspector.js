/* Color format adapter for diagnostics. It does not change palette generation. */
(function(root){
'use strict';
function normalizeColor(input){
 const text=String(input).trim();let value,format;
 if(!text)throw Error('Вставьте HEX или Android ColorInt.');
 if(/^(?:#|0x)?[0-9a-f]{16}$/i.test(text))throw Error('Это похоже на 64-битный Color.value. В Compose сначала вызовите color.toArgb().');
 const decimal=/^int:\s*([+-]?\d+)$/i.exec(text);
 const plainDecimal=/^[+-]?\d+$/.test(text);
 if(decimal||(plainDecimal&&(!/^\d{6}$|^\d{8}$/.test(text)))){
  const n=Number(decimal?decimal[1]:text);
  if(!Number.isInteger(n)||n< -2147483648||n>4294967295)throw Error('ColorInt должен помещаться в 32 бита.');
  value=n>>>0;format='ColorInt';
 }else{
  if(/^\d{6}$|^\d{8}$/.test(text))throw Error('Для HEX добавьте #, для десятичного числа — int:.');
  const match=/^(#|0x)?([0-9a-f]{6}|[0-9a-f]{8})$/i.exec(text);
  if(!match)throw Error('Используйте #RRGGBB, #AARRGGBB, 0xAARRGGBB или отрицательный ColorInt.');
  const h=match[2];value=parseInt(h.length===6?'FF'+h:h,16)>>>0;format=h.length===6?'RGB':'ARGB';
 }
 const alpha=value>>>24,r=(value>>>16)&255,g=(value>>>8)&255,b=value&255;
 const argb='#'+value.toString(16).padStart(8,'0').toUpperCase();
 return {rgb:'#'+argb.slice(3),argb,alpha,r,g,b,signedInt:value|0,unsignedInt:value,format};
}
function compareColor(input,expectedRgb){
 const parsed=normalizeColor(input),expected=normalizeColor(expectedRgb);
 const delta={r:parsed.r-expected.r,g:parsed.g-expected.g,b:parsed.b-expected.b,alpha:parsed.alpha-expected.alpha};
 delta.rgb=Math.max(Math.abs(delta.r),Math.abs(delta.g),Math.abs(delta.b));
 return {status:delta.rgb?'different':delta.alpha?'alpha-different':'match',parsed,expected,delta};
}
const api={normalizeColor,compareColor};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ColorInspector=api;
})(typeof globalThis!=='undefined'?globalThis:this);
