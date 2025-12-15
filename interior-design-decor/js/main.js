// Drag & Drop from Toolbox to Rooms
const draggables = document.querySelectorAll('.draggable');
const rooms = document.querySelectorAll('.room');

draggables.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text', e.target.dataset.type);
  });
});

rooms.forEach(room => {
  room.addEventListener('dragover', e => e.preventDefault());
  room.addEventListener('drop', e => {
    const type = e.dataTransfer.getData('text');
    const el = document.createElement('div');
    el.classList.add('item');
    el.textContent = getEmoji(type);
    el.style.left = `${e.offsetX - 14}px`;
    el.style.top = `${e.offsetY - 14}px`;
    el.addEventListener('click', () => el.remove());
    room.appendChild(el);
  });
});

function getEmoji(type) {
  if(type === 'plant') return '🌿';
  if(type === 'tree') return '🌳';
  if(type === 'lamp') return '💡';
  return '❓';
}

// Color Palette
const colors = document.querySelectorAll('.color');
const preview = document.querySelector('.color-preview');
let selectedColor = null;

colors.forEach(c => {
  c.addEventListener('click', () => {
    selectedColor = c.style.background;
    preview.style.background = selectedColor;
  });
});

rooms.forEach(room => {
  room.addEventListener('click', () => {
    if(selectedColor) room.style.background = selectedColor;
  });
});
// Drag & Drop from Toolbox to Rooms
const draggables = document.querySelectorAll('.draggable');
const rooms = document.querySelectorAll('.room');

draggables.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text', e.target.dataset.type);
  });
});

rooms.forEach(room => {
  room.addEventListener('dragover', e => e.preventDefault());
  room.addEventListener('drop', e => {
    const type = e.dataTransfer.getData('text');
    const el = document.createElement('div');
    el.classList.add('item');
    el.textContent = getEmoji(type);
    el.style.left = `${e.offsetX - 14}px`;
    el.style.top = `${e.offsetY - 14}px`;
    el.addEventListener('click', () => el.remove());
    room.appendChild(el);
  });
});

function getEmoji(type) {
  if(type === 'plant') return '🌿';
  if(type === 'tree') return '🌳';
  if(type === 'lamp') return '💡';
  return '❓';
}

// Color Palette
const colors = document.querySelectorAll('.color');
const preview = document.querySelector('.color-preview');
let selectedColor = null;

colors.forEach(c => {
  c.addEventListener('click', () => {
    selectedColor = c.style.background;
    preview.style.background = selectedColor;
  });
});

rooms.forEach(room => {
  room.addEventListener('click', () => {
    if(selectedColor) room.style.background = selectedColor;
  });
});
