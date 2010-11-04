// utils

//create namespace
rev.utils = {};

//GUID util
rev.utils.Guid = {
    sequenceGen : function(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    create : function(){
        var S4 = rev.utils.Guid.sequenceGen;
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
}

//help w/ databinding
rev.utils.BindingUtil = {
    scopeFunc : function(func, scope){
        return function(){
            func.apply(scope, arguments);
        };
    }
};

rev.utils.Timer = Base.extend({
    constructor : function(delay, callback, scope, args){
        this.delay = delay;
        this.callback = callback;
        this.scope = scope;
        this.running = false;
    },
    start : function(){
        var that = this;
        this._timer = setTimeout(function(){
            that.onTime();
        }, this.delay);
        this.running = true;
    },
    onTime : function(){
        this.callback.apply(this.scope, this.args);
        this.running = false;
    },
    stop : function(){
        if(this.running){
            clearTimeout(this._timer);
            this.running = false;
        }
    }
});
