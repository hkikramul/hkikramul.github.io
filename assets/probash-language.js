(() => {
 const requestedEnglish = new URLSearchParams(location.search).get('lang') === 'en';
 const root = document.getElementById('root');
 if (requestedEnglish && root) {
  const selectEnglish = () => {
   const button = [...root.querySelectorAll('button')].find(b => /^English(?:\s|$)/.test(b.textContent.trim()));
   if (!button) return;
   observer.disconnect(); button.click();
  };
  const observer = new MutationObserver(selectEnglish);
  observer.observe(root, {childList:true,subtree:true}); selectEnglish();
 }
 // Full-page switching keeps the native React interface and shared narration language aligned.
 document.addEventListener('click', event => {
  const button = event.target.closest('button.language');
  if (!event.isTrusted || !button) return;
  event.preventDefault();event.stopImmediatePropagation();
  const next = button.textContent.includes('English') ? 'en' : 'bn';
  location.assign(location.pathname+'?lang='+next);
 }, true);
})();
