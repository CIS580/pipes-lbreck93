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
