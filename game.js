let rice = 0;

const upgrades = {
  autoClicker: { cost: 20, rate: 1, owned: 0 },
  farmer: { cost: 30, rate: 2, owned: 0 },
  fertilizer: { cost: 40, rate: 3, owned: 0 },
  mom: { cost: 50, rate: 5, owned: 0 }
};

const achievements = [
  {
    id: "momMaster",
    title: "Mama Army",
    description: "Have 10 moms 👩",
    condition: () => upgrades.mom.owned >= 10,
    unlocked: false
  },
  {
    id: "farmForce",
    title: "Farmer Frenzy",
    description: "Make 20 farmers work 🧑‍🌾",
    condition: () => upgrades.farmer.owned >= 20,
    unlocked: false
  },
  {
    id: "clickKing",
    title: "Click Commander",
    description: "Own 30 auto clickers 🖱️",
    condition: () => upgrades.autoClicker.owned >= 30,
    unlocked: false
  },
  {
    id: "casualCook",
    title: "Casual Cooking",
    description: "Cooked 100 bowls 🍚",
    condition: () => rice >= 100,
    unlocked: false
  },
  {
    id: "fertilizerFiesta",
    title: "Fertilizer Fiesta",
    description: "Own 15 fertilizers 🌿",
    condition: () => upgrades.fertilizer.owned >= 15, 
    unlocked: false
  }
];

function checkAchievements() {
  for (let achievement of achievements) {
    if (!achievement.unlocked && achievement.condition()) {
      achievement.unlocked = true;
      showAchievement(achievement);
      updateAchievementBoard();
    }
  }
}

function showAchievement(achievement) {
  console.log(`Achievement unlocked: ${achievement.title}`);
}

function updateAchievementBoard() {
  const container = document.getElementById("achievementBoard");
  container.innerHTML = ""; // Clear before repopulating

  for (let a of achievements) {
    const div = document.createElement("div");
    div.className = `border p-2 rounded mb-2 transition-all duration-300 ${
      a.unlocked ? "bg-green-200 border-green-600" : "bg-gray-200 text-gray-500 border-gray-400"
    }`;
    div.innerHTML = `
      <h4 class="font-bold">${a.title}</h4>
      <p class="text-sm">${a.description}</p>
    `;
    container.appendChild(div);
  }
}

function updateUI() {
  // Update the rice count in the UI
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
        div.onclick = null;
      }
    }

    // Update upgrade count display
    const countSpan = document.getElementById(`count${capitalizeFirstLetter(key)}`);
    if (countSpan) {
      countSpan.innerText = `x${upgrade.owned}`;
    }
  }
  checkAchievements();
}

// Helper to capitalize first letter
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function increaseRice() {
  rice++;
  updateUI();
}

function handleRiceClick() {
  increaseRice();
  tiltImage();
  
}
function tiltImage(){
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

updateAchievementBoard();  // Initial display

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
