/* global PIXI */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'BigButton', {
    enumerable: true,
    value: function BigButton(s) {
        
        PIXI.Container.call(this);
        
        //sets the global room variable
        this.room = s.room;
        
        //if ever an animation ends what to do next
        this.next = s.next;
        
        //create the button sprite
        this.button = new PIXI.Sprite();
        
        Object.defineProperty(this.button, 'sprites', {
            value: {
                press: this.room.textures('large_btn_down'),
                release: this.room.textures('large_btn_up')
            }
        });
        
        this.addChild(this.button);
        
        //set container width and height
        this.width = this.button.sprites.press.width;
        this.height = this.button.sprites.press.height;
        
        this.pivot.x = this.width/2;
        this.pivot.y = this.height/2;
        
        var txt = new PIXI.Text(s.text, {
            fill: 0xeeeeee,
            fontFamily: "Century Gothic",
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 37
        });
        
        txt.position.set(this.width/2, this.height/2);
        txt.anchor.set(0.5);
        
        //add txt to the container
        this.addChild(txt);
        
        this.on('pointerdown', function() {
            this.isPressed = true;
            this.press();
        }.bind(this)).on('pointerup', function() {
            this.isPressed = false;
            this.release();
        }.bind(this)).on('pointerupoutside', function() {
            this.isPressed = false;
            this.release();
        }.bind(this)).on('pointerover', function() {
            if(this.isPressed) this.press();
        }.bind(this)).on('pointerout', function() {
            this.release();
        }.bind(this));
        
    }
});

Object.defineProperty(GMPixi.extra.BigButton, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.BigButton.prototype, {
    reset: {
        value: function() {
            this.button.setTexture(this.button.sprites.release);
            this.scale.set(0);
            this.interactive = false;
            this.animate = false;
            this.exit = false;
        }
    },
    update: {
        value: function() {
            if(this.animate) {
                this.scale.x += 0.1;
                this.scale.y = this.scale.x;
                if(this.scale.x >= 1) {
                    this.scale.set(1);
                    this.animate = false;
                    this.interactive = true;
                }
            }
            else if(this.exit) {
                this.scale.x -= 0.1;
                this.scale.y = this.scale.x;
                if(this.scale.x <= 0) {
                    this.scale.set(0);
                    this.exit = false;
                    this.next.exit();
                }
            }
        }
    },
    press: {
        value: function() {
            this.button.setTexture(this.button.sprites.press);
        }
    },
    release: {
        value: function() {
            this.button.setTexture(this.button.sprites.release);
        }
    }
});
