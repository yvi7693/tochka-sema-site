const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('[name=wishes]').value=b.dataset.event;document.querySelector('#contact').scrollIntoView({behavior:reduced.matches?'instant':'smooth'})}));
document.querySelector('#inquiry').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);document.querySelector('#request-text').value=`Хочу обсудить мероприятие.\nИмя: ${d.get('name')}\nКонтакт: ${d.get('contact')}\nДата: ${d.get('date')||'уточним'}\nГостей: ${d.get('guests')||'уточним'}\nПожелания: ${d.get('wishes')||'обсудим вместе'}`;document.querySelector('#form-result').hidden=false});document.querySelector('#copy').addEventListener('click',async e=>{const t=document.querySelector('#request-text');try{await navigator.clipboard.writeText(t.value);e.target.textContent='Скопировано ✓'}catch{t.select();e.target.textContent='Выделено — скопируйте текст'}});





(()=>{const blocks=document.querySelectorAll('.fire-steps'),reduce=matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches||!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});blocks.forEach(block=>{block.classList.add('reveal-ready');observer.observe(block)});reduce.addEventListener('change',()=>{if(reduce.matches)blocks.forEach(block=>block.classList.add('is-visible'))})})();

// Вкладки блока «У Сэма на огне»: клик или стрелки ←/→, Home/End переключают направление (паттерн ARIA tabs).
// Смена карточки — боковой сдвиг в духе Apple: старая уходит в сторону, новая въезжает с противоположной (фото, затем текст).
(()=>{
const list=document.querySelector('.menu-tablist');if(!list)return;
const tabs=[...list.querySelectorAll('[role=tab]')],panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls'))),reduce=matchMedia('(prefers-reduced-motion: reduce)'),ease='cubic-bezier(.16,1,.3,1)';let current=0;
function slide(panel,dir,incoming){if(reduce.matches)return;[panel.querySelector('figure'),panel.querySelector('.menu-panel-text')].forEach((el,n)=>{const far=(incoming?80:-40)*dir*(n?1.5:1);el.getAnimations().forEach(a=>a.cancel());el.animate(incoming?[{transform:`translateX(${far}px)`,opacity:0},{transform:'none',opacity:1}]:[{transform:'none',opacity:1},{transform:`translateX(${far}px)`,opacity:0}],incoming?{duration:750,delay:n*70,easing:ease,fill:'backwards'}:{duration:300,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'})})}
function select(i,focus,dir){if(i===current){if(focus)tabs[i].focus();return}dir=dir||(i>current?1:-1);const prev=current;current=i;
tabs.forEach((t,n)=>{const on=n===i;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;panels[n].classList.toggle('is-active',on);panels[n].hidden=!on});
slide(panels[prev],dir,false);slide(panels[i],dir,true);if(focus)tabs[i].focus()}
tabs.forEach((t,i)=>t.addEventListener('click',()=>select(i)));
list.addEventListener('keydown',e=>{const i=tabs.indexOf(document.activeElement);if(i<0)return;const step={ArrowRight:1,ArrowLeft:-1}[e.key],next={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];if(next===undefined)return;e.preventDefault();select((next+tabs.length)%tabs.length,true,step)});
})();
