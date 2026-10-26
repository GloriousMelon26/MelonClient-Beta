let currentToggleKey = 'M';

// Fades loading screen out exactly 1 second after page assembly load complete
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);
});

// Resets alternative inputs if file uploaded locally
const fileInputEl = document.getElementById('client-file');
if (fileInputEl) {
    fileInputEl.addEventListener('change', function() {
        if(this.files && this.files[0]) {
            document.getElementById('file-status').innerText = "Loaded: " + this.files[0].name;
            document.getElementById('client-url').value = ""; 
        }
    });
}

// Catches live config panels keys for real-time menu toggles update mappings
const keybindInputEl = document.getElementById('keybind-input');
if (keybindInputEl) {
    keybindInputEl.addEventListener('keyup', function(e) {
        this.value = e.key.toUpperCase();
        currentToggleKey = e.key.toUpperCase();
        document.getElementById('hint-key').innerText = currentToggleKey;
    });
}

// Injects the game into container view cleanly
function launchClient() {
    const urlInput = document.getElementById('client-url').value;
    const fileInput = document.getElementById('client-file').files;
    const container = document.getElementById('game-container');
    
    container.innerHTML = ""; 
    
    const iframe = document.createElement('iframe');
    iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock";
    iframe.id = "game-frame";

    if (fileInput && fileInput[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            iframe.srcdoc = e.target.result;
            container.appendChild(iframe);
            document.getElementById('boot-screen').style.display = 'none';
            focusGame();
        };
        reader.readAsText(fileInput[0]);
    } else if (urlInput) {
        iframe.src = urlInput;
        container.appendChild(iframe);
        document.getElementById('boot-screen').style.display = 'none';
        focusGame();
    } else {
        alert("Please supply either an online client URL or upload an offline file.");
    }
}

// Intercepts background key updates inside general root views
window.addEventListener('keydown', function(e) {
    if (e.key.toUpperCase() === currentToggleKey) {
        toggleChat();
    }
});

function toggleChat() {
    const chatMenu = document.getElementById('melon-chat');
    if (!chatMenu) return;
    
    if (chatMenu.style.display === 'none' || chatMenu.style.display === '') {
        chatMenu.style.display = 'flex';
    } else {
        chatMenu.style.display = 'none';
        focusGame();
    }
}

function focusGame() {
    const gameFrame = document.getElementById('game-frame');
    if (gameFrame) gameFrame.focus();
}
