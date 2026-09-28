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
const heroSlides=[...(hero?.querySelectorAll('.hero-slide')||[])];
const heroDots=[...(hero?.querySelectorAll('.hero-dot')||[])];
heroSlides.forEach(slide=>slide.querySelector('img')?.setAttribute('loading','eager'));
let activeSlide=0,slideTimer;
function showSlide(index){if(!heroSlides.length)return;activeSlide=(index+heroSlides.length)%heroSlides.length;heroSlides.forEach((slide,i)=>{const current=i===activeSlide;slide.classList.toggle('is-active',current);slide.setAttribute('aria-hidden',String(!current))});heroDots.forEach((dot,i)=>{const current=i===activeSlide;dot.classList.toggle('is-active',current);dot.setAttribute('aria-pressed',String(current))});hero.querySelector('.hero-caption span').textContent=heroSlides[activeSlide].dataset.title;hero.querySelector('.hero-caption small').textContent=heroSlides[activeSlide].dataset.type}
function scheduleSlides(){clearInterval(slideTimer);if(heroSlides.length>1&&!motionPreference.matches&&!hero?.classList.contains('motion-paused')&&!hero?.classList.contains('offscreen')&&!document.hidden)slideTimer=setInterval(()=>showSlide(activeSlide+1),6500)}
heroDots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);scheduleSlides()}));
motionToggle?.addEventListener('click',()=>{const paused=hero.classList.toggle('motion-paused');motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.setAttribute('aria-label',paused?'Retomar apresentação de imagens':'Pausar apresentação de imagens');motionToggle.firstElementChild.textContent=paused?'▷':'Ⅱ';scheduleSlides()});
if(hero&&'IntersectionObserver' in window)new IntersectionObserver(([entry])=>{hero.classList.toggle('offscreen',!entry.isIntersecting);scheduleSlides()}).observe(hero);
document.addEventListener('visibilitychange',()=>{hero?.classList.toggle('offscreen',document.hidden);scheduleSlides()});
motionPreference.addEventListener?.('change',scheduleSlides);
scheduleSlides();
const strip=document.querySelector('.detail-strip');
if(strip&&'IntersectionObserver' in window)new IntersectionObserver(([entry])=>strip.classList.toggle('is-active',entry.isIntersecting),{threshold:.08}).observe(strip);
const depth=document.querySelector('.depth-scene');
if(depth){const cover=depth.closest('.depth-cover'),effects=depth.querySelector('.scene-effects');let depthInView=true;function syncDepth(){const stopped=document.hidden||!depthInView;cover.classList.toggle('offscreen',stopped);if(stopped)effects?.pauseAnimations?.();else effects?.unpauseAnimations?.()}depth.addEventListener('pointermove',e=>{if(motionPreference.matches)return;const r=cover.getBoundingClientRect();depth.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*14}deg`);depth.style.setProperty('--rx',`${-(e.clientY-r.top)/r.height*14+7}deg`)});cover.addEventListener('pointerleave',()=>{depth.style.setProperty('--rx','0deg');depth.style.setProperty('--ry','0deg')});if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>{depthInView=entry.isIntersecting;syncDepth()},{threshold:.03}).observe(cover);document.addEventListener('visibilitychange',syncDepth)}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='todos'&&card.dataset.category!==button.dataset.filter;card.classList.add('is-visible')})}));
const items=[...document.querySelectorAll('.gallery-item')];
const dialog=document.querySelector('.lightbox');
let imageIndex=0;let returnFocus=null;
function showImage(index){if(!items.length||!dialog)return;imageIndex=(index+items.length)%items.length;const photo=items[imageIndex].querySelector('.photo').cloneNode(true);const source=photo.querySelector('img,svg');if(source?.tagName==='IMG'){source.removeAttribute('loading');photo.classList.add('has-img')}if(source?.tagName.toLowerCase()==='svg'){const box=source.getAttribute('viewBox').split(' ').map(Number);photo.style.setProperty('--ratio',box[2]/box[3])}dialog.querySelector('.lightbox-media').replaceChildren(photo);dialog.querySelector('figcaption').textContent=source?.getAttribute('alt')||source?.getAttribute('aria-label')||'';dialog.querySelector('.lightbox-prev').hidden=items.length<2;dialog.querySelector('.lightbox-next').hidden=items.length<2}
items.forEach((item,index)=>item.addEventListener('click',()=>{returnFocus=document.activeElement;showImage(index);dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('.lightbox-close').focus()}));
dialog?.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog?.querySelector('.lightbox-prev').addEventListener('click',()=>showImage(imageIndex-1));
dialog?.querySelector('.lightbox-next').addEventListener('click',()=>showImage(imageIndex+1));
dialog?.addEventListener('close',()=>{document.body.style.overflow='';dialog.querySelector('.lightbox-media').replaceChildren();returnFocus?.focus()});
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showImage(imageIndex-1)}else if(e.key==='ArrowRight'){e.preventDefault();showImage(imageIndex+1)}});
let touchX=0;dialog?.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});dialog?.addEventListener('touchend',e=>{const distance=e.changedTouches[0].screenX-touchX;if(Math.abs(distance)>55)showImage(imageIndex+(distance<0?1:-1))},{passive:true});

