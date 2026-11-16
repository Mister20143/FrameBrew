(function () {
  'use strict';
  var gallery = window.FRAMEBREW_GALLERY || [];
  var $ = function (id) { return document.getElementById(id); };
  var frame = $('frame'), mat = $('mat'), painting = $('painting'), caption = $('caption');
  var menu = $('overlay'), optionsEl = $('optionList'), hint = $('hint'), errorEl = $('error');
  var frames = ['gold', 'wood', 'black', 'white', 'none'];
  var frameLabels = ['Dorado', 'Madera', 'Negro', 'Blanco', 'Sin marco'];
  var mats = ['ivory', 'white', 'dark', 'none'];
  var matLabels = ['Marfil', 'Blanco', 'Oscuro', 'Sin paspartú'];
  var times = [0, 15, 30, 60, 300, 900];
  var timeLabels = ['Manual', '15 segundos', '30 segundos', '1 minuto', '5 minutos', '15 minutos'];
  var fits = ['cover', 'contain'];
  var fitLabels = ['Llenar (recortar)', 'Ver completa'];
  var lights = [0, 0.12, 0.25, 0.4];
  var lightLabels = ['Normal', 'Suave', 'Tenue', 'Muy tenue'];
  var labels = ['Oculta', 'Visible'];
  var defaultState = { index: 0, frame: 0, mat: 0, time: 3, fit: 0, light: 1, caption: 0, paused: false };
  var state = {};
  var timer = null, hintTimer = null, selected = 0, menuOpen = false;
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem('framebrew-settings-v1')); } catch (e) {}
  Object.keys(defaultState).forEach(function (key) {
    state[key] = saved && Object.prototype.hasOwnProperty.call(saved, key) ? saved[key] : defaultState[key];
  });
  function safeIndex(value, size) { return typeof value === 'number' && isFinite(value) ? ((Math.floor(value) % size) + size) % size : 0; }
  function save() { try { localStorage.setItem('framebrew-settings-v1', JSON.stringify(state)); } catch (e) {} }
  function showHint() {
    hint.className = 'visible';
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { hint.className = ''; }, 5600);
  }
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.className = msg ? 'visible' : '';
  }
  function applyStyles() {
    frame.className = 'frame-' + frames[safeIndex(state.frame, frames.length)];
    mat.className = 'mat-' + mats[safeIndex(state.mat, mats.length)];
    painting.className = fits[safeIndex(state.fit, fits.length)] === 'contain' ? 'fit-contain' : '';
    $('shade').style.opacity = lights[safeIndex(state.light, lights.length)];
    caption.className = state.caption ? '' : 'off';
  }
  function drawImage() {
    if (!gallery.length) { showError('No hay obras. Edita app/gallery.js y agrega imágenes.'); return; }
    state.index = safeIndex(state.index, gallery.length);
    var item = gallery[state.index];
    painting.className += ' is-loading';
    painting.onload = function () { applyStyles(); showError(''); };
    painting.onerror = function () { showError('No se pudo abrir: ' + item.src + '. Revisa app/gallery.js y la ruta.'); painting.className = ''; };
    painting.src = item.src;
    caption.textContent = '';
    var title = document.createElement('span');
    title.textContent = item.title || 'Sin título';
    var author = document.createElement('small');
    author.textContent = item.author || '';
    caption.appendChild(title);
    caption.appendChild(author);
    applyStyles();
    save();
  }
  function resetTimer() {
    if (timer) { clearInterval(timer); timer = null; }
    var seconds = times[safeIndex(state.time, times.length)];
    if (seconds && !state.paused && !menuOpen && gallery.length > 1) {
      timer = setInterval(function () { changeArt(1); }, seconds * 1000);
    }
  }
  function changeArt(n) { state.index = safeIndex(state.index + n, gallery.length || 1); drawImage(); resetTimer(); }
  var settings = [
    { name: 'Marco', key: 'frame', values: frameLabels },
    { name: 'Paspartú', key: 'mat', values: matLabels },
    { name: 'Presentación', key: 'time', values: timeLabels },
    { name: 'Encuadre', key: 'fit', values: fitLabels },
    { name: 'Iluminación simulada', key: 'light', values: lightLabels },
    { name: 'Nombre de la obra', key: 'caption', values: labels }
  ];
  function drawMenu() {
    optionsEl.textContent = '';
    for (var i = 0; i < settings.length; i++) {
      (function (idx) {
        var opt = settings[idx];
        var line = document.createElement('div');
        line.className = 'option' + (selected === idx ? ' selected' : '');
        var name = document.createElement('span'); name.textContent = opt.name;
        var value = document.createElement('span'); value.textContent = opt.values[safeIndex(state[opt.key], opt.values.length)];
        line.appendChild(name); line.appendChild(value);
        line.onclick = function () { if (selected === idx) changeSetting(1); else { selected = idx; drawMenu(); } };
        optionsEl.appendChild(line);
      })(i);
    }
  }
  function changeSetting(step) {
    var opt = settings[selected];
    state[opt.key] = safeIndex(state[opt.key] + step, opt.values.length);
    applyStyles(); save(); drawMenu(); resetTimer();
  }
  function setMenu(open) {
    menuOpen = open;
    menu.className = open ? 'show' : '';
    if (open) { drawMenu(); }
    else { showHint(); }
    resetTimer();
  }
  function keyHandler(e) {
    var k = e.keyCode || e.which;
    var isBack = k === 10009 || k === 27 || e.key === 'Escape' || e.key === 'Backspace';
    if (isBack) {
      e.preventDefault();
      if (menuOpen) setMenu(false);
      else if (window.history.length > 1) window.history.back();
      else setMenu(true);
      return;
    }
    if (menuOpen) {
      if (k === 38) { e.preventDefault(); selected = safeIndex(selected - 1, settings.length); drawMenu(); }
      else if (k === 40) { e.preventDefault(); selected = safeIndex(selected + 1, settings.length); drawMenu(); }
      else if (k === 37) { e.preventDefault(); changeSetting(-1); }
      else if (k === 39 || k === 13) { e.preventDefault(); changeSetting(1); }
      return;
    }
    if (k === 37) { e.preventDefault(); changeArt(-1); showHint(); }
    else if (k === 39) { e.preventDefault(); changeArt(1); showHint(); }
    else if (k === 13 || k === 38 || k === 40) { e.preventDefault(); setMenu(true); }
    else if (k === 415 || k === 19) { // Play / Pause on Samsung remotes, when dispatched
      e.preventDefault(); state.paused = !state.paused; save(); resetTimer();
      hint.textContent = state.paused ? 'Presentación en pausa · OK abrir ajustes' : 'Presentación reanudada · OK abrir ajustes';
      showHint();
    }
  }
  document.addEventListener('keydown', keyHandler, false);
  $('closeBtn').onclick = function () { setMenu(false); };
  $('nextBtn').onclick = function () { changeArt(1); setMenu(false); };
  $('stage').onclick = function () { setMenu(true); };
  window.onerror = function (message) { showError('FrameBrew: ' + message); return false; };
  if (gallery.length) {
    drawImage(); resetTimer(); showHint();
  } else showError('Galería vacía: agrega obras en app/gallery.js');
})();
