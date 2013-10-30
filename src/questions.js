/**
* Module that contains the message output implementations.
* Depends on core.js, anim.js, utils.js
*/
(function($) {
  "use strict";
  var BLOCKED_ATTRIBUTES = ['correct', 'comment', 'points'];
  var createUUID = JSAV.utils.createUUID;
  
  var createInputComponent = function(label, itemtype, options) {
    var labelElem = $('<label for="' + options.id + '">' + label + "</label>"),
      input = $('<input id="' + options.id + '" type="' +
        itemtype + '"/>');
    $.each(options, function(key, value) {
      if (BLOCKED_ATTRIBUTES.indexOf(key) === -1) {
        input.attr(key, value);
      }
    });
    return $('<div class="jsavrow"/>').append(input).append(labelElem);
  };
  var feedbackFunction = function($elems) {
    var cbs = $elems.find('[type="checkbox"]'),
      that = this,
      correct = true;
    if (cbs.size() === 0) {
      cbs = $elems.find('[type="radio"]');
    }
    cbs.each(function(index, item) {
      var qi = that.choiceById(item.id);
      var $item = $(item);
      if (!!$item.prop("checked") !== !!qi.options.correct) {
        correct = false;
        return false; // break the loop
      }
    });
    $elems.filter(".jsavfeedback").html(correct?"Correct!":"Incorrect, try again")
        .removeClass("jsavcorrect jsavincorrect")
        .addClass(correct?"jsavcorrect":"jsavincorrect");
    if (correct) {
      cbs.prop("disabled", true);
      $elems.filter('[type="submit"]').remove();
    }
    // TODO: add support for points, feedback comments etc.
  };
  
  var qTypes = {};
  qTypes.TF = { // True-False type question
    init: function() {
      this.choices[0] = new QuestionItem(this.options.falseLabel || "False",
                                        "checkbox", {correct: !this.options.correct});
      this.choices[1] = new QuestionItem(this.options.trueLabel || "True",
                                        "checkbox", {correct: !!this.options.correct});
      this.correctChoice = function(correctVal) {
        if (correctVal) {
          this.choices[1].correct = true;
        } else {
          this.choices[0].correct = true;
        }
      };
    },
    feedback: feedbackFunction
  };
  qTypes.MC = {
    init: function() {
      this.name = createUUID();
    },
    addChoice: function(label, options) {
      this.choices.push(new QuestionItem(label, "radio", $.extend({name: this.name}, options)));
    },
    feedback: feedbackFunction
  };
  qTypes.MS = {
    addChoice: function(label, options) {
      this.choices.push(new QuestionItem(label, "checkbox", $.extend({}, options)));
    },
    feedback: feedbackFunction
  };
  
  var QuestionItem = function(label, itemtype, options) {
    this.label = label;
    this.itemtype = itemtype;
    this.options = $.extend({}, options);
    if (!("id" in this.options)) {
      this.options.id = createUUID();
    }
    this.correct = this.options.correct || false;
  };
  QuestionItem.prototype.elem = function() {
    return createInputComponent(this.label, this.itemtype, this.options);
  };
  
  
  var Question = function(jsav, qtype, questionText, options) {
    // TODO: support for options: mustBeAsked, maxPoints
    // valid types: tf, fib, mc, ms (in the future: remote)
    this.jsav = jsav;
    this.asked = false;
    this.choices = [];
    this.questionText = questionText;
    this.maxPoints = 1;
    this.achievedPoints = -1;
    this.qtype = qtype.toUpperCase();
    this.options = options;
    var funcs = qTypes[this.qtype];
    var that = this;
    $.each(funcs, function(fName, f) {
      that[fName] = f;
    });
    this.init();
  };
  var qproto = Question.prototype;
  qproto.id = function(newId) {
    if (typeof newId !== "undefined") {
      this.id = newId;
    } else {
      return this.id;
    }
  };
  qproto.show = JSAV.anim(function() {
    // once asked, ignore; when recording, ignore
    if (this.asked || !this.jsav._shouldAnimate()) { return; }
    this.asked = true; // mark asked
    var $elems = $(),
        that = this;
    for (var i=0; i < this.choices.length; i++) {
      $elems = $elems.add(this.choices[i].elem());
    }
    // add feedback element
    $elems = $elems.add($('<div class="jsavfeedback" > </div>'));
    // ... and close button
    var close = $('<input type="button" value="Close" />').click(
      function() {
        that.dialog.close();
      });
    $elems = $elems.add(close);
    // .. and submit button
    var submit = $('<input type="submit" value="Submit" />').click(
      function() {
        that.feedback($elems);
      });
    $elems = $elems.add(submit);
    // .. and finally create a dialog to show the question
    this.dialog = JSAV.utils.dialog($elems, {title: this.questionText});
    return $elems;
  });
  qproto.choiceById = function(qiId) {
    for (var i = this.choices.length; i--; ) {
      if (this.choices[i].options.id === qiId) {
        return this.choices[i];
      }
    }
    return null;
  };
  
  // dummy function for the animation, there is no need to change the state
  // when moving in animation; once shown, the question is not shown again
  qproto.state = function() {};
  
  // add dummy function for the stuff that question types need to overwrite
  var noop = function() {};
  $.each(['init', 'feedback', 'addChoice'], function(index, val) {
    qproto[val] = noop;
  });
  
  JSAV.ext.question = function(qtype, questionText, options) {
    return new Question(this, qtype, questionText, $.extend({}, options));
  };
}(jQuery));