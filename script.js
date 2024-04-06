const difficultySelectElement = document.querySelector('.difficulty-select');
const operationSelectElement = document.querySelector('.operation-select');
const statusElement = document.querySelector('.status');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const timerElement = document.querySelector('.timer');
const resultElement = document.querySelector('.result');
const timerCheckbox = document.getElementById('timer-checkbox');
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
        { text: 'Mixed 🔀', value: 'Mixed' }
    ];
    operationSelectElement.innerHTML = ''; // Clear previous operations
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
    timerCheckbox.style.display = 'none';
    questionElement.style.display = 'block';
    optionsElement.style.display = 'block';
    timerElement.style.display = 'block';
    statusElement.style.display = 'block';
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestion < 20) {
        generateQuestion();
        if (timerCheckbox.checked) {
            startTimer();
        }
    } else {
        showResult();
    }
}

function generateQuestion() {
    let num1, num2;

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

    let operation = selectedOperation;
    if (selectedOperation === 'Mixed') {
        const operations = ['Addition', 'Subtraction', 'Multiplication', 'Division'];
        operation = operations[Math.floor(Math.random() * operations.length)];
    }

    let question;
    let answer;

    switch (operation) {
        case 'Addition':
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;
        case 'Subtraction':
            question = `${num1} - ${num2} = ?`;
            answer = num1 - num2;
            break;
        case 'Multiplication':
            question = `${num1} × ${num2} = ?`;
            answer = num1 * num2;
            break;
        case 'Division':
            // Ensure division results in an integer
            num1 = num1 * num2;
            question = `${num1} ÷ ${num2} = ?`;
            answer = num1 / num2;
            break;
    }

    quizQuestions.push({ question, answer, operation });
    questionElement.textContent = question;
    generateOptions(answer);
    updateStatus();
}

function generateOptions(answer) {
    const options = [answer];
    while (options.length < 4) {
        let option;
        switch (difficulty) {
            case 'easy':
                option = Math.floor(Math.random() * 20) + 1;
                break;
            case 'medium':
                option = Math.floor(Math.random() * 100) + 1;
                break;
            case 'hard':
                option = Math.floor(Math.random() * 200) + 1;
                break;
        }
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    options.sort(() => Math.random() - 0.5);

    optionsElement.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(option, answer));
        optionsElement.appendChild(button);
    });
}

function selectOption(selectedAnswer, correctAnswer) {
    clearInterval(timer);
    quizQuestions[currentQuestion].selectedAnswer = selectedAnswer;

    if (selectedAnswer === correctAnswer) {
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
    let time = 10;
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

    resultsContainer.style.display = 'block';
}

function resetQuiz() {
    resultsContainer.style.display = 'none';
    resultElement.textContent = '';
    showOperationSelection();
    timerCheckbox.style.display = 'inline';
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    timerElement.style.display = 'none';
    statusElement.style.display = 'none';
}

const resetQuizButton = document.createElement('button');
resetQuizButton.textContent = 'Reset Quiz';
resetQuizButton.id = 'reset-quiz-button';
resetQuizButton.style.position = 'fixed'; // Position the button as needed
resetQuizButton.style.bottom = '20px';
resetQuizButton.style.right = '20px';
document.body.appendChild(resetQuizButton);

resetQuizButton.addEventListener('click', function() {
    const confirmReset = confirm('Do you really want to reset the quiz and go back to the quiz selection screen?');
    if (confirmReset) {
        resetQuiz();
        showOperationSelection(); // Make sure this shows the initial screen as intended
        timerCheckbox.style.display = 'inline-block'; // Make sure the timer checkbox is visible again
        // Reset any other elements or states as needed
    }
});
