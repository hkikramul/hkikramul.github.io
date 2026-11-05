/* Shared display algorithm, used by every publication. Coordinates stay in memory. */
(() => {
  'use strict';
  const KEY = 'site-display-mode';
  const get = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let mode = get(KEY, 'auto'), coordinates = null;
  if (!['auto', 'light', 'dark'].includes(mode)) mode = 'auto';
  const clamp = x => Math.max(0, Math.min(1, x));
  function elevation(now, loc) {
    const year = now.getUTCFullYear(), days = (Date.UTC(year+1,0,1)-Date.UTC(year,0,1))/86400000;
    const day = (now-Date.UTC(year,0,1))/86400000, a = 2*Math.PI*(day-.5)/days, rad = Math.PI/180;
    const dec=.006918-.399912*Math.cos(a)+.070257*Math.sin(a)-.006758*Math.cos(2*a)+.000907*Math.sin(2*a)-.002697*Math.cos(3*a)+.00148*Math.sin(3*a);
    const eq=229.18*(.000075+.001868*Math.cos(a)-.032077*Math.sin(a)-.014615*Math.cos(2*a)-.040849*Math.sin(2*a));
    const ha=( (now.getUTCHours()*60+now.getUTCMinutes()+eq+4*loc.longitude)/4-180)*rad, lat=loc.latitude*rad;
    return Math.asin(Math.max(-1,Math.min(1,Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(ha))))/rad;
  }
  const overlay=document.createElement('div');overlay.className='reading-shade-overlay';overlay.setAttribute('aria-hidden','true');document.body.append(overlay);
  function update() {
    const now=new Date(), hour=now.getHours()+now.getMinutes()/60;
    const warmth=coordinates?clamp((4-elevation(now,coordinates))/16):Math.max(clamp((hour-18)/2),clamp((8-hour)/2));
    const dark=mode==='dark'||(mode==='auto'&&warmth>=.55);
    document.documentElement.dataset.theme=dark?'dark':'light';
    document.documentElement.dataset.displayMode=mode;
    overlay.style.opacity=mode==='auto'?String(warmth):'0';
    document.dispatchEvent(new CustomEvent('site-display-change',{detail:{mode,dark,source:coordinates?'solar':'clock'}}));
  }
  window.siteDisplay={get mode(){return mode},setMode(value){if(!['auto','light','dark'].includes(value))return;mode=value;set(KEY,value);update()},useLocation(onResult){if(!navigator.geolocation){onResult(false);return;}navigator.geolocation.getCurrentPosition(({coords})=>{coordinates={latitude:coords.latitude,longitude:coords.longitude};update();onResult(true)},()=>onResult(false),{timeout:8000,maximumAge:3600000})}};
  window.addEventListener('storage',e=>{if(e.key===KEY){mode=['auto','light','dark'].includes(e.newValue)?e.newValue:'auto';update()}});
  document.addEventListener('visibilitychange',update);window.addEventListener('pageshow',update);update();setInterval(update,60000);
})();
