// window.mineSweeper = (function(mineSweeper, $, undefined) {
//   // Add code in here when ready

//   return mineSweeper;
// })(window.mineSweeper || {}, jQuery);


// global variables
var $boardElement = $('#board');
var $squaresDiv = $('#squares');
var $dashboard = $('#dashboard');
var $smiley = $('#smiley');
const boardSize = 144;

// objects
var board = {
  board: [],
  bombs: [],
  flags: [],
  xLength: Math.sqrt(boardSize),
  initBoard: function() {
    // Set outer div's height and width relative to chosen boardSize
    $boardElement.width((this.xLength * 30) + 4);
    $boardElement.height((this.xLength * 30) + 50);
    $squaresDiv.height(this.xLength * 30);
    $squaresDiv.width(this.xLength * 30);

    for(var i = 0; i < boardSize; i++) {
      // fill board.board object with class names
      this.board[i] = "hidden";

      // intialize html board with divs and ids
      $squaresDiv.append('<div class="hidden"></div>');
      $('#squares div:last').attr('id', function(index) {
        return "box" + (i + 1);
      });
    }

    this.fillBombs();
  },
  render: function() {
    // name all board div children with classes from board property
    var children = $squaresDiv.children();
    for(var i = 0; i < boardSize; i++) {
      children[i].className = this.board[i];
    }
  },
  isAdjacent: function(currentBox, targetBox) {
    let adjacentBoxes = this.getAdjacent(currentBox);
    if(adjacentBoxes && adjacentBoxes.includes(targetBox)) {
      return true;
    } else {
      return false;
    }
  },
  getAdjacent: function(currentBox) {
    let adjacent = [];

    // check if on first row or last row
    if(currentBox < this.xLength) {
      var firstRow = true;
    } else if (currentBox > (this.board.length - (this.xLength + 1))) {
      var lastRow = true;
    }

    // check if on first col or last col
    if(currentBox % this.xLength === 0) {
      var firstCol = true;
    } else if ((currentBox + 1) % this.xLength === 0) {
      var lastCol = true;
    }

    // Capture each direction in a variable
    let downLeft = currentBox + 11;
    let down = currentBox + 12;
    let downRight = currentBox + 13;
    let upLeft = currentBox - 13;
    let up = currentBox - 12;
    let upRight = currentBox - 11;
    let left = currentBox - 1;
    let right = currentBox + 1;

    // Add each direction to adjacent array unless target is off the board
    if(!firstCol) {
      if(!lastRow) {
        adjacent.push(downLeft);
      }
      if(!firstRow) {
        adjacent.push(upLeft);
      }
      adjacent.push(left);
    }

    if(!lastCol) {
      if(!lastRow) {
        adjacent.push(downRight);
      }
      if(!firstRow) {
        adjacent.push(upRight);
      }
      adjacent.push(right);
    }

    if(!firstRow) {
      adjacent.push(up);
    } 
    if(!lastRow) {
      adjacent.push(down);
    }

    return adjacent;
  },
  onBoard: function(boxIndex) {
    if(this.board[boxIndex] != undefined) {
      return true;
    } else {
      return false;
    };
  },
  fillBombs: function() {
    // Fill board.bombs with 'blank' first
    for(var i = 0; i < this.board.length; i++) {
      this.bombs[i] = 'blank';
    }

    // Randomly fill 15% of board.bomb with 'bomb' 
    let quantity = Math.floor(boardSize * 0.15);
    let bombs = [];
    while(bombs.length < quantity){
      var randomnumber = Math.ceil(Math.random() * boardSize)
      if(bombs.indexOf(randomnumber) > -1) continue;
      bombs[bombs.length] = randomnumber;
      board.bombs[randomnumber] = 'bomb';
    }
  }
}

var game = {
  run: function() {
    board.initBoard.call(board);
    board.render.call(board);
    this.listen();
  },
  listen: function() {
    // Reset with smiley face
    $('#board').on('click', '#smiley', function() {
      location.reload();
    });

    // When hidden tile is clicked, reveal
    $('#board').on('click', '.hidden', function(event) {
      if(!$(this).hasClass('flagged')) {
        let squareIndex = $(this).index();

        // If clicked on bomb, run game over; otherwise reveal the tile
        if(board.bombs[squareIndex] === "bomb") {
          console.log("bomb!");
          game.gameOver(false, squareIndex);
          return;
        } else {
          board.board[squareIndex] = 'revealed';

          // // Loop through adjacent tiles marking as revealed until there are no more
          // let hasAdjacent = true;
          // let currentTile = this;
          // let adjacentTiles = [];
          // let checked = board.board;
          // while(hasAdjacent) {
          //   checked[currentTile] = "checked";
          //   adjacentTiles = board.getAdjacent.apply(board, currentTile);
          //   if(adjacentTiles) {
          //     $.each(adjacentTiles, function(index, value) {
          //       if(board.onBoard(value)
          //         && board.bombs[value] != 'bomb' 
          //         && board.flags[value] != 'flagged'
          //         && checked[currentTile] != 'checked'
          //         ) {
          //         board.board[value] = 'revealed';
          //         checked[currentTile] = 'checked';
          //         currentTile = value;  
          //       } else {
          //         return;
          //       }
          //     });
          //   } else {
          //     hasAdjacent = false;
          //   }
          // }
        }
      }
      board.render();
    });

  },
  gameOver: function(victory, bombTile) {
    if(victory) {

    } else {
      $.each(board.board, function(index,value) {
        if(value.includes('hidden')) {
          var newValue = value.replace('hidden', 'revealed');
          board.board[index] = newValue;
        }
        if(board.bombs[index] === 'bomb') {
          board.board[index] = 'bomb';  
        }
      });
      board.board[bombTile] += ' exploded'; 
      board.render();

    }
  }
}

game.run.call(game);


// TESTS FOR BOARD.isADJACENT()
// // Left and right are adjacent
// console.log(board.isAdjacent.apply(board, [78,77]));
// console.log(board.isAdjacent.apply(board, [78,79]));

// // Top left, center and right are adjacent
// console.log(board.isAdjacent.apply(board, [78,66]));
// console.log(board.isAdjacent.apply(board, [78,65]));
// console.log(board.isAdjacent.apply(board, [78,67]));

// // Bottom left, center, and right are adjacent
// console.log(board.isAdjacent.apply(board, [78,90]));
// console.log(board.isAdjacent.apply(board, [78,89]));
// console.log(board.isAdjacent.apply(board, [78,91]));

// // On top row, only left/right and bottom left/center/right are adjacent
// console.log(board.isAdjacent.apply(board, [1,0]));
// console.log(board.isAdjacent.apply(board, [1,2]));
// console.log(board.isAdjacent.apply(board, [1,13]));
// console.log(board.isAdjacent.apply(board, [1,12]));
// console.log(board.isAdjacent.apply(board, [1,14]));

// // On bottom row, only left/right and top left/center/right are adjacent
// console.log(board.isAdjacent.apply(board, [142,143]));
// console.log(board.isAdjacent.apply(board, [142,141]));
// console.log(board.isAdjacent.apply(board, [142,130]));
// console.log(board.isAdjacent.apply(board, [142,129]));
// console.log(board.isAdjacent.apply(board, [142,131]));

// // On left col, only right and top/bottom center/right are adjacent
// console.log(board.isAdjacent.apply(board, [24,25]));
// console.log(board.isAdjacent.apply(board, [24,11])); // false
// console.log(board.isAdjacent.apply(board, [24,12])); 
// console.log(board.isAdjacent.apply(board, [24,13])); 
// console.log(board.isAdjacent.apply(board, [24,35])); // false
// console.log(board.isAdjacent.apply(board, [24,36]));
// console.log(board.isAdjacent.apply(board, [24,37])); 

// // On right col, only left and top/bottom center/left are adjacent
// console.log(board.isAdjacent.apply(board, [35,22]));
// console.log(board.isAdjacent.apply(board, [35,23]));
// console.log(board.isAdjacent.apply(board, [35,24])); // false 
// console.log(board.isAdjacent.apply(board, [35,34])); 
// console.log(board.isAdjacent.apply(board, [35,47]));  
// console.log(board.isAdjacent.apply(board, [35,46])); 
// console.log(board.isAdjacent.apply(board, [35,48])); // false
