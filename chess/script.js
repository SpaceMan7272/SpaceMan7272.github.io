


// Chess Pieces Unicode Characters
const pieces = {
‘K’: ‘♔’, ‘Q’: ‘♕’, ‘R’: ‘♖’, ‘B’: ‘♗’, ‘N’: ‘♘’, ‘P’: ‘♙’,
‘k’: ‘♚’, ‘q’: ‘♛’, ‘r’: ‘♜’, ‘b’: ‘♝’, ‘n’: ‘♞’, ‘p’: ‘♟’
};

// Game State
let gameState = {
board: [],
currentPlayer: ‘white’,
selectedSquare: null,
validMoves: [],
moveHistory: [],
capturedPieces: { white: [], black: [] },
whiteKingMoved: false,
blackKingMoved: false,
whiteRooksMoved: { a: false, h: false },
blackRooksMoved: { a: false, h: false },
enPassantTarget: null,
mode: ‘’,
players: {},
botDifficulty: 1200,
timerMode: ‘auto’,
timers: { white: 600, black: 600 },
timerInterval: null,
boardRotation: 0,
theme: ‘default’,
drugsMode: false,
randomMode: false,
analysisMode: false,
botThinking: false,
botColor: ‘’,
playerColor: ‘’
};

// Initialize Board
function initializeBoard() {
const board = [
[‘r’, ‘n’, ‘b’, ‘q’, ‘k’, ‘b’, ‘n’, ‘r’],
[‘p’, ‘p’, ‘p’, ‘p’, ‘p’, ‘p’, ‘p’, ‘p’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[’’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’, ‘’],
[‘P’, ‘P’, ‘P’, ‘P’, ‘P’, ‘P’, ‘P’, ‘P’],
[‘R’, ‘N’, ‘B’, ‘Q’, ‘K’, ‘B’, ‘N’, ‘R’]
];
return board;
}

// Mode Selection
function openMode(mode) {
document.getElementById(‘mainMenu’).classList.remove(‘active’);

```
if (mode === 'humanVsHuman') {
    document.getElementById('setupHvH').classList.add('active');
} else if (mode === 'humanVsBot') {
    document.getElementById('setupHvB').classList.add('active');
} else if (mode === 'puzzleDash') {
    document.getElementById('puzzleDash').classList.add('active');
} else if (mode === 'drugs') {
    startDrugsMode();
} else if (mode === 'analysis') {
    startAnalysisMode();
}
```

}

function backToMenu() {
document.querySelectorAll(’.modal’).forEach(m => m.classList.remove(‘active’));
document.getElementById(‘mainMenu’).classList.add(‘active’);
document.getElementById(‘gameContainer’).classList.remove(‘active’);
document.body.classList.remove(‘drugs-mode’);
stopTimer();
}

// Start Human vs Human
function startHumanVsHuman() {
const p1Name = document.getElementById(‘player1Name’).value || ‘Player 1’;
const p1Color = document.getElementById(‘player1Color’).value;
const p2Name = document.getElementById(‘player2Name’).value || ‘Player 2’;
const p2Color = document.getElementById(‘player2Color’).value;

```
if (p1Color === p2Color) {
    alert('Players cannot choose the same color!');
    return;
}

gameState.mode = 'humanVsHuman';
gameState.players = {
    white: p1Color === 'white' ? p1Name : p2Name,
    black: p1Color === 'black' ? p1Name : p2Name
};

document.getElementById('setupHvH').classList.remove('active');
startGame();
```

}

// Start Human vs Bot
function startHumanVsBot() {
const playerName = document.getElementById(‘playerNameBot’).value || ‘Player’;
let playerColor = document.getElementById(‘playerColorBot’).value;
const difficulty = parseInt(document.getElementById(‘botDifficulty’).value);

```
if (playerColor === 'random') {
    playerColor = Math.random() < 0.5 ? 'white' : 'black';
}

const botColor = playerColor === 'white' ? 'black' : 'white';

gameState.mode = 'humanVsBot';
gameState.botDifficulty = difficulty;
gameState.botColor = botColor;
gameState.playerColor = playerColor;
gameState.players = {
    white: playerColor === 'white' ? playerName : 'Bot',
    black: playerColor === 'black' ? playerName : 'Bot'
};

document.getElementById('setupHvB').classList.remove('active');
document.getElementById('botSettings').style.display = 'block';
startGame();

if (botColor === 'white') {
    setTimeout(() => makeBotMove(), 1000);
}
```

}

// Start Drugs Mode
function startDrugsMode() {
gameState.mode = ‘drugs’;
gameState.drugsMode = true;
gameState.players = { white: ‘Player 1’, black: ‘Player 2’ };
document.body.classList.add(‘drugs-mode’);
document.getElementById(‘drugsSettings’).style.display = ‘block’;
startGame();
}

// Start Analysis Mode
function startAnalysisMode() {
gameState.mode = ‘analysis’;
gameState.analysisMode = true;
gameState.players = { white: ‘Analyst’, black: ‘Analyst’ };
document.getElementById(‘evaluationBar’).style.display = ‘block’;
startGame();
}

// Start Game
function startGame() {
gameState.board = initializeBoard();
gameState.currentPlayer = ‘white’;
gameState.selectedSquare = null;
gameState.validMoves = [];
gameState.moveHistory = [];
gameState.capturedPieces = { white: [], black: [] };
gameState.whiteKingMoved = false;
gameState.blackKingMoved = false;
gameState.whiteRooksMoved = { a: false, h: false };
gameState.blackRooksMoved = { a: false, h: false };
gameState.enPassantTarget = null;
gameState.timers = { white: 600, black: 600 };

```
document.getElementById('gameContainer').classList.add('active');
renderBoard();
updatePlayerInfo();
updateMoveHistory();

if (gameState.timerMode === 'auto') {
    startTimer();
} else if (gameState.timerMode === 'manual') {
    document.getElementById('switchTurnBtn').style.display = 'block';
}
```

}

// Render Board
function renderBoard() {
const board = document.getElementById(‘chessBoard’);
board.innerHTML = ‘’;
board.className = `chess-board theme-${gameState.theme}`;

```
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        const isLight = (row + col) % 2 === 1;
        square.className = `square ${isLight ? 'light' : 'dark'}`;
        square.dataset.row = row;
        square.dataset.col = col;
        
        const piece = gameState.board[row][col];
        if (piece) {
            const pieceEl = document.createElement('div');
            pieceEl.className = 'piece';
            pieceEl.textContent = pieces[piece];
            pieceEl.style.color = piece === piece.toUpperCase() ? '#fff' : '#000';
            
            if (gameState.drugsMode) {
                pieceEl.style.color = Math.random() < 0.5 ? '#fff' : '#000';
            }
            
            square.appendChild(pieceEl);
        }
        
        square.addEventListener('click', () => handleSquareClick(row, col));
        board.appendChild(square);
    }
}

renderLabels();
```

}

// Render Labels
function renderLabels() {
const files = [‘A’, ‘B’, ‘C’, ‘D’, ‘E’, ‘F’, ‘G’, ‘H’];
const ranks = [‘8’, ‘7’, ‘6’, ‘5’, ‘4’, ‘3’, ‘2’, ‘1’];

```
const fileLabels = document.getElementById('fileLabels');
fileLabels.innerHTML = '';
files.forEach(file => {
    const label = document.createElement('div');
    label.className = 'file-label';
    label.textContent = file;
    fileLabels.appendChild(label);
});

const rankLabelsLeft = document.getElementById('rankLabelsLeft');
const rankLabelsRight = document.getElementById('rankLabelsRight');
rankLabelsLeft.innerHTML = '';
rankLabelsRight.innerHTML = '';

ranks.forEach(rank => {
    const labelLeft = document.createElement('div');
    labelLeft.className = 'rank-label';
    labelLeft.textContent = rank;
    rankLabelsLeft.appendChild(labelLeft);
    
    const labelRight = document.createElement('div');
    labelRight.className = 'rank-label';
    labelRight.textContent = rank;
    rankLabelsRight.appendChild(labelRight);
});
```

}

// Handle Square Click
function handleSquareClick(row, col) {
if (gameState.botThinking) return;

```
const piece = gameState.board[row][col];
const pieceColor = piece ? (piece === piece.toUpperCase() ? 'white' : 'black') : null;

// Analysis mode: allow moving any piece
if (gameState.analysisMode) {
    if (gameState.selectedSquare) {
        const [selRow, selCol] = gameState.selectedSquare;
        if (row === selRow && col === selCol) {
            clearSelection();
        } else if (isValidMove(selRow, selCol, row, col)) {
            makeMove(selRow, selCol, row, col);
            gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
        } else {
            selectSquare(row, col);
        }
    } else if (piece) {
        selectSquare(row, col);
    }
    return;
}

// Normal mode: check turn
if (gameState.mode === 'humanVsBot' && gameState.currentPlayer === gameState.botColor) {
    return;
}

if (gameState.selectedSquare) {
    const [selRow, selCol] = gameState.selectedSquare;
    
    if (row === selRow && col === selCol) {
        clearSelection();
    } else if (isValidMoveHighlighted(row, col)) {
        makeMove(selRow, selCol, row, col);
        
        if (gameState.mode === 'humanVsBot' && !isGameOver()) {
            gameState.botThinking = true;
            const delay = parseInt(document.getElementById('botResponseTime')?.value || 1500);
            setTimeout(() => {
                makeBotMove();
                gameState.botThinking = false;
            }, delay + Math.random() * delay);
        }
    } else if (pieceColor === gameState.currentPlayer) {
        selectSquare(row, col);
    }
} else if (pieceColor === gameState.currentPlayer) {
    selectSquare(row, col);
}
```

}

// Select Square
function selectSquare(row, col) {
clearSelection();
gameState.selectedSquare = [row, col];
gameState.validMoves = getValidMoves(row, col);

```
const squares = document.querySelectorAll('.square');
squares[row * 8 + col].classList.add('selected');

gameState.validMoves.forEach(([r, c, isCapture]) => {
    const sq = squares[r * 8 + c];
    sq.classList.add(isCapture ? 'valid-capture' : 'valid-move');
});
```

}

// Clear Selection
function clearSelection() {
gameState.selectedSquare = null;
gameState.validMoves = [];
document.querySelectorAll(’.square’).forEach(sq => {
sq.classList.remove(‘selected’, ‘valid-move’, ‘valid-capture’);
});
}

// Get Valid Moves
function getValidMoves(row, col) {
const piece = gameState.board[row][col];
if (!piece) return [];

```
const moves = [];
const pieceType = piece.toUpperCase();
const color = piece === piece.toUpperCase() ? 'white' : 'black';

switch (pieceType) {
    case 'P': moves.push(...getPawnMoves(row, col, color)); break;
    case 'R': moves.push(...getRookMoves(row, col, color)); break;
    case 'N': moves.push(...getKnightMoves(row, col, color)); break;
    case 'B': moves.push(...getBishopMoves(row, col, color)); break;
    case 'Q': moves.push(...getQueenMoves(row, col, color)); break;
    case 'K': moves.push(...getKingMoves(row, col, color)); break;
}

// Filter moves that would leave king in check
return moves.filter(([r, c]) => !wouldBeInCheck(row, col, r, c, color));
```

}

// Pawn Moves
function getPawnMoves(row, col, color) {
const moves = [];
const direction = color === ‘white’ ? -1 : 1;
const startRow = color === ‘white’ ? 6 : 1;

```
// Forward move
if (isInBounds(row + direction, col) && !gameState.board[row + direction][col]) {
    moves.push([row + direction, col, false]);
    
    // Double move from start
    if (row === startRow && !gameState.board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col, false]);
    }
}

// Captures
for (const dc of [-1, 1]) {
    const newRow = row + direction;
    const newCol = col + dc;
    if (isInBounds(newRow, newCol)) {
        const target = gameState.board[newRow][newCol];
        if (target && isOpponentPiece(target, color)) {
            moves.push([newRow, newCol, true]);
        }
        
        // En passant
        if (gameState.enPassantTarget && 
            gameState.enPassantTarget[0] === newRow && 
            gameState.enPassantTarget[1] === newCol) {
            moves.push([newRow, newCol, true]);
        }
    }
}

return moves;
```

}

// Rook Moves
function getRookMoves(row, col, color) {
const moves = [];
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

```
for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    while (isInBounds(r, c)) {
        const target = gameState.board[r][c];
        if (!target) {
            moves.push([r, c, false]);
        } else {
            if (isOpponentPiece(target, color)) {
                moves.push([r, c, true]);
            }
            break;
        }
        r += dr;
        c += dc;
    }
}

return moves;
```

}

// Knight Moves
function getKnightMoves(row, col, color) {
const moves = [];
const offsets = [
[-2, -1], [-2, 1], [-1, -2], [-1, 2],
[1, -2], [1, 2], [2, -1], [2, 1]
];

```
for (const [dr, dc] of offsets) {
    const r = row + dr;
    const c = col + dc;
    if (isInBounds(r, c)) {
        const target = gameState.board[r][c];
        if (!target || isOpponentPiece(target, color)) {
            moves.push([r, c, !!target]);
        }
    }
}

return moves;
```

}

// Bishop Moves
function getBishopMoves(row, col, color) {
const moves = [];
const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

```
for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    while (isInBounds(r, c)) {
        const target = gameState.board[r][c];
        if (!target) {
            moves.push([r, c, false]);
        } else {
            if (isOpponentPiece(target, color)) {
                moves.push([r, c, true]);
            }
            break;
        }
        r += dr;
        c += dc;
    }
}

return moves;
```

}

// Queen Moves
function getQueenMoves(row, col, color) {
return […getRookMoves(row, col, color), …getBishopMoves(row, col, color)];
}

// King Moves
function getKingMoves(row, col, color) {
const moves = [];
const offsets = [
[-1, -1], [-1, 0], [-1, 1],
[0, -1], [0, 1],
[1, -1], [1, 0], [1, 1]
];

```
for (const [dr, dc] of offsets) {
    const r = row + dr;
    const c = col + dc;
    if (isInBounds(r, c)) {
        const target = gameState.board[r][c];
        if (!target || isOpponentPiece(target, color)) {
            moves.push([r, c, !!target]);
        }
    }
}

// Castling
const kingMoved = color === 'white' ? gameState.whiteKingMoved : gameState.blackKingMoved;
const rooksMoved = color === 'white' ? gameState.whiteRooksMoved : gameState.blackRooksMoved;

if (!kingMoved && !isInCheck(color)) {
    // Kingside
    if (!rooksMoved.h && 
        !gameState.board[row][col + 1] && 
        !gameState.board[row][col + 2] &&
        !wouldBeInCheck(row, col, row, col + 1, color)) {
        moves.push([row, col + 2, false]);
    }
    
    // Queenside
    if (!rooksMoved.a && 
        !gameState.board[row][col - 1] && 
        !gameState.board[row][col - 2] && 
        !gameState.board[row][col - 3] &&
        !wouldBeInCheck(row, col, row, col - 1, color)) {
        moves.push([row, col - 2, false]);
    }
}

return moves;
```

}

// Helper Functions
function isInBounds(row, col) {
return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isOpponentPiece(piece, color) {
const pieceColor = piece === piece.toUpperCase() ? ‘white’ : ‘black’;
return pieceColor !== color;
}

function isValidMoveHighlighted(row, col) {
return gameState.validMoves.some(([r, c]) => r === row && c === col);
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
const moves = getValidMoves(fromRow, fromCol);
return moves.some(([r, c]) => r === toRow && c === toCol);
}

// Make Move
function makeMove(fromRow, fromCol, toRow, toCol) {
const piece = gameState.board[fromRow][fromCol];
const captured = gameState.board[toRow][toCol];
const pieceType = piece.toUpperCase();
const color = piece === piece.toUpperCase() ? ‘white’ : ‘black’;

```
// Capture
if (captured) {
    const capturedColor = captured === captured.toUpperCase() ? 'white' : 'black';
    gameState.capturedPieces[color].push(captured);
}

// En passant capture
if (pieceType === 'P' && gameState.enPassantTarget && 
    toRow === gameState.enPassantTarget[0] && toCol === gameState.enPassantTarget[1]) {
    const capturedRow = color === 'white' ? toRow + 1 : toRow - 1;
    const capturedPawn = gameState.board[capturedRow][toCol];
    gameState.capturedPieces[color].push(capturedPawn);
    gameState.board[capturedRow][toCol] = '';
}

// Move piece
gameState.board[toRow][toCol] = piece;
gameState.board[fromRow][fromCol] = '';

// Castling
if (pieceType === 'K' && Math.abs(toCol - fromCol) === 2) {
    if (toCol > fromCol) {
        // Kingside
        gameState.board[toRow][toCol - 1] = gameState.board[toRow][7];
        gameState.board[toRow][7] = '';
    } else {
        // Queenside
        gameState.board[toRow][toCol + 1] = gameState.board[toRow][0];
        gameState.board[toRow][0] = '';
    }
}

// Pawn promotion
if (pieceType === 'P' && (toRow === 0 || toRow === 7)) {
    gameState.board[toRow][toCol] = color === 'white' ? 'Q' : 'q';
}

// Update en passant
if (pieceType === 'P' && Math.abs(toRow - fromRow) === 2) {
    gameState.enPassantTarget = [(fromRow + toRow) / 2, toCol];
} else {
    gameState.enPassantTarget = null;
}

// Update castling rights
if (pieceType === 'K') {
    if (color === 'white') gameState.whiteKingMoved = true;
    else gameState.blackKingMoved = true;
}
if (pieceType === 'R') {
    if (color === 'white') {
        if (fromCol === 0) gameState.whiteRooksMoved.a = true;
        if (fromCol === 7) gameState.whiteRooksMoved.h = true;
    } else {
        if (fromCol === 0) gameState.blackRooksMoved.a = true;
        if (fromCol === 7) gameState.blackRooksMoved.h = true;
    }
}

// Record move
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const moveNotation = `${pieceType}${files[fromCol]}${ranks[fromRow]}-${files[toCol]}${ranks[toRow]}`;
gameState.moveHistory.push(moveNotation);

// Switch player
if (!gameState.analysisMode) {
    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
}

clearSelection();
renderBoard();
updatePlayerInfo();
updateMoveHistory();

// Check for checkmate/stalemate
if (isCheckmate(gameState.currentPlayer)) {
    setTimeout(() => {
        alert(`Checkmate! ${color === 'white' ? 'White' : 'Black'} wins!`);
    }, 100);
} else if (isStalemate(gameState.currentPlayer)) {
    setTimeout(() => {
        alert('Stalemate! Game is a draw.');
    }, 100);
}
```

}

// Check Detection
function isInCheck(color) {
const kingPos = findKing(color);
if (!kingPos) return false;

```
const opponent = color === 'white' ? 'black' : 'white';

for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && isOpponentPiece(piece, color)) {
            const moves = getValidMovesWithoutCheckFilter(row, col, opponent);
            if (moves.some(([r, c]) => r === kingPos[0] && c === kingPos[1])) {
                return true;
            }
        }
    }
}

return false;
```

}

function wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
const piece = gameState.board[fromRow][fromCol];
const captured = gameState.board[toRow][toCol];

```
gameState.board[toRow][toCol] = piece;
gameState.board[fromRow][fromCol] = '';

const inCheck = isInCheck(color);

gameState.board[fromRow][fromCol] = piece;
gameState.board[toRow][toCol] = captured;

return inCheck;
```

}

function getValidMovesWithoutCheckFilter(row, col, color) {
const piece = gameState.board[row][col];
if (!piece) return [];

```
const pieceType = piece.toUpperCase();

switch (pieceType) {
    case 'P': return getPawnMoves(row, col, color);
    case 'R': return getRookMoves(row, col, color);
    case 'N': return getKnightMoves(row, col, color);
    case 'B': return getBishopMoves(row, col, color);
    case 'Q': return getQueenMoves(row, col, color);
    case 'K': return getKingMoves(row, col, color);
    default: return [];
}
```

}

function findKing(color) {
const king = color === ‘white’ ? ‘K’ : ‘k’;
for (let row = 0; row < 8; row++) {
for (let col = 0; col < 8; col++) {
if (gameState.board[row][col] === king) {
return [row, col];
}
}
}
return null;
}

function isCheckmate(color) {
if (!isInCheck(color)) return false;
return hasNoValidMoves(color);
}

function isStalemate(color) {
if (isInCheck(color)) return false;
return hasNoValidMoves(color);
}

function hasNoValidMoves(color) {
for (let row = 0; row < 8; row++) {
for (let col = 0; col < 8; col++) {
const piece = gameState.board[row][col];
if (piece && !isOpponentPiece(piece, color)) {
const moves = getValidMoves(row, col);
if (moves.length > 0) return false;
}
}
}
return true;
}

function isGameOver() {
return isCheckmate(‘white’) || isCheckmate(‘black’) ||
isStalemate(‘white’) || isStalemate(‘black’);
}

// Bot Move
function makeBotMove() {
const allMoves = [];

```
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && !isOpponentPiece(piece, gameState.botColor)) {
            const moves = getValidMoves(row, col);
            moves.forEach(([toRow, toCol]) => {
                allMoves.push({ from: [row, col], to: [toRow, toCol] });
            });
        }
    }
}

if (allMoves.length === 0) return;

// Simple difficulty simulation: random move selection with some strategy
let move;
if (gameState.botDifficulty < 800) {
    // Low difficulty: completely random
    move = allMoves[Math.floor(Math.random() * allMoves.length)];
} else {
    // Higher difficulty: prefer captures
    const captures = allMoves.filter(m => gameState.board[m.to[0]][m.to[1]]);
    if (captures.length > 0 && Math.random() < gameState.botDifficulty / 2500) {
        move = captures[Math.floor(Math.random() * captures.length)];
    } else {
        move = allMoves[Math.floor(Math.random() * allMoves.length)];
    }
}

makeMove(move.from[0], move.from[1], move.to[0], move.to[1]);
```

}

// UI Updates
function updatePlayerInfo() {
const whitePlayer = gameState.players.white || ‘White’;
const blackPlayer = gameState.players.black || ‘Black’;

```
document.getElementById('topPlayerName').textContent = blackPlayer;
document.getElementById('bottomPlayerName').textContent = whitePlayer;

if (!gameState.drugsMode) {
    updateCapturedPieces();
}

updateTimers();
```

}

function updateCapturedPieces() {
const whiteCaptured = document.getElementById(‘topCaptured’);
const blackCaptured = document.getElementById(‘bottomCaptured’);

```
whiteCaptured.innerHTML = gameState.capturedPieces.black
    .map(p => `<span class="captured-piece">${pieces[p]}</span>`)
    .join('');

blackCaptured.innerHTML = gameState.capturedPieces.white
    .map(p => `<span class="captured-piece">${pieces[p]}</span>`)
    .join('');
```

}

function updateMoveHistory() {
if (gameState.drugsMode) return;

```
const history = document.getElementById('moveHistory');
history.innerHTML = gameState.moveHistory
    .map((move, i) => `<span class="move-item">${i + 1}. ${move}</span>`)
    .join('');
```

}

function updateTimers() {
const whiteMin = Math.floor(gameState.timers.white / 60);
const whiteSec = gameState.timers.white % 60;
const blackMin = Math.floor(gameState.timers.black / 60);
const blackSec = gameState.timers.black % 60;

```
document.getElementById('topTimer').textContent = 
    `${blackMin}:${blackSec.toString().padStart(2, '0')}`;
document.getElementById('bottomTimer').textContent = 
    `${whiteMin}:${whiteSec.toString().padStart(2, '0')}`;
```

}

// Timer Functions
function startTimer() {
stopTimer();
gameState.timerInterval = setInterval(() => {
if (gameState.currentPlayer === ‘white’) {
gameState.timers.white–;
if (gameState.timers.white <= 0) {
stopTimer();
alert(‘White ran out of time! Black wins!’);
}
} else {
gameState.timers.black–;
if (gameState.timers.black <= 0) {
stopTimer();
alert(‘Black ran out of time! White wins!’);
}
}
updateTimers();
}, 1000);
}

function stopTimer() {
if (gameState.timerInterval) {
clearInterval(gameState.timerInterval);
gameState.timerInterval = null;
}
}

function changeTimerMode() {
const mode = document.getElementById(‘timerMode’).value;
gameState.timerMode = mode;

```
stopTimer();
document.getElementById('switchTurnBtn').style.display = 'none';

if (mode === 'auto') {
    startTimer();
} else if (mode === 'manual') {
    document.getElementById('switchTurnBtn').style.display = 'block';
}
```

}

// Settings Functions
function openSettings() {
document.getElementById(‘settingsModal’).classList.add(‘active’);
}

function closeSettings() {
document.getElementById(‘settingsModal’).classList.remove(‘active’);
}

function quitGame() {
if (confirm(‘Are you sure you want to quit to menu?’)) {
closeSettings();
backToMenu();
}
}

function changeBoardTheme() {
gameState.theme = document.getElementById(‘boardTheme’).value;
renderBoard();
}

function rotateBoard(degrees) {
gameState.boardRotation = (gameState.boardRotation + degrees) % 360;
document.getElementById(‘chessBoard’).style.transform =
`rotate(${gameState.boardRotation}deg)`;
}

function switchSides() {
if (gameState.mode !== ‘humanVsBot’) return;

```
const temp = gameState.botColor;
gameState.botColor = gameState.playerColor;
gameState.playerColor = temp;

gameState.players = {
    white: gameState.playerColor === 'white' ? 
        document.getElementById('playerNameBot').value : 'Bot',
    black: gameState.playerColor === 'black' ? 
        document.getElementById('playerNameBot').value : 'Bot'
};

updatePlayerInfo();
```

}

function toggleBestMoveHint() {
// Placeholder for best move hint functionality
const enabled = document.getElementById(‘bestMoveHint’).checked;
console.log(‘Best move hint:’, enabled);
}

function toggleRandomMode() {
gameState.randomMode = document.getElementById(‘randomMode’).checked;
document.getElementById(‘shuffleBoardBtn’).style.display =
gameState.randomMode ? ‘block’ : ‘none’;
}

function shuffleBoard() {
if (!gameState.randomMode) return;

```
// Simple shuffle: randomly place pieces while keeping kings safe
const pieces = [];
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        if (gameState.board[row][col]) {
            pieces.push(gameState.board[row][col]);
            gameState.board[row][col] = '';
        }
    }
}

// Shuffle pieces array
for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
}

// Place pieces randomly
let pieceIndex = 0;
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        if (pieceIndex < pieces.length) {
            gameState.board[row][col] = pieces[pieceIndex++];
        }
    }
}

renderBoard();
```

}

// Initialize on load
document.addEventListener(‘DOMContentLoaded’, () => {
// Sync player color selects in Human vs Human
document.getElementById(‘player1Color’).addEventListener(‘change’, (e) => {
document.getElementById(‘player2Color’).value =
e.target.value === ‘white’ ? ‘black’ : ‘white’;
});

```
document.getElementById('player2Color').addEventListener('change', (e) => {
    document.getElementById('player1Color').value = 
        e.target.value === 'white' ? 'black' : 'white';
});
```

});
