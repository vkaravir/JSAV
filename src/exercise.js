/**
* Module that contains support for TRAKLA2-type exercises.
* Depends on core.js, anim.js, datastructures.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  // function to filter the steps to those that should be graded
  var gradeStepFunction = function(step) { return step.options.grade; };
  
  var Exercise = function(jsav, options) {
    this.jsav = jsav;
    this.options = jQuery.extend({reset: function() { }, controls: null, feedback: "atend",
                                  feedbackSelectable: true, fixmode: "undo",
                                  fixmodeSelectable: true}, options);
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
    if (this.options.feedbackSelectable) {
      this.feedback = this.jsav.settings.add("feedbck", {"type": "select", "options": {"continuous": "Continuous", "atend": "At end"}, 
              "label":"Grade Feedback: ", "value": this.options.feedback});
    }
    if (this.options.fixmodeSelectable) {
      this.fixmode = settings.add("fixmode", {"type": "select", "options": {"undo": "Undo incorrect step", "fix": "Fix incorrect step"}, 
              "label": "Continuous feedback behaviour", "value": this.options.fixmode});
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
        studentSteps = 0,
        correct = 0,
        forwStudent = true,
        forwModel = true,
        modelTotal = this.modelav.totalSteps(), // "cache" the size
        studentTotal = this.jsav.totalSteps(); // "cache" the size
    while (forwStudent && forwModel && this.modelav.currentStep() < modelTotal && 
           this.jsav.currentStep() < studentTotal) {
      forwStudent = this.jsav.forward(gradeStepFunction);
      forwModel = this.modelav.forward(gradeStepFunction);
      if (forwStudent) { studentSteps++; }
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
    var currModelStep = this.modelav.currentStep();
    // figure out the total number of graded steps in model answer
    forwModel = true;
    while (forwModel && this.modelav.currentStep() < modelTotal) {
      forwModel = this.modelav.forward(gradeStepFunction);
      if (forwModel) {
        totalSteps++;
      }
    }
    // figure out the total number of graded steps in student answer
    forwStudent = true;
    while (forwStudent && this.jsav.currentStep() < studentTotal) {
      forwStudent = this.jsav.forward(gradeStepFunction);
      if (forwStudent) {
        studentSteps++;
      }
    }
    this.modelav.jumpToStep(currModelStep);
    this.jsav.jumpToStep(origStep);
    $.fx.off = false;
    return {correct: correct, total: totalSteps, student: studentSteps};
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
    if (!this.modelav) {
      this.modelanswer();
    }
    this.modelav.begin();
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
  exerproto.gradeableStep = function() {
    this.jsav.stepOption("grade", true);
    this.jsav.forward();
    if (this.feedback && this.feedback.val() == "continuous") {
      var grade = this.grade();
      if (grade.student === grade.correct) { // all student's steps are correct
        return;
      }
      var fixmode = this.fixmode.val();
      if (fixmode === "fix" && $.isFunction(this.options.fix)) {
        $.fx.off = true;
        this.jsav.backward();
        this.jsav.stepOption("grade", false);
        this.jsav.forward();
        // call function to fix last step
        this.fix(this.modelStructures);
        // set the last step to be graded
        this.jsav.stepOption("grade", true);
        this.jsav.forward();
        $.fx.off = false;
        alert("Your last step was incorrect but it has been fixed");
      } else if (fixmode === "fix") {
        alert("Your last step was incorrect and I should fix your solution, but don't know how");
      } else {
        $.fx.off = true;
        // undo last step
        this.jsav.backward();
        // undo until the previous graded step
        if (this.jsav.backward(gradeStepFunction)) {
          // if such step was found, redo it
          this.jsav.forward();
        } else {
          // ..if not, the first student step was incorrent and we can rewind to beginning
          this.jsav.begin();
        }
        this.jsav._redo = [];
        $.fx.off = false;
        alert("Your last step was incorrect and it has been undone");
      }
    }
  };
  exerproto.fix = function() {
    var fix = this.options.fix;
    if ($.isFunction(fix)) {
      fix(this.modelStructures);
    };
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