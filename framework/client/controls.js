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
        //console.log("Label::commit props", this);
    },
	updateDisplayList : function(x, y, width, height){
		//console.log("label layout", arguments);
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
    _labelType : "p",
    _internalStyleName : 'rev-container'
});

rev.controls.Label = rev.controls.TextBase.extend({ _labelType : "h1", _internalStyleName : 'rev-label' });

rev.controls.Button = rev.controls.TextBase.extend({ _labelType : "button", _internalStyleName : 'rev-button' });

rev.controls.TextInput = rev.controls.TextBase.extend({ 
	_labelType : "input",
	initialize : function(){
	    this.base();
	    //wrap handlers
	    this.onChange = rev.utils.BindingUtil.scopeFunc(this.onChange, this);
	},
	createChildren : function(){
		this.base();
		this._el.attr("type", "text");
	},
	commitProperties : function(){
        this.base();
        this._el.val(this._text);
        console.log("Label::commit props", this);
    },
	afterAdd : function(){
	    this.base();
	    //console.log('bind it!', this);
	    this.bind('change', this.onChange);
	},
	afterRemove : function(){
	    this.base();
	    this.unbind('change', this.onChange);
	},
	onChange : function(evt){
	    this._text = this._el.val();
	    //console.log("captured change event!", this._text);
	},
	//
	_internalStyleName : 'rev-textinput'
});