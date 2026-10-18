const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('[name=wishes]').value=b.dataset.event;document.querySelector('#contact').scrollIntoView({behavior:reduced.matches?'instant':'smooth'})}));
document.querySelector('#inquiry').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);document.querySelector('#request-text').value=`Хочу обсудить мероприятие.\nИмя: ${d.get('name')}\nКонтакт: ${d.get('contact')}\nДата: ${d.get('date')||'уточним'}\nГостей: ${d.get('guests')||'уточним'}\nПожелания: ${d.get('wishes')||'обсудим вместе'}`;document.querySelector('#form-result').hidden=false});document.querySelector('#copy').addEventListener('click',async e=>{const t=document.querySelector('#request-text');try{await navigator.clipboard.writeText(t.value);e.target.textContent='Скопировано ✓'}catch{t.select();e.target.textContent='Выделено — скопируйте текст'}});





(()=>{const blocks=document.querySelectorAll('.fire-steps'),reduce=matchMedia('(prefers-reduced-motion: reduce)');if(reduce.matches||!('IntersectionObserver' in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});blocks.forEach(block=>{block.classList.add('reveal-ready');observer.observe(block)});reduce.addEventListener('change',()=>{if(reduce.matches)blocks.forEach(block=>block.classList.add('is-visible'))})})();

// «О чём часто спрашивают» как переписка с Сэмом. Вопросы и ответы берутся из обычного списка <details>
// (он остаётся для поиска и браузеров без JS): вопросы становятся кнопками-подсказками, ответ приходит «сообщением».
(()=>{
const faq=document.querySelector('#faq');if(!faq)return;
const items=[...faq.querySelectorAll('details')];if(!items.length)return;
const list=items[0].parentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)');
const qa=items.map(d=>({q:d.querySelector('summary').firstChild.textContent.trim(),a:d.querySelector('p').textContent.trim()}));
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
const avatar=cls=>{const n=el('span',cls,'С');n.setAttribute('aria-hidden','true');return n};
const chat=el('div','faq-chat'),head=el('div','faq-chat-head'),log=el('div','faq-log'),chips=el('div','faq-chips');
head.append(avatar('faq-avatar'));const who=el('div');who.append(el('strong','','Сэм'),el('span','','Точка Сэма'));head.append(who);
log.setAttribute('role','log');log.setAttribute('aria-live','polite');log.setAttribute('aria-label','Ответы Сэма');
chips.setAttribute('role','group');chips.setAttribute('aria-label','Выберите вопрос');
function message(from,text){const row=el('div','faq-msg faq-msg--'+from);if(from==='sam')row.append(avatar('faq-avatar faq-avatar--small'));row.append(el('p','faq-bubble',text));log.append(row);return row}
message('sam','Привет! Выберите вопрос — отвечу коротко и по делу.');
let busy=false;
qa.forEach(({q,a})=>{const b=el('button','faq-chip',q);b.type='button';b.addEventListener('click',()=>{if(busy)return;busy=true;b.remove();message('guest',q);
const typing=message('sam','');typing.classList.add('is-typing');const dots=typing.querySelector('.faq-bubble');dots.innerHTML='<i></i><i></i><i></i>';dots.setAttribute('aria-label','Сэм печатает');
const fromKeyboard=document.activeElement===b||document.activeElement===document.body;setTimeout(()=>{typing.remove();message('sam',a);busy=false;if(!chips.querySelector('.faq-chip')){const more=el('a','faq-chip faq-chip--more','Задать свой вопрос');more.href='#contact';chips.append(more)}if(fromKeyboard)chips.firstElementChild?.focus({preventScroll:true})},reduce.matches?0:700)});chips.append(b)});
chat.append(head,log,chips);list.hidden=true;list.after(chat);
})();
