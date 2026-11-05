const requestedEnglish = new URLSearchParams(location.search).get('lang') === 'en';
if (requestedEnglish) {
  const root = document.getElementById('root');
  const selectEnglish = () => {
    const button = [...root.querySelectorAll('button')].find(b => /^English(?:\s|$)/.test(b.textContent.trim()));
    if (!button) return false;
    observer.disconnect();
    button.click();
    return true;
  };
  const observer = new MutationObserver(selectEnglish);
  observer.observe(root, {childList:true,subtree:true});
  selectEnglish();
}
