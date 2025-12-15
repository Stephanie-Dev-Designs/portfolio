const track = document.querySelector('.carousel-track');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const prev = document.querySelector('.carousel-arrow.prev');
const next = document.querySelector('.carousel-arrow.next');
const previewWrap = document.querySelector('.preview-wrap');

let index = 0;
let visible = 4;

function updateVisible() {
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const itemWidth = items[0].getBoundingClientRect().width + gap;
  const containerWidth = track.getBoundingClientRect().width + gap;
  visible = Math.max(1, Math.floor(containerWidth / itemWidth));
}

function updateSlide() {
  updateVisible();
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const move = visible * (items[0].getBoundingClientRect().width + gap);
  const maxTranslate = Math.max(0, track.scrollWidth - track.clientWidth);
  const translate = Math.min(index * move, maxTranslate);
  track.style.transform = `translateX(-${translate}px)`;

  prev.classList.toggle('hidden', translate === 0);
  next.classList.toggle('hidden', translate >= maxTranslate - 1);

  // Corrected preview logic
  const currentPreview = previewWrap.querySelector('.preview.show');
  if (currentPreview) {
    const currentImg = currentPreview.querySelector('img');
    const visibleItems = getVisibleItems();
    const stillVisible = visibleItems.some(it => it.querySelector('img') === currentImg);
    // Only update preview if the currently showing image is still visible
    if (!stillVisible) return;
  }
}

function getVisibleItems() {
  const trackRect = track.getBoundingClientRect();
  return items.filter(it => {
    const r = it.getBoundingClientRect();
    return r.right <= trackRect.right + 1 && r.left >= trackRect.left - 1;
  });
}

next.addEventListener('click', () => { index += 1; updateSlide(); });
prev.addEventListener('click', () => { index = Math.max(0, index - 1); updateSlide(); });
window.addEventListener('resize', updateSlide);
window.addEventListener('load', updateSlide);

items.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img) return;
    showPreview(img.src, item.dataset.caption || '');
  });
});

function showPreview(src, caption = '') {
  const existing = previewWrap.querySelector('.preview');
  if (!existing) {
    const card = buildPreviewCard(src, caption);
    previewWrap.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));
    return;
  }

  const currentImg = existing.querySelector('.preview-image img');
  if (currentImg && currentImg.src === src) {
    existing.classList.add('show');
    return;
  }

  existing.classList.remove('show');
  existing.classList.add('hide');

  existing.addEventListener('transitionend', function handler(e) {
    if (e.propertyName !== 'opacity') return;
    existing.removeEventListener('transitionend', handler);
    const newCard = buildPreviewCard(src, caption);
    previewWrap.replaceChild(newCard, existing);
    requestAnimationFrame(() => newCard.classList.add('show'));
  });
}

function buildPreviewCard(src, caption) {
  const card = document.createElement('div');
  card.className = 'preview';

  const imgCol = document.createElement('div');
  imgCol.className = 'preview-image';
  const img = document.createElement('img');
  img.src = src;
  img.alt = caption || 'Preview image';
  imgCol.appendChild(img);

  const textCol = document.createElement('div');
  textCol.className = 'preview-text';
  const p = document.createElement('p');
  p.textContent = caption;
  textCol.appendChild(p);

  card.appendChild(imgCol);
  card.appendChild(textCol);
  return card;
}
