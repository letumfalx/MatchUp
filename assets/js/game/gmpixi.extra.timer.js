
/* global PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.extra = GMPixi.extra || Object.defineProperty(GMPixi, 'extra', {
    enumerable: true,
    value: {}
}).extra;

Object.defineProperty(GMPixi.extra, 'Timer', {
    enumerable: true,
    value: function Timer(s) {
        this.room = s.room;
        PIXI.Container.call(this);
        
        //create the score container
        var cont = new PIXI.Sprite(this.room.textures('text_container'));
        cont.scale.set(1.1, 1);
        this.addChild(cont);
        
        this.width = this.room.textures('text_container').width * 1.1;
        this.height = this.room.textures('text_container').height;
        
        //the tooltip
        var tooltip = new PIXI.Text("Time Left: ", {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 15,
            fontWeight: "bold"
        });
        tooltip.anchor.set(0, 0.5);
        tooltip.position.set(this.width * 0.125, this.height*0.525);
        this.addChild(tooltip);
        
        //will display the score
        this.display = new PIXI.Text(0, {
            fill: 0xffffff,
            fontFamily: "Century Gothic",
            fontSize: 22
        });
        
        //anchor and pos
        this.display.anchor.set(1, 0.5);
        this.display.position.set(this.width * 0.8975, this.height*0.525);
        
        //color pointers
        this.display.colors = Object.create(null);
        this.display.colors.warning = 0xff0000;
        this.display.colors.normal = 0xffffff;
                
        this.addChild(this.display);
        
        this.expires = s.expires;
        
        
    }
});

Object.defineProperty(GMPixi.extra.Timer, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.extra.Timer.prototype, {
    reset: {
        value: function() {
            this.display.text = "01:00";
            this.display.style.fill = this.display.colors.normal;
            this.elapsed = 60000;
            this.tick = false;
            this.start = 0;
            this.isExpired = false;
        }
    },
    update: {
        value: function() {
            if(!this.room.pause && !this.isExpired) {
                this.elapsed 
                        -= GMPixi.Math.clamp(Date.now() - this.start, 0, 18);
                this.start = Date.now();
                
                var min = GMPixi.Math.clamp(
                        Math.floor(this.elapsed / 60000), 0, 99);
                var sec = GMPixi.Math.clamp(
                        Math.floor((this.elapsed % 60000)/1000), 0, 59);
                
                if(this.elapsed <= 10000) {
                    if(this.display.style.fill !== this.display.colors.warning) {
                        this.display.style.fill = this.display.colors.warning;
                    }
                }
                
                if(this.elapsed <= 0) {
                    this.elapsed = 0;
                    this.isExpired = true;
                    this.expires();
                }
                
                this.display.text = (min > 9 ? min : "0" + min) 
                        + ":" + (sec > 9 ? sec : "0" + sec);
            }
        }
    }
});


