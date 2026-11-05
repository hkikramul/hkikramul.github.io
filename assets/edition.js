/* Translates text in-place: the same DOM, styles, illustrations and reading order in both editions. */
(() => {
'use strict';
const params=new URLSearchParams(location.search);
const lockedEnglish=location.pathname.startsWith('/making-sense/debabrata-basu/')||(!location.pathname.startsWith('/making-sense/')&&!location.pathname.startsWith('/east-bengal-renaissance/')&&!document.documentElement.dataset.translationBn);
const lang=lockedEnglish?'en':(params.get('lang')||document.documentElement.lang||'en');
if(lang!=='en'&&lang!=='bn')return;
const originalLanguage=document.documentElement.lang;
document.documentElement.lang=lang;document.documentElement.dataset.edition=lang;
if(location.pathname.startsWith('/east-bengal-renaissance/probash-watch/')){if(lang==='en')document.title='Probash Watch | East Bengal Renaissance';return;}
if(lang==='bn'&&originalLanguage==='bn')return;
const source=lang==='bn'?document.documentElement.dataset.translationBn:document.documentElement.dataset.translation;
if(lang==='bn'&&!source)return;
if(lang==='en'&&!source&&!location.pathname.startsWith('/making-sense/')&&!location.pathname.startsWith('/east-bengal-renaissance/'))return;
const shared=lang==='bn'?null:'/assets/translations/shared.json';
Promise.all([(shared?fetch(shared).then(r=>r.ok?r.json():{}):Promise.resolve({})),(source?fetch(source).then(r=>{if(!r.ok)throw Error();return r.json()}):Promise.resolve({}))]).then(([common,specific])=>{
 const dictionary={...common,...specific};window.siteTranslation=dictionary;
 const skip=e=>e?.closest('script,style,code,pre,textarea,input,.site-tools,[data-no-translate]');
 function translate(root){
  if(root.nodeType===Node.TEXT_NODE){const key=root.textContent.trim();if(!skip(root.parentElement)&&dictionary[key])root.textContent=root.textContent.replace(key,dictionary[key]);return;}
  if(root.nodeType!==Node.ELEMENT_NODE||skip(root))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes)translate(n);
  for(const el of [root,...root.querySelectorAll('[title],[aria-label],[placeholder],[alt]')])for(const attribute of ['title','aria-label','placeholder','alt']){const key=el.getAttribute(attribute);if(key&&dictionary[key.trim()])el.setAttribute(attribute,dictionary[key.trim()])}
 }
 translate(document.body);
 if(lang==='en'){for(const el of document.body.querySelectorAll('[lang=bn]')){if(!el.hreflang&&!el.closest('.site-tools'))el.lang='en';}}
 if(location.hash){requestAnimationFrame(()=>{try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'start',behavior:'auto'})}catch{}})}
 if(lang==='en'&&location.pathname.startsWith('/east-bengal-renaissance/')){for(const a of document.querySelectorAll('header nav a[hreflang=en]')){a.textContent='বাংলা';a.href=document.documentElement.dataset.bilingualBase||location.pathname;a.hreflang='bn';a.lang='bn';}}
 if(lang==='en'){const h=document.querySelector('main h1');if(h)document.title=h.textContent.trim()+' | '+(location.pathname.startsWith('/making-sense/')?'Making Sense':'East Bengal Renaissance');const canonical=document.querySelector('link[rel=canonical]');if(canonical)canonical.href=location.origin+location.pathname+'?lang=en';}
 const observer=new MutationObserver(records=>{observer.disconnect();for(const r of records){if(r.type==='characterData')translate(r.target);for(const n of r.addedNodes)translate(n)}observe()});
 function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true})}observe();
 // Keep the edition while navigating within this publication, except explicit language choices.
 const pairs={"/east-bengal-renaissance/microplastics-food-bangladesh.html": "/east-bengal-renaissance/microplastics-food-bangladesh-en.html", "/east-bengal-renaissance/medical-education-patient-safety.html": "/east-bengal-renaissance/medical-education-patient-safety-en.html", "/east-bengal-renaissance/experimental-poverty-and-structural-critique.html": "/east-bengal-renaissance/experimental-poverty-and-structural-critique-en.html", "/east-bengal-renaissance/workers-first-industry-rhetoric.html": "/east-bengal-renaissance/workers-first-industry-rhetoric-en.html", "/east-bengal-renaissance/garment-minimum-wage-proposal.html": "/east-bengal-renaissance/garment-minimum-wage-proposal-en.html"};
 const publication=location.pathname.startsWith('/making-sense/')?'/making-sense/':'/east-bengal-renaissance/';
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||a.hreflang||a.closest('.site-tools')||a.target==='_blank')return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||!url.pathname.startsWith(publication)||url.pathname.includes('/probash-watch/')||url.pathname.includes('/debabrata-basu/')||/\.(pdf|zip|jpg|png|svg|json|mp3|oga)$/.test(url.pathname))return;if(url.pathname.endsWith('-en.html'))return;if(pairs[url.pathname]){url.pathname=pairs[url.pathname];url.searchParams.delete('lang')}else{url.searchParams.set('lang','en')}a.href=url.href},true);
}).catch(()=>{const note=document.createElement('p');note.className='site-translation-note';note.role='status';note.textContent='The English edition could not load. The original text is shown; reload or choose Bangla.';document.querySelector('main')?.prepend(note);document.documentElement.lang=originalLanguage});
})();
