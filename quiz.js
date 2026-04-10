/* ============================================================
   quiz.js – Quiz engine: question bank, timer, scoring
   ============================================================ */

const QUESTION_BANK = {
    javascript: [
        { q: 'Which method is used to parse a JSON string?', opts: ['JSON.parse()', 'JSON.stringify()', 'JSON.decode()', 'parse.JSON()'], ans: 0, diff: 'easy' },
        { q: 'What does the `typeof` operator return for `null`?', opts: ['"null"', '"object"', '"undefined"', '"boolean"'], ans: 1, diff: 'medium' },
        { q: 'Which array method creates a new array with all elements that pass the test?', opts: ['map()', 'reduce()', 'filter()', 'find()'], ans: 2, diff: 'easy' },
        { q: 'What is a closure in JavaScript?', opts: ['A function with no parameters', 'A function with access to its lexical scope', 'An arrow function', 'A promise'], ans: 1, diff: 'medium' },
        { q: 'What keyword is used to declare a block-scoped variable?', opts: ['var', 'function', 'let', 'const'], ans: 2, diff: 'easy' },
        { q: 'What does `===` check in JavaScript?', opts: ['Value only', 'Reference only', 'Value and type', 'Type only'], ans: 2, diff: 'easy' },
        { q: 'Which of these is NOT a JavaScript primitive?', opts: ['string', 'number', 'object', 'boolean'], ans: 2, diff: 'medium' },
        { q: 'What is the output of `0.1 + 0.2 === 0.3`?', opts: ['true', 'false', 'undefined', 'NaN'], ans: 1, diff: 'hard' },
        { q: 'What is the purpose of `Promise.all()`?', opts: ['Run promises sequentially', 'Race all promises', 'Resolve when all promises resolve', 'Cancel all promises'], ans: 2, diff: 'medium' },
        { q: 'Which ES6 feature allows destructuring of objects?', opts: ['Spread operator', 'Template literals', 'Destructuring assignment', 'Default parameters'], ans: 2, diff: 'easy' },
    ],
    python: [
        { q: 'Which function is used to get input from the user in Python?', opts: ['print()', 'input()', 'get()', 'read()'], ans: 1, diff: 'easy' },
        { q: 'What is the correct way to define a function in Python?', opts: ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'], ans: 1, diff: 'easy' },
        { q: 'Which data structure uses key-value pairs in Python?', opts: ['List', 'Tuple', 'Dictionary', 'Set'], ans: 2, diff: 'easy' },
        { q: 'What does the `self` parameter in a class method refer to?', opts: ['The class itself', 'The instance of the class', 'The base class', 'Nothing'], ans: 1, diff: 'medium' },
        { q: 'What is a list comprehension?', opts: ['A for loop', 'A compact way to create lists', 'A built-in function', 'A tuple operation'], ans: 1, diff: 'medium' },
        { q: 'What does `len()` return for a string?', opts: ['The size in bytes', 'The number of characters', 'The number of words', 'The number of lines'], ans: 1, diff: 'easy' },
        { q: 'What is the output of `type([])` in Python?', opts: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"], ans: 0, diff: 'easy' },
        { q: 'Which keyword is used to handle exceptions?', opts: ['catch', 'error', 'except', 'handle'], ans: 2, diff: 'easy' },
        { q: 'What is a generator in Python?', opts: ['A random number function', 'A function that yields values', 'A class decorator', 'A list method'], ans: 1, diff: 'hard' },
        { q: 'What does `*args` allow in a function?', opts: ['Keyword arguments', 'Variable positional arguments', 'Pointer arguments', 'No arguments'], ans: 1, diff: 'medium' },
    ],
    html: [
        { q: 'What does HTML stand for?', opts: ['HyperText Makeup Language', 'HyperText Markup Language', 'High Text Markup Language', 'HyperText Machine Language'], ans: 1, diff: 'easy' },
        { q: 'Which tag is used for the largest heading?', opts: ['<h6>', '<heading>', '<h1>', '<head>'], ans: 2, diff: 'easy' },
        { q: 'Which attribute specifies a unique id for an HTML element?', opts: ['class', 'id', 'name', 'key'], ans: 1, diff: 'easy' },
        { q: 'What is the correct HTML element for inserting a line break?', opts: ['<lb>', '<break>', '<br>', '<newline>'], ans: 2, diff: 'easy' },
        { q: 'Which HTML attribute is used to define inline styles?', opts: ['styles', 'class', 'font', 'style'], ans: 3, diff: 'easy' },
        { q: 'What does the `alt` attribute do for an `<img>` tag?', opts: ['Changes image size', 'Provides alternative text', 'Changes image color', 'Links the image'], ans: 1, diff: 'easy' },
        { q: 'Which tag is used to create an unordered list?', opts: ['<ol>', '<list>', '<ul>', '<li>'], ans: 2, diff: 'easy' },
        { q: 'What is the purpose of the `<meta charset="UTF-8">` tag?', opts: ['Sets page title', 'Defines character encoding', 'Sets page width', 'Links a stylesheet'], ans: 1, diff: 'medium' },
        { q: 'Which HTML element defines the document\'s body?', opts: ['<main>', '<section>', '<body>', '<content>'], ans: 2, diff: 'easy' },
        { q: 'What does `<a href="#">` link to?', opts: ['External page', 'Current page top', 'Next page', 'Nothing'], ans: 1, diff: 'medium' },
    ],
    css: [
        { q: 'What does CSS stand for?', opts: ['Computer Style Sheets', 'Creative Style Syntax', 'Cascading Style Sheets', 'Colorful Style Sheets'], ans: 2, diff: 'easy' },
        { q: 'Which property is used to change the text color?', opts: ['text-color', 'font-color', 'color', 'foreground'], ans: 2, diff: 'easy' },
        { q: 'How do you select an element with id "header" in CSS?', opts: ['.header', 'header', '*header', '#header'], ans: 3, diff: 'easy' },
        { q: 'Which property controls the text size?', opts: ['font-style', 'text-size', 'font-size', 'text-style'], ans: 2, diff: 'easy' },
        { q: 'How do you make text bold in CSS?', opts: ['font-weight: bold', 'text-weight: bold', 'font-style: bold', 'text-style: bold'], ans: 0, diff: 'easy' },
        { q: 'Which property adds space inside the border of an element?', opts: ['margin', 'border', 'padding', 'space'], ans: 2, diff: 'easy' },
        { q: 'What is the default value of `position` property?', opts: ['absolute', 'relative', 'fixed', 'static'], ans: 3, diff: 'medium' },
        { q: 'Which value of `display` makes an element a flex container?', opts: ['block', 'flex', 'inline', 'grid'], ans: 1, diff: 'easy' },
        { q: 'What does `box-sizing: border-box` do?', opts: ['Adds extra space outside', 'Includes padding and border in width', 'Removes the border', 'Doubles the margin'], ans: 1, diff: 'medium' },
        { q: 'Which CSS unit is relative to the viewport width?', opts: ['px', 'em', 'rem', 'vw'], ans: 3, diff: 'medium' },
    ],
    general: [
        { q: 'What does HTTP stand for?', opts: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Technical Protocol', 'Home Transfer Text Process'], ans: 0, diff: 'easy' },
        { q: 'What is Git primarily used for?', opts: ['Database management', 'Version control', 'Web hosting', 'Task scheduling'], ans: 1, diff: 'easy' },
        { q: 'What does SQL stand for?', opts: ['Structured Query Language', 'System Query Logic', 'Simple Question Logic', 'Structured Quick Language'], ans: 0, diff: 'easy' },
        { q: 'Which data structure follows LIFO order?', opts: ['Queue', 'Array', 'Stack', 'Linked List'], ans: 2, diff: 'medium' },
        { q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2, diff: 'medium' },
        { q: 'What does API stand for?', opts: ['Application Programming Interface', 'Advanced Program Integration', 'Application Process Interface', 'Automated Programming Interface'], ans: 0, diff: 'easy' },
        { q: 'Which protocol is used to send email?', opts: ['FTP', 'HTTP', 'SMTP', 'SSH'], ans: 2, diff: 'medium' },
        { q: 'What is a primary key in a database?', opts: ['The first column', 'A unique identifier for each row', 'The main table', 'A foreign reference'], ans: 1, diff: 'easy' },
        { q: 'What does OOP stand for?', opts: ['Object-Oriented Programming', 'Open Operations Protocol', 'Output-Oriented Process', 'Object-Only Programming'], ans: 0, diff: 'easy' },
        { q: 'Which sorting algorithm has the best average-case time complexity?', opts: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'], ans: 2, diff: 'hard' },
    ],
};

const QUIZ_CONFIG = {
    questionsPerQuiz: 10,
    timePerQuestion: 20, // seconds
};

let quizState = {
    category: 'javascript',
    questions: [],
    current: 0,
    answers: [],
    score: 0,
    timer: null,
    timeLeft: 0,
    startTime: null,
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('quiz.html')) {
        SR.redirectIfNotLoggedIn();
        initQuizPage();
    }
});

function initQuizPage() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat') || 'javascript';
    quizState.category = category;

    const allQuestions = QUESTION_BANK[category] || QUESTION_BANK.general;
    quizState.questions = shuffle([...allQuestions]).slice(0, QUIZ_CONFIG.questionsPerQuiz);
    quizState.answers = new Array(quizState.questions.length).fill(null);

    renderQuizHeader();
    renderQuestion(0);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderQuizHeader() {
    const catNameEl = document.getElementById('quiz-category');
    const totalEl = document.getElementById('quiz-total');
    if (catNameEl) catNameEl.textContent = SR.capitalize(quizState.category);
    if (totalEl) totalEl.textContent = quizState.questions.length;
}

function renderQuestion(idx) {
    const { questions, answers } = quizState;
    const q = questions[idx];
    if (!q) return;

    quizState.current = idx;
    quizState.startTime = Date.now();

    // Update progress
    const progressFill = document.getElementById('quiz-progress');
    const qNumEl = document.getElementById('q-num');
    if (progressFill) progressFill.style.width = ((idx / questions.length) * 100) + '%';
    if (qNumEl) qNumEl.textContent = idx + 1;

    // Question text
    const qText = document.getElementById('question-text');
    if (qText) {
        qText.classList.add('anim-fade-in-up');
        qText.textContent = q.q;
        setTimeout(() => qText.classList.remove('anim-fade-in-up'), 600);
    }

    // Difficulty badge
    const diffEl = document.getElementById('question-diff');
    if (diffEl) {
        const map = { easy: 'badge-green', medium: 'badge-amber', hard: 'badge-red' };
        diffEl.className = `badge ${map[q.diff] || 'badge-cyan'}`;
        diffEl.textContent = SR.capitalize(q.diff);
    }

    // Render options
    const optsContainer = document.getElementById('options-container');
    if (optsContainer) {
        optsContainer.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];
        q.opts.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn anim-fade-in-up';
            btn.style.animationDelay = (i * 0.08) + 's';
            btn.dataset.index = i;
            if (answers[idx] === i) btn.classList.add('selected');
            btn.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span class="option-text">${opt}</span>
      `;
            btn.addEventListener('click', () => selectOption(i));
            optsContainer.appendChild(btn);
        });
    }

    // Nav buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.textContent = (idx === questions.length - 1) ? 'Finish Quiz 🎉' : 'Next →';

    prevBtn?.addEventListener('click', () => goTo(idx - 1));
    nextBtn?.addEventListener('click', () => {
        if (idx === questions.length - 1) finishQuiz();
        else goTo(idx + 1);
    });

    startTimer();
}

function selectOption(optIdx) {
    const { current, answers } = quizState;
    // If already answered, ignore
    const existingAnswer = answers[current];

    answers[current] = optIdx;
    quizState.answers = answers;

    // Update UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.index) === optIdx) btn.classList.add('selected');
    });

    // Update dot nav
    updateDotNav();
}

function goTo(idx) {
    if (idx < 0 || idx >= quizState.questions.length) return;
    clearTimer();

    // Reinit nav buttons (remove old duplicate listeners by cloning)
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) { const p = prevBtn.cloneNode(true); prevBtn.parentNode.replaceChild(p, prevBtn); }
    if (nextBtn) { const n = nextBtn.cloneNode(true); nextBtn.parentNode.replaceChild(n, nextBtn); }

    renderQuestion(idx);
}

function startTimer() {
    clearTimer();
    quizState.timeLeft = QUIZ_CONFIG.timePerQuestion;
    updateTimerUI(quizState.timeLeft);

    quizState.timer = setInterval(() => {
        quizState.timeLeft--;
        updateTimerUI(quizState.timeLeft);
        if (quizState.timeLeft <= 0) {
            clearTimer();
            // Auto-advance
            if (quizState.current < quizState.questions.length - 1) goTo(quizState.current + 1);
            else finishQuiz();
        }
    }, 1000);
}

function clearTimer() { clearInterval(quizState.timer); }

function updateTimerUI(secs) {
    const totalSecs = QUIZ_CONFIG.timePerQuestion;
    const timerEl = document.getElementById('timer-seconds');
    const ringEl = document.getElementById('timer-ring-fill');

    if (timerEl) timerEl.textContent = secs;
    if (ringEl) {
        const circumference = 283;
        const offset = circumference - (secs / totalSecs) * circumference;
        ringEl.style.strokeDashoffset = offset;
        ringEl.className = 'ring-fill';
        if (secs <= 5) ringEl.classList.add('danger');
        else if (secs <= 10) ringEl.classList.add('warn');
    }
}

function updateDotNav() {
    document.querySelectorAll('.dot-nav-item').forEach((dot, i) => {
        dot.classList.remove('answered', 'unanswered', 'current');
        if (i === quizState.current) dot.classList.add('current');
        else if (quizState.answers[i] !== null) dot.classList.add('answered');
        else dot.classList.add('unanswered');
    });
}

function finishQuiz() {
    clearTimer();
    const { questions, answers } = quizState;
    let correct = 0;
    const breakdown = questions.map((q, i) => {
        const isCorrect = answers[i] === q.ans;
        if (isCorrect) correct++;
        return { question: q.q, selected: answers[i], correct: q.ans, options: q.opts, isCorrect, diff: q.diff };
    });

    const score = Math.round((correct / questions.length) * 100);
    const result = {
        id: 'r' + Date.now(),
        category: quizState.category,
        date: new Date().toISOString(),
        score,
        correct,
        total: questions.length,
        breakdown,
        timeTaken: Math.round((Date.now() - (quizState.startTime || Date.now())) / 1000),
    };

    // Save result
    const user = SR.getCurrentUser();
    if (user) {
        const history = JSON.parse(localStorage.getItem('skillrank_history_' + user.id) || '[]');
        history.unshift(result);
        localStorage.setItem('skillrank_history_' + user.id, JSON.stringify(history.slice(0, 50)));

        // Update user stats
        const users = JSON.parse(localStorage.getItem('skillrank_users') || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx].quizzesTaken = (users[idx].quizzesTaken || 0) + 1;
            users[idx].totalScore = (users[idx].totalScore || 0) + score;
            const taken = users[idx].quizzesTaken;
            users[idx].avgScore = Math.round(users[idx].totalScore / taken);
            localStorage.setItem('skillrank_users', JSON.stringify(users));
            localStorage.setItem('skillrank_user', JSON.stringify(users[idx]));
        }
    }

    localStorage.setItem('skillrank_last_result', JSON.stringify(result));
    window.location.href = 'results.html';
}

// Build dot nav
function buildDotNav() {
    const container = document.getElementById('dot-nav');
    if (!container) return;
    container.innerHTML = '';
    quizState.questions.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot-nav-item' + (i === 0 ? ' current' : ' unanswered');
        dot.textContent = i + 1;
        dot.style.cssText = `
      width:32px;height:32px;border-radius:50%;font-size:0.75rem;font-weight:600;
      cursor:pointer;transition:0.2s;border:2px solid var(--glass-border);
      background:var(--glass);color:var(--text-secondary);
    `;
        dot.addEventListener('click', () => goTo(i));
        container.appendChild(dot);
    });
}

// Expose for HTML
window.buildDotNav = buildDotNav;
window.finishQuiz = finishQuiz;
