

/* global GMPixi */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

Object.defineProperty(GMPixi, 'Vector', {
    enumerable: true,
    value: {}
});


Object.defineProperties(GMPixi.Vector, {
    Point: {
        value: function Point(ix, iy) {
            Object.defineProperties(this, {
                x: {
                    enumerable: true,
                    get: function() {
                        return ix;
                    },
                    set: function(x) {
                        ix = GMPixi.Math.toNumber(x, ix);
                    }
                },
                y: {
                    enumerable: true,
                    get: function() {
                        return iy;
                    },
                    set: function(y) {
                        iy = GMPixi.Math.toNumber(y, iy);
                    }
                }
            });
        }
    },
    point: {
        value: function point(ix, iy) {
            return new GMPixi.Vector.Point(ix, iy);
        }
    },
    Dimension: {
        value: function Dimension(iw, ih) {
            Object.defineProperties(this, {
                width: {
                    get: function() {
                        return iw;
                    },
                    set: function(w) {
                        iw = GMPixi.Math.toNumber(w, iw);
                    }
                },
                height: {
                    get: function() {
                        return ih;
                    },
                    set: function(h) {
                        ih = GMPixi.Math.toNumber(h, ih);
                    }
                },
                w: {
                    get: function() {
                        return iw;
                    },
                    set: function(w) {
                        this.width = w;
                    }
                },
                h: {
                    get: function() {
                        return ih;
                    },
                    set: function(h) {
                        this.height = h;
                    }
                }
            });
        }
    },
    dim: {
        value: function dim(iw, ih) {
            return new GMPixi.Vector.Dimension(iw, ih);
        }
    },
    Rectangle: {
        value: function Rectangle(ix, iy, iw, ih) {
            var lpoint = GMPixi.Vector.point(ix, iy);
            var ldim = GMPixi.Vector.dim(iw, ih);
            Object.defineProperties(this, {
                point: {
                    enumerable: true,
                    get: function() {
                        return lpoint;
                    },
                    set: function(x, y) {
                        if(GMPixi.checkType(ix, GMPixi.Vector.Point)) {    
                            lpoint.x = x.x;
                            lpoint.y = x.y;
                        }
                        else {
                            lpoint.x = GMPixi.Math.toNumber(x, lpoint.x);
                            lpoint.y = GMPixi.Math.toNumber(y, lpoint.y);
                        }
                    }
                },
                dimension: {
                    enumerable: true,
                    get: function() {
                        return ldim;
                    },
                    set: function(w, h) {
                        if(GMPixi.checkType(ix, GMPixi.Vector.Dimension)) {    
                            ldim.w = w.w;
                            ldim.h = w.h;
                        }
                        else {
                            ldim.x = GMPixi.Math.toNumber(w, this.dimension.h);
                            ldim.y = GMPixi.Math.toNumber(h, this.dimension.h);
                        }
                    }
                },
                dim: {
                    enumerable: true,
                    get: function() {
                        return this.dimension;
                    },
                    set: function(w, h) {
                        this.dimension.set(w, h);
                    }
                },
                x: {
                    enumerable: true,
                    get: function() {
                        return this.point.x;
                    },
                    set: function(x) {
                        this.point.x = x;
                    }
                },
                y: {
                    enumerable: true,
                    get: function() {
                        return this.point.y;
                    },
                    set: function(y) {
                        this.point.y = y;
                    }
                },
                width: {
                    enumerable: true,
                    get: function() {
                        return this.dim.w;
                    },
                    set: function(w) {
                        this.dim.w = w;
                    }
                },
                w: {
                    enumerable: true,
                    get: function() {
                        return this.dim.w;
                    },
                    set: function(w) {
                        this.dim.w = w;
                    }
                },
                height: {
                    enumerable: true,
                    get: function() {
                        return this.dim.h;
                    },
                    set: function(h) {
                        this.dim.h = h;
                    }
                },
                h: {
                    get: function() {
                        return this.dim.h;
                    },
                    set: function(h) {
                        this.dim.h = h;
                    }
                },
                area: {
                    enumerable: true,
                    get: function() {
                        return this.w * this.h;
                    }
                },
                perimeter: {
                    enumerable: true,
                    get: function() {
                        return (this.w + this.h) * 2;
                    }
                },
                diagonal: {
                    enumerable: true,
                    get: function() {
                        return Math.sqrt(Math.pow(this.w, 2) 
                                + Math.pow(this.h, 2));
                    }
                },
                center: {
                    enumerable: true,
                    get: function() {
                        return GMPixi.Vector.point(this.x + this.w/2, 
                                this.y + this.h/2);
                    }
                },
                corner: {
                    enumerable: true,
                    get: function() {
                        return {
                            a: this.point,
                            b: GMPixi.Vector.point(this.x + this.w, this.y),
                            c: GMPixi.Vector.point(this.x + this.w, this.y + this.h),
                            d: GMPixi.Vector.point(this.x, this.y + this.h)
                        };
                    }
                }
            });
        }
    },
    rect: {
        value: function rect(ix, iy, iw, ih) {
            return new GMPixi.Vector.Rectangle(ix, iy, iw, ih);
        }
    },
    moveTo: {
        value: function moveTo(obj, tx, ty, spd) {
            var angle = Math.atan2(ty - obj.y, tx - obj.x);
            var xdir = obj.x > tx ? -1 : obj.x < tx ? 1 : 0;
            var ydir = obj.y > ty ? -1 : obj.y < ty ? 1 : 0;
            
            obj.x += spd * Math.cos(angle);
            obj.y += spd * Math.sin(angle);
            
            obj.x = xdir > 0 ? (obj.x < tx ? tx : obj.x) 
                    : xdir < 0 ? (obj.x > tx ? tx : obj.x)
                    : obj.x;
            
            obj.y = ydir > 0 ? (obj.y < ty ? ty : obj.y) 
                    : ydir < 0 ? (obj.y > ty ? ty : obj.y)
                    : obj.y;
            
            
        }
    }
});
