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

  const getBoard = () => console.log(board);

  const playMove = (shape) => {
    const squares = document.querySelectorAll(".cell");
    squares.forEach((square) =>
      square.addEventListener("click", () => {
        square.textContent = shape;
        board[square.id - 1] = shape;
        console.log(board);
        togglePlayer(shape);
      })
    );
  };

  const togglePlayer = (shape) => {
    if (shape == "X") {
      playMove("O");
    } else {
      playMove("X");
    }
  };

  return { getBoard, playMove };
})();

const Player = (shape) => {
  const getShape = () => shape;
  return { getShape };
};

const gameController = (() => {
  const humanPlayer = Player("X");
  const computerPlayer = Player("O");
  createBoard.playMove(humanPlayer.getShape());
  return { humanPlayer, computerPlayer };
})();

// createBoard.getBoard();
// createBoard.playMove("X");
