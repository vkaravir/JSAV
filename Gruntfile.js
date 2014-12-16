// Grunt build file for JSAV
module.exports = function(grunt) {
  "use strict";

  var BUILD_DIR = 'build/',
      SRC_DIR = 'src/';

  // content added to the beginning of the built file
  var JS_BANNER = '/*!\n' +
    ' * JSAV - JavaScript Algorithm Visualization Library\n' +
    ' * Version <%= gitinfo.version %>\n' +
    ' * Copyright (c) 2011-' + new Date().getFullYear() + ' by Ville Karavirta and Cliff Shaffer\n' +
    ' * Released under the MIT license.\n' +
    ' */\n';
  // content added at the end of the file
  var JS_FOOTER = '\n/**\n' +
    ' * Version support\n' +
    ' * Depends on core.js\n' +
    ' */\n' +
    '(function() {\n' +
    '   if (typeof JSAV === "undefined") { return; }\n' +
    '   JSAV.version = function() {\n' +
    '     return "<%= gitinfo.version %>";\n' +
    '   };\n' +
    '})();\n';

  // autoload all grunt tasks in package.json
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    gitinfo: { // get the JSAV version info from git tag and number
      commands: { // expose it as gitinfo.version
        version: ['describe', '--tags', '--long']
      }
    },
    concat: {  // concat the JSAV javascript file
      options: { // use the header and footer specified above
        banner: JS_BANNER,
        footer: JS_FOOTER
      },
      build: { // the order matters, so list every file manually
        src: [SRC_DIR + 'core.js',
              SRC_DIR + 'translations.js',
              SRC_DIR + 'anim.js',
              SRC_DIR + 'utils.js',
              SRC_DIR + 'messages.js',
              SRC_DIR + 'effects.js',
              SRC_DIR + 'events.js',
              SRC_DIR + 'graphicals.js',
              SRC_DIR + 'datastructures.js',
              SRC_DIR + 'array.js',
              SRC_DIR + 'tree.js',
              SRC_DIR + 'list.js',
              SRC_DIR + 'graph.js',
              SRC_DIR + 'matrix.js',
              SRC_DIR + 'code.js',
              SRC_DIR + 'settings.js',
              SRC_DIR + 'questions.js',
              SRC_DIR + 'exercise.js'],
        dest: BUILD_DIR + 'JSAV.js'
      }
    },
    uglify: { // for building the minified version
      build: {
        options: {
          preserveComments: 'some'
        },
        files: {
          'build/JSAV-min.js': [BUILD_DIR + 'JSAV.js']
        }
      }
    },
    jshint: { // for linting the JS
      sources: ['Gruntfile.js', 'src/*.js'],
      tests: ['test/**/*.js']
    },
    csslint: { // for linting the CSS
      jsav: {
        src: ['css/JSAV.css']
      }
    }
  });

  grunt.registerTask('build', ['gitinfo', 'concat', 'uglify']);
  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('default', ['build']);
};