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

class Tool {
    constructor(name, color, width) {
        this.name = name;
        this.color = color;
        this.width = width;
    }

    activate() {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        ctx.fillStyle = this.color;
    }

    draw(e) {
    }
}

class Pen extends Tool {
    constructor(color, width) {
        super('pen', color, width);
    }

    draw(e) {
        this.color = brushColor.value;
        this.width = brushSize.value;
        this.activate();
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
        statusCoords.textContent = `X: ${lastX}, Y: ${lastY}`;
    }
}

class Eraser extends Tool {
    constructor(width) {
        super('eraser', '#ffffff', width);
    }

    draw(e) {
        this.width = brushSize.value * 1.25;
        this.activate();
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
        statusCoords.textContent = `X: ${lastX}, Y: ${lastY}`;
    }
}

class Fill extends Tool {
    constructor(color) {
        super('fill', color, 1);
    }

    draw(e) {
        this.color = brushColor.value;
        fillBucket(e.offsetX, e.offsetY, this.color);
    }
}

const tools = {
    pen: new Pen(brushColor.value, brushSize.value),
    eraser: new Eraser(brushSize.value),
    fill: new Fill(brushColor.value),
};
let currentTool = 'pen';
const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');

function getActiveTool() {
    if (currentTool === 'pen') return tools.pen;
    if (currentTool === 'eraser') return tools.eraser;
    if (currentTool === 'fill') return tools.fill;
    return null;
}

const statusbar = document.getElementById('statusbar');
statusbar.innerHTML = '';

const statusItems = ['status-tool', 'status-coords', 'status-size'];
const statusLabels = ['Tool: PEN', 'X: 0, Y: 0', 'Size: 5px'];

statusItems.forEach((id, index) => {
    const span = document.createElement('span');
    span.id = id;
    span.textContent = statusLabels[index];
    statusbar.appendChild(span);

    const br = document.createElement('br');
    statusbar.appendChild(br);
});

const statusToolEl = document.getElementById('status-tool');
const statusCoordsEl = document.getElementById('status-coords');
const statusSizeEl = document.getElementById('status-size');

// 
// Event Listeners
//

window.addEventListener('load', () => {
    const savedTool = JSON.parse(localStorage.getItem('currentTool'));
    if (savedTool) currentTool = savedTool;
    updateStatus();
});

toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const toolName = btn.dataset.tool;

        if (['save', 'load', 'resize', 'reset', 'save-as'].includes(toolName)) return;

        currentTool = toolName;
        toolButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateStatus();
    });
});

brushSize.addEventListener('input', () => {
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
    [lastX, lastY] = [e.offsetX, e.offsetY];

    if (currentTool === 'fill') {
        const activeTool = getActiveTool();
        activeTool.draw(e);
    }
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

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
        if (!file) return;
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
});

// Save to localStorage
document.getElementById('btn-save').addEventListener('click', () => {
    localStorage.setItem('currentTool', JSON.stringify(currentTool));
    localStorage.setItem('myCanvas', canvas.toDataURL());
    localStorage.setItem('brushSize', brushSize.value);
    localStorage.setItem('brushColor', brushColor.value);
    localStorage.setItem('newW', canvas.width);
    localStorage.setItem('newH', canvas.height);
});

function draw(e) {
    if (!isDrawing) return;
    if (brushSize.value < 1) return;
    if (currentTool === 'fill') return; // fill is handled on mousedown

    const activeTool = getActiveTool();
    if (activeTool) {
        activeTool.draw(e);
    }
}




function loadCanvas() {
    const dataURL = localStorage.getItem('myCanvas');
    if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
    }
    const savedTool = localStorage.getItem('currentTool');
    if (savedTool) currentTool = JSON.parse(savedTool);

    const savedSize = localStorage.getItem('brushSize');
    brushSize.value = savedSize ? savedSize : 5;

    const savedColor = localStorage.getItem('brushColor');
    if (savedColor) brushColor.value = savedColor;

    const newW = localStorage.getItem('newW');
    const newH = localStorage.getItem('newH');
    if (newW && newH) {
        canvas.width = newW;
        canvas.height = newH;
        document.getElementById('canvas-width').value = newW;
        document.getElementById('canvas-height').value = newH;
    }

    updateStatus();
}

function fillBucket(image, startX, startY, newColor) {
    const rowPx = canvas.width;
    const colPx = canvas.height;
    oldColor = ctx.getImageData(startX, startY, 1, 1).data;
    if (oldColor === newColor) {
        return; 
    }

    queue = [[]];
    queue[0] = [startX, startY];

    imageData = ctx.getImageData(0, 0, rowPx, colPx);
    imageData[startX][startY] = newColor;

    delRow = [-1,1,0,0];
    delCol = [0,0,-1,1];

    while (queue.length > 0) {
        currentCell = queue.shift();
        row = currentCell.row;
        col = currentCell.col;
        for (let i = 0; i < 4; i++) {
            newRow = row + delRow[i];
            newCol = col + delCol[i];

            if (newRow >0 && newRow < rowPx && newCol > 0 && newCol < colPx && imageData[newRow][newCol] === oldColor) {
                queue.push([newRow, newCol]);
                imageData[newRow][newCol] = newColor;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function updateStatus() {
    const toolName = currentTool ? currentTool.toUpperCase() : 'PEN';
    statusToolEl.textContent = `Tool: ${toolName}`;
    statusSizeEl.textContent = `Size: ${brushSize.value}px`;
}



loadCanvas();
updateStatus();
