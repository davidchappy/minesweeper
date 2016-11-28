window.mineSweeper = (function(mineSweeper, $, undefined) {

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
    numbers: [],
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
    fillBombs: function() {
      // Fill board.bombs with 'blank' first
      for(var i = 0; i < this.board.length; i++) {
        this.bombs[i] = 'blank';
      }

      // Initialize board.numbers array with 0's
      for(var i = 0; i < boardSize; i++) {
        this.numbers[i] = 0;
      }

      // Randomly fill 15% of board.bomb with 'bomb' 
      let quantity = Math.floor(boardSize * 0.15);
      let bombs = [];
      while(bombs.length < quantity){
        var randomnumber = Math.ceil(Math.random() * boardSize)
        if(bombs.indexOf(randomnumber) > -1) continue;
        bombs[bombs.length] = randomnumber;
        board.bombs[randomnumber] = 'bomb';
        var adjacents = this.getAdjacent(randomnumber);
        for(var i = 0; i < adjacents.length; i++) {
          board.numbers[adjacents[i]] += 1;
        }
      }
    },
    revealAdjacentSquares: function(clickedSquare, checked) {
      // Loop through adjacent tiles marking as revealed until there are no more
      if(!checked) {
        checked = [];
      } else {
        if(checked[clickedSquare] === 'checked') {
          return;
        } else {
          checked[clickedSquare] = 'checked';
        }
      }
      if(board.bombs[clickedSquare] === 'bomb') {
        return;
      } else {
        this.reveal(clickedSquare);
        if(board.numbers[clickedSquare] > 0) {
          return;
        }
      }
      var adjacents = this.getAdjacent(clickedSquare);
      if(adjacents && adjacents.some(this.hasHiddenSquares)) {
          for(var i = 0; i < adjacents.length; i++) {
            let square = adjacents[i];
            this.revealAdjacentSquares(square, checked);
          } 
        } else {
          return;
      }
    },
    hasHiddenSquares: function(element, index, array) {
      return board.board[element] === "hidden"
    },
    reveal: function(square) {
      if(board.board[square].includes('hidden')) {
        var newValue = board.board[square].replace('hidden', 'revealed');
        if(board.numbers[square] > 0) {
          newValue += ' count' + board.numbers[square];
        }
        board.board[square] = newValue;
      } else {
        return;
      }
    },
    toggleFlag: function(square) {
      if(this.board[square].includes('flagged')) {
        console.log("includes");
        var newValue = this.board[square].replace(' flagged', '');
        this.board[square] = newValue;
      } else {
        console.log("doesn't include");
        this.board[square] += ' flagged';
      }
    },
    checkForVictory: function() {
      var victory = true;
      for(var i = 0; i < boardSize; i++) {
        if(this.bombs[i] != 'bomb' && this.hasHiddenSquares(i)) {
          victory = false;
        }
      }
      if(victory) {
        game.gameOver.call(game, true);
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
        event.preventDefault();
        if(!$(this).hasClass('flagged')) {
          let squareIndex = $(this).index();

          // If clicked on bomb, run game over; otherwise reveal the tile
          if(board.bombs[squareIndex] === "bomb") {
            game.gameOver(false, squareIndex);
            return;
          } else {
            board.revealAdjacentSquares.call(board, squareIndex);
          }
        }
        board.render();
        board.checkForVictory.call(board);  
      });

      $('#board').on('contextmenu', '.hidden', function(event) {
        event.preventDefault();
        var squareIndex = $(this).index();
        board.toggleFlag.call(board, squareIndex);
        board.render();  
        board.checkForVictory.call(board); 
      });
    },
    gameOver: function(victory, bombTile) {
      if(victory) {
        $('#smiley').css('background-image', 'url("images/shades.png")');
        $.each(board.board, function(index, value) {
          if(board.bombs[value] === 'bomb') {
            board.flagged[value] === 'flagged';
          }
        });
        board.render();
      } else {
        $('#smiley').css('background-image', 'url("images/sad.png")');
        $.each(board.board, function(index,value) {
          board.reveal(index);
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

  return mineSweeper;
})(window.mineSweeper || {}, jQuery);


