// containers

//setup namespace
rev.containers = {};

rev.containers.Container = rev.core.UIComponent.extend({
    initialize : function(){
        this.base();
        this._children = {};
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
        console.log("layoutChild", this, child);
        var rect = this.getLayoutRect(child);
        console.log("layoutRect", rect);
        
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(rect.x, rect.y, rect.w, rect.h);
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
/**
function getScrollBarWidth () {  
    var inner = document.createElement('p');  
    inner.style.width = "100%";  
    inner.style.height = "200px";  
  
    var outer = document.createElement('div');  
    outer.style.position = "absolute";  
    outer.style.top = "0px";  
    outer.style.left = "0px";  
    outer.style.visibility = "hidden";  
    outer.style.width = "200px";  
    outer.style.height = "150px";  
    outer.style.overflow = "hidden";  
    outer.appendChild (inner);  
  
    document.body.appendChild (outer);  
    var w1 = inner.offsetWidth;  
    outer.style.overflow = 'scroll';  
    var w2 = inner.offsetWidth;  
    if (w1 == w2) w2 = outer.clientWidth;  
  
    document.body.removeChild (outer);  
  
    return (w1 - w2);  
};
**/

            console.log("CHECK FOR SCROLL", this._el);
			var cw = this._calculatedLayout.w;
			var iw = this._el.innerWidth();
			var clientRect = this._el.getClientRects();
			console.log("INNER OUTTER >>", cw, iw, clientRect);
			if(cw > iw){
				cw = iw;
				console.log("USING INNER WIDTH");
			}
			if(x == null){
                x = cw - w - right;
            }else if(w == null){
                console.log("calc width:", this._calculatedLayout.w, x, right);
                w = cw - x - right;
            }
        }
        if(y == null || h == null){
            if(y == null && h == null){
                throw new Error("Must specify at least two of the following properties: top, height, bottom");
            }
			//sconsole.log("CHECK FOR SCROLL", this._el);
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
    _internalStyleName : 'rev-container'
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
    width : function(){
		return window.innerWidth;
    },
    height : function(){
        return window.innerHeight;
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