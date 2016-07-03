var boards = ["one", "two", "thr", "fou", "fiv", "six", "sev", "eig", "nin"];

//functions for creating the full board
var singleBoard = function(boardIndex) { //the index value of this board in the overall board
	var thisBoard, htmlStr, counter;
	thisBoard = document.createElement("div"); //creates a div tag that will contain this board
	thisBoard.className = "board";
	thisBoard.id = boards[boardIndex];
	htmlStr = "";
	counter = 0;
	for(var i = 0; i < 3; i++) {
		htmlStr += "<div class=\"row\">\n";
		for(var j = 0; j < 3; j++) {
			htmlStr += "<div class=\"tile\" id=" + boards[boardIndex] + boards[counter] + "></div>\n";
			counter++;
		}
		htmlStr += "</div>\n"
	}
	thisBoard.innerHTML = htmlStr; //sets html inside of thisBoard to the html created in the for loops
	return thisBoard;
};

//creates the row that starts with the board of the "leftmostIndex" parameter
var makeRow = function(leftmostIndex) {
	var row = document.createElement("div");
	row.className = "row";
	for(var i = leftmostIndex; i < leftmostIndex + 3; i++) {
		row.appendChild(singleBoard(i));	
	}
	return row;
};

//board creation functions finished

//begin checking for wins
var checkBoardWin = function(boardIndex, recentId, recentPlayer) { //the index of the board, the id of clicked tile, which player had most recent turn 
	switch(recentId.substring(3)) {
		case "one": return checkRowCol(true, 0, boardIndex, recentPlayer) || checkRowCol(false, 0, boardIndex, recentPlayer) || checkDiag(false, boardIndex,recentPlayer); 
		
		case "two": return checkRowCol(true, 1, boardIndex, recentPlayer) || checkRowCol(false, 0, boardIndex, recentPlayer);
		
		case "thr": return checkRowCol(true, 2, boardIndex, recentPlayer) || checkRowCol(false, 0, boardIndex, recentPlayer) || checkDiag(true, boardIndex, recentPlayer);
		
		case "fou": return checkRowCol(true, 0, boardIndex, recentPlayer) || checkRowCol(false, 3, boardIndex, recentPlayer);
		
		case "fiv": return checkRowCol(true, 1, boardIndex, recentPlayer) || checkRowCol(false, 3, boardIndex, recentPlayer) || checkDiag(false, boardIndex, recentPlayer) || checkDiag(true, boardIndex, recentPlayer);
		
		case "six": return checkRowCol(true, 2, boardIndex, recentPlayer) || checkRowCol(false, 3, boardIndex, recentPlayer);
					
		case "sev": return checkRowCol(true, 0, boardIndex, recentPlayer) || checkRowCol(false, 6, boardIndex, recentPlayer) || checkDiag(true, boardIndex, recentPlayer);
					
		case "eig": return checkRowCol(true, 1, boardIndex, recentPlayer) || checkRowCol(false, 6, boardIndex, recentPlayer);
				
		case "nin": return checkRowCol(true, 2, boardIndex, recentPlayer) || checkRowCol(false, 6, boardIndex, recentPlayer) || checkDiag(false, boardIndex, recentPlayer);
	}
	return false;
};

var checkRowCol = function(col, initial, boardIndex, recentPlayer) { //true if checking a column, first index of the row/col, boardIndex, player with turn
	if(col){
		for(var i = initial; i < 9; i += 3) {
			if(document.getElementById(boardIndex + boards[i]).innerHTML != recentPlayer) {
				return false;
			}
		}
		return true;
	} else {
		for(var i = initial; i < initial + 3; i++) {
			if(document.getElementById(boardIndex + boards[i]).innerHTML != recentPlayer) {
				return false;
			}
		}
		return true;
	}
};

var checkDiag = function(aDiag, boardIndex, recentPlayer) {
	if(aDiag) {
		for(var i = 2; i < 8; i += 2) {
			if(document.getElementById(boardIndex + boards[i]).innerHTML != recentPlayer) {
				return false;
			}
		}
		return true;		
	} else {
		for(var i = 0; i < 9; i += 4) {
			if(document.getElementById(boardIndex + boards[i]).innerHTML != recentPlayer) {
				return false;
			}	
		}
		return true;
	}
};

var fullWin = function(recentPlayer) {
	var clName = recentPlayer + "won";
	var line = function(first, second, third) {
		first = document.getElementById(first);
		second = document.getElementById(second);
		third = document.getElementById(third);
		if(first.className === clName && second.className === clName && third.className === clName) {
			return true;
		}
		return false;
	};

	if(line("one", "two", "thr")) return true;
	if(line("fou", "fiv", "six")) return true;
	if(line("sev", "eig", "eig")) return true;
	if(line("one", "fou", "sev")) return true;
	if(line("two", "fiv", "eig")) return true;
	if(line("thr", "six", "nin")) return true;
	if(line("one", "fiv", "nin")) return true;
	if(line("thr", "fiv", "sev")) return true;
	return false;
};

//end checking for wins

var gamePlay = function() {
	var player, resetButton, finished;
	var one, two, three, four, five, six, seven, eight, nine;
	one = 0;
	two = 0;
	three = 0;
	four = 0;
	five = 0;
	six = 0;
	seven = 0;
	eight = 0;
	nine = 0;
	finished = false;
	//create the board
	var full = document.getElementById("full");
	full.appendChild(makeRow(0));
	full.appendChild(makeRow(3));
	full.appendChild(makeRow(6));
	
	//player 1 goes first
	document.getElementById("currentPlayer").style.color = "red";
	document.getElementById("currentPlayer").innerHTML = "Player 1";
	player = "X";
        nextBoard = "";
    
    singleMove = function(e) {
	var element;

        e = e || event;
        target = e.target || e.srcElement;
	
	//make the clicked tile can be played on (is not used or in the wrong board and the game isn't over)
	if(target.innerHTML != "") return;
	if(document.getElementById(target.id.substring(0,3)).className === "Xwon" || document.getElementById(target.id.substring(0,3)).className === "Owon") return;
	if(nextBoard != "" && target.id.substring(0,3) != nextBoard) return;
	if(finished === true) return;

        target.innerHTML = player;

	//clear the previous next turn board
	element = document.getElementsByClassName("next");
	if(element.length != 0) {
		element[0].className = "board";
	}

	//set the the board that must be used next turn
	nextBoard = target.id.substring(3);
	
	var targetBoard = target.id.substring(0,3);
	element = document.getElementById(nextBoard);
	
	//if targetBoard is full clears the selection and adds to the counter if it is not full
	switch(targetBoard) {
		case "one": if(one < 9)	one++; break;
		case "two": if(two < 9)	two++; break;
		case "thr": if(three < 9) three++; break;
		case "fou": if(four < 9) four++; break;
		case "fiv": if(five < 9) five++; break;
		case "six": if(six < 9) six++; break;
		case "sev": if(seven < 9) seven++; break;
		case "eig": if(eight < 9) eight++; break;
		case "nin": if(nine < 9) nine++; break;
	}

	//if next board has already been won or is complete, clears it, else changes its class
	if(document.getElementById(nextBoard).className != "board") {
		nextBoard = "";
	} else {
		element = document.getElementById(nextBoard);
		element.className = "next";
	}

	//sets the board to complete if it is the nextBoard and is full
	switch(nextBoard) {
		case "one": if(one >= 9) element.className = "complete";
			    break;

		case "two": if(two >= 9) element.className = "complete";
			    break;

		case "thr": if(three >= 9) element.className = "complete";
			    break;

		case "fou": if(four >= 9) element.className = "complete";	   
		            break;
		case "fiv": if(five >= 9) element.className = "complete";
			    break;

		case "six": if(six >= 9) element.className = "complete";
			    break;

		case "sev": if(seven >= 9) element.className = "complete";
			    break;

		case "eig": if(eight >= 9) element.className = "complete";
			    break;

		case "nin": if(nine >= 9) element.className = "complete";
			    break;
	}

	//check for board win
	element = document.getElementById(target.id.substring(0,3));
	if(element.className != "Xwon" && element.className != "Owon" && checkBoardWin(element.id, target.id, player)) {
		element.className = player + "won";
		//checks if this move wins the board and sends it back to the same board
		if(document.getElementById(nextBoard) != "board") {
			nextBoard = "";
		}
		//check if the overall game has been won
		if(fullWin(player)) {
			if(player === "X") {
				document.getElementById("winner").innerHTML = "Player 1 has won!";	
			} else {
				document.getElementById("winner").innerHTML = "Player 2 has won!";
			}			
			finished = true;
		}
	}

	//switch the player
	if(player === "O") {
		document.getElementById("currentPlayer").style.color = "red";
		document.getElementById("currentPlayer").innerHTML = "Player 1";
		player = "X";
	} else {
		document.getElementById("currentPlayer").style.color = "blue";
		document.getElementById("currentPlayer").innerHTML = "Player 2";
		player = "O";
	}
    };

    var reset = function() {
	var one, two, three, four, five, six, seven, eight, nine;
	one = 0;
	two = 0;
	three = 0;
	four = 0;
	five = 0;
	six = 0;
	seven = 0;
	eight = 0;
	nine = 0;

	//recreate the board
	var full = document.getElementById("full");
	full.innerHTML = "";
	full.appendChild(makeRow(0));
	full.appendChild(makeRow(3));
	full.appendChild(makeRow(6));
	
	//player 1 goes first
	document.getElementById("currentPlayer").style.color = "red";
	document.getElementById("currentPlayer").innerHTML = "Player 1";
	player = "X";
        nextBoard = "";

	document.getElementById("winner").innerHTML = "";
	finished = false;
    };

    //listener for clicks on board
    full = document.getElementById("full");
    full.addEventListener("click", singleMove);
    
    //listener for clicks on reset button
    resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", reset);    

};
gamePlay();
