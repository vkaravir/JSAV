/**
* Module that contains the message output implementations.
* Depends on core.js, anim.js
*/
(function($) {
  var BLOCKED_ATTRIBUTES = ['correct', 'comment', 'points'];
  var createUUID = JSAV.utils.createUUID;
  
  var createInputComponent = function(label, itemtype, value, options) {
    var labelElem = $('<label for="' + options.id + '">' + label + "</label>"),
      input = $('<input id="' + options.id + '" type="' +
        itemtype + '"/>');
    input.val(value);
    $.each(options, function(key, value) {
      if (BLOCKED_ATTRIBUTES.indexOf(key) == -1) {
        input.attr(key, value);
      }
    });
    return $('<div class="jsavrow"/>').append(input).append(labelElem);
  };
  var fbf = function($elems) {
    var cbs = $elems.find('[type="checkbox"]'),
      that = this,
      correct = true;
    if (cbs.size() === 0) {
      cbs = $elems.find('[type="radio"]');
    }
    cbs.each(function(index, item) {
      var qi = that.choiceById(item.id);
      var $item = $(item);
      if (!!$item.prop("checked") != !!qi.options.correct) {
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
  };
  
  var qTypes = {};
  qTypes.TF = {
    init: function() {
      // render a True-False type question
      this.choices[0] = new QuestionItem("False", "checkbox", false, {});
      this.choices[1] = new QuestionItem("True", "checkbox", true, {});
      this.correctChoice = function(correctVal) {
        if (correctVal) {
          this.choices[1].correct = true;
        } else {
          this.choices[0].correct = true;
        }
      };
    },
    addChoice: function(label, value, options) {
      if (!!value) {
        this.choices[1] = new QuestionItem(label, "checkbox", true, options);
      } else {
        this.choices[0] = new QuestionItem(label, "checkbox", false, options);
      }
    },
    feedback: fbf
  };
  qTypes.MC = {
    init: function() {
      this.name = createUUID();
    },
    addChoice: function(label, options) {
      this.choices.push(new QuestionItem(label, "radio", null, $.extend({name: this.name}, options)));
    },
    feedback: fbf
  };
  qTypes.MS = {
    addChoice: function(label, options) {
      this.choices.push(new QuestionItem(label, "checkbox", null, $.extend({}, options)));
    },
    feedback: fbf
  };
  
  var QuestionItem = function(label, itemtype, value, options) {
    this.label = label;
    this.itemtype = itemtype;
    this.value = value;
    this.options = $.extend({}, options);
    if (!("id" in this.options)) {
      this.options.id = createUUID();
    }
    this.correct = this.options.correct || false;
  };
  QuestionItem.prototype.elem = function() {
    return createInputComponent(this.label, this.itemtype, this.value, this.options);
  };
  
  
  var Question = function(jsav, qtype, options) {
    // options: mustBeAsked, useCheckboxes
    // valid types: tf, fib, mc, ms (in the future: remote)
    this.jsav = jsav;
    this.asked = false;
    this.choices = [];
    this.questionText = options.questionText || "";
    this.maxPoints = 1;
    this.achievedPoints = -1;
    this.qtype = qtype.toUpperCase();
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
  qproto.show = function() {
    var $elems = $(),
        that = this;
    for (var i=0; i < this.choices.length; i++) {
      $elems = $elems.add(this.choices[i].elem());
    }
    $elems = $elems.add($('<div class="jsavfeedback" > </div>'));
    var close = $('<input type="button" value="Close" />').click(
      function() {
        that.dialog.close();
    });
    $elems = $elems.add(close);
    var submit = $('<input type="submit" value="Submit" />').click(
      function() {
        that.feedback($elems);
      });
    $elems = $elems.add(submit);
    this.dialog = JSAV.utils.dialog($elems, {title: this.questionText});
    return $elems;
  };
  qproto.choiceById = function(qiId) {
    for (var i = this.choices.length; i--; ) {
      if (this.choices[i].options.id === qiId) {
        return this.choices[i];
      }
    }
    return null;
  };
  // add dummy function for the stuff that question types need to overwrite
  var noop = function() {};
  $.each(['init', 'feedback', 'addChoice'], function(index, val) {
    qproto[val] = noop;
  });
  
  JSAV.ext.question = function(qtype, options) {
    return new Question(this, qtype, $.extend({}, options));
  };
})(jQuery);