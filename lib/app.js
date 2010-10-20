$(document).ready(function(){
    var app = new rev.containers.Application();
    app.style('background-color', '#000000');
    
    var vbox = new rev.containers.VBox();
    vbox.x(200);
    vbox.y(0);
    vbox.width(1000);
    vbox.height(1000);
    
    var label = new rev.controls.Label();
    label.x(0);
    label.y(0);
    label.height(100);
    label.width(600);
    label.text("Hello World!");
    label.style({'fontSize':'72px', 'color':'#FF0000'});
    vbox.addChild(label);
    
    var len = 30;
    while(len--){
        var lbl = new rev.controls.Label();
        lbl.x(len*10);
        lbl.y(0);
        lbl.height(len+6);
        lbl.width(200);
        lbl.text("Label #"+len);
        lbl.style({'fontSize': len+'px', 'color':'#FF0000'});
        vbox.addChild(lbl);
    }
    
    var hbox = new rev.containers.HBox();
    hbox.x(0);
    hbox.y(0);
    hbox.height(300);
    hbox.width(700);
    
    len = 5;
    var btn;
    while(len--){
        btn = new rev.controls.Button();
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
