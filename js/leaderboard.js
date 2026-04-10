/* ============================================================
   leaderboard.js – Leaderboard rendering and filtering
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('leaderboard.html')) return;
    initLeaderboard();
});

let leaderState = { category: 'all', sort: 'score' };

function initLeaderboard() {
    renderPodium();
    renderTable();
    initFilters();
}

function getAllUsers() {
    const stored = JSON.parse(localStorage.getItem('skillrank_users') || '[]');
    // Merge history stats for each user
    return stored.map(u => {
        const history = JSON.parse(localStorage.getItem('skillrank_history_' + u.id) || '[]');
        const catHistory = leaderState.category === 'all'
            ? history
            : history.filter(h => h.category === leaderState.category);
        const scores = catHistory.map(h => h.score);
        return {
            ...u,
            filteredScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : u.avgScore || 0,
            filteredQuizzes: catHistory.length || u.quizzesTaken || 0,
            filteredBest: scores.length ? Math.max(...scores) : 0,
        };
    });
}

function getSortedUsers() {
    const users = getAllUsers();
    return users.sort((a, b) => {
        if (leaderState.sort === 'score') return (b.filteredScore || 0) - (a.filteredScore || 0);
        if (leaderState.sort === 'quizzes') return (b.filteredQuizzes || 0) - (a.filteredQuizzes || 0);
        if (leaderState.sort === 'best') return (b.filteredBest || 0) - (a.filteredBest || 0);
        return 0;
    });
}

function renderPodium() {
    const users = getSortedUsers().slice(0, 3);
    const ids = ['podium-2', 'podium-1', 'podium-3'];  // visual order: 2nd, 1st, 3rd
    const order = [1, 0, 2];                           // user index for each position

    const avatarSizes = [80, 100, 72];
    const rankLabels = ['2nd', '1st', '3rd'];
    const crowns = ['', '👑', ''];

    ids.forEach((id, pos) => {
        const u = users[order[pos]];
        if (!u) return;
        const el = document.getElementById(id);
        if (!el) return;

        const rankNum = order[pos] + 1;
        const scoreColor = pos === 1 ? 'var(--amber)' : 'var(--text-primary)';
        el.innerHTML = `
      <div class="podium-avatar-wrap">
        ${crowns[pos] ? `<div class="podium-crown">${crowns[pos]}</div>` : ''}
        <div class="avatar" style="width:${avatarSizes[pos]}px;height:${avatarSizes[pos]}px;font-size:${avatarSizes[pos] / 3}px;font-weight:800;background:var(--gradient-main)">${u.avatar || u.name?.charAt(0) || '?'}</div>
      </div>
      <div class="podium-name">${u.name}</div>
      <div class="podium-score">${u.filteredScore}% avg</div>
      <div class="podium-pedestal podium-${rankNum}" style="margin-top:8px">
        <div style="color:${scoreColor}">#${rankNum}</div>
      </div>
    `;
    });
}

function renderTable() {
    const users = getSortedUsers();
    const container = document.getElementById('lb-table-body');
    const currentUser = SR.getCurrentUser();
    if (!container) return;

    const medals = { 0: '🥇', 1: '🥈', 2: '🥉' };
    const trendIcons = ['↗️', '→', '↘️'];

    container.innerHTML = users.map((u, i) => {
        const isMe = currentUser && u.id === currentUser.id;
        const medal = medals[i] || `<span style="font-weight:700;color:var(--text-muted)">#${i + 1}</span>`;
        const rowClass = isMe ? 'style="background:rgba(124,58,237,0.08)"' : '';
        return `
    <tr ${rowClass}>
      <td style="font-size:1.1rem;text-align:center">${medal}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar" style="width:36px;height:36px;font-size:0.8rem;font-weight:700;background:var(--gradient-main)">${u.avatar || u.name?.charAt(0) || '?'}</div>
          <div>
            <div style="font-weight:600;font-size:0.9rem">${u.name}${isMe ? ' <span class="badge badge-purple" style="font-size:0.6rem;padding:2px 7px">You</span>' : ''}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary)">${u.email || ''}</div>
          </div>
        </div>
      </td>
      <td><span style="font-size:1rem;font-weight:700;color:${u.filteredScore >= 80 ? 'var(--green)' : u.filteredScore >= 60 ? 'var(--amber)' : 'var(--red)'}">${u.filteredScore}%</span></td>
      <td>${u.filteredQuizzes}</td>
      <td>${u.filteredBest ? u.filteredBest + '%' : '—'}</td>
      <td>${renderBadges(u.badges)}</td>
    </tr>`;
    }).join('');
}

function renderBadges(badges = []) {
    if (!badges.length) return '<span style="color:var(--text-muted);font-size:0.8rem">None</span>';
    return badges.slice(0, 4).map(b => `<span style="font-size:1rem">${b}</span>`).join(' ');
}

function initFilters() {
    // Category filters
    document.querySelectorAll('[data-cat-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-cat-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            leaderState.category = btn.dataset.catFilter;
            renderPodium();
            renderTable();
        });
    });

    // Sort
    const sortEl = document.getElementById('sort-select');
    if (sortEl) {
        sortEl.addEventListener('change', () => {
            leaderState.sort = sortEl.value;
            renderPodium();
            renderTable();
        });
    }

    // Search
    const searchEl = document.getElementById('lb-search');
    if (searchEl) {
        searchEl.addEventListener('input', () => {
            const q = searchEl.value.toLowerCase();
            document.querySelectorAll('#lb-table-body tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }
}
