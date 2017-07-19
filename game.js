
var dimension = 600;
var noOfLinesToBeDrawn = 5;
//var height = 600;
var PERSON_COUNT = 0;
var PLAYERS_LIST = new Array();
var USED_AVATAR_ID_LIST = new Array();
//special cells
//(0,2) (2,0) (2,2) (4,2) (2,4)
var CURRENT_PLAYER_INDEX = 0;
var specialCellList = new Array("0,2","2,0","2,2","4,2","2,4");
/*
				Path3
		     _  _  _   _  _
		 	|00 01 02 03 04|
			|10 11 12 13 14|
	   Path4|20 21 22 23 24| Path2
			|30 31 32 33 34|
			|40 41 42 43 44|
				  Path1
*/
var PATHS_LIST = [
					["42","43","44","34","24","14","04","03","02","01","00","10","20","30","40","41","31","21","11","12","13","23","33","32","22"],//path1
					["24","14","04","03","02","01","00","10","20","30","40","41","42","43","44","34","33","32","31","21","11","12","13","23","22"],//path2
					["02","01","00","10","20","30","40","41","42","43","44","34","24","14","04","03","13","23","33","32","31","21","11","12","22"],//path3
					["20","30","40","41","42","43","44","34","24","14","04","03","02","01","00","10","11","12","13","23","33","32","31","21","22"] //path4
				 ];
//TODO allow spectators, they can join a player, they should also be able to join game in case some one becomes inactive

var PLAYER_ITEM_STATE = {
	HOME : 0,
	STABLE : 1, 
	UNSTABLE : 2,
	FINISH : 3
};
var PLAYER_STATE = {
	JOINED : 0,
	ACTIVE : 1,
	FINISHED : 2,
	INACTIVE : 3
}
var BOARD_STATE = {
	ACTIVE : 0,
	INACTIVE : 1,
	STORED : 2 // TODO : can allow half finished games
};
var FINISHED_COUNT = 0;

var DICE = new Array();// array which hold state of each dice item

window.onload = function(){
	
	//code to draw the board
	drawTableBoard();
//	addPlayerToGame(new Player("Pralhad","10"));
//	addPlayerToGame(new Player("Pralhad","11"));
//	addPlayerToGame(new Player("Pralhad","12"));
//	addPlayerToGame(new Player("Pralhad","13"));
//	console.log(PLAYERS_LIST);
//	console.log(USED_AVATAR_ID_LIST);
//  testPlayerPath(PLAYERS_LIST[0]);
	document.addEventListener("click",handleClickEvent);
}

function handleClickEvent(event){
	console.log(event.target);
	let isSpan = event.target.tagName === "SPAN";
	let isImage = event.target.tagName === "IMG";
	let isLI = event.target.tagName === "LI";
	removeSelectionOnAllPawns();
	if(isSpan || isImage){
		let toBeProcessedTag = event.target;

		if(isImage){
			toBeProcessedTag = event.target.parentElement;
		}
		let personId = toBeProcessedTag.personId;
		//check if current player has clicked on pawn
		if(personId !== CURRENT_PLAYER_INDEX){
			alert("This is not your turn. Wait for " + PLAYERS_LIST[CURRENT_PLAYER_INDEX].name + " to move");
			return;
		}
		// check if he rolled dice
		if(PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList.length === 0){
			alert("You did not roll dice!!");
			return;
		}
		toBeProcessedTag.classList.add("pawn-higlighted");
		let menu = toBeProcessedTag.querySelector(".menu");
		for(let i = 0; i < PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList.length ; i++){
			let li = document.createElement("li");
			li.classList.add("menu-item");
			li.setAttribute("moveDistance",PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList[i]);
			li.setAttribute("pawnId",toBeProcessedTag.itemId);
			li.innerHTML = "Move " + PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList[i] +" places";
			menu.appendChild(li);
		}
		menu.classList.add("menu-visible");
		//add menu to current span now
		//let itemId = toBeProcessedTag.itemId;
		//let currentDiceValue = PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList[0];
		//let toBeMovePlayerItem = PLAYERS_LIST[CURRENT_PLAYER_INDEX].playerItemList[itemId];
		//toBeMovePlayerItem.distanceFromHome += currentDiceValue;
		//let nextLocation = PATHS_LIST[PLAYERS_LIST[CURRENT_PLAYER_INDEX].homeIndex][toBeMovePlayerItem.distanceFromHome];
		//toBeMovePlayerItem.moveTo(nextLocation);
		//
		//CURRENT_PLAYER_INDEX++;
		//if(CURRENT_PLAYER_INDEX >= PERSON_COUNT)
		//	CURRENT_PLAYER_INDEX = 0;
		//PLAYERS_LIST[CURRENT_PLAYER_INDEX].play(); //thinking by this time item is moved
	}
	
	if(isLI){
		//alert("LI is clicked");
		let moveDistance = parseInt(event.target.getAttribute("moveDistance"));
		//calculate the final cell of this player
		let pawnId = event.target.getAttribute("pawnId");
		let toBeMovePlayerItem = PLAYERS_LIST[CURRENT_PLAYER_INDEX].playerItemList[pawnId];
		toBeMovePlayerItem.distanceFromHome += moveDistance;
		let nextLocation = PATHS_LIST[PLAYERS_LIST[CURRENT_PLAYER_INDEX].homeIndex][toBeMovePlayerItem.distanceFromHome];
		toBeMovePlayerItem.moveTo(nextLocation);
		
		var index = PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList.indexOf(moveDistance);
		PLAYERS_LIST[CURRENT_PLAYER_INDEX].toBeMovedList.splice(index, 1);

		CURRENT_PLAYER_INDEX++;
		if(CURRENT_PLAYER_INDEX >= PERSON_COUNT)
			CURRENT_PLAYER_INDEX = 0;
		PLAYERS_LIST[CURRENT_PLAYER_INDEX].play(); //thinking by this time item is moved
	}
}


function removeSelectionOnAllPawns(){
	var elems = document.querySelectorAll(".player-span")
		for(let i = 0 ; i < elems.length ; i++){
			elems[i].classList.remove("pawn-higlighted");
			var liList = document.getElementsByClassName("menu-item");
			for(let j = 0 ; j < liList.length ; j++)
				liList[j].parentNode.removeChild(liList[j]);
		}
			
}


function testPlayerPath(player){
	for(let j = 0 ; j < 25 ; j++){
		let cellId = PATHS_LIST[player.homeIndex][j];
		let currentCell = document.getElementById(cellId);
		currentCell.innerHTML = j;
	}
}

function startGame(){
	//alert("Starting game");
	if(PERSON_COUNT < 2)
		alert("Cannot start game, Add players from command.");
	console.log("Game started!!");
	PLAYERS_LIST[CURRENT_PLAYER_INDEX].play();
}



function drawTableBoard(){
	let table = document.createElement("table");
	for(let i = 0 ; i < noOfLinesToBeDrawn ;i++){
		let tr = document.createElement("tr");
		for(let j = 0 ; j < noOfLinesToBeDrawn ; j++){
			let td = document.createElement("td");
			td.className = "cell";
			td.id = i+""+j;
			if(i === 2 || j === 2){
				let searchString = i + "," + j;
				if(specialCellList.indexOf(searchString) !== -1){
					td.classList.add("safecell");
				}
			}
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	let dest = document.getElementById("table-board");	
	dest.appendChild(table);
}


 
//function addPlayerToGame(personObject){
function addPlayerToGame(){
	let name = prompt("What is your name??");
	let personObject = new Player(name,PERSON_COUNT);
	if(personObject.id > 3){
		//TODO : can add feature to replace existing player 
		//Player has to mark himself inactive to do this
		alert("No more than 4 people are allowed!! You may be specatator if you want");
		return;
	}
	if(USED_AVATAR_ID_LIST.indexOf(personObject.playerItemList[0].avatarId) !== -1){
		alert("Player Item avatar already used, Please use different one!!");
		return;
	}
		
	PLAYERS_LIST.push(personObject);
	USED_AVATAR_ID_LIST.push(personObject.playerItemList[0].avatarId);
	
	renderPersonInUI(personObject);
}
/*
	Factory genearating players
*/
var Player = function(name,avatarId){
	let personId = PERSON_COUNT++;
	let playerItemList = new Array();
	let homeIndex = 0;
	
	//block to assign home index
	switch(personId){
		case 0 :
			homeIndex = 0;
			break;
		case 1 :
			homeIndex = 2;
			break;
		case 2 :
			homeIndex = 1;
			break;
		case 3 :
			homeIndex = 3;
			break;
	}
			
	//block to create person play items
	for(let i = 0; i < 4;i++)
		playerItemList.push(new PlayItem(i,avatarId,personId));
	return {
		"name":name,
		"id":personId,
		"playerItemList":playerItemList,
		"playerState" : PLAYER_STATE.JOINED,
		"homeIndex" : homeIndex,
		"toBeMovedList" : new Array(),
		"play" : function(){
			let diceValue = rollDice();
			this.toBeMovedList.push(diceValue);
		}
	};
}

/*
	PlayItem Factory
	Pass id of the avatar you want to set for this player
*/
var PlayItem = function(itemId,avatarId,personId){
	return {
		"itemId" : itemId,
		"avatarId" : avatarId,
		"personId" : personId,
		"statePosition" : 0,
		"distanceFromHome" : 0,
		"itemState" : PLAYER_ITEM_STATE.HOME,
		"uiItem" : undefined,
		"createUIItem" : function(instanceId){
			//alert("I'll create UI items for player");
			this.uiItem = document.createElement("span");
			this.uiItem.classList.add("player-span");
			this.uiItem.personId = this.personId;
			this.uiItem.itemId = this.itemId;
			let pawnId = "person" + this.personId + "-pawn" + instanceId;
			//this.uiItem.innerHTML = pawnId;
			//<img class="manImg" src="images/ico_mandatory.gif"></img>
			let image = document.createElement("img");
			//for time being add different icons for different users
			//TODO think of better approach for this part
			let iconImage = "stone.png";
			switch(this.personId){
				case 0 : 
					iconImage = "stone.png";
					break;
				case 1 :
					iconImage = "grain.png";
					break;
				case 2 :
					iconImage = "flower.png";
					break;
				case 3 :
					iconImage = "stick.png";
					break;
			}
			image.src = iconImage;
			image.classList.add("player-icon");
			this.uiItem.appendChild(image);
			
			//create menu for each pawn
			let ul = document.createElement("ul");
			ul.classList.add("menu");
			this.uiItem.appendChild(ul);

			this.uiItem.id = pawnId;
		},
		"moveTo" : function(destinationCellId){
			//alert("This function will move the pawn");
			let destCell = document.getElementById(destinationCellId);
			destCell.appendChild(this.uiItem);
		}
	};
}


function rollDice(){
	DICE.length = 0; // clear the array
	let scoreHTML = document.getElementById("score");
	scoreHTML.innerHTML = "";
	for(let i = 0 ; i < 4; i++) {// there will be 4 dice
		DICE[i] = Math.floor((Math.random() * 10 ) % 2);
	}
	
	let value = 0;
	for(let i = 0 ; i < 4; i++) {// there will be 4 dice
		if(DICE[i] === 1) // 1 is white part
			value++;
	}
	if(value === 0 ) // all are black means it is 8
		value = 8;
	scoreHTML.innerHTML = "You Got : " + value;
	return value;
//	console.log(DICE);
//	console.log(value);
}

function renderPersonInUI(personObject){
	var homeCell = document.getElementById(PATHS_LIST[personObject.homeIndex][0]);
	PATHS_LIST[personObject.homeIndex][0];
	//homeCell.innerHTML = "Obj of " + personObject.id;
	for(let i = 0; i < 4;i++){
		personObject.playerItemList[i].createUIItem(i);
		personObject.playerItemList[i].moveTo(PATHS_LIST[personObject.homeIndex][0]);
	}
}

