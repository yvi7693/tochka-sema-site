// Анимации появления у нескольких акцентных элементов; у видео в блоке атмосферы — лёгкий параллакс.
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches||!('IntersectionObserver' in window))return;
const root=document.documentElement;root.classList.add('motion');
// Анимированы только акценты: первый экран и текст на видео «Ваш повод — наш огонь». Остальное показывается сразу.
const headings=[...document.querySelectorAll('.hero-copy h1')];headings.forEach(h=>h.classList.add('reveal'));
// Соседние элементы одной группы появляются по очереди.
const groups=['.hero-bottom>*','.gathering-copy'];
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
})();
