const questions = {
    html: [
      "Create an HTML paragraph with the text 'Hello World'.",
      "Make an ordered list with 3 items: Apple, Banana, Cherry.",
      "Add an image with src='image.png' and alt='My Image'."
    ],
    css: [
      "Make all paragraphs have red text color.",
      "Set the background color of the body to lightblue.",
      "Make a div with class 'box' 100px by 100px and green background."
    ],
    js: [
      "Create a variable called 'score' and set it to 0.",
      "Write a function that adds two numbers.",
      "Log 'Hello World' to the console."
    ],
    animation: [
      "Animate a div to move from left to right using CSS.",
      "Make an element fade in using CSS animation.",
      "Create a bouncing ball effect using CSS keyframes."
    ]
  };
  
  let score = 0;
  const islands = document.querySelectorAll('.island');
  const questionContainer = document.getElementById('question-container');
  const submitBtn = document.getElementById('submitBtn');
  const answerInput = document.getElementById('answer');
  const scoreDisplay = document.getElementById('score');
  
  let currentQuestion = "";
  
  // Click on island to get a question
  islands.forEach(island => {
    island.addEventListener('click', () => {
      const type = island.dataset.island;
      const randomIndex = Math.floor(Math.random() * questions[type].length);
      currentQuestion = questions[type][randomIndex];
      questionContainer.textContent = currentQuestion;
      answerInput.value = "";
    });
  });
  
  // Submit answer
  submitBtn.addEventListener('click', () => {
    if (answerInput.value.trim() !== "") {
      score++;
      scoreDisplay.textContent = score;
      questionContainer.textContent = "Great! Click an island for another question.";
      answerInput.value = "";
    } else {
      alert("Please write your answer before submitting!");
    }
  });
  