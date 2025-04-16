const symbols = ["🍒", "🍋", "🔔", "💎", "🍀", "7️⃣"];
const spinSound = document.getElementById("spin-sound");
const coinSound = document.getElementById("coin-sound");

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels() {
  spinSound.play();

  const reel1 = document.getElementById("reel1");
  const reel2 = document.getElementById("reel2");
  const reel3 = document.getElementById("reel3");

  // Simulate spinning
  let i = 0;
  const interval = setInterval(() => {
    reel1.textContent = getRandomSymbol();
    reel2.textContent = getRandomSymbol();
    reel3.textContent = getRandomSymbol();
    i++;
    if (i > 20) {
      clearInterval(interval);
      checkWin(reel1.textContent, reel2.textContent, reel3.textContent);
    }
  }, 100);
}

function checkWin(a, b, c) {
  if (a === b && b === c) {
    addScore("YOU", 7777);
    makeItRain();
    coinSound.play();
    alert("🎉 JACKPOT! 🎉");
  } else {
    alert("Try again!");
  }
}

function addScore(name, score) {
  const list = document.getElementById("score-list");
  const li = document.createElement("li");
  li.innerHTML = `<span class="name">${name}</span> <span class="score blink">${score}</span>`;
  list.prepend(li);
}

function makeItRain() {
  const container = document.getElementById("coin-container");
  for (let i = 0; i < 30; i++) {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.style.left = Math.random() * 100 + "vw";
    coin.style.animationDuration = (Math.random() * 2 + 2) + "s";
    container.appendChild(coin);
    setTimeout(() => container.removeChild(coin), 4000);
  }
}
