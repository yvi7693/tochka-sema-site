// Анимации появления: заголовки по словам, блоки снизу вверх, фото с приближением, параллакс видео.
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches||!('IntersectionObserver' in window))return;
const root=document.documentElement;root.classList.add('motion');
// Заголовки: каждое слово выезжает из-под маски с небольшой задержкой.
function split(node,state){[...node.childNodes].forEach(child=>{if(child.nodeType===3){const parts=child.textContent.split(/(\s+)/),frag=document.createDocumentFragment();parts.forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){frag.append(' ');return}const outer=document.createElement('span'),inner=document.createElement('span');outer.className='word';inner.textContent=part;inner.style.transitionDelay=`${state.i++*55}ms`;outer.append(inner);frag.append(outer)});child.replaceWith(frag)}else if(child.nodeType===1&&child.tagName!=='BR')split(child,state)})}
const headings=[...document.querySelectorAll('.hero-copy h1,main h2')];headings.forEach(h=>{split(h,{i:0});h.classList.add('split')});
// Блоки: появляются снизу, соседние элементы — по очереди.
const groups=['.hero-bottom>*','.scroll-hint','.event-viewport','.gallery-description>*','.menu-head>p','.kitchen-item','.menu-wide-cta','.gathering-copy>.eyebrow','.gathering-copy>p:not(.eyebrow)','.gathering-copy>.button','.steps-head .eyebrow','.steps-visual','.steps-list','.faq-heading>p','.faq details','.contact-grid>div>p:not(.hand-note)','#inquiry>*:not([hidden])','footer>*'];
const blocks=[];groups.forEach(sel=>document.querySelectorAll(sel).forEach((el,n)=>{el.classList.add('reveal');el.style.setProperty('--d',`${Math.min(n,6)*90}ms`);blocks.push(el)}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');observer.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
[...headings,...blocks].forEach(el=>observer.observe(el));
// После появления снимаем служебные классы, чтобы наведение работало без задержки.
blocks.forEach(el=>el.addEventListener('transitionend',e=>{if(e.target===el&&e.propertyName==='transform'&&el.classList.contains('is-in'))el.classList.remove('reveal','is-in')}));
// Первый экран анимируется сразу после загрузки.
requestAnimationFrame(()=>document.querySelectorAll('.hero-copy h1,.hero-bottom>*,.scroll-hint').forEach(el=>el.classList.add('is-in')));
// Параллакс видео в блоке атмосферы.
const video=document.querySelector('.gathering video'),section=document.querySelector('.gathering');let raf=0;
function parallax(){raf=0;const r=section.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=(r.top+r.height/2-innerHeight/2)/innerHeight;video.style.transform=`translate3d(0,${p*-60}px,0) scale(1.15)`}
if(video&&section){addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(parallax)},{passive:true});parallax()}
})();
