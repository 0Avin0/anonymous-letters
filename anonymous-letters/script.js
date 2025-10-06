class AnonymousLetters {
    constructor() {
        this.letterText = document.getElementById('letterText');
        this.sendBtn = document.getElementById('sendBtn');
        this.charCount = document.getElementById('charCount');
        this.message = document.getElementById('message');
        
        this.init();
    }
    
    init() {
        this.letterText.addEventListener('input', this.updateCharCount.bind(this));
        this.sendBtn.addEventListener('click', this.sendLetter.bind(this));
    }
    
    updateCharCount() {
        const count = this.letterText.value.length;
        this.charCount.textContent = count;
        
        if (count > 1800) {
            this.charCount.style.color = '#ee9090';
        } else {
            this.charCount.style.color = '#888';
        }
    }
    
    async sendLetter() {
        const text = this.letterText.value.trim();
        
        if (!text) {
            this.showMessage('Будь ласка, напиши щось перед відправкою', 'error');
            return;
        }
        
        if (text.length < 10) {
            this.showMessage('Лист занадто короткий. Розкажи більше...', 'error');
            return;
        }
        
        this.sendBtn.disabled = true;
        this.sendBtn.textContent = 'Відправляємо...';
        
        try {
            await this.saveLetter(text);
            this.showMessage('Твій лист успішно відправлений! Дякую, що довірився.', 'success');
            this.letterText.value = '';
            this.updateCharCount();
        } catch (error) {
            this.showMessage('Помилка при відправці. Спробуй ще раз.', 'error');
        } finally {
            this.sendBtn.disabled = false;
            this.sendBtn.textContent = 'Надіслати лист';
        }
    }
    
    async saveLetter(text) {
        const letter = {
            id: Date.now().toString(),
            text: text,
            timestamp: new Date().toISOString(),
            ip: await this.getIP()
        };
        
        const letters = JSON.parse(localStorage.getItem('anonymous_letters') || '[]');
        letters.push(letter);
        localStorage.setItem('anonymous_letters', JSON.stringify(letters));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    async getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }
    
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `message ${type}`;
        
        setTimeout(() => {
            this.message.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnonymousLetters();
});
