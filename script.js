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

// Use best practices e.g. polymorphism, DRY

/* HIGHSCORES */
let highscores = JSON.parse(localStorage.getItem("highscores")) || [];

// Update display
let addScore = (name, score) => {
    let newScoreElement = document.createElement("div");
    let newScoreObj = {name : name, score: score};
    let highscoresList = document.getElementById("highscoresList").children;
    let i = 0;

    function addHelper (oldScoreElement, scoreElement, scoreObj) {
            highscoresList.insertBefore(oldScoreElement, scoreElement);
            highscores.splice(i - 1, 0, scoreObj);
            localStorage.setItem("highscores") = JSON.stringify(highscores);
    }

    // TODO: handle the case of empty arrays and when the new score is the highest score
    for (let scoreElement of highscoresList) {
        if (highscores[i].score > score) {
            addHelper(scoreElement, newScoreElement, newScoreObj);
            break;
        }
        i++;
    }
}

let removeHighscoresList = () => {
  document.getElementById("highscoresList").remove();
  highscores = [];
  localStorage.setItem("highscore") = JSON.stringify([]);
};

// Click Handlers
let clearHighscores = (event) => {
    event.preventDefault();
    removeHighscoresList();
};

let viewStartPage = (event) => {
    event.preventDefault();
    document.getElementById("highscoresWrapper").style = "display: none";
    document.getElementById("startPageWrapper").style = "display: default";
};

// Initialize
let initializeHighscoreClickHandlers = () => {
    document.getElementById("clearHighscores").addEventListener("click", clearHighscores);
    document.getElementById("viewStart").addEventListener("click", viewStartPage);
}
initializeHighscoreClickHandlers();

/* QUIZ */
let quiz = [
  { question: "", choices: [], correctChoice: 2, value: 10 },
  { question: "", choices: [], correctChoice: 4, value: 10 },
  { question: "", choices: [], correctChoice: 2, value: 10 },
  { question: "", choices: [], correctChoice: 3, value: 10 }
];
let quizScore = 0;
let currentQuestion = 0;

// Update display
let displayStartingScreen = (isHidden = false) => {};
let displayQuestion = question => {};

// Click Handlers
let startQuiz = () => {};
let viewHighscores = () => {};
let selectChoice = choice => {};
let viewNextQuestion = () => {};
let saveScore = () => {};
let showAnswerVerification = () => {};
