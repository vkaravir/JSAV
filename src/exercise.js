/**
* Module that contains support for TRAKLA2-type exercises.
* Depends on core.js, anim.js, datastructures.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  var Exercise = function(jsav, options) {
    this.jsav = jsav;
    this.options = jQuery.extend({}, options, {});
  };
  var exerproto = Exercise.prototype;
  exerproto.grade = function() {
    // behavior in a nutshell:
    // 1. get the student's solution
    // 2. get the model answer
    // 3. get the selector for the structures to compare
    // 4. rewind both
    // 5. compare the states in the visualizations
    // 6. scale the points
    // 7. show result to student
    // 8. show comparison of own and model side by side (??)
  };
  exerproto.modelanswer = function() {
    var model = this.options.model;
    if ($.isFunction(model)) {
      // behavior in a nutshell:
      // 1. create a new JSAV (and the HTML required for it)
      var modelav = undefined;
      // 2. run the model function on it
      model(modelav);
    } else if (typeof model === "string") {
      // if a string, assume it is a URL of an AV
      // behavior in a nutshell:
      // 1. complete the URL with initial data configuration as query params
      // 2. open a new window for the model answer
    }
  };
  exerproto.reset = function() {};
  
  JSAV.ext.exercise = function(options) {
    return new Exercise(this, options);
    // options:
    //  - model: specify how the model answer is generated (function or URL as a string)
    //  - pointScale: single number for max points OR array of min and max range OR
    //                a function that is given the correct states and total states
  };
})();