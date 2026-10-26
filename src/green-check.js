const C=ColorInspector;
let greenBase='#21C45D',greenExpected=E.generateScale(greenBase);
const greenReference=DATA.referenceScales.success.colors;
const developerValues=Object.fromEntries(E.STEPS.map(s=>[s,'']));
function greenTable(){
 $('checkRows').innerHTML=E.STEPS.map(step=>{const expected=C.normalizeColor(greenExpected[step]);const ref=greenReference[step];return `<tr class="${step===500?'base-step':''}"><th scope="row">${step}${step===500?'<br>база':''}</th><td><span class="table-color"><i class="table-dot" style="background:${ref}"></i><code>${ref}</code></span></td><td><span class="table-color"><i class="table-dot" style="background:${expected.rgb}"></i><code>${expected.rgb}</code></span></td><td><code>${expected.argb}</code><span class="color-int">Int: ${expected.signedInt}</span></td><td><input id="actual-${step}" aria-label="Ваш цвет ${step}" aria-describedby="result-${step}" autocomplete="off" spellcheck="false" placeholder="${expected.argb}" value="${escapeText(developerValues[step])}"></td><td><div id="result-${step}" class="result-text empty" role="status" aria-live="polite"></div></td></tr>`;}).join('');
 E.STEPS.forEach(step=>{const input=$('actual-'+step);input.addEventListener('input',()=>{developerValues[step]=input.value;compareGreenStep(step);});compareGreenStep(step);});
}
function compareGreenStep(step){
 const input=$('actual-'+step),result=$('result-'+step);const value=input.value.trim();input.setAttribute('aria-invalid','false');
 if(!value){result.className='result-text empty';result.textContent='Вставьте значение для проверки';return;}
 try{const comparison=C.compareColor(value,greenExpected[step]),p=comparison.parsed;result.className='result-text '+(comparison.status==='match'?'pass':comparison.status==='alpha-different'?'partial':'fail');
 let text;if(comparison.status==='match')text='Совпадает: RGB и прозрачность одинаковые';else if(comparison.status==='alpha-different')text=`RGB совпадает; прозрачность ${p.alpha}/255 вместо 255/255`;else{text=step===500?'Другая база 500. Сверьте исходный HEX.':`Не совпадает. ΔR ${comparison.delta.r}, ΔG ${comparison.delta.g}, ΔB ${comparison.delta.b}.`;if(p.alpha!==255)text+=` Прозрачность: ${p.alpha}/255.`;}
 result.textContent=text;const normalized=document.createElement('div');normalized.className='result-color';const dot=document.createElement('i');dot.className='table-dot';dot.style.background=p.rgb;normalized.append(dot,document.createTextNode(p.argb));result.append(normalized);
 }catch(error){input.setAttribute('aria-invalid','true');result.className='result-text fail';result.textContent=error.message;}
}
function updateGreenCheck(){
 try{const base=C.normalizeColor($('checkBase').value);if(base.alpha!==255)throw Error('Для базы нужен непрозрачный цвет: AA = FF.');greenBase=base.rgb;greenExpected=E.generateScale(greenBase);$('checkBase').setAttribute('aria-invalid','false');$('checkBaseError').textContent='';$('checkResults').hidden=false;$('downloadCheck').disabled=false;
 const value=C.normalizeColor(greenBase);$('greenFormatExample').innerHTML=`<i class="format-preview" style="background:${greenBase}"></i><span>${value.rgb}</span><span>=</span><span>${value.argb}</span><span>= Int ${value.signedInt}</span>`;
 const same=greenBase==='#21C45D';const swift=same?'let shades = try APTSPalette.generate(name: "mb-correct")':`let shades = try APTSPalette.generate(hex: "${greenBase}")`;
 const kotlin=same?'val shades = AptsPalette.generate("mb-correct")':`val shades = AptsPalette.generateFromHex("${greenBase}")`;
 $('greenSwift').innerHTML=highlight(swift+'\nlet hexRgb = shades[500]');$('greenKotlin').innerHTML=highlight('import android.graphics.Color\nimport java.util.Locale\n\n'+kotlin+'\nval argb = Color.parseColor(shades.getValue(500))\nval hexArgb = String.format(Locale.ROOT, "#%08X", argb)');$('differentBaseNote').hidden=same;greenTable();
 }catch(error){$('checkBase').setAttribute('aria-invalid','true');$('checkBaseError').textContent=error.message;$('checkResults').hidden=true;$('downloadCheck').disabled=true;}
}
$('checkBase').addEventListener('input',updateGreenCheck);
function resetGreenCheck(){$('checkBase').value='#21C45D';for(const step of E.STEPS)developerValues[step]='';updateGreenCheck();$('checkBase').focus();}
function downloadGreenCheck(){const rows=Object.fromEntries(E.STEPS.map(step=>{const c=C.normalizeColor(greenExpected[step]);return [step,{rgb:c.rgb,argb:c.argb,colorInt:c.signedInt,figma:greenReference[step]}];}));download(JSON.stringify({token:'mb-correct',base:greenBase,algorithm:DATA.algorithm.version,androidHexOrder:'AARRGGBB',colors:rows},null,2),'mb-correct-control.json','application/json');}

updateGreenCheck();
function keyboardTabs(container,select){const buttons=[...container.querySelectorAll('[role=tab]')];container.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;const index=buttons.indexOf(document.activeElement);if(index<0)return;let next;if(event.key==='ArrowRight')next=(index+1)%buttons.length;if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;if(next!==undefined){event.preventDefault();select(buttons[next]);buttons[next].focus();}});}
keyboardTabs(document.querySelector('.tabs'),button=>button.click());keyboardTabs(document.querySelector('.code-tabs'),button=>button.click());
const initialTab=location.hash.slice(1);if(['palette','how','check','comparison','sources'].includes(initialTab))show(initialTab);
