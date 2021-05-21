"use strict";

class QuizView {
  constructor(
    quizItems,
    duration,
    display,
    render,
    viewScores,
    completedCallback
  ) {
    // [{ question: "", choices: [], correctChoice: Index, value: Integer }]
    this.quizItems = quizItems;
    this.quizDuration = duration;
    this.display = display;
    this.render = render;
    this.viewScores = viewScores;
    this.completedCallback = score => {
      document.getElementById("timer").remove();
      clearInterval(this.timer);
      completedCallback(score);
    };

    this.nextQuestion = 0;
    this.quizScore = 0;
    this.timer;
  }

  viewInstructions() {
    // Set Header
    let header = document.getElementById("header");
    let viewHighScoresLink = document.createElement("a");
    viewHighScoresLink.href = "";
    viewHighScoresLink.textContent = "View High Scores";
    viewHighScoresLink.addEventListener("click", event => {
      event.preventDefault();
      this.viewScores();
    });
    header.appendChild(viewHighScoresLink);

    let timerElement = document.createElement("p");
    timerElement.id = "timer";
    header.appendChild(timerElement);

    // Set View
    this.display.title = "Coding Quiz Challenge";
    this.display.body = `
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Doloremque maiores, necessitatibus maxime doloribus quia porro
              dicta fuga quisquam aperiam alias?
            </p>
      `;
    this.display.footer = `<button type="button" class="btn btn-primary" id="startQuiz">Start Quiz</button>`;
    this.render();

    // Button Handler
    let startButton = document.getElementById("startQuiz");
    startButton.addEventListener("click", event => {
      event.preventDefault();

      // Set the timer
      let duration = this.quizDuration;
      timerElement.textContent = duration;
      duration--;

      this.timer = setInterval(() => {
        if (duration > 0) {
          timerElement.textContent = duration;
          duration--;
        } else {
          this.completedCallback(this.quizScore);
        }
      }, 1000);

      // Set quiz state and show the first question
      viewHighScoresLink.remove();
      this.nextQuestion = 0;
      this.quizScore = 0;
      this.viewQuestion(this.nextQuestion);
    });
  }

  viewQuestion(index) {
    // View Helper
    let createButtons = choices => {
      let buttonList = [];
      for (let i = 0; i < choices.length; i++) {
        let button = `
          <button type="button" id="choice-${i}" class="btn btn-primary mt-1 rounded text-left">
            ${i}. ${choices[i]} 
          </button>
          `;
        buttonList.push(button);
      }
      return buttonList.join("");
    };

    // Set View
    let question = this.quizItems[index];
    this.display.title = `${question.question}`;
    this.display.body = `
            <div
              class="btn-group-vertical"
              role="group"
              aria-label="Potential answers"
            >
              ${createButtons(question.choices)}
            </div>
      `;
    this.display.footer = "";
    this.render();
    this.nextQuestion++;

    // Button Handlers
    let alreadyAnswered = false;

    let showCorrectness = isCorrect => {
      this.display.footer = `
                <hr class="mb-2">
                <div class="d-flex align-items-center justify-content-between">
                  <p class="text-secondary font-italic m-0">${
                    isCorrect ? "Correct" : "Wrong"
                  }</p>
                  <button type="button" id="next" class="btn btn-secondary">Next</button>
                </div>
      `;
      this.render(new Set(["footer"]));

      document.getElementById("next").addEventListener("click", event => {
        event.preventDefault();
        if (this.nextQuestion < this.quizItems.length) {
          this.viewQuestion(this.nextQuestion);
        } else {
          this.completedCallback(this.quizScore);
        }
      });

      if (isCorrect && !alreadyAnswered) {
        this.quizScore += question.value;
      }

      alreadyAnswered = true;
    };

    for (let i = 0; i < question.choices.length; i++) {
      let buttonElement = document.getElementById(`choice-${i}`);
      buttonElement.addEventListener("click", event => {
        event.preventDefault();
        showCorrectness(i === question.correctChoice);
      });
    }
  }
}

export default QuizView;
