const picker = document.getElementById('picker');
        const text = document.getElementById('text');
        picker.addEventListener('input', (event) => {
            text.style.color = event.target.value;
        });


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

const brushColor = document.getElementById('pencil-color');
const brushWidth = document.getElementById('pencil-size');

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);

function startDrawing(e){
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    isDrawing = true;
}
function endDrawing(){
    ctx.closePath();
    isDrawing = false;
}

function draw(e){
    if(!isDrawing) 
        return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushWidth.value;
    ctx.stroke();
}

const pencilbutton = document.getElementById('pencil');
pencilbutton.addEventListener('click', () => {
    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushWidth.value;
});

