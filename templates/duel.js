document.getElementById('draw').style.display = 'none';
document.getElementById('win_user_one').style.display = 'none';
document.getElementById('win_user_two').style.display = 'none';

var sizes = {{sizes}};
if (sizes == 3) {
  document.getElementById('win4_10').style.display = 'none';
} else {
  document.getElementById('win3').style.display = 'none';
}

var game = {
  user_one: '', // for symbol
  user_two: '', // for symbol
  moves: 0,
};

// Check which symbol to assign for user and comp
sym = "{{symbol}}";
if (sym == 'X') {
  game.user_one = 'X';
  game.user_two = 'O';
}
else if (sym == 'O') {
  game.user_one = 'O';
  game.user_two = 'X';
}
// symbol is O then computer starts first
if (sym == 'O') {
  compmove();
  console.log("User one starts!");
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
  document.getElementById('win_user_one').style.display = 'none';
  document.getElementById('win_user_two').style.display = 'none';
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
    if (game.moves % 2 == 0) {
        $("#" + id).html(game.user_one);
    } else {
        $("#" + id).html(game.user_two);
    }
//   $('#' + id).removeAttr('onclick');
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

    }
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
      console.log("flag = 1");
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
  if (symbol == game.user_one) {
    console.log("User one wins!");
    document.getElementById('win_user_one').style.display = 'block';
    if (sizes == 3) {
      document.getElementById('win3').style.display = 'none';
    } else {
      document.getElementById('win4_10').style.display = 'none'
    }
  } else {
    console.log("User two wins!");
    document.getElementById('win_user_two').style.display = 'block';
    if (sizes == 3) {
      document.getElementById('win3').style.display = 'none';
    } else {
      document.getElementById('win4_10').style.display = 'none'
    }
  }
}