let minutes = 0;
let seconds = 0;
let timer;
let timerRunning = false;
let countdownEnded = false;
const audioElement = new Audio("/statics/timeover.mp3");
let touchStartY = 0;
let touchMoveY = 0;

document.addEventListener("touchstart", function (e) {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", function (e) {
  touchMoveY = e.touches[0].clientY;
  const deltaY = touchMoveY - touchStartY;

  // 在这里模拟页面的滚动
  window.scrollBy(0, -deltaY);

  // 阻止默认滚动行为
  e.preventDefault();
});

function updateSystemTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  document.getElementById("systemTime").textContent = `${formattedTime}`;
}
setInterval(updateSystemTime, 1000);
updateSystemTime();

const threshold = 500;
window.setInterval(function () {
  if (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  ) {
    window.location.href = "about:blank";
  }
}, 1000);

function highlightCurrentDay() {
  const today = new Date().getDay();
  const timetable = document.querySelector("table");

  if (today !== 0 && today !== 6 && timetable) {
    const tableHeaders = timetable.querySelectorAll("th");
    const tableRows = timetable.querySelectorAll("tr");

    tableHeaders.forEach((header, index) => {
      if (index === today) {
        tableRows.forEach((row) => {
          const cells = row.querySelectorAll("td, th");
          cells[index].classList.add("highlight-column");
        });
      } else {
        tableRows.forEach((row) => {
          const cells = row.querySelectorAll("td, th");
          cells[index].classList.remove("highlight-column");
        });
      }
    });
  }
}
highlightCurrentDay();
setInterval(highlightCurrentDay, 1000);

function saveTimerData() {
  const timerData = { minutes, seconds, timerRunning, countdownEnded };
  sessionStorage.setItem("timerData", JSON.stringify(timerData));
}

function loadTimerData() {
  const storedData = sessionStorage.getItem("timerData");
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    minutes = parsedData.minutes;
    seconds = parsedData.seconds;
    timerRunning = parsedData.timerRunning;
    countdownEnded = parsedData.countdownEnded;

    // 根据加载的数据更新显示
    updateTimerDisplay();
    // 根据加载的数据继续计时
    if (timerRunning && !(minutes === 0 && seconds === 0 && countdownEnded)) {
      startTimer();
    }
  }
}

function updateTimerDisplay() {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  document.getElementById(
    "timerDisplay"
  ).textContent = `${formattedMinutes}:${formattedSeconds}`;
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
          countdownEnded = true; // 设置为true表示倒计时结束
          audioElement.play();
        }
      }
      saveTimerData();
      updateTimerDisplay();
    }, 1000);
    timerRunning = true;
    countdownEnded = false;
  }
}

function pauseTimer() {
  clearInterval(timer);
  timerRunning = false;
  saveTimerData();
}

function stopTimer() {
  clearInterval(timer);
  minutes = 0;
  seconds = 0;
  updateTimerDisplay();
  timerRunning = false;
  countdownEnded = false;
  saveTimerData();
  sessionStorage.removeItem("timerData");
}

function updateTimerDisplay() {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const timerDisplay = document.getElementById("timerDisplay");
  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

  if (
    formattedMinutes === "00" &&
    formattedSeconds === "00" &&
    countdownEnded === false
  ) {
    timerDisplay.style.color = "red";
  } else {
    timerDisplay.style.color = "black"; // Reset color if not 00:00
  }
}

function scrollToBottom() {
  const timerContainer = document.querySelector(".timer-container");
  if (timerContainer) {
    // 使用 smooth behavior 让滚动平滑进行
    timerContainer.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

function scrollToTop() {
  // 使用原生的 JavaScript 获取顶部的位置，然后调用滚动函数
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 这会使滚动具有平滑的动画效果
  });
}
