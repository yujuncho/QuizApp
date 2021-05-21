"use strict";

class HighScoresView {
  constructor(maxScore, display, render, leaveHighScoresView) {
    this.highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    this.maxScore = maxScore;
    this.display = display;
    this.render = render;
    this.leaveHighScoresView = leaveHighScoresView;
  }

  viewScores() {
    // Set Header
    let header = document.getElementById("header");
    header.innerHTML = "";

    // View Helper
    let createScoreList = () => {
      let scoreList = [];
      for (let i = 0; i < this.highScores.length; i++) {
        scoreList.push(
          `<li class="list-group-item">
              ${i + 1}. ${this.highScores[i].name} ${this.highScores[i].score}
           </li>`
        );
      }
      return scoreList.join("");
    };

    // Set View
    this.display.title = "High Scores";
    this.display.body = `
            <ul id="highScoresList" class="list-group mt-4">
              ${createScoreList()}
            </ul>
    `;
    this.display.footer = `
            <button type="button" id="back" class="btn btn-secondary">View Instructions</button>
            <button type="button" id="delete" class="btn btn-danger">Delete High Scores</button>
    `;
    this.render();

    // Button handlers
    document.getElementById("back").addEventListener("click", event => {
      event.preventDefault();
      this.leaveHighScoresView();
    });

    document.getElementById("delete").addEventListener("click", event => {
      event.preventDefault();
      document.getElementById("highScoresList").remove();
      this.highScores = [];
      localStorage.setItem("highScores", JSON.stringify(this.highScores));
    });
  }

  // Update display
  viewSubmitScore(score) {
    // Set View
    this.display.title = "All done!";
    this.display.body = `You final score is ${score}`;
    this.display.footer = `
              <div class="d-flex align-items-center mt-4">
                <label for="name" class="flex-shrink-0 m-0">Enter Initials:</label>
                <input type="text" class="form-control ml-2" id="name" />
                <button type="button" class="btn btn-primary ml-2" id="submit">Submit</button>
              </div>
    `;
    this.render();

    // Button handlers
    let submitHandler = () => {
      let name = document.getElementById("name").value;
      let newScoreObj = { name: name, score: score };
      let countOfSavedScores = this.highScores.length;

      for (let i = 0; i < this.highScores.length; i++) {
        if (score >= this.highScores[i].score) {
          this.highScores.splice(i, 0, newScoreObj);
          localStorage.setItem("highScores", JSON.stringify(this.highScores));
          break;
        }
      }

      if (
        this.highScores.length === 0 ||
        countOfSavedScores === this.highScores.length
      ) {
        this.highScores.push(newScoreObj);
        localStorage.setItem("highScores", JSON.stringify(this.highScores));
      }

      this.viewScores();
    };

    let submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", event => {
      event.preventDefault();
      submitHandler();
    });

    let nameInput = document.getElementById("name");
    nameInput.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        submitHandler();
      }
    });
  }
}

export default HighScoresView;
