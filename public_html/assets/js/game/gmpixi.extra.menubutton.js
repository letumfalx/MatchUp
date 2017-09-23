
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'MenuButton', {
    enumerable: true,
    value: function MenuButton(s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        //adds the background button
        this.button = new PIXI.Sprite();
        
        this.button.sprites = Object.create(null);
        this.button.sprites.release = this.room.textures('button_up');
        this.button.sprites.press = this.room.textures('button_down');
        this.addChild(this.button);
        
        //set container width and height
        this.size = Object.create(null);
        this.size.width = this.button.sprites.press.width;
        this.size.height = this.button.sprites.press.height;
        
        this.pivot.x = this.size.width/2;
        this.pivot.y = this.size.height/2;
        
        var txt = new PIXI.Text(s.text, {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontStyle: 'italic',
            fontSize: 20
        });
        
        txt.position.set(this.size.width/2, this.size.height/2);
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

Object.defineProperty(GMPixi.extra.MenuButton, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.MenuButton.prototype, {
    reset: {
        value: function() {
            this.button.setTexture(this.button.sprites.release);
            this.isPress = false;
            this.interactive = false;
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
