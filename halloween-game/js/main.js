// nav starts
const enterBtn = document.getElementById('enter-btn');
const homePage = document.getElementById('home-page');
const gamesPage = document.getElementById('games-page');
const backToHome = document.getElementById('back-to-home');
const gameButtons = document.querySelectorAll('.game-btn');

enterBtn.addEventListener('click', () => {
  homePage.style.display = 'none';
  gamesPage.style.display = 'flex';
});

backToHome.addEventListener('click', () => {
  gamesPage.style.display = 'none';
  homePage.style.display = 'flex';
  document.querySelectorAll('.game-container').forEach(g => g.style.display = 'none');
});

gameButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const gameId = btn.getAttribute('data-game');
    document.querySelectorAll('.game-container').forEach(g => g.style.display = 'none');
    const selectedGame = document.getElementById(gameId);
    if (selectedGame) selectedGame.style.display = 'flex';

    if (gameId === "shadow-game") startShadowGame();
    if (gameId === "garden-game") startGardenGame();
  });
});
// nav ends

// shadow game starts
function startShadowGame() {
  const player = document.getElementById('player');
  const shadow = document.getElementById('shadow');
  const flashlight = document.getElementById('flashlight');
  const fearBar = document.getElementById('fear-bar');
  const batteryBar = document.getElementById('battery-bar');
  const message = document.getElementById('message');
  const gameContainer = document.getElementById('shadow-game');
  const audio = document.getElementById('background-audio');
  const objects = document.querySelectorAll('#shadow-game .object');

  let playerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let shadowPos = { x: 100, y: 100 };
  let fear = 0, maxFear = 100, speed = 10, battery = 100;

  audio.play();

  window.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowUp': playerPos.y -= speed; break;
      case 'ArrowDown': playerPos.y += speed; break;
      case 'ArrowLeft': playerPos.x -= speed; break;
      case 'ArrowRight': playerPos.x += speed; break;
    }
    player.style.top = `${playerPos.y}px`;
    player.style.left = `${playerPos.x}px`;
  });

  window.addEventListener('mousemove', e => {
    flashlight.style.top = `${e.clientY - 150}px`;
    flashlight.style.left = `${e.clientX - 150}px`;
  });

  function drainBattery() {
    battery -= 0.05;
    if(battery < 0) battery = 0;
    batteryBar.style.width = `${battery}%`;
    requestAnimationFrame(drainBattery);
  }
  drainBattery();

  objects.forEach(obj => {
    obj.addEventListener('click', () => {
      message.textContent = "You clicked an object! Shadow distracted!";
      shadowPos.x = parseInt(obj.style.left);
      shadowPos.y = parseInt(obj.style.top);
      fear -= 10;
      if(fear < 0) fear = 0;
    });
  });

  function moveShadow() {
    let dx = playerPos.x - shadowPos.x;
    let dy = playerPos.y - shadowPos.y;
    let shadowSpeed = battery > 0 ? 0.02 : 0.01;
    shadowPos.x += dx * shadowSpeed;
    shadowPos.y += dy * shadowSpeed;
    shadow.style.top = `${shadowPos.y}px`;
    shadow.style.left = `${shadowPos.x}px`;

    let distance = Math.hypot(dx, dy);
    if(distance < 200) {
      fear += 0.5;
      gameContainer.classList.add('flicker');
    } else {
      fear -= 0.2;
      gameContainer.classList.remove('flicker');
    }

    if(fear < 0) fear = 0;
    if(fear > maxFear) {
      fear = maxFear;
      message.textContent = "The shadow got you... Game Over!";
      cancelAnimationFrame(animationFrame);
    }

    fearBar.style.width = `${fear}%`;
    animationFrame = requestAnimationFrame(moveShadow);
  }

  let animationFrame = requestAnimationFrame(moveShadow);
}
// shadow game ends

// garden of bones starts
function startGardenGame() {
  const boneCraft = document.getElementById('bone-craft-game');
  const hiddenBonesContainer = document.getElementById('hidden-bones-container');
  const hiddenBones = hiddenBonesContainer.querySelectorAll('.hidden-bone');
  const boneScoreEl = document.getElementById('bone-score');
  const clearBtn = document.getElementById('clear-grid');

  let boneScore = 0;
  let clueFound = false;

  // create 5x5 grid
  boneCraft.innerHTML = '';
  const cells = [];
  for(let r=0; r<5; r++){
    for(let c=0; c<5; c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = '';
      boneCraft.appendChild(cell);
      cells.push(cell);

      cell.addEventListener('click', () => {
        if(cell.textContent === ''){
          cell.textContent = '🦴';
        } else {
          cell.textContent = '';
        }
        updateScore();
        checkClue();
      });
    }
  }

  // reset hidden bones
  hiddenBones.forEach(bone => bone.style.display = 'none');

  // clear grid button
  clearBtn.onclick = () => {
    cells.forEach(cell => cell.textContent = '');
    boneScore = 0;
    clueFound = false;
    boneScoreEl.textContent = `Bones Collected: ${boneScore}`;
    hiddenBones.forEach(bone => bone.style.display = 'none');
  }

  // update score
  function updateScore(){
    boneScore = cells.filter(cell => cell.textContent === '🦴').length;
    boneScoreEl.textContent = `Bones Collected: ${boneScore}`;
  }

  // show hidden bones when 8+ placed
  function checkClue(){
    if(!clueFound && boneScore >= 8){
      clueFound = true;
      hiddenBones.forEach(bone => bone.style.display = 'inline-block');
    }
  }

  // initialize score
  updateScore();
}
// garden of bones ends
