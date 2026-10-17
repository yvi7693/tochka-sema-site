(()=>{
const widget=document.querySelector('#callbackWidget'),form=widget.querySelector('form'),toggle=widget.querySelector('.callback-toggle'),contact=document.querySelector('#contact');let engaged=false,elapsed=false,nearContact=false,closed=false,done=false;
try{closed=sessionStorage.getItem('callback-closed')==='yes';done=sessionStorage.getItem('callback-done')==='yes'}catch{}
function refresh(){widget.hidden=!(engaged&&elapsed&&!nearContact&&!closed&&!done)}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){engaged=true;refresh()}},{threshold:.15});['#menu','#approach'].forEach(s=>observer.observe(document.querySelector(s)));
new IntersectionObserver(entries=>{nearContact=entries[0].isIntersecting;refresh()},{threshold:0}).observe(contact);
setTimeout(()=>{elapsed=true;refresh()},25000);
widget.querySelector('.callback-close').addEventListener('click',()=>{closed=true;try{sessionStorage.setItem('callback-closed','yes')}catch{}refresh()});
toggle.addEventListener('click',()=>{widget.classList.add('expanded');toggle.setAttribute('aria-expanded','true');widget.querySelector('input').focus()});
widget.addEventListener('keydown',e=>{if(e.key==='Escape')widget.querySelector('.callback-close').click()});
form.addEventListener('submit',async e=>{e.preventDefault();const data=new FormData(form),phone=String(data.get('phone')).trim();if(phone.replace(/\D/g,'').length<10){form.elements.phone.setCustomValidity('Введите номер телефона полностью');form.elements.phone.reportValidity();return}const value=`Хочу обсудить событие.\nИмя: ${data.get('name')}\nТелефон: ${phone}`;widget.querySelector('.callback-result').hidden=false;widget.querySelector('textarea').value=value;widget.querySelector('.callback-result p').textContent='Контакт подготовлен. Скопируйте его для передачи менеджеру.';});
form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
widget.querySelector('.callback-copy').addEventListener('click',async e=>{const text=widget.querySelector('textarea');try{await navigator.clipboard.writeText(text.value);e.target.textContent='Скопировано';done=true;try{sessionStorage.setItem('callback-done','yes')}catch{}setTimeout(refresh,1800)}catch{text.focus();text.select();e.target.textContent='Скопируйте выделенный текст'}});
document.querySelector('#inquiry').addEventListener('submit',()=>{done=true;try{sessionStorage.setItem('callback-done','yes')}catch{}refresh()});
})();
