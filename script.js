const createBoard = (() => {
  let board = [];
  const gameboard = document.querySelector(".gameboard");
  for (let i = 0; i < 3; i++) {
    let row = document.createElement("div");
    row.classList = `row row${i + 1}`;
    row.id = i + 1;
    gameboard.appendChild(row);

    for (let j = 0; j < 3; j++) {
      board.push("");
      let cell = document.createElement("div");
      cell.classList = `cell col${j + 1} cell${j + 1 + i * 3}`;
      cell.id = 3 * i + (j + 1);
      row.appendChild(cell);
    }
  }

  const getBoard = () => board;

  const clearBoard = () => {
    const squares = document.querySelectorAll(".cell");
    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = "";
      board[i] = i;
    }
    const message = document.querySelector(".message");
    const newGameBtn = document.querySelector(".new-game");
    message.textContent = "";
    newGameBtn.style.display = "none";
  };

  return { getBoard, clearBoard };
})();

const Player = (shape, name) => {
  const getShape = () => shape;
  const getName = () => name;
  return { getShape, getName };
};

const gameController = (() => {
  const player1 = Player("X", "Player 1");
  let player1turn = true;
  let player2 = Player("O", "Player 2");

  // Sets the player 2 name as a computer if you choose to play against one
  const gameLogic = (computer) => {
    if (computer) {
      player2 = Player("O", "Computer");
    } else {
      player2 = Player("O", "Player 2");
    }

    const cells = document.querySelectorAll(".cell");
    shape = player1.getShape();
    cells.forEach((cell) =>
      cell.addEventListener("click", () => {
        // Check if the cell is open and don't allow more moves if a winner
        if (
          legalMove(cell.id - 1) &&
          !checkWinner(createBoard.getBoard(), shape)
        ) {
          // Alternate turns
          player1turn = decideTurn(player1turn);
          if (!player1turn) {
            shape = player1.getShape();
            // Draw the correct shape on the board
            markBoard(cell, shape, cell.id - 1);
            // Only player1 picks if playing against a computer
            if (computer && !checkWinner(createBoard.getBoard(), shape)) {
              shape = player2.getShape();
              // Choose the computer spot using minimax algorithm
              let bestSpot = minimax(createBoard.getBoard(), shape);
              let computerCell = document.querySelector(
                `.cell${bestSpot.index + 1}`
              );
              markBoard(computerCell, shape, bestSpot.index);
              player1turn = decideTurn(player1turn);
            }
          } else {
            shape = player2.getShape();
            // Draw the correct shape on the board
            markBoard(cell, shape, cell.id - 1);
          }
          // Check for a winner
          if (checkWinner(createBoard.getBoard(), shape)) {
            const message = document.querySelector(".message");
            if (!player1turn) {
              message.textContent = `${player1.getName()} is the winner`;
            } else {
              message.textContent = `${player2.getName()} is the winner`;
            }
            const newGameBtn = document.querySelector(".new-game");
            newGameBtn.style.display = "flex";
            newGameBtn.addEventListener("click", () => {
              createBoard.clearBoard();
              player1turn = true;
            });
          }
        }
      })
    );
  };

  const minimax = (newBoard, player) => {
    //available spots
    let availSpots = emptyIndexies(newBoard);

    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(newBoard, player1.getShape())) {
      return { score: -10 };
    } else if (winning(newBoard, player2.getShape())) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    // an array to collect all the objects
    let moves = [];

    // loop through available spots
    for (let i = 0; i < availSpots.length; i++) {
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      let move = {};
      move.index = newBoard[availSpots[i]];

      // set the empty spot to the current player
      newBoard[availSpots[i]] = player;

      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == player2.getShape()) {
        var result = minimax(newBoard, player1.getShape());
        move.score = result.score;
      } else {
        var result = minimax(newBoard, player2.getShape());
        move.score = result.score;
      }

      //reset the spot to empty
      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove;
    if (player === player2.getShape()) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // else loop over the moves and choose the move with the lowest score
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  // returns the available spots on the board
  const emptyIndexies = (board) => {
    return board.filter((s) => s != "O" && s != "X");
  };

  // winning check for the computer simulations (doesn't check ties here)
  function winning(board, player) {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Checks if there is a shape in that square
  const legalMove = (index) => {
    if (createBoard.getBoard()[index] == index) {
      return true;
    } else {
      return false;
    }
  };

  // Marks the board with an image at the specified location
  const markBoard = (cell, shape, index) => {
    if (shape == "X") {
      cell.innerHTML = "<img src='barbell_x.png'>";
    } else {
      cell.innerHTML = "<img src='Barbell-standard copy.png'>";
    }
    createBoard.getBoard()[index] = shape;
  };

  // Checks whose turn it is
  const decideTurn = (player1turn) => {
    const displayTurn = document.querySelector(".turn");
    if (player1turn) {
      displayTurn.textContent = "Player 2's turn";
    } else {
      displayTurn.textContent = "Player 1's turn";
    }
    return !player1turn;
  };

  // Checks winners and puts up a new game button if there is a tie
  const checkWinner = (board, shape) => {
    // top row
    if (board[0] == shape && board[1] == shape && board[2] == shape) {
      return true;
    }
    // middle row
    else if (board[3] == shape && board[4] == shape && board[5] == shape) {
      return true;
    }
    // bottom row
    else if (board[6] == shape && board[7] == shape && board[8] == shape) {
      return true;
    }

    // first column
    else if (board[0] == shape && board[3] == shape && board[6] == shape) {
      return true;
    }
    // second column
    else if (board[1] == shape && board[4] == shape && board[7] == shape) {
      return true;
    }
    // third column
    else if (board[2] == shape && board[5] == shape && board[8] == shape) {
      return true;
    }

    // diagonal (top left - bottom right)
    else if (board[0] == shape && board[4] == shape && board[8] == shape) {
      return true;
    }
    // diagonal (top right - bottom left)
    else if (board[2] == shape && board[4] == shape && board[6] == shape) {
      return true;
    }

    // Checks for ties
    for (let i = 0; i < 9; i++) {
      if (board[i] == i) {
        return false;
      }
    }

    const message = document.querySelector(".message");
    message.textContent = "It's a tie";
    const newGameBtn = document.querySelector(".new-game");

    newGameBtn.style.display = "flex";
    newGameBtn.addEventListener("click", () => {
      createBoard.clearBoard();
      player1turn = true;
    });
    return false;
  };

  return { player1, gameLogic };
})();

const displayController = (() => {
  // Sets the game as either player vs player (pvp) or player vs computer (pvc)
  const toggleGameType = () => {
    const pvpBtn = document.querySelector("#pvp");
    const pvcBtn = document.querySelector("#pvc");
    pvpBtn.addEventListener("click", () => {
      // Clear the board if the game type changes
      if (pvpBtn.classList != "active") {
        createBoard.clearBoard();
      }
      pvpBtn.classList = "active";
      pvcBtn.classList = "";
      const allCells = document.querySelectorAll(".cell");
      // Remove the event listeners so toggling the game won't interfere
      for (let i = 0; i < allCells.length; i++) {
        let newElement = allCells[i].cloneNode(true);
        allCells[i].parentNode.replaceChild(newElement, allCells[i]);
      }
      gameController.gameLogic(false);
      const displayTurn = document.querySelector(".turn");
      displayTurn.textContent = "Player 1's turn";
    });
    pvcBtn.addEventListener("click", () => {
      // Clear the board if the game type changes
      if (pvcBtn.classList != "active") {
        createBoard.clearBoard();
      }
      pvcBtn.classList = "active";
      pvpBtn.classList = "";
      // Remove the event listeners so toggling the game won't interfere
      const allCells = document.querySelectorAll(".cell");
      for (let i = 0; i < allCells.length; i++) {
        let newElement = allCells[i].cloneNode(true);
        allCells[i].parentNode.replaceChild(newElement, allCells[i]);
      }
      gameController.gameLogic(true);
      const displayTurn = document.querySelector(".turn");
      displayTurn.textContent = "Player 1's turn";
    });
  };
  return { toggleGameType };
})();

displayController.toggleGameType();
