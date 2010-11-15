var Controller = rev.controllers.Controller.extend({
    onRegister : function(){
        //too verbose
        console.log(this);
        this.view.submitButton.bind('click', this.onAddItem);
        this.view.textInput.bind('change', this.onAddItem);
    },
    onRemove : function(){},
    handlers : {
        onAddItem : function(){
            var txt = this.view.textInput.text();
            if(txt.length > 0){
			    var label = new rev.controls.Label();
    			label.left(0);
    			label.right(0);
    			label.height(30);
    			console.log('Grabbing text!', txt);
    			label.text(txt);
    			this.view.todoList.addChild(label);
    			this.view.textInput.text('');
		    }
        }
    },
    view : null
});


$(document).ready(function(){
    var view = window.todoList();
    window.application.addChild(view);
    
    var c = new Controller();
    c.view = view;
    c.onRegister();
});
