
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, '', {
    enumerable: true,
    value: function (s) {
        this.room = s.room;
        PIXI.Container.call(this);
    }
});

Object.defineProperty(GMPixi.extra., 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra..prototype, {
    reset: {
        value: function() {
            
        }
    },
    update: {
        value: function() {
            
        }
    }
});