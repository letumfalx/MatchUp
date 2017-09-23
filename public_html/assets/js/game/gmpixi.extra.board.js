
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'Board', {
    enumerable: true,
    value: function (s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        //row and col count
        this.c = {
            r: 9,
            c: 9
        };
        
        //create the block grid
        this.block = [];
        for(var m=0; m<this.c.c; ++m) {
            this.block.push([]);
            for(var n=0; n<this.c.r; ++n) {
                var blk = new GMPixi.extra.Block({
                    room: this.room,
                    board: this,
                    index: { x: m, y: n }
                });
                blk.setLocation(blk.width * m, blk.height * n);
                
                //adds to this container and to the array
                this.addChild(blk);
                this.block[m].push(blk);
            }
        }
        
        //create the container for gem for fast clearing when reset
        this.gems = new PIXI.Container();
        this.addChild(this.gems);
        
        //getter and setter for enabled (the interactive property of 
        //board and the blocks
        Object.defineProperty(this, 'enabled', {
            get: function() {
                return this.interactive;
            }.bind(this),
            set: function(val) {
                this.interactive = val;
                for(var m=0; m<this.c.c; ++m) {
                    for(var n=0; n<this.c.r; ++n) {
                        this.block[m][n].interactive = val;
                    }
                }
            }.bind(this)
        });
        
        //the animation groups
        this.animation = {
            enter: [],
            entering: []
        };
        
        this.on('pointerupoutside', function() {
            this.clicked = null;
        }.bind(this));
        
        Object.defineProperty(this, 'animating', {
            get: function() {
                for(var m=0; m<this.c.c; ++m) {
                    for(var n=0; n<this.c.r; ++n) {
                        if(this.block[m][n].gem !== null) {
                            if(this.block[m][n].gem.animating) return true;
                        }
                    }
                }
                return false;
            }.bind(this)
        });
        Object.defineProperty(this, 'hasNull', {
            get: function() {
                var b = false;
                for(var m=0; m<this.c.c; ++m) {
                    for(var n=0; n<this.c.r; ++n) {
                        b = b || this.block[m][n].gem === null;
                    }
                }
                return b;
            }.bind(this)
        });
        
        
    }
});

Object.defineProperty(GMPixi.extra.Board, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.Board.prototype, {
    reset: {
        value: function() {
            //interactive to false
            this.enabled = false;
            
            //clear all gems
            this.gems.removeChildren();
            
            //do the reset of the remaining children
            for(var k in this.children) {
                if(GMPixi.checkType(this.children[k].reset, Function)) {
                    this.children[k].reset();
                }
            }
            
            //other reset here
            
            //clear all animation groups
            for(var k in this.animations) {
                this.animations[k] = [];
            }
            
            //reset the clicked block
            this.clicked = null;
            this.firstTime = true;
            this.asda = false;
            this.createIndex = 1;
        }
    },
    update: {
        value: function() {
            //update all children
            for(var k in this.children) {
                if(GMPixi.checkType(this.children[k].update, Function)) {
                    this.children[k].update();
                }
            }
            
            //update all gems
            for(var k in this.gems.children) {
                if(GMPixi.checkType(this.gems.children[k].update, Function)) {
                    this.gems.children[k].update();
                }
            }
            
            //create on the top if something is missing
            for(var m=0; m<this.c.c; ++m) {
                if(this.block[m][0].gem === null) {
                    //create a gem there
                    this.createGem(m);
                }
            }
            
            if(this.animation.enter.length > 0) {
                var obj = this.animation.enter.splice(0, 1)[0];
                obj.animate.entrance = true;
                this.animation.entering.push(obj);
            }
            
            //if entering animation is all complete, start game ticking
            if(this.animation.entering.length <= 0
                    && this.animation.enter.length <= 0 && this.firstTime) {
                
                this.room.pause = false;
                this.firstTime = false;
            }
            
            if(!this.animating) {
                    //first check here
                var d = this.checkAllMatch();
                if(d.length > 0) {
                    for(var k in d) {
                        if(d[k].animate.destroy) continue;
                        d[k].animate.destroy = true;
                    }
                }
                else {
                    if(!this.checkPlayable()) {
                        this.reshuffle();
                    }
                }
                this.enabled = !this.room.pause;
            }
            else {
                this.enabled = false;
            }
        }
    },
    checkAllMatch: {
        value: function() {
            
            if(this.hasNull) return [];
            
            var toDestroy = [];
            
            //check all horizontal first
            for(var y=0; y<this.c.r; ++y) {
                for(var x=0; x<this.c.c;) {
                    var c = this.block[x][y].gem;
                    var tmp = [c];
                    for(var z=x; z<this.c.c;) {
                        var n = this.block[z++][y].gem;
                        if(n.type !== c.type) {
                            z--;
                            break;
                        }
                        tmp.push(n);
                    }
                    var t = z - x;
                    if(t > 2) {
                        var pt = 100 * t;
                        pt *= t > 3 ? t > 4 ? 3 : 2 : 1;
                        this.addScore(pt);
                        toDestroy = toDestroy.concat(tmp);
                    }
                    x = z;
                }
            }
            
            //then vertical
            for(var x=0; x<this.c.c; ++x) {
                for(var y=0; y<this.c.r;) {
                    var c = this.block[x][y].gem;
                    var tmp = [c];
                    for(var z=y; z<this.c.r; ) {
                        var n = this.block[x][z++].gem;
                        if(n.type !== c.type) {
                            z--;
                            break;
                        }
                        tmp.push(n);
                    }
                    var t = z - y;
                    if(t > 2) {
                        var pt = 100 * t;
                        pt *= t > 3 ? t > 4 ? 3 : 2 : 1;
                        this.addScore(pt);
                        toDestroy = toDestroy.concat(tmp);
                    }
                    y = z;
                }
            }
            
            return toDestroy;
        }
    },
    checkPlayable: {
        value: function() {
            
            if(this.hasNull) return true;
            
            for(var x=0; x<this.c.c; ++x) {
                for(var y=0; y<this.c.r; ++y) {
                    
                    //swap horizontal first
                    //store types of two to be swapped
                    
                    var atype = this.block[x][y].gem.type;
                    var btype = x+1 < this.c.c ? this.block[x+1][y].gem.type : 0;
                    
                    if(btype > 0) {
                        this.block[x][y].gem.type = btype;
                        this.block[x+1][y].gem.type = atype;
                        
                        if(this.checkMatch(x, y, this.block[x][y].gem.type)) {
                            this.block[x][y].gem.type = atype;
                            this.block[x+1][y].gem.type = btype;
                            return true;
                        }
                        
                        if(this.checkMatch(x+1, y, this.block[x+1][y].gem.type)) {
                            this.block[x][y].gem.type = atype;
                            this.block[x+1][y].gem.type = btype;
                            return true;
                        }
                        
                        this.block[x][y].gem.type = atype;
                        this.block[x+1][y].gem.type = btype;
                    }
                    else {
                        if(this.checkMatch(x, y, this.block[x][y].gem.type)) {
                            return true;
                        }
                    }
                    
                    btype = y+1 < this.c.r ? this.block[x][y+1].gem.type : 0;
                    
                    if(btype > 0) {
                        this.block[x][y].gem.type = btype;
                        this.block[x][y+1].gem.type = atype;
                        
                        if(this.checkMatch(x, y, this.block[x][y].gem.type)) {
                            this.block[x][y].gem.type = atype;
                            this.block[x][y+1].gem.type = btype;
                            return true;
                        }
                        
                        if(this.checkMatch(x, y+1, this.block[x][y+1].gem.type)) {
                            this.block[x][y].gem.type = atype;
                            this.block[x][y+1].gem.type = btype;
                            return true;
                        }
                        this.block[x][y].gem.type = atype;
                        this.block[x][y+1].gem.type = btype;
                    }
                    else {
                        if(this.checkMatch(x, y, this.block[x][y].gem.type)) {
                            return true;
                        }
                    }
                }
            }
            
            //no matches return false
            return false;
            
        }
    },
    reshuffle: {
        value: function() {
            for(var x=0; x<this.c.c; ++x) {
                for(var y=0; y<this.c.r; ++y) {
                    if(!this.block[x][y].gem.animate.destroy) {
                        this.block[x][y].gem.animate.destroy = true;
                    }
//                    this.block[x][y].gem.type = GMPixi.Math.random(1, 6);
                }
            }
        }
    },
    checkMatch: {
        value: function(x, y, type) {
            
            //check horizontal first
            var h = 1;
            
            //left
            for(var a=x-1; a>=0; --a) {
                if(this.block[a][y].gem.type !== type) break;
                if(++h > 2) {
                    return true;
                }
            }
            //right
            for(var a=x+1; a<this.c.c; ++a) {
                if(this.block[a][y].gem.type !== type) break;
                if(++h > 2) {
                    return true;
                }
            }
            
            //vertical
            var v = 1;

            //up
            for(var b=y-1; b>=0; --b) {
                        
                if(this.block[x][b].gem.type !== type) break;
                if(++v > 2) {
                    return true;
                }
            }

            //down
            for(var b=y+1; b<this.c.r; ++b) {
                if(this.block[x][b].gem.type !== type) break;
                if(++v > 2) {
                    return true;
                }
            }
            
            //if will not match
            return false;
        }
    },
    createGem: {
        value: function(m) {
            //creates the gem
            var obj = new GMPixi.extra.Gem({
                room: this.room,
                board: this,
                index: { x: m, y: 0 }
            });
            
            //reset gem
            obj.reset();
            
            //set random value
            obj.type = GMPixi.Math.random(1,6);
//            obj.type = (this.createIndex++ % 6) + 1;
            //set the position
            obj.position.set(this.block[m][0].loc.x, this.block[m][0].loc.y);
            
            //adds to the group entering
            this.animation.enter.push(obj);
            
            //adds to this container
            this.gems.addChild(obj);

            //set the pointer
            this.block[m][0].gem = obj;
            
            return obj;
        }
    }
});


