"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
buildClickableGrid(canvas);

var clickX, clickY;
var pipes = []; //array of pipes

pipes.push(new Pipe({x: 0*80+3, y: 2*80+3, source: true}, image));
pipes.push(new Pipe({x: 9*80+3, y: 0*80+3, sink: true}, image));


canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
  console.log(event);
  clickX = event.offsetX;
  clickY = event.offsetY;
  var x = Math.floor((clickX + 3) / 80);
  var y = Math.floor((clickY + 3) / 80);
  var tempX = x*80+3
  var tempY = y*80+3
  var valid = true;

  //is pipe is not laid on another pipe?
  pipes.forEach(function(p){
    if (valid && p.x == tempX && p.y == tempY){
      valid = false;
    }
  });//end foreach

  if (valid){
    pipes.push(new Pipe({x: tempX, y: tempY}, image));
  }
  console.log(pipes);
}//end canvas.onclick

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  //background
  ctx.fillStyle = "rgba(0, 0, 0, .87)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // TODO: Render the board
  //board sections
  for (var y=0; y<7; y++){
    for(var x=0; x<10; x++){
        ctx.fillStyle = "#fff";
        ctx.fillRect(x*80+3, y*80+3, 70, 70);
    }
  }
  //pipes
  pipes.forEach(function(pipe){pipe.render(elapsedTime, ctx);});
}

function buildClickableGrid(canvas){
  //original has a width of 10, height of 7
  var cH = canvas.height;
  var cW = canvas.width;
  var sideLength = 25;
  var cells = [];
}
