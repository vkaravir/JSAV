var fs = require('fs'),
  path = require('path'),
  sys = require('sys');

task('concat', [], function () {
  var files = ('src/core.js src/utils.js src/anim.js src/messages.js src/graphicals.js src/datastructures.js src/layout.js src/settings.js src/exercise.js').split(' '),
      filesLeft = files.length,
      pathName = '.',
      outFile = fs.openSync('build/JSAV.js', 'w+');

  files.forEach(function(fileName) {
    var fileName = path.join(pathName, fileName),
        contents = fs.readFileSync(fileName);
    sys.puts('Read: ' + contents.length + ', written: ' + fs.writeSync(outFile, contents.toString()));
  });
  fs.closeSync(outFile);    
});

task('clean', [], function() {
  fs.unlinkSync('build/jsav.js');
  fs.unlinkSync('build/jsav-min.js');
});

task('minify', ['concat'], function() {
  var code = fs.readFileSync('build/JSAV.js'),
      jsmin = require('jsmin').jsmin,
      outFile = fs.openSync('build/JSAV-min.js', 'w+');
  sys.puts('Read: ' + code.length + ', written: ' + fs.writeSync(outFile, jsmin(code.toString())));
  fs.closeSync(outFile);
});

desc('Main build task');
task('build', ['concat', 'minify'], function() {});
task('rebuild', ['clean', 'build'], function() {});