/* app.js
   Basic single-file app logic for demo.
   Data persisted to localStorage.
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

  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  // read / write helpers
  const read = (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  };
  const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  // init default stores
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

  // NOTE: per user choice (1.b) we DO NOT persist session across reloads.
  // loginUser sets state.currentUser but does NOT write session to localStorage.
  function loginUser(username, password){
    const user = findUserByUsername(username);
    if (!user || user.password !== password) return null;
    // do not persist session to localStorage (user chose no persistent login)
    state.currentUser = user;
    return user;
  }

  function logout(){
    // always clear any session marker just in case, then show auth
    localStorage.removeItem(LS.session);
    state.currentUser = null;
    showAuth();
  }

  function restoreSession(){
    // kept for compatibility, but because persistent login is disabled in this build,
    // this will not automatically restore a session (returns null).
    const sess = read(LS.session, null);
    if (!sess) return null;
    const users = read(LS.users, []);
    const user = users.find(u => u.id === sess.userId);
    if (user) state.currentUser = user;
    return user;
  }

  // Forms
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

  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = qs('#signup-username').value.trim();
    const display = qs('#signup-display').value.trim();
    const password = qs('#signup-password').value;
    if (!username || !display || !password) return alert('fill fields');
    const created = createUser({username, displayName: display, password});
    if (!created) return alert('username exists');
    // login in-memory (no persistent session)
    loginUser(username, password);
    refreshUI();
    showApp();
  });

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = qs('#login-username').value.trim();
    const password = qs('#login-password').value;
    const user = loginUser(username, password);
    if (!user) return alert('Invalid credentials');
    refreshUI();
    showApp();
  });

  logoutBtn.addEventListener('click', () => {
    logout();
  });

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
    // mobile nav visible toggle
    if (window.innerWidth <= 900) {
      qs('#mobile-nav').setAttribute('aria-hidden', 'false');
    }
    // notify nav active
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
      // attach events for day
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

    // add event pills
    const events = read(LS.events, []);
    events.forEach(ev => {
      const el = calendarRoot.querySelector(`.day[data-date="${ev.date}"]`);
      if (el){
        const pill = document.createElement('span');
        pill.className = 'event-pill';
        pill.textContent = `${ev.title} ${ev.time || ''}`;
        pill.title = ev.title;
        pill.addEventListener('click', (evnt) => {
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

  // quick add
  quickEventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = qeTitle.value.trim();
    const date = qeDate.value;
    const time = qeTime.value;
    if (!title || !date || !time) return alert('Please fill fields');
    addEvent({title, date, time});
    qeTitle.value = ''; qeDate.value=''; qeTime.value='';
    goToPage('calendar');
    renderAll();
  });

  // ------- Events store & UI -------
  function formatISODate(d){
    if (typeof d === 'string') return d;
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }

  function addEvent({title, date, time, duration=60, location='', invites=[]}){
    const events = read(LS.events, []);
    const ev = {id:'ev_'+Date.now(), title, date, time, duration, location, invites, createdBy: state.currentUser?.id || null};
    events.push(ev);
    write(LS.events, events);
    toast('Event added');
  }

  function openAddEventModal(date){
    const modal = createModal(`
      <h3>Add Event</h3>
      <form id="modal-add-event">
        <label>Title <input id="m-title" required /></label>
        <label>Date <input id="m-date" type="date" value="${date || ''}" required /></label>
        <label>Time <input id="m-time" type="time" required /></label>
        <label>Location <input id="m-loc"/></label>
        <label>Invite contacts (comma usernames) <input id="m-inv" placeholder="sam, jess"/></label>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
          <button id="cancel" class="btn">Cancel</button>
          <button id="save" class="btn primary" type="submit">Save</button>
        </div>
      </form>
    `);
    modalRoot.appendChild(modal);
    modalRoot.style.pointerEvents = 'auto';
    modalRoot.setAttribute('aria-hidden','false');

    modal.querySelector('#cancel').addEventListener('click', (e) => { e.preventDefault(); closeModal(modal); });
    modal.querySelector('#modal-add-event').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = modal.querySelector('#m-title').value.trim();
      const dateVal = modal.querySelector('#m-date').value;
      const time = modal.querySelector('#m-time').value;
      const loc = modal.querySelector('#m-loc').value.trim();
      const invText = modal.querySelector('#m-inv').value.trim();
      const invites = invText ? invText.split(',').map(s=>s.trim()).filter(Boolean).map(u=> {
        const c = read(LS.contacts, []).find(x=>x.username === u);
        return c ? c.id : null;
      }).filter(Boolean) : [];
      addEvent({title, date:dateVal, time, location:loc, invites});
      closeModal(modal);
      renderAll();
    });
  }

  function openEventDetail(id){
    const events = read(LS.events, []);
    const ev = events.find(x=>x.id===id);
    if (!ev) return;
    const modal = createModal(`
      <h3>${ev.title}</h3>
      <p class="small muted">${ev.date} ${ev.time || ''}</p>
      <p>${ev.location || ''}</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button id="close" class="btn">Close</button>
        <button id="del" class="btn danger">Delete</button>
      </div>
    `);
    modalRoot.appendChild(modal);
    modalRoot.style.pointerEvents = 'auto';
    modalRoot.setAttribute('aria-hidden','false');

    modal.querySelector('#close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#del').addEventListener('click', () => {
      const filtered = read(LS.events, []).filter(x=>x.id !== id);
      write(LS.events, filtered);
      closeModal(modal);
      renderAll();
      toast('Event deleted');
    });
  }

  // events page list
  addBdayBtn.addEventListener('click', () => openAddEventModal(formatISODate(new Date())));
  function renderEventsList(){
    const events = read(LS.events, []);
    eventsList.innerHTML = '';
    events.sort((a,b)=>a.date.localeCompare(b.date));
    if (!events.length) eventsList.innerHTML = '<div class="card muted">No events yet — add one.</div>';
    events.forEach(ev => {
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `<h4>${ev.title}</h4><p class="small muted">${ev.date} ${ev.time||''}</p><p>${ev.location||''}</p>
        <div class="form-actions"><button class="btn" data-id="${ev.id}">Open</button><button class="btn danger" data-del="${ev.id}">Delete</button></div>`;
      eventsList.appendChild(c);
      c.querySelector('[data-id]')?.addEventListener('click', () => openEventDetail(ev.id));
      c.querySelector('[data-del]')?.addEventListener('click', () => {
        write(LS.events, read(LS.events,[]).filter(x=>x.id!==ev.id));
        renderAll();
      });
    });
  }

  // ------- Contacts & Messenger -------
  addContactBtn.addEventListener('click', () => {
    const modal = createModal(`
      <h3>Add Contact</h3>
      <form id="modal-add-contact">
        <label>Username <input id="c-username" required /></label>
        <label>Name <input id="c-name" /></label>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
          <button id="c-cancel" class="btn">Cancel</button>
          <button id="c-save" class="btn primary">Add</button>
        </div>
      </form>
    `);
    modalRoot.appendChild(modal); modalRoot.style.pointerEvents = 'auto'; modalRoot.setAttribute('aria-hidden','false');
    modal.querySelector('#c-cancel').addEventListener('click', () => closeModal(modal));
    modal.querySelector('#modal-add-contact').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = modal.querySelector('#c-username').value.trim();
      const name = modal.querySelector('#c-name').value.trim() || username;
      if (!username) return;
      const contacts = read(LS.contacts, []);
      if (contacts.some(c=>c.username===username)) return alert('Contact exists');
      const contact = {id:'c_'+Date.now(), username, name, createdAt:Date.now()};
      contacts.push(contact);
      write(LS.contacts, contacts);
      closeModal(modal);
      renderContacts();
      toast('Contact added');
    });
  });

  function renderContacts(){
    const contacts = read(LS.contacts, []);
    contactsListEl.innerHTML = '';
    if (!contacts.length) contactsListEl.innerHTML = '<li class="muted small">No contacts — add some</li>';
    contacts.forEach(c => {
      const li = document.createElement('li');
      li.className = 'contact-item';
      li.innerHTML = `<div class="avatar small">🐕</div><div class="name">${c.name} <div class="muted small">@${c.username}</div></div>
        <div style="margin-left:auto;display:flex;gap:6px"><button class="btn" data-chat="${c.id}">Chat</button><button class="btn" data-del="${c.id}">Del</button></div>`;
      contactsListEl.appendChild(li);
      li.querySelector('[data-chat]').addEventListener('click', () => openThreadWith(c.id));
      li.querySelector('[data-del]').addEventListener('click', () => {
        if (!confirm('Delete contact?')) return;
        write(LS.contacts, read(LS.contacts,[]).filter(x=>x.id!==c.id));
        // also remove invites etc (not mandatory)
        renderContacts();
      });
    });
  }

  // Threads storage: object mapping threadId => thread obj
  function openThreadWith(contactId){
    const threads = read(LS.threads, {});
    // define thread id deterministically for 1:1
    const tid = 't_' + [state.currentUser.id, contactId].sort().join('_');
    if (!threads[tid]) {
      threads[tid] = {id: tid, members: [state.currentUser.id, contactId], messages: []};
      write(LS.threads, threads);
    }
    state.selectedThread = tid;
    renderThread();
    goToPage('messenger');
  }

  function renderContactsSidebar(){
    renderContacts();
  }

  function renderThread(){
    chatMessages.innerHTML = '';
    const threads = read(LS.threads, {});
    const t = threads[state.selectedThread];
    if (!t){ chatTitle.textContent = 'Select a contact'; return; }
    // compute display name
    const otherId = t.members.find(m => m !== state.currentUser.id);
    const other = read(LS.contacts, []).find(c=>c.id===otherId) || {name:otherId, username:otherId};
    chatTitle.textContent = other.name || other.username;
    t.messages.forEach(m => {
      const div = document.createElement('div');
      div.className = 'msg ' + (m.from === state.currentUser.id ? 'me' : 'them');
      div.textContent = m.text;
      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !state.selectedThread) return;
    const threads = read(LS.threads, {});
    const t = threads[state.selectedThread];
    const msg = {id:'m_'+Date.now(), from: state.currentUser.id, text, ts:Date.now()};
    t.messages.push(msg);
    write(LS.threads, threads);
    chatInput.value = '';
    renderThread();
    // update updates feed
    toast('Message sent');
    renderUpdates();
  });

  // ------- Updates Feed -------
  function renderUpdates(){
    const feed = [];
    const events = read(LS.events, []);
    const threads = read(LS.threads, {});
    // upcoming events within 7 days
    const today = new Date();
    events.forEach(ev => {
      const evDate = new Date(ev.date + 'T00:00:00');
      const diffDays = Math.round((evDate - today)/(1000*60*60*24));
      if (diffDays >= 0 && diffDays <= 30) feed.push({type:'event', text:`${ev.title} on ${ev.date}`, date: ev.date});
    });
    // recent messages
    Object.values(threads).forEach(t => {
      const last = t.messages[t.messages.length-1];
      if (last) feed.push({type:'msg', text:`New message: ${last.text}`, date: new Date(last.ts).toISOString()});
    });

    // render
    updatesFeed.innerHTML = '';
    if (!feed.length) updatesFeed.innerHTML = '<li class="muted">No updates</li>';
    feed.slice(0,50).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.text;
      updatesFeed.appendChild(li);
    });
  }

  // ------- Toasts & modal helpers -------
  function createModal(innerHTML){
    const wrap = document.createElement('div');
    wrap.className = 'modal';
    wrap.innerHTML = innerHTML;
    // close on outside click
    setTimeout(()=> {
      const closeOnEsc = (e) => { if (e.key === 'Escape'){ closeModal(wrap); window.removeEventListener('keydown', closeOnEsc); } };
      window.addEventListener('keydown', closeOnEsc);
    }, 0);
    return wrap;
  }
  function closeModal(modal){
    if (!modal) return;
    modal.remove();
    // if none left, disable pointer events
    if (!modalRoot.children.length) {
      modalRoot.style.pointerEvents = 'none';
      modalRoot.setAttribute('aria-hidden','true');
    }
  }

  function toast(msg){
    const t = document.createElement('div');
    t.className = 'modal';
    t.style.position = 'fixed';
    t.style.right = '18px';
    t.style.bottom = '18px';
    t.style.maxWidth = '260px';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2500);
  }

  // ------- Top-level render -------
  function renderUpcoming(){
    const events = read(LS.events, []);
    const next = events.filter(e => e.date >= formatISODate(new Date())).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
    upcomingList.innerHTML = '';
    if (!next.length) upcomingList.innerHTML = '<li class="muted">No upcoming walks</li>';
    next.forEach(ev => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${ev.title}</strong> — <span class="muted">${ev.date} ${ev.time||''}</span>`;
      upcomingList.appendChild(li);
    });
  }

  function renderAll(){
    refreshUI();
    renderCalendar();
    renderEventsList();
    renderContactsSidebar();
    renderThread();
    renderUpcoming();
    renderUpdates();
  }

  // ------- Helpers for settings and theme -------
  const settings = read(LS.settings, {theme:'light', accent:'pink'});
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', settings.theme);
    if (settings.theme === 'dark') themeToggle.setAttribute('aria-pressed','true'); else themeToggle.setAttribute('aria-pressed','false');
  }
  themeToggle.addEventListener('click', () => {
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    write(LS.settings, settings);
    applyTheme();
  });

  accentSelect.addEventListener('change', (e) => {
    settings.accent = e.target.value;
    if (settings.accent === 'brown') document.documentElement.style.setProperty('--accent', '#6b3f2f');
    else document.documentElement.style.setProperty('--accent', '#ff2d95');
    write(LS.settings, settings);
  });

  // ------- Open thread or new messenger -------
  qs('#open-messenger').addEventListener('click', () => {
    // if contacts exist, open first one, else prompt to add
    const contacts = read(LS.contacts, []);
    if (!contacts.length) return addContactBtn.click();
    openThreadWith(contacts[0].id);
  });

  // quick schedule button
  qs('#quick-schedule').addEventListener('click', () => {
    openAddEventModal(formatISODate(new Date()));
    goToPage('calendar');
  });

  // search
  globalSearch.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return renderAll();
    // highlight events or contacts
    const evs = read(LS.events,[]).filter(ev => ev.title.toLowerCase().includes(q) || (ev.location||'').toLowerCase().includes(q));
    eventsList.innerHTML = '';
    evs.forEach(ev => {
      const c = document.createElement('div'); c.className='card'; c.innerHTML=`<h4>${ev.title}</h4><p class="muted">${ev.date}</p>`;
      eventsList.appendChild(c);
    });
  });

  // delete account (danger)
  deleteAccountBtn.addEventListener('click', () => {
    if (!confirm('Delete your account and all local data? This cannot be undone.')) return;
    // remove user and their data
    const users = read(LS.users,[]).filter(u => u.id !== state.currentUser.id);
    write(LS.users, users);
    // clear session and some stores
    logout();
    localStorage.removeItem(LS.events);
    localStorage.removeItem(LS.contacts);
    localStorage.removeItem(LS.threads);
    toast('Account deleted locally');
    location.reload();
  });

  // chat quick open from dashboard upcoming (not implemented: invites -> linking)
  // small helpers
  function init(){
    // per user choice: do NOT restore session on load -> show login screen
    // apply theme
    const savedSettings = read(LS.settings, {theme:'light', accent:'pink'});
    Object.assign(settings, savedSettings);
    applyTheme();
    if (settings.accent === 'brown') document.documentElement.style.setProperty('--accent', '#6b3f2f');

    // always show auth first (no persistent login)
    showAuth();

    // default calendar date
    state.calendarDate = new Date();
    // attach add event button
    addEventBtn.addEventListener('click', () => openAddEventModal(formatISODate(state.calendarDate)));
    // render initial UI (will populate lists when logged in)
    renderAll();

    // click outside modal to close (optional)
    modalRoot.addEventListener('click', (e) => {
      if (e.target === modalRoot) { // click background
        Array.from(modalRoot.children).forEach(closeModal);
      }
    });
  }

  // run
  init();

})();
