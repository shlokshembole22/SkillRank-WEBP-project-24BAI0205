/* ============================================================
   auth.js – Login / Register mock logic with localStorage
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();

    if (path === 'login.html') initLogin();
    if (path === 'register.html') initRegister();
});

// ── Seed demo users ──────────────────────────────────────────
function ensureDemoUsers() {
    if (!localStorage.getItem('skillrank_users')) {
        const demo = [
            { id: 'u1', name: 'Alex Johnson', email: 'alex@demo.com', password: 'demo123', avatar: 'AJ', joined: '2024-01-15', quizzesTaken: 42, totalScore: 3780, avgScore: 90, streak: 7, badges: ['🏆', '⚡', '🎯', '🔥'] },
            { id: 'u2', name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo123', avatar: 'PS', joined: '2024-02-01', quizzesTaken: 35, totalScore: 3010, avgScore: 86, streak: 5, badges: ['⚡', '🎯', '📚'] },
            { id: 'u3', name: 'Marcus Lee', email: 'marcus@demo.com', password: 'demo123', avatar: 'ML', joined: '2024-01-28', quizzesTaken: 28, totalScore: 2380, avgScore: 85, streak: 3, badges: ['🎯', '📚'] },
            { id: 'u4', name: 'Sophia Chen', email: 'sophia@demo.com', password: 'demo123', avatar: 'SC', joined: '2024-03-10', quizzesTaken: 20, totalScore: 1640, avgScore: 82, streak: 2, badges: ['📚'] },
            { id: 'u5', name: 'James Wright', email: 'james@demo.com', password: 'demo123', avatar: 'JW', joined: '2024-04-01', quizzesTaken: 15, totalScore: 1200, avgScore: 80, streak: 1, badges: [] },
        ];
        localStorage.setItem('skillrank_users', JSON.stringify(demo));
    }
}

function getUsers() {
    ensureDemoUsers();
    return JSON.parse(localStorage.getItem('skillrank_users')) || [];
}
function saveUsers(users) { localStorage.setItem('skillrank_users', JSON.stringify(users)); }

// ── Login ────────────────────────────────────────────────────
function initLogin() {
    SR.redirectIfLoggedIn();
    const form = document.getElementById('login-form');
    const emailEl = document.getElementById('email');
    const passEl = document.getElementById('password');
    const submitBtn = document.getElementById('login-btn');
    const togglePw = document.getElementById('toggle-password');

    // password toggle
    if (togglePw) {
        togglePw.addEventListener('click', () => {
            const show = passEl.type === 'password';
            passEl.type = show ? 'text' : 'password';
            togglePw.textContent = show ? '🙈' : '👁️';
        });
    }

    // Demo login
    document.querySelectorAll('[data-demo-login]').forEach(btn => {
        btn.addEventListener('click', () => {
            emailEl.value = btn.dataset.email;
            passEl.value = 'demo123';
        });
    });

    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let valid = true;

        const email = emailEl.value.trim();
        const pass = passEl.value;

        if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            showFieldError('email-error', 'Please enter a valid email'); valid = false;
        }
        if (!pass || pass.length < 6) {
            showFieldError('pass-error', 'Password must be at least 6 characters'); valid = false;
        }
        if (!valid) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader-sm"></span> Signing in…';

        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
            if (user) {
                localStorage.setItem('skillrank_user', JSON.stringify(user));
                SR.showToast(`Welcome back, ${user.name.split(' ')[0]}! 🎉`, 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In';
                showFieldError('pass-error', 'Invalid email or password');
                SR.showToast('Login failed — check your credentials', 'error');
            }
        }, 900);
    });
}

// ── Register ─────────────────────────────────────────────────
function initRegister() {
    SR.redirectIfLoggedIn();
    const form = document.getElementById('register-form');
    const submitBtn = document.getElementById('register-btn');
    const togglePw = document.getElementById('toggle-password');
    const passEl = document.getElementById('password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    if (togglePw && passEl) {
        togglePw.addEventListener('click', () => {
            const show = passEl.type === 'password';
            passEl.type = show ? 'text' : 'password';
            togglePw.textContent = show ? '🙈' : '👁️';
        });
    }

    // Password strength
    if (passEl && strengthBar) {
        passEl.addEventListener('input', () => {
            const val = passEl.value;
            let score = 0;
            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;
            const pct = (score / 4) * 100;
            const colors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4'];
            const labels = ['Weak', 'Fair', 'Good', 'Strong'];
            strengthBar.style.width = pct + '%';
            strengthBar.style.background = colors[score - 1] || 'transparent';
            if (strengthText) strengthText.textContent = labels[score - 1] || '';
        });
    }

    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let valid = true;

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value;
        const conf = document.getElementById('confirm-password').value;

        if (!name || name.length < 2) {
            showFieldError('name-error', 'Name must be at least 2 characters'); valid = false;
        }
        if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            showFieldError('email-error', 'Please enter a valid email'); valid = false;
        }
        if (!pass || pass.length < 6) {
            showFieldError('pass-error', 'Password must be at least 6 characters'); valid = false;
        }
        if (pass !== conf) {
            showFieldError('conf-error', 'Passwords do not match'); valid = false;
        }
        if (!valid) return;

        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            showFieldError('email-error', 'This email is already registered');
            SR.showToast('Email already taken. Try logging in.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader-sm"></span> Creating account…';

        setTimeout(() => {
            const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const newUser = {
                id: 'u' + Date.now(),
                name, email, password: pass,
                avatar: initials,
                joined: new Date().toISOString().split('T')[0],
                quizzesTaken: 0, totalScore: 0, avgScore: 0, streak: 0,
                badges: [], history: []
            };
            users.push(newUser);
            saveUsers(users);
            localStorage.setItem('skillrank_user', JSON.stringify(newUser));
            SR.showToast(`Account created! Welcome, ${name.split(' ')[0]}! 🚀`, 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        }, 900);
    });
}

// ── Form error helpers ───────────────────────────────────────
function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
}
function clearErrors() {
    document.querySelectorAll('.form-error').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
    document.querySelectorAll('.form-input.error').forEach(e => e.classList.remove('error'));
}
