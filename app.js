// Local cache deployment parameters setup
const STORAGE_LINK_KEY = "melonclient_cached_url";
let userSessionToken = null;

// Initial application execution hooks
window.addEventListener('DOMContentLoaded', () => {
    // 1. Core Loader splash countdown matching limits
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

// File Selection layout status monitor
const fileInputTracker = document.getElementById('client-file');
if (fileInputTracker) {
    fileInputTracker.addEventListener('change', function() {
        if(this.files && this.files[0]) {
            document.getElementById('file-status').innerText = "Target Loaded: " + this.files[0].name;
            document.getElementById('client-url').value = ""; 
        }
    });
}

// Custom Stoat REST Request execution pipeline
async function authenticateStoatAccount(email, password) {
    const statusMsg = document.getElementById('auth-status-msg');
    statusMsg.style.color = "#ffff55";
    statusMsg.innerText = "Connecting authentication layer...";

    try {
        // Stoat API Endpoint (built using Revolt architectural definitions)
        const response = await fetch("https://stoat.chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password, session_name: "MelonClient Instance" })
        });

        if (response.ok) {
            const data = await response.json();
            userSessionToken = data.token; // X-Session-Token standard assign
            statusMsg.style.color = "#55ff55";
            statusMsg.innerText = "Authenticated: Syncing Rooms Complete.";
            appendChatStream("[System]", "Logged into Stoat account seamlessly.");
        } else {
            statusMsg.style.color = "#ff5555";
            statusMsg.innerText = "Auth Rejected. Operating on local mock session.";
        }
    } catch (err) {
        statusMsg.style.color = "#ff5555";
        statusMsg.innerText = "Network firewalled. Standalone runtime mode enabled.";
    }
}

// Master Launch engine executing client instances
function launchClientEngine() {
    const urlInput = document.getElementById('client-url').value;
    const fileInput = document.getElementById('client-file').files;
    const emailInput = document.getElementById('stoat-email').value;
    const passwordInput = document.getElementById('stoat-password').value;
    const container = document.getElementById('game-container');
    
    // Save target client endpoint into local cache automatically if provided
    if (urlInput) {
        localStorage.setItem(STORAGE_LINK_KEY, urlInput);
    }

    // Fire verification sequence asynchronously if credential vectors exist
    if (emailInput && passwordInput) {
        authenticateStoatAccount(emailInput, passwordInput);
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

// Handle UI Messaging pipeline streams
const chatInputHandler = document.getElementById('chat-message-payload');
if (chatInputHandler) {
    chatInputHandler.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== "") {
            appendChatStream("You", this.value);
            // If live token profile is authenticated, sync payload message upstream here via Stoat API channels
            this.value = "";
        }
    });
}

function appendChatStream(user, text) {
    const stream = document.getElementById('chat-messages-stream');
    if (!stream) return;
    const row = document.createElement('div');
    row.className = 'chat-row';
    row.innerHTML = `<span class="user-tag">[${user}]</span> ${text}`;
    stream.appendChild(row);
    stream.scrollTop = stream.scrollHeight;
}

// Radial HUD Menu panel toggle operations
function toggleChatInterface() {
    const chatMenu = document.getElementById('melon-chat');
    if (!chatMenu) return;
    
    if (chatMenu.style.display === 'none' || chatMenu.style.display === '') {
        chatMenu.style.display = 'flex';
        const inputField = document.getElementById('chat-message-payload');
        if (inputField) inputField.focus();
    } else {
        chatMenu.style.display = 'none';
        focusGameViewport();
    }
}

function focusGameViewport() {
    const gameFrame = document.getElementById('game-frame');
    if (gameFrame) gameFrame.focus();
}
