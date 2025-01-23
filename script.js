// Game Variables
let widgets = 0; // Regular limes
let widgetsPerSecond = 0;
let keyLimes = 0; // Key limes
let autoClickers = 0;
let factories = 0;
let megaFactories = 0;
let prestigeLevel = 0;
let prestigeBonus = 1;

// Special Upgrades
const specialUpgrades = {
  limeBoost: { cost: 5, effect: 2, purchased: false }, // Double production speed
  limeLuck: { cost: 10, effect: 0.1, purchased: false }, // Increase key lime chance by 10%
  limeMastery: { cost: 20, effect: 5, purchased: false }, // Unlock a new feature (e.g., recipes)
};

// DOM Elements
const widgetsDisplay = document.getElementById('widgets');
const wpsDisplay = document.getElementById('wps');
const keyLimesDisplay = document.getElementById('keyLimes');
const prestigeLevelDisplay = document.getElementById('prestigeLevel');
const prestigeBonusDisplay = document.getElementById('prestigeBonus');

// Produce widgets manually
function produceWidget() {
  widgets++;
  // Random chance to earn a key lime (e.g., 5% chance)
  if (Math.random() < 0.05) {
    keyLimes++;
  }
  updateDisplay();
}

// Buy upgrades
function buyUpgrade(type) {
  switch (type) {
    case 'autoClicker':
      if (widgets >= 10) {
        widgets -= 10;
        autoClickers++;
        widgetsPerSecond += 1;
      }
      break;
    case 'factory':
      if (widgets >= 100) {
        widgets -= 100;
        factories++;
        widgetsPerSecond += 10;
      }
      break;
    case 'megaFactory':
      if (widgets >= 1000) {
        widgets -= 1000;
        megaFactories++;
        widgetsPerSecond += 100;
      }
      break;
  }
  updateDisplay();
}

// Buy special upgrades
function buySpecialUpgrade(upgrade) {
  const specialUpgrade = specialUpgrades[upgrade];
  if (keyLimes >= specialUpgrade.cost && !specialUpgrade.purchased) {
    keyLimes -= specialUpgrade.cost;
    specialUpgrade.purchased = true;

    // Apply the upgrade effect
    switch (upgrade) {
      case 'limeBoost':
        prestigeBonus *= specialUpgrade.effect;
        break;
      case 'limeLuck':
        // Increase key lime chance (you can adjust the logic later)
        break;
      case 'limeMastery':
        // Unlock a new feature (e.g., recipes)
        break;
    }

    alert(`You purchased the ${upgrade} upgrade!`);
    updateDisplay();
  } else {
    alert("Not enough Key Limes or already purchased!");
  }
}

// Prestige system
function prestige() {
  if (widgets >= 10000) {
    // Reset game state
    widgets = 0;
    widgetsPerSecond = 0;
    autoClickers = 0;
    factories = 0;
    megaFactories = 0;

    // Increase prestige level and bonus
    prestigeLevel++;
    prestigeBonus *= 2; // Double production speed

    // Notify the player
    alert(`Prestiged! You are now at level ${prestigeLevel} with a ${prestigeBonus}x bonus!`);

    // Update the display
    updateDisplay();
  } else {
    alert("You need at least 10,000 limes to prestige!");
  }
}

// Update the display
function updateDisplay() {
  widgetsDisplay.textContent = widgets;
  wpsDisplay.textContent = widgetsPerSecond * prestigeBonus;
  keyLimesDisplay.textContent = keyLimes;
  prestigeLevelDisplay.textContent = prestigeLevel;
  prestigeBonusDisplay.textContent = `${prestigeBonus}x`;
}

// Game loop to auto-produce widgets
setInterval(() => {
  widgets += widgetsPerSecond * prestigeBonus;
  updateDisplay();
}, 1000);

// Save the game state
function saveGame() {
  const gameState = {
    widgets,
    widgetsPerSecond,
    keyLimes,
    autoClickers,
    factories,
    megaFactories,
    prestigeLevel,
    prestigeBonus,
    specialUpgrades,
  };
  localStorage.setItem('widgetGameSave', JSON.stringify(gameState));
}

// Load the game state
function loadGame() {
  const savedGame = localStorage.getItem('widgetGameSave');
  if (savedGame) {
    const gameState = JSON.parse(savedGame);
    widgets = gameState.widgets;
    widgetsPerSecond = gameState.widgetsPerSecond;
    keyLimes = gameState.keyLimes;
    autoClickers = gameState.autoClickers;
    factories = gameState.factories;
    megaFactories = gameState.megaFactories;
    prestigeLevel = gameState.prestigeLevel;
    prestigeBonus = gameState.prestigeBonus;

    // Update specialUpgrades without reassigning the variable
    for (const key in gameState.specialUpgrades) {
      if (specialUpgrades.hasOwnProperty(key)) {
        specialUpgrades[key].purchased = gameState.specialUpgrades[key].purchased;
      }
    }

    updateDisplay();
  }
}

// Save the game every 5 seconds
setInterval(saveGame, 5000);

// Load the game when the page loads
window.onload = loadGame;

// Toggle extra info sections
function toggleExtraInfo() {
  const keyLimesInfo = document.getElementById('keyLimesInfo');
  const specialUpgradesInfo = document.getElementById('specialUpgradesInfo');
  const prestigeInfo = document.getElementById('prestigeInfo');

  // Toggle visibility
  keyLimesInfo.style.display = keyLimesInfo.style.display === 'none' ? 'block' : 'none';
  specialUpgradesInfo.style.display = specialUpgradesInfo.style.display === 'none' ? 'block' : 'none';
  prestigeInfo.style.display = prestigeInfo.style.display === 'none' ? 'block' : 'none';
}

// Open a specific tab
function openTab(tabName) {
  // Hide all tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));

  // Show the selected tab content
  document.getElementById(tabName).classList.add('active');

  // Update tab button styles
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));
  document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

// Toggle extra info sections
function toggleExtraInfo() {
  const keyLimesInfo = document.getElementById('keyLimesInfo');
  const specialUpgradesInfo = document.getElementById('specialUpgradesInfo');
  const prestigeInfo = document.getElementById('prestigeInfo');

  // Toggle visibility
  keyLimesInfo.style.display = keyLimesInfo.style.display === 'none' ? 'block' : 'none';
  specialUpgradesInfo.style.display = specialUpgradesInfo.style.display === 'none' ? 'block' : 'none';
  prestigeInfo.style.display = prestigeInfo.style.display === 'none' ? 'block' : 'none';
}

// Initialize the game with the Production tab open
window.onload = function () {
  openTab('production');
  loadGame();
};