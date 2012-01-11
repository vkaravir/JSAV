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
                                  fixmodeSelectable: true, grader: "default"}, options);
    // initialize controls
    var cont = $(this.options.controls),
        self = this;
    if (cont.size() == 0) {
       cont = this.jsav.container.find(".jsavexercisecontrols");
    }
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
            }),
          $undo = $('<input type="button" name="undo" value="Undo" />"').click(
            function() {
              self.undo();
            });
      cont.append($undo, $reset, $model, $grade);
    }
    // if feedbacktype can be selected, add settings for it
    if (this.options.feedbackSelectable) {
      this.feedback = this.jsav.settings.add("feedback", {"type": "select", "options": {"continuous": "Continuous", "atend": "At end"}, 
              "label":"Grade Feedback: ", "value": this.options.feedback});
    }
    // if fixmode can be selected, add settings for it
    if (this.options.fixmodeSelectable) {
      this.fixmode = this.jsav.settings.add("fixmode", {"type": "select", "options": {"undo": "Undo incorrect step", "fix": "Fix incorrect step"}, 
              "label": "Continuous feedback behaviour", "value": this.options.fixmode});
    }
    
    // if custom showGrade function is given
    if (this.options.showGrade && $.isFunction(this.options.showGrade)) {
      this.showGrade = this.options.showGrade;
    }
  };
  var allEqual = function(initial, model, compare) {
    if ($.isArray(initial)) {
      for (var i = 0; i < initial.length; i++) {
        if (!model[i].equals(initial[i], compare[i])) {
          return false;
        }
      }
      return true;
    } else {
      return model.equals(initial, compare);
    }
  };
  var graders = {
    "default": function() {
      var totalSteps = 0,
          studentSteps = 0,
          correct = true,
          forwStudent = true,
          forwModel = true,
          modelTotal = this.modelav.totalSteps(), // "cache" the size
          studentTotal = this.jsav.totalSteps(); // "cache" the size

      this.score.correct = 0;
      this.score.student = 0;
      while (correct && forwStudent && forwModel && this.modelav.currentStep() < modelTotal && 
            this.jsav.currentStep() < studentTotal) {
        forwStudent = this.jsav.forward(gradeStepFunction);
        forwModel = this.modelav.forward(gradeStepFunction);
        if (forwStudent) { studentSteps++; }
        correct = false;
        if (forwModel) {
          totalSteps++;
          if (forwModel && forwStudent) {
            if (allEqual(this.initialStructures, this.modelStructures, this.options.compare)) {
              correct = true;
              this.score.correct++;
            }
          }
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
      // figure out the total number of graded steps in student answer
      forwStudent = true;
      while (forwStudent && this.jsav.currentStep() < studentTotal) {
        forwStudent = this.jsav.forward(gradeStepFunction);
        if (forwStudent) {
          studentSteps++;
        }
      }
      this.score.total = totalSteps;
      this.score.student = studentSteps;
    },
    finder: function() {
      var totalSteps = 0,
          studentSteps = 0,
          cont = true,
          forwStudent = true,
          forwModel = true,
          modelTotal = this.modelav.totalSteps(), // "cache" the size
          studentTotal = this.jsav.totalSteps(); // "cache" the size

      this.score.correct = 0;
      this.score.student = 0;
      while (forwModel && cont && this.modelav.currentStep() < modelTotal && 
            this.jsav.currentStep() < studentTotal) {
        forwModel = this.modelav.forward(gradeStepFunction);
        if (forwModel) {
          totalSteps++;
          forwStudent = true;
          while (forwStudent && !allEqual(this.initialStructures, this.modelStructures, this.options.compare) &&
            this.jsav.currentStep() < studentTotal) {
              forwStudent = this.jsav.forward();
          }
          if (allEqual(this.initialStructures, this.modelStructures, this.options.compare)) {
            this.score.correct++;
          } else {
            cont = false;
          }
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
      this.score.total = totalSteps;
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
    graders[this.options.grader].call(this);
    this.modelav.begin();
    this.jsav.jumpToStep(origStep);
    $.fx.off = false;
    return this.score;
  };
  exerproto.showGrade = function() {
    // shows an alert box of the grade
    this.grade();
    var grade = this.score,
      msg = "Your score: " + (grade.correct-grade.fix) + " / " + grade.total;
    if (grade.fix > 0) {
      msg += "\nFixed incorrect steps: " + grade.fix;
    }
    alert(msg);
  };
  exerproto.modelanswer = function() {
    var model = this.options.model;
    if ($.isFunction(model)) {
      // behavior in a nutshell:
      // 1. create a new JSAV (and the HTML required for it)
      this.modelav = new JSAV($("<div><span class='jsavcounter'/><div class='jsavcontrols'/><p class='jsavoutput jsavline'></p></div>").addClass("jsavmodelanswer"));
      // 2. create a dialog for the model answer
      this.modelDialog = JSAV.utils.dialog(this.modelav.container, 
                {'title': 'Model Answer', 'closeText': "Close", "closeOnClick": false, "modal": false});
      // 3. generate the model structures and the state sequence
      var str = model(this.modelav);
      // 4. rewind the model answer and hide the dialog
      this.modelav.recorded();
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
    this.modelav.begin();
    this.modelDialog.show();
  };
  exerproto.reset = function() {
    this.jsav.clear();
    this.score = {total: 0, correct: 0, undo: 0, fix: 0, student: 0};
    this.initialStructures = this.options.reset();
    if (this.modelav) {
      this.modelav.container.remove();
      this.modelav = undefined;
      this.modelStructures = undefined;
    }
    this.jsav._undo = [];
  };
  exerproto.undo = function() {
    $.fx.off = true;
    // undo last step
    this.jsav.backward(); // the empty new step
    this.jsav.backward(); // the new graded step
    // undo until the previous graded step
    if (this.options.grader === "default" && this.jsav.backward(gradeStepFunction)) {
      // if such step was found, redo it
      this.jsav.forward();
      this.jsav.step();
    } else if (this.options.grader !== "default") {
      // other than default grader, finder grader does not use graded steps
    } else {
      // ..if not, the first student step was incorrent and we can rewind to beginning
      this.jsav.begin();
    }
    this.jsav._redo = [];
    $.fx.off = false;
  };
  exerproto.gradeableStep = function() {
    this.jsav.stepOption("grade", true);
    this.jsav.step();
    if (this.feedback && this.feedback.val() == "continuous") {
      this.jsav.container.find(":animated").stop(false, true);
      var grade = this.grade();
      if (grade.student === grade.correct) { // all student's steps are correct
        return;
      }
      var fixmode = this.fixmode.val();
      // undo until last graded step
      this.undo();
      if (fixmode === "fix" && $.isFunction(this.options.fix)) {
        $.fx.off = true;
        this.fix(this.modelStructures);
        $.fx.off = false;
        this.score.fix++;
        alert("Your last step was incorrect. Your work has been replaced with the correct step so that you can continue on.");
      } else if (fixmode === "fix") {
        this.score.undo++;
        alert("Your last step was incorrect and I should fix your solution, but don't know how. So it was undone and you can try again.");
      } else {
        this.score.undo++;
        alert("Your last step was incorrect. Things are reset to the beginning of the step so that you can try again.");
      }
    }
  };
  exerproto.fix = function() {
    var fix = this.options.fix;
    if ($.isFunction(fix)) {
      fix(this.modelStructures);
    };
  };
  exerproto._jsondump = function() {
    var jsav = this.jsav,
        states = [],
        forw = true,
        initial = this.initialStructures,
        origStep = jsav.currentStep(),
        oldFx = $.fx.off || false;
    $.fx.off = true;
    var getstate = function() {
      if ($.isArray(initial)) {
        var state = [];
        for (var i=0, l=initial.length; i < l; i++) {
          state.push(initial[i].state());
        }
        return state;
      } else {
        return initial.state();
      }
    };
    jsav.begin();
    while (forw) {
      states.push(getstate());
      forw = jsav.forward();
    }
    this.jsav.jumpToStep(origStep);
    $.fx.off = oldFx;
  };

  
  JSAV.ext.exercise = function(model, reset, compare, options) {
    var opts = $.extend({model: model, reset: reset, compare:compare}, options);
    return new Exercise(this, opts);
    // options:
    //  - reset: a function that initializes the exercise and returns the structure(s) to 
    //           compare in grading
    //  - model: a function that generates the model answer and returns the structure(s) to
    //           compare in grading
    //  - controls: a DOM/jQuery element or a selector for the element where the exercise
    //              controls (reset, model, grade) are to be added
  };
})(jQuery);
