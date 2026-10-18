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
// Первое появление этапов — как у вкладок меню: когда список на экране, этапы по очереди (через 90 мс)
// поднимаются на пружине (жёсткость 200, демпфирование 20) и проявляются до своей обычной яркости. Один раз.
if(!reduce.matches&&'IntersectionObserver' in window){
const list=section.querySelector('.steps-list');
function springFrames(from,k,c){const frames=[],h=1/240;let x=1,v=0,t=0;while(t<3){for(let n=0;n<4;n++){v+=(-k*x-c*v)*h;x+=v*h;t+=h}frames.push(x);if(Math.abs(x)<.002&&Math.abs(v)<.002)break}frames.push(0);return{keyframes:frames.map(x=>({transform:`translateY(${(x*from).toFixed(2)}px)`})),duration:frames.length*1000/60}}
const rise=springFrames(40,200,20);list.classList.add('is-waiting');
const intro=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;intro.disconnect();list.classList.remove('is-waiting');
items.forEach((item,n)=>{item.animate(rise.keyframes,{duration:rise.duration,delay:n*90,easing:'linear',fill:'backwards'});item.animate([{opacity:0},{opacity:item.classList.contains('is-active')?1:.4}],{duration:300,delay:n*90,easing:'ease-in',fill:'backwards'})})},{threshold:.6});
intro.observe(list)}
})();
