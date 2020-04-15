
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'Score', {
    enumerable: true,
    value: function Score(s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        //create the score container
        var cont = new PIXI.Sprite(this.room.textures('text_container'));
        cont.scale.set(1.25, 1);
        this.addChild(cont);
        
        this.width = this.room.textures('text_container').width * 1.25;
        this.height = this.room.textures('text_container').height;
        
        var tooltip = new PIXI.Text("Pts", {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 14,
            fontWeight: "bold"
        });
        
        tooltip.anchor.set(0, 0.5);
        tooltip.position.set(this.width * 0.8, this.height*0.525);
        this.addChild(tooltip);
        
        //will monitors the change in score
        this.score = Object.create(null);
        
        //will display the score
        this.display = new PIXI.Text(0, {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 22
        });
        this.display.anchor.set(1, 0.5);
        this.display.position.set(this.width * 0.75, this.height*0.525);
        this.addChild(this.display);
    }
});

Object.defineProperty(GMPixi.extra.Score, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.Score.prototype, {
    reset: {
        value: function() {
            this.score.target = 0;
            this.score.current = 0;
            this.display.text = 0;
        }
    },
    update: {
        value: function() {
            if(this.score.target > this.score.current) {
                this.score.current = GMPixi.Math.clamp(
                        this.score.current += 97, 0, this.score.target);
            }
            this.display.text = this.score.current;
        }
    }
});