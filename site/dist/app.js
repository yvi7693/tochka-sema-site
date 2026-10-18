const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('[name=wishes]').value=b.dataset.event;document.querySelector('#contact').scrollIntoView({behavior:reduced.matches?'instant':'smooth'})}));
document.querySelector('#inquiry').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);document.querySelector('#request-text').value=`Хочу обсудить мероприятие.\nИмя: ${d.get('name')}\nКонтакт: ${d.get('contact')}\nДата: ${d.get('date')||'уточним'}\nГостей: ${d.get('guests')||'уточним'}\nПожелания: ${d.get('wishes')||'обсудим вместе'}`;document.querySelector('#form-result').hidden=false});document.querySelector('#copy').addEventListener('click',async e=>{const t=document.querySelector('#request-text');try{await navigator.clipboard.writeText(t.value);e.target.textContent='Скопировано ✓'}catch{t.select();e.target.textContent='Выделено — скопируйте текст'}});





(()=>{const blocks=document.querySelectorAll('.fire-steps'),reduce=matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches||!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});blocks.forEach(block=>{block.classList.add('reveal-ready');observer.observe(block)});reduce.addEventListener('change',()=>{if(reduce.matches)blocks.forEach(block=>block.classList.add('is-visible'))})})();

// Вкладки блока «У Сэма на огне»: клик или стрелки ←/→, Home/End переключают направление (паттерн ARIA tabs).
(()=>{
const list=document.querySelector('.menu-tablist');if(!list)return;
const tabs=[...list.querySelectorAll('[role=tab]')],panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
function select(i,focus){tabs.forEach((t,n)=>{const on=n===i;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;panels[n].classList.toggle('is-active',on);panels[n].hidden=!on});if(focus)tabs[i].focus()}
tabs.forEach((t,i)=>t.addEventListener('click',()=>select(i)));
list.addEventListener('keydown',e=>{const i=tabs.indexOf(document.activeElement);if(i<0)return;const next={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];if(next===undefined)return;e.preventDefault();select((next+tabs.length)%tabs.length,true)});
// Появление кнопок в духе Apple: когда ряд целиком на экране, кнопки по очереди въезжают сбоку на пружине
// (жёсткость 200, демпфирование 20 — как у точек в капсуле Apple) и быстро проявляются.
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
function springFrames(from,k,c){const frames=[],h=1/240;let x=1,v=0,t=0;while(t<3){for(let n=0;n<4;n++){v+=(-k*x-c*v)*h;x+=v*h;t+=h}frames.push(x);if(Math.abs(x)<.002&&Math.abs(v)<.002)break}frames.push(0);return{keyframes:frames.map(x=>({transform:`translateX(${(x*from).toFixed(2)}px)`})),duration:frames.length*1000/60}}
const intro=springFrames(72,200,20);list.classList.add('is-waiting');
const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;observer.disconnect();list.classList.remove('is-waiting');
tabs.forEach((t,n)=>{t.animate(intro.keyframes,{duration:intro.duration,delay:n*60,easing:'linear',fill:'backwards'});t.animate([{opacity:0},{opacity:1}],{duration:220,delay:n*60,easing:'ease-in',fill:'backwards'})})},{threshold:1});
observer.observe(list);
})();
