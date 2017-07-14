var canvas;
var ctx;
var dimension = 600;
var noOfLinesToBeDrawn = 5;
//var height = 600;
var PERSON_COUNT = 0;
var PLAYERS_LIST = new Array();
var USED_AVATAR_ID_LIST = new Array();
//special cells
//(0,2) (2,0) (2,2) (4,2) (2,4)
var specialCellList = new Array("0,2","2,0","2,2","4,2","2,4");

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

window.onload = function(){
	
	//code to draw the board
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    //drawBoard();
	drawTableBoard();
	addPlayerToGame(new Player("Pralhad","10"));
	addPlayerToGame(new Player("Pralhad","11"));
	addPlayerToGame(new Player("Pralhad","12"));
	addPlayerToGame(new Player("Pralhad","13"));
	console.log(PLAYERS_LIST);
	console.log(USED_AVATAR_ID_LIST);
}

function drawTableBoard(){
	let table = document.createElement("table");
	for(let i = 0 ; i < noOfLinesToBeDrawn ;i++){
		let tr = document.createElement("tr");
		for(let j = 0 ; j < noOfLinesToBeDrawn ; j++){
			let td = document.createElement("td");
			td.className = "cell";
			if(i === 2 || j === 2){
				let searchString = i + "," + j;
				if(specialCellList.indexOf(searchString) !== -1){
					td.className += " safecell";
				}
			}
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	let dest = document.getElementById("table-board");	
	dest.appendChild(table);
}
 
function addPlayerToGame(personObject){
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
}
/*
	Factory genearating players
*/
var Player = function(name,avatarId){
	let personId = PERSON_COUNT++;
	let playerItemList = new Array();
	for(let i = 0; i < 4;i++)
		playerItemList.push(new PlayItem(avatarId,personId));
	return {
		"name":name,
		"id":personId,
		"playerItemList":playerItemList,
		"playerState" : PLAYER_STATE.JOINED
	};
}

/*
	PlayItem Factory
	Pass id of the avatar you want to set for this player
*/
var PlayItem = function(avatarId,personId){
	return {
		"avatarId" : avatarId,
		"personId" : personId,
		"statePosition" : 0,
		"uiX" : 0,
		"uiY" : 0,
		"itemState" : PLAYER_ITEM_STATE.HOME
	};
}

/*
	Function to draw line between 2 points
*/
//function drawLine( fromX, fromY,  toX,  toY){
//    ctx.moveTo(fromX, fromY);
//    ctx.lineTo(toX,toY);
//    ctx.stroke();
//}

//function drawBoard(){
//	canvas.width = canvas.height = dimension;
//    var offset = dimension / noOfLinesToBeDrawn;
//    var startX = canvas.offsetLeft;
//    var startY = canvas.offsetTop;
//    
//    for(var i = 0; i <= noOfLinesToBeDrawn; i++){
//        drawLine(startX + (offset * i),
//                 startY,
//                 startX + (offset * i),
//                 startY + canvas.height
//                );
//		drawLine(startX,
//				 startY + (offset * i),
//				 startX + canvas.width,
//				 startY + (offset * i)
//				);
//    }
//}
