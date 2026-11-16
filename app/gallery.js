const gallery = [
  {
    title: 'Velas de amanecer',
    author: 'FrameBrew Studio',
    src: 'art/abstract-01.svg'
  },
  {
    title: 'Esquina azul',
    author: 'FrameBrew Studio',
    src: 'art/abstract-02.svg'
  },
  {
    title: 'Ritmo lunar',
    author: 'FrameBrew Studio',
    src: 'art/abstract-03.svg'
  }
];

const arts = gallery.map((item, index) => ({ ...item, index }));
const artImage = document.getElementById('art-image');
const artTitle = document.getElementById('art-title');
const artAuthor = document.getElementById('art-author');
const artIndex = document.getElementById('art-index');
const settings = document.getElementById('settings');
const displayMode = document.getElementById('display-mode');
const autoAdvance = document.getElementById('auto-advance');
const intervalInput = document.getElementById('interval');
const lighting = document.getElementById('lighting');
const artOverlay = document.getElementById('art-overlay');

const STORAGE_KEY = 'framebrew-settings';

const defaultSettings = {
  displayMode: 'fill',
  autoAdvance: 'true',
  interval: 20,
  lighting: '0.15'
};

let currentIndex = Number(localStorage.getItem('framebrew-index') || 0);
let timer = null;
let settingsOpen = false;

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return { ...defaultSettings, ...saved };
}

function saveSettings() {
  const payload = {
    displayMode: displayMode.value,
    autoAdvance: autoAdvance.value,
    interval: Number(intervalInput.value),
    lighting: lighting.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function applyDisplayMode(mode) {
  artImage.style.objectFit = mode === 'fit' ? 'contain' : mode === 'center' ? 'cover' : 'cover';
  artImage.style.filter = `brightness(${1 - Number(lighting.value)})`;
  artOverlay.style.opacity = lighting.value;
}

function renderArtwork(index) {
  currentIndex = (index + arts.length) % arts.length;
  const item = arts[currentIndex];

  artImage.src = item.src;
  artTitle.textContent = item.title;
  artAuthor.textContent = item.author;
  artIndex.textContent = `Obra ${currentIndex + 1} / ${arts.length}`;

  localStorage.setItem('framebrew-index', String(currentIndex));
  applyDisplayMode(displayMode.value);
  restartTimer();
}

function nextArtwork() {
  renderArtwork(currentIndex + 1);
}

function previousArtwork() {
  renderArtwork(currentIndex - 1);
}

function restartTimer() {
  if (timer) {
    clearInterval(timer);
  }

  if (autoAdvance.value === 'true') {
    const ms = Number(intervalInput.value) * 1000;
    timer = setInterval(nextArtwork, ms);
  }
}

function toggleSettings(forceOpen) {
  settingsOpen = typeof forceOpen === 'boolean' ? forceOpen : !settingsOpen;
  settings.classList.toggle('hidden', !settingsOpen);
  if (settingsOpen) {
    displayMode.focus();
  }
}

function handleKeydown(event) {
  const key = event.key;

  if (settingsOpen) {
    if (key === 'Escape' || key === 'Backspace' || key === 'Back') {
      toggleSettings(false);
      return;
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      return;
    }

    return;
  }

  switch (key) {
    case 'ArrowLeft':
      previousArtwork();
      break;
    case 'ArrowRight':
      nextArtwork();
      break;
    case 'Enter':
      toggleSettings(true);
      break;
    case 'Escape':
      break;
    default:
      break;
  }
}

displayMode.addEventListener('change', () => {
  saveSettings();
  applyDisplayMode(displayMode.value);
});

autoAdvance.addEventListener('change', () => {
  saveSettings();
  restartTimer();
});

intervalInput.addEventListener('input', () => {
  saveSettings();
  restartTimer();
});

lighting.addEventListener('change', () => {
  saveSettings();
  applyDisplayMode(displayMode.value);
});

window.addEventListener('keydown', handleKeydown);

const settingsState = loadSettings();
displayMode.value = settingsState.displayMode;
autoAdvance.value = settingsState.autoAdvance;
intervalInput.value = settingsState.interval;
lighting.value = settingsState.lighting;

renderArtwork(currentIndex);
