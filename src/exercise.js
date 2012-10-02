/**
* Module that contains support for TRAKLA2-type exercises.
* Depends on core.js, anim.js, utils.js
*/
(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }
  // function to filter the steps to those that should be graded
  var gradeStepFunction = function(step) { return step.options.grade; };

  var updateScore = function(exer) {
    if (exer.options.feedback === "continuous") {
      if (!exer.modelav) {
        exer.modelanswer();
        exer.grade();
      }
      exer.jsav.container.find(".jsavcurrentscore").text(exer.score.correct - exer.score.fix);
      exer.jsav.container.find(".jsavcurrentmaxscore").text(exer.score.correct);
      exer.jsav.container.find(".jsavmaxscore").text(exer.score.total);
    }
  };

  var Exercise = function(jsav, options) {
    this.jsav = jsav;
    this.options = jQuery.extend({reset: function() { }, controls: null, feedback: "atend",
                                  feedbackSelectable: false, fixmode: "undo",
                                  fixmodeSelectable: false, grader: "default"}, options);
    // initialize controls
    var cont = $(this.options.controls),
        self = this;
    if (cont.size() === 0) {
       cont = this.jsav.container.find(".jsavexercisecontrols");
    }
    if (cont.size()) {
      var $reset = $('<input type="button" name="reset" value="Reset" />').click(
            function() {
              self.jsav.logEvent({type: "jsav-exercise-reset"});
              self.reset();
            }),
          $model = $('<input type="button" name="answer" value="Model Answer" />').click(
            function() {
              self.jsav.logEvent({type: "jsav-exercise-model-open"});
              self.showModelanswer();
            }),
          $grade = $('<input type="button" name="grade" value="Grade" />').click(
            function() {
              self.showGrade();
              self.jsav.logEvent({type: "jsav-exercise-grade", score: $.extend({}, self.score)});
            }),
          $undo = $('<input type="button" name="undo" value="Undo" />"').click(
            function() {
              self.jsav.logEvent({type: "jsav-exercise-undo"});
              self.undo();
            });
      cont.append($undo, $reset, $model, $grade);
    }
    // if feedbacktype can be selected, add settings for it
    if (this.options.feedbackSelectable) {
      this.feedback = this.jsav.settings.add("feedback",
              {"type": "select", "options": {"continuous": "Continuous", "atend": "At end"},
              "label":"Grade Feedback: ", "value": this.options.feedback});
    }
    // if fixmode can be selected, add settings for it
    if (this.options.fixmodeSelectable) {
      this.fixmode = this.jsav.settings.add("fixmode",
              {"type": "select", "options": {"undo": "Undo incorrect step", "fix": "Fix incorrect step"},
              "label": "Continuous feedback behaviour", "value": this.options.fixmode});
    }

    // if jsavscore element is present and empty, add default structure
    var $jsavscore = this.jsav.container.find(".jsavscore");
    if ($jsavscore.size() === 1 && $jsavscore.children().size() === 0 &&
      this.options.feedback === "continuous") {
      $jsavscore.html('Your current score is <span class="jsavcurrentscore"></span> out of ' +
          '<span class="jsavcurrentmaxscore" ></span>. Maximum score will be out of ' +
          '<span class="jsavmaxscore" ></span>.');
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
          modelAv = this.modelav,
          studentAv = this.jsav,
          modelTotal = modelAv.totalSteps(), // "cache" the size
          studentTotal = studentAv.totalSteps(); // "cache" the size

      this.score.correct = 0;
      this.score.student = 0;
      while (correct && forwStudent && forwModel && modelAv.currentStep() < modelTotal &&
            studentAv.currentStep() < studentTotal) {
        forwStudent = studentAv.forward(gradeStepFunction);
        forwModel = modelAv.forward(gradeStepFunction);
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
      while (forwModel && modelAv.currentStep() < modelTotal) {
        forwModel = modelAv.forward(gradeStepFunction);
        if (forwModel) {
          totalSteps++;
        }
      }
      // figure out the total number of graded steps in student answer
      forwStudent = true;
      while (forwStudent && studentAv.currentStep() < studentTotal) {
        forwStudent = studentAv.forward(gradeStepFunction);
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
          modelAv = this.modelav,
          studentAv = this.jsav,
          modelTotal = modelAv.totalSteps(), // "cache" the size
          studentTotal = studentAv.totalSteps(); // "cache" the size

      this.score.correct = 0;
      this.score.student = 0;
      while (forwModel && cont && modelAv.currentStep() < modelTotal &&
            studentAv.currentStep() < studentTotal) {
        forwModel = modelAv.forward(gradeStepFunction);
        if (forwModel) {
          totalSteps++;
          forwStudent = true;
          while (forwStudent && !allEqual(this.initialStructures, this.modelStructures, this.options.compare) &&
            studentAv.currentStep() < studentTotal) {
              forwStudent = studentAv.forward();
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
      while (forwModel && modelAv.currentStep() < modelTotal) {
        forwModel = modelAv.forward(gradeStepFunction);
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
    window.alert(msg);
  };
  exerproto.modelanswer = function() {
    var model = this.options.model,
        self = this,
        modelOpts = $.extend({ "title": 'Model Answer', "closeOnClick": false, "modal": false,
                              "closeCallback": function() { self.jsav.logEvent({type: "jsav-exercise-model-close"}); } },
                    this.options.modelDialog); // options passed for the model answer window
    // function that will "catch" the model answer animator log events and rewrite
    // their type to have the jsav-exercise-model prefix and the av id
    var modelLogHandler = function(eventData) {
      eventData.av = self.jsav.id();
      eventData.type = eventData.type.replace("jsav-", "jsav-exercise-model-");
      $("body").trigger("jsav-log-event", eventData);
    };
    if ($.isFunction(model)) {
      // behavior in a nutshell:
      // 1. create a new JSAV (and the HTML required for it)
      this.modelav = new JSAV($("<div><span class='jsavcounter'/><div class='jsavcontrols'/><p class='jsavoutput jsavline'></p></div>").addClass("jsavmodelanswer"),
              {logEvent: modelLogHandler });
      // 2. create a dialog for the model answer
      this.modelDialog = JSAV.utils.dialog(this.modelav.container, modelOpts );
      // 3. generate the model structures and the state sequence
      var str = model(this.modelav);
      // 4. rewind the model answer and hide the dialog
      this.modelav.recorded();
      this.modelStructures = str;
      this.modelDialog.hide();
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
    updateScore(this);
  };
  exerproto.undo = function() {
    var oldFx = $.fx.off || false;
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
      this.jsav.step();
    } else {
      // ..if not, the first student step was incorrent and we can rewind to beginning
      this.jsav.begin();
    }
    this.jsav._redo = [];
    $.fx.off = oldFx;
  };
  exerproto.gradeableStep = function() {
    this.jsav.stepOption("grade", true);
    this.jsav.step();
    if ((this.feedback && this.feedback.val() === "continuous") ||
        (!this.feedback && this.options.feedback === "continuous")) {
      this.jsav.container.find(":animated").stop(false, true);
      var grade = this.grade();
      if (grade.student === grade.correct) { // all student's steps are correct
        this.jsav.logEvent({ type: "jsav-exercise-grade-change", score: $.extend({}, grade)});
        updateScore(this);
        return;
      }
      var fixmode = this.fixmode?this.fixmode.val():this.options.fixmode;
      // undo until last graded step
      this.undo();
      if (fixmode === "fix" && $.isFunction(this.options.fix)) {
        $.fx.off = true;
        // make sure model answer is at the beginning..
        this.modelav.begin();
        // .. and forward it to the correct position
        for (var i = 0; i <= grade.correct; i++) {
          this.modelav.forward(gradeStepFunction);
        }
        // call the fix function of the exercise to correct the state
        this.fix(this.modelStructures);
        $.fx.off = false;
        this.score.fix++;
        this.jsav.logEvent({type: "jsav-exercise-step-fixed", score: $.extend({}, grade)});
        window.alert("Your last step was incorrect. Your work has been replaced with the correct step so that you can continue on.");
      } else if (fixmode === "fix") {
        this.score.undo++;
        window.alert("Your last step was incorrect and I should fix your solution, but don't know how. So it was undone and you can try again.");
      } else {
        this.score.undo++;
        this.jsav.logEvent({type: "jsav-exercise-step-undone", score: $.extend({}, grade)});
        window.alert("Your last step was incorrect. Things are reset to the beginning of the step so that you can try again.");
      }
      updateScore(this);
    }
  };
  exerproto.fix = function() {
    var fix = this.options.fix;
    if ($.isFunction(fix)) {
      fix(this.modelStructures);
    }
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
    return JSON.stringify(states);
  };

  JSAV._types.Exercise = Exercise;
  
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
}(jQuery));