/**
* Module that contains the message output implementations.
* Depends on core.js, anim.js
*/
/*global JSAV, jQuery */
(function($) {
  "use strict";
  if (typeof JSAV === "undefined") { return; }

  var MessageHandler = function(jsav, output) {
    this.jsav = jsav;
    this.output = output;
    if (this.output && "title" in jsav.options) {
      this.output.html("<div class='jsavtitle'>" + jsav.options.title + "</div>");
    }
  };
  MessageHandler.prototype.umsg = JSAV.anim(function(msg, options) {
    if (options && options.fill && typeof options.fill === "object") {
      // replace the labels in the string if the replacements are given in the options
      msg = JSAV.utils.replaceLabels(msg, options.fill);
    }
    var opts = $.extend({color: "black", preserve: false}, options);
    if (this.output) {
      if (this.output.hasClass("jsavline") && opts.preserve) {
        var el = this.output.find("div:last"),
          newmsg = "<span style='color:" + opts.color + ";'>" + msg + "</span>";
        if (el.size() > 0) { // existing content in message output
          el.append(newmsg);
        } else { // first message
          this.output.html("<div style='color:" + opts.color + ";'>" + msg + "</div>");
        }
      } else if (this.output.hasClass("jsavline")) {
        this.output.html("<div style='color:" + opts.color + ";'>" + msg + "</div>");
      //} else if (this.output.hasClass("jsavscroll")) {
      } else { // e.g. "jsavscroll", which is default
        this.output.append("<div style='color:" + opts.color + ";'>" + msg + "</div>");
        if (this.output[0]) {
          this.output[0].scrollTop = this.output[0].scrollHeight;
        }
      }
    }
    // Narrating every call to umsg
    if($(this.jsav.container).attr("voice") === "true") {
      this.jsav.textToSpeech(msg, this.jsav.options.narration);
    }
    if (!this.jsav.RECORD) { // trigger events only if not recording
      this.jsav.container.trigger("jsav-message", [msg, options]);
    }
    return this;
  });
  MessageHandler.prototype.clear = JSAV.anim(function() {
    if (this.output) {
      this.output.html("");
    }
  });
  MessageHandler.prototype.state = function(newValue) {
    if (newValue) {
      this.output.html(newValue);
      this.jsav.container.trigger("jsav-message", [newValue, this.options]);
      // Narrating for Backward buttons
      if($(this.jsav.container).attr("voice") === "true") {
        this.jsav.textToSpeech(newValue, this.jsav.options.narration);
      }
    } else {
      return this.output.html() || "<span/>";
    }
  };

  JSAV.ext.umsg = function(msg, options) {
    this._msg.umsg(msg, options);
  };
  JSAV.ext.clearumsg = function(msg, options) {
    this._msg.clear();
  };

  JSAV.ext.textToSpeech = function(speechText, options) {
    var synth = window.speechSynthesis;
    if (typeof synth === "undefined") {
      return;
    }
    var modifiedMsg = speechText;
    var replacements = options.overrideReplacements || options.replacements || [];
    if (options.appendReplacements) {
      replacements = replacements.concat(options.appendReplacements);
    }
    for (var i = 0; i < replacements.length; i++) {
      var replacement = replacements[i];
      modifiedMsg = modifiedMsg.replace(replacement.searchValue, replacement.replaceValue);
    }
    var u = new SpeechSynthesisUtterance();
    var amISpeaking = synth.speaking;
    u.lang = options.lang || 'en';
    u.rate = 1.0;
    // Assign the umsg text to the narration file
    u.text = modifiedMsg;
    if(amISpeaking === true) {
      synth.cancel();
    }
    synth.speak(u);
  };

  var soundSettings = function(jsav) {
    // creating the button element
    var $elem = $("<button class='jsavsound soundOff'></button>");
    // Sound button click event
    $elem.click(function() {
      for (var j = 0; j < window.length; j++) {
        $(".sound", window.frames[j].document).not(this).each(function() {
          $(this.offsetParent).parent().find(".jsavcontainer").attr("voice", "false");
          $(this).removeClass("sound").addClass("soundOff");
        });
      }
      // SwitchingOff sound buttons not in frames
      $(".sound", window.document).not(this).each(function() {
        $(this.offsetParent).parent().find(".jsavcontainer").attr("voice", "false");
        $(this).removeClass("sounds").addClass("soundOff");
      });
      //Toggle voice attribute and stop the current voice
      var synth = window.speechSynthesis;
      var amISpeaking = synth.speaking;
      // "inlineav" slideshows
      if($(this.offsetParent).attr("voice") !== undefined) {
        if($(this.offsetParent).attr("voice") === "true") {
          $(this.offsetParent).attr("voice", "false");
          if(amISpeaking === true) {
            synth.cancel();
          }
        } else {
          $(this.offsetParent).attr("voice", "true");
        } //slideshows in a frame
      } else if($(this.offsetParent).parent().find(".jsavcontainer").attr("voice") === "true") {
        $(this.offsetParent).parent().find(".jsavcontainer").attr("voice", "false");
        if(amISpeaking === true) {
          synth.cancel();
        }
      } else {
        $(this.offsetParent).parent().find(".jsavcontainer").attr("voice", "true");
      }
      //Toggle button class sound/soundOff
      if($(this).hasClass("sound")) {
        $(this).removeClass("sound").addClass("soundOff");
        jsav.logEvent({
          "type": "jsav-narration-off",
          "currentStep": jsav.currentStep(),
          "totalSteps": jsav.totalSteps()
        });
      } else {
        var txt = $(this.offsetParent).find(".jsavoutput").clone().find(".MathJax").remove().end().text();
        jsav.textToSpeech(txt, jsav.options.narration);
        $(this).removeClass("soundOff").addClass("sound");
        jsav.logEvent({
          "type": "jsav-narration-on",
          "currentStep": jsav.currentStep(),
          "totalSteps": jsav.totalSteps()
        });
      }
    });
    return $elem;
  };

  JSAV.init(function(options) {
    var output = options.output ? $(options.output) : $(this.container).find(".jsavoutput");
    this._msg = new MessageHandler(this, output);

    var supportsSpeech = typeof window.speechSynthesis !== "undefined";
    if (supportsSpeech && options.narration && options.narration.enabled) {
      // determining language code the browser will use to choose a voice
      var langMap = this.options.narration.langMap || {};
      var lang = this.options.lang || 'en';
      options.narration.lang = langMap[lang] || lang;

      // adding sound button if there is no sound button in the container and
      // the container has both controls and settings button
      if(($(this.container).parent().find(".new").length === 0) &&
          ($(this.container).find(".jsavcontrols").length !== 0) &&
          ($(this.container).parent().find(".jsavsettings").length !== 0)) {

        $(this.container).parent().find(".jsavsettings").wrap("<span class='new'></span>");
        $(this.container).parent().find(".new").append(soundSettings(this));
      }
      //adding voice attribute to the container
      $(this.container).attr("voice", "false");
    }
  });
  $(window).unload(function() {
    var synth = window.speechSynthesis;
    synth.cancel();
  });
}(jQuery));
