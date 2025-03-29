let rice = 0;

const upgrades = {
  autoClicker: { cost: 20, rate: 1, owned: 0 },
  farmer: { cost: 30, rate: 2, owned: 0 },
  fertilizer: { cost: 40, rate: 3, owned: 0 },
  mom: { cost: 50, rate: 5, owned: 0 }
};

function updateUI() {
  document.getElementById("riceCount").innerText = rice;
}

function increaseRice() {
  rice++;
  updateUI();
}

function buyUpgrade(name) {
  const upgrade = upgrades[name];
  if (rice >= upgrade.cost) {
    rice -= upgrade.cost;
    upgrade.owned++;
    updateUI();
  }
}

// Passive income from all upgrades
setInterval(() => {
  for (let key in upgrades) {
    rice += upgrades[key].rate * upgrades[key].owned;
  }
  updateUI();
}, 1000);
