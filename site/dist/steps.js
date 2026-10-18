// Этапы работы: секция закреплена, прокрутка по очереди раскрывает три шага (как на zentry.com).
(()=>{
const section=document.querySelector('#process');if(!section)return;
const items=[...section.querySelectorAll('.step')],images=[...section.querySelectorAll('.steps-visual img')],reduce=matchMedia('(prefers-reduced-motion: reduce)');let active=-1,raf=0;
function set(i){if(i===active)return;active=i;items.forEach((item,n)=>{const on=n===i;item.classList.toggle('is-active',on);item.querySelector('.step-head').setAttribute('aria-expanded',String(on))});images.forEach((img,n)=>img.classList.toggle('active',n===i))}
function progress(){const run=section.offsetHeight-innerHeight;return run>0?Math.min(1,Math.max(0,-section.getBoundingClientRect().top/run)):0}
function update(){raf=0;section.classList.toggle('is-static',reduce.matches);if(reduce.matches){items.forEach(item=>item.style.setProperty('--fill',1));return}const p=progress()*items.length,i=Math.min(items.length-1,Math.floor(p));set(i);items.forEach((item,n)=>item.style.setProperty('--fill',n<i?1:n>i?0:Math.min(1,p-i)))}
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});addEventListener('resize',update);reduce.addEventListener('change',update);
items.forEach((item,n)=>item.querySelector('.step-head').addEventListener('click',()=>{if(reduce.matches){set(n);return}const run=section.offsetHeight-innerHeight;scrollTo({top:section.getBoundingClientRect().top+scrollY+run*(n+.05)/items.length,behavior:'smooth'})}));
set(0);update();
})();
