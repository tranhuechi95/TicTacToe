document.getElementById('draw').style.display = 'none';
document.getElementById('win_user').style.display = 'none';
document.getElementById('win_comp').style.display = 'none';

var sizes = {{sizes}};
if (sizes == 3) {
  document.getElementById('win4_10').style.display = 'none';
} else {
  document.getElementById('win3').style.display = 'none';
}

var game = {
    user: '', // for symbol
    computer: '', // for symbol
    moves: 0,
};

// Check which symbol to assign for user and comp
sym = "{{symbol}}";
var boardSize = sizes*sizes;
var userTurns = [];
if (sym == 'X') {
    game.user = 'X';
    game.computer = 'O';
     // declare difficulty level
    console.log("This is Hard level test!");
    for (var i = 0; i< boardSize; i+= 2) {
      userTurns.push(i); // [0,2,4,6,8,10,12,14]
  } 
}
else if (sym == 'O') {
    game.user = 'O';
    game.computer = 'X';
    // declare difficulty level
    console.log("This is Hard level test!");
    //[1,3,5,7,9,11,13,15]
    for (var i = 1; i< boardSize; i+=2) {
      userTurns.push(i);
    }
}
// symbol is O then computer starts first
if (sym == 'O') {
    compmove();
    console.log("PC starts!");
    // declare difficulty level
    console.log("This is Hard level test!")
}

function restartGame() {
  for (let i = 0; i < boardSize; i++) {
    $("#" + i).empty();
    document.getElementById(i).onclick = () => playgame(i);
  }
  game.moves = 0;
  document.getElementById('win4_10').style.display = 'block';
  document.getElementById('win3').style.display = 'block';
  if (sizes == 3) {
    document.getElementById('win4_10').style.display = 'none';
  } else {
    document.getElementById('win3').style.display = 'none';
  }
  document.getElementById('draw').style.display = 'none';
  document.getElementById('win_user').style.display = 'none';
  document.getElementById('win_comp').style.display = 'none';
}

function playgame(id){
    // user click
    // 1. user action appear, increase game.moves -> disallow click into that square
    // 2. evaluate game status
    // 2a. if someone win
    //     declare winner
    //     make all buttons unclickable
    // 2b. else
    //     if all squares are filled
    //        inform draw
    //    else
    //        computer action

    // user needs to wait for computer after user's move
    // if user is X, plays at 0, 2, 4, 6, 8 else 1,3,5,7,9
    var userTurn = userTurns.includes(game.moves);
    if (userTurn) {
      $("#" + id).html(game.user);
      // $('#' + id).removeAttr('onclick');
      $('#' + id).prop("onclick", null).off("click");
      game.moves++;
      console.log("Number of moves so far: ", game.moves);
      let status = gamestatus(id); // [true,symbol] if win, else [false, ""]
      console.log("Game status for user:", status);
      if (status[0]) {
      // if someone wins
        winmessage(status[1]);
        // alert((winningSymbol == game.user ? 'User' : 'Bot') + ' wins the game!!!!');
        for (var i = 0; i < boardSize; i++) {
          let currElem = $("#" + i);
          if (currElem.html() == "") {
            // currElem.removeAttr('onclick');
            currElem.prop("onclick", null).off("click");
          }
        }
      } else {
      // no one has won yet, check to see if all squares are filled (i.e. game.moves is 9)
          if (game.moves == boardSize) {
              if (sizes == 3) {
                  document.getElementById('win3').style.display = 'none';
              } else {
              document.getElementById('win4_10').style.display = 'none'
              }
          document.getElementById('draw').style.display = 'block';
          } else {
          setTimeout(compmove,300);
          }
      }
    }
}

function compmove() {
    // 1. loop through all possible id for the computer
    // 2. check whether the square with that id is empty
    // 3. if empty -> run minimax -> return the id to take
    // 4. fill that square with the generated id with game.computer -> disallow click into that square
    // 5. evaluate gamestatus
    // 5a. if someone wins
    //      declare winner
    //      make all empty buttons unclickable
    // 5b. else
    //    if all squares are filled
    //      declare draw
    //    else
    //      back to user action -> do nothing

    // step 1
    // try to get the middle
    let middle = Math.floor(sizes/2)*sizes + Math.floor(sizes/2);
    let square = $('#' + middle).html();
    if ((game.computer == "X" || game.moves == 1) && square == "") { 
      // if comp starts first or this is the 2nd move
        move = middle;
    }
    else {
      let bestScore = -Infinity;
      var move;
      for (let i = 0; i < sizes*sizes; i++) {
        let square = $('#' + i).html();
        //  step 2 if the square is available
        if (square == "") {
            $('#' + i).html(game.computer);
            let score = minimax(i, game.moves + 1, 3, -Infinity, Infinity, false); // step 3 // minimax(id, noOfMoves, isComp  )
            $('#' + i).empty();
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
            console.log("i " + i + " score " + score + " bestScore " + bestScore);
        }
      }

    }

    // step 4 Take the bestMove
    $('#' + move).html(game.computer);
    // $('#' + move).removeAttr('onclick');
    $('#' + move).prop("onclick", null).off("click");
    game.moves++;

    console.log("Compmove id:",move);
    var status1 = gamestatus(move);
    console.log("Return of gamestatus for PC:", status1);
    if (status1[0]) {
        winmessage(status1[1]);
        for (var j = 0; j < boardSize; j++) {
            currElem = $("#" + j);
            let content = currElem.html();
            if (content == "") {
                // currElem.removeAttr('onclick');
                currElem.prop("onclick", null).off("click");
            }
        }
    } else {
        if (game.moves == boardSize) {
            if (sizes == 3) {
                document.getElementById('win3').style.display = 'none';
            } else {
                document.getElementById('win4_10').style.display = 'none'
            }
            document.getElementById('draw').style.display = 'block';
            //alert("Game is draw!");
        }
    }
}

// look up table for scores
var scores = {
    // convention: computer will maximise and user will minimise
    ComputerWin: 1,
    YouWin: -1,
    Draw: 0,
};

function minimax(id, noOfMoves, depth, alpha, beta, isComp) {
  // need to follow both heuristics and minimax algo
  /* 1. Return score when depth == 0 or game end
    2. If enemy has three O in row/diagonal/column the board value is decreased by 10 (for each three row/column/…)
    3. The more X you have in a row/diagonal/column with at least one empty cell, the better is the state (increase by one for each X in row/column/…)
  */
    //let middle = Math.floor({{sizes}}/2)*{{sizes}} + Math.floor({{sizes}}/2);
    // console.log("middle" + middle);
    let score = 0;
    // if (id == middle) { // heuristic 2
    //     if (isComp) {
    //         score += 1000;
    //     }
    //     else score += -1000;

    // }
    let status = gamestatus(id); // the gamestatus will take in an id and return [1, symbol, totalPlus, totalMinus] or [0, "", totalPlus, totalMinus]
    var change = status[2] + status[3];
    if (status[0]) { // Game ends with a winner
        // check to see who win
        if (status[1] == game.user) { // you win
            let changeWin = change -10000 + depth;
            score += changeWin;
            return score;
        }
        else {
            let changeWin = 10000 + change + depth;
            score += changeWin;
            return score;
        }
    }
    else { // aka false => game havent ended or ends with a draw
        if (noOfMoves == boardSize) { // a tie
            score += change;
            return score;
        } else if (depth == 0) {
            score += change;
            return score;
        }
    }

    if (isComp) { // check all possible spots for comp
        let bestScore = -Infinity;
        for (let i = 0; i < sizes*sizes; i++) {
            let square = $('#' + i).html();
            //  if the square is available
            if (square == "") {
                // imagine comp's move -> need to do and undo later on
                $("#" + i).html(game.computer);
                let score = minimax(i, noOfMoves + 1, depth - 1, alpha, beta, false); // step 3 // minimax(id, noOfMoves, isComp )
                // undo the imagined comp's move
                $('#' + i).empty();
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(score, alpha);
                if (beta <= alpha) {
                  break;
                }
            }
        }
        return bestScore;

    } else { // check all possible spots for user
        let bestScore = Infinity;
        for (let i = 0; i < sizes*sizes; i++) {
            let square = $('#' + i).html();
            //  if the square is available
            if (square == "") {
                // imagine human's move -> need to do and undo later on
                $("#" + i).html(game.user);
                let score = minimax(i, noOfMoves + 1, depth - 1, alpha, beta, true); // step 3 // minimax(id, noOfMoves, isComp  )
                // undo the imagined human's move
                $('#' + i).empty();
                bestScore = Math.min(score, bestScore);
                beta = Math.min(score, beta);
                if (beta <= alpha) {
                  break;
                }
            }
        }
        return bestScore;
    }
}


  // z is the id of the cell
function gamestatus(id) {
  var x = id % sizes;
  var y = Math.floor(id / sizes);
  var queries = [];
  // check for winning criteria
  if (sizes == 3) {
    var wincriteria = 3;
  } else {
    var wincriteria = 4;
  }
  winMove = wincriteria - 1;
  for (var i = 0; i < sizes; i++) {
  	var horizontal = [];
  	var vertical = [];
  	var dia1 = [];
  	var dia2 = [];
  	for (var j = 0; j < wincriteria; j++) {
  		horizontal.push([x-winMove+j+i,y]);
  		vertical.push([x, y-winMove+j+i]);
  		dia1.push([x-winMove+j+i, y-winMove+j+i]);
  		dia2.push([x-winMove+j+i, y+winMove-j-i]);
  	}
  	queries.push(horizontal,vertical,dia1,dia2);
    //console.log("queries:", queries.length);
  }
  // console.log("outside for loop queries:", queries.length);

  queries = idconvert(filter(queries));
  // console.log("after filter queries:", queries.length);
  //console.log(queries);
  var totalPlus = 0;
  var totalMinus = 0;

  // for query in queries arr.forEach(function(0) {});
  for (var j = 0; j < queries.length; j++) {
    var check = checkcontent(queries[j]); // return of checkcontent [true,symbol, plus, minue] or  [false,"", plus, minus]
    // console.log("Return of checkcontent: ", check);
    // console.log("check[0]:",check[0])
    totalPlus += check[2];
    totalMinus += check[3]; // minus is negative
    if (check[0] == true) {// when there is a winning combination
      //console.log("flag = 1");
      return [1,check[1], totalPlus, totalMinus];
      // immediately return,stop the checkcontent for other combination (for loop)

    }
    //continues to check
  }
  return [0,"", totalPlus, totalMinus]; // no winning combination found
}

function filter(queries) {
  var boundary = sizes - 1;
  //console.log("Boundary is ", boundary);
	var discard_indices = [];
	for (var ii = 0; ii < queries.length; ii ++) {
		var query = queries[ii];
		var flag = 1;
		for (var ij = 0; ij < query.length; ij ++) {
			// check each tuple in query1 in query
			if (query[ij][0] < 0 || query[ij][1] < 0 || query[ij][0] > boundary || query[ij][1] > boundary) {
				flag = 0;
				break;
			}
		}
		if (flag === 0) {
			discard_indices.push(ii);
		}
	}
	for (var ii = discard_indices.length - 1; ii >= 0; ii --) {
		// loop backwards so that the index in the array is intact
		var index = discard_indices[ii];
		queries.splice(index,1);
		// splice remove the element at position index, remove 1 element
	}
	// console.log("After filtering length of queries = ", queries.length);
	return queries;
}

function idconvert(queries) {
	var gridid = [];
	for (var i = 0; i < queries.length; i ++) {
		var queryid = [];
		for (var j = 0; j < queries[i].length; j ++){
			queryid.push(queries[i][j][0] + queries[i][j][1] * sizes);
		}
		gridid.push(queryid);
	}
	return gridid;
}

function checkcontent(query) { // for query in queries
	// Takes in query (id of 3 cells) to compare whether the content of each cells is the same
	// Returns false if not matched else return the symbol if the same (winning condition)
	var val = []; // Initialize variable to store content
	var result;
	var countX = 0;
	var countO = 0;
	var countEmpty = 0;
	for (var i = 0; i < query.length; i ++) { // query.length = 3
		val.push($('#' + query[i]).html()); // collect content from id to val
	}
	//console.log("Check content:",val);// list values inside
	//console.log(query); // list query

    result = val.reduce(function(n,m) { // check from left to right, one pair at a time
		if (n === m) {
			return n; // Carries over the matched symbol
		}
		else {
			return false,""; // One false will fail the list
		}
	});

	for (let i = 0; i < query.length; i++) {
	  if (val[i] == "X") {
	    countX++;
	  } else if (val[i] == "O") {
	    countO++;
	  } else if (val[i] == "") {
	    countEmpty++;
	  }
	}
	var minus = 0;
	var plus = 0;

	if (game.computer == "O") {
	  // if (countO == 3) {
	  //   plus = countO*100 + countEmpty;
    // } else plus = countO + countEmpty;
    plus = (countEmpty != 0) ? (countO*2 + countEmpty) : 0;
	  // if (countX == 3) {
	  //   minus = -10;
    // }
    minus = (countX == 3) ? -100 : 0;
	} else {
	  // if (countX == 3) {
	  //   plus = countX*100 + countEmpty;
    // } else plus = countX + countEmpty
    plus = (countEmpty != 0) ? (countX*2 + countEmpty) : 0;
	  // if (countO == 3) {
	  //   minus = -10;
    // }
    minus = (countO == 3) ? -100 : 0;
	}

	//console.log("returned value:", result);
	if (!result){
	  return [0,"", plus, minus];
	} else {
	    return [1,result, plus, minus]; // result is n (= symbol)
	}
}

function winmessage(symbol) {
  if (symbol == game.user) {
    console.log("You win!");
    document.getElementById('win_user').style.display = 'block';
    if (sizes == 3) {
      document.getElementById('win3').style.display = 'none';
    } else {
      document.getElementById('win4_10').style.display = 'none'
    }
  } else {
    console.log("You lose!");
    document.getElementById('win_comp').style.display = 'block';
    if (sizes == 3) {
      document.getElementById('win3').style.display = 'none';
    } else {
      document.getElementById('win4_10').style.display = 'none'
    }
  }
}