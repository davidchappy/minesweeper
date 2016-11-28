// window.mineSweeper = (function(mineSweeper, $, undefined) {
//   // Add code in here when ready

//   return mineSweeper;
// })(window.mineSweeper || {}, jQuery);


// global variables
var $boardElement = $('#board');
var $squaresDiv = $('#squares');
var $dashboard = $('#dashboard');
const boardSize = 144;

// objects
var board = {
  board: [],
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
  },
  render: function() {
    // name all board div children with classes from board property
    var children = $squaresDiv.children;
    for(var i = 0; i < boardSize; i++) {
      row = Math.floor(i / this.xLength);
      children[i].addClass(this.board[i]);
    }
  },
  isAdjacent: function(currentBox, targetBox) {
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

    if ((targetBox === currentBox + 13 && !lastCol)
      || targetBox === currentBox + 12
      || targetBox === currentBox + 11 && !firstCol) {
      if(!lastRow) {
        return true;
      }
    } else if ((targetBox === currentBox - 13 && !firstCol)
      || targetBox === currentBox - 12
      || targetBox === currentBox - 11 && !lastCol) {
      if(!firstRow) {
        return true;
      }
    } else if ((targetBox === currentBox - 1 && !firstCol)
      || targetBox === currentBox + 1 && !lastCol) {
      return true;
    } 
    return false;
  },
  onBoard: function(boxIndex) {
    return this.board[boxIndex] != undefined;
  },
}

board.initBoard.call(board);
board.render.call(board);



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
