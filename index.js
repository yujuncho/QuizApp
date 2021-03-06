"use strict";

import QuizApp from "./QuizApp.js";

let loadQuizItemsJson = callback => {
  fetch("./public/quizItems.json")
    .then(response => response.json())
    .then(data => {
      callback(data);
    });
};

let startQuiz = quizItems => {
  let quiz = new QuizApp(quizItems);
  quiz.start();
};

loadQuizItemsJson(startQuiz);
