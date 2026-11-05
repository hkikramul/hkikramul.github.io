(() => {
 for(const element of document.querySelectorAll('[data-external-src]')){
  const url=element.dataset.externalSrc,button=document.createElement('button');button.type='button';button.className='external-media-button';const bn=document.documentElement.lang.startsWith('bn');
  button.textContent=bn?'বাহ্যিক মিডিয়া দেখুন (প্রদানকারী আপনার IP পেতে পারে)':'Load external media (the provider may receive your IP address)';
  element.hidden=true;(element.closest('a')||element).before(button);button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();element.src=url;element.hidden=false;button.remove()},{once:true});
 }
})();
