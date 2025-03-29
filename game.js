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

function handleRiceClick(){
  increaseRice();
  const bowl = document.getElementById("riceBowl");
  bowl.classList.remove("animate-tilt");
  void bowl.offsetWidth; // trigger reflow
  bowl.classList.add("animate-tilt");
}

const emojiRaining = {
    farmer: false,
    fertilizer: false,
    mom: false
  };
  
  function createEmojiRain(emoji) {
    const emojiElem = document.createElement("div");
    emojiElem.innerText = emoji;
    emojiElem.className = "emoji absolute text-2xl pointer-events-none animate-fall";
    emojiElem.style.left = Math.random() * 95 + "vw";
    emojiElem.style.top = "-2rem";
    document.body.appendChild(emojiElem);
  
    // Remove after it falls
    setTimeout(() => {
      emojiElem.remove();
    }, 3000);
  }
  
  function startEmojiRain(upgradeName, emoji) {
    if (emojiRaining[upgradeName]) return;
    emojiRaining[upgradeName] = true;
  
    setInterval(() => {
      createEmojiRain(emoji);
    }, 500); // drops every 500ms
  }
  
  function buyUpgrade(name) {
    const upgrade = upgrades[name];
    if (rice >= upgrade.cost) {
        rice -= upgrade.cost;
        upgrade.owned++;
        updateUI();
        
        if (name == "autoClicker") startEmojiRain("autoClicker", "🖱️");
        if (name === "farmer") startEmojiRain("farmer", "🧑‍🌾");
        if (name === "fertilizer") startEmojiRain("fertilizer", "🌱");
        if (name === "mom") startEmojiRain("mom", "👩");
    }
  }  

// Passive income from all upgrades
setInterval(() => {
  for (let key in upgrades) {
    rice += upgrades[key].rate * upgrades[key].owned;
  }
  updateUI();
}, 1000);
