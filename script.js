// Classe HighScores pour gérer les meilleurs scores
class HighScores {
  constructor() {
    this.scoreList = document.getElementById("score-list");
    this.difficultyFilter = document.getElementById("high-score-difficulty-select");
    this.clearButton = document.getElementById("clear-high-scores"); // Nouveau bouton
    this.highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    this.init();
  }

  init() {
    // Écouter les changements dans le filtre de difficulté
    this.difficultyFilter.addEventListener("change", () => this.displayHighScores());
    // Ajouter un écouteur pour le bouton de suppression
    this.clearButton.addEventListener("click", () => this.clearHighScores());
    this.displayHighScores();
  }

  saveScore(score, pseudo, difficulty) {
    difficulty = parseInt(difficulty) || 1; // Assurer une valeur par défaut
    // Ajouter le score avec difficulté
    this.highScores.push({ score, pseudo, difficulty });
    // Trier les scores par ordre décroissant de score
    this.highScores.sort((a, b) => b.score - a.score);
    // Sauvegarder les scores
    localStorage.setItem("highScores", JSON.stringify(this.highScores));
    this.displayHighScores();
  }

  displayHighScores() {
    const selectedDifficulty = this.difficultyFilter.value;
    this.scoreList.innerHTML = "";

    // Filtrer les scores en fonction de la difficulté
    const filteredScores = this.highScores.filter(
      (entry) => selectedDifficulty === "all" || entry.difficulty.toString() === selectedDifficulty
    );

    if (filteredScores.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No scores available for this difficulty.";
      this.scoreList.appendChild(li);
      return;
    }

    filteredScores.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.pseudo} - ${entry.score} points - ${this.getDifficultyLabel(entry.difficulty)}`;
      this.scoreList.appendChild(li);
    });
  }

  clearHighScores() {
    // Supprimer les scores et mettre à jour le stockage
    this.highScores = [];
    localStorage.removeItem("highScores");
    this.displayHighScores();

    // Confirmation dans la console
    console.log("High scores cleared.");
  }

  getDifficultyLabel(difficulty) {
    switch (parseInt(difficulty)) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  }
}

// Classe UIManager pour gérer les interactions avec le DOM
class UIManager {
  constructor(game) {
    this.game = game;
    this.levelDisplay = document.getElementById("level");
    this.scoreDisplay = document.getElementById("score");
    this.difficultySelect = document.getElementById("difficulty-select");
    this.startButton = document.getElementById('start-button');
    this.colorButtons = document.querySelectorAll(".color-button");
    this.h1 = document.querySelector("h1");

    // Modale pour entrer un pseudo
    this.modal = document.getElementById('pseudo-modal');
    this.closeModal = document.getElementById('close-modal');
    this.pseudoInput = document.getElementById('pseudo-input');
    this.submitPseudoButton = document.getElementById('submit-pseudo');

    this.closeModal.addEventListener('click', () => this.hideModal());
    this.submitPseudoButton.addEventListener("click", () => {
      const pseudo = this.pseudoInput.value.trim() || "Anonymous";
      this.game.saveHighScore(pseudo);
      this.hideModal();
      this.game.resetAfterHighScore();
    });

    window.addEventListener('click', (event) => {
      if (event.target == this.modal) {
        this.hideModal();
      }
    });

    this.difficultySelect.addEventListener('change', () => {
      this.game.setDifficulty(this.difficultySelect.value);
    });

    this.startButton.addEventListener('click', () => {
      this.game.startGame();
    });

    this.colorButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (!this.game.started) return;

        const userChosenColor = button.id;
        this.game.handleUserClick(userChosenColor);
      });
    });
  }

  updateLevel(level) {
    this.levelDisplay.textContent = level;
  }

  updateScore(score) {
    this.scoreDisplay.textContent = score;
  }

  showStartButton() {
    this.startButton.style.display = 'inline-block';
  }

  hideStartButton() {
    this.startButton.style.display = 'none';
  }

  setMessage(message) {
    this.h1.textContent = message;
  }

  animatePress(color) {
    const activeButton = document.getElementById(color);
    activeButton.classList.add("active");
    setTimeout(() => activeButton.classList.remove("active"), 200);
  }

  disableButtons() {
    this.colorButtons.forEach(button => {
      button.style.pointerEvents = "none";
    });
  }

  enableButtons() {
    this.colorButtons.forEach(button => {
      button.style.pointerEvents = "auto";
    });
  }

  showGameOver() {
    document.body.classList.add("game-over");
    setTimeout(() => document.body.classList.remove("game-over"), 200);
  }

  showModal() {
    this.pseudoInput.value = '';
    this.modal.style.display = 'block';
  }

  hideModal() {
    this.modal.style.display = 'none';
  }
}

// Classe principale Game pour gérer le jeu
class Game {
  constructor() {
    this.buttonColors = ["red", "blue", "green", "yellow"];
    this.gamePattern = [];
    this.userClickedPattern = [];
    this.started = false;
    this.level = 0;
    this.score = 0;
    this.difficulty = 1;

    this.speed = {
      1: 1000,
      2: 700,
      3: 400,
    };

    this.highScores = new HighScores();
    this.uiManager = new UIManager(this);
  }

  setDifficulty(value) {
    this.difficulty = parseInt(value) || 1;
  }

  startGame() {
    if (!this.started) {
      this.resetGame();
      this.uiManager.setMessage("Good luck!");
      this.nextSequence();
      this.started = true;
      this.uiManager.hideStartButton();
    }
  }

  handleUserClick(color) {
    this.userClickedPattern.push(color);
    this.uiManager.animatePress(color);
    this.checkAnswer(this.userClickedPattern.length - 1);
  }

  checkAnswer(currentLevel) {
    if (this.gamePattern[currentLevel] === this.userClickedPattern[currentLevel]) {
      if (this.userClickedPattern.length === this.gamePattern.length) {
        this.score += 10;
        this.uiManager.updateScore(this.score);
        this.uiManager.setMessage("Good! Next level...");
        setTimeout(() => this.nextSequence(), 1000);
      }
    } else {
      this.uiManager.showGameOver();
      this.uiManager.setMessage("Lost! Click 'Start' to retry.");
      this.startOver();
    }
  }

  nextSequence() {
    this.userClickedPattern = [];
    this.level++;
    this.uiManager.updateLevel(this.level);

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColor = this.buttonColors[randomNumber];
    this.gamePattern.push(randomChosenColor);

    this.uiManager.disableButtons();

    let i = 0;
    const interval = setInterval(() => {
      const currentColor = this.gamePattern[i];
      this.uiManager.animatePress(currentColor);
      i++;
      if (i >= this.gamePattern.length) {
        clearInterval(interval);
        setTimeout(() => this.uiManager.enableButtons(), 500);
      }
    }, this.speed[this.difficulty]);
  }

  startOver() {
    if (this.isHighScore(this.score)) {
      this.uiManager.showModal();
    } else {
      this.highScores.saveScore(this.score, "Anonymous", this.difficulty);
      this.resetAfterHighScore();
    }
  }

  saveHighScore(pseudo) {
    this.highScores.saveScore(this.score, pseudo, this.difficulty);
  }

  resetAfterHighScore() {
    this.level = 0;
    this.gamePattern = [];
    this.started = false;
    this.score = 0;
    this.uiManager.updateScore(this.score);
    this.uiManager.showStartButton();
  }

  isHighScore(score) {
    if (this.highScores.highScores.length < 5) return true;
    const lowestScore = this.highScores.highScores[this.highScores.highScores.length - 1].score;
    return score > lowestScore;
  }

  resetGame() {
    this.level = 0;
    this.score = 0;
    this.gamePattern = [];
    this.userClickedPattern = [];
    this.uiManager.updateLevel(this.level);
    this.uiManager.updateScore(this.score);
    this.uiManager.setMessage("Simon Says");
  }
}

// Initialisation
const simonGame = new Game();
