
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'Gem', {
    enumerable: true,
    value: function Gem(s) {
        this.room = s.room;
        PIXI.Sprite.call(this);
        
        //this objects properties
        this.anchor.set(0.5);
        
        this.board = s.board;
        
        //stores the coordinates where to fall next
        this.target = {x: 0, y: 0};
        
        //the current position
        this.index = Object.create(null);
        
        //also updates target when index is updated
        Object.defineProperties(this.index, {
            x: {
                get: function() {
                    return s.index.x;
                },
                set: function(ix) {
                    this.target.x = ix;
                    s.index.x = ix;
                }.bind(this)
            },
            y: {
                get: function() {
                    return s.index.y;
                },
                set: function(iy) {
                    this.target.y = iy + 1;
                    s.index.y = iy;
                }.bind(this)
            },
            set: {
                value: function(x, y) {
                    this.index.x = x;
                    this.index.y = y;
                }.bind(this)
            }
        });
        
        //initial update
        this.index.set(s.index.x, s.index.y);
        
        //coordinate of the gem to be swapped with
        this.swap = { x: -1, y: -1};
        
        //check if going back(true) or going forward(false)
        this.back = false;
        
        //the type of this gem
        var type = 0;
        
        //also update the texture when type is changed
        Object.defineProperty(this, 'type', {
            get: function() {
                return type;
            },
            set: function(index) {
                type = index;
                this.setTexture(index > 0 ? this.room.textures('gem' + index) 
                        : null);
            }.bind(this)
        });
        
        //the object group for animation
        this.animate = Object.create(null);
        
        //check if this gem is in animation or not
        Object.defineProperty(this, 'animating', {
            get: function() {
                var b = false;
                for(var k in this.animate) {
                    b = b || this.animate[k];
                }
                return b;
            }.bind(this)
        });
        
    }
});

Object.defineProperty(GMPixi.extra.Gem, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.extra.Gem.prototype, {
    reset: {
        value: function() {
            this.type = 0;
            
            //set scale to 0
            this.scale.set(0);
            
            //resets all animation to false
            this.animate.entrance = false;
            this.animate.fall = false;
            this.animate.destroy = false;
            this.animate.swap = false;
            this.animate.back = false;
        }
    },
    update: {
        value: function() {
            
            //entrance will be scaling up
            if(this.animate.entrance) {
                if(this.scale.x < 1) {
                    this.scale.x += 0.125;
                    this.scale.y = this.scale.x;
                }
                else {
                    this.scale.set(1);
                    this.animate.entrance = false;
                    this.board.animation.entering.splice(
                            this.board.animation.entering.indexOf(this), 1);
                }
            } 
            
            //falling down if target is null
            else if(this.animate.fall) {
                if(this.y < this.board.block[this.target.x][this.target.y].loc.y) {
                    this.y += 15;
                    //sets the target's gem to this to avoid some conflict
                    this.board.block[this.target.x][this.target.y].gem = this;
                }
                else {
                    //clamps this y to target's y
                    this.y = this.board.block[this.target.x][this.target.y].loc.y;
                    
                    //makes the former block location to null to make other fall for it
                    this.board.block[this.index.x][this.index.y].gem = null;
                    
                    //uncomment this if something unexpected happens
                    //this.board.block[this.target.x][this.target.y].gem = this;
                    
                    //set current index to the target's
                    this.index.set(this.target.x, this.target.y);
                    //end fall animation
                    this.animate.fall = false;
                }
            }
            else if(this.animate.swap) {
                var dest = this.board.block[this.swap.x][this.swap.y];
                
                //check if swapping is horizontal or vertical
                if(dest.index.x !== this.index.x) {     //horizontal
                    //move to left or right base on index x
                    this.x += dest.index.x > this.index.x ? 8 : -8;
                    
                    //if ever reaches the destination swap info here then end swap
                    if(dest.index.x > this.index.x ? dest.loc.x <= this.x : dest.loc.x >= this.x) {
                        this.x = dest.loc.x;
                        this.index.set(this.swap.x, this.swap.y);
                        this.board.block[this.index.x][this.index.y].gem = this;
                        this.animate.swap = false;
                    }
                }
                else {  //vertical
                    //move up or down base on index y
                    this.y += dest.index.y > this.index.y ? 8 : -8;
                    
                    //if ever reaches the destination swap info here then end swap
                    if(dest.index.y > this.index.y ? dest.loc.y <= this.y : dest.loc.y >= this.y) {
                        this.y = dest.loc.y;
                        this.index.set(this.swap.x, this.swap.y);
                        this.board.block[this.index.x][this.index.y].gem = this;
                        this.animate.swap = false;
                    }
                }
                
            }
            else if(this.animate.back) {
                if(!this.back) {
                    var dest = this.board.block[this.swap.x][this.swap.y];

                    //check if swapping is horizontal or vertical
                    if(dest.index.x !== this.index.x) {     //horizontal
                        //move to left or right base on index x
                        this.x += dest.index.x > this.index.x ? 8 : -8;

                        //if ever reaches the destination swap info here then end swap
                        if(dest.index.x > this.index.x ? dest.loc.x <= this.x : dest.loc.x >= this.x) {
                            this.x = dest.loc.x;
                            this.back = true;
                        }
                    }
                    else {  //vertical
                        //move up or down base on index y
                        this.y += dest.index.y > this.index.y ? 8 : -8;

                        //if ever reaches the destination swap info here then end swap
                        if(dest.index.y > this.index.y ? dest.loc.y <= this.y : dest.loc.y >= this.y) {
                            this.y = dest.loc.y;
                            this.back = true;
                        }
                    }
                }
                else {
                    var dest = this.board.block[this.index.x][this.index.y];

                    //check if swapping is horizontal or vertical
                    if(dest.index.x !== this.swap.x) {     //horizontal
                        //move to left or right base on index x
                        this.x += dest.index.x > this.swap.x ? 8 : -8;

                        //if ever reaches the destination swap info here then end swap
                        if(dest.index.x > this.swap.x ? dest.loc.x <= this.x : dest.loc.x >= this.x) {
                            this.x = dest.loc.x;
                            this.animate.back = false;
                        }
                    }
                    else {  //vertical
                        //move up or down base on index y
                        this.y += dest.index.y > this.swap.y ? 8 : -8;

                        //if ever reaches the destination swap info here then end swap
                        if(dest.index.y > this.swap.y ? dest.loc.y <= this.y : dest.loc.y >= this.y) {
                            this.y = dest.loc.y;
                            this.animate.back = false;
                        }
                    }
                }
            }
            else if(this.animate.destroy) {
                //fade-out animation
                if(this.alpha > 0) {
                    this.alpha -= 0.125;
                }
                else {
                    this.alpha = 0;
                    
                    //removes to the game
                    this.board.gems.removeChild(this);
                    this.board.block[this.index.x][this.index.y].gem = null;
                    this.animate.destroy = false;
                }
            }
            else {
                if(this.index.y < this.board.c.r - 1) {
                    if(this.board.block[this.target.x][this.target.y].gem === null) {
                        this.animate.fall = true;
                    }
                }
            }
            
        }
    },
    setLocation: {
        value: function(x, y) {
            var loc = this.board.block[x][y].loc;
            this.position.set(loc.x, loc.y);
        }
    }
});



/*
 else if(this.animate.swap) {
                //check if target is being destroyed
                if(this.board.block[this.swap.x][this.swap.y].current.animate.destroy) {
                    //do not swap
                    this.animate.swap = false;
                    return;
                }
                
                if(this.swap.dir === 1) {
                    if(this.x < this.board.block[this.swap.x][this.swap.y].x) {
                        this.x += 12;
                    }
                    else {
                        this.x = this.board.block[this.swap.x][this.swap.y].x;
                        this.animate.swap = false;
                        
                        //swap board block current
                        this.swapBlock(this.index.x, this.index.y, 
                                this.swap.x, this.swap.y);
                        
                    }
                }
                else if(this.swap.dir === -1) {
                    if(this.x > this.board.block[this.swap.x][this.swap.y].x) {
                        this.x -= 12;
                    }
                    else {
                        this.x = this.board.block[this.swap.x][this.swap.y].x;
                        this.animate.swap = false;
                        //swap board block current
                        this.swapBlock(this.index.x, this.index.y, 
                                this.swap.x, this.swap.y);
                    }
                }
                else if(this.swap.dir === 2) {
                    if(this.y < this.board.block[this.swap.x][this.swap.y].y) {
                        this.y += 12;
                    }
                    else {
                        this.y = this.board.block[this.swap.x][this.swap.y].y;
                        this.animate.swap = false;
                        //swap board block current
                        this.swapBlock(this.index.x, this.index.y, 
                                this.swap.x, this.swap.y);
                    }
                }
                else {
                    if(this.y > this.board.block[this.swap.x][this.swap.y].y) {
                        this.y -= 12;
                    }
                    else {
                        this.y = this.board.block[this.swap.x][this.swap.y].y;
                        this.animate.swap = false;
                        //swap board block current
                        this.swapBlock(this.index.x, this.index.y, 
                                this.swap.x, this.swap.y);
                             
                    }
                }
                
            }
 */