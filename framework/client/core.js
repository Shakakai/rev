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
        this._calculatedLayout = null;
		this._states = {};
        this.createChildren();
    },
    // Display List Functions
    beforeAdd : function(){
        //add event listeners
    },
    afterAdd : function(){
        this._onStage = true;
        this.invalidateDisplayList();
        // bool argument for property propagation with containers
        this.invalidateProperties(true);
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
        if(this.isOnStage() && this._timers && !this._timers[name]){
            //console.log('firing timer', name, this);
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
		if(this.parent() == null){
			console.log("null parent", this);
			throw new Error("can not commitDisplayList with null parent");
		}
        this.parent().layoutChild(this);
    },
    updateDisplayList : function(x, y, width, height){
        this._calculatedLayout = {'y' : y, 'x' : x, 'w' : width, 'h' : height};
        this._el.css({
			width: width,
			height: height,
			top: y,
			left: x
		});
    },
    // event handling
    fire : function(evt){
        if(this._el){
            this._el.trigger(evt);
        }
    },
    bind : function(evt, listener){
        if(this._el == null){
            console.log(this._el);
            throw new Error("Element does not exist.");
        }
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
            return this._width;
        }
        this._width = value;
        this.invalidateDisplayList();
    },
    height : function(value){
        if(arguments.length==0){
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
	isOnStage : function(){
		return (this._onStage && 
				this.parent() != null && 
				this.parent().isOnStage());
	},
	addStateProperty : function(state, property, value){
		if(this._states[state] == undefined){
			this._states[state] = {};
		}
		var s = this._states[state];
		s[property] = value;
	},
	currentState : function(stateName){
		var s = this._states[stateName];
		for(var prop in s){
			this[prop](s[prop]);
		}
	},
    //private members
    _internalStyleName : null
});