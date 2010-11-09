// controls

//setup namespace
rev.controls = {};

rev.controls.TextBase = rev.core.UIComponent.extend({
    initialize : function(){
        this._text = "";
        this.base();
    },
    createChildren : function(){
        var el = document.createElement(this._labelType);
        this._el = $(el);
        this.base();
    },
    commitProperties : function(){
        this.base();
        this._el.text(this._text);
        console.log("Label::commit props");
    },
	updateDisplayList : function(x, y, width, height){
		console.log("label layout", arguments);
		this.base(x,y,width,height);
	},
    //properties
    labelType : function(value){
        if(arguments.length == 0){
            return this._labelType;
        }
        this._labelType = value;
    },
    text : function(value){
        if(arguments.length == 0){
            return this._text;
        }
        this._text = value;
        this.invalidateProperties();
    },
    //properties
    _labelType : "p"
});

rev.controls.Label = rev.controls.TextBase.extend({ _labelType : "h1" });

rev.controls.Button = rev.controls.TextBase.extend({ _labelType : "button" });

rev.controls.TextInput = rev.controls.TextBase.extend({ 
	_labelType : "input",  
	createChildren : function(){
		this.base();
		this._el.attr("type", "text");
	}
});