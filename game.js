let rice = 0;

const upgrades = {
  autoClicker: { cost: 20, rate: 1, owned: 0 },
  farmer: { cost: 30, rate: 2, owned: 0 },
  fertilizer: { cost: 40, rate: 3, owned: 0 },
  mom: { cost: 50, rate: 5, owned: 0 }
};

function updateUI() {
  document.getElementById("riceCount").innerText = rice;
  // Loop through each upgrade and toggle the button
  for (let key in upgrades) {
    const upgrade = upgrades[key];
    const div = document.getElementById(`buy${capitalizeFirstLetter(key)}`);
    if (div) {
      if (rice >= upgrade.cost) {
        div.classList.remove("opacity-50", "cursor-not-allowed");
        div.classList.add("cursor-pointer");
        div.onclick = () => buyUpgrade(key);
      } else {
        div.classList.add("opacity-50", "cursor-not-allowed");
        div.classList.remove("cursor-pointer");
        div.onclick = null;}
    }
  }
}

// Helper to capitalize first letter
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function increaseRice() {
  rice++;
  updateUI();
}

function handleRiceClick(event){
  increaseRice();
  tiltImage();
  createRiceSplash(event);
}
function tiltImage(){
  const bowl = document.getElementById("riceBowl");
  bowl.classList.remove("animate-tilt");
  void bowl.offsetWidth; // trigger reflow
  bowl.classList.add("animate-tilt");
}
function createRiceSplash(event){
  const splash = document.createElement('img');
  splash.src = 'img/rice_splash_2.png'; // Change to your actual image path
  splash.className = 'rice-splash rounded-full';
  splash.style.position = 'absolute';
  splash.style.left = `${event.clientX - 20}px`;
  splash.style.top = `${event.clientY - 20}px`;
  splash.style.width = '40px';
  splash.style.height = '40px';
  splash.style.pointerEvents = 'none';
  splash.style.animation = 'splash 0.6s ease-out forwards';
  splash.style.zIndex = 100;

  document.body.appendChild(splash);

  setTimeout(() => {
    splash.remove();
  }, 600);
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
