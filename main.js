import { questionsData } from "./questions.js";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let questions = [];
let currentQuestion = 0;
let score = 0;
const quizDiv = document.getElementById("quiz");

function initQuiz() {
  questions = JSON.parse(JSON.stringify(questionsData));
  shuffle(questions);
  currentQuestion = 0;
  score = 0;
  showQuestion(currentQuestion);
}

function showQuestion(idx) {
  quizDiv.innerHTML = "";
  const q = questions[idx];

  // Прогресс
  const progressDiv = document.getElementById("progress");
  progressDiv.innerText = `Вопрос ${idx + 1} из ${questions.length}`;

  const qDiv = document.createElement("div");
  qDiv.className = "question";
  qDiv.innerHTML = `<p><b>${q.text}</b></p>`;

  const optionsWithIndex = q.options.map((opt, i) => ({ text: opt, index: i }));
  shuffle(optionsWithIndex);

  optionsWithIndex.forEach((optObj) => {
    const btn = document.createElement("button");
    btn.innerText = optObj.text;
    btn.onclick = () => checkAnswer(idx, optObj.index);
    qDiv.appendChild(btn);
    qDiv.appendChild(document.createElement("br"));
  });

  const feedback = document.createElement("div");
  feedback.className = "feedback";
  qDiv.appendChild(feedback);

  quizDiv.appendChild(qDiv);
}

function checkAnswer(qIdx, choiceIdx) {
  const q = questions[qIdx];
  const feedback = document.querySelector(".feedback");

  if (choiceIdx === q.answer) {
    feedback.style.color = "green";
    feedback.innerText = "Верно!";
    score++;
  } else {
    feedback.style.color = "red";
    feedback.innerText = `Неверно! Правильный ответ: 
    ${q.options[q.answer]}`;
  }

  const buttons = document.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Далее";
  nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion(currentQuestion);
    } else {
      const percent = Math.round((score / questions.length) * 100);
      quizDiv.innerHTML = `<h3>Тест завершён!</h3><p>Ваш результат: ${score} из ${questions.length} (${percent}%)</p>`;
      const restartBtn = document.createElement("button");
      restartBtn.innerText = "Пройти снова";
      restartBtn.onclick = initQuiz;
      quizDiv.appendChild(restartBtn);
    }
  };
  quizDiv.appendChild(nextBtn);
}

initQuiz();
