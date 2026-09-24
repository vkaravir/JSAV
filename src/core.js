/**
* Module that contains JSAV core.
*/
/*global JSAV, jQuery, Raphael, d3 */


(function($) {
  "use strict";
  var JSAV = function() {
    create.apply(this, arguments);
  };
  JSAV.position = function(elem) {
    var $el = $(elem),
      offset = $el.position(),
      translate = null;//$el.css("transform").translate; // requires jquery.transform.light.js!!
    if (translate) {
      return {left: offset.left + translate[0], top: offset.top + translate[1]};
    } else { return offset; }
  };
  var jsavproto = JSAV.prototype;
  jsavproto.getSvg = function() {
    if (!this.svg) { // lazily create the SVG overlay only when needed
      //this.svg = Raphael(this.canvas[0]);
      const container = d3.select(this.canvas[0]);
      this.svg = container.insert('svg', ':first-child').node();

//      this.svg.renderfix();
      
      // this.svg.canvas.style("position", "absolute");
      var style = this.svg.style;
      style.overflow = "hidden";
      style.position = "absolute";
    }
    return this.svg;
  };
  jsavproto.id = function() {
    var id = this.container[0].id;
    // var id = this.container.attr("id");
    if (!id) {
      id = JSAV.utils.createUUID();
      this.container[0].id = id;
      // this.container.attr("id", id);
    }
    return id;
  };
  jsavproto.clear = function() {
    // clear the container and find the new ref to canvas
    this.container.html(this._initialHTML);
    this.canvas = this.container.find(".jsavcanvas");
  };
  JSAV._types = {}; // for exposing types of JSAV for customization
  JSAV.ext = {}; // for extensions
  JSAV.init = function(f) { // for initialization functions
    JSAV.init.functions.push(f);
  };
  JSAV.init.functions = [];

  var create = function() {
    // this will point to a newly-created JSAV instance
    if (typeof arguments[0] === "string") {
      this.container = $(document.getElementById(arguments[0]));
      // this.container = d3.select(document.getElementById(arguments[0]));
    } else if (arguments[0] instanceof HTMLElement) {
      this.container = $(arguments[0]); // make sure it is jQuery object
      // this.container = d3.select(arguments[0]);
    } else if (arguments[0] && typeof arguments[0] === "object" && arguments[0].constructor === jQuery) {
      this.container = arguments[0];
    }

    var defaultOptions = $.extend({
      autoresize: true,
      scroll: true
    }, window.JSAV_OPTIONS);
    // if the container was set based on the first argument, options are the second arg
    if (this.container) {
      this.options = $.extend(true, defaultOptions, arguments[1]);
    } else { // otherwise assume the first argument is options (if exists)
      this.options = $.extend(true, defaultOptions, arguments[0]);
      // set the element option as the container
      this.container = $(this.options.element);
      // this.container = d3.select(this.options.element);
    }

    // initialHTML will be logged as jsav-init, this._initialHTML used in clear
    var initialHTML = this.container.clone().wrap("<p/>").parent().html();
    this._initialHTML = this.container.html();

    this.container.addClass("jsavcontainer");
    this.canvas = this.container.find(".jsavcanvas");
    if (this.canvas.length === 0) {
      this.canvas = $("<div />").addClass("jsavcanvas").appendTo(this.container);
      // this.canvas = d3.create("div").classed("jsavcanvas", true).append("div");
    }
    // element used to block events when animating
    var shutter = $("<div class='jsavshutter' />").appendTo(this.container);
    // var shutter = d3.create("div").classed("jsavshutter", true).append("div");
    this._shutter = shutter;

    this.RECORD = true;
    jQuery.fx.off = true; // by default we are recording changes, not animating them
    // initialize stuff from init namespace
    initializations(this, this.options);
    // add all plugins from ext namespace
    extensions(this, this, JSAV.ext);

    this.logEvent({ type: "jsav-init", initialHTML: initialHTML });
  };
  function initializations(jsav, options) {
    var fs = JSAV.init.functions;
    for (var i = 0; i < fs.length; i++) {
      if (typeof fs[i] === "function") {
        fs[i].call(jsav, options);
      }
    }
  }
  function extensions(jsav, con, add) {
    for (var prop in add) {
      if (add.hasOwnProperty(prop) && !(prop in con)) {
        switch (typeof add[prop]) {
        case "function":
          (function (f) {
            con[prop] = con === jsav ? f : function () { return f.apply(jsav, arguments); };
          }(add[prop]));
          break;
        case "object":
          con[prop] = con[prop] || {};
          extensions(jsav, con[prop], add[prop]);
          break;
        default:
          con[prop] = add[prop];
          break;
        }
      }
    }
  }

  // register a handler for autoresizing the jsavcanvas
  JSAV.init(function() {
    // in a JSAV init function, this will be the just-created JSAV instance
    if (this.options.autoresize) {
      var that = this;
      // register event handler for jsav-updaterelative which is triggered on each step
      this.container.on("jsav-updaterelative", function() {
        // collect max top and left positions of all JSAV objects
        var maxTop = parseInt(that.canvas.css("minHeight"), 10),
            maxLeft = parseInt(that.canvas.css("minWidth"), 10);

        // go through all elements inside jsavcanvas
        that.canvas.children().each(function(index, item) {
          var $item = $(item),
              itemPos = $item.position();
          // ignore SVG, since it will be handled differently since it's sized 100%x100%
          if (item.nodeName.toLowerCase() !== "svg") {
            
            maxTop = Math.max(maxTop, itemPos.top + $item.outerHeight(true));
            maxLeft = Math.max(maxLeft, itemPos.left + $item.outerWidth(true));
          }
        });
        // var svg_elem = d3.selectAll('svg').nodes().pop();
        if (that.svg) { // handling of SVG
          // var curr = that.svg.bottom, // start from the element in the behind
          //     bbox, strokeWidth;
          var curr = d3.select(that.svg).selectAll("*").
          filter(function(d, i, nodes) { return i === nodes.length - 1; })
          .node();

          var bbox, strokeWidth, x2, y2;
          while (curr) { // iterate all SVG objects in Raphael

            // Ignore markers object
            if (curr.id.includes("arrow-style")) {
              curr = d3.select(curr.previousSibling).node();
              continue;
            }

            if (curr.tagName === "set") {
              const children = d3.select(curr).selectAll(function(){
                return this.children;
              });
              children.each(function() {
                bbox = this.getBBox();
            
                // strokeWidth = curr.attr("stroke-width");
                strokeWidth = parseInt(d3.select(this).attr("stroke-width"), 10);
                x2 = bbox.x + bbox.width;
                y2 = bbox.y + bbox.height;
                maxTop = Math.max(maxTop, y2 + strokeWidth);
                maxLeft = Math.max(maxLeft, x2 + strokeWidth);
              });
              curr = d3.select(curr.previousSibling).node();
            }
            else {
              bbox = curr.getBBox();
            
                // strokeWidth = curr.attr("stroke-width");
                strokeWidth = parseInt(d3.select(curr).attr("stroke-width"), 10);
                x2 = bbox.x + bbox.width;
                y2 = bbox.y + bbox.height;
                maxTop = Math.max(maxTop, y2 + strokeWidth);
                maxLeft = Math.max(maxLeft, x2 + strokeWidth);
                // curr = curr.next;
                
                curr = d3.select(curr.previousSibling).node();
            }

            
           

          }
        }
        // limit minWidth to parent width if scroll is set to true
        if (that.options.scroll) {
          var parentWidth = that.canvas.parent().width();
          maxLeft = Math.min(maxLeft, parentWidth);
        }
        // set minheight and minwidth on the jsavcanvas element
        that.canvas.css({"minHeight": maxTop, "minWidth": maxLeft});
      });
    }
  }); // end autoresize handler

  if (window) {
    window.JSAV = JSAV;

    // Set narration options here so that developers can access and modify the
    // default narration replacement patterns used.
    window.JSAV_OPTIONS = {
      narration: {
        enabled: false,
        // specifies replacement patterns for text that should
        // not be read by the narrator
        replacements: [
          {searchValue: /<[^>]*>/g, replaceValue: ""},
          {searchValue: /\$/g, replaceValue: ""},
          {searchValue: /\\mathbf/gi, replaceValue: ""},
          {searchValue: /\\displaystyle/gi, replaceValue: ""},
          {searchValue: /\\mbox/gi, replaceValue: ""},
          {searchValue: /n-/gi, replaceValue: "n minus"},
          {searchValue: /m-/gi, replaceValue: "m minus"},
          {searchValue: /%/gi, replaceValue: "remainder"}
        ],
        // The speechSynthesis API uses IETF language tags.
        // For languages that have regional variations, this mapping
        // specifies which variation to use for the narration voice.
        langMap: {
          "en": "en-US",
          "fr": "fr-FR"
        }
      }
    };
  }
}(jQuery));
