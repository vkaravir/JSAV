/**
* Module that contains utility functions.
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  
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
  
  var dialogBase = '<div class="jsavdialog"></div>',
    $modalElem = null;
  
  u.dialog = function(html, options) {
    // options supported :
    //  - modal (default true)
    //  - width (and min/maxWidth)
    //  - height (and min/maxHeight)
    //  - closeText
    //  - buttons
    //  - dialogClass
    options = $.extend({}, options, {modal: true});
    var d = {
      },
      modal = options.modal || true,
      $dialog = $(dialogBase);
    if (typeof html === "string") {
      $dialog.html(html);
    } else if ($.isFunction(html)) {
      $dialog.html(html());
    } else {
      $dialog.append(html); // jquery or dom element
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
      $dialog.css("width", winWidth/2);
    }
    var close = function(e) {
      if (e) { // if used as an event handler, prevent default behavior
        e.preventDefault();
      }
      $modalElem.detach();
      $dialog.remove();
    };
    if (modal) {
      $modalElem = $modalElem || $('<div class="jsavmodal" />');
      $modalElem.css({width: docWidth, height: docHeight});
      $modalElem.appendTo($("body"));
      $modalElem.click(close);
    }
    $dialog.appendTo($("body"));
    $dialog.css({
        top: scrollTop + (winHeight - $dialog.outerHeight())/2,
        left: scrollLeft + (winWidth - $dialog.outerWidth())/2
    });
    $dialog.close = close;
    return $dialog;
  };
  
})(jQuery);