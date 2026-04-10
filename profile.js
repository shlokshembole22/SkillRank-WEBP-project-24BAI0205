/* ============================================================
   profile.js – User profile, history table, badges
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('profile.html')) return;
    SR.redirectIfNotLoggedIn();
    initProfile();
});

const ALL_BADGES = [
    { id: 'first', icon: '🏆', name: 'First Win', desc: 'Completed first quiz' },
    { id: 'speed', icon: '⚡', name: 'Speed Demon', desc: 'Finished under 2 min' },
    { id: 'perfect', icon: '💯', name: 'Perfect Score', desc: 'Got 100% on a quiz' },
    { id: 'streak7', icon: '🔥', name: '7-Day Streak', desc: 'Practiced 7 days in a row' },
    { id: 'quiz10', icon: '📚', name: 'Scholar', desc: 'Completed 10 quizzes' },
    { id: 'quiz25', icon: '🎓', name: 'Graduate', desc: 'Completed 25 quizzes' },
    { id: 'mastery', icon: '🎯', name: 'Mastery', desc: 'Avg score above 90%' },
    { id: 'explorer', icon: '🧭', name: 'Explorer', desc: 'Tried all categories' },
];

function initProfile() {
    const user = SR.getCurrentUser();
    if (!user) return;

    renderProfileHeader(user);
    renderStats(user);
    renderBadges(user);
    renderHistory(user);
    initEditProfile(user);
}

function getHistory(userId) {
    return JSON.parse(localStorage.getItem('skillrank_history_' + userId) || '[]');
}

function renderProfileHeader(user) {
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('profile-name', user.name || 'User');
    setEl('profile-email', user.email || '');
    setEl('profile-joined', 'Joined ' + SR.formatDate(user.joined || new Date().toISOString()));

    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) {
        avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
        avatarEl.style.cssText += ';font-size:2.5rem;font-weight:800;width:100px;height:100px;display:flex;align-items:center;justify-content:center;background:var(--gradient-main);border-radius:50%;';
    }
}

function renderStats(user) {
    const history = getHistory(user.id);
    const scores = history.map(h => h.score);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const best = scores.length ? Math.max(...scores) : 0;
    const cats = [...new Set(history.map(h => h.category))];

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('prof-quizzes', history.length);
    setEl('prof-avg', avg + '%');
    setEl('prof-best', best ? best + '%' : '—');
    setEl('prof-cats', cats.length);

    // Circular progress for avg score
    const circle = document.getElementById('avg-score-circle');
    if (circle) {
        const offset = 440 - (avg / 100) * 440;
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = avg >= 80 ? '#10b981' : avg >= 60 ? '#f59e0b' : '#ef4444';
    }
    const avgText = document.getElementById('avg-score-text');
    if (avgText) avgText.textContent = avg + '%';
}

function renderBadges(user) {
    const history = getHistory(user.id);
    const scores = history.map(h => h.score);
    const cats = [...new Set(history.map(h => h.category))];
    const allCats = ['javascript', 'python', 'html', 'css', 'general'];

    const earned = new Set();
    if (history.length >= 1) earned.add('first');
    if (Math.max(...scores || [0]) === 100) earned.add('perfect');
    if (history.length >= 10) earned.add('quiz10');
    if (history.length >= 25) earned.add('quiz25');
    if ((scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1)) >= 90) earned.add('mastery');
    if (cats.length >= allCats.length) earned.add('explorer');
    if (history.some(h => h.timeTaken < 120)) earned.add('speed');
    // Streak badge
    const daySet = [...new Set(history.map(h => h.date?.split('T')[0]))].sort().reverse();
    let streak = 0, exp = new Date(); exp.setHours(0, 0, 0, 0);
    for (const d of daySet) {
        const diff = Math.floor((exp - new Date(d)) / 86400000);
        if (diff <= 1) { streak++; exp = new Date(d); } else break;
    }
    if (streak >= 7) earned.add('streak7');

    const container = document.getElementById('badges-container');
    if (!container) return;

    container.innerHTML = ALL_BADGES.map(b => {
        const hasIt = earned.has(b.id);
        return `
    <div class="card" style="text-align:center;padding:20px 16px;opacity:${hasIt ? 1 : 0.35};transition:0.3s;${hasIt ? '' : 'filter:grayscale(1)'}">
      <div style="font-size:2.4rem;margin-bottom:8px">${b.icon}</div>
      <div style="font-weight:700;font-size:0.875rem">${b.name}</div>
      <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px">${b.desc}</div>
      ${hasIt ? '<div class="badge badge-green mt-2" style="margin-top:8px;display:inline-flex">Earned</div>' : ''}
    </div>`;
    }).join('');
}

function renderHistory(user) {
    const history = getHistory(user.id);
    const container = document.getElementById('history-body');
    if (!container) return;

    if (!history.length) {
        container.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-secondary)">No quiz history yet. Take a quiz to get started!</td></tr>`;
        return;
    }

    const catEmojis = { javascript: '⚡', python: '🐍', html: '🌐', css: '🎨', general: '🧠' };
    container.innerHTML = history.map((h, i) => {
        const scoreColor = h.score >= 80 ? 'var(--green)' : h.score >= 60 ? 'var(--amber)' : 'var(--red)';
        return `
    <tr>
      <td style="color:var(--text-secondary);font-size:0.85rem">#${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem">${catEmojis[h.category] || '📝'}</span>
          <span style="font-weight:600">${SR.capitalize(h.category)}</span>
        </div>
      </td>
      <td><span style="font-weight:700;color:${scoreColor}">${h.score}%</span></td>
      <td>${h.correct} / ${h.total}</td>
      <td>${h.timeTaken ? SR.formatTime(h.timeTaken) : '—'}</td>
      <td style="color:var(--text-secondary);font-size:0.85rem">${SR.formatDate(h.date)}</td>
    </tr>`;
    }).join('');

    // Category breakdown chart
    renderCatChart(history);
}

function renderCatChart(history) {
    const container = document.getElementById('cat-chart');
    if (!container) return;

    const catMap = {};
    history.forEach(h => {
        if (!catMap[h.category]) catMap[h.category] = { total: 0, count: 0 };
        catMap[h.category].total += h.score;
        catMap[h.category].count++;
    });

    const cats = Object.entries(catMap).map(([cat, d]) => ({
        cat, avg: Math.round(d.total / d.count), count: d.count
    })).sort((a, b) => b.avg - a.avg);

    const colors = ['var(--purple-light)', 'var(--cyan)', 'var(--amber)', 'var(--green)', 'var(--pink)'];
    container.innerHTML = cats.map((c, i) => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <span style="font-size:1rem;width:20px">${['⚡', '🐍', '🌐', '🎨', '🧠'][['javascript', 'python', 'html', 'css', 'general'].indexOf(c.cat)] || '📝'}</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:0.85rem;font-weight:600">${SR.capitalize(c.cat)}</span>
          <span style="font-size:0.85rem;font-weight:700;color:${colors[i % 5]}">${c.avg}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${c.avg}%;background:${colors[i % 5]}"></div></div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px">${c.count} quiz${c.count !== 1 ? 'zes' : ''}</div>
      </div>
    </div>
  `).join('');
}

function initEditProfile(user) {
    const editBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('edit-form');

    if (!editBtn || !modal) return;

    editBtn.addEventListener('click', () => {
        document.getElementById('edit-name').value = user.name || '';
        document.getElementById('edit-email').value = user.email || '';
        modal.style.display = 'flex';
        setTimeout(() => modal.querySelector('.auth-card').classList.add('anim-scale-in'), 10);
    });

    closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('edit-name').value.trim();
        const newEmail = document.getElementById('edit-email').value.trim();
        if (!newName || newName.length < 2) { SR.showToast('Name too short', 'error'); return; }

        const users = JSON.parse(localStorage.getItem('skillrank_users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx].name = newName;
            users[idx].email = newEmail;
            users[idx].avatar = newName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            localStorage.setItem('skillrank_users', JSON.stringify(users));
            localStorage.setItem('skillrank_user', JSON.stringify(users[idx]));
        }
        modal.style.display = 'none';
        SR.showToast('Profile updated!', 'success');
        setTimeout(() => location.reload(), 600);
    });
}
