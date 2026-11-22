const path = '/east-bengal-renaissance/1971-civilians';
const english = location.hash === '#english' || new URLSearchParams(location.search).get('lang') === 'en';
location.replace(path + (english ? '-en.html' : '.html') + location.search + location.hash);
