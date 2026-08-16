// ===== NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navLinksItems.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                navLinksItems.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// ===== PREDICTION DATA =====
let predictions = [];
let counts = { excellent: 0, good: 0, average: 0, atrisk: 0 };

// ===== FORM SUBMISSION =====
document.getElementById('predictionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const grade = document.getElementById('grade').value;
    const gpa = parseFloat(document.getElementById('gpa').value);
    const attendance = parseFloat(document.getElementById('attendance').value);
    const studyHours = parseFloat(document.getElementById('studyHours').value);
    const assignments = parseFloat(document.getElementById('assignments').value);
    const math = parseFloat(document.getElementById('math').value);
    const science = parseFloat(document.getElementById('science').value);
    const english = parseFloat(document.getElementById('english').value);
    const social = parseFloat(document.getElementById('social').value);
    const parentEdu = document.getElementById('parentEdu').value;
    const extra = document.getElementById('extra').value;
    const sleep = parseFloat(document.getElementById('sleep').value);
    const internet = document.getElementById('internet').value;

    // ===== AI PREDICTION ALGORITHM =====
    let score = 0;

    // GPA Weight (25%)
    score += (gpa / 4.0) * 25;

    // Average Subject Score Weight (25%)
    const avgSubject = (math + science + english + social) / 4;
    score += (avgSubject / 100) * 25;

    // Attendance Weight (15%)
    score += (attendance / 100) * 15;

    // Study Hours Weight (10%)
    const studyScore = Math.min(studyHours / 6, 1);
    score += studyScore * 10;

    // Assignments Weight (10%)
    score += (assignments / 100) * 10;

    // Parental Education Weight (5%)
    const parentScoreMap = { none: 0, primary: 1, secondary: 2, bachelor: 3, master: 4 };
    score += (parentScoreMap[parentEdu] / 4) * 5;

    // Extracurricular Weight (5%)
    const extraScoreMap = { none: 0, low: 1, medium: 2, high: 3 };
    score += (extraScoreMap[extra] / 3) * 5;

    // Sleep Weight (3%)
    const sleepScore = sleep >= 7 && sleep <= 9 ? 1 : sleep >= 6 ? 0.7 : 0.4;
    score += sleepScore * 3;

    // Internet Access Weight (2%)
    score += internet === 'yes' ? 2 : 0;

    const finalScore = Math.round(Math.min(score, 100));

    // Determine Level
    let level, levelClass, badgeClass, levelIcon, levelDesc, recommendations;

    if (finalScore >= 80) {
        level = 'Excellent Performer';
        levelClass = 'excellent';
        badgeClass = 'badge-excellent';
        levelIcon = '🏆';
        levelDesc = 'This student shows outstanding academic potential and is on track for high achievement.';
        recommendations = [
            'Challenge with advanced coursework or honors programs.',
            'Encourage participation in academic competitions.',
            'Explore scholarship and gifted student opportunities.',
            'Maintain current study habits and healthy routines.',
            'Consider mentorship roles to build leadership skills.'
        ];
    } else if (finalScore >= 65) {
        level = 'Good Performer';
        levelClass = 'good';
        badgeClass = 'badge-good';
        levelIcon = '👍';
        levelDesc = 'This student demonstrates solid academic performance with room to reach excellence.';
        recommendations = [
            'Set specific improvement goals for weaker subjects.',
            'Increase study hours by 30-45 minutes daily.',
            'Join study groups for collaborative learning.',
            'Seek additional resources like tutoring or online courses.',
            'Improve attendance consistency to boost performance.'
        ];
    } else if (finalScore >= 45) {
        level = 'Average Performer';
        levelClass = 'average';
        badgeClass = 'badge-average';
        levelIcon = '📊';
        levelDesc = 'This student needs consistent support and targeted improvement strategies.';
        recommendations = [
            'Schedule regular one-on-one sessions with teachers.',
            'Create a structured daily study schedule.',
            'Identify and focus on the weakest subjects immediately.',
            'Limit distractions and increase study hours significantly.',
            'Parental involvement and regular check-ins recommended.',
            'Ensure adequate sleep of 7-9 hours per night.'
        ];
    } else {
        level = 'At-Risk Student';
        levelClass = 'atrisk';
        badgeClass = 'badge-atrisk';
        levelIcon = '⚠️';
        levelDesc = 'This student requires immediate intervention and comprehensive support.';
        recommendations = [
            'Immediate counselor and teacher intervention required.',
            'Develop a personalized learning improvement plan.',
            'Address attendance issues as top priority.',
            'Assess for possible learning disabilities or personal challenges.',
            'Arrange peer tutoring and daily teacher check-ins.',
            'Family meeting recommended to discuss support strategies.',
            'Monitor progress weekly and adjust plan accordingly.'
        ];
    }

    // Factor Analysis
    const factors = [
        { label: 'Academic GPA', value: Math.round((gpa / 4.0) * 100), color: '#6c63ff' },
        { label: 'Subject Scores', value: Math.round(avgSubject), color: '#ff6584' },
        { label: 'Attendance', value: Math.round(attendance), color: '#2ecc71' },
        { label: 'Study Habits', value: Math.round(studyScore * 100), color: '#f39c12' },
        { label: 'Assignment Rate', value: Math.round(assignments), color: '#3498db' }
    ];

    // Show Result
    showResult({
        name: studentName,
        grade,
        score: finalScore,
        level,
        levelClass,
        badgeClass,
        levelIcon,
        levelDesc,
        factors,
        recommendations
    });

    // Update Dashboard
    updateDashboard({
        name: studentName,
        grade,
        score: finalScore,
        levelClass,
        badgeClass
    });
});

// ===== SHOW RESULT =====
function showResult(data) {
    document.querySelector('.result-placeholder').style.display = 'none';
    const resultContent = document.getElementById('resultContent');
    resultContent.style.display = 'block';

    // Name & Grade
    document.getElementById('resultName').textContent = data.name;
    document.getElementById('resultGrade').textContent = `Grade: ${data.grade} | Predicted Score: ${data.score}%`;

    // Badge
    const badge = document.getElementById('resultBadge');
    badge.textContent = data.level;
    badge.className = `result-badge ${data.badgeClass}`;

    // Performance Level
    const perfLevel = document.getElementById('performanceLevel');
    perfLevel.className = `performance-level ${data.levelClass}`;
    document.getElementById('levelIcon').textContent = data.levelIcon;
    document.getElementById('levelTitle').textContent = data.level;
    document.getElementById('levelDesc').textContent = data.levelDesc;

    // Animate Score Circle
    animateScore(data.score);

    // Factor Bars
    const factorBars = document.getElementById('factorBars');
    factorBars.innerHTML = '';
    data.factors.forEach(factor => {
        const item = document.createElement('div');
        item.className = 'factor-bar-item';
        item.innerHTML = `
            <div class="factor-label">
                <span>${factor.label}</span>
                <span>${factor.value}%</span>
            </div>
            <div class="factor-progress">
                <div class="factor-fill" style="width: 0%; background: ${factor.color};" 
                     data-target="${factor.value}"></div>
            </div>
        `;
        factorBars.appendChild(item);
    });

    // Animate factor bars
    setTimeout(() => {
        document.querySelectorAll('.factor-fill').forEach(fill => {
            fill.style.width = fill.getAttribute('data-target') + '%';
        });
    }, 100);

    // Recommendations
    const recList = document.getElementById('recList');
    recList.innerHTML = '';
    data.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recList.appendChild(li);
    });

    // Scroll to result
    document.getElementById('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== ANIMATE SCORE CIRCLE =====
function animateScore(score) {
    const circle = document.getElementById('scoreCircle');
    const scoreValue = document.getElementById('scoreValue');
    const circumference = 534;

    // Set color based on score
    let color;
    if (score >= 80) color = '#2ecc71';
    else if (score >= 65) color = '#3498db';
    else if (score >= 45) color = '#f39c12';
    else color = '#e74c3c';

    circle.style.stroke = color;

    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Animate number
    let current = 0;
    const interval = setInterval(() => {
        current += 2;
        if (current >= score) {
            current = score;
            clearInterval(interval);
        }
        scoreValue.textContent = current + '%';
    }, 20);
}

// ===== UPDATE DASHBOARD =====
function updateDashboard(data) {
    // Update counts
    if (data.levelClass === 'excellent') counts.excellent++;
    else if (data.levelClass === 'good') counts.good++;
    else if (data.levelClass === 'average') counts.average++;
    else if (data.levelClass === 'atrisk') counts.atrisk++;

    document.getElementById('excellentCount').textContent = counts.excellent;
    document.getElementById('goodCount').textContent = counts.good;
    document.getElementById('averageCount').textContent = counts.average;
    document.getElementById('atRiskCount').textContent = counts.atrisk;

    // Add to predictions
    predictions.unshift(data);

    // Update bar chart
    updateBarChart();

    // Update recent list
    updateRecentList();
}

// ===== BAR CHART =====
function updateBarChart() {
    const barChart = document.getElementById('barChart');
    const total = Math.max(predictions.length, 1);
    const maxCount = Math.max(counts.excellent, counts.good, counts.average, counts.atrisk, 1);

    const chartData = [
        { label: 'Excellent', count: counts.excellent, color: '#2ecc71' },
        { label: 'Good', count: counts.good, color: '#3498db' },
        { label: 'Average', count: counts.average, color: '#f39c12' },
        { label: 'At-Risk', count: counts.atrisk, color: '#e74c3c' }
    ];

    barChart.innerHTML = '';

    chartData.forEach(item => {
        const height = Math.max((item.count / maxCount) * 150, 5);
        const group = document.createElement('div');
        group.className = 'bar-group';
        group.innerHTML = `
            <div class="bar-value" style="color: ${item.color}">${item.count}</div>
            <div class="bar" style="height: ${height}px; background: ${item.color};"></div>
            <div class="bar-label">${item.label}</div>
        `;
        barChart.appendChild(group);
    });
}

// ===== RECENT LIST =====
function updateRecentList() {
    const recentList = document.getElementById('recentList');
    recentList.innerHTML = '';

    predictions.slice(0, 8).forEach(pred => {
        const item = document.createElement('div');
        item.className = 'recent-item';

        const scoreColor =
            pred.levelClass === 'excellent' ? '#2ecc71' :
            pred.levelClass === 'good' ? '#3498db' :
            pred.levelClass === 'average' ? '#f39c12' : '#e74c3c';

        item.innerHTML = `
            <div class="recent-item-info">
                <h5>${pred.name}</h5>
                <p>Grade ${pred.grade}</p>
            </div>
            <div class="recent-item-score" style="background: ${scoreColor}22; color: ${scoreColor}; border: 1px solid ${scoreColor}50">
                ${pred.score}%
            </div>
        `;
        recentList.appendChild(item);
    });
}

// ===== PRINT =====
function printResult() {
    window.print();
}

// ===== RESET =====
function resetForm() {
    document.getElementById('predictionForm').reset();
    document.getElementById('resultContent').style.display = 'none';
    document.querySelector('.result-placeholder').style.display = 'flex';
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .dash-card, .about-stat, .chart-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== INPUT VALIDATION VISUAL =====
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        if (input.value) {
            input.style.borderColor = 'rgba(46, 204, 113, 0.5)';
        } else {
            input.style.borderColor = 'rgba(255,255,255,0.1)';
        }
    });
});