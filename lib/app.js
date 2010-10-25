$(document).ready(function(){
    var app = new rev.containers.Application();
    app.style('background-color', '#000000');
    
    var vbox = new rev.containers.VBox();
    vbox.left(10);
    vbox.top(10);
    vbox.right(10);
    vbox.bottom(0);
    vbox.style({'background-color' : '#ffffff'});
    
    var label = new rev.controls.Label();
    label.left(0);
    label.top(0);
    label.height(100);
    label.width(600);
    label.text("Hello World!");
    label.style({'fontSize':'72px', 'color':'#FF0000'});
    vbox.addChild(label);
    
    var len = 30;
    while(len--){
        var lbl = new rev.controls.Label();
        lbl.left(len*10);
        lbl.top(0);
        lbl.height(len+6);
        lbl.width(200);
        lbl.text("Label #"+len);
        lbl.style({'fontSize': len+'px', 'color':'#FF0000'});
        vbox.addChild(lbl);
    }
    
    var hbox = new rev.containers.HBox();
    hbox.left(0);
    hbox.top(0);
    hbox.height(100);
    hbox.right(0);
    
    len = 5;
    var btn;
    while(len--){
        btn = new rev.controls.Button();
        btn.top(0);
        btn.left(0);
        btn.width(80);
        btn.height(40);
        btn.text("test "+len);
        btn.style({'fontSize': '12px', 'color':'#FF0000'});
        hbox.addChild(btn);
    }
    
    var con = new Controller();
    con.view = { btn : btn, app : app, vbox : vbox, hbox : hbox };
    con.onRegister();
    
    vbox.addChild(hbox);
    
    app.addChild(vbox);
});

var Controller = rev.controllers.Controller.extend({
    onRegister : function(){
        //too verbose
        this.view.btn.bind('click', this.onBtnClick);
        this.view.vbox.bind('click', this.onVBoxClick);
    },
    onRemove : function(){
        
    },
    handlers : {
        onBtnClick : function(){
            this.view.btn.text(this.view.btn.text()+"!");
            this.view.btn.unbind('click', this.onBtnClick);
        },
        onVBoxClick : function(){
            console.log(this.view.vbox);
            console.log("clicked vbox", this.view.vbox.height());
            //this.view.vbox.height(this.view.vbox.height()-100);
        }
    },
    view : null
});
