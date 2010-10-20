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
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(child.x(), child.y(), child.width(), child.height());
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
        console.log("Container::updateDisplayList top");
        this.base(x, y, width, height);
        console.log("Container::updateDisplayList middle");
        
        var children = this._el.children();
        var len = children.length;
        for(var a=0; a<len; a++){
            var id = $(children[a]).attr('id');
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
        
        //create global handle (Would people really have two apps running on one page?)
        //yea, probably at some point :(
        rev.containers.Application.application = this;
    },
    _internalStyleName : 'rev-app'
});
rev.containers.Application.application = null;

rev.containers.VBox = rev.containers.Container.extend({
    layoutChild : function(child){
        //accumulate height from the first x children and upate the current child's y pos
        var childIndex = child._el.index();
        var y = this.y();
        if(childIndex > 0){
            var children = this._el.children();
            for(var x=0; x<childIndex; x++){
                y += $(children[x]).height();
            }
        }
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(child.x(), y, child.width(), child.height());
    },
    _internalStyleName : 'rev-vbox'
});

rev.containers.HBox = rev.containers.Container.extend({
    layoutChild : function(child){
        //accumulate height from the first x children and upate the current child's x pos
        var childIndex = child._el.index();
        var xPos = this.x();
        //var gap = this._el.css('gap');
        if(childIndex > 0){
            var children = this._el.children();
            for(var x=0; x<childIndex; x++){
                var w = $(children[x]).width();
                //console.log("HBox::layoutChild", w, xPos);
                xPos += w;
            }
        }
        //console.log("hbox calcX:", xPos, childIndex);
        //this changes based on layouting system
        //this implementation is simple absolute positioning
        child.updateDisplayList(xPos, child.y(), child.width(), child.height());
    },
    _internalStyleName : 'rev-hbox'
})