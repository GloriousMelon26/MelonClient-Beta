const STORAGE_LINK_KEY = "melonclient_cached_url";

// Initial application execution hooks
window.addEventListener('DOMContentLoaded', () => {
    // 1. Splash logo timer deployment countdown
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);

    // 2. Fetch and assign last launched endpoint link out of localStorage cache
    const savedLink = localStorage.getItem(STORAGE_LINK_KEY);
    const urlInputBox = document.getElementById('client-url');
    if (savedLink && urlInputBox) {
        urlInputBox.value = savedLink;
    }
});

// Offline File Selection mapping verification monitors
const fileInputTracker = document.getElementById('client-file');
if (fileInputTracker) {
    fileInputTracker.addEventListener('change', function() {
        if(this.files && this.files[0]) {
            document.getElementById('file-status').innerText = "Loaded: " + this.files[0].name;
            document.getElementById('client-url').value = ""; 
        }
    });
}

// Master Launch engine deploying targeted scripts smoothly
function launchClientEngine() {
    const urlInput = document.getElementById('client-url').value;
    const fileInput = document.getElementById('client-file').files;
    const container = document.getElementById('game-container');
    
    if (urlInput) {
        localStorage.setItem(STORAGE_LINK_KEY, urlInput);
    }

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
            focusGameViewport();
        };
        reader.readAsText(fileInput[0]);
    } else if (urlInput) {
        iframe.src = urlInput;
        container.appendChild(iframe);
        document.getElementById('boot-screen').style.display = 'none';
        focusGameViewport();
    } else {
        alert("Please supply either an online client URL or upload an offline file.");
    }
}

// 🔔 CROSS-ORIGIN POSTMESSAGE EVENT TRACKER (NOTIFICATIONS)
window.addEventListener('message', function(event) {
    // Validates incoming messages from native Stoat domains or test layers
    if (event.origin.includes('stoat.chat') || event.data.type === 'MOCK_TEST_ALERT') {
        if (event.data && event.data.body) {
            triggerTopRightToast(event.data.title || "MelonChat Message", event.data.body);
        }
    }
});

// UI Minecraft Toast Builder Pipeline
function triggerTopRightToast(headline, bodyText) {
    const container = document.getElementById('melon-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pixel-toast-alert';
    toast.innerHTML = `
        <div class="toast-headline">${headline}</div>
        <div class="toast-body">${bodyText}</div>
    `;

    container.appendChild(toast);

    // Automatically sweeps out elements after 4 seconds to maintain HUD clarity
    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Navigation visibility modifiers
function toggleChatInterface() {
    const chatMenu = document.getElementById('melon-chat');
    if (!chatMenu) return;
    
    if (chatMenu.style.display === 'none' || chatMenu.style.display === '') {
        chatMenu.style.display = 'flex';
    } else {
        chatMenu.style.display = 'none';
        focusGameViewport();
    }
}

function focusGameViewport() {
    const gameFrame = document.getElementById('game-frame');
    if (gameFrame) gameFrame.focus();
}
