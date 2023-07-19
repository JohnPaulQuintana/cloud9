const express = require('express');
const app = express();
const path = require('path');
// const readline = require('readline-sync');

// Define the cases and their corresponding amounts
const cases = {};
for (let i = 1; i <= 20; i++) {
  cases[i] = i * 1000;
}

function getRandomCase() {
  const caseNumbers = Object.keys(cases).filter((caseNumber) => cases[caseNumber] !== null);
  const randomIndex = Math.floor(Math.random() * caseNumbers.length);
  const randomCaseNumber = caseNumbers[randomIndex];
  const amount = cases[randomCaseNumber];
  cases[randomCaseNumber] = null; // Mark the case as opened
  return { caseNumber: randomCaseNumber, amount };
}

function initializeGame() {
  // Reset cases for a new game
  for (let i = 1; i <= 20; i++) {
    cases[i] = i * 1000;
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control.html'));
});

app.get('/play', (req, res) => {
    initializeGame();
    const remainingCases = [];
    for (const [caseNumber, amount] of Object.entries(cases)) {
      if (amount !== null) {
        remainingCases.push({ caseNumber, amount });
      }
    }
    res.json(remainingCases);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
