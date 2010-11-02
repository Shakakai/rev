exports.view_expander = function(filename, view_json){
	
	var emit_object = function(name, obj){
		print('emit_object');
		print(obj);
		print('--------');
		//create class definition
		var klazz_statement = tmpl("var #{name} = new #{type}({#{properties}})", {
			type : obj.type,
			name : name,
			properties : collectProperties(obj)
		});
		
		// emit children into the text
		// add children via addChild
		if(obj.children != undefined){
			for(var childName in obj.children){
				klazz_statement += emit_object(obj.children[childName]);
				klazz_statement += tmpl("#{name}.#{childName} = #{childName}", {
					childName : childName,
					name : name
				});
			}
		}
	};
	var collectProperties = function(obj){
		var result = "";
		for(var prop in obj){
			if(prop == 'children'){
				for(var p in obj.children){
					//create a placeholder to be filled later
					result += tmpl("#{name} : null", {
						name : p
					});
				}
			}else if(prop != 'type'){
				//assume this is a class property
				result += collectProperty(prop, obj[prop]);
			}
		}
		return result;
	};
	var collectProperty = function(prop, val){
		if(typeof val == 'string'){
			return tmpl("#{name}:'#{value}'", {
				name : prop,
				value : val
			});
		}else if(typeof val == object){
			return tmpl("#{name}: #{value}", {
				name : prop,
				value : val.toString()
			});
		}else{
			//assume a number right now 
			return tmpl("#{name}:#{value}", {
				name : prop,
				value : val
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
			result.replace("#{"+prop+"}", data[prop]);
		}
		return result;
	};
	return emit_object(name, view_json);
};