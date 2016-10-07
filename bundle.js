(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const Pipe = require('./pipe');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var nextPipe = document.getElementById('nextPipe')
var image = new Image();
image.src = 'assets/pipes.png';
var horizontalImage = new Image();
horizontalImage.src = 'assets/pipes-straight.png';
buildClickableGrid(canvas);

var clickX, clickY; //where the user clicked
var pipes = []; //array of pipes
var score = 0;
var level = 0;

var backgroundMusic = new Audio('assets/audio/background_music.mp3');
var placePipe = new Audio('assets/audio/placePipe.wav');
var rotatePipe = new Audio('assets/audio/rotatePipe.wav');
var winning = new Audio('assets/audio/victory.wav');
var loosing = new Audio('assets/audio/loss.wav');

pipes.push(new Pipe({x: 0*80+3, y: 2*80+3, source: true}, horizontalImage));
pipes.push(new Pipe({x: 9*80+3, y: 0*80+3, sink: true}, horizontalImage));


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
    placePipe.play();
    pipes.push(new Pipe({x: tempX, y: tempY}, horizontalImage));
  }

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
  nextPipe.src = horizontalImage.src;

  //audio
  if(backgroundMusic.ended){
    backgroundMusic.play();
  }

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
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, canvas.width - 80, canvas.height - 5);
  ctx.fillText("Level: " + level, 10, canvas.height - 5);
}

function buildClickableGrid(canvas){
  //original has a width of 10, height of 7
  var cH = canvas.height;
  var cW = canvas.width;
  var sideLength = 25;
  var cells = [];
}

},{"./game":2,"./pipe":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Pipe;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Pipe(position, image = new Image(), imageSource="") {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  if (image){
    this.spritesheet  = image;
  }
  else if (imageSource){
    this.spritesheet.src = encodeURI(image);
  }

  this.timer = 0;
  this.frame = 0;
  this.source = position.source;
  this.sink = position.sink;
  this.canRotate = true;
  this.CurvedPipe = false;
  this.startPipe = false;
  this.fourWayPipe = false;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pipe.prototype.update = function(time) {

}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Pipe.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y+10, 140, 140
    );
  }

},{}]},{},[1]);
