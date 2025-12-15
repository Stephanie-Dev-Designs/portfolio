// selecting elements
const islands = document.querySelectorAll('.island');
const challengeTitle = document.querySelector('.challenge-title');
const challengeText = document.querySelector('.challenge-text');
const userAnswer = document.getElementById('user-answer');
const submitAnswer = document.getElementById('submit-answer');
const feedback = document.querySelector('.feedback');

// challenges (same as before)
const challenges = {
  'html-island': [
    { text: "What does HTML stand for?", answers: ["Hyper Text Markup Language"] },
    { text: "Which tag is used for a paragraph?", answers: ["p"] }
  ],
  'css-island': [
    { text: "Which property changes text color?", answers: ["color"] },
    { text: "How do you make text bold in CSS?", answers: ["font-weight"] }
  ],
  'js-island': [
    { text: "How do you declare a variable in JS?", answers: ["let","const","var"] },
    { text: "Which function logs to console?", answers: ["console.log"] }
  ],
  'animation-island': [
    { text: "Which CSS property animates elements?", answers: ["animation"] },
    { text: "Which CSS property creates transitions?", answers: ["transition"] }
  ]
};

let currentIsland = '';
let currentChallenge = {};

// island click
islands.forEach(island => {
  island.addEventListener('click', () => {
    currentIsland = island.id;
    const islandChallenges = challenges[currentIsland];
    currentChallenge = islandChallenges[Math.floor(Math.random() * islandChallenges.length)];

    challengeTitle.textContent = currentIsland.replace('-island','').toUpperCase() + " Challenge";
    challengeText.textContent = currentChallenge.text;
    userAnswer.value = '';
    feedback.textContent = '';
  });
});

// submit answer
submitAnswer.addEventListener('click', () => {
  const answer = userAnswer.value.trim().toLowerCase();
  const correctAnswer = currentChallenge.answers.map(a => a.toLowerCase());

  const isCorrect = correctAnswer.some(ans => answer.includes(ans));

  if(isCorrect) {
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "Try Again!";
    feedback.style.color = "orange";
  }
});
