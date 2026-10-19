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
document.addEventListener('click',e=>{const link=e.target.closest('a[href="#contact"]');if(!link||link.closest('#contact'))return;e.preventDefault();forced=true;closed=false;done=false;refresh();expand()});
widget.addEventListener('keydown',e=>{if(e.key==='Escape'&&widget.classList.contains('expanded'))collapse()});
form.addEventListener('submit',async e=>{e.preventDefault();const data=new FormData(form),phone=String(data.get('phone')).trim();if(phone.replace(/\D/g,'').length<10){form.elements.phone.setCustomValidity('Введите номер телефона полностью');form.elements.phone.reportValidity();return}const value=`Хочу обсудить событие.\nИмя: ${data.get('name')}\nТелефон: ${phone}`;widget.querySelector('.callback-result').hidden=false;widget.querySelector('textarea').value=value;widget.querySelector('.callback-result p').textContent='Контакт подготовлен. Скопируйте его для передачи менеджеру.';});
form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
widget.querySelector('.callback-copy').addEventListener('click',async e=>{const text=widget.querySelector('textarea');try{await navigator.clipboard.writeText(text.value);e.target.textContent='Скопировано';done=true;forced=false;setTimeout(refresh,1800)}catch{text.focus();text.select();e.target.textContent='Скопируйте выделенный текст'}});
document.querySelector('#inquiry').addEventListener('submit',()=>{done=true;forced=false;refresh()});
})();
