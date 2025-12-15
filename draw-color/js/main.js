const canvas = document.getElementById('drawing-area');
const ctx = canvas.getContext('2d');
const colors = document.querySelectorAll('.color');
const brush = document.getElementById('brush');
const clearBtn = document.getElementById('clear');

let currentColor = 'black';
let lineWidth = 5;
let drawing = false;

// dynamically resize canvas to container
function resizeCanvas() {
  const wrapper = canvas.parentElement;
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientWidth * 0.6; // maintain aspect ratio
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Set color when a color box is clicked
colors.forEach(color => {
  color.addEventListener('click', () => {
    currentColor = color.style.backgroundColor;
  });
});

// Set brush size
brush.addEventListener('change', () => lineWidth = brush.value);

// Clear canvas
clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Drawing events
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => stopDrawing());
canvas.addEventListener('mouseleave', () => stopDrawing());
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', e => startTouch(e));
canvas.addEventListener('touchmove', e => moveTouch(e));
canvas.addEventListener('touchend', stopDrawing);

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = currentColor;

  const rect = canvas.getBoundingClientRect();
  const x = e.offsetX !== undefined ? e.offsetX : e.clientX - rect.left;
  const y = e.offsetY !== undefined ? e.offsetY : e.clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Touch helpers
function startTouch(e) {
  drawing = true;
  const touch = e.touches[0];
  draw({ clientX: touch.clientX, clientY: touch.clientY });
}

function moveTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  draw({ clientX: touch.clientX, clientY: touch.clientY });
}
