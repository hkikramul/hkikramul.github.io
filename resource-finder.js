(() => {
 const form=document.querySelector('#resource-search'); if(!form)return;
 const input=document.querySelector('#resource-query'), cards=[...document.querySelectorAll('.resource-item')], buttons=[...document.querySelectorAll('.resource-filters button')];
 const showAll=document.querySelector('#resource-show-all');let expanded=false; const params=new URLSearchParams(location.search); let selected=params.get('topic')||'All';
 if(!buttons.some(b=>b.dataset.topic===selected))selected='All';
 input.value=params.get('q')||'';
 const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function filter(){const words=normalize(input.value).trim().split(/\s+/).filter(Boolean);let count=0;
 cards.forEach(card=>{card.hidden=!(selected==='All'||card.dataset.topic===selected)||!words.every(w=>normalize(card.dataset.search).includes(w)); if(!card.hidden){count++;if(!expanded && !words.length && selected==='All' && count>12)card.hidden=true;}});
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===selected)));
 const limited=!expanded&&!words.length&&selected==='All'&&count>12;showAll.hidden=!limited;document.querySelector('#resource-count').textContent=(limited?'Showing 12 of '+count:count+' of '+cards.length)+' resources';document.querySelector('#resource-empty').hidden=count!==0;
 const url=new URL(location.href);url.searchParams.delete('q');url.searchParams.delete('topic');if(input.value.trim())url.searchParams.set('q',input.value.trim());if(selected!=='All')url.searchParams.set('topic',selected);history.replaceState(null,'',url);
 }
 showAll.addEventListener('click',()=>{expanded=true;filter();}); input.addEventListener('input',filter);form.addEventListener('submit',e=>{e.preventDefault();filter();});form.addEventListener('reset',()=>{input.value='';selected='All';expanded=false;filter();input.focus();});buttons.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.topic;filter();}));filter();
function openCollection(){const id=decodeURIComponent(location.hash.slice(1));const el=document.getElementById(id);if(!el)return;let p=el.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}el.scrollIntoView();}window.addEventListener('hashchange',openCollection);if(location.hash)openCollection();
})();
