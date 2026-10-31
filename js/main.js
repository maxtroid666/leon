/* ЛЕОН медиа производство — скрипт сайта. Без библиотек. */

/* ═══ РАБОТЫ ═══ одна строка — один ролик. file — имя файлов в video/works/:
   file.jpg — обложка, file-preview.mp4 — фрагмент без звука (играет при наведении), file.mp4 — полная версия со звуком. */
const WORKS=[
 {title:'Бастерс',  year:2022,file:'busters', dur:'1:44'},
 {title:'Орбита',   year:2022,file:'orbita',  dur:'1:57'},
 {title:'Саммер',   year:2022,file:'summer',  dur:'1:09'},
 {title:'Метрополь',year:2021,file:'metropol',dur:'0:51'},
 {title:'НФТ',      year:2021,file:'nft',     dur:'1:44'},
];
/* Кадры со съёмок: img/backstage/leo1.webp … leo12.webp */
const BACKSTAGE=12;
/* Заявки приходят на эту почту через сервис FormSubmit (первую заявку на новый адрес нужно подтвердить в письме). */
const FORM_EMAIL='leonstein2@gmail.com';
const SHOWREEL={desktop:'video/reel.mp4',mobile:'video/reel-mobile.mp4'};

/* Данные проектов: ключ — file из WORKS. Пока поле пустое, на странице видна заглушка в [скобках]. */
const WORK_INFO={
 /* busters:{client:'',type:'',task:'',done:'режиссура / съёмка / монтаж'}, */
};

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const mobile=matchMedia('(max-width:820px)').matches;
const canHover=matchMedia('(hover:hover)').matches;
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const reelSrc=mobile?SHOWREEL.mobile:SHOWREEL.desktop;

/* ═══ первый экран: фоновое видео и подгонка слова ЛЕОН под ширину ═══ */
const heroV=$('#heroVideo');
if(!calm){heroV.src=reelSrc;heroV.play().catch(()=>{})}
const word=$('.hero-word');
function fitWord(){
 word.style.fontSize='100px';
 const sp=word.children,hero=$('.hero');
 const w=(sp[sp.length-1].getBoundingClientRect().right-sp[0].getBoundingClientRect().left)||1;
 const byW=(innerWidth*.96)/w*100;
 const byH=(hero.offsetHeight*(innerWidth<720?9:.62))/.78;
 word.style.fontSize=Math.min(byW,byH)+'px';
}
/* слово ЛЕОН в подвале — на всю ширину */
const ftrWord=$('.ftr-word');
function fitFtr(){
 ftrWord.style.fontSize='100px';
 const r=document.createRange();r.selectNodeContents(ftrWord);
 ftrWord.style.fontSize=ftrWord.clientWidth/(r.getBoundingClientRect().width||1)*100+'px';
}
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{fitWord();fitFtr();document.body.classList.add('ready')});
addEventListener('resize',()=>{fitWord();fitFtr()});

/* ═══ шапка, меню, нижняя панель ═══ */
const hdr=$('#hdr'),mbar=$('#mbar'),burger=$('#burger'),mnav=$('#mnav');
function onScroll(){
 const y=scrollY;
 hdr.classList.toggle('solid',y>40);
 mbar.classList.toggle('on',y>innerHeight*.7&&y<document.body.scrollHeight-innerHeight*1.6);
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
function menu(open){burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');mnav.hidden=!open;document.body.style.overflow=open?'hidden':''}
burger.addEventListener('click',()=>menu(mnav.hidden));
mnav.addEventListener('click',e=>{if(e.target.closest('a'))menu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!mnav.hidden){menu(false);burger.focus()}});

/* подсветка пункта меню текущего раздела */
const navLinks=$$('.nav a');
const secObs=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting)navLinks.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>secObs.observe(s));

/* ═══ работы ═══ */
const wrap=$('#works');
WORKS.forEach((w,i)=>{
 const b=document.createElement('button');
 b.className='wk';b.type='button';
 b.setAttribute('aria-label',`Смотреть ролик «${w.title}», ${w.year}`);
 b.innerHTML=`<img src="video/works/${w.file}.jpg" alt="Кадр из ролика «${w.title}»" loading="lazy">`+
  `<span class="wk-go"><svg class="ic-play" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z"/></svg></span>`+
  `<span class="wk-meta"><span class="wk-t">${w.title}</span><span class="wk-d">${w.year}<br>${w.dur}</span></span>`;
 if(canHover&&!calm){
  let v;
  b.addEventListener('mouseenter',()=>{
   if(!v){v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';v.src=`video/works/${w.file}-preview.mp4`;b.insertBefore(v,b.children[1])}
   v.play().then(()=>b.classList.add('play')).catch(()=>{});
  });
  b.addEventListener('mouseleave',()=>{if(v){v.pause();b.classList.remove('play')}});
 }
 b.addEventListener('click',()=>openVideo(`video/works/${w.file}.mp4`,w.title,`video/works/${w.file}.jpg`));
 const m=WORK_INFO[w.file]||{},f=(v,t)=>v||`<!-- PLACEHOLDER: заменить реальными данными --><span data-placeholder="true">[${t}]</span>`;
 const c=document.createElement('article');c.className='c pj rv';c.appendChild(b);
 const d=document.createElement('div');d.className='pj-meta';
 d.innerHTML=`<p class="lbl"><span class="num">${String(i+1).padStart(2,'0')}</span> ${f(m.client,'Клиент')} / ${f(m.type,'Тип задачи')}</p>`+
  `<p><b>Задача:</b> ${f(m.task,'задача в одну строку')}</p><p><b>Сделали:</b> ${f(m.done,'этап / этап / этап')}</p>`;
 c.appendChild(d);wrap.appendChild(c);
});

/* ═══ окно с видео ═══ */
const modal=$('#modal'),mv=$('#modalVideo'),mt=$('#modalT');
function openVideo(src,title,poster){
 mv.poster=poster||'';mv.src=src;mt.textContent=title;
 modal.showModal();mv.play().catch(()=>{});
}
function closeVideo(){mv.pause();mv.removeAttribute('src');mv.load();modal.close()}
$('#modalX').addEventListener('click',closeVideo);
modal.addEventListener('click',e=>{if(e.target===modal)closeVideo()});
modal.addEventListener('cancel',e=>{e.preventDefault();closeVideo()});
$$('[data-open-reel]').forEach(b=>b.addEventListener('click',()=>openVideo(reelSrc,'Шоурил','video/reel-poster.jpg')));

/* ═══ кадры со съёмок ═══ */
const strip=$('#strip');
for(let i=1;i<=BACKSTAGE;i++){
 const f=document.createElement('figure');
 f.innerHTML=`<img src="img/backstage/leo${i}.webp" alt="Команда ЛЕОН на съёмке, кадр ${i}" loading="lazy" width="1200" height="800">`;
 strip.appendChild(f);
}

/* ═══ появление блоков (обратимое: при уходе с экрана сбрасывается) ═══ */
const rvObs=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting)e.target.classList.add('in');
 else if(e.boundingClientRect.top>0)e.target.classList.remove('in');
}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach((el,i)=>{
 const sib=[...el.parentElement.children].filter(c=>c.classList.contains('rv'));
 el.style.setProperty('--d',Math.min(sib.indexOf(el),5)*70+'ms');
 rvObs.observe(el);
});

/* ═══ форма заявки ═══ */
const form=$('#form'),msg=$('#formMsg'),send=$('#send');
form.addEventListener('input',e=>{const l=e.target.closest('.fld');if(l&&l.classList.contains('err')){l.classList.remove('err');e.target.removeAttribute('aria-invalid')}});
function show(t,ok){msg.hidden=false;msg.textContent=t;msg.classList.toggle('ok',!!ok)}
form.addEventListener('submit',async e=>{
 e.preventDefault();
 if(form._honey.value)return;
 let bad=false;
 ['name','phone'].forEach(n=>{const f=form[n],err=n==='phone'?f.value.replace(/\D/g,'').length<10:!f.value.trim();f.parentElement.classList.toggle('err',err);f.setAttribute('aria-invalid',err);if(err&&!bad){f.focus();bad=true}});
 if(bad){show('Заполните имя и телефон, чтобы мы могли связаться с вами.');return}
 send.disabled=true;send.firstChild.textContent='Отправляем… ';
 try{
  const r=await fetch('https://formsubmit.co/ajax/'+FORM_EMAIL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({'_subject':'Заявка с сайта ЛЕОН','_template':'table','Имя':form.name.value,'Телефон':form.phone.value,
    'Дата или сроки':form.date.value,'Почта или Телеграм':form.contact.value,'О проекте':form.about.value})});
  if(!r.ok)throw 0;
  form.reset();show('Заявка получена. Свяжемся с вами и обсудим событие.',true);
 }catch(_){
  show('Не получилось отправить. Позвоните нам: +7 965 588-71-27 или напишите на '+FORM_EMAIL+'.');
 }
 send.disabled=false;send.firstChild.textContent='Обсудить проект ';
});
