"use strict";

import HighScoresView from "./components/HighScoresView.js";
import QuizView from "./components/QuizView.js";

class QuizApp {
  constructor(quizItems, duration = 60) {
    this.display = { title: "", body: "", footer: "" };
    this.highScoresView = new HighScoresView(
      quizItems.reduce((a, b) => a + b, 0),
      this.display,
      this.render,
      () => {
        this.quizView.viewInstructions();
      }
    );

    // Gotcha: If viewSubmitScore is passed directly
    // as the callback, `this` changes to refer to the
    // quizView object. Utilizing the arrow function,
    // `this` will correctly reference the highScoresView
    // object.
    this.quizView = new QuizView(
      quizItems,
      duration,
      this.display,
      this.render,
      () => {
        this.highScoresView.viewScores();
      },
      score => {
        this.highScoresView.viewSubmitScore(score);
      }
    );
  }

  render(itemsToRender = new Set(["title", "body", "footer"])) {
    for (let item of itemsToRender) {
      document.getElementById(`quiz-${item}`).innerHTML = this.display[item];
    }
  }

  start() {
    this.quizView.viewInstructions();
  }
}

export default QuizApp;
