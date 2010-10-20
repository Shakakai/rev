// core.js

// setup namespace
var rev = {};
rev.core = {};

rev.core.UIComponent = Base.extend({
    constructor : function(){
        this.initialize();
    },
    initialize : function(){
        this._id = rev.utils.Guid.create();
        this._onStage = false;
        this._el = null;
        this._parent = null;
        this._timers = {};
        this._commitStyles = {};
        this._width = null;
        this._height = null;
        this._left = null;
        this._top = null;
        this._bottom = null;
        this._right = null;
        this.createChildren();
    },
    // Display List Functions
    beforeAdd : function(){
        //add event listeners
    },
    afterAdd : function(){
        this._onStage = true;
        this.invalidateDisplayList();
        this.invalidateProperties();
        this.fire("addedToStage");
    },
    beforeRemove : function(){
        //remove event listeners here
    },
    afterRemove : function(){
        this._onStage = true;
        this.fire("removedFromStage");
    },
    createChildren : function(){
        this._el.addClass(this._internalStyleName);
        this._el.attr('id', this._id);
    },
    // Component invalidation cycle
    callLater : function(func, args){
        var t = new rev.utils.Timer(1, func, this, args);
        t.start();
    },
    callOnce : function(name, func, args){
        if(!this._timers[name]){
            var t = new rev.utils.Timer(1, func, this, args);
            t.start();
            this._timers[name] = t;
        }
    },
    invalidateProperties : function(){
        this.callOnce("properties", this.commitProperties);
    },
    commitProperties : function(){
        this._timers["properties"] = null;
        //apply styling changes
        for(var name in this._commitStyles){
            this._setStyle(name, this._commitStyles[name]);
            delete this._commitStyles[name];
        }
    },
    invalidateDisplayList : function(){
        this.callOnce("displayList", this.commitDisplayList);
    },
    commitDisplayList : function(){
        this._timers["displayList"] = null;
        this.parent().layoutChild(this);
    },
    updateDisplayList : function(left, top, width, height){
        console.log('update displayList');
        var update = {'top' : y, 'left' : x, 'width' : width, 'height' : height};
        console.log(update);
        console.log(this);
        this._el.css(update);
    },
    // event handling
    fire : function(evt){
        if(this._el){
            this._el.trigger(evt);
        }
    },
    bind : function(evt, listener){
        this._el.bind(evt, listener);
    },
    unbind : function(evt, listener){
        if(this._el){
            this._el.unbind(evt, listener);
        }
    },
    //styling
    style : function(arg1,arg2){
        if(arguments.length == 2){ //single style change
            //console.log('single style change', arguments);
            this._commitStyles[arg1] = arg2;
            this.invalidateProperties();
        }else if($.isPlainObject(arg1)){ //hash of style changes
            //console.log('hash of style changes', arguments);
            for(var name in arg1){
                this._commitStyles[name] = arg1[name];
            }
            this.invalidateProperties();
        }else{ //assume string
            //console.log('return style', arguments);
            return this._getStyle(arg1);
        }
    },
    _getStyle : function(name){
        var result;
        //check uncommitted styles first
        if(this._commitStyles[name] != undefined){
            result = this._commitStyles[name];
        }else{
            result = this._el.css(name);
        }
        return result;
    },
    _setStyle : function(name, value){
        //console.log('UIComponent::setStyle', arguments);
        this._el.css(name, value);
    },
    //properties
    left : function(value){
        if(arguments.length==0){
            return this._left;
        }
        this._left = value;
        this.invalidateDisplayList();
    },
    top : function(value){
        if(arguments.length==0){
            return this._top;
        }
        this._top = value;
        this.invalidateDisplayList();
    },
    right : function(value){
        if(arguments.length==0){
            return this._right;
        }
        this._right = value;
        this.invalidateDisplayList();
    },
    bottom : function(value){
        if(arguments.length==0){
            return this._bottom;
        }
        this._bottom = value;
        this.invalidateDisplayList();
    },
    width : function(value){
        if(arguments.length==0){
            if(this._width == null){
                return this._el.width();
            }
            return this._width;
        }
        this._width = value;
        this.invalidateDisplayList();
    },
    height : function(value){
        if(arguments.length==0){
            if(this._height == null){
                return this._el.height();
            }
            return this._height;
        }
        this._height = value;
        this.invalidateDisplayList();
    },
    parent : function(value){
        if(arguments.length==0){
            return this._parent;
        }
        this._parent = value;
    },
    //private members
    _internalStyleName : null
});