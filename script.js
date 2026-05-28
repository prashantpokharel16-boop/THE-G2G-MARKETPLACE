// G2G Network Core App System State
let appState = {
  currentUser: null,
  authToken: null,
  activeTab: 'home',
  
  // Real-time Chat Thread
  chatHistory: [
    { id: 'm1', username: 'wrage4x1', role: 'owner', message: 'Welcome everyone to the G2G Marketplace terminal. Please make sure to trade only through verified operator escrow dockets.', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
    { id: 'm2', username: 'prashant6700', role: 'admin', message: 'I am online and monitoring dispute escalations. If you need middleman clearance, ping me or open a live ticket.', createdAt: new Date(Date.now() - 10 * 60000).toISOString() }
  ],

  // Public Registered Reviews
  reviews: [
    { id: 'r1', username: 'Ram', role: 'user', rating: 5, text: 'Highly recommend G2G for Blox Fruits trading! I was nervous about losing my Kitsune but using their middleman was very secure.', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
    { id: 'r2', username: 'AnonymousTrader', role: 'user', rating: 5, text: 'Absolutely spotless execution. Transferred high value assets and got receipt within 4 minutes.', createdAt: new Date(Date.now() - 120 * 60000).toISOString() }
  ],

  // Platform members registry simulator
  usersRegistry: [
    { username: 'wrage4x1', email: 'wrage4x1@g2g.invalid', discord: 'wrage#9999', role: 'owner', isBanned: false },
    { username: 'prashant6700', email: 'prashant@g2g.invalid', discord: 'prashant#6700', role: 'admin', isBanned: false },
    { username: 'Ram', email: 'ram@g2g.invalid', discord: 'ram#1111', role: 'user', isBanned: false },
    { username: 'AnonymousTrader', email: 'anon@g2g.invalid', discord: 'anon#8888', role: 'user', isBanned: false }
  ]
};

// Toggle Decryption Auth modes in auth.html
let authIsRegisterMode = false;

function toggleAuthMode() {
  authIsRegisterMode = !authIsRegisterMode;
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const registerFields = document.getElementById('register-fields');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleBtn = document.getElementById('auth-toggle-btn');
  
  if (authIsRegisterMode) {
    title.innerText = 'Initialize Registry Node';
    subtitle.innerText = 'Create a new secure cryptographic profile on G2G ledgers';
    registerFields.classList.remove('hidden');
    submitBtn.innerText = 'Initialize Profile Registry';
    toggleBtn.innerText = 'Back to credentials decryption panel';
  } else {
    title.innerText = 'Decrypt Node Lockbox';
    subtitle.innerText = 'Establish authorized session with network gateways';
    registerFields.classList.add('hidden');
    submitBtn.innerText = 'Decrypt Profile Credentials';
    toggleBtn.innerText = 'Initialize new secure account registry';
  }
}

// Submits Authentication logic
function processAuth(e) {
  e.preventDefault();
  const user = document.getElementById('auth-username').value.trim();
  const pass = document.getElementById('auth-password').value;
  const errorBox = document.getElementById('auth-error-output');
  errorBox.classList.add('hidden');

  if (!user || !pass) {
    showAuthError('Username and password are required.');
    return;
  }

  if (authIsRegisterMode) {
    // Simulate Registration
    const email = document.getElementById('auth-email').value;
    const discord = document.getElementById('auth-discord').value;
    
    // Check if user already exists
    const duplicate = appState.usersRegistry.find(u => u.username.toLowerCase() === user.toLowerCase());
    if (duplicate) {
      showAuthError('Username is already registered on public nodes.');
      return;
    }

    const newUser = {
      username: user,
      email: email || '',
      discord: discord || '',
      role: 'user',
      isBanned: false
    };

    appState.usersRegistry.push(newUser);
    saveSession(newUser);
  } else {
    // Admin Override presets check
    if (user === 'wrage4x1' && pass === 'owner_password123') {
      saveSession({ username: 'wrage4x1', email: 'wrage4x1@g2g.invalid', discord: 'wrage#9999', role: 'owner', isBanned: false });
      return;
    } else if (user === 'prashant6700' && pass === 'admin_password567') {
      saveSession({ username: 'prashant6700', email: 'prashant@g2g.invalid', discord: 'prashant#6700', role: 'admin', isBanned: false });
      return;
    }

    // Standard user login check
    const matched = appState.usersRegistry.find(u => u.username.toLowerCase() === user.toLowerCase());
    if (!matched) {
      showAuthError('Invalid credentials. Identity hash lookup failed.');
      return;
    }
    if (matched.isBanned) {
      showAuthError('This node is restricted/banned from access.');
      return;
    }

    saveSession(matched);
  }
}

function showAuthError(msg) {
  const errorBox = document.getElementById('auth-error-output');
  errorBox.innerText = msg;
  errorBox.classList.remove('hidden');
}

function saveSession(userObj) {
  localStorage.setItem('g2g_session_user', JSON.stringify(userObj));
  // Redirect to main terminal
  window.location.href = 'index.html';
}

function checkActiveSession() {
  const storedUser = localStorage.getItem('g2g_session_user');
  if (storedUser) {
    appState.currentUser = JSON.parse(storedUser);
    appState.authToken = appState.currentUser.username;
    
    // Show logged-in controls
    document.getElementById('logged-out-panel').classList.add('hidden');
    document.getElementById('logged-in-panel').classList.remove('hidden');
    document.getElementById('badge-username').innerText = `@${appState.currentUser.username}`;
    
    // Uncover hidden tabs
    document.getElementById('profile-tab').classList.remove('hidden');
    document.getElementById('mobile-profile-tab').classList.remove('hidden');

    // Show forms and hide prompts
    document.getElementById('chat-auth-prompt')?.classList.add('hidden');
    document.getElementById('chat-send-form')?.classList.remove('hidden');
    document.getElementById('review-logout-warn')?.classList.add('hidden');
    document.getElementById('review-form')?.classList.remove('hidden');

    // If Admin/Owner show custom controls
    const isAdmin = appState.currentUser.role === 'owner' || appState.currentUser.role === 'admin';
    if (isAdmin) {
      document.getElementById('chat-purge-btn')?.classList.remove('hidden');
      document.getElementById('admin-management-section')?.classList.remove('hidden');
    }
  } else {
    // Show logged-out controls
    document.getElementById('logged-out-panel').classList.remove('hidden');
    document.getElementById('logged-in-panel').classList.add('hidden');
    document.getElementById('profile-tab').classList.add('hidden');
    document.getElementById('mobile-profile-tab').classList.add('hidden');
  }
}

function logoutUser() {
  localStorage.removeItem('g2g_session_user');
  appState.currentUser = null;
  appState.authToken = null;
  window.location.href = 'index.html';
}

// Swapping tab views
function switchTab(tabId) {
  appState.activeTab = tabId;
  
  // Update header navigation classes
  document.querySelectorAll('.nav-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.innerText.toLowerCase() === tabId || (tabId === 'chat' && btn.innerText === 'Global Chat')) {
      btn.classList.add('active');
    }
  });

  document.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.classList.remove('active');
    if (btn.innerText.toLowerCase() === tabId || (tabId === 'chat' && btn.innerText === 'Chat')) {
      btn.classList.add('active');
    }
  });

  // Toggle views
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  document.getElementById(`view-${tabId}`).classList.remove('hidden');

  // Trigger dynamic population handlers
  if (tabId === 'chat') renderChat();
  if (tabId === 'reviews') renderReviews();
  if (tabId === 'profile') renderProfileData();
}

// 💬 Chat functions
function renderChat() {
  const box = document.getElementById('chat-messages-box');
  if (!box) return;
  box.innerHTML = '';

  appState.chatHistory.forEach(msg => {
    const isMe = appState.currentUser && msg.username === appState.currentUser.username;
    const isAdmin = appState.currentUser && (appState.currentUser.role === 'owner' || appState.currentUser.role === 'admin');
    
    let deleteBtnHTML = '';
    // Individual Chat Message Delete for Admins (remove global chat messages of others/self)
    if (isAdmin) {
      deleteBtnHTML = `
        <button class="btn img-btn-danger" onclick="deleteChatMessage('${msg.id}')" title="Wipe message message record">
           🗑️
        </button>
      `;
    }

    const row = document.createElement('div');
    row.className = `chat-bubble-row ${isMe ? 'me' : ''}`;
    row.innerHTML = `
      <div class="chat-avatar">${msg.username[0].toUpperCase()}</div>
      <div class="chat-bubble-body">
        <div class="chat-bubble-info">
          <span>@${msg.username}</span>
          <span>(${msg.role.toUpperCase()})</span>
          <span>${msg.createdAt.slice(11, 16)}</span>
          ${deleteBtnHTML}
        </div>
        <div class="chat-bubble-msg">${msg.message}</div>
      </div>
    `;
    box.appendChild(row);
  });
  box.scrollTop = box.scrollHeight;
}

function broadcastMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chat-text-input');
  const val = input.value.trim();
  if (!val || !appState.currentUser) return;

  const newMsg = {
    id: 'msg-' + Date.now(),
    username: appState.currentUser.username,
    role: appState.currentUser.role,
    message: val,
    createdAt: new Date().toISOString()
  };

  appState.chatHistory.push(newMsg);
  input.value = '';
  renderChat();
}

// Deletes individual chat message
function deleteChatMessage(msgId) {
  if (!confirm('Are you certain you want to remove this specific public chat statement?')) return;
  appState.chatHistory = appState.chatHistory.filter(m => m.id !== msgId);
  renderChat();
}

// Purges active Chat DB Logs
function purgeChat() {
  if (!confirm('Wipe the active chat databases? This operation is irreversible.')) return;
  appState.chatHistory = [];
  renderChat();
}

// ⭐ Reviews functions
function renderReviews() {
  const container = document.getElementById('reviews-card-container');
  if (!container) return;
  container.innerHTML = '';

  appState.reviews.forEach(rev => {
    const isAdmin = appState.currentUser && (appState.currentUser.role === 'owner' || appState.currentUser.role === 'admin');
    let deleteBtnHTML = '';
    // Admin review purge option (reviews of others/self)
    if (isAdmin) {
      deleteBtnHTML = `
        <button class="btn btn-danger btn-xs" onclick="deleteReview('${rev.id}')">
          Purge Record
        </button>
      `;
    }

    let starsText = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-card-header">
        <div class="reviewer-meta">
          <div class="chat-avatar">${rev.username[0].toUpperCase()}</div>
          <div>
            <strong>@${rev.username}</strong>
            <p class="subtitle font-mono" style="font-size:9px">${rev.role.toUpperCase()}</p>
          </div>
        </div>
        <span class="star-rating">${starsText}</span>
      </div>
      <p class="review-text">"${rev.text}"</p>
      <div class="review-card-footer">
        <span>${new Date(rev.createdAt).toLocaleDateString()}</span>
        ${deleteBtnHTML}
      </div>
    `;
    container.appendChild(card);
  });
}

function postReview(e) {
  e.preventDefault();
  const rating = parseInt(document.getElementById('review-rating-select').value);
  const text = document.getElementById('review-text-input').value.trim();
  if (!text || !appState.currentUser) return;

  const newRev = {
    id: 'rev-' + Date.now(),
    username: appState.currentUser.username,
    role: appState.currentUser.role,
    rating: rating,
    text: text,
    createdAt: new Date().toISOString()
  };

  appState.reviews.unshift(newRev); // Add to beginning of array
  document.getElementById('review-text-input').value = '';
  renderReviews();
}

function deleteReview(revId) {
  if (!confirm('Are you sure you want to delete this public review record from the ledger?')) return;
  appState.reviews = appState.reviews.filter(r => r.id !== revId);
  renderReviews();
}

// 🛡️ Profile & Admin Systems lists
function renderProfileData() {
  if (!appState.currentUser) return;
  document.getElementById('profile-initial').innerText = appState.currentUser.username[0].toUpperCase();
  document.getElementById('profile-usr').innerText = `@${appState.currentUser.username}`;
  document.getElementById('profile-email').innerText = appState.currentUser.email || 'None Provided';
  document.getElementById('profile-discord').innerText = appState.currentUser.discord || 'None Synced';
  document.getElementById('profile-role').innerText = `${appState.currentUser.role.toUpperCase()} clearance`;

  // Render Admin Tables
  const tbody = document.getElementById('user-registry-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  appState.usersRegistry.forEach(user => {
    const isCurrent = user.username === appState.currentUser.username;
    const isOwner = appState.currentUser.role === 'owner';
    
    let actionBtn = '';
    if (!isCurrent) {
      actionBtn = `
        <button class="btn btn-danger btn-xs" onclick="toggleBanUser('${user.username}')">
          ${user.isBanned ? 'Unban' : 'Ban'}
        </button>
      `;
    } else {
      actionBtn = `<span class="subtitle">Protected</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-mono"><strong>@${user.username}</strong></td>
      <td>${user.email || 'None'}</td>
      <td class="text-indigo">${user.discord || 'None'}</td>
      <td><span class="badge" style="font-size: 8px;">${user.role.toUpperCase()}</span></td>
      <td>${user.isBanned ? '<span class="status-banned" style="color:red">Banned</span>' : '<span class="status-active" style="color:#10b981">Cleared</span>'}</td>
      <td>${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleBanUser(username) {
  const user = appState.usersRegistry.find(u => u.username === username);
  if (!user) return;
  user.isBanned = !user.isBanned;
  renderProfileData();
}

// Startup Session checks
window.addEventListener('DOMContentLoaded', () => {
  checkActiveSession();
  // Lucide icon support refresh
  if (window.lucide) {
    lucide.createIcons();
  }
});
