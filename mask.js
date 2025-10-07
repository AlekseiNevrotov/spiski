 document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    function applyMask(digits) {
        let output = '+7('; 
        if (digits.length >= 1) output += digits.substring(0, 3); 
        if (digits.length >= 3) output += ') '; 
        if (digits.length >= 4) output += digits.substring(3, 6); 
        if (digits.length >= 6) output += '–'; 
        if (digits.length >= 7) output += digits.substring(6, 8); 
        if (digits.length >= 8) output += '–'; 
        if (digits.length >= 8) output += digits.substring(8, 10); 
        return output.trim(); 
    }
    phoneInput.addEventListener('input', function(e) {
        let digits = this.value.replace(/\D/g, '');
        if (digits.startsWith('7') || digits.startsWith('8')) {
            digits = digits.slice(1);
        }
        digits = digits.slice(0, 10); 
        this.value = applyMask(digits);
    });
    phoneInput.addEventListener('keypress', (event) => {
        if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
            event.preventDefault();
        }
    });
    const form = phoneInput.closest('form');
    form.addEventListener('submit', function(e) {
        let digits = phoneInput.value.replace(/\D/g, '');
        if (digits.startsWith('7')) {
            digits = '8' + digits.slice(1);
        } else if (!digits.startsWith('8')) {
            digits = '8' + digits;
        }
        phoneInput.value = digits;
    });
});