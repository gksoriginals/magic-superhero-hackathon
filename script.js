const filterButtons = document.querySelectorAll(".filter-button");
const promptGrid = document.getElementById("prompt-grid");
const promptStatus = document.getElementById("prompt-status");
let promptCards = [];

// Seamless Stacked Frame Animation Engine (TRANSPARENT PNG - ZERO WHITE FLASH)
const heroPortrait = document.getElementById("hero-portrait");
const portraitDialogue = document.getElementById("portrait-dialogue");
const frameElements = [
  document.getElementById("frame-0"),
  document.getElementById("frame-1"),
  document.getElementById("frame-2")
];

const portraitPhrases = [
  { frameIdx: 0 },
  { frameIdx: 1 },
  { frameIdx: 2 },
  { frameIdx: 1 },
  { frameIdx: 0 },
  { frameIdx: 2 }
];

let stepIndex = 0;

function advancePortraitStep() {
  if (!frameElements[0]) return;
  
  stepIndex = (stepIndex + 1) % portraitPhrases.length;
  const current = portraitPhrases[stepIndex];
  
  // Toggle active class on pre-rendered stacked DOM transparent PNG images -> zero white flash!
  frameElements.forEach((img, idx) => {
    if (img) {
      if (idx === current.frameIdx) {
        img.classList.add("active");
      } else {
        img.classList.remove("active");
      }
    }
  });

  if (portraitDialogue) {
    portraitDialogue.style.opacity = "0";
    setTimeout(() => {
      if (current.text) {
        portraitDialogue.textContent = `"${current.text}"`;
      }
      portraitDialogue.style.opacity = "1";
    }, 120);
  }
}

// Automatically cycle stacked transparent PNG expressions every 2.5 seconds
let portraitInterval = setInterval(advancePortraitStep, 2500);

if (heroPortrait) {
  heroPortrait.addEventListener("click", () => {
    clearInterval(portraitInterval);
    advancePortraitStep();
    portraitInterval = setInterval(advancePortraitStep, 2500);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterPromptCards(filter);
  });
});

function appendPromptDetail(parent, label, value, icon) {
  const paragraph = document.createElement("p");
  paragraph.className = "prompt-detail";
  
  const strong = document.createElement("strong");
  strong.textContent = `${icon} ${label}:`;
  
  paragraph.append(strong, ` ${value}`);
  parent.append(paragraph);
}

function createPromptCard(prompt) {
  const card = document.createElement("article");
  card.className = "prompt-card";
  card.dataset.category = prompt.category;

  const categoryTag = document.createElement("span");
  categoryTag.className = "prompt-category-tag";
  categoryTag.textContent = prompt.categoryLabel;

  const title = document.createElement("h3");
  title.textContent = prompt.title;

  card.append(categoryTag, title);
  appendPromptDetail(card, "Inspired by", prompt.inspiredBy, "💡");
  appendPromptDetail(card, "Buildable version", prompt.buildableVersion, "🛠️");
  appendPromptDetail(card, "Safe demo moment", prompt.safeDemoMoment, "✨");

  return card;
}

function filterPromptCards(filter) {
  promptCards.forEach((card) => {
    const matches = filter === "all" || card.dataset.category === filter;
    card.hidden = !matches;
  });
}

async function loadPrompts() {
  try {
    const response = await fetch("data/prompts.json");
    if (!response.ok) {
      throw new Error(`Prompt data returned ${response.status}`);
    }

    const prompts = await response.json();
    const fragment = document.createDocumentFragment();
    prompts.forEach((prompt) => fragment.append(createPromptCard(prompt)));
    promptGrid.append(fragment);
    promptCards = [...promptGrid.querySelectorAll(".prompt-card")];
    promptStatus.hidden = true;
  } catch (error) {
    promptStatus.textContent = "Prompt data could not be loaded. Serve this folder through a local web server.";
    promptStatus.classList.add("error");
    console.error(error);
  }
}

loadPrompts();
