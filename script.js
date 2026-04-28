const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('preview-canvas');
const pctx = preview.getContext('2d');

canvas.width = 800;
canvas.height = 500;
preview.width = 800;
preview.height = 500;

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let currentTool = 'pen';
let isDrawing = false;
let startX = 0;
let startY = 0;

const brushColor = document.getElementById('pen-color');
const brushSize = document.getElementById('pen-size');
const sizeLabel = document.getElementById('pen-size');
const statusTool = document.getElementById('status-tool');
const statusCoords = document.getElementById('status-coords');
const statusSize = document.getElementById('status-size');

const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');

toolButtons.forEach(btn => {
btn.addEventListener('click', () => {
currentTool = btn.dataset.tool;
toolButtons.forEach(b => b.classList.remove('active'));
btn.classList.add('active');
updateStatus();
});
});

brushSize.addEventListener('input', () => {
sizeLabel.textContent = brushSize.value;
updateStatus();
});

document.getElementById('btn-resize').addEventListener('click', () => {
const newW = parseInt(document.getElementById('canvas-width').value);
const newH = parseInt(document.getElementById('canvas-height').value);

const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

canvas.width = newW;
canvas.height = newH;
preview.width = newW;
preview.height = newH;

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, newW, newH);
ctx.putImageData(snapshot, 0, 0);

});

document.getElementById('reset-canvas').addEventListener('click', () => {
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY]; // Start coordinates
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);
function draw(e) {
    if (!isDrawing) return; 
    if (currentTool === 'eraser') {
        ctx.lineWidth = brushSize.value * 1.25; 
        ctx.strokeStyle = '#ffffff';
        ctx.lineCap = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY); 
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
        return; 
    }
    if (currentTool === 'pen') {
        ctx.lineWidth = brushSize.value;
        ctx.strokeStyle = brushColor.value;
        ctx.lineCap = 'round';
        ctx.fillStyle = brushColor.value;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY); // move to starting point
        ctx.lineTo(e.offsetX, e.offsetY); //create line to new point
        ctx.stroke(); // draw the line
        [lastX, lastY] = [e.offsetX, e.offsetY]; // update previous 
        return
    }
}

function updateStatus() {
const toolName = currentTool.toUpperCase();
statusTool.textContent = `Tool: ${toolName}`;
statusSize.textContent = `Size: ${brushSize.value}px`;}

updateStatus();
