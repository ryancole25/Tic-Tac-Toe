// TODO
// Have game type determined by the PvP or PvC buttons
// Create computer logic to play against

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

  const gameLogic = (computer) => {
    if (computer) {
      player2 = Player("L", "Computer");
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
            if (computer) {
              // TODO put computer logic here
              shape = player2.getShape();
              // let comp_cell = document.querySelector(".cell2");
              computerLogic(createBoard.getBoard());
              // markBoard(comp_cell, shape, cell.id - 1);
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

  const computerLogic = (originalBoard) => {
    let bestSpot = minimax(originalBoard, player2.getShape());
    console.log("index: " + bestSpot.index);
  };

  const minimax = (newBoard, player) => {
    // console.log("newBoard");
    // console.log(newBoard);
    let availableSpots = emptyIndexes(newBoard);
    console.log("available Spots");
    console.log(availableSpots);

    console.log("here");
    if (checkWinner(newBoard, player1.getShape())) {
      console.log("-10");
      return { score: -10 };
    } else if (checkWinner(newBoard, player2.getShape())) {
      console.log("10");
      return { score: 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
      let move = {};
      move.index = newBoard[availableSpots[i]];

      newBoard[availableSpots[i]] = player;

      if (player == player2.getShape()) {
        let result = minimax(newBoard, player1.getShape());
        console.log(`Result 1 ${result.score}`);
        move.score = result.score;
      } else {
        let result = minimax(newBoard, player2.getShape());
        console.log(`Result 2 ${result.score}`);
        move.score = result.score;
      }

      newBoard[availableSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if (player == player2.getShape()) {
      let bestScore = -10000;
      for (let i = 0; i < moves.lenth; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
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

  const emptyIndexes = (board) => {
    return board.filter(
      (s) => s != player1.getShape() && s != player2.getShape()
    );
  };

  const legalMove = (index) => {
    if (createBoard.getBoard()[index] == index) {
      return true;
    } else {
      console.log("Not a legal move");
      return false;
    }
  };

  const markBoard = (cell, shape, index) => {
    if (shape == "X") {
      cell.innerHTML = "<img src='barbell_x.png'>";
    } else {
      cell.innerHTML = "<img src='barbell-standard copy.png'>";
    }
    createBoard.getBoard()[index] = shape;
    console.log(createBoard.getBoard());
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
      gameController.gameLogic(false);
      const displayTurn = document.querySelector(".turn");
      displayTurn.textContent = "Player 1's turn";
    });
    pvcBtn.addEventListener("click", () => {
      // Clear the board if the game type changes
      if (pvcBtn.classList != "active") {
        createBoard.clearBoard();
      }
      gameController.gameLogic(true);
      pvcBtn.classList = "active";
      pvpBtn.classList = "";
      const displayTurn = document.querySelector(".turn");
      displayTurn.textContent = "Player 1's turn";
    });
  };
  return { toggleGameType };
})();

displayController.toggleGameType();
