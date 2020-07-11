// z is the id of the cell
function gamestatus(id) {
  var x = id % 3;
  var y = Math.floor(id / 3);
  var queries = [];
  for (var i = 0; i < 3; i++) {
  	// .push is similar to .append in python
  	// javascript does not support tuples, so need to represent as a list of lists
  	queries.push([ [x-2+i,y] , [x-1+i, y] , [x+i,y] ], // Horizontal
  	[ [x,y-2+i] , [x, y-1+i] , [x,y+i] ], // Vertical
  	[ [x-2+i,y-2+i] , [x-1+i, y-1+i] , [x+i,y+i] ], // Diagonal negative gradient
  	[ [x-2+i,y+2-i] , [x-1+i, y+1-i] , [x+i,y-i] ]); // Diagonal positive gradient
  }

  queries = idconvert(filter(queries));
  console.log(queries1);

  // for query in queries arr.forEach(function(0) {});
  queries.forEach(function(query) { // query is a list of id of 3 cells
  	checkcontent(query);
  	});
}

function filter(queries) {
	var discard_indices = [];
	for (var ii = 0; ii < queries.length; ii ++) {
		var query = queries[ii];
		var flag = 1;
		for (var ij = 0; ij < query.length; ij ++) {
			// check each tuple in query1 in query
			if (query[ij][0] < 0 || query[ij][1] < 0 || query[ij][0] > 2 || query[ij][1] > 2) {
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
	return queries;
}

function idconvert(queries) {
	var gridid = [];
	for (var i = 0; i < queries.length; i ++) {
		var queryid = [];
		for (var j = 0; j < queries[i].length; j ++){
			queryid.push(queries[i][j][0] + queries[i][j][1] * 3);
		}
		gridid.push(queryid);
	}
	return gridid;
}

function checkcontent(query) { // for query in queries
	// Takes in query (id of 3 cells) to compare whether the content of each cells is the same
	// Returns false if not matched, the symbol if the same (winning condition)
	var val = []; // Initialize variable to store content
	var result;
	for (var i = 0; i < query.length; i ++) { // query.length = 3
		val.push($('#' + query[i]).html()); // collect content from id to val
	}
	console.log(query); // list query
	console.log(val); // list values inside
	result = val.reduce(function(n,m) {
		if (n === m) {
			return n; // Carries over the matched symbol
		}
		else {
			return false; // One false will fail the list
		}
	});
	console.log(result);
	return result;

}

  var game = {
    user: '', // for symbol
    computer: '', // for symbol
    currentPlayer: '',
    moves: 1,
  };

// Check which symbol to assign for user and comp
  sym = "{{symbol}}";
  if (sym === 'X') {
    game.user = 'X';
    game.computer = 'O';
  }
  else if (sym === 'O') {
    game.user = 'O';
    game.computer = 'X';
  }
  // symbol is O then computer starts first
  if (sym === 'O') {
    compmove();
  }
  setCurrPl('user');

  function playgame(id){
    $("#" + id).html(game.user);
    //alert($('#' + id).html());
    $('#' + id).removeAttr('onclick'); // i think this should be id instead of xy
    game.moves++;
    console.log(game.moves);
    if (game.moves >= 5) {
      gamestatus(id);
      // symbol if true and false ?
    }
    compmove();
  }

  function compmove() {
    var x;
    while (game.moves <= sizes**2) {
    x = String(Math.floor(Math.random() * sizes**2));

    let validmove = $('#' + x).html();
    console.log(validmove);
      if (validmove == "") {
        $("#" + x).html(game.computer);
        $('#' + x).removeAttr('onclick');
        game.moves++;
        console.log(game.moves);
        break;
      }
      else {
        console.log('invalid move: ' + x + ", "+ validmove);
      }
    }
  }