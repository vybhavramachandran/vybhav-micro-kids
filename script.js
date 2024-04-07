// Full JavaScript code for Math Quiz

// Selecting elements from the DOM
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
const resetQuizButton = document.getElementById('reset-quiz-button');
const feedbackElement = document.querySelector('.feedback');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

let currentQuestion = 0;
let score = 0;
let timer;
let difficulty;
let selectedOperation;
let quizQuestions = [];

// Function to display the operation selection buttons
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
    resetQuizButton.style.display = 'none'; // Hide reset button initially
}

showOperationSelection();

// Event listeners for operation and difficulty selection
operationSelectElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('operation')) {
        selectedOperation = event.target.dataset.operation;
        difficultySelectElement.style.display = 'flex';
        operationSelectElement.style.display = 'none';
    }
});

difficultySelectElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('difficulty')) {
        difficulty = event.target.dataset.difficulty;
        startRound();
    }
});

// Play Again button event listener
playAgainButton.addEventListener('click', resetQuiz);

// Start the quiz round
function startRound() {
    currentQuestion = 0;
    score = 0;
    quizQuestions = [];
    difficultySelectElement.style.display = 'none';
    // Hide the timer selection checkboxes
    tenSecTimerCheckbox.parentElement.style.display = 'none';
    fiveSecTimerCheckbox.parentElement.style.display = 'none';
    // Show other elements
    questionElement.style.display = 'block';
    optionsElement.style.display = 'block';
    timerElement.style.display = 'block';
    statusElement.style.display = 'block';
    resetQuizButton.style.display = 'block'; // Show the reset button
    nextQuestion();
}
// Move to the next question
function nextQuestion() {
    if (currentQuestion < 20) {
        generateQuestion();
    } else {
        showResult();
    }
}

function generateApproximationQuestion() {
    let baseNumber, divisor, range;
    switch (difficulty) {
        case 'easy':
            baseNumber = Math.floor(Math.random() * 100) + 50;
            divisor = Math.floor(Math.random() * 5) + 2;
            range = 10; // Larger range for more obvious correct answer
            break;
        case 'medium':
            baseNumber = Math.floor(Math.random() * 500) + 200;
            divisor = Math.floor(Math.random() * 10) + 5;
            range = 5; // Medium range for medium difficulty
            break;
        case 'hard':
            baseNumber = Math.floor(Math.random() * 1000) + 500;
            divisor = Math.floor(Math.random() * 15) + 10;
            range = 2; // Small range for subtle correct answer
            break;
    }

    const exactAnswer = baseNumber / divisor;
    const roundedAnswer = Math.round(exactAnswer / 10) * 10;
    const options = new Set([roundedAnswer]);

    // Generate other options within the difficulty range
    while (options.size < 4) {
        let option = roundedAnswer + (Math.floor(Math.random() * 2 * range - range) * 10);
        options.add(option);
    }

    // Convert Set back to Array and shuffle options
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    questionElement.textContent = `Approximate: ${baseNumber} / ${divisor} ≈ ?`;
    quizQuestions[currentQuestion] = { question: questionElement.textContent, answer: roundedAnswer };
    displayOptions(shuffledOptions, roundedAnswer);
}


// Generate a new question based on the operation
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

    let question, answer;

    if (selectedOperation === 'Mixed') {
        const operations = ['Addition', 'Subtraction', 'Multiplication', 'Division'];
        selectedOperation = operations[Math.floor(Math.random() * operations.length)];
    }

    if (selectedOperation === 'Approximation') {
                // Decide randomly between division and multiplication for approximation
                const approxOperation = Math.random() < 0.5 ? 'Division' : 'Multiplication';

                if (approxOperation === 'Division') {
                    // Division: Adjust num1 and num2 based on difficulty
                    num1 = difficulty === 'easy' ? Math.floor(Math.random() * 100) + 50 :
                           difficulty === 'medium' ? Math.floor(Math.random() * 500) + 250 :
                           Math.floor(Math.random() * 1000) + 500; // Hard
                           num2 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 
                           difficulty == 'medium' ? 10 : 20))  + 2;                    question = `Approximate: ${num1} ÷ ${num2}`;
                    answer = Math.round((num1 / num2) / 10) * 10; // Rounded to nearest 10
                } else {
                    // Multiplication: Simpler numbers for easy, more complex for hard
                    num1 = difficulty === 'easy' ? Math.floor(Math.random() * 10) + 2 :
                           difficulty === 'medium' ? Math.floor(Math.random() * 20) + 10 :
                           Math.floor(Math.random() * 30) + 15; // Hard
                           num2 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 
                           difficulty == 'medium' ? 10 : 20))  + 2;                    question = `Approximate: ${num1} × ${num2}`;
                    answer = Math.round((num1 * num2) / 10) * 10; // Rounded to nearest 10
                }    

        // Generate close options for approximation
        options = [answer];
        while (options.length < 4) {
            let variation = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 10 : -10);
            let newOption = answer + variation;
            if (!options.includes(newOption)) {
                options.push(newOption);
            }
        }
    } else {
        switch (selectedOperation) {
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
                // For division, make sure we don't divide by zero
                num2 = num2 === 0 ? 1 : num2;
                question = `${num1} ÷ ${num2}`;
                answer = Math.floor(num1 / num2);
                break;
        }
    }

    questionElement.textContent = question + " = ?";
    quizQuestions[currentQuestion] = { question: questionElement.textContent, answer };
    generateOptions(answer);
    updateStatus();

    if (tenSecTimerCheckbox.checked) {
        startTimer(10);
    } else if (fiveSecTimerCheckbox.checked) {
        startTimer(5);
    }
}

// Select an answer option
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

// Generate answer options
function generateOptions(correctAnswer) {
    let options;
    if (selectedOperation === 'Approximation') {
        options = [correctAnswer - 10, correctAnswer, correctAnswer + 10, correctAnswer + 20].sort(() => Math.random() - 0.5);
    } else {
        options = [correctAnswer];
        while (options.length < 4) {
            let option = Math.floor(Math.random() * 100) + 1;
            if (options.indexOf(option) === -1) {
                options.push(option);
            }
        }
        options.sort(() => Math.random() - 0.5);
    }

    optionsElement.innerHTML = '';
    options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.classList.add('option');
        optionButton.textContent = selectedOperation === 'Approximation' ? `Approximately ${option}` : option;
        optionButton.addEventListener('click', () => selectOption(option, correctAnswer));
        optionsElement.appendChild(optionButton);
    });
}

// Start the timer
function startTimer(duration) {
    let timeLeft = duration;
    timerElement.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            feedbackElement.textContent = 'Time out!';
            feedbackElement.classList.add('wrong-feedback');
            setTimeout(() => {
                feedbackElement.textContent = '';
                feedbackElement.classList.remove('wrong-feedback');
                currentQuestion++;
                nextQuestion();
            }, 1000);
        }
    }, 1000);
}

// Update the current status
function updateStatus() {
    statusElement.textContent = `Question ${currentQuestion + 1} of 20. Score: ${score}`;
}

// Show the result of the quiz
function showResult() {
    clearInterval(timer);
    resultElement.textContent = `You scored ${score} out of 20!`;
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    timerElement.style.display = 'none';
    statusElement.style.display = 'none';
    resetQuizButton.style.display = 'none'; // Hide the reset button
    resultsContainer.style.display = 'block';
    // Populate the results list
    resultsList.innerHTML = quizQuestions.map((q, index) => {
        const isCorrect = q.answer === (quizQuestions[index].userAnswer || null);
        const itemClass = isCorrect ? 'correct' : 'wrong';
        return `<li class="${itemClass}"><strong>${q.question}</strong><br>
            Your answer: ${q.userAnswer || "No answer"}<br>
            ${isCorrect ? 'Correct!' : `Wrong. Correct answer: ${q.answer}`}</li>`;
    }).join('');
}

// Reset the quiz to the initial state
function resetQuiz() {
    clearInterval(timer);
    currentQuestion = 0;
    score = 0;
    quizQuestions = [];
    resultsContainer.style.display = 'none';
    resultElement.textContent = '';
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    timerElement.style.display = 'none';
    statusElement.style.display = 'none';
    resetQuizButton.style.display = 'none'; // Hide the reset button
    // Show the timer selection checkboxes again
    tenSecTimerCheckbox.parentElement.style.display = 'inline';
    fiveSecTimerCheckbox.parentElement.style.display = 'inline';
    showOperationSelection();
}

// Event listener for the reset quiz button
resetQuizButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the quiz?')) {
        resetQuiz();
    }
});
