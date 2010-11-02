var fs = require("file");
var task = require("jake").task;
var less = require("less");

//require.paths.push('./framework/codegen/view_expansion');

var ve = require('./framework/codegen/view_expansion');

var FRAMEWORK_FILES = ('jquery.js base.js core.js utils.js controls.js containers.js controllers.js').split(' ');

var APP_FILES = ['app.js'];

function framework_less(){
    var output = '',
          files = ('base.less layout.less theme.less').split(' ');
    files.map(function(file) {
        output += fs.read('framework/style/' + file);
    });
    return output;
}

function framework_source(){
    var output = '',
          files = FRAMEWORK_FILES;
    files.map(function(file) {
        output += fs.read('framework/client/' + file);
    });
    return output;
}

function force_delete_folder(file){
    var paths = fs.listPaths(file);
    var len = paths.length;
    while(len--){
        var sub_file = fs.join(file, paths[len]);
        if(fs.isDirectory(sub_file)){
            force_delete_folder(sub_file);
        }else{
            fs.remove(sub_file);
        }
    }
    fs.remove(file);
}

function copy_file(from, to){
    var content = fs.read(from);
    fs.write(to, content);
}

task("test", [], function(){
	print('test');
	var json = fs.read('lib/view.js');
	var view = JSON.decode(json);
	var result = ve.view_expander('view', view);
	print(result);
});

task("debug-build", ['clean','debug-framework-build','debug-application-build'], function(){
    var js_output = "";
    FRAMEWORK_FILES.map(function(file){
        js_output += "<script type='text/javascript' src='js/"+file+"'></script>";
    });
    APP_FILES.map(function(file){
		js_output += "<script type='text/javascript' src='js/"+file+"'></script>";
	});
    
    var css_output = "<link rel='stylesheet' type='text/css' href='debug-framework.css' />"
    //generate html file
    var html = "<html><head><title>Debug Build</title>"+css_output+js_output+"</head><body></body></html>";
    fs.write(fs.join('build', 'debug', 'index.html'), html);
});

task("debug-framework-build", [], function(){
    //js
    var files = FRAMEWORK_FILES;
    files.map(function(file) {
        var output = fs.read(fs.join('framework', 'client', file));
        fs.write(fs.join('build', 'debug', 'js', file), output);
    });
    
    //css
    var less_src = framework_less();
    var css = less.compileString(less_src);
    var css_file = fs.join('build', 'debug', 'debug-framework.css');
    fs.write(css_file, css);
});

task("release-framework-build", [], function(){
    var fm_src = framework_source();
    var end_file = fs.join('build', 'debug-framework.js');
    fs.write(end_file, fm_src);
    
    //css
    var less_src = framework_less();
    var css = less.compileString(less_src);
    var css_file = fs.join('build', 'debug', 'debug-framework.css');
    fs.write(css_file, css);
});

task("debug-application-build", [], function(){
    // copy_file(fs.join('lib', 'index.html'), fs.join('build', 'index.html'));
    copy_file(fs.join('lib', 'app.js'), fs.join('build', 'debug', 'js', 'app.js'));
});

task("clean", [], function(){
    if (fs.exists('build')) {
        force_delete_folder('build');
    }
    fs.mkdir('build');
	fs.mkdir(fs.join('build', 'debug'));
	fs.mkdir(fs.join('build', 'debug', 'js'));
});


