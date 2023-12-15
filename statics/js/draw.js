let threshold = 500
window.setInterval(function () {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        window.location.href = "about:blank"
    }
}, 1000)

const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// 设置Canvas大小为窗口大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.getElementById('controls').offsetHeight;

// 初始化颜色
let currentColor = '#000000'; // 黑色

// 鼠标或触摸开始绘制
function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
}

// 绘制过程
function draw(e) {
    if (!isDrawing) return;

    ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

// 结束绘制
function endDrawing() {
    isDrawing = false;
}

// 清空画布
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 颜色选择
function selectColor(color, buttonId) {
    currentColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(buttonId).classList.add('selected');
}

// 事件监听 - 鼠标事件
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

// 事件监听 - 触摸屏事件
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e.touches[0]);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0]);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    endDrawing();
});

// HTML 控制按钮绑定
document.getElementById('black').addEventListener('click', () => selectColor('#000000', 'black'));
document.getElementById('blue').addEventListener('click', () => selectColor('#0000FF', 'blue'));
document.getElementById('red').addEventListener('click', () => selectColor('#FF0000', 'red'));
document.getElementById('clear').addEventListener('click', clearCanvas);