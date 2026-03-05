const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");
const typingIndicator = document.getElementById("typingIndicator");
const newChatBtn = document.getElementById("newChatBtn");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");
const suggestionButtons = document.querySelectorAll(".suggestion-btn");
const welcomeScreen = document.getElementById("welcomeScreen");

let chatHistory = JSON.parse(localStorage.getItem("mindmate_chat")) || [];

/* ================= LOAD ================= */

window.onload = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }

    if (chatHistory.length > 0) {
        welcomeScreen.style.display = "none";
        chatHistory.forEach(msg => createMessage(msg.text, msg.sender, false));
    }
};

/* ================= SEND ================= */

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    welcomeScreen.style.display = "none";
    createMessage(text, "user", true);
    messageInput.value = "";

    showTyping();

    setTimeout(() => {
        hideTyping();
        createMessage(generateReply(text), "bot", true);
    }, 1000);
}

function createMessage(text, sender, save) {
    const div = document.createElement("div");
    div.classList.add("message", sender === "user" ? "user-message" : "bot-message");

    div.innerHTML = `${text}<div class="timestamp">${getTime()}</div>`;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (save) {
        chatHistory.push({ text, sender });
        localStorage.setItem("mindmate_chat", JSON.stringify(chatHistory));
        updateHistory();
    }
}

/* ================= ADVANCED RESPONSE LOGIC ================= */

function generateReply(text) {
    text = text.toLowerCase();

    // Greetings
    if (text.includes("hi") || text.includes("hello") || text.includes("hey"))
        return randomReply([
            "Hello! I'm here to support you 😊",
            "Hi there! How are you feeling today?",
            "Hey! Tell me what's on your mind."
        ]);

    // Thanks
    if (text.includes("thank"))
        return "You're always welcome 💙 I'm glad I could help.";

    // Exam Stress
    if (text.includes("exam") || text.includes("test"))
        return randomReply([
            "Exam stress is normal. Try studying in focused 45-minute sessions with short breaks.",
            "Create a simple revision plan. Small daily progress reduces exam anxiety.",
            "Remember, exams measure preparation — not your worth."
        ]);

    // Career Confusion
    if (text.includes("career") || text.includes("future"))
        return randomReply([
            "Career confusion is common. What subjects do you enjoy the most?",
            "Start by identifying your strengths and interests.",
            "You don't need all answers today. Explore step by step."
        ]);

    // Motivation
    if (text.includes("motivation") || text.includes("lazy"))
        return randomReply([
            "Motivation comes after action. Start small.",
            "Even 1% progress daily creates big results.",
            "You are capable of more than you think 🚀"
        ]);

    // Anxiety
    if (text.includes("anxiety") || text.includes("nervous"))
        return randomReply([
            "Take a slow deep breath. Inhale 4 seconds, hold 4, exhale 4.",
            "You're safe. Anxiety is temporary.",
            "Focus on what you can control right now."
        ]);

    // Stress
    if (text.includes("stress") || text.includes("stressed"))
        return randomReply([
            "I understand stress can feel overwhelming. What is causing it?",
            "Try writing down what's worrying you. It helps organize thoughts.",
            "Taking a short walk can reduce stress quickly."
        ]);

    // Overthinking
    if (text.includes("overthink"))
        return randomReply([
            "Overthinking drains energy. Try focusing only on facts.",
            "Ask yourself: is this thought helpful or harmful?",
            "Sometimes action reduces overthinking better than thinking."
        ]);

    // Sleep Issues
    if (text.includes("sleep"))
        return randomReply([
            "Avoid screens 30 minutes before sleep.",
            "Try a consistent bedtime schedule.",
            "Relax your mind with slow breathing before bed."
        ]);

    // Burnout
    if (text.includes("burnout") || text.includes("tired"))
        return randomReply([
            "Burnout means you need rest, not more pressure.",
            "Take breaks without guilt. Rest improves productivity.",
            "Balance effort with recovery."
        ]);

    // Self Doubt
    if (text.includes("confidence") || text.includes("doubt"))
        return randomReply([
            "Confidence grows from small wins.",
            "You have handled challenges before — you can do it again.",
            "Replace self-doubt with self-awareness."
        ]);

    // Sad / Low Mood
    if (text.includes("sad") || text.includes("depressed") || text.includes("low"))
        return randomReply([
            "I'm sorry you're feeling this way. Do you want to talk about it?",
            "Your feelings are valid.",
            "You're not alone. I'm here to listen."
        ]);

    // Default
    return randomReply([
        "I'm here to support you. Can you tell me more?",
        "That sounds important. Tell me more about it.",
        "How long have you been feeling this way?"
    ]);
}

/* ================= RANDOM REPLY ================= */

function randomReply(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/* ================= UTILITIES ================= */

function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function showTyping() {
    typingIndicator.classList.remove("hidden");
}

function hideTyping() {
    typingIndicator.classList.add("hidden");
}

/* ================= NEW CHAT ================= */

newChatBtn.addEventListener("click", () => {
    chatHistory = [];
    localStorage.removeItem("mindmate_chat");
    chatContainer.innerHTML = "";
    historyList.innerHTML = "";
    welcomeScreen.style.display = "block";
});

/* ================= HISTORY ================= */

function updateHistory() {
    historyList.innerHTML = "";
    chatHistory.slice(-5).forEach(msg => {
        if (msg.sender === "user") {
            const li = document.createElement("li");
            li.textContent = msg.text.substring(0, 25) + "...";
            historyList.appendChild(li);
        }
    });
}

/* ================= EVENTS ================= */

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

suggestionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        messageInput.value = btn.textContent;
        sendMessage();
    });
});

/* ================= THEME ================= */

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "light");
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "dark");
    }
});
