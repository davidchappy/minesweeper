// window.mineSweeper = (function(mineSweeper, undefined) {
//   // Add code in here when ready

//   return mineSweeper;
// })(window.mineSweeper || {});


// global variables
var boardElement = document.getElementById('board');
var dashboard = document.getElementById('dashboard');
var boardSize = 144;

// objects
var board = {
  board: [],
  xLength: Math.sqrt(boardSize),
  initBoard: function() {
    boardElement.style.width = (this.xLength * 30) + "px";
    boardElement.style.height = (this.xLength * 30)  + "px";
 
    for(var i = 0; i < boardSize; i++) {
      var newDiv = document.createElement('div');
      newDiv.id = "box" + (i + 1);
      boardElement.appendChild(newDiv);

    }
  },
  render: function() {
    

    // name all board div children with classes from board property
    var children = boardElement.children;
    for(var i = 0; i < boardSize; i++) {
      children[i].className = ""
    }
  } 
}

board.initBoard.call(board);
board.render.call(board);