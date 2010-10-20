
rev.controllers = {};
rev.controllers.Controller = Base.extend({
    constructor : function(){
        for(var handler in this.handlers){
            this[handler] = rev.utils.BindingUtil.scopeFunc(this.handlers[handler], this);
        }
    },
    handlers : {}
});