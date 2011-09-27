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
              self.showModelanswer();
            }),
          $grade = $('<input type="button" name="grade" value="Grade" />').click(
            function() {
              self.showGrade();
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
    // 6. return result
    // 7. TODO: show comparison of own and model side by side (??)
    var origStep = this.jsav.currentStep();
    this.jsav.begin();
    if (!this.modelav) {
      this.modelanswer();
    }
    this.modelav.begin();
    $.fx.off = true;
    var totalSteps = 0,
        correct = 0,
        forwStudent = true,
        forwModel = true,
        modelTotal = this.modelav.totalSteps(), // "cache" the size
        studentTotal = this.jsav.totalSteps(), // "cache" the size
        // function to filter the steps to those that should be graded
        gradeStepFunction = function(step) { return step.options.grade; };
    while (forwStudent && forwModel && this.modelav.currentStep() < modelTotal && 
           this.jsav.currentStep() < studentTotal) {
      forwStudent = this.jsav.forward(gradeStepFunction);
      forwModel = this.modelav.forward(gradeStepFunction);
      if (forwModel) {
        totalSteps++;
        if (forwModel && forwStudent && this.modelStructures.equals(this.initialStructures, this.options.compare)) {
          correct++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    // figure out the total number of graded steps in model answer
    forwModel = true;
    while (forwModel && this.modelav.currentStep() < modelTotal) {
      forwModel = this.modelav.forward(gradeStepFunction);
      if (forwModel) {
        totalSteps++;
      }
    }
    this.modelav.begin();
    this.jsav.jumpToStep(origStep);
    $.fx.off = false;
    return {correct: correct, total: totalSteps};
  };
  exerproto.showGrade = function() {
    // shows an alert box of the grade
    var grade = this.grade();
    alert("Your score: " + grade.correct + " / " + grade.total);
  };
  exerproto.modelanswer = function() {
    var model = this.options.model;
    if ($.isFunction(model)) {
      // behavior in a nutshell:
      // 1. create a new JSAV (and the HTML required for it)
      this.modelav = new JSAV($("<div><div class='jsavcontrols'/><span class='jsavcounter'></div>").addClass("jsavmodelanswer"));
      this.modelDialog = JSAV.utils.dialog(this.modelav.container, 
                {'title': 'Model Answer', 'closeText': "Close", "closeOnClick": false});
      var str = model(this.modelav);
      this.modelav.begin();
      this.modelStructures = str;
      this.modelDialog.hide();
    } else if (typeof model === "string") {
      // TODO: implement this (?)
      // if a string, assume it is a URL of an AV
      // behavior in a nutshell:
      // 1. complete the URL with initial data configuration as query params
      // 2. open a new window for the model answer
    }
  };
  exerproto.showModelanswer = function() {
    this.modelanswer();
    // 2. run the model function on it
    this.modelDialog.show();
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