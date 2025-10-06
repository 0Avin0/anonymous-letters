class AdminPanel {
    constructor() {
        this.lettersList = document.getElementById('lettersList');
        this.loadBtn = document.getElementById('loadLetters');
        this.clearBtn = document.getElementById('clearAll');
        this.message = document.getElementById('adminMessage');
        
        this.init();
    }
    
    init() {
        this.loadBtn.addEventListener('click', this.loadLetters.bind(this));
        this.clearBtn.addEventListener('click', this.clearLetters.bind(this));
        this.loadLetters();
    }
    
    loadLetters() {
        const letters = JSON.parse(localStorage.getItem('anonymous_letters') || '[]');
        
        if (letters.length === 0) {
            this.lettersList.innerHTML = '<p style="text-align: center; color: #888;">Немає нових листів</p>';
            return;
        }
        
        this.lettersList.innerHTML = letters.map(letter => `
            <div class="letter-item">
                <div class="letter-header">
                    <span class="letter-date">${new Date(letter.timestamp).toLocaleString('uk-UA')}</span>
                    <span class="letter-ip">IP: ${letter.ip}</span>
                </div>
                <div class="letter-content">${this.escapeHtml(letter.text)}</div>
                <div class="letter-actions">
                    <button class="btn btn-reply" onclick="adminPanel.replyToLetter('${letter.id}')">Відповісти</button>
                    <button class="btn btn-delete" onclick="adminPanel.deleteLetter('${letter.id}')">Видалити</button>
                </div>
            </div>
        `).join('');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    clearLetters() {
        if (confirm('Ви впевнені, що хочете видалити всі листи?')) {
            localStorage.removeItem('anonymous_letters');
            this.loadLetters();
            this.showMessage('Всі листи видалені', 'success');
        }
    }
    
    deleteLetter(id) {
        const letters = JSON.parse(localStorage.getItem('anonymous_letters') || '[]');
        const filtered = letters.filter(letter => letter.id !== id);
        localStorage.setItem('anonymous_letters', JSON.stringify(filtered));
        this.loadLetters();
        this.showMessage('Лист видалений', 'success');
    }
    
    replyToLetter(id) {
        const letters = JSON.parse(localStorage.getItem('anonymous_letters') || '[]');
        const letter = letters.find(l => l.id === id);
        if (letter) {
            const response = prompt(`Відповідь на лист:\n\n"${letter.text.substring(0, 100)}..."`);
            if (response) {
                this.showMessage('Відповідь збережена (в майбутньому тут буде відправка)', 'success');
            }
        }
    }
    
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `message ${type}`;
        
        setTimeout(() => {
            this.message.style.display = 'none';
        }, 3000);
    }
}

const adminPanel = new AdminPanel();
