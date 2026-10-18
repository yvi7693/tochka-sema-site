// Анимации появления у нескольких акцентных элементов; у видео в блоке атмосферы — лёгкий параллакс.
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches||!('IntersectionObserver' in window))return;
const root=document.documentElement;root.classList.add('motion');
// Анимированы только акценты: первый экран, карточки меню, текст на видео «Ваш повод — наш огонь» и блок вопросов. Остальное показывается сразу.
const headings=[...document.querySelectorAll('.hero-copy h1')];headings.forEach(h=>h.classList.add('reveal'));
// Соседние элементы одной группы появляются по очереди.
const groups=['.hero-bottom>*','.kitchen-item','.gathering-copy'];
const blocks=[];groups.forEach(sel=>document.querySelectorAll(sel).forEach((el,n)=>{el.classList.add('reveal');el.style.setProperty('--d',`${Math.min(n,4)*60}ms`);blocks.push(el)}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');observer.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
[...headings,...blocks].forEach(el=>observer.observe(el));
// После появления снимаем служебные классы, чтобы наведение работало без задержки.
[...headings,...blocks].forEach(el=>el.addEventListener('transitionend',e=>{if(e.target===el&&e.propertyName==='transform'&&el.classList.contains('is-in'))el.classList.remove('reveal','is-in')}));
// Подстраховка: блоки, которые при резкой прокрутке проскочили выше экрана, показываются сразу.
let pending=0;addEventListener('scroll',()=>{if(pending)return;pending=requestAnimationFrame(()=>{pending=0;[...headings,...blocks].forEach(el=>{if(el.classList.contains('reveal')&&!el.classList.contains('is-in')&&el.getBoundingClientRect().bottom<0){el.classList.add('is-in');observer.unobserve(el)}})})},{passive:true});
// Первый экран анимируется сразу после загрузки.
requestAnimationFrame(()=>document.querySelectorAll('.hero-copy h1,.hero-bottom>*').forEach(el=>el.classList.add('is-in')));
// Параллакс видео в блоке атмосферы.
const video=document.querySelector('.gathering video'),section=document.querySelector('.gathering');let raf=0;
function parallax(){raf=0;const r=section.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=(r.top+r.height/2-innerHeight/2)/innerHeight;video.style.transform=`translate3d(0,${p*-24}px,0) scale(1.06)`}
if(video&&section){addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(parallax)},{passive:true});parallax()}
// Блок «Вопросы и ответы»: при первом появлении сначала подпись, заголовок и пояснение, затем вопросы —
// по очереди (через 70 мс) поднимаются на пружине (жёсткость 200, демпфирование 20), как этапы и кнопки меню.
const faq=document.querySelector('#faq');
if(faq){const parts=[...faq.querySelectorAll('.faq-heading>*'),...faq.querySelectorAll('details')];
const frames=[],h=1/240;let x=1,v=0,t=0;while(t<3){for(let n=0;n<4;n++){v+=(-200*x-20*v)*h;x+=v*h;t+=h}frames.push(x);if(Math.abs(x)<.002&&Math.abs(v)<.002)break}frames.push(0);
const rise=frames.map(x=>({transform:`translateY(${(x*40).toFixed(2)}px)`})),riseDuration=frames.length*1000/60;
faq.classList.add('is-waiting');
const faqObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;faqObserver.disconnect();faq.classList.remove('is-waiting');
parts.forEach((el,n)=>{el.animate(rise,{duration:riseDuration,delay:n*70,easing:'linear',fill:'backwards'});el.animate([{opacity:0},{opacity:1}],{duration:300,delay:n*70,easing:'ease-in',fill:'backwards'})})},{threshold:.3});
faqObserver.observe(faq.querySelector('.faq-grid'))}
})();
