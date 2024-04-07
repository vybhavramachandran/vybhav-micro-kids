const difficultySelectElement = document.querySelector('.difficulty-select');
const operationSelectElement = document.querySelector('.operation-select');
const statusElement = document.querySelector('.status');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const timerElement = document.querySelector('.timer');
const resultElement = document.querySelector('.result');
const tenSecTimerCheckbox = document.getElementById('ten-sec-timer');
const fiveSecTimerCheckbox = document.getElementById('five-sec-timer');
const resultsContainer = document.querySelector('.results-container');
const resultsList = document.querySelector('.results-list');
const playAgainButton = document.querySelector('.play-again');
const feedbackElement = document.querySelector('.feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

let currentQuestion = 0;
let score = 0;
let timer;
let difficulty;
let selectedOperation;
let quizQuestions = [];

function showOperationSelection() {
    const operations = [
        { text: 'Addition ➕', value: 'Addition' },
        { text: 'Subtraction ➖', value: 'Subtraction' },
        { text: 'Multiplication ✖️', value: 'Multiplication' },
        { text: 'Division ➗', value: 'Division' },
        { text: 'Mixed 🔀', value: 'Mixed' },
        { text: 'Approximation 🧮', value: 'Approximation' }
    ];
    operationSelectElement.innerHTML = '';
    operations.forEach(operation => {
        const button = document.createElement('button');
        button.textContent = operation.text;
        button.dataset.operation = operation.value;
        button.classList.add('operation');
        operationSelectElement.appendChild(button);
    });

    operationSelectElement.style.display = 'flex';
    difficultySelectElement.style.display = 'none';
}

showOperationSelection();

operationSelectElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('operation')) {
        selectedOperation = event.target.dataset.operation;
        showDifficultySelection();
    }
});

function showDifficultySelection() {
    difficultySelectElement.style.display = 'flex';
    operationSelectElement.style.display = 'none';
}

difficultySelectElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('difficulty')) {
        difficulty = event.target.dataset.difficulty;
        startRound();
    }
});

playAgainButton.addEventListener('click', resetQuiz);

function startRound() {
    currentQuestion = 0;
    score = 0;
    quizQuestions = [];
    difficultySelectElement.style.display = 'none';
    questionElement.style.display = 'block';
    optionsElement.style.display = 'block';
    timerElement.style.display = 'block';
    statusElement.style.display = 'block';
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestion < 20) {
        generateQuestion();
        if (tenSecTimerCheckbox.checked || fiveSecTimerCheckbox.checked) {
            startTimer();
        }
    } else {
        showResult();
    }
}

function generateQuestion() {
    let num1, num2, operation = selectedOperation;

    switch (difficulty) {
        case 'easy':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            break;
        case 'medium':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            break;
        case 'hard':
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
            break;
    }

    if (operation === 'Mixed') {
        const operations = ['Addition', 'Subtraction', 'Multiplication', 'Division'];
        operation = operations[Math.floor(Math.random() * operations.length)];
    }

    let question, answer;
    if (operation === 'Approximation') {
        num1 = Math.floor(Math.random() * 5000) + 1000;
        num2 = Math.floor(Math.random() * 90) + 10;
        question = `${num1} / ${num2}`;
        answer = Math.round(num1 / num2 / 10) * 10;
    } else {
        switch (operation) {
            case 'Addition':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case 'Subtraction':
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case 'Multiplication':
                question = `${num1} × ${num2}`;
                answer = num1 * num2;
                break;
            case 'Division':
                question = `${num1} ÷ ${num2}`;
                answer = Math.floor(num1 / num2);
                break;
        }
    }

    const approximateAnswers = [answer - 10, answer, answer + 10, answer + 20];
    const shuffledAnswers = approximateAnswers.sort(() => 0.5 - Math.random());
    
    questionElement.textContent = question + " = ?";
    optionsElement.innerHTML = '';
    shuffledAnswers.forEach(opt => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option');
        optionButton.textContent = operation === 'Approximation' ? `Approximately ${opt}` : opt;
        optionButton.addEventListener('click', () => selectOption(opt, answer));
        optionsElement.appendChild(optionButton);
    });

    updateStatus();
}

function selectOption(selectedAnswer, correctAnswer) {
    clearInterval(timer);
    const isCorrect = selectedOperation === 'Approximation' ? Math.abs(selectedAnswer - correctAnswer) <= 10 : selectedAnswer === correctAnswer;
    if (isCorrect) {
        score++;
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct-feedback');
        correctSound.play();
    } else {
        feedbackElement.textContent = 'Wrong!';
        feedbackElement.classList.add('wrong-feedback');
        wrongSound.play();
    }

    setTimeout(() => {
        feedbackElement.textContent = '';
        feedbackElement.classList.remove('correct-feedback', 'wrong-feedback');
        currentQuestion++;
        nextQuestion();
    }, 1000);
}

function startTimer() {
    let time = tenSecTimerCheckbox.checked ? 10 : 5;
    timerElement.textContent = time;
    timer = setInterval(() => {
        time--;
        timerElement.textContent = time;
        if (time === 0) {
            clearInterval(timer);
            currentQuestion++;
            nextQuestion();
        }
    }, 1000);
}

function updateStatus() {
    statusElement.textContent = `Question ${currentQuestion + 1} of 20`;
}

function showResult() {
    resultElement.textContent = `You scored ${score} out of 20!`;
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    timerElement.style.display = 'none';
    statusElement.style.display = 'none';
    resultsContainer.style.display = 'block';

    resultsList.innerHTML = '';
    quizQuestions.forEach((question, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('results-item');
        listItem.innerHTML = `<strong>${question.question}</strong><br>
                              You chose: ${question.selectedAnswer}<br>`;
        if (quizQuestions[index].answer === quizQuestions[index].selectedAnswer) {
            listItem.classList.add('correct');
            listItem.innerHTML += 'Correct!';
        } else {
            listItem.classList.add('wrong');
            listItem.innerHTML += `Wrong. Correct answer: ${question.answer}`;
        }
        resultsList.appendChild(listItem);
    });
}

function resetQuiz() {
    resultsContainer.style.display = 'none';
    resultElement.textContent = '';
    showOperationSelection();
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    timerElement.style.display = 'none';
    statusElement.style.display = 'none';
    tenSecTimerCheckbox.checked = false;
    fiveSecTimerCheckbox.checked = false;
}
