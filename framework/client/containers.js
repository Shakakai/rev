// containers

//setup namespace
rev.containers = {};

rev.containers.Container = rev.core.UIComponent.extend({
    initialize : function(){
        this.base();
        this._children = {};
    },
	afterAdd : function(){
		if(this._childFactories != null){
			for(var childName in this._childFactories){
				if(childName != null){
					var c = this._childFactories[childName]();
					this[childName] = c;
					this.addChild(c);
				}
			}
			this._childFactories = null;
		}
		this.base();
	},
    addChild : function(child){
        if(child.parent() != null){
            throw new Error("Cannot add a child twice!");
            return;
        }
        child.beforeAdd();
        this._el.append(child._el);
        child.parent(this);
        this._children[child._id] = child;
        child.afterAdd();
    },
    removeChild : function(child){
        //calling _el for internal use only
        this._el.remove(child._el);
        delete this._children[child._id];
    },
    layoutChild : function(child){
        if(!this.isOnStage()){
			return;
		}
		console.log("layoutChild", this, child);
        var rect = this.getLayoutRect(child);
        console.log("layoutRect", rect);
        
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(rect.x, rect.y, rect.w, rect.h);
		
		//this check child's bounds
		
    },
	hasVerticalScroll : function(){
		console.log("HAS VERTICAL SCROLL", this._el.innerHeight(), this._el.outerHeight(), (this._el.innerHeight() < this._el.outerHeight()));
		return (this._el.innerHeight() < this._el.outerHeight());
	},
	hasHorizontalScroll : function(){
		return (this._el.offsetWidth < this._el.scrollWidth);
	},
    getLayoutRect : function(child){
        var x, y, w, h, 
        top = child.top(), 
        left = child.left(), 
        right = child.right(), 
        bottom = child.bottom(), 
        width = child.width(), 
        height = child.height();
        
        //standard properties first
        if(left != null){
            x = left;
        }
        if(width != null){
            w = width;
        }
        if(top != null){
            y = top;
        }
        if(height != null){
            console.log('height not null', height);
            h = height;
        }
        if(x == null || w == null){
            if(x == null && w == null){
                throw new Error("Must specify at least two of the following properties: left, width, right");
            }

			var cw = this._calculatedLayout.w;
			if(true || this.hasVerticalScroll()){
				cw -= 15;
				console.log("USING INNER WIDTH");
			}
			if(x == null){
                x = cw - w - right;
            }else if(w == null){
                console.log("calc width:", this._calculatedLayout.w, cw, x, right);
                w = cw - x - right;
            }
        }
        if(y == null || h == null){
            if(y == null && h == null){
                throw new Error("Must specify at least two of the following properties: top, height, bottom");
            }
			var ch = this._calculatedLayout.h;
			if(true || this.hasHorizontalScroll()){
				ch -= 15;
			}
            if(y == null){
                y = this._calculatedLayout.h - h - bottom;
            }else if(h == null){
                console.log('calculating height', this._calculatedLayout.h, y, bottom);
                h = this._calculatedLayout.h - y - bottom;
            }
        }
        
        return {
            x : x,
            y : y,
            w : w,
            h : h
        };
    },
    createChildren : function(){
        var el = document.createElement("div");
        this._el = $(el);
        this.base();
    },
    gap : function(value){
        if(arguments.length>0){
            this._gap = value;
            this.invalidateDisplayList();
        }else{
            return this._gap;
        }
    },
    updateDisplayList : function(x, y, width, height){
        console.log("CONTAINER UPDATE", arguments);
        this.base(x, y, width, height);
        
        var children = this._el.children();
        var len = children.length;
        for(var a=0; a<len; a++){
            var id = $(children[a]).attr('id');
            console.log('id', id);
            this.layoutChild(this._children[id]);
        }
    },
    _internalStyleName : 'rev-container',
	_childFactories : null
});

rev.containers.Application = rev.containers.Container.extend({
    initialize : function(){
        this.base();
        var el = $('body')[0];
        this._el = $(el);
        
        $(window).resize(rev.utils.BindingUtil.scopeFunc(this.onResize, this));
        this.updateLayoutCalculations();

        //create global handle (Would people really have two apps running on one page?)
        //yea, probably at some point :(
        rev.containers.Application.application = this;
		
		this.afterAdd();
    },
    onResize : function(){
        this.updateLayoutCalculations();
		var children = this._el.children();
        var len = children.length;
        for(var a=0; a<len; a++){
            var id = $(children[a]).attr('id');
            console.log('id', id);
            this.layoutChild(this._children[id]);
        }
    },
	updateLayoutCalculations : function(){
		//update calculated properties
		var result = {
			h : this.height(),
			w : this.width(),
			x : 0,
			y : 0
		};
		console.log("Application layout calculations");
		console.log(result);
		this._calculatedLayout = result;
	},
	commitDisplayList : function(){},
    width : function(){
		return window.innerWidth;
    },
    height : function(){
        return window.innerHeight;
    },
	isOnStage : function(){
		return true;
	},
    _internalStyleName : 'rev-app'
});
rev.containers.Application.application = null;

rev.containers.VBox = rev.containers.Container.extend({
    layoutChild : function(child){
        //accumulate height from the first x children and upate the current child's y pos
        var childIndex = child._el.index();
        var y = this.top();
        if(childIndex > 0){
            var children = this._el.children();
            for(var x=0; x<childIndex; x++){
                y += $(children[x]).height();
            }
        }
        
        var rect = this.getLayoutRect(child);
        
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(rect.x, y, rect.w, rect.h);
    },
    _internalStyleName : 'rev-vbox'
});

rev.containers.HBox = rev.containers.Container.extend({
    layoutChild : function(child){
        //accumulate height from the first x children and upate the current child's x pos
        var childIndex = child._el.index();
        var xPos = this.left();
        //var gap = this._el.css('gap');
        if(childIndex > 0){
            var children = this._el.children();
            for(var x=0; x<childIndex; x++){
                var w = $(children[x]).width();
                //console.log("HBox::layoutChild", w, xPos);
                xPos += w;
            }
        }
        
        var rect = this.getLayoutRect(child);
        
        //console.log("hbox calcX:", xPos, childIndex);
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(xPos, rect.y, rect.w, rect.h);
    },
    _internalStyleName : 'rev-hbox'
})