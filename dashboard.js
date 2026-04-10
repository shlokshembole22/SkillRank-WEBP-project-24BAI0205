/* ============================================================
   dashboard.js – Dashboard stats, chart, recent activity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('dashboard.html')) return;
    SR.redirectIfNotLoggedIn();
    initDashboard();
});

function initDashboard() {
    const user = SR.getCurrentUser();
    if (!user) return;

    // Greeting
    const greetEl = document.getElementById('greeting');
    const nameEl = document.getElementById('dash-name');
    const avatarEl = document.getElementById('dash-avatar');
    const joinedEl = document.getElementById('dash-joined');

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    if (greetEl) greetEl.textContent = greeting + ',';
    if (nameEl) nameEl.textContent = user.name?.split(' ')[0] || 'User';
    if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
    if (joinedEl) joinedEl.textContent = 'Joined ' + SR.formatDate(user.joined || new Date().toISOString());

    loadStats(user);
    loadHistory(user);
    renderWeeklyChart(user);
    loadLeaderboardPreview();
}

function loadStats(user) {
    const history = getHistory(user.id);
    const taken = history.length || user.quizzesTaken || 0;
    const scores = history.map(h => h.score);
    const avgSc = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : user.avgScore || 0;
    const best = scores.length ? Math.max(...scores) : 0;

    // Streak calc
    const streak = calcStreak(history);

    const elMap = {
        'stat-quizzes': taken,
        'stat-avg': avgSc + '%',
        'stat-best': best + '%',
        'stat-streak': streak + ' days',
    };
    for (const [id, val] of Object.entries(elMap)) {
        const el = document.getElementById(id);
        if (el) { el.textContent = val; }
    }

    // Category breakdown
    const catCounts = {};
    history.forEach(h => { catCounts[h.category] = (catCounts[h.category] || 0) + 1; });
    const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
    const topCatEl = document.getElementById('top-category');
    if (topCatEl) topCatEl.textContent = topCat ? SR.capitalize(topCat[0]) : '—';
}

function calcStreak(history) {
    if (!history.length) return 0;
    const days = [...new Set(history.map(h => h.date?.split('T')[0]))].sort().reverse();
    let streak = 0;
    let expected = new Date();
    expected.setHours(0, 0, 0, 0);
    for (const day of days) {
        const d = new Date(day);
        const diff = Math.floor((expected - d) / 86400000);
        if (diff === 0 || diff === 1) { streak++; expected = d; }
        else break;
    }
    return streak;
}

function getHistory(userId) {
    return JSON.parse(localStorage.getItem('skillrank_history_' + userId) || '[]');
}

function loadHistory(user) {
    const history = getHistory(user.id);
    const container = document.getElementById('recent-history');
    if (!container) return;

    if (!history.length) {
        container.innerHTML = `
      <div class="empty-state text-center" style="padding:40px;color:var(--text-secondary)">
        <div style="font-size:3rem;margin-bottom:12px">📝</div>
        <p style="font-weight:600">No quizzes taken yet!</p>
        <p style="font-size:0.875rem;margin-top:4px">Take your first quiz to see results here.</p>
        <a href="quiz.html" class="btn btn-primary btn-sm mt-3" style="margin-top:16px;display:inline-flex">Start a Quiz</a>
      </div>`;
        return;
    }

    container.innerHTML = history.slice(0, 6).map(h => {
        const scoreColor = h.score >= 80 ? 'var(--green)' : h.score >= 60 ? 'var(--amber)' : 'var(--red)';
        const cat = SR.capitalize(h.category);
        return `
    <div class="card" style="padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:10px">
      <div class="stat-icon" style="background:var(--gradient-card);border-radius:12px;width:44px;height:44px;flex-shrink:0">
        ${catEmoji(h.category)}
      </div>
      <div style="flex:1;overflow:hidden">
        <div style="font-weight:600;font-size:0.9rem">${cat} Quiz</div>
        <div style="font-size:0.78rem;color:var(--text-secondary)">${SR.formatDate(h.date)} · ${h.correct}/${h.total} correct</div>
      </div>
      <div style="font-size:1.3rem;font-weight:800;color:${scoreColor};font-family:var(--font-display)">${h.score}%</div>
    </div>`;
    }).join('');
}

function catEmoji(cat) {
    const map = { javascript: '⚡', python: '🐍', html: '🌐', css: '🎨', general: '🧠' };
    return `<span style="font-size:1.3rem;display:flex;align-items:center;justify-content:center">${map[cat] || '📝'}</span>`;
}

function renderWeeklyChart(user) {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) return;

    const history = getHistory(user.id);
    const today = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dayStr = d.toISOString().split('T')[0];
        const dayHistory = history.filter(h => h.date?.startsWith(dayStr));
        return {
            label: days[i],
            count: dayHistory.length,
            avg: dayHistory.length ? Math.round(dayHistory.reduce((a, b) => a + b.score, 0) / dayHistory.length) : 0,
        };
    });

    // Pure CSS/HTML chart
    const maxVal = Math.max(...weekData.map(d => d.avg), 1);
    canvas.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:10px;height:100px;padding-bottom:4px">
      ${weekData.map(d => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          <div class="mini-bar" style="width:100%;height:${Math.max((d.avg / maxVal) * 90, 4)}px;border-radius:4px 4px 0 0;background:${d.avg > 0 ? 'var(--gradient-main)' : 'rgba(255,255,255,0.06)'};position:relative">
            ${d.avg > 0 ? `<div class="bar-tooltip">${d.avg}% · ${d.count} quiz</div>` : ''}
          </div>
          <span style="font-size:0.65rem;color:var(--text-muted)">${d.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function loadLeaderboardPreview() {
    const container = document.getElementById('lb-preview');
    if (!container) return;

    const users = JSON.parse(localStorage.getItem('skillrank_users') || '[]')
        .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
        .slice(0, 5);

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    container.innerHTML = users.map((u, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--glass-border)">
      <span style="font-size:1.1rem;width:24px;text-align:center">${medals[i]}</span>
      <div class="avatar" style="width:34px;height:34px;font-size:0.8rem">${u.avatar || u.name?.charAt(0) || '?'}</div>
      <div style="flex:1">
        <div style="font-size:0.875rem;font-weight:600">${u.name}</div>
        <div style="font-size:0.75rem;color:var(--text-secondary)">${u.quizzesTaken || 0} quizzes</div>
      </div>
      <div style="font-weight:700;font-size:0.9rem;color:var(--purple-light)">${u.avgScore || 0}%</div>
    </div>
  `).join('');
}
