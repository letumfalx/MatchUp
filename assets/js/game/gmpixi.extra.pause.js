
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'Pause', {
    enumerable: true,
    value: function Pause(s) {
        this.room = s.room;
        PIXI.Sprite.call(this);
        
        this.sprites = {
            normal: this.room.textures('pause_up'),
            clicked: this.room.textures('pause_down')
        };
        
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

Object.defineProperty(GMPixi.extra.Pause, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.extra.Pause.prototype, {
    reset: {
        value: function() {
            this.setTexture(this.sprites.normal);
            this.isPressed = false;
            this.interactive = false;
        }
    },
    update: {
        value: function() {
            
        }
    },
    press: {
        value: function() {
            this.setTexture(this.sprites.clicked);
        }
    },
    release: {
        value: function() {
            this.setTexture(this.sprites.normal);
        }
    }
});


