let rice = 0;
let autoClickers = 0;

function updateUI() {
    document.getElementById("riceCount").innerText = `Rice: ${rice}`;
    document.getElementById("autoClickers").innerText = `Auto Clickers: ${autoClickers}`;
    document.getElementById("buyAutoClicker").disabled = rice < 10;
}

function increaseRice() {
    rice++;
    updateUI();
}

function buyAutoClicker() {
    if (rice >= 10) {
        rice -= 10;
        autoClickers++;
        updateUI();
    }
}

setInterval(() => {
    rice += autoClickers;
    updateUI();
}, 1000);