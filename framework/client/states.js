rev.states = {};

rev.states.ViewStateCollection = Base.extend({
	constructor : function(){
		
	},
	addViewState : function(stateName, viewState){
		
	},
	
});

rev.states.ViewState = Base.extend({
	constructor : function(view, extendedState, overrideProperties){
		if(extendedState == null){
			this.compiledState = overrideProperties;
		}else{
			var baseProperties = extendedState.compiledState;
			this.compiledState = {};

			for(var prop in baseProperties){
				if(overrideProperties[prop] === undefined){
					this.compiledState[prop] = baseProperties[prop];
				}else{
					this.compiledState[prop] = overrideProperties[prop];
				}
			}
		}
		this.extendedState = extendedState;
		this.overrideProperties = overrideProperties;
		this.view = view;
	},
	applyState : function(){
		for(var prop in this.compiledState){
			this.applyProperty(prop, this.compiledState[prop]);
		}
	},
	applyProperty : function(selector, value){
		var chain = selector.split(".");
		var len = chain.length;
		var item = this.view;
		for(var x=0; x<len-1; x++){
			item = item[chain[x]];
		}
		item[chain[len-1]](value);
	}
});