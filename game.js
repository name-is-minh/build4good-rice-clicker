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
function toggleProfileModal() {
  const modal = document.getElementById("profileModal");

  if (modal.classList.contains("opacity-0")) {
    modal.classList.remove("opacity-0", "pointer-events-none", "scale-95");
    modal.classList.add("opacity-100", "pointer-events-auto", "scale-100");
  } else {
    modal.classList.remove("opacity-100", "pointer-events-auto", "scale-100");
    modal.classList.add("opacity-0", "pointer-events-none", "scale-95");
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
    div.className = `border p-2 rounded mb-2 transition-all duration-300 ${a.unlocked ? "bg-green-200 border-green-600" : "bg-gray-200 text-gray-500 border-gray-400"
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

function handleRiceClick(event) {
  increaseRice();
  tiltImage();
  createRiceSplash(event);
}
function tiltImage() {
  const bowl = document.getElementById("riceBowl");
  bowl.classList.remove("animate-tilt");
  void bowl.offsetWidth; // trigger reflow
  bowl.classList.add("animate-tilt");
}
function createRiceSplash(event) {
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

  const response = await fetch("https://rice-clicker-backend.onrender.com/save-username", {
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

  const response = await fetch("https://rice-clicker-backend.onrender.com/load-username", {
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
    restoreEmojiRain();
  } else {
    alert(result.message);
  }
}

function restoreEmojiRain() {
  if (upgrades.autoClicker.owned > 0) startEmojiRain("autoClicker", "🖱️");
  if (upgrades.farmer.owned > 0) startEmojiRain("farmer", "🧑‍🌾");
  if (upgrades.fertilizer.owned > 0) startEmojiRain("fertilizer", "🌱");
  if (upgrades.mom.owned > 0) startEmojiRain("mom", "👩");
}

const riceNews = [
  "🍚 Your rice is talked about across continents.",
  "📰 News: Mom starts underground rice casino.",
  "📦 Breaking: Global rice shortage is caused by you.",
  "🌾 Farmer #42 grew a rice stalk taller than your house.",
  "👩 Mom called. She’s proud of your rice empire.",
  "📡 Rice satellites now orbiting Earth.",
  "💬 Rice whisperers discovered in ancient scrolls.",
  "🔬 Scientists confirm: rice increases happiness.",
  "📈 Rice stock reaches all-time high. Again.",
  "🎤 Quote of the day: 'Click rice. Feel nice.'"
];

function createFallingQuote() {
  const quote = document.createElement("div");
  quote.className = "rice-quote";
  quote.innerText = riceNews[Math.floor(Math.random() * riceNews.length)];
  quote.style.left = Math.random() * 80 + "vw"; // position it randomly on the screen
  quote.style.top = "-2rem";

  document.body.appendChild(quote);

  setTimeout(() => {
    quote.remove();
  }, 6000); // duration must match the animation time in CSS
}

setInterval(() => {
  createFallingQuote();
}, 7000); // every 7 seconds

createFallingQuote();
