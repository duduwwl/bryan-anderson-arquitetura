const header=document.querySelector('.site-header');
const menu=document.getElementById('mobile-menu');
const toggle=document.querySelector('.menu-toggle');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function updateHeader(){header?.classList.toggle('is-scrolled',scrollY>40)}
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
function closeMenu(){if(!menu||!toggle)return;menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');header.classList.remove('menu-open');document.body.style.overflow=''}
toggle?.addEventListener('click',()=>{if(!menu.hidden){closeMenu();return}menu.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Fechar menu');header.classList.add('menu-open');document.body.style.overflow='hidden'});
menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
addEventListener('keydown',e=>{if(menu&&!menu.hidden){if(e.key==='Escape'){closeMenu();toggle.focus()}if(e.key==='Tab'){const controls=[toggle,...menu.querySelectorAll('a')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}});
addEventListener('resize',()=>{if(innerWidth>900&&!menu?.hidden)closeMenu()});
document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
if(!motionPreference.matches&&'IntersectionObserver' in window){document.body.classList.add('motion-ready');const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el))}
const hero=document.querySelector('.hero');
const motionToggle=document.querySelector('.motion-toggle');
motionToggle?.addEventListener('click',()=>{const paused=hero.classList.toggle('motion-paused');motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.setAttribute('aria-label',paused?'Retomar movimento da imagem':'Pausar movimento da imagem');motionToggle.firstElementChild.textContent=paused?'▷':'Ⅱ'});
if(hero&&'IntersectionObserver' in window)new IntersectionObserver(([entry])=>hero.classList.toggle('offscreen',!entry.isIntersecting)).observe(hero);
document.addEventListener('visibilitychange',()=>hero?.classList.toggle('offscreen',document.hidden));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='todos'&&card.dataset.category!==button.dataset.filter;card.classList.add('is-visible')})}));
const items=[...document.querySelectorAll('.gallery-item')];
const dialog=document.querySelector('.lightbox');
let imageIndex=0;let returnFocus=null;
function showImage(index){if(!items.length||!dialog)return;imageIndex=(index+items.length)%items.length;const photo=items[imageIndex].querySelector('.photo').cloneNode(true);const source=photo.querySelector('img,svg');if(source?.tagName==='IMG')source.removeAttribute('loading');if(source?.tagName.toLowerCase()==='svg'){const box=source.getAttribute('viewBox').split(' ').map(Number);photo.style.setProperty('--ratio',box[2]/box[3])}dialog.querySelector('.lightbox-media').replaceChildren(photo);dialog.querySelector('figcaption').textContent=source?.getAttribute('alt')||source?.getAttribute('aria-label')||'';dialog.querySelector('.lightbox-prev').hidden=items.length<2;dialog.querySelector('.lightbox-next').hidden=items.length<2}
items.forEach((item,index)=>item.addEventListener('click',()=>{returnFocus=document.activeElement;showImage(index);dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.lightbox-close').focus()}));
dialog?.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog?.querySelector('.lightbox-prev').addEventListener('click',()=>showImage(imageIndex-1));
dialog?.querySelector('.lightbox-next').addEventListener('click',()=>showImage(imageIndex+1));
dialog?.addEventListener('close',()=>{document.body.style.overflow='';dialog.querySelector('.lightbox-media').replaceChildren();returnFocus?.focus()});
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showImage(imageIndex-1)}else if(e.key==='ArrowRight'){e.preventDefault();showImage(imageIndex+1)}});
let touchX=0;dialog?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});dialog?.addEventListener('touchend',e=>{const distance=e.changedTouches[0].screenX-touchX;if(Math.abs(distance)>55)showImage(imageIndex+(distance<0?1:-1))},{passive:true});
