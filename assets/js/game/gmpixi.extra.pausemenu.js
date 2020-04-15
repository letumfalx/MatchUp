
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'PauseMenu', {
    enumerable: true,
    value: function PauseMenu(s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        //set something
        /**
         * Goto after the animation
         * 0    -   resume
         * 1    -   restart
         * -1   -   main menu
         */
        this.goto = 0;
        
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
        this.menu.addChild(new PIXI.Sprite(this.room.textures('pause_menu')));
        this.menu.width = this.menu.children[0].width;
        this.menu.height = this.menu.children[0].height;
        
        this.menu.pivot.x = this.menu.width/2;
        this.menu.pivot.y = this.menu.height/2;
        
        var text = new PIXI.Text("Paused!", {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 21,
            fontWeight: 600
        });
        text.x = this.menu.width/2;
        text.y = this.menu.height * 0.1;
        text.anchor.set(0.5);
        this.menu.addChild(text);
        
        this.button = Object.create(null);
        
        //resume button
        this.button.resume = new GMPixi.extra.MenuButton({
            room: this.room,
            text: "Resume"
        });
        this.button.resume.position.set(this.menu.width/2, 
                this.menu.height *0.375);
        
        /**
         * Events for button resume
         */
        this.button.resume.on('pointerup', function() {
            this.exit = true;
            this.goto = 0;
            this.enabled = false;
        }.bind(this));
        
        
        //restart button
        this.button.restart = new GMPixi.extra.MenuButton({
            room: this.room,
            text: "Restart"
        });
        this.button.restart.position.set(this.menu.width/2, 
                this.menu.height *0.6);
        
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
                this.menu.height *0.825);
        
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
        this.menu.addChild(this.button.resume, 
                this.button.restart, this.button.exit);
        
        this.addChild(this.menu);
        
        this.menu.position.set(this.room.width/2, this.room.height/2);
        
        
        //the interactivity
        var enability = false;
        Object.defineProperty(this, 'enabled', {
            get: function() {
                return enability;
            },
            set: function(val) {
                this.button.exit.interactive = val;
                this.button.resume.interactive = val;
                this.button.restart.interactive = val;
                enability = val;
            }.bind(this)
        });
        
    }
});

Object.defineProperty(GMPixi.extra.PauseMenu, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.PauseMenu.prototype, {
    reset: {
        value: function() {
            this.theMask.alpha = 0;
            this.menu.scale.set(0);
            this.animate = false;
            this.exit = false;
            
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
                    this.theMask.alpha += 0.05;
                }
                else if(this.theMask.alpha >= 0.75 && this.menu.scale.x < 1) {
                    this.theMask.alpha = 0.75;
                    this.menu.scale.x += 0.075;
                    this.menu.scale.y = this.menu.scale.x;
                }
                else if(this.menu.scale.x >= 1) {
                    this.menu.scale.x = 1;
                    this.menu.scale.x = this.menu.scale.y;
                    this.enabled = true;
                    this.animate = false;
                }
            }
            else if(this.exit) {
                if(this.menu.scale.x > 0) {
                    this.menu.scale.x -= 0.09;
                    this.menu.scale.y = this.menu.scale.x;
                }
                else if(this.menu.scale.x <= 0 && this.theMask.alpha > 0) {
                    this.menu.scale.x = 0;
                    this.menu.scale.y = this.menu.scale.x;
                    
                    
                    if(this.goto === 0) {
                        this.theMask.alpha -= 0.1;
                    }
                    else {
                        this.theMask.alpha += 0.05;
                        if(this.theMask.alpha >= 1) {
                            this.theMask.alpha = 1;
                        }
                        if(this.goto > 0) {
                            this.room.pause = false;
                            this.exit = false;
                            this.room.change('game');
                        }
                        else {
                            this.room.pause = false;
                            this.exit = false;
                            this.room.change('title');
                        }
                    }
                    
                }
                else if(this.theMask.alpha <= 0) {
                    this.theMask.alpha = 0;
                    this.room.pause = false;
                    this.exit = false;
                    
                }
            }
        }
    }
});