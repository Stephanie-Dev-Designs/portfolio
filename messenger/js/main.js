const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-chat');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const dateDisplay = document.getElementById('date-display');
const seasonSelect = document.getElementById('season-select');
const emoticons = document.querySelectorAll('#emoticons span');
const addUserBtn = document.getElementById('add-user');
const removeUserBtn = document.getElementById('remove-user');
const userInput = document.getElementById('user-input');
const usersDiv = document.getElementById('users');

let currentUser = "You";

/* ===== Date ===== */
function updateDate() {
  const date = new Date();
  const options = { day: 'numeric', month: 'long' };
  dateDisplay.textContent = date.toLocaleDateString(undefined, options);
}
updateDate();

/* ===== Theme Toggle ===== */
themeToggle.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'light' ? 'dark' : 'light';
});

/* ===== Seasonal Background (solid colors) ===== */
seasonSelect.addEventListener('change', (e) => {
  const season = e.target.value;
  switch (season) {
    case 'autumn':
      body.style.backgroundColor = 'orange';
      break;
    case 'winter':
      body.style.backgroundColor = '#2c3e50';
      break;
    case 'spring':
      body.style.backgroundColor = 'lightgreen';
      break;
    case 'summer':
      body.style.backgroundColor = 'skyblue';
      break;
    default:
      body.style.backgroundColor = '';
  }
});

/* ===== Chat Functions ===== */
function addMessage(text, userClass = '') {
  const msg = document.createElement('div');
  msg.classList.add('message');
  if (userClass) msg.classList.add(userClass);
  msg.textContent = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.addEventListener('click', () => {
  if (messageInput.value.trim() !== '') {
    addMessage(`${currentUser}: ${messageInput.value}`, 'user');
    messageInput.value = '';
  }
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

clearBtn.addEventListener('click', () => {
  chatContainer.innerHTML = '';
});

/* ===== Emoticons ===== */
emoticons.forEach(em => {
  em.addEventListener('click', () => {
    messageInput.value += em.textContent;
    messageInput.focus();
  });
});

/* ===== User Add / Remove ===== */
addUserBtn.addEventListener('click', () => {
  const name = userInput.value.trim();
  if (!name) return alert('Enter a name first!');

  // Check if user already exists
  const exists = Array.from(usersDiv.children).some(btn => btn.textContent === name);
  if (exists) return alert('That user already exists!');

  const userBtn = document.createElement('button');
  userBtn.textContent = name;
  userBtn.addEventListener('click', () => currentUser = name);
  usersDiv.appendChild(userBtn);

  userInput.value = '';
});

removeUserBtn.addEventListener('click', () => {
  const name = userInput.value.trim();
  if (!name) return alert('Enter a name to remove!');

  const userBtn = Array.from(usersDiv.children).find(btn => btn.textContent === name);
  if (userBtn) {
    usersDiv.removeChild(userBtn);
    if (currentUser === name) currentUser = "You";
  } else {
    alert('No user found with that name.');
  }

  userInput.value = '';
});
