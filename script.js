// script.js

// Classe SoundManager pour gérer les sons
class SoundManager {
  constructor() {
    this.sounds = {};
    ['red', 'blue', 'green', 'yellow', 'wrong', 'start'].forEach(sound => {
      this.sounds[sound] = new Audio(`sounds/${sound}.mp3`);
    });
  }

  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
    }
  }
}

// Classe HighScores pour gérer les meilleurs scores
class HighScores {
  constructor() {
    this.scoreList = document.getElementById("score-list");
    const storedScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Vérifier si les scores sont dans l'ancien format (tableau de nombres)
    if (storedScores.length > 0 && typeof storedScores[0] === 'number') {
      // Convertir les scores en objets avec des valeurs par défaut
      this.highScores = storedScores.map(score => ({
        score: score,
        pseudo: "Anonyme",
        difficulty: "Inconnue"
      }));
      // Mettre à jour le localStorage avec le nouveau format
      localStorage.setItem('highScores', JSON.stringify(this.highScores));
    } else {
      this.highScores = storedScores;
    }

    this.displayHighScores();
  }

  displayHighScores() {
    this.scoreList.innerHTML = '';
    this.highScores.forEach((entry, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${entry.pseudo} - ${entry.score} points - ${entry.difficulty}`;
      this.scoreList.appendChild(li);
    });
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

    // Éléments de la modale
    this.modal = document.getElementById('pseudo-modal');
    this.closeModal = document.getElementById('close-modal');
    this.pseudoInput = document.getElementById('pseudo-input');
    this.submitPseudoButton = document.getElementById('submit-pseudo');

    // Gestion des événements de la modale
    this.closeModal.addEventListener('click', () => {
      this.hideModal();
    });

    this.submitPseudoButton.addEventListener('click', () => {
      const pseudo = this.pseudoInput.value.trim() || "Anonyme";
      this.game.saveHighScore(pseudo);
      this.hideModal();
      this.game.resetAfterHighScore();
    });

    // Fermeture de la modale en cliquant à l'extérieur
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
    setTimeout(() => {
      activeButton.classList.remove("active");
    }, 200);
  }

  disableButtons() {
    this.colorButtons.forEach(button => {
      button.style.pointerEvents = "none";
      button.classList.add("disabled");
    });
  }

  enableButtons() {
    this.colorButtons.forEach(button => {
      button.style.pointerEvents = "auto";
      button.classList.remove("disabled");
    });
  }

  showGameOver() {
    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);
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
    this.difficulty = 1; // Par défaut : Facile

    this.speed = {
      1: 1000, // Facile
      2: 700,  // Moyen
      3: 400   // Difficile
    };

    this.soundManager = new SoundManager();
    this.highScores = new HighScores();
    this.uiManager = new UIManager(this);
  }

  setDifficulty(value) {
    this.difficulty = value;
  }

  startGame() {
    if (!this.started) {
      this.resetGame();
      this.soundManager.playSound('start');
      this.uiManager.setMessage("Bonne chance !");
      this.nextSequence();
      this.started = true;
      this.uiManager.hideStartButton();
    }
  }

  handleUserClick(color) {
    this.userClickedPattern.push(color);
    this.soundManager.playSound(color);
    this.uiManager.animatePress(color);
    this.checkAnswer(this.userClickedPattern.length - 1);
  }

  checkAnswer(currentLevel) {
    if (this.gamePattern[currentLevel] === this.userClickedPattern[currentLevel]) {
      if (this.userClickedPattern.length === this.gamePattern.length) {
        // Augmenter le score
        this.score += 10;
        this.uiManager.updateScore(this.score);
        this.uiManager.setMessage("Bravo ! Niveau suivant...");
        // Passer au niveau suivant après un court délai
        setTimeout(() => {
          this.nextSequence();
        }, 1000);
      }
    } else {
      // Si l'utilisateur s'est trompé
      this.soundManager.playSound("wrong");
      this.uiManager.showGameOver();
      this.uiManager.setMessage("Perdu ! Cliquez sur 'Commencer le jeu' pour réessayer.");
      // Vérifier si le score est un nouveau record
      this.startOver();
    }
  }

  nextSequence() {
    this.userClickedPattern = [];
    this.level++;
    this.uiManager.updateLevel(this.level);

    // Ajouter un nouvel élément à la séquence
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColor = this.buttonColors[randomNumber];
    this.gamePattern.push(randomChosenColor);

    // Désactiver les boutons pendant que la séquence est jouée
    this.uiManager.disableButtons();

    // Jouer la séquence complète
    let i = 0;
    const interval = setInterval(() => {
      const currentColor = this.gamePattern[i];
      this.uiManager.animatePress(currentColor);
      this.soundManager.playSound(currentColor);
      i++;
      if (i >= this.gamePattern.length) {
        clearInterval(interval);
        // Réactiver les boutons une fois la séquence terminée
        setTimeout(() => {
          this.uiManager.enableButtons();
        }, 500); // Légère pause avant de réactiver les boutons
      }
    }, this.speed[this.difficulty]);
  }

  startOver() {
    if (this.isHighScore(this.score)) {
      this.uiManager.showModal();
    } else {
      this.highScores.saveScore(this.score, "Anonyme", this.getDifficultyLabel());
      this.resetAfterHighScore();
    }
  }

  saveHighScore(pseudo) {
    this.highScores.saveScore(this.score, pseudo, this.getDifficultyLabel());
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
    // Si moins de 5 scores enregistrés, c'est un nouveau record
    if (this.highScores.highScores.length < 5) {
      return true;
    }
    // Vérifier si le score est supérieur au plus petit score
    const lowestScore = this.highScores.highScores[this.highScores.highScores.length - 1].score;
    return score > lowestScore;
  }

  getDifficultyLabel() {
    switch (parseInt(this.difficulty)) {
      case 1:
        return "Facile";
      case 2:
        return "Moyen";
      case 3:
        return "Difficile";
      default:
        return "Inconnu";
    }
  }

  resetGame() {
    this.level = 0;
    this.score = 0;
    this.gamePattern = [];
    this.userClickedPattern = [];
    this.uiManager.updateLevel(this.level);
    this.uiManager.updateScore(this.score);
    this.uiManager.setMessage("Jeu du Simon");
  }
}

// Initialisation du jeu
const simonGame = new Game();
