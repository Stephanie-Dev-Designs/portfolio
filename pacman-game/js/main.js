// Mini Pac-Man (vanilla JS)
// Controls: Arrow keys or WASD
// Start/Restart button resets score to 0

// ---- CONFIG ----
const TILE = 32;
const COLS = 20;
const ROWS = 15;
const CANVAS_W = COLS * TILE;
const CANVAS_H = ROWS * TILE;
const MOVE_INTERVAL = 120;

// ---- DOM ----
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const scoreEl = document.getElementById('score-value');
const startBtn = document.getElementById('start-btn');

// ---- MAP LEGEND ----
// 0 = pellet, 1 = wall, 2 = empty
const baseMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
  [1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// ---- VARIABLES ----
let map, score = 0, pelletCount = 0;
let pac = { x:9, y:7, dir:{x:0,y:0}, nextDir:{x:0,y:0}, radius:TILE*0.45 };
let ghost = { x:10, y:7, dir:{x:0,y:0}, color:'#ff6b6b' };
let gameTimer = null, running = false;
let gameWon = false;
let winSpinFrame = 0;

// ---- CUSTOM POPUP ----
let popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.top = '50%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -50%)';
popup.style.background = '#ffd23f';
popup.style.padding = '20px 40px';
popup.style.borderRadius = '12px';
popup.style.fontWeight = '700';
popup.style.fontSize = '20px';
popup.style.display = 'none';
popup.style.cursor = 'pointer';
popup.style.zIndex = '20';
popup.textContent = '';
document.body.appendChild(popup);

// ---- INIT / RESET ----
function cloneMap(m) { return m.map(r=>r.slice()); }

function resetGame() {
  map = cloneMap(baseMap);
  score = 0; pelletCount = 0;

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(map[r][c]===0 || map[r][c]===2) pelletCount++;
      if(map[r][c]===2) map[r][c]=0;
    }
  }

  pac.x = 9; pac.y = 7; pac.dir={x:0,y:0}; pac.nextDir={x:0,y:0};
  ghost.x = 10; ghost.y = 7; ghost.dir={x:0,y:0};
  running = false; // wait for first player move
  gameWon = false;
  winSpinFrame = 0;
  updateScore();
}

function updateScore(){ scoreEl.textContent = String(score); }

// ---- HELPERS ----
function tileToPx(tx){ return tx*TILE + TILE/2; }
function isWall(c,r){ return r<0||r>=ROWS||c<0||c>=COLS || map[r][c]===1; }
function canMove(c,r,d){ return !isWall(c+d.x,r+d.y); }

// ---- GAME LOOP ----
function step() {
  if(!running && !gameWon) return;

  if(!gameWon){
    // update pac direction
    if((pac.nextDir.x!==0||pac.nextDir.y!==0) && canMove(pac.x,pac.y,pac.nextDir)) pac.dir = {...pac.nextDir};

    if(pac.dir.x!==0||pac.dir.y!==0){
      if(canMove(pac.x,pac.y,pac.dir)) pac.x+=pac.dir.x, pac.y+=pac.dir.y;
      else pac.dir={x:0,y:0};
    }

    // eat pellet
    if(map[pac.y][pac.x]===0){
      map[pac.y][pac.x]=2;
      score+=10; pelletCount--;
      updateScore();
      if(pelletCount<=0){
        gameWon = true;
        running = false;
        popup.textContent = 'You won! Click Restart to play again.';
        popup.style.display = 'block';
      }
    }

    // ghost random movement
    if(Math.random()<0.35){
      const choices=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}].filter(d=>canMove(ghost.x,ghost.y,d));
      if(choices.length) ghost.dir=choices[Math.floor(Math.random()*choices.length)];
    }
    if(ghost.dir.x!==0||ghost.dir.y!==0){
      if(canMove(ghost.x,ghost.y,ghost.dir)) ghost.x+=ghost.dir.x, ghost.y+=ghost.dir.y;
      else ghost.dir={x:0,y:0};
    }

    // collision
    if(pac.x===ghost.x && pac.y===ghost.y){
      running=false; clearInterval(gameTimer);
      showLosePopup();
      return;
    }
  }

  draw();
}

// ---- DRAWING ----
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMap();

  // Pac-Man
  const px=tileToPx(pac.x), py=tileToPx(pac.y);
  ctx.save(); ctx.translate(px,py);

  if(gameWon){
    // Spin Pac-Man
    const totalFrames = 36;
    const angle = (winSpinFrame/totalFrames)*2*Math.PI;
    ctx.rotate(angle);
    winSpinFrame++;
    if(winSpinFrame > totalFrames) winSpinFrame = totalFrames;
  } else {
    // regular mouth animation
    const now=Date.now();
    const mouth=0.25+0.15*Math.abs(Math.sin(now/150));
    let angle=0;
    if(pac.dir.x===1) angle=0;
    else if(pac.dir.x===-1) angle=Math.PI;
    else if(pac.dir.y===1) angle=Math.PI/2;
    else if(pac.dir.y===-1) angle=-Math.PI/2;
    ctx.rotate(angle);
    const mouthStart = mouth, mouthEnd = 2*Math.PI-mouth;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,pac.radius,mouthStart,mouthEnd);
    ctx.closePath();
    ctx.fillStyle='#FFEB3B';
    ctx.fill();
  }

  // eye
  ctx.fillStyle='#000';
  ctx.beginPath();
  ctx.arc(pac.radius/3,-pac.radius/2.5,3,0,Math.PI*2);
  ctx.fill();
  ctx.restore();

  drawGhost(tileToPx(ghost.x),tileToPx(ghost.y),ghost.color);
}

function drawMap(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const x=c*TILE, y=r*TILE;
      if(map[r][c]===1){
        ctx.fillStyle='#16213e'; ctx.fillRect(x,y,TILE,TILE);
        ctx.fillStyle='#0b1020'; ctx.fillRect(x+4,y+4,TILE-8,TILE-8);
      } else {
        ctx.fillStyle='#03102a'; ctx.fillRect(x,y,TILE,TILE);
        if(map[r][c]===0){
          ctx.beginPath(); ctx.fillStyle='#ffd23f';
          ctx.arc(x+TILE/2,y+TILE/2,4,0,Math.PI*2); ctx.fill();
        }
      }
    }
  }
}

function drawGhost(cx,cy,color){
  ctx.save(); ctx.translate(cx,cy);
  ctx.beginPath(); ctx.fillStyle=color;
  ctx.arc(0,-TILE*0.15,TILE*0.33,Math.PI,0);
  ctx.lineTo(TILE*0.33,TILE*0.3);
  const scallops=5;
  for(let i=0;i<scallops;i++){
    const x1=TILE*0.33-(i*(TILE*0.66/(scallops-1)));
    const y1=TILE*0.3+((i%2===0)?6:-2);
    ctx.quadraticCurveTo(x1-6,TILE*0.3+6,x1-(TILE*0.66/(scallops-1)),TILE*0.3);
  }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath();
  ctx.arc(-6,-2,6,0,Math.PI*2); ctx.arc(8,-2,6,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#000'; ctx.beginPath();
  ctx.arc(-6,-2,3,0,Math.PI*2); ctx.arc(8,-2,3,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

// ---- POPUP HANDLERS ----
function showLosePopup(){
  popup.textContent = 'You were caught! Click Restart to play again.';
  popup.style.display = 'block';
}

// ---- INPUT ----
window.addEventListener('keydown',(e)=>{
  const key=e.key.toLowerCase(); let dir=null;
  if(key==='arrowleft'||key==='a') dir={x:-1,y:0};
  if(key==='arrowright'||key==='d') dir={x:1,y:0};
  if(key==='arrowup'||key==='w') dir={x:0,y:-1};
  if(key==='arrowdown'||key==='s') dir={x:0,y:1};
  if(dir){
    if(!running && !gameWon) running=true; // start game on first move
    pac.nextDir=dir; e.preventDefault();
  }
});

// ---- START / RESTART ----
function startGame(){
  popup.style.display='none';
  resetGame();
  if(gameTimer) clearInterval(gameTimer);
  gameTimer=setInterval(step,MOVE_INTERVAL);
  draw();
}

startBtn.addEventListener('click',()=>{ startGame(); });
startGame();
