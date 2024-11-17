import "./style.css";
type items = { name: string; value: number; weight: number; color: string };
let currentRound = 1;
const totalRounds = 5;
const bagCapacity = 20;
let currentBagWeight = 0;
let currentScore = 0;
const optimalScore = 172;
let bagItems: items[] = [];
let suggesteditem: items | null = null;
const roundItems = [
  [
    { name: "Rose Water", value: 17, weight: 2, color: "#f5e0dc" }, //8.5
    { name: "Flamingo", value: 22, weight: 3, color: "#f2cdcd" }, //7.33
    { name: "Pink", value: 31, weight: 4, color: "#f5c2e7" }, //7.75
    { name: "Mauve", value: 15, weight: 2, color: "#cba6f7" }, //7.5
    { name: "Red", value: 25, weight: 3, color: "#f38ba8" }, //8.33
  ],
  [
    { name: "Maroon", value: 7, weight: 1, color: "#eba0ac" }, //7
    { name: "Peach", value: 37, weight: 5, color: "#fab387" }, //7.4
    { name: "Yellow", value: 26, weight: 3, color: "#f9e2af" }, //8.66
    { name: "Green", value: 33, weight: 4, color: "#a6e3a1" }, //8.25
    { name: "Teal", value: 18, weight: 2, color: "#94e2d5" }, //9
  ],
  [
    { name: "Sky", value: 9, weight: 1, color: "#89dceb" }, //9
    { name: "Sapphire", value: 29, weight: 4, color: "#74c7ec" }, //7.25
    { name: "Blue", value: 8, weight: 1, color: "#89b4fa" }, //8
    { name: "lavender", value: 23, weight: 3, color: "#b4befe" }, //7.66
    { name: "Peach", value: 37, weight: 5, color: "#fab387" }, //7.4
  ],
  [
    { name: "Maroon", value: 7, weight: 1, color: "#eba0ac" }, //7
    { name: "Blue", value: 8, weight: 1, color: "#89b4fa" }, //8
    { name: "Peach", value: 37, weight: 5, color: "#fab387" }, //7.4
    { name: "Mauve", value: 15, weight: 2, color: "#cba6f7" }, //7.5
    { name: "lavender", value: 23, weight: 3, color: "#b4befe" }, //7.66
  ],
  [
    { name: "Maroon", value: 7, weight: 1, color: "#eba0ac" }, //7
    { name: "Teal", value: 18, weight: 2, color: "#94e2d5" }, //9
    { name: "Pink", value: 31, weight: 4, color: "#f5c2e7" }, //7.75
    { name: "Yellow", value: 26, weight: 3, color: "#f9e2af" }, //8.66
    { name: "Rose Water", value: 17, weight: 2, color: "#f5e0dc" }, //8.5
  ],
];

let currentRoundItems: items[] = roundItems[currentRound - 1];
const bagInfo = document.getElementById("bagInfo")!;
const bagItemsDiv = document.getElementById("bagItems")!;
document.getElementById("restartBtn")?.addEventListener("click", restartGame);
const availableItemsContainer = document.getElementById(
  "availableItemsContainer",
)!;
const buttonContainer = document.getElementById("buttonContainer")!;

function updateBagInfo() {
  let roundsHTML = "";
  for (let i = 1; i <= totalRounds; i++) {
    if (i <= currentRound) {
      roundsHTML += `<span class="material-symbols-outlined text-mocha-mauve">
line_end_circle
</span>`; // Completed rounds (green)
    } else {
      roundsHTML += `<span class="material-symbols-outlined text-mocha-overlay2">
line_end_circle
</span>`; // Upcoming rounds (gray)
    }
  }
  bagInfo.innerHTML = `
       <div class="flex items-start "><span class="material-symbols-outlined text-mocha-peach">
pin_drop
</span> ${roundsHTML}  </div>        <div class="flex items-start "><span class="material-symbols-outlined text-mocha-peach">
shopping_bag
</span> ${currentBagWeight}/${bagCapacity}</div>
        <div class="flex items-start "><span class="material-symbols-outlined text-mocha-peach">
paid
</span> ${currentScore}</div>
    `;
}

function displayBagItems() {
  bagItemsDiv.innerHTML = "";
  bagItems.forEach((item) => {
    const itemcontainer = document.createElement("button");
    itemcontainer.innerHTML = `<span><span class="material-symbols-outlined">
diamond
</span></span><span> <span class="material-symbols-outlined">
paid
</span> ${item.value}  <span class="material-symbols-outlined">
weight
</span>${item.weight}</span>`;
    itemcontainer.style.backgroundColor = item.color;
    bagItemsDiv.appendChild(itemcontainer);
  });
}

function displayAvailableItems() {
  availableItemsContainer.innerHTML = "<h2>Available Items</h2>";
  currentRoundItems.forEach((item) => {
    const itemButton = document.createElement("button");
    itemButton.innerHTML = `<span><span class="material-symbols-outlined">
diamond
</span>${item.name}</span><span> <span class="material-symbols-outlined">
paid
</span> ${item.value}  <span class="material-symbols-outlined">
weight
</span>${item.weight}</span>`;
    itemButton.style.backgroundColor = item.color;
    if (suggesteditem && suggesteditem.name == item.name) {
      itemButton.classList.add("suggested-item");
    }
    itemButton.onclick = () => addItemToBag(item);
    availableItemsContainer.appendChild(itemButton);
  });
}

function addItemToBag(item: {
  name: string;
  value: number;
  weight: number;
  color: string;
}) {
  if (currentBagWeight + item.weight == bagCapacity) {
    currentBagWeight += item.weight;
    currentScore += item.value;
    bagItems.push(item);
    displayBagItems();
    updateBagInfo();
    finishGame();
  } else if (currentBagWeight + item.weight <= bagCapacity) {
    currentBagWeight += item.weight;
    currentScore += item.value;
    bagItems.push(item);

    currentRoundItems = currentRoundItems.filter((i) => i !== item);

    updateBagInfo();
    displayBagItems();
    displayAvailableItems();
  } else {
    alert(
      `add something with weigth ${bagCapacity - currentBagWeight} or less`,
    );
  }
}

function suggestOptimalGreedy() {
  const items = currentRoundItems
    .slice()
    .sort((a, b) => b.value - a.value)
    .sort((a, b) => b.value / b.weight - a.value / a.weight);

  if (items.length > 0) {
    const optimalItem = items[0];
    updateBtns();
    const suggestionElement = document.createElement("p");
    suggestionElement.textContent = `Suggestion: ${optimalItem.name} Value/weight: ${optimalItem.value / optimalItem.weight} `;
    suggestionElement.classList.add("text-sm", "mt-2");

    buttonContainer.appendChild(suggestionElement);
    suggesteditem = optimalItem;
    displayAvailableItems();
  } else {
    alert("No items available for this round.");
  }
}
function nextRound() {
  suggesteditem = null;
  if (currentRound < totalRounds) {
    currentRound++;
    currentRoundItems = roundItems[currentRound - 1];
    updateBtns();

    displayAvailableItems();
    updateBagInfo();
  } else {
    finishGame();
  }
}
function finishGame() {
  if (currentScore >= optimalScore) {
    updateVictory();
  } else {
    updateLose();
  }
}
function updateVictory() {
  buttonContainer.innerHTML = "";
  availableItemsContainer.innerHTML = `
    <div class="text-center mt-4">
      <h2 class="text-2xl font-bold text-mocha-green">Congratulations!</h2>
      <p class="text-lg">You achieved the optimal score of ${optimalScore}!</p>
      <button id="restartButton" class="mt-4 px-4 py-2 bg-mocha-mauve   hover:bg-mocha-peach">
        Restart Game
      </button>
    </div>
  `;

  const restartButton = document.getElementById("restartButton")!;
  restartButton.addEventListener("click", restartGame);
}

function updateLose() {
  buttonContainer.innerHTML = "";
  availableItemsContainer.innerHTML = `
    <div class="text-center mt-4">
      <h2 class="text-2xl font-bold text-mocha-red">Game Over!</h2>
      <p class="text-lg">Your score: ${currentScore}. Try again to reach the optimal score.</p>
      <button id="restartButton" class="mt-4 px-4 py-2 bg-mocha-lavender  hover:bg-mocha-teal">
        Restart Game
      </button>
    </div>
  `;

  const restartButton = document.getElementById("restartButton")!;
  restartButton.addEventListener("click", restartGame);
}
updateBagInfo();
displayAvailableItems();
updateBtns();

function updateBtns() {
  buttonContainer.innerHTML = "";
  const nextButton = document.createElement("button");
  nextButton.innerText = currentRound < totalRounds ? "Next Round" : "Finish";
  nextButton.onclick = nextRound;
  buttonContainer.appendChild(nextButton);

  const suggestButton = document.createElement("button");
  suggestButton.innerText = "Suggest Greedy";
  suggestButton.onclick = suggestOptimalGreedy;
  buttonContainer.appendChild(suggestButton);
}
function restartGame() {
  currentRound = 1;
  currentBagWeight = 0;
  currentScore = 0;
  currentRoundItems = roundItems[0];
  bagItems = [];
  updateBtns();
  updateBagInfo();
  displayBagItems();
  displayAvailableItems();
}
