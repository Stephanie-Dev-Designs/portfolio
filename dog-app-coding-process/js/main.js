/* app.js
   Dog walking app - full functionality
   Data persisted in localStorage
*/

(() => {
  // ------- Utilities & storage helpers -------
  const LS = {
    users: 'dogapp_users',
    session: 'dogapp_session',
    events: 'dogapp_events',
    contacts: 'dogapp_contacts',
    threads: 'dogapp_threads',
    settings: 'dogapp_settings',
  };

  // sel short fo selector
  const qs = sel => document.querySelector(sel); 
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  const read = (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };
  const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  if (!read(LS.users, null)) write(LS.users, []);
  if (!read(LS.events, null)) write(LS.events, []);
  if (!read(LS.contacts, null)) write(LS.contacts, []);
  if (!read(LS.threads, null)) write(LS.threads, {});
  if (!read(LS.settings, null)) write(LS.settings, {theme:'light', accent:'pink'});

  // ------- Element refs -------
  const authView = qs('#auth');
  const appView = qs('#app');
  const formLogin = qs('#form-login');
  const formSignup = qs('#form-signup');
  const tabLogin = qs('#tab-login'), tabSignup = qs('#tab-signup');
  const logoutBtn = qs('#logoutBtn');
  const sidebar = qs('#sidebar');
  const pageTitle = qs('#page-title');
  const userMini = qs('#user-mini');
  const welcomeName = qs('#welcome-name');
  const welcomeSub = qs('#welcome-sub');
  const upcomingList = qs('#upcoming-list');
  const quickEventForm = qs('#quick-event-form');
  const qeTitle = qs('#qe-title'), qeDate = qs('#qe-date'), qeTime = qs('#qe-time');
  const pageEls = {
    dashboard: qs('#page-dashboard'),
    calendar: qs('#page-calendar'),
    events: qs('#page-events'),
    messenger: qs('#page-messenger'),
    updates: qs('#page-updates'),
    settings: qs('#page-settings')
  };
  const navBtns = qsa('.nav-btn');
  const mobileNavBtns = qsa('#mobile-nav .nav-btn');
  const calendarRoot = qs('#calendar');
  const calMonthLabel = qs('#calendar-month');
  const prevMonthBtn = qs('#prev-month'), nextMonthBtn = qs('#next-month');
  const addEventBtn = qs('#add-event-btn');
  const eventsList = qs('#events-list');
  const addBdayBtn = qs('#add-bday');
  const contactsListEl = qs('#contacts-list');
  const addContactBtn = qs('#add-contact-btn');
  const chatTitle = qs('#chat-title');
  const chatMessages = qs('#chat-messages');
  const chatForm = qs('#chat-form');
  const chatInput = qs('#chat-input');
  const updatesFeed = qs('#updates-feed');
  const themeToggle = qs('#theme-toggle');
  const modalRoot = qs('#modal-root');
  const pageContent = qs('#content');
  const menuToggle = qs('#menu-toggle');
  const avatarEl = qs('#avatar');
  const globalSearch = qs('#global-search');
  const deleteAccountBtn = qs('#delete-account');
  const accentSelect = qs('#accent-select');

  // small state
  let state = {
    currentPage: 'dashboard',
    currentUser: null,
    calendarDate: new Date(),
    selectedThread: null
  };

  // ------- AUTH / SESSION -------
  function findUserByUsername(u){
    return read(LS.users, []).find(x => x.username === u);
  }

  function createUser({username, displayName, password}){
    const users = read(LS.users, []);
    if (users.some(u => u.username === username)) return null;
    const newUser = {
      id: 'u_' + Date.now(),
      username, displayName, password,
      createdAt: Date.now()
    };
    users.push(newUser);
    write(LS.users, users);
    return newUser;
  }

  function loginUser(username, password){
    const user = findUserByUsername(username);
    if (!user || user.password !== password) return null;
    state.currentUser = user;
    return user;
  }

  function logout(){
    localStorage.removeItem(LS.session);
    state.currentUser = null;
    showAuth();
  }

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    formLogin.classList.remove('hidden'); formSignup.classList.add('hidden');
    formSignup.setAttribute('aria-hidden','true'); formLogin.setAttribute('aria-hidden','false');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    formSignup.classList.remove('hidden'); formLogin.classList.add('hidden');
    formSignup.setAttribute('aria-hidden','false'); formLogin.setAttribute('aria-hidden','true');
  });

  formSignup.addEventListener('submit', e => {
    e.preventDefault();
    const username = qs('#signup-username').value.trim();
    const display = qs('#signup-display').value.trim();
    const password = qs('#signup-password').value;
    if (!username || !display || !password) return alert('fill fields');
    const created = createUser({username, displayName: display, password});
    if (!created) return alert('username exists');
    loginUser(username, password);
    refreshUI();
    showApp();
  });

  formLogin.addEventListener('submit', e => {
    e.preventDefault();
    const username = qs('#login-username').value.trim();
    const password = qs('#login-password').value;
    const user = loginUser(username, password);
    if (!user) return alert('Invalid credentials');
    refreshUI();
    showApp();
  });

  logoutBtn.addEventListener('click', logout);

  // ------- UI helpers -------
  function showAuth(){
    authView.style.display = 'flex';
    appView.classList.add('hidden');
    authView.setAttribute('aria-hidden','false');
    appView.setAttribute('aria-hidden','true');
  }

  function showApp(){
    authView.style.display = 'none';
    appView.classList.remove('hidden');
    authView.setAttribute('aria-hidden','true');
    appView.setAttribute('aria-hidden','false');
    goToPage(state.currentPage);
    renderAll();
  }

  function refreshUI(){
    if (state.currentUser){
      userMini.textContent = `${state.currentUser.displayName || state.currentUser.username}`;
      welcomeName.textContent = state.currentUser.displayName || state.currentUser.username;
      welcomeSub.textContent = `You're signed in as ${state.currentUser.username}`;
      avatarEl.textContent = (state.currentUser.displayName||'')[0] || '🐶';
    }
  }

  // ------- Simple router -------
  function goToPage(page){
    state.currentPage = page;
    pageTitle.textContent = page[0].toUpperCase() + page.slice(1);
    for (const k in pageEls){
      const el = pageEls[k];
      if (k === page) { el.classList.remove('hidden'); el.setAttribute('aria-hidden','false'); }
      else { el.classList.add('hidden'); el.setAttribute('aria-hidden','true'); }
    }
    qsa('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
    renderAll();
  }

  navBtns.forEach(b => b.addEventListener('click', () => goToPage(b.dataset.page)));
  mobileNavBtns.forEach(b => b.addEventListener('click', () => goToPage(b.dataset.page)));

  menuToggle.addEventListener('click', () => {
    sidebar.style.display = sidebar.style.display === 'none' ? '' : 'none';
  });

  // ------- Calendar Implementation -------
  function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
  function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1,0); }

  function formatISODate(d){
    if (typeof d === 'string') return d;
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  function renderCalendar(){
    const base = state.calendarDate;
    const start = startOfMonth(base);
    const end = endOfMonth(base);
    const firstDayWeek = start.getDay(); // 0-6
    calMonthLabel.textContent = base.toLocaleString(undefined, {month:'long', year:'numeric'});
    calendarRoot.innerHTML = '';

    // prev month days
    const prevEnd = new Date(start.getFullYear(), start.getMonth(), 0).getDate();
    for (let i = firstDayWeek-1; i >= 0; i--){
      const dayNum = prevEnd - i;
      const day = document.createElement('div');
      day.className = 'day other';
      day.innerHTML = `<div class="date">${dayNum}</div>`;
      calendarRoot.appendChild(day);
    }

    // current month days
    for (let d = 1; d <= end.getDate(); d++){
      const day = document.createElement('div');
      day.className = 'day';
      day.dataset.date = formatISODate(new Date(base.getFullYear(), base.getMonth(), d));
      day.innerHTML = `<div class="date">${d}</div>`;
      day.addEventListener('click', () => openAddEventModal(day.dataset.date));
      calendarRoot.appendChild(day);
    }

    // fill until 42 cells total
    const existing = calendarRoot.children.length;
    for (let i = 0; i < (42 - existing); i++){
      const day = document.createElement('div');
      day.className = 'day other';
      calendarRoot.appendChild(day);
    }

    // add event .calendar-event name changed to 
    const events = read(LS.events, []);
    events.forEach(ev => {
      const el = calendarRoot.querySelector(`.day[data-date="${ev.date}"]`);
      if (el){
        const pill = document.createElement('span');
        pill.className = 'calendar-event';
        pill.textContent = `${ev.title} ${ev.time || ''}`;
        pill.title = ev.title;
        pill.addEventListener('click', evnt => {
          evnt.stopPropagation();
          openEventDetail(ev.id);
        });
        el.appendChild(pill);
      }
    });
  }

  prevMonthBtn.addEventListener('click', () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth()-1, 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener('click', () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth()+1, 1);
    renderCalendar();
  });

  // ------- Top-level render -------
  function renderAll(){
    refreshUI();
    renderCalendar();
    renderEventsList();
    renderContactsSidebar();
    renderThread();
    renderUpcoming();
    renderUpdates();
  }

  // ------- Initialize -------
  function init(){
    showAuth();
    state.calendarDate = new Date();
    renderAll();
  }

  init(); //  init is short for initialize, when at the bottom it's because the functions were all defined first

})();
