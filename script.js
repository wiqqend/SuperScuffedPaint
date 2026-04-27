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

const brushColor = document.getElementById('pencil-color');
const brushSize = document.getElementById('pencil-size');
const sizeLabel = document.getElementById('pencil-size');
const statusTool = document.getElementById('status-tool');
const statusCoords = document.getElementById('status-coords');
const statusSize = document.getElementById('status-size');

const toolButtons = document.querySelectorAll('.tool-btn[data-tool]');

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