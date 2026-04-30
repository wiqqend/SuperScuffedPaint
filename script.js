const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 500;

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

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
const CT = JSON.parse(localStorage.getItem("currentTool"));
window.addEventListener('load', () => {
    currentTool = CT 
    updateStatus();
});


toolButtons.forEach(btn => {
btn.addEventListener('click', () => {
    if (btn.dataset.tool === 'save') {
        return;
    }
    if (btn.dataset.tool === 'load') {
        return;
    }
    if (btn.dataset.tool === 'resize') {
        return;
    }
    if (btn.dataset.tool === 'reset') {
        return;
    }
    if (btn.dataset.tool === 'save-as') {
        return;
    }   
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
    if (brushSize.value < 1) {
        return;
    }
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
        statusCoords.textContent = `X: ${lastX}, Y: ${lastY}`;
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

        statusCoords.textContent = `X: ${lastX}, Y: ${lastY}`;

        return
    }
}

document.getElementById('btn-save-as').addEventListener('click', () => {
const link = document.createElement('a');
link.download = 'ssp-drawing.png';
link.href = canvas.toDataURL('image/png');
link.click();
});


document.getElementById('btn-load').addEventListener('click', () => {
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) 
        return;  
    const reader = new FileReader();
    reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    });
input.click();
currentTool = btn.dataset.tool;
updateStatus();
});

document.getElementById('btn-save').addEventListener('click', () => {
    localStorage.setItem("currentTool", JSON.stringify(currentTool))
    localStorage.setItem("myCanvas", canvas.toDataURL());
    localStorage.setItem("brushSize", brushSize.value);
    localStorage.setItem("brushColor", brushColor.value);
});


function loadCanvas() {
    const dataURL = localStorage.getItem("myCanvas");
    const img = new Image();
    img.src = dataURL;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    currentTool = localStorage.getItem("currentTool");
    if (brushSize.value == null) {
        brushSize.value = 5;
    } else {brushSize.value = localStorage.getItem("brushSize");}
    brushColor.value = localStorage.getItem("brushColor");
    updateStatus();
    
}


function updateStatus() {
const toolName = currentTool.toUpperCase();
statusTool.textContent = `Tool: ${toolName}`;
statusSize.textContent = `Size: ${brushSize.value}px`;}




loadCanvas();
updateStatus();
