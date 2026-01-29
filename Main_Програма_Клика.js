const achievements = [500, 3000, 10000, 20000, 30000, 50000, 100000];

let state = JSON.parse(localStorage.getItem("clicker")) || {
    count: 0,
    mvp: 1,
    power: 1,
    sound: true,
    secretTimer: 0
};

const counter = document.getElementById("counter");
const btn = document.getElementById("btn");
const levelText = document.getElementById("level");
const progress = document.getElementById("progress");
const win = document.getElementById("win");
const mvpText = document.getElementById("mvpText");
const soundToggle = document.getElementById("soundToggle");
const sound = document.getElementById("clickSound");

let audioUnlocked = false;

soundToggle.checked = state.sound;
updateUI();

function save() {
    localStorage.setItem("clicker", JSON.stringify(state));
}

function updateUI() {
    counter.textContent = state.count;
    levelText.textContent = "LVL " + (Math.floor(state.count / 1000) + 1);

    document.querySelectorAll(".ach").forEach(el => {
        el.style.opacity = state.count >= Number(el.dataset.value) ? "1" : "0.4";
    });

    let nextAch = achievements.find(a => a > state.count) || 100000;
    progress.style.width = Math.min((state.count / nextAch) * 100, 100) + "%";
}

function plusEffect(x, y) {
    const el = document.createElement("div");
    el.className = "plus";
    el.textContent = "+" + state.power;
    el.style.left = Math.min(x, window.innerWidth - 50) + "px";
    el.style.top = Math.min(y, window.innerHeight - 50) + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function playSound() {
    if (!state.sound) return;
    sound.currentTime = 0;
    sound.volume = 0.25;
    sound.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(20);
}

function secretCheck() {
    if (state.secretTimer > 0) {
        state.secretTimer--;
        if (state.secretTimer === 0) document.body.style.background = "";
    }

    if (state.count === 666) { document.body.style.background = "#ffcccc"; state.secretTimer = 10; }
    if (state.count === 7777) { 
        document.body.style.background =
            "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)"; 
        state.secretTimer = 10; 
    }
}

function winGame() {
    win.style.display = "flex";
    mvpText.textContent = `LVL ${state.mvp + 1} MVP`;
}

btn.addEventListener("click", e => {
    if (!audioUnlocked) {
        sound.play().then(() => { sound.pause(); sound.currentTime = 0; }).catch(() => {});
        audioUnlocked = true;
    }

    state.count += state.power;
    playSound();
    plusEffect(e.clientX, e.clientY);
    secretCheck();

    if (state.count >= 100000) winGame();

    updateUI();
    save();
});

soundToggle.addEventListener("change", () => { state.sound = soundToggle.checked; save(); });

document.getElementById("continue").addEventListener("click", () => {
    win.style.display = "none";
    state.count = 0;
    state.mvp++;
    state.power += 30;
    updateUI();
    save();
});
