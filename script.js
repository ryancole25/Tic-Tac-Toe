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

  return { getBoard };
})();

const Player = (shape) => {
  const getShape = () => shape;
  return { getShape };
};

const gameController = (() => {
  const player1 = Player("X");
  const player2 = Player("O");
  let player1turn = true;

  const gameLogic = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) =>
      cell.addEventListener("click", () => {
        // Check if the cell is open
        if (legalMove(cell.id - 1)) {
          // Alternate turns
          player1turn = decideTurn(player1turn);
          if (!player1turn) {
            shape = player1.getShape();
          } else {
            shape = player2.getShape();
          }
          // Draw the correct shape on the board
          markBoard(cell, shape, cell.id - 1);
          // Check to see if there is a winner
          checkWinner(shape);
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
      console.log("winner");
      return true;
    }
    // middle row
    else if (
      createBoard.getBoard()[3] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[5] == shape
    ) {
      console.log("winner");
      return true;
    }
    // bottom row
    else if (
      createBoard.getBoard()[6] == shape &&
      createBoard.getBoard()[7] == shape &&
      createBoard.getBoard()[8] == shape
    ) {
      console.log("winner");
      return true;
    }

    // first column
    else if (
      createBoard.getBoard()[0] == shape &&
      createBoard.getBoard()[3] == shape &&
      createBoard.getBoard()[6] == shape
    ) {
      console.log("winner");
      return true;
    }
    // second column
    else if (
      createBoard.getBoard()[1] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[7] == shape
    ) {
      console.log("winner");
      return true;
    }
    // third column
    else if (
      createBoard.getBoard()[2] == shape &&
      createBoard.getBoard()[5] == shape &&
      createBoard.getBoard()[8] == shape
    ) {
      console.log("winner");
      return true;
    }

    // diagonal (top left - bottom right)
    else if (
      createBoard.getBoard()[0] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[8] == shape
    ) {
      console.log("winner");
      return true;
    }
    // diagonal (top right - bottom left)
    else if (
      createBoard.getBoard()[2] == shape &&
      createBoard.getBoard()[4] == shape &&
      createBoard.getBoard()[6] == shape
    ) {
      console.log("winner");
      return true;
    }
  };

  return { player1, player2, gameLogic };
})();

gameController.gameLogic();
