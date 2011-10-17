/**
* Module that contains utility functions.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
  // Test if range type is supported and add to jQuery.support
  var inp = $("<input type='range' />");
  $.support.inputTypeRange = (inp.prop("type") === "range");
  delete inp;
  
  
  JSAV.utils = {};
  var u = JSAV.utils; // shortcut for easier and faster access
  
  u.getQueryParameter = function(name) {
    var params = window.location.search,
      vars = {},
      i,
      pair;
    if (params) {
      params = params.slice(1).split('&'); // get rid of ?
      for (i=params.length; i--; ) {
        pair = params[i].split('='); // split to name and value
        vars[pair[0]] = decodeURIComponent(pair[1]); // decode URI
        if (name && pair[0] === name) {
          return pair[1]; // if name requested, return the matching value
        }
      }
    }
    if (name) { return; } // name was passed but param was not found, return undefined
    return vars;
  };
  /* from raphaeljs */
  u.createUUID = function() {
      // http://www.ietf.org/rfc/rfc4122.txt
      var s = [],
          i = 0;
      for (; i < 32; i++) {
          s[i] = (~~(Math.random() * 16)).toString(16);
      }
      s[12] = 4;  // bits 12-15 of the time_hi_and_version field to 0010
      s[16] = ((s[16] & 3) | 8).toString(16);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      return "jsav-" + s.join("");
  }
  
  
  var dialogBase = '<div class="jsavdialog"></div>',
    $modalElem = null;
  
  u.dialog = function(html, options) {
    // options supported :
    //  - modal (default true)
    //  - width (and min/maxWidth)
    //  - height (and min/maxHeight)
    //  - closeText
    //  - dialogClass
    //  - title
    options = $.extend({}, {modal: true, closeOnClick: true}, options);
    var d = {
      },
      modal = options.modal,
      $dialog = $(dialogBase);
    if (typeof html === "string") {
      $dialog.html(html);
    } else if ($.isFunction(html)) {
      $dialog.html(html());
    } else {
      $dialog.append(html); // jquery or dom element
    }
    if ("title" in options) {
      $dialog.prepend("<h2>" + options.title + "</h2>");
    }
    if ("dialogClass" in options) {
      $dialog.addClass(options["dialogClass"]);
    }
    for (var attr in ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"]) {
      if (attr in options) {
        $dialog.css(attr, options[attr]);
      }
    }
    var $doc = $(document),
      $win = $(window),
      docHeight = $doc.height(),
      docWidth = $doc.width(),
      winHeight = $win.height(),
      winWidth = $win.width(),
      scrollLeft = $doc.scrollLeft(),
      scrollTop = $doc.scrollTop();
    if (!("width" in options)) {
      $dialog.css("width", Math.max(500, winWidth/2)); // min width 500px
    }
    var close = function(e) {
      if (e) { // if used as an event handler, prevent default behavior
        e.preventDefault();
      }
      if ($modalElem) {
        $modalElem.detach();
      }
      $dialog.remove();
    };
    if (modal) {
      $modalElem = $modalElem || $('<div class="jsavmodal" />');
      $modalElem.css({width: docWidth, height: docHeight});
      $modalElem.appendTo($("body"));
      if (options.closeOnClick) {
        $modalElem.click(close);
      }
    }
    if ("closeText" in options) {
      var closeButton = $('<button type="button" class="jsavrow">' + options.closeText + '</button>')
        .click(close);
      $dialog.append(closeButton);
    }
    var $dial = $dialog.appendTo($("body")).add($modalElem);
    $dialog.css({
        top: scrollTop + (winHeight - $dialog.outerHeight())/2,
        left: scrollLeft + (winWidth - $dialog.outerWidth())/2
    });
    $dial.close = close;
    return $dial;
  };
  
})(jQuery);