

/* global GMPixi, PIXI, Function */


var game;
window.addEventListener('load', function() {
    game = new GMPixi.Game({
        resource: ['assets/sprite/matchup.json'],
        preroom: function() {
            var textures = PIXI.loader
                    .resources['assets/sprite/matchup.json'].textures;
            this.room.textures = function(name) {
                return textures['asset_' + name + '.png'] || null;
            };
            //disabling context menu on right click
            this.renderer.view.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
        },
        room: {
            parent: 'game',
            renderer: 'canvas',
            width: 600,
            height: 550,
            position: 'center'
        },
        rooms: {
            title: {
                setup: function() {
                    
                    //adds the background, no need for reference
                    this.add(new PIXI.Sprite(this.room.textures('title_bg')));
                    
                    this.title = this.add(new GMPixi.extra.Title({
                        room: this.room,
                        next: {
                            animate: function() {
                                this.play.animate = true;
                            }.bind(this)
                        }
                    }), this.room.width/2, this.room.height * 0.4, 0.5);
                    
                    
                    this.play = this.add(new GMPixi.extra.BigButton({
                        room: this.room,
                        text: "Play!",
                        next: {
                            exit: function() {
                                this.exit = true;
                            }.bind(this)
                        }
                    }), this.room.width/2, this.room.height * 0.625, 0.5);
                    
                    this.play.on('pointerup', function() {
                        this.play.exit = true;
                    }.bind(this));
                },
                reset: function() {
                    this.isPressed = false;
                    this.animate = true;
                    this.exit = false;
                    this.alpha = 0;
                },
                update: function() {
                    
                    if(this.animate) {
                        this.alpha += 0.05;
                        if(this.alpha >= 1) {
                            this.alpha = 1;
                            this.animate = false;
                            this.title.animate = true;
                        }
                    } else if(this.exit) {
                        this.alpha -= 0.05;
                        if(this.alpha <= 0) {
                            this.alpha = 0;
                            this.exit = false;
                            this.room.change('game');
                        }
                    }
                }
            },
            game: {
                setup: function() {
                    
                    var pause = true;
                    Object.defineProperty(this.room, 'pause', {
                        enumerable: true,
                        get: function() {
                            return pause;
                        },
                        set: function(val) {
                            
                            pause = val;
                            this.pause.interactive = !pause;
                            
                        }.bind(this)
                    });
                    
                    //adds the background
                    this.add(new PIXI.Sprite(this.room.textures('bg')));
                    
                    //the score area
                    this.score = this.add(new GMPixi.extra.Score({
                        room: this.room
                    }), this.room.width * 0.125, this.room.height * 0.025);
                    
                    //the timer area
                    this.timer = this.add(new GMPixi.extra.Timer({
                        room: this.room,
                        expires: function() {
                            this.gameOver.points.store 
                                    = this.score.score.target;
                            this.room.pause = true;
                            this.gameOver.animate = true;
                        }.bind(this)
                    }), this.width * 0.475, this.height * 0.025);
                    
                    //pause button
                    this.pause = this.add(new GMPixi.extra.Pause({
                        room: this.room
                    }), this.room.width * 0.825, this.room.height * 0.075, 0.5);
                    
                    this.pause.on('pointerup', function() {
                        this.room.pause = true;
                        this.pauseMenu.animate = true;
                    }.bind(this));
                    
                    this.board = this.add(new GMPixi.extra.Board({
                        room: this.room
                    }), this.room.width * 0.1625, this.room.height * 0.178);
                    
                    this.board.addScore = function(val) {
                        this.score.score.target += val;
                    }.bind(this);
                    
                    this.pauseMenu = this.add(new GMPixi.extra.PauseMenu({
                        room: this.room
                    }));
                    
                    this.gameOver = this.add(new GMPixi.extra.GameOver({
                        room: this.room
                    }));
                    
                    
                },
                reset: function() {
                    this.room.pause = true;
                }
                
            }
        }
    });
});


