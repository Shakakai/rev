/**

INPUT:
{ 
	"type" : "rev.containers.Container",
	"speed" : 1,
	"children" : {
		"bottomButton" : {
			"type" : "rev.controls.Button",
			"left" : 10,
			"bottom" : 10,
			"right" : 10,
			"height" : 40,
			"text" : "hello world!"
		},
		"pictureList" : {
			"type" : "rev.containers.VBox",
			"top" : 10,
			"left" : 10,
			"right" : 10,
			"bottom" : 60,
			"style" : { "background-color" : "#F0F0F0" },
			"children" : {
				"firstLabel" : {
					type : "rev.controls.Label",
					text : "Top Label",
					style : { "color" : "#C0C0C0" }
				},
				"secondLabel" : {
					type : "rev.controls.Label",
					text : "Bottom Label",
					style : { "color" : "#CCCCC" }
				}
			}
		}
	}
}

OUTPUT:
//only view gets exported - encapsulate everything else
var view = (function(){
	
	// emit the factory methods to create children
	var leftButtonFactory = function(){
		var a = new rev.controls.Button();
			a.left(10);
			a.top(50);
			a.text("hello world!");
		return a;
	};
	
	var pictureListFactory = function(){
		var firstLabelFactory = function(){
			//down the rabbit hole
		};
		var secondLabelFactory = function(){
			//down the rabbit hole		
		};
		
		var a  = new rev.containers.VBox();
			a.top(10);
			a.left(10);
			a.right(10);
			a.bottom(60);
			a.style({ "background-color" : "#F0F0F0" });
			
	};
	
	//emit the actual containing element
	var a = new rev.containers.Container.extend({
		"leftButton" : null,
		childFactories : {"leftButton" : leftButtonFactory}
	});
	
	return a;
})();

**/


exports.view_expander = function(filename, view_json){
	
	var emit_object = function(obj){
		if(!validate_object(obj)){
			print(obj.toString());
			return;
		}
		
		if(obj.children != undefined){
			return emit_complex_factory(obj);
		}else{
			return emit_simple_factory(obj);
		}
	};
	
	/**
	// emit the factory methods to create children
	var leftButtonFactory = function(){
		var a = new rev.controls.Button();
			a.left(10);
			a.top(50);
			a.text("hello world!");
		return a;
	};
	**/
	var emit_simple_factory = function(obj){
		
		// constructor
		var out = tmpl("var a = new #{type}();\n", {
			"type" : obj.type
		});
		
		// apply properties
		for(var prop in obj){
			if(prop != 'type'){
				var val = obj[prop];
				out += collectProperty(prop, val);
			}
		}
		
		//wrap up factory function
		return tmpl("function(){ \n#{out}\n return a;\n }", { "out" : out });
	};
	
	/**
	var pictureListFactory = function(){
		var firstLabelFactory = function(){
			//down the rabbit hole
		};
		var secondLabelFactory = function(){
			//down the rabbit hole		
		};
		
		var a  = new rev.containers.VBox();
			a.top(10);
			a.left(10);
			a.right(10);
			a.bottom(60);
			a.style({ "background-color" : "#F0F0F0" });
			
	};
	**/
	var emit_complex_factory = function(obj){
		var factoryFunctions = "";
		var factoryArray = "{";
		var childProperties = "";
		
		// first generate all the child factory methods
		for(var childName in obj.children){
			var child = obj.children[childName];
			factoryFunctions += tmpl("var #{childName}Factory = #{emit};\n", {"childName" : childName, "emit" : emit_object(child)});
			factoryArray += tmpl("#{childName} : #{childName}Factory, ", {"childName" : childName });
			childProperties += tmpl("#{childName} : null,\n", {"childName" : childName});
		}
		
		factoryArray = factoryArray.substring(0,factoryArray.length-2) + "}";
		
		
		// constructor
		var out = tmpl("var b = #{type}.extend({#{childProperties} _childFactories : #{factoryArray}});\n var a = new b();", {
			"type" : obj.type,
			"factoryArray" : factoryArray,
			"childProperties" : childProperties
		});
		
		// apply properties
		for(var prop in obj){
			if(prop != 'type' && prop != 'children'){
				var val = obj[prop];
				out += collectProperty(prop, val);
			}
		}
		
		//wrap up factory function
		return tmpl("function(){ \n #{factories}\n#{out}\n return a;\n }", { "factories" : factoryFunctions, "out" : out });
	};
	
	var collectProperty = function(prop, val){
		if(typeof val == 'string'){
			return tmpl("a.#{name}('#{value}');\n", {
				"name" : prop,
				"value" : val
			});
		}else if(typeof val === 'object'){
			return tmpl("a.#{name}(#{value});\n", {
				"name" : prop,
				"value" : JSON.encode(val)
			});
		}else if(typeof val === 'function'){
			throw_error("function bindings have not been implemented yet.");
		}else{
			//assume a literal right now; aka a number, null, undefined, etc
			return tmpl("a.#{name}(#{value});\n", {
				"name" : prop,
				"value" : val
			});
		}
	};
	
	var validate_object = function(obj){
		if(obj.type == undefined){
			throw_error("encountered undefined view type, added type attribute.");
			return false;
		}
		return true;
	};
	
	var throw_error = function(msg){
		print("Error :: compiling view <filename: " + filename + "> <msg: " + msg + ">");
	};
	
	var info = function(msg){
		print("Info :: compiling view <filename: " + filename + "> <msg: " + msg + ">");
	};
	
	var tmpl = function(str, data){
		var result = str;
		for(var prop in data){
			print('prop: ' + prop);
			result = result.replace("#{"+prop+"}", data[prop], "g");
		}
		return result;
	};
	
	var src = emit_object(view_json);
	return tmpl("$(document).ready(function(){ \nvar view = (#{factory})(); \n});", {"factory" : src });
};