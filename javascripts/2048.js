const MINSTARTINGTILE = 2;
const MAXSTARTINGTILE = 4;
const MINBOARDLOCALE = 0; // starting array index
const MAXBOARDLOCALE = 3; // highest array index
const BOARDSIZE = 4; // anything less than 4 is valid
const WINNINGTILE = 2048;
// Constants -----------------
var board;
var score;
var actionOccurred;
var alreadyWon;
var gameOver;

$(document).ready(function() {
  begin();

  $('#newgame').click(function() {
    clearBoard();
    begin();
  });

  $('body').keydown(function(event) {
    if (!gameOver) {
      var arrowKeys = [37, 38, 39, 40];
      if (arrowKeys.indexOf(event.which) > -1) {
        moveTiles(event.which);
        matched(event.which);
        moveTiles(event.which);
        if (!isBoardFull() && actionOccurred) {
          createTile();
        }

        if (!alreadyWon && hasWon()) {
          $('img').addClass("blastoff").on("animationend", function() { $(this).removeClass("blastoff") });
          setTimeout (function(){alert("YOU HAVE WOOOOOON!!!")}, 3000);
          alreadyWon = true;
        } else if (alreadyWon && hasLost()) {
          alert("Congrats on winning!\nBut there are no more moves for you to make.\nPlease start a new game.")
          gameOver = true;
        } else if (hasLost()) {
          $('img').addClass("crashandburn").on("animationend", function() { $(this).removeClass("crashandburn") });
          setTimeout (function(){alert("YOU HAVE FAILED! D:")}, 1000);
          gameOver = true;
        }
        actionOccurred = false;
        event.preventDefault();
      }
    }
  })
});

function begin() {
  board = []; // creates an empty board
  for (i = 0; i < BOARDSIZE; i++) { // fills the board: creates a 2D array
    board[i] = new Array(BOARDSIZE);
  }

  // creates two tiles to start with
  createTile();
  createTile();

  score = 0; // sets score to 0 for a new game
  alreadyWon = false;
  gameOver = false;
  changeDisplayedScore();
}

function clearBoard() {
  var divs = $('.tile');
  divs.remove();
}

function empty(location) {
  // input will be board location
  // check if board array location is undefined
  var answer = (location == undefined) ? true : false;
  return answer;
}

function randomizeValue() {
  var coinFlip = Math.floor(Math.random() * 2)
  value = coinFlip == 0 ? 2 : 4;
  return value;
}

function randomizeLocation() {
  // floor rounds down for an integer
  var row = Math.floor(
    Math.random() *(BOARDSIZE - MINBOARDLOCALE) + MINBOARDLOCALE );
  var col = Math.floor(
    Math.random() *(BOARDSIZE - MINBOARDLOCALE) + MINBOARDLOCALE );

  // need to check if slot is empty
  while (!empty(board[row][col])) {  // can probably refactor this
    var row = Math.floor(
      Math.random() *(BOARDSIZE - MINBOARDLOCALE) + MINBOARDLOCALE );
    var col = Math.floor(
      Math.random() *(BOARDSIZE - MINBOARDLOCALE) + MINBOARDLOCALE );
    // need to check if slot is empty
  }
  return [row, col];
}

function createTile() {
  var location = randomizeLocation()
  var row = location[0];
  var col = location[1];
  var value = randomizeValue();
  board[row][col] = value;
  createVisualTile(row, col, value);
}

function createVisualTile(row, col, value) {
  var rowLocation = "r" + row;
  var colLocation = "c" + col;
  var tile = $("<div></div>");
  tile.addClass("tile");
  tile.text(value);
  tile.attr("data-val", value);
  tile.attr("data-row", rowLocation);
  tile.attr("data-col", colLocation);
  $("#gameboard").append(tile);
  tile.addClass("spawning").on("animationend", function() { $(this).removeClass("spawning") });
}

function changeDisplayedScore() {
  var scoreDiv = $('#score')
  //animation to ba-dump scoreboard
  $('#scoreboard').addClass('increasescore');

  // remove animation class
  $('#scoreboard').on('animationend', function() {
    $(this).removeClass('increasescore');
  })
  scoreDiv.text(score);
}

function matched(direction) {
  switch(direction) {
    case 38: //up
      var rowStart = 0; //rowstart

      for(c=0; c<4; c++) { //colm incrementing
        for(r=rowStart; r<3; r++) { //row incrementing
          if (isNaN(board[r][c])) { continue;} // will do check if value is a number
          var neighbor = board[r + 1][c];
          if (board[r][c] == neighbor) {
            tileLevelUp(r, c, board[r][c]);
            board[r + 1][c] = undefined;
            deleteVisualTile(r+1, c);
            incrementVisualTile(r, c, board[r][c]);
            actionOccurred = true;
          } // if
        } // r
      } // c
      break;
    case 40: //down
      var rowStart = 3

      for(c=0; c<4; c++) { //colm incrementing
        for(r=rowStart; r>0; r--) { //row decrementing
          if (isNaN(board[r][c])) { continue;} // will do check if value is a number
          var neighbor = board[r - 1][c];
          if (board[r][c] == neighbor) {
            tileLevelUp(r, c, board[r][c]);
            board[r - 1][c] = undefined;
            deleteVisualTile(r-1, c);
            incrementVisualTile(r, c, board[r][c]);
            actionOccurred = true;
          } // if
        } // r
      } // c
      break;
    case 37: //left
      var colStart = 0

      for(c=colStart; c<3; c++) { //colm incrementing
        for(r=0; r<4; r++) { //row incrementing
          if (isNaN(board[r][c])) { continue;} // will do check if value is a number
          var neighbor = board[r][c + 1];
          if (board[r][c] == neighbor) {
            tileLevelUp(r, c, board[r][c]);
            board[r][c + 1] = undefined;
            deleteVisualTile(r, c+1);
            incrementVisualTile(r, c, board[r][c]);
            actionOccurred = true;
          } // if
        } // r
      } // c
      break;
    case 39: //right
      var colmStart = 3 // colmStart

      for(c=colmStart; c>0; c--) { //colm decrementing
        for(r=0; r<4; r++) { //row incrementing
          if (isNaN(board[r][c])) { continue;} // will do check if value is a number
          var neighbor = board[r][c - 1];
          if (board[r][c] == neighbor) {
            tileLevelUp(r, c, board[r][c]);
            deleteVisualTile(r, c-1);
            board[r][c - 1] = undefined;
            incrementVisualTile(r, c, board[r][c]);
            actionOccurred = true;
          } // if
        } // r
      } // c
      break;
  };
}

function tileLevelUp(row, column, value) {
  board[row][column] = 2 * value;
  incrementScore(board[row][column]);
}

function incrementVisualTile(row, col, value) {
  // for css styles
  var rowLocation = "r" + row;
  var colLocation = "c" + col;
  var tile = $("[data-row=" + rowLocation + "][data-col=" + colLocation + "]");
  tile.text(value);
  tile.attr("data-val", value);
}

function deleteVisualTile(row, col) {
  var div = $('.tile')
  var rowLocation = "r" + row;
  var colLocation = "c" + col;
  $("[data-row=" + rowLocation + "][data-col=" + colLocation + "]").remove();
}

function moveTiles(direction) {
  switch(direction) {
    case 38: // up
      colRowIterator(goingUp, MINBOARDLOCALE, lessThan, 1);
      break;
    case 40: // down
      colRowIterator(goingDown, MAXBOARDLOCALE, greaterThan, -1);
      break;
    case 37: // left
      colRowIterator(goingLeft, MINBOARDLOCALE, lessThan, 1);
      break;
    case 39: // right
      colRowIterator(goingRight, MAXBOARDLOCALE, greaterThan, -1);
      break;
  }
}

function incrementScore(value) {
  score += value;
  changeDisplayedScore();
}

function hasWon() {
  var winningDataVal = "[data-val=" + WINNINGTILE + "]";
  var winningTile = $(winningDataVal);
  // if a winning tile exists return true, else return false
  return (winningTile.length > 0);
}

function hasLost() {
  return (isBoardFull() && noMovesAvailable());
}

function isBoardFull() {
  // make a loop, call empty on each tile
  for (r = 0; r < BOARDSIZE; r++) { // for each row
    for (c = 0; c < BOARDSIZE; c++) { // for each col
      if (empty(board[r][c])) {
        return false;
      }
    }
  }
  // "the length " + $('.tile').length >= 16
  return true;
}

function noMovesAvailable() {
  var moves = 0;
  for (r = 0; r < BOARDSIZE; r++) { // for each row
    for (c = 0; c < BOARDSIZE; c++) { // for each col
      // compares tile to the right of the tile
      if ((c + 1) == BOARDSIZE) {
        // do NOTHING
        // don't want to do the check (because no col to compare to)
      } else if (board[r][c] == board[r][c + 1]) {
        moves++;
      }
      // compares tile to the tile below
      if ((r + 1) == BOARDSIZE) {
        // do NOTHING
        // don't want to do the check (because no row to compare to)
      } else if (board[r][c] == board[r + 1][c]) {
        moves++;
      }
    }
  }
  return (moves == 0);
}

function colRowIterator(directionFunction, startNum, endConditionalFunction, incrementor) {
  // directionFunction should be goingUp(), goingDown(), etc.
  // startNum should be MAXBOARDLOCALE OR MINBOARDLOCALE
  // endConditionalFunction should be "function() {c > 0}" or "function() {c < 3}"
  // incrementor should be 1 or -1

  // for (var r = MINBOARDLOCALE; r <= MAXBOARDLOCALE; r++) {
  //   var moveIt = directionFunction(r);
  //   for (var c = startNum; endConditionalFunction(c); c += incrementor) {
  //     moveIt(c);
  //   }
  // }

  for (var r = rowStart; rowConditional; r+= rowIncrementor) {
    for (var c = colStart; colConditional; c += colIncrementor) {
      var count = c;

      function rNew(curCount) {
        return moveDirection == "horizontal" ? curCount += rowIncrementor : r
      }
      function cNew(curCount) {
        return moveDirection == "vertical" ? curCount += rowIncrementor : c
      }

      while (empty(board[r][c]) && endConditional(count, rowEnd)) {
        if (!empty(board[rNew(count)][cNew(count)])) {
          board[r][c] = board[rNew(count)][cNew(count)];
          board[rNew(count)][cNew(count)] = undefined;
          reassigningTileAttr(rNew(count), r, cNew(count), c);
          actionOccurred = true;
        }
        count += incrementor;
      }


      while (empty(board[r][c]) && **count > 0 || count < 3**) {
        if (!empty(board[** x || count + incrementor **][** count + incrementor || y**])) {
          board[x][y] = board[** x || count + incrementor **][** count + incrementor || y**];
          board[** x || count + incrementor **][** count + incrementor || y**] = undefined;
          reassigningTileAttr((count + incrementor), x, (count + incrementor), y);
          actionOccurred = true;
        }
        count += incrementor;
      }
    }


  function goingDirection(r, incrementor) {
    return function(c) {
      var count = c;
      while (empty(board[r][c]) && count [STUFFF]) {
        if (!empty(board[-1][STUFF])) {
          board[x][y] = board[STUFF][STUFF];
          board[STUFF] = undefined;
          reassigningTileAttr((count + incrementor), x, y, y);
          actionOccurred = true;
        }
        count += incrementor;
      }
    }
  goingDirectionRow()
}

function lessThan(val, finish) {
  return val < finish;
}

function greaterThan(val) {
  return val > finish;
}

function goingDirection(colRow, incrementor) {
  return function(rowCol) {
    var count = rowCol;
    while (empty(board[x][y]) && count [STUFFF]) {
      if (!empty(board[STUFF][STUFF])) {
        board[x][y] = board[STUFF][STUFF];
        board[STUFF] = undefined;
        reassigningTileAttr((count + incrementor), x, y, y);
        actionOccurred = true;
      }
      count += incrementor;
    }
  }
}

function goingUp(y) {
  return function(x) {
    var count = x;
    while (empty(board[x][y]) && count < 3) {
      if (!empty(board[count + 1][y])) {
        board[x][y] = board[count + 1][y];
        board[count + 1][y] = undefined;
        reassigningTileAttr((count + 1), x, y, y);
        actionOccurred = true;
      }
      count++;
    }
  }
}

function goingDown(y) {
  return function(x) {
    var count = x;
    while (empty(board[x][y]) && count > 0) {
      if (!empty(board[count - 1][y])) {
        board[x][y] = board[count - 1][y];
        board[count - 1][y] = undefined;
        reassigningTileAttr((count - 1), x, y, y);
        actionOccurred = true;
      }
      count--;
    }
  }
}

function goingLeft(x) {
  return function(y) {
    var count = y;
    while (empty(board[x][y]) && count < 3) {
      if (!empty(board[x][count + 1])) {
        board[x][y] = board[x][count + 1];
        board[x][count + 1] = undefined;
        reassigningTileAttr(x, x, (count + 1), y);
        actionOccurred = true;
      }
      count++;
    }
  }
}

function goingRight(x) {
  return function(y) {
    var count = y;
    while (empty(board[x][y]) && count > 0) {
      if (!empty(board[x][count - 1])) {
        board[x][y] = board[x][count - 1];
        board[x][count - 1] = undefined;
        reassigningTileAttr(x, x, (count - 1), y);
        actionOccurred = true;
      }
      count--;
    }
  }
}

function reassigningTileAttr(oldRow, newRow, oldCol, newCol) {
  var oldLocation = ".tile[data-row=r" + oldRow + "][data-col=c" + oldCol + "]";
  var tile = $(oldLocation);
  var newRowLocation = "r" + newRow;
  var newColLocation = "c" + newCol;
  tile.attr("data-row", newRowLocation);
  tile.attr("data-col", newColLocation);
}
