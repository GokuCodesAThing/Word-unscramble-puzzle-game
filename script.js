// Word lists for different difficulty levels
const wordsByLevel = {
    1: [ // Easy
        { word: 'PYTHON', hint: 'A snake-named programming language' },
        { word: 'HTML', hint: 'Markup language for creating web pages' },
        { word: 'ARRAY', hint: 'Ordered collection of elements' },
        { word: 'LOOP', hint: 'Programming construct that repeats a sequence of instructions' },
        { word: 'CODE', hint: 'Instructions written for computers' },
        { word: 'BUG', hint: 'An error in a program' },
        { word: 'JAVA', hint: 'Popular programming language named after coffee' },
        { word: 'LIST', hint: 'Collection of items in a sequence' },
        { word: 'BYTE', hint: '8 bits of data' },
        { word: 'FILE', hint: 'Container for storing data' },
        { word: 'MENU', hint: 'List of options to choose from' },
        { word: 'LINK', hint: 'Connection between web pages' },
        { word: 'TEXT', hint: 'Written characters' },
        { word: 'SAVE', hint: 'Store data for later use' },
        { word: 'EDIT', hint: 'Make changes to something' }
    ],
    2: [ // Medium
        { word: 'JAVASCRIPT', hint: 'A popular programming language for web development' },
        { word: 'FUNCTION', hint: 'Block of reusable code' },
        { word: 'DATABASE', hint: 'Organized collection of structured information' },
        { word: 'VARIABLE', hint: 'Container for storing data values' },
        { word: 'DEBUGGING', hint: 'Process of finding and fixing errors in code' },
        { word: 'COMPILER', hint: 'Translates code into machine language' },
        { word: 'BOOLEAN', hint: 'True or false data type' },
        { word: 'FRONTEND', hint: 'The client-side of applications' },
        { word: 'BACKEND', hint: 'The server-side of applications' },
        { word: 'SYNTAX', hint: 'Rules for writing code correctly' },
        { word: 'STRING', hint: 'Sequence of characters' },
        { word: 'INTEGER', hint: 'Whole number data type' },
        { word: 'CONSOLE', hint: 'Where programmers can see output' },
        { word: 'METHOD', hint: 'Function associated with an object' },
        { word: 'LIBRARY', hint: 'Collection of pre-written code' }
    ],
    3: [ // Hard
        { word: 'ALGORITHM', hint: 'Step-by-step procedure to solve a problem' },
        { word: 'RECURSION', hint: 'When a function calls itself' },
        { word: 'INTERFACE', hint: 'Shared boundary between two separate components' },
        { word: 'POLYMORPHISM', hint: 'Many forms in object-oriented programming' },
        { word: 'ENCRYPTION', hint: 'Process of encoding information' },
        { word: 'MIDDLEWARE', hint: 'Software that bridges different applications' },
        { word: 'ASYNCHRONOUS', hint: 'Operations that run independently of others' },
        { word: 'INHERITANCE', hint: 'Mechanism to pass properties between classes' },
        { word: 'DEPLOYMENT', hint: 'Process of making software available for use' },
        { word: 'ABSTRACTION', hint: 'Hiding complex implementation details' },
        { word: 'REPOSITORY', hint: 'Storage location for software packages' },
        { word: 'KUBERNETES', hint: 'Container orchestration platform' },
        { word: 'MICROSERVICE', hint: 'Small, independent service architecture' },
        { word: 'BLOCKCHAIN', hint: 'Distributed, immutable ledger technology' },
        { word: 'VIRTUALIZATION', hint: 'Creating virtual versions of resources' }
    ]
};

let currentWord = '';
let currentHint = '';
let points = 0;
let hintsUsed = 0;
let currentLevel = 1;
let wordsCompleted = 0;
let selectedDifficulty = 1;

// DOM elements
const scrambledWordElement = document.getElementById('scrambled-word');
const userInput = document.getElementById('user-input');
const checkButton = document.getElementById('check-btn');
const hintButton = document.getElementById('hint-btn');
const nextButton = document.getElementById('next-btn');
const backButton = document.getElementById('back-btn');
const messageElement = document.getElementById('message');
const hintText = document.getElementById('hint-text');
const pointsElement = document.getElementById('points');
const currentLevelElement = document.getElementById('current-level');
const levelProgress = document.getElementById('level-progress');
const levelSelection = document.getElementById('level-selection');
const gameContainer = document.getElementById('game-container');
const levelButtons = document.querySelectorAll('.level-btn');

// Function to reset game state
function resetGame() {
    points = 0;
    pointsElement.textContent = points;
    wordsCompleted = 0;
    hintsUsed = 0;
    updateProgressBar();
    messageElement.textContent = '';
    hintText.textContent = '';
}

// Function to show level selection
function showLevelSelection() {
    gameContainer.style.display = 'none';
    levelSelection.style.display = 'block';
    resetGame();
}

// Initialize level selection
gameContainer.style.display = 'none';

levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedDifficulty = parseInt(button.dataset.level);
        currentLevel = selectedDifficulty;
        currentLevelElement.textContent = currentLevel;
        levelSelection.style.display = 'none';
        gameContainer.style.display = 'flex';
        startNewLevel();
    });
});

// Back button event listener
backButton.addEventListener('click', () => {
    const confirmBack = confirm('Are you sure you want to go back? Your progress will be lost.');
    if (confirmBack) {
        showLevelSelection();
    }
});

// Function to scramble a word
function scrambleWord(word) {
    let array = word.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Function to select a random word for current level
function getRandomWord() {
    const levelWords = wordsByLevel[currentLevel];
    const randomIndex = Math.floor(Math.random() * levelWords.length);
    currentWord = levelWords[randomIndex].word;
    currentHint = levelWords[randomIndex].hint;
    let scrambled = scrambleWord(currentWord);
    
    // Make sure the scrambled word is different from the original
    while (scrambled === currentWord) {
        scrambled = scrambleWord(currentWord);
    }
    
    scrambledWordElement.textContent = scrambled;
    hintText.textContent = '';
    messageElement.textContent = '';
    userInput.value = '';
    hintsUsed = 0;
}

// Function to start a new level
function startNewLevel() {
    wordsCompleted = 0;
    updateProgressBar();
    getRandomWord();
}

// Function to update progress bar
function updateProgressBar() {
    const progress = (wordsCompleted / wordsByLevel[currentLevel].length) * 100;
    levelProgress.style.width = `${progress}%`;
}

// Check answer function
function checkAnswer() {
    const userGuess = userInput.value.toUpperCase();
    
    if (userGuess === currentWord) {
        messageElement.textContent = 'Correct! Well done!';
        messageElement.style.color = '#00ff87';
        scrambledWordElement.classList.add('correct-answer');
        
        // Calculate points based on difficulty and hints used
        let pointsEarned = 10 * currentLevel;
        if (hintsUsed === 0) {
            pointsEarned *= 1;
        } else if (hintsUsed === 1) {
            pointsEarned *= 0.5;
        } else {
            pointsEarned *= 0.2;
        }
        
        points += Math.floor(pointsEarned);
        pointsElement.textContent = points;
        wordsCompleted++;
        updateProgressBar();
        
        // Check if level is complete
        if (wordsCompleted === wordsByLevel[currentLevel].length) {
            if (currentLevel < 3) {
                setTimeout(() => {
                    messageElement.textContent = `Level ${currentLevel} Complete! Moving to next level!`;
                    currentLevel++;
                    currentLevelElement.textContent = currentLevel;
                    startNewLevel();
                }, 1500);
            } else {
                messageElement.textContent = 'Congratulations! You\'ve completed all levels!';
                setTimeout(() => {
                    levelSelection.style.display = 'block';
                    gameContainer.style.display = 'none';
                    points = 0;
                    pointsElement.textContent = points;
                }, 2000);
            }
        } else {
            setTimeout(() => {
                getRandomWord();
            }, 1000);
        }
        
        setTimeout(() => {
            scrambledWordElement.classList.remove('correct-answer');
        }, 1000);
    } else {
        messageElement.textContent = 'Try again!';
        messageElement.style.color = '#ff6b6b';
        scrambledWordElement.classList.add('wrong-answer');
        setTimeout(() => {
            scrambledWordElement.classList.remove('wrong-answer');
        }, 500);
    }
}

// Event listeners
checkButton.addEventListener('click', () => {
    checkAnswer();
});

hintButton.addEventListener('click', () => {
    hintsUsed++;
    hintText.textContent = `Hint: ${currentHint}`;
});

nextButton.addEventListener('click', () => {
    if (wordsCompleted < wordsByLevel[currentLevel].length) {
        getRandomWord();
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Initialize the game
startNewLevel(); 