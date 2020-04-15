
/* global GMPixi, PIXI, Function */

var GMPixi = GMPixi || Object.defineProperty(window, 'GMPixi', {
    value: {}
}).GMPixi;

GMPixi.Room = GMPixi.Room || Object.defineProperty(GMPixi, 'Room', {
    enumerable: true,
    value: function Room(details) {
        PIXI.Container.call(this);
        
        //setting the room global details and this room method like update/reset
        Object.defineProperties(this, {
            room: {
                enumerable: true,
                value: GMPixi.checkType(details.room, Object) 
                        ? details.room : {}
            },
            rooms: {
                enumerable: true,
                value: GMPixi.checkType(details.rooms, Object) 
                        ? details.rooms : {}
            },
            default:  {
                enumerable: true,
                value: GMPixi.checkType(details.default, Boolean) 
                        ? details.default : false
            },
            update: {
                enumerable: true,
                value: GMPixi.checkType(details.update, Function) 
                        ? details.update.bind(this) : null
            },
            reset: {
                enumerable: true,
                value: GMPixi.checkType(details.reset, Function) 
                        ? details.reset.bind(this) : null
            }
        });
        
        //parse all methods first
        if(GMPixi.checkType(details.methods, Object)) {
            for(var imethod in details.methods) {
                Object.defineProperty(this, imethod, {
                    enumerable: true,
                    writable: true,
                    value: details.methods[imethod].bind(this)
                });
            }
        } 
        
        //then parse all data
        if(GMPixi.checkType(details.data, Object)) {
            for(var idata in details.data) {
                //protection for reserve keys
                Object.defineProperty(this, idata, {
                    enumerable: true,
                    writable: true,
                    value: details.data[idata]
                });
            }
        }
        
        //do the setup here
        if(GMPixi.checkType(details.setup, Function)) {
            details.setup.call(this);
        }
        
    }
});

Object.defineProperty(GMPixi.Room, 'prototype', {
    value: Object.create(PIXI.Container.prototype)
});

Object.defineProperties(GMPixi.Room.prototype, {
    _update: {
        value: function _update() {
            
            //do the updates in the children first
            for(var c in this.children) {
                if(GMPixi.checkType(this.children[c], GMPixi.Room)) {
                    if(GMPixi.checkType(this.children[c]._update, Function)) {
                        this.children[c]._update();
                    }
                }
                else {
                    if(GMPixi.checkType(this.children[c].update, Function)) {
                        this.children[c].update();
                    }
                }
            }

            //then do the defined update for the room
            if(this.update !== null) this.update();
        }
    },
    _reset: {
        value: function _reset() {
            //do resets on children first
            for(var c in this.children) {
                if(GMPixi.checkType(this.children[c], GMPixi.Room)) {
                    if(GMPixi.checkType(this.children[c]._reset, Function)) {
                        this.children[c]._reset();
                    }
                }
                else {
                    if(GMPixi.checkType(this.children[c].reset, Function)) {
                        this.children[c].reset();
                    }
                }
            }

            //do the defined update here
            if(this.reset !== null) this.reset();
        }
    },
    add: {
        enumerable: true,
        value: function add(obj, x, y, ax, ay, sx, sy, rot, a) {
            if(!GMPixi.checkType(obj)) {
                return null;
            }

            //set defaults
            x = GMPixi.Math.toNumber(x, 0);
            y = GMPixi.Math.toNumber(y, 0);
            ax = GMPixi.Math.toNumber(ax, 0);
            sx = GMPixi.Math.toNumber(sx, 1);
            rot = GMPixi.Math.toNumber(rot, 0);
            a = GMPixi.Math.toNumber(a, 1);

            if(!GMPixi.isTypeOf(ay, [Number, String])) ay = ax;
            else ay = GMPixi.Math.toNumber(ay, 0);

            if(!GMPixi.isTypeOf(ay, [Number, String])) sy = sx;
            else sy = GMPixi.Math.toNumber(sy, 1);

            //set position
            obj.position.set(x, y);

            //set anchor
            if(GMPixi.checkType(obj.anchor)) obj.anchor.set(ax, ay);

            //set scales
            if(GMPixi.checkType(obj.scale)) {
                obj.scale.x = sx;
                obj.scale.y = sy;
            }

            //set rotation
            if(GMPixi.checkType(obj.rotation)) obj.rotation = rot;

            //set alpha/opacity
            if(GMPixi.checkType(obj.alpha)) obj.alpha = a;

            //add the object to the room
            this.addChild(obj);

            //return the obj for further use
            return obj;
        }
    },
    addContainer: {
        enumerable: true,
        value: function addContainer(x, y, px, py) {
            var obj = new PIXI.Container();
    
            //set defaults
            x = GMPixi.Math.toNumber(x, 0);
            y = GMPixi.Math.toNumber(y, 0);
            px = GMPixi.Math.toNumber(px, 0);


            if(!GMPixi.isTypeOf(py, [Number, String])) py = px;
            else py = GMPixi.Math.toNumber(py, 0);

            if(GMPixi.checkType(obj.pivot)) obj.pivot.set(px, py);
            this.addChild(obj);
            return obj;
        }
    },
    remove: {
        enumerable: true,
        value: function remove(obj) {
            this.removeChild(obj);
        }
    },
    removeAll: {
        enumerable: true,
        value: function removeAll() {
            this.removeChild();
        }
    },
    addTo: {
        enumerable: true,
        value: function addTo(obj, cont, x, y, ax, ay, sx, sy, rot, a) {
            if(!GMPixi.checkType(cont)) {
                return null;
            }
            if(!GMPixi.checkType(obj)) {
                return null;
            }
            
            //set defaults
            x = GMPixi.Math.toNumber(x, 0);
            y = GMPixi.Math.toNumber(y, 0);
            ax = GMPixi.Math.toNumber(ax, 0);
            sx = GMPixi.Math.toNumber(sx, 1);
            rot = GMPixi.Math.toNumber(rot, 0);
            a = GMPixi.Math.toNumber(a, 1);

            if(!GMPixi.isTypeOf(ay, [Number, String])) ay = ax;
            else ay = GMPixi.Math.toNumber(ay, 0);

            if(!GMPixi.isTypeOf(ay, [Number, String])) sy = sx;
            else sy = GMPixi.Math.toNumber(sy, 1);

            //set position
            obj.position.set(x, y);

            //set anchor
            if(GMPixi.checkType(obj.anchor)) obj.anchor.set(ax, ay);

            //set scales
            if(GMPixi.checkType(obj.scale)) {
                obj.scale.x = sx;
                obj.scale.y = sy;
            }

            //set rotation
            if(GMPixi.checkType(obj.rotation)) obj.rotation = rot;

            //set alpha/opacity
            if(GMPixi.checkType(obj.alpha)) obj.alpha = a;

            //add the object to the container
            cont.addChild(obj);

            //return the obj for further use
            return obj;
        }
    }
});

