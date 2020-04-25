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
if (sym == 'X') {
    game.user = 'X';
    game.computer = 'O';
     // declare difficulty level
    console.log("This is Hard level!")
}
else if (sym == 'O') {
    game.user = 'O';
    game.computer = 'X';
    // declare difficulty level
    console.log("This is Hard level!")
}
// symbol is O then computer starts first
if (sym == 'O') {
    compmove();
    console.log("PC starts!");
    // declare difficulty level
    console.log("This is Hard level!")
}

var boardSize = sizes*sizes;

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

    var userTurn = false;
    if (game.user == "X") {
      var userTurns = [0,2,4,6,8]
      userTurn = userTurns.includes(game.moves);
      console.log("implementing userTurn check");
    } else if (game.user == "O") {
      var userTurns = [1,3,5,7,9]
      userTurn = userTurns.includes(game.moves);
      console.log("implementing userTurn check");
    }

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
          setTimeout(compmove,1000);
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
    let bestScore = -Infinity;
    var move;
    for (let i = 0; i < sizes*sizes; i++) {
      let square = $('#' + i).html();
      //  step 2 if the square is available
      if (square == "") {
          $('#' + i).html(game.computer);
          let score = minimax(i, game.moves + 1, false); // step 3 // minimax(id, noOfMoves, isComp  )
          $('#' + i).empty();
          if (score > bestScore) {
              bestScore = score;
              move = i;
          }
      }
    }
    // step 4 Take the bestMove
    $('#' + move).html(game.computer);
    // $('#' + id).removeAttr('onclick');
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

function minimax(id, noOfMoves, isComp) {
    let status = gamestatus(id); // the gamestatus will take in an id and return [1, symbol] or [0, ""]
    let score;
    if (status[0]) { // aka true so could be You or comp win
        // check to see who win
        if (status[1] == game.user) { // you win
            score = -1;
            return score;
        }
        else {
            score = 1;
            return score;
        }
    } else { // aka false => could be a tie or game is not finished
        if (noOfMoves == boardSize) { // a tie
            score = 0;
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
                let score = minimax(i, noOfMoves + 1, false); // step 3 // minimax(id, noOfMoves, isComp )
                // undo the imagined comp's move
                $('#' + i).empty();
                bestScore = Math.max(score, bestScore);
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
                let score = minimax(i, noOfMoves + 1, true); // step 3 // minimax(id, noOfMoves, isComp  )
                // undo the imagined human's move
                $('#' + i).empty();
                bestScore = Math.min(score, bestScore);
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

  // for query in queries arr.forEach(function(0) {});
  for (var j = 0; j < queries.length; j++) {
    var check = checkcontent(queries[j]); // return of checkcontent [true,symbol] or  [false,""]
    // console.log("Return of checkcontent: ", check);
    // console.log("check[0]:",check[0])
    if (check[0] == true) {// when there is a winning combination
      //console.log("flag = 1");
      return [1,check[1]];
      // immediately return,stop the checkcontent for other combination (for loop)

    }
    //continues to check
  }
  return [0,""]; // no winning combination found
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
			queryid.push(queries[i][j][0] + queries[i][j][1] * {{sizes}});
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

	//console.log("returned value:", result);
	if (!result){
	  return [0,""];
	} else {
	    return [1,result]; // result is n (= symbol)
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