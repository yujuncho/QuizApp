/**
 * Core features:
 *  - View highscores
 *      - Back to the start quiz page
 *      - Delete all highscores
 *  - Take a quiz
 *      - X number of questions which are each worth a certain value for correct answers
 *      - Feedback saying an answer is right or wrong
 *      - Timer that starts once the quiz begins
 *      - View final score and submit with initials
 *
 * Project example:
 * https://ucarecdn.com/bcb88f3b-e678-4e3b-b98e-94b9fa320ac5/
 */

class QuizApp {
  constructor(quizItems) {
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
      this.display,
      this.render,
      score => {
        this.highScoresView.viewSubmitScore(score);
      }
    );
  }

  render(itemsToRender = new Set(["title", "body", "footer"])) {
    if (itemsToRender.has("title")) {
      document.getElementById("quiz-title").innerText = this.display.title;
    }
    if (itemsToRender.has("body")) {
      document.getElementById("quiz-body").innerHTML = this.display.body;
    }
    if (itemsToRender.has("footer")) {
      document.getElementById("quiz-footer").innerHTML = this.display.footer;
    }
  }

  start(quizDuration = 60) {
    this.quizView.viewInstructions(quizDuration);
  }
}

/* QUIZ */
class QuizView {
  constructor(quizItems, display, render, completedCallback) {
    // [{ question: "", choices: [], correctChoice: Index, value: Integer }]
    this.quizItems = quizItems;
    this.display = display;
    this.render = render;
    this.completedCallback = completedCallback;

    this.nextQuestion = 0;
    this.quizScore = 0;
  }

  viewInstructions(quizDuration) {
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
      let duration = quizDuration;
      let timer = setInterval(() => {
        // TODO: show timer
        console.log(duration);
        if (duration > 0) {
          duration--;
        } else {
          clearInterval(timer);
          this.completedCallback(this.quizScore);
        }
      }, 1000);

      // Set quiz state and show the first question
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

/* HIGHSCORES */
class HighScoresView {
  constructor(maxScore, display, render, leaveHighScoresView) {
    this.highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    this.maxScore = maxScore;
    this.display = display;
    this.render = render;
    this.leaveHighScoresView = leaveHighScoresView;
  }

  viewScores() {
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
            <button type="button" id="back" class="btn btn-secondary">Go Back</button>
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
        console.log("word");
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

let quizItems = [
  {
    question: "Answer to universe",
    choices: [1, 300, 42, 63],
    correctChoice: 2,
    value: 20
  },
  {
    question: "universe",
    choices: [1, 300, 42, 63],
    correctChoice: 2,
    value: 20
  },
  {
    question: "Answer",
    choices: [1, 300, 42, 63],
    correctChoice: 2,
    value: 20
  },
  { question: "to", choices: [1, 300, 42, 63], correctChoice: 2, value: 20 }
];
let quiz = new QuizApp(quizItems);
quiz.start();
