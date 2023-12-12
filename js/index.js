let minutes = 0;
let seconds = 0;
let timer;
let timerRunning = false;

function updateSystemTime() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    document.getElementById('systemTime').textContent = `${formattedTime}`;
}
setInterval(updateSystemTime, 1000);
updateSystemTime();

let threshold = 500
window.setInterval(function () {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        window.location.href = "about:blank"
    }
}, 1000)

function highlightCurrentDay() {
    const today = new Date().getDay();
    const timetable = document.querySelector('table');

    if (today !== 0 && today !== 6 && timetable) {
        const tableHeaders = timetable.querySelectorAll('th');
        const tableRows = timetable.querySelectorAll('tr');

        tableHeaders.forEach((header, index) => {
            if (index === today) {
                tableRows.forEach(row => {
                    const cells = row.querySelectorAll('td, th');
                    cells[index].classList.add('highlight-column');
                });
            } else {
                tableRows.forEach(row => {
                    const cells = row.querySelectorAll('td, th');
                    cells[index].classList.remove('highlight-column');
                });
            }
        });
    }
}
highlightCurrentDay();
setInterval(highlightCurrentDay, 1000);


function updateTimerDisplay() {
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function decreaseMinute() {
    if (minutes > 0) {
        minutes--;
        updateTimerDisplay();
    }
}

function increaseMinute() {
    minutes++;
    updateTimerDisplay();
}

function decreaseSecond() {
    if (seconds > 0) {
        seconds--;
        updateTimerDisplay();
    }
}

function increaseSecond() {
    if (seconds < 59) {
        seconds++;
    } else {
        seconds = 0;
        increaseMinute();
    }
    updateTimerDisplay();
}

function startTimer() {
    if (!timerRunning) {
        timer = setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else {
                if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else {
                    clearInterval(timer);
                    timerRunning = false;
                }
            }
            updateTimerDisplay();
        }, 1000);
        timerRunning = true;
    }
}

function pauseTimer() {
    clearInterval(timer);
    timerRunning = false;
}

function stopTimer() {
    clearInterval(timer);
    minutes = 0;
    seconds = 0;
    updateTimerDisplay();
    timerRunning = false;
}

function updateTimerDisplay() {
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

    if (formattedMinutes === '00' && formattedSeconds === '00') {
        timerDisplay.style.color = 'red';
    } else {
        timerDisplay.style.color = 'black'; // Reset color if not 00:00
    }
}

function scrollToBottom() {
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
        // 使用 smooth behavior 让滚动平滑进行
        timerContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

function scrollToTop() {
    // 使用原生的 JavaScript 获取顶部的位置，然后调用滚动函数
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // 这会使滚动具有平滑的动画效果，如果不需要动画可以将其删除
    });
}