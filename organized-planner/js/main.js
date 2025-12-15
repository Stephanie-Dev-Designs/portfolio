// ==== Monthly Calendar ====
const monthYear = document.getElementById("month-year");
const monthDays = document.getElementById("month-days");
const date = new Date();
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let selectedDate = "";

function renderCalendar() {
  const year = date.getFullYear();
  const month = date.getMonth();
  monthYear.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  monthDays.innerHTML = "";
  for (let i=0; i<firstDay; i++) monthDays.appendChild(document.createElement("div"));

  for (let d=1; d<=lastDay; d++){
    const dayDiv = document.createElement("div");
    dayDiv.textContent = d;
    if(d===new Date().getDate() && month===new Date().getMonth()){
      dayDiv.style.background="var(--accent)";
      dayDiv.style.color="#fff";
    }
    dayDiv.addEventListener("click", ()=> openPopup(`${monthNames[month]} ${d}, ${year}`));
    monthDays.appendChild(dayDiv);
  }
}
renderCalendar();

// ==== Custom Popup ====
const popupOverlay = document.getElementById("popup-overlay");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const popupSave = document.getElementById("popup-save");
const popupClose = document.getElementById("popup-close");

function openPopup(dateStr){
  selectedDate = dateStr;
  popupTitle.textContent = `Notes for ${dateStr}`;
  popupText.value = localStorage.getItem(`note-${dateStr}`) || "";
  popupOverlay.classList.add("show");
}

popupSave.addEventListener("click", ()=>{
  localStorage.setItem(`note-${selectedDate}`, popupText.value);
  popupOverlay.classList.remove("show");
});

popupClose.addEventListener("click", ()=> popupOverlay.classList.remove("show"));
popupOverlay.addEventListener("click", (e)=>{
  if(e.target === popupOverlay) popupOverlay.classList.remove("show");
});

// ==== Weekly Notes ====
const weekNotesDiv = document.getElementById("week-notes");
const saveWeek = document.getElementById("save-week");
const clearWeek = document.getElementById("clear-week");
const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

daysOfWeek.forEach(day=>{
  const div = document.createElement("div");
  div.innerHTML = `<label>${day}</label><textarea id="note-${day}"></textarea>`;
  weekNotesDiv.appendChild(div);
});

function saveWeekNotes(){
  daysOfWeek.forEach(day=>{
    localStorage.setItem(`note-${day}`, document.getElementById(`note-${day}`).value);
  });
}
function loadWeekNotes(){
  daysOfWeek.forEach(day=>{
    document.getElementById(`note-${day}`).value = localStorage.getItem(`note-${day}`) || "";
  });
}
function clearWeekNotes(){
  daysOfWeek.forEach(day=>{
    localStorage.removeItem(`note-${day}`);
    document.getElementById(`note-${day}`).value = "";
  });
}
saveWeek.addEventListener("click", saveWeekNotes);
clearWeek.addEventListener("click", clearWeekNotes);
loadWeekNotes();

// ==== Journal with Entry List ====
const journalText = document.getElementById("journal-text");
const saveJournalBtn = document.getElementById("save-journal");
const clearJournalBtn = document.getElementById("clear-journal");

// Container for saved entries
let journalEntries = JSON.parse(localStorage.getItem("journal-entries")) || [];

function renderJournalEntries() {
  let existingList = document.getElementById("journal-list");
  if (existingList) existingList.remove();

  const list = document.createElement("div");
  list.id = "journal-list";
  list.style.marginTop = "15px";

  journalEntries.forEach((entry, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.style.background = "var(--card)";
    entryDiv.style.padding = "8px";
    entryDiv.style.marginBottom = "8px";
    entryDiv.style.borderRadius = "8px";
    entryDiv.style.boxShadow = "inset 0 0 2px rgba(0,0,0,0.1)";
    entryDiv.textContent = entry;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.padding = "4px 8px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", () => {
      journalEntries.splice(index, 1);
      localStorage.setItem("journal-entries", JSON.stringify(journalEntries));
      renderJournalEntries();
    });

    entryDiv.appendChild(deleteBtn);
    list.appendChild(entryDiv);
  });

  document.querySelector(".journal").appendChild(list);
}

// Load initial entries
renderJournalEntries();

// Save new entry
saveJournalBtn.addEventListener("click", () => {
  const value = journalText.value.trim();
  if (!value) return;
  journalEntries.push(value);
  localStorage.setItem("journal-entries", JSON.stringify(journalEntries));
  journalText.value = "";
  renderJournalEntries();
});

// Clear all entries
clearJournalBtn.addEventListener("click", () => {
  localStorage.removeItem("journal-entries");
  journalEntries = [];
  journalText.value = "";
  renderJournalEntries();
});

// ==== To-Do ====
const todoInput = document.getElementById("todo-input");
const addTodo = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");

function loadTodos(){
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todoList.innerHTML="";
  todos.forEach((t,i)=>{
    const li = document.createElement("li");
    li.innerHTML=`<span>${t}</span><button onclick="deleteTodo(${i})">X</button>`;
    todoList.appendChild(li);
  });
}
function addNewTodo(){
  if(todoInput.value.trim()==="") return;
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(todoInput.value);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoInput.value="";
  loadTodos();
}
function deleteTodo(i){
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.splice(i,1);
  localStorage.setItem("todos", JSON.stringify(todos));
  loadTodos();
}
addTodo.addEventListener("click", addNewTodo);
loadTodos();

// ==== Budget ====
const budgetDesc = document.getElementById("budget-desc");
const budgetAmount = document.getElementById("budget-amount");
const budgetType = document.getElementById("budget-type");
const budgetList = document.getElementById("budget-list");
const budgetTotal = document.getElementById("budget-total");

function loadBudget(){
  const entries = JSON.parse(localStorage.getItem("budget")) || [];
  budgetList.innerHTML="";
  let total=0;
  entries.forEach((e,i)=>{
    total += e.type==="income" ? e.amount : -e.amount;
    const li = document.createElement("li");
    li.innerHTML=`<span>${e.desc} - $${e.amount} (${e.type})</span><button onclick="deleteBudget(${i})">X</button>`;
    budgetList.appendChild(li);
  });
  budgetTotal.textContent=`Total: $${total}`;
}
function addBudget(){
  const desc=budgetDesc.value.trim();
  const amount=parseFloat(budgetAmount.value);
  const type=budgetType.value;
  if(!desc || isNaN(amount)) return;
  const entries = JSON.parse(localStorage.getItem("budget")) || [];
  entries.push({desc,amount,type});
  localStorage.setItem("budget", JSON.stringify(entries));
  budgetDesc.value="";
  budgetAmount.value="";
  loadBudget();
}
function deleteBudget(i){
  const entries = JSON.parse(localStorage.getItem("budget")) || [];
  entries.splice(i,1);
  localStorage.setItem("budget", JSON.stringify(entries));
  loadBudget();
}
document.getElementById("add-budget").addEventListener("click", addBudget);
loadBudget();

// ==== Quotes ====
const quotes = [
  {text:"Start where you are. Use what you have. Do what you can.", author:"Arthur Ashe"},
  {text:"Discipline is the bridge between goals and accomplishment.", author:"Jim Rohn"},
  {text:"The secret of getting ahead is getting started.", author:"Mark Twain"},
  {text:"It always seems impossible until it’s done.", author:"Nelson Mandela"},
  {text:"Believe you can and you're halfway there.", author:"Theodore Roosevelt"},
  {text:"Push yourself, because no one else is going to do it for you.", author:"Unknown"}
];
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");

function showQuote(){
  const today = new Date().getDate();
  const q = quotes[today % quotes.length];
  quoteText.textContent = `"${q.text}"`;
  quoteAuthor.textContent = `— ${q.author}`;
}
newQuoteBtn.addEventListener("click", ()=>{
  const q = quotes[Math.floor(Math.random()*quotes.length)];
  quoteText.textContent = `"${q.text}"`;
  quoteAuthor.textContent = `— ${q.author}`;
});
showQuote();

// ==== Theme Toggle ====
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
  themeBtn.textContent="☀️";
}

// ==== Search Filter ====
document.getElementById("search-bar").addEventListener("input",(e)=>{
  const term = e.target.value.toLowerCase();
  document.querySelectorAll("textarea, li span").forEach(el=>{
    const match = el.value?.toLowerCase().includes(term) || el.textContent.toLowerCase().includes(term);
    el.style.background = match && term ? "yellow" : "";
  });
});
