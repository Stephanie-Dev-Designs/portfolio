const gameBoard = document.getElementById('gameBoard');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

let cards = ['🐬','🐬','🦈','🦈','🐚','🐚','🏖️','🏖️','🌊','🌊','🦀','🦀','🪸','🪸','🐙','🐙'];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
    gameBoard.innerHTML = '';
    shuffle(cards).forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetTurn();
        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function checkWin() {
    if (document.querySelectorAll('.card:not(.flipped)').length === 0) {
        message.textContent = "🎉 You matched all pairs!";
    }
}

resetBtn.addEventListener('click', () => {
    createBoard();
    message.textContent = '';
});

function checkWin() {
    if (document.querySelectorAll('.card:not(.flipped)').length === 0) {
        message.textContent = "🎉 You matched all pairs!";
    }
}

resetBtn.addEventListener('click', () => {
    createBoard();
    message.textContent = '';
});

createBoard();
