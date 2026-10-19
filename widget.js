(()=>{
const widget=document.querySelector('#callbackWidget'),form=widget.querySelector('form'),toggle=widget.querySelector('.callback-toggle'),contact=document.querySelector('#contact');let engaged=false,elapsed=false,nearContact=false,closed=false,done=false,forced=false;
// Закрытие и отправка больше не запоминаются между загрузками: убираем старые отметки, если они остались.
try{sessionStorage.removeItem('callback-closed');sessionStorage.removeItem('callback-done')}catch{}
function refresh(){widget.hidden=!(forced||(engaged&&elapsed&&!nearContact&&!closed&&!done))}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){engaged=true;refresh()}},{threshold:.15});['#menu','#approach'].forEach(s=>observer.observe(document.querySelector(s)));
new IntersectionObserver(entries=>{nearContact=entries[0].isIntersecting;refresh()},{threshold:0}).observe(contact);
setTimeout(()=>{elapsed=true;refresh()},10000);
// Крестик у раскрытой формы сворачивает её обратно в кнопку; у свёрнутой кнопки — скрывает виджет до перезагрузки страницы.
function collapse(){widget.classList.remove('expanded');toggle.setAttribute('aria-expanded','false');toggle.focus()}
widget.querySelector('.callback-close').addEventListener('click',()=>{if(widget.classList.contains('expanded')){collapse();return}closed=true;refresh()});
function expand(){widget.classList.add('expanded');toggle.setAttribute('aria-expanded','true');widget.querySelector('input').focus({preventScroll:true})}
toggle.addEventListener('click',expand);
// Кнопки «Обсудить мероприятие», «Собрать своё меню» и другие ссылки на форму открывают виджет вместо прокрутки к форме.
document.addEventListener('click',e=>{const link=e.target.closest('a[href="#contact"]');if(!link||link.closest('#contact'))return;e.preventDefault();if(!widget.hidden&&widget.classList.contains('expanded')){pulse();widget.querySelector('input').focus({preventScroll:true});return}forced=true;closed=false;done=false;refresh();expand()});
// Если форма уже открыта, повторное нажатие на кнопку не открывает её заново, а заставляет виджет «пульсировать», чтобы его заметили.
function pulse(){const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;widget.getAnimations().forEach(a=>a.cancel());
widget.animate(calm?[{boxShadow:'0 12px 48px #0003, 0 0 0 0 rgba(194,65,12,0)'},{boxShadow:'0 12px 48px #0003, 0 0 0 4px rgba(194,65,12,.6)'},{boxShadow:'0 12px 48px #0003, 0 0 0 0 rgba(194,65,12,0)'}]:
[{transform:'scale(1)',boxShadow:'0 12px 48px #0003, 0 0 0 0 rgba(194,65,12,.55)'},{transform:'scale(1.035)',boxShadow:'0 12px 48px #0003, 0 0 0 10px rgba(194,65,12,.25)',offset:.35},{transform:'scale(.99)',offset:.65},{transform:'scale(1)',boxShadow:'0 12px 48px #0003, 0 0 0 18px rgba(194,65,12,0)'}],{duration:calm?700:650,easing:'cubic-bezier(.215,.61,.355,1)',iterations:calm?1:2})}
widget.addEventListener('keydown',e=>{if(e.key==='Escape'&&widget.classList.contains('expanded'))collapse()});
form.addEventListener('submit',async e=>{e.preventDefault();const data=new FormData(form),phone=String(data.get('phone')).trim();if(phone.replace(/\D/g,'').length<10){form.elements.phone.setCustomValidity('Введите номер телефона полностью');form.elements.phone.reportValidity();return}const value=`Хочу обсудить событие.\nИмя: ${data.get('name')}\nТелефон: ${phone}`;widget.querySelector('.callback-result').hidden=false;widget.querySelector('textarea').value=value;widget.querySelector('.callback-result p').textContent='Контакт подготовлен. Скопируйте его для передачи менеджеру.';});
form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
widget.querySelector('.callback-copy').addEventListener('click',async e=>{const text=widget.querySelector('textarea');try{await navigator.clipboard.writeText(text.value);e.target.textContent='Скопировано';done=true;forced=false;setTimeout(refresh,1800)}catch{text.focus();text.select();e.target.textContent='Скопируйте выделенный текст'}});
document.querySelector('#inquiry').addEventListener('submit',()=>{done=true;forced=false;refresh()});
})();
