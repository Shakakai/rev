var Controller = rev.controllers.Controller.extend({
    onRegister : function(){
        //too verbose
        this.view.submitButton.bind('click', this.onClick);
    },
    onRemove : function(){},
    handlers : {
        onClick : function(){
            var txt = this.view.textInput.text();
			var label = new rev.controls.Label();
			label.left(0);
			label.right(0);
			label.height(30);
			label.text(txt);
			this.view.todoList.addChild(label);
        }
    },
    view : null
});

var c = new Controller();
c.view = view;
c.onRegister();
