var canvas;
var ctx;
var dimension = 600;
var noOfLinesToBeDrawn = 5;
//var height = 600;
window.onload = function(){
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    canvas.width = canvas.height = dimension;
    var offset = dimension / noOfLinesToBeDrawn;
    //all vertical lines
     
    var startX = canvas.offsetLeft;
    var startY = canvas.offsetTop;
    
    for(var i = 0; i <= noOfLinesToBeDrawn; i++){
        drawLine(startX + (offset * i),
                 startY,
                 startX + (offset * i),
                 startY + canvas.height
                );
		drawLine(startX,
				 startY + (offset * i),
				 startX + canvas.width,
				 startY + (offset * i)
				);
    }
}
/*
	Function to draw line between 2 points
*/
function drawLine( fromX, fromY,  toX,  toY){
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX,toY);
    ctx.stroke();
}