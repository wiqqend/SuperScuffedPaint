const picker = document.getElementById('picker');
        const text = document.getElementById('text');
        picker.addEventListener('input', (event) => {
            text.style.color = event.target.value;
        });