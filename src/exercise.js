/**
* Module that contains support for TRAKLA2-type exercises.
* Depends on core.js, anim.js, datastructures.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  var Exercise = function(jsav, options) {
    this.jsav = jsav;
    this.options = jQuery.extend({}, {reset: function() { }, controls: null}, options);
    // initialize controls
    var cont = $(this.options.controls) || this.jsav.container.find(".jsavexercisecontrols"),
        self = this;
    if (cont.size()) {
      var $reset = $('<input type="button" name="reset" value="Reset" />').click(
            function() {
              self.reset();
            }),
          $model = $('<input type="button" name="answer" value="Model Answer" />').click(
            function() {
              self.modelanswer();
            }),
          $grade = $('<input type="button" name="grade" value="Grade" />').click(
            function() {
              self.grade();
            });
      cont.append($reset, $model, $grade);
    }
  };
  var exerproto = Exercise.prototype;
  exerproto.grade = function() {
    // behavior in a nutshell:
    // 1. get the student's solution
    // 2. get the model answer
    // 3. rewind both
    // 4. compare the states in the visualizations
    // 5. TODO: scale the points
    // 6. show result to student
    // 7. TODO: show comparison of own and model side by side (??)
    this.jsav.begin();
    if (!this.modelav) {
      this.modelanswer();
    }
    this.modelav.begin();
    $.fx.off = true;
    var totalSteps = 0,
        correct = 0,
        gradeStepFunction = function(step) { return step.options.grade; };
    while (this.modelav.currentStep() < this.modelav.totalSteps() && 
           this.jsav.currentStep() < this.jsav.totalSteps()) {
      this.jsav.forward(gradeStepFunction);
      this.modelav.forward(gradeStepFunction);
      totalSteps++;
      if (this.modelStructures.compare(this.initialStructures, this.options.compare)) {
        correct++;
      } else {
        break;
      }
    }
    // figure out the total number of steps in model answer
    while (this.modelav.currentStep() < this.modelav.totalSteps()) {
      this.modelav.forward(gradeStepFunction);
      totalSteps++;
    }
    this.modelav.begin();
    $.fx.off = false;
    
    alert("Your score: " + correct + " / " + totalSteps);
  };
  exerproto.modelanswer = function() {
    var model = this.options.model;
    if ($.isFunction(model)) {
      // behavior in a nutshell:
      // 1. create a new JSAV (and the HTML required for it)
      this.modelav = new JSAV($("<div><div class='jsavcontrols'/><span class='jsavcounter'></div>").addClass("jsavmodelanswer"));
      // 2. run the model function on it
      JSAV.utils.dialog(this.modelav.container, {'title': 'Model Answer', 'closeText': "Close"});
      var str = model(this.modelav);
      this.modelav.begin();
      this.modelStructures = str;
    } else if (typeof model === "string") {
      // TODO: implement this (?)
      // if a string, assume it is a URL of an AV
      // behavior in a nutshell:
      // 1. complete the URL with initial data configuration as query params
      // 2. open a new window for the model answer
    }
  };
  exerproto.reset = function() {
    this.jsav.clear();
    this.initialStructures = this.options.reset();
    if (this.modelav) {
      this.modelav.container.remove();
      this.modelav = undefined;
      this.modelStructures = undefined;
    }
  };
  
  JSAV.ext.exercise = function(options) {
    return new Exercise(this, options);
    // options:
    //  - reset: a function that initializes the exercise and returns the structure(s) to 
    //           compare in grading
    //  - model: a function that generates the model answer and returns the structure(s) to
    //           compare in grading
    //  - controls: a DOM/jQuery element or a selector for the element where the exercise
    //              controls (reset, model, grade) are to be added
    //  - pointScale: single number for max points OR array of min and max range OR
    //                a function that is given the correct states and total states
  };
})(jQuery);