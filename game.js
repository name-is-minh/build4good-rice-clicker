let rice = 0;

const upgrades = {
  autoClicker: { cost: 20, rate: 1, owned: 0 },
  farmer: { cost: 30, rate: 2, owned: 0 },
  fertilizer: { cost: 40, rate: 3, owned: 0 },
  mom: { cost: 50, rate: 5, owned: 0 }
};

function updateUI() {
  // Update the rice count in the UI
  document.getElementById("riceCount").innerText = rice;

  // Update the level of upgrades in the UI
  document.getElementById("autoClickerLvl").innerText = upgrades.autoClicker.owned;
  document.getElementById("farmerLvl").innerText = upgrades.farmer.owned;
  document.getElementById("fertilizerLvl").innerText = upgrades.fertilizer.owned;
  document.getElementById("momLvl").innerText = upgrades.mom.owned;
}

function increaseRice() {
  rice++;
  updateUI();
}

function handleRiceClick() {
  increaseRice();
  const bowl = document.getElementById("riceBowl");
  bowl.classList.remove("animate-tilt");
  void bowl.offsetWidth; // trigger reflow
  bowl.classList.add("animate-tilt");
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

async function saveUsername() {
  const username = document.getElementById("usernameInput").value;

  if (!username) {
    alert("Please enter a username.");
    return;
  }

  const currentRice = rice;
  const farmerLvl = upgrades.farmer.owned;
  const fertilizerLvl = upgrades.fertilizer.owned;
  const momLvl = upgrades.mom.owned;
  const autoClickerLvl = upgrades.autoClicker.owned;

  const response = await fetch("http://localhost:3000/save-username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      currentRice,
      farmerLvl,
      fertilizerLvl,
      momLvl,
      autoClickerLvl,
    }),
  });

  const result = await response.json();
  alert(result.message);
}

async function loadUsername() {
    const username = document.getElementById("loadUsernameInput").value;
    
    if (!username) {
      alert("Please enter a username.");
      return;
    }
  
    const response = await fetch("http://localhost:3000/load-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
  
    const result = await response.json();
  
    if (response.ok) {
      rice = parseInt(result.currentRice);
      upgrades.autoClicker.owned = parseInt(result.autoClickerLvl);
      upgrades.farmer.owned = parseInt(result.farmerLvl);
      upgrades.fertilizer.owned = parseInt(result.fertilizerLvl);
      upgrades.mom.owned = parseInt(result.momLvl);
  
      updateUI();
    } else {
      alert(result.message);
    }
  }
