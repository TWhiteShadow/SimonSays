# Simon Game 🎮

A web-based version of the classic **Simon Game**, where players must remember and repeat an increasingly complex sequence of colors. The goal is to test and improve memory by reproducing each sequence as the game progresses. This game is developed in HTML, CSS, and JavaScript.

## Table of Contents

- [Features](#features)
- [Rules](#rules)
- [Installation](#installation)
- [Usage](#usage)
- [Difficulty Levels](#difficulty-levels)
- [High Scores](#high-scores)
- [Customization](#customization)
- [Clear High Scores](#clear-high-scores)

## Features

- Interactive gameplay with visual feedback.
- Adjustable difficulty levels (Easy, Medium, Hard).
- Displays current score and level.
- Tracks high scores with names and difficulty levels.
- Responsive design for various screen sizes.
- Local storage for preserving high scores across sessions.
- Modal for entering a name when achieving a high score.
- **New Feature:** Button to clear all high scores.

## Rules

The objective of the Simon Game is to remember and reproduce the sequence of colors shown by the game. Each level, a new color is added to the sequence, and the player must repeat the entire sequence in the correct order.

- **Level Progression:** With each level, a new color is added to the sequence.
- **Game Over:** If the player selects the wrong color, the game ends, and the final score is displayed.
- **High Scores:** If the player achieves a high score, they can enter their name, and the score will be saved with the selected difficulty level.

## Installation

To set up the game locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/simon-game.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd simon-game
    ```

3. **Open `index.html` in your preferred web browser.**

## Usage

1. **Start the Game:** Click on the "Start Game" button to begin.
2. **Select Difficulty:** Choose a difficulty level from the dropdown menu:
   - **Easy** (1-second delay)
   - **Medium** (0.7-second delay)
   - **Hard** (0.4-second delay)
3. **Play the Sequence:** Watch the sequence of colors flash on the screen. Repeat the sequence by clicking on the color buttons.
4. **Score Tracking:** Each correct sequence increases your score by 10 points and progresses you to the next level.
5. **High Score Entry:** If you achieve a new high score, a modal will appear, prompting you to enter your name.

## Difficulty Levels

The game includes three difficulty settings, which control the speed at which sequences are displayed:

- **Easy:** 1-second delay between colors.
- **Medium:** 0.7-second delay between colors.
- **Hard:** 0.4-second delay between colors.

Select your preferred difficulty before starting the game to customize your challenge.

## High Scores

High scores are saved locally in the browser's storage. The top 5 scores are displayed, along with the player’s name and the difficulty level achieved. 

### Scoring Details

- **New High Score:** When a player achieves a high score, they are prompted to enter a name.
- **Score Reset:** If the browser’s local storage is cleared, high scores will reset.

## Customization

To customize the game (e.g., modify colors, animations, or game speed), you can edit the following files:

- **Colors and Styles:** `style.css`
- **Game Logic and Settings:** `script.js`

## Clear High Scores

The game now includes a **Clear High Scores** button in the high scores section. 

- **Purpose:** Use the button to reset all saved high scores in local storage.
- **How to Use:** Click on the "Clear High Scores" button. This will:
  - Delete all saved high score data.
  - Update the high scores display to show a "No scores available" message.

---

Enjoy the game and have fun challenging your memory! 🎉
