const createBoard = (() => {
  let board = [];
  const gameboard = document.querySelector(".gameboard");
  for (let i = 0; i < 3; i++) {
    let row = document.createElement("div");
    row.classList = "row";
    row.id = i + 1;
    gameboard.appendChild(row);

    for (let j = 0; j < 3; j++) {
      board.push("");
      let cell = document.createElement("div");
      cell.classList = "cell";
      cell.id = 3 * i + (j + 1);
      row.appendChild(cell);
    }
  }

  const getBoard = () => board;

  const clearBoard = () => {
    console.log("clear");
    const squares = document.querySelectorAll(".cell");
    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = "";
      board[i] = "";
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
  const player2 = Player("O", "Player 2");
  let player1turn = true;

  const gameLogic = () => {
    const cells = document.querySelectorAll(".cell");
    shape = player1.getShape();
    cells.forEach((cell) =>
      cell.addEventListener("click", () => {
        // Check if the cell is open and don't allow more moves if a winner
        if (legalMove(cell.id - 1) && !checkWinner(shape)) {
          // Alternate turns
          player1turn = decideTurn(player1turn);
          if (!player1turn) {
            shape = player1.getShape();
          } else {
            shape = player2.getShape();
          }
          // Draw the correct shape on the board
          markBoard(cell, shape, cell.id - 1);
          // Check for a winner
          if (checkWinner(shape)) {
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

  const legalMove = (index) => {
    if (createBoard.getBoard()[index] == "") {
      return true;
    } else {
      console.log("Not a legal move");
      return false;
    }
  };

  const markBoard = (cell, shape, index) => {
    cell.textContent = shape;
    createBoard.getBoard()[index] = shape;
    console.log(createBoard.getBoard());
  };

  // Checks whose turn it is
  const decideTurn = (player1turn) => {
    return !player1turn;
  };

  const checkWinner = (shape) => {
    // top row
    if (
      createBoard.getBoard()[0] == shape &&
      createBoard.getBoard()[1] == shape &&
      createBoard.getBoard()[2] == shape
    ) {
      return true;
    }
    // middle row
    else if (
      createBoard.getBoard()[3] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[5] == shape
    ) {
      return true;
    }
    // bottom row
    else if (
      createBoard.getBoard()[6] == shape &&
      createBoard.getBoard()[7] == shape &&
      createBoard.getBoard()[8] == shape
    ) {
      return true;
    }

    // first column
    else if (
      createBoard.getBoard()[0] == shape &&
      createBoard.getBoard()[3] == shape &&
      createBoard.getBoard()[6] == shape
    ) {
      return true;
    }
    // second column
    else if (
      createBoard.getBoard()[1] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[7] == shape
    ) {
      return true;
    }
    // third column
    else if (
      createBoard.getBoard()[2] == shape &&
      createBoard.getBoard()[5] == shape &&
      createBoard.getBoard()[8] == shape
    ) {
      return true;
    }

    // diagonal (top left - bottom right)
    else if (
      createBoard.getBoard()[0] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[8] == shape
    ) {
      return true;
    }
    // diagonal (top right - bottom left)
    else if (
      createBoard.getBoard()[2] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[6] == shape
    ) {
      return true;
    }
    return false;
  };

  return { player1, player2, gameLogic };
})();

gameController.gameLogic();
