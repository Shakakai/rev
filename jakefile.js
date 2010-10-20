var fs = require("file");
var task = require("jake").task;
var less = require("less");

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
          files = ('jquery.js base.js core.js utils.js controls.js containers.js controllers.js').split(' ');
    files.map(function(file) {
        output += fs.read('framework/client/' + file);
    });
    return output;
}

function force_delete_folder(file){
    var paths = fs.listPaths(file);
    var len = paths.length;
    print('force deleting');
    while(len--){
        var sub_file = fs.join(file, paths[len]);
        print(sub_file);
        if(fs.isDirectory(sub_file)){
            print('removing folder');
            force_delete_folder(sub_file);
        }else{
            print('removing file');
            fs.remove(sub_file);
        }
    }
    fs.remove(file);
}

function copy_file(from, to){
    var content = fs.read(from);
    fs.write(to, content);
}

task("debug-build", ['clean','debug-framework-build','debug-application-build'], function(){});

task("debug-framework-build", [], function(){
    //js
    var fm_src = framework_source();
    var end_file = fs.join('build', 'debug-framework.js');
    fs.write(end_file, fm_src);
    
    //css
    var less_src = framework_less();
    var css = less.compileString(less_src);
    var css_file = fs.join('build', 'debug-framework.css');
    fs.write(css_file, css);
});

task("debug-application-build", [], function(){
    copy_file(fs.join('lib', 'index.html'), fs.join('build', 'index.html'));
    copy_file(fs.join('lib', 'app.js'), fs.join('build', 'app.js'));
});

task("clean", [], function(){
    if (fs.exists('build')) {
        force_delete_folder('build');
    }
    fs.mkdir('build');
});


