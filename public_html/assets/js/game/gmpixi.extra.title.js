/* global PIXI */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;


Object.defineProperty(GMPixi.extra, 'Title', {
    enumerable: true,
    value: function Title(s) {
        this.room = s.room;
        this.next = s.next;
        PIXI.Sprite.call(this, this.room.textures('title'));
    }
});

Object.defineProperty(GMPixi.extra.Title, 'prototype', {
    value: Object.create(PIXI.Sprite.prototype)
});

Object.defineProperties(GMPixi.extra.Title.prototype, {
    reset: {
        value: function() {
            this.scale.set(0);
            this.animate = false;
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
                    this.next.animate();
                }
            }
        }
    }
});


