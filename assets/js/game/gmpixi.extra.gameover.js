


/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'GameOver', {
    enumerable: true,
    value: function GameOver(s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        this.goto = 0;
        
        //create the mask
        //adds the background dimmer
        this.theMask = new PIXI.Container();
        
        //adds the real mask
        var realMask = new PIXI.Graphics();
        realMask.beginFill(0x000000);
        realMask.drawRect(0, 0, this.room.width, this.room.height);
        realMask.endFill();
        this.theMask.addChild(realMask);
        
        this.addChild(this.theMask);
        
        //the container that contains the menu
        this.menu = new PIXI.Container();
        
        //adds the background
        this.menu.addChild(new PIXI.Sprite(this.room.textures('gameover_popup')));
        this.menu.width = this.room.textures('pause_menu').width;
        this.menu.height = this.room.textures('pause_menu').height;
        
        this.menu.pivot.x = this.menu.width/2;
        this.menu.pivot.y = this.menu.height/2;
        
        var text = new PIXI.Text("Game Over!", {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 20,
            fontWeight: 600
        });
        text.x = this.menu.width/2;
        text.y = this.menu.height * 0.1;
        text.anchor.set(0.5);
        this.menu.addChild(text);
        
        this.button = Object.create(null);
        
        //restart button
        this.button.restart = new GMPixi.extra.MenuButton({
            room: this.room,
            text: "Restart"
        });
        this.button.restart.position.set(this.menu.width/2, 
                this.menu.height *0.675);
        
        /**
         * What to do when clicked
         */
        this.button.restart.on('pointerup', function() {
            this.exit = true;
            this.goto = 1;
            this.enabled = false;
        }.bind(this));
        
        //exit button
        this.button.exit = new GMPixi.extra.MenuButton({
            room: this.room,
            text: "Exit"
        });
        this.button.exit.position.set(this.menu.width/2, 
                this.menu.height *0.875);
        
        /**
         * What to do when clicked
         */
        this.button.exit.on('pointerup', function() {
            this.exit = true;
            this.goto = -1;
            this.enabled = false;
        }.bind(this));
        
        /**
         * There is an error when adding child to this.menu separately
         * so add them all at once
         */
        this.menu.addChild(this.button.restart, this.button.exit);
        
        this.addChild(this.menu);
        
        this.menu.position.set(this.room.width/2, this.room.height/2);
        
        var pointTip = new PIXI.Text("Total Points:", {
            fill: 0xffff00,
            fontFamily: "Century Gothic",
            fontSize: 18
        });
        pointTip.position.set(this.menu.width/2, 
                this.menu.height * 0.35);
        pointTip.anchor.set(0.5);
        this.menu.addChild(pointTip);
        
        
        //the points
        this.points = Object.create(null);
        this.points.display = new PIXI.Text(0, {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 24
        });
        
        this.points.display.position.set(this.menu.width/2, 
                this.menu.height * 0.45);
        this.points.display.anchor.set(0.5);
        this.menu.addChild(this.points.display);
        
        var current_points = 0;
        Object.defineProperty(this.points, 'current', {
            get: function() {
                return current_points;
            },
            set: function(val) {
                current_points = val;
                this.points.display.text = val;
            }.bind(this)
        });
        
        
        //the interactivity
        var enability = false;
        Object.defineProperty(this, 'enabled', {
            get: function() {
                return enability;
            },
            set: function(val) {
                this.button.exit.interactive = val;
                this.button.restart.interactive = val;
                enability = val;
            }.bind(this)
        });
        
    }
});

Object.defineProperty(GMPixi.extra.GameOver, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.GameOver.prototype, {
    reset: {
        value: function() {
            this.theMask.alpha = 0;
            this.menu.y = -this.menu.height;
            
            this.animate = false;
            this.exit = false;
            
            this.points.target = -1;
            this.points.current = 0;
            this.points.store = 0;
            
            for(var i in this.menu.children) {
                if(GMPixi.checkType(this.menu.children[i].reset, Function)) {
                    this.menu.children[i].reset();
                }
            }
        }
    },
    update: {
        value: function() {
            if(this.animate) {
                if(this.theMask.alpha < 0.75) {
                    this.theMask.alpha += 0.08;
                }
                else if(this.menu.y < this.room.height/2) {
                    this.theMask.alpha = 0.75;
                    this.menu.y += 32;
                }
                else if(this.points.target < 0) {
                    this.menu.y = this.room.height/2;
                    this.points.target = this.points.store;
                } 
                else if(this.points.current < this.points.target) {
                    this.points.current += 1753;
                }
                else {
                    this.points.current = this.points.target;
                    this.enabled = true;
                    this.animate = false;
                }
            }
            else if(this.exit) {
                if(this.menu.y > -this.menu.height) {
                    this.menu.y -= 32;
                }
                else if(this.theMask.alpha < 1) {
                    this.theMask.alpha += 0.05;
                }
                else {
                    this.theMask.alpha = 1;
                    if(this.goto > 0) {
                        this.room.change('game');
                    }
                    else {
                        this.room.change('title');
                    }
                }
            }
        }
    }
});


