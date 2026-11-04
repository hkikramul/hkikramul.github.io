(() => {
  const preference = 'reading-shade-off';
  let disabled = false;
  try { disabled = localStorage.getItem(preference) === 'true'; } catch {}
  let location;
  const radians = Math.PI / 180;
  const clamp = value => Math.max(0, Math.min(1, value));

  // Approximate solar elevation using the seasonal declination and equation of time.
  function solarElevation(now, { latitude, longitude }) {
    const year = now.getUTCFullYear();
    const days = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86400000;
    const day = (now.getTime() - Date.UTC(year, 0, 1)) / 86400000;
    const angle = 2 * Math.PI * (day - 0.5) / days;
    const declination = 0.006918 - 0.399912 * Math.cos(angle) + 0.070257 * Math.sin(angle)
      - 0.006758 * Math.cos(2 * angle) + 0.000907 * Math.sin(2 * angle)
      - 0.002697 * Math.cos(3 * angle) + 0.00148 * Math.sin(3 * angle);
    const equation = 229.18 * (0.000075 + 0.001868 * Math.cos(angle) - 0.032077 * Math.sin(angle)
      - 0.014615 * Math.cos(2 * angle) - 0.040849 * Math.sin(2 * angle));
    const minutes = now.getUTCHours() * 60 + now.getUTCMinutes() + equation + 4 * longitude;
    const hourAngle = (minutes / 4 - 180) * radians;
    const lat = latitude * radians;
    const elevation = Math.sin(lat) * Math.sin(declination)
      + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);
    return Math.asin(Math.max(-1, Math.min(1, elevation))) / radians;
  }

  const bangla = document.documentElement.lang.toLowerCase().startsWith('bn');
  const labels = bangla
    ? ['পড়ার পর্দা', 'সময় অনুযায়ী', 'বন্ধ', 'সূর্যোদয় ও সূর্যাস্তের সময় ব্যবহার করুন', 'অবস্থান পাওয়া যায়নি। স্থানীয় সময় ব্যবহার করা হচ্ছে।', 'স্থানীয় সূর্যোদয় ও সূর্যাস্ত অনুযায়ী']
    : ['Reading shade', 'Automatic', 'Off', 'Use local sunrise and sunset', 'Location unavailable. Using your local clock.', 'Using local sunrise and sunset'];

  const shade = document.createElement('div');
  shade.className = 'reading-shade-overlay';
  shade.setAttribute('aria-hidden', 'true');

  const controls = document.createElement('div');
  controls.className = 'reading-shade-controls';
  const mode = document.createElement('button');
  mode.type = 'button';
  mode.textContent = labels[1];
  mode.setAttribute('aria-label', labels[0] + ' · ' + labels[1]);
  const useLocation = document.createElement('button');
  useLocation.type = 'button';
  useLocation.textContent = labels[3];
  useLocation.hidden = !navigator.geolocation;
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  controls.append(labels[0] + ' ', mode, useLocation, status);
  document.body.append(controls, shade);

  function update() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    // With no location, fade in 18:00–20:00 and fade out 06:00–08:00.
    const warmth = location ? clamp((4 - solarElevation(now, location)) / 16)
      : Math.max(clamp((hour - 18) / 2), clamp((8 - hour) / 2));
    shade.style.opacity = disabled ? '0' : String(warmth);
    mode.setAttribute('aria-pressed', String(!disabled));
    mode.textContent = disabled ? labels[2] : labels[1];
    mode.title = disabled ? labels[2] : labels[1];
    useLocation.disabled = disabled;
  }

  function readLocation(interactive) {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      // Coordinates stay in memory and are only used for this calculation.
      location = { latitude: coords.latitude, longitude: coords.longitude };
      useLocation.hidden = true;
      if (interactive) status.textContent = labels[5];
      update();
    }, () => {
      if (interactive) status.textContent = labels[4];
    }, { timeout: 8000, maximumAge: 3600000 });
  }

  function useGrantedLocation() {
    if (!disabled && !location && navigator.permissions && navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        if (permission.state === 'granted' && !disabled) readLocation(false);
      }).catch(() => {});
    }
  }

  mode.addEventListener('click', () => {
    disabled = !disabled;
    try { localStorage.setItem(preference, String(disabled)); } catch {}
    update();
    useGrantedLocation();
  });
  useLocation.addEventListener('click', () => readLocation(true));
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
  window.addEventListener('storage', event => {
    if (event.key !== preference) return;
    disabled = event.newValue === 'true';
    update();
    useGrantedLocation();
  });
  update();
  useGrantedLocation();
  setInterval(update, 60000);
})();
