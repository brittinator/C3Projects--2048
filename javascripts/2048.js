var board = []
$(document).ready(function() {

  function begin() {
    for (i = 0; i < 4; i++) {
      board[i] = new Array(4);
      console.log(board);
    }
    console.log('ready!');
    board[3][0] = "2";
    board[1][0] = "2";
    board[2][0] = "2";
    board[0][0] = "2";
    board[2][1] = "2";
    board[3][1] = "2";
    board[0][2] = "2";
    board[3][2] = "2";
    board[2][3] = "2";
    board[3][3] = "2";
  }

  begin();

  // {key: starting position}
  // {37: c0, 38: r0, 39: c3, 40: r3}
  // left = 37
  // up = 38
  // right = 39
  // down = 40

  $('body').keydown(function(event){
    var arrow_keys = [37, 38, 39, 40];
    if(arrow_keys.indexOf(event.which) > -1) {
      // var tile = $('.tile');
      // console.log(tile);
      // console.log(tile.length);
      // console.log(tile[1]);
      // empty(tile);
      moveTiles(event.which);
      event.preventDefault();
    }
  })
})

function empty(location) {
  // input will be board location
  // check if board array location is undefined
  var answer = location == undefined ? true : false;
  console.log(answer);
  return answer;
}

// function mergeTile(tile) {
//   var new_tile_value = tile.attr("data-val") * 2;
//   tile.attr("data-val", new_tile_value);
//   tile.text(new_tile_value);
// }

function moveTiles(direction) {

  function goingUp(y) {
    return function(x) {
      var count = x;
      while (empty(board[x][y]) && count < 3) {
        if (!empty(board[count + 1][y])) {
          board[x][y] = board[count + 1][y];
          board[count + 1][y] = undefined;
          reassigningTileAttr("row", (count + 1), x);
        }
        count++;
      }
    }
  }

  function goingDown(y) {
    return function(x) {
      var count = x;
      while (empty(board[x][y]) && count > 0) {
        console.log("y" + y + "x" + x + "count" + count);
        if (!empty(board[count - 1][y])) {
          board[x][y] = board[count - 1][y];
          board[count - 1][y] = undefined;
          reassigningTileAttr("row", (count - 1), x);
        }
        count--;
      }
    }
  }

  function goingLeft(x) {
    return function(y) {
      var count = y;
      while (empty(board[x][y]) && count < 3) {
        console.log(count);
        if (!empty(board[x][count + 1])) {
          board[x][y] = board[x][count + 1];
          board[x][count + 1] = undefined;
          reassigningTileAttr("col", (count + 1), y);
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

          var attri = "data-col";
          var old_location = ".tile[data-col=c" + (count - 1) + "]"
          var tile = $(old_location);
          var new_location = "c" + y;
          tile.attr(attri, new_location);
          // reassigningTileAttr("col", (count - 1), y);
        }
        count--;
      }
    }
  }

  function reassigningTileAttr(dataType, old_num, new_num) {
    var attri = "data-" + dataType
    var old_location = ".tile[" + attri + "=" + dataType[0] + old_num + "]"
    var tile = $(old_location);
    var new_location = dataType[0] + new_num;
    tile.attr(attri, new_location);
  }

  // for (y = 0; y < 3; y++) {
  //   column(y);
  // }
  switch(direction) {
    case 38:
      for (i = 0; i <= 3; i++) { // for each column
        var row = goingUp(i);
        for (j = 0; j < 3; j++) { // for each row
          row(j);
        }
      }
      // a = column(0);
      // a(0);
      // a(1);
      // a(2);
      break;
    case 40:
      for (i = 0; i <= 3; i++) { // for each column
        var row = goingDown(i);
        for (j = 3; j > 0; j--) { // for each row
          row(j);
        }
      }
      break;
    case 37:
      for (i = 0; i <= 3; i++) { // for each row
        var col = goingLeft(i);
        for (j = 0; j < 3; j++) { // for each column
          col(j);
        }
      }
      break;
    case 39:
      for (i = 0; i <= 3; i++) { // for each row
        var col = goingRight(i);
        for (j = 3; j > 0; j--) { // for each column
          col(j);
        }
      }
      break;
  }

  // switch(direction) {
  //   case 38: //up
  //     // for (y = 0; y <= 3; y++) { // for each column
  //       for (x = 0; x < 3; x++) { // don't want to move a non-existant row up
  //         console.log("round" + x)
  //         if (empty(board[x][0])) {
  //           // console.log("x also is" + x)
  //           // console.log("boo" + empty(board[x][0]))
  //           board[x][0] = board[x+1][0];
  //           // console.log("space check" + board[x][0])
  //           // console.log("space move" + board[x+1][0])
  //           board[x+1][0] = undefined;
  //           // console.log("space checK" + board[x+1][0])
  //           var old_row = ".tile[data-row=r" + (x + 1) + "]"
  //           var tile = $(old_row);
  //           var new_row = "r" + (x);
  //           tile.attr("data-row", new_row);
  //         }
  //       }
  //     // }
  //     break;
    // case 40: //down
    //   // for (y = 0; y <= 3; y++) { // for each column
    //     for (x = 3; x > 0; x--) { // don't want to move a non-existant row up
    //       if (empty(board[x][0])) {
    //         board[x][0] = board[x-1][0];
    //         board[x-1][0] = undefined;
    //         var old_row = ".tile[data-row=r" + (x - 1) + "]"
    //         var tile = $(old_row);
    //         var new_row = "r" + (x);
    //         tile.attr("data-row", new_row);
    //       }
    //     }
    //   // }
    //
    //
    //   // for every column
    //   // while the bottom space is empty
    //   // is the space above that occupied
    //     // true, move space down & break while loop
    //     // false, nothing
    //   // is the second space above occupied
    //     // true, move down & break while loop
    //     // false, nothing
    //   // is the third space above occupied
    //     //true, move down & break while loop
    //     // false, end of while loop
    //
    //   // while second to bottom space is empty
    //   // is the space above occupied...etc.
    //
    //
    //   //loop for every column
    //   // for (x = 3; x > 0; x--) { // don't want to move a non-existant row up
    //   //   var a = x
    //   //   while (empty(board[x][0])) {
    //   //     //while the bottom is empty
    //   //     empty(board[])
    //   //     // does the one above that have a tile
    //   //       // if yes, move down
    //   //     // does the one above that have a tile
    //   //     board[x][0] = board[a-1][0];
    //   //     board[a-1][0] = undefined;
    //   //     var old_row = ".tile[data-row=r" + (a - 1) + "]"
    //   //     var tile = $(old_row);
    //   //     var new_row = "r" + (a);
    //   //     tile.attr("data-row", new_row);
    //   //     a++
    //   //   }
    //   // }
    //
    //   break;
    // case 37: //left
    //   for (x = 0; x <= 3; x++) { // for each row
    //     for (y = 0; y < 3; y++) { // don't want to move a non-existant column up
    //       if (empty(board[x][y])) {
    //         board[x][y] = board[x][y+1];
    //         board[x][y+1] = undefined;
    //         var old_column = ".tile[data-row=c" + (y + 1) + "]"
    //         var tile = $(old_column);
    //         var new_column = "c" + y;
    //         tile.attr("data-col", new_column);
    //       }
    //     }
    //   }
    //   break;
    // case 39: //right
    //   for (x = 0; x <= 3; x++) { // for each row
    //     for (y = 3; y > 0; y--) { // don't want to move a non-existant column up
    //       if (empty(board[x][y])) {
    //         board[x][y] = board[x][y-1];
    //         board[x][y-1] = undefined;
    //         var old_column = ".tile[data-row=c" + (y - 1) + "]"
    //         var tile = $(old_column);
    //         var new_column = "c" + y;
    //         tile.attr("data-col", new_column);
    //       }
    //     }
    //   }
    //   break;
  // }
}
