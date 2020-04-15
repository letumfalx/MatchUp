
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'Block', {
    enumerable: true,
    value: function (s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        //just for interactivity
        var g = new PIXI.Graphics();
        g.beginFill(0xffffff);
        g.drawRect(0, 0, this.room.width * 0.075, this.room.height * 0.08);
        g.endFill();
        this.addChild(g);
        this.scale.set(1);
        this.alpha = 0;
        
        //pointer to the outside board
        this.board = s.board;
        
        //index
        this.index = s.index;
        
        //the interactive event
        this.on('pointerdown', function(e) {
            //if not left button do nothing
            if(e.data.originalEvent.button !== 0) {
                return;
            }
            
            //set this as the source
            this.board.clicked = this;
        }.bind(this)).on('pointerup', function(e) {
            //if not left button do nothing
            if(e.data.originalEvent.button !== 0) return;
            
            //this block is the destination
            
            //check if there are inside the clicked or this is not the clicked
            if(this.board.clicked !== this && this.board.clicked !== null) {
                //check if it is nearby only and NEWS only no secondary dir
                var dx = this.board.clicked.index.x - this.index.x;
                var dy = this.board.clicked.index.y - this.index.y;
                
                
                if(GMPixi.Math.isOnRange(dx, -1, 1) 
                        && GMPixi.Math.isOnRange(dy, -1, 1) &&
                        Math.abs(dx) !== Math.abs(dy)) {
                    
                    //stores current indices of both this and the clicked
                    var ix = this.gem.index.x;
                    var iy = this.gem.index.y;
                    
                    var tx = this.board.clicked.gem.index.x;
                    var ty = this.board.clicked.gem.index.y;
                    
                    //sets their swap indices
                    this.gem.swap.x = tx;
                    this.gem.swap.y = ty;
                    
                    this.board.clicked.gem.swap.x = ix;
                    this.board.clicked.gem.swap.y = iy;
                    
                    //store their types t=this, c=clicked
                    var ttype = this.gem.type;
                    var ctype = this.board.clicked.gem.type;
                    
                    //swap types for checking purposes
                    this.board.clicked.gem.type = ttype;
                    this.gem.type = ctype;
                    
                    //check if the are matches
                    var clm = this.checkMatch(ix, iy, ctype);
                    var thm = this.checkMatch(tx, ty, ttype);
                    
                    //return to original the type
                    this.board.clicked.gem.type = ctype;
                    this.gem.type = ttype;
                    
                    //if ever there are matches, it can be swapped
                    if(clm || thm) {
                        
                        this.gem.animate.swap = true;
                        this.board.clicked.gem.animate.swap = true;
                    }
                    //else do swap but go back again
                    else {
                        this.gem.animate.back = true;
                        this.gem.back = false;
                        this.board.clicked.gem.animate.back = true;
                        this.board.clicked.gem.back = false;
                    }
                }
            }
            
            //set to null for next clicks
            this.board.clicked = null;
        }.bind(this));
    }
});

Object.defineProperty(GMPixi.extra.Block, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.Block.prototype, {
    reset: {
        value: function() {
            this.gem = null;
            this.interactive = false;
        }
    },
    update: {
        value: function() {
            //no update here
        }
    },
    setLocation: {
        value: function(x, y) {
            //the location where the block is located relative to the board
            this.position.set(x, y);
            
            //the location where the gem will go
            this.loc = {
                x: x + this.width/2,
                y: y + this.height/2
            };
        }
    },
    checkMatch: {
        value: function(x, y, type) {
            
            //check horizontal first
            var h = 1;  
            
            //left
            for(var a=x-1; a>=0; --a) {
                if(this.board.block[a][y].gem.type !== type) break;
                if(++h > 2) {
                    return true;
                }
            }
            //right
            for(var a=x+1; a<this.board.c.c; ++a) {
                if(this.board.block[a][y].gem.type !== type) break;
                if(++h > 2) {
                    return true;
                }
            }
            
            //vertical
            var v = 1;

            //up
            for(var b=y-1; b>=0; --b) {
                        
                if(this.board.block[x][b].gem.type !== type) break;
                if(++v > 2) {
                    return true;
                }
            }

            //down
            for(var b=y+1; b<this.board.c.r; ++b) {
                if(this.board.block[x][b].gem.type !== type) break;
                if(++v > 2) {
                    return true;
                }
            }
            
            //if will not match
            return false;
        }
    }
});