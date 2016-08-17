/**
 * Module that contains the key-value pair data structure implementation.
 * Depends on core.js, anim.js, utils.js, effects.js, datastructures.js
 */
/* global JSAV, jQuery */
(function($) {
    "use strict";

    if (typeof JSAV === "undefined") {
        return;
    }

    //Specify template for the Data Structure
    var templates = {};
    templates.pair = "<div class='jsav-pair-section'>" +
        "<div class='jsav-pair'>" +
        "<span class='jsav-pair-key'>" +
        "{{key}}" +
        "</span>" +
        "<span class='jsav-pair-values'>" +
        "{{values}}" +
        "</span>" +
        "</div>" +
        "</div>";

    //Key-Value Pair Data Structure
    var Pair = function(container, key, values, options) {
        this.jsav = container.jsav;
        this.container = container;
        this.values = values;

        //Make pair visible
        this.options = $.extend(true, {}, options, {visible: true});

        var valueHtml = values;

        //Replace HTML with actual values
        var pairHTML = container.options.template
            .replace("{{key}}", key)
            .replace("{{values}}", valueHtml);

        var keyvalues = $(pairHTML);

        if(this.options.autoResize) {
            keyvalues.addClass("jsavautoresize");
        }

        this.container.element.append(keyvalues);
    };

    /*--------------------------------------------------------------------*/

    //Data Structure Declaration
    var AVKeyValuePair = function (jsav, pair, options) {
        //Set JSAV
        this.jsav = jsav;

        //Set Options
        this.options = $.extend(true, {
            autoresize: true,
            center: true,
            layout: "pair"
        }, options);

        //Set Template
        if (!this.options.template) {
            this.options.template = templates[
            this.options.layout +
            (this.options.indexed ? "-indexed" : "")];
        }

        //Initialize
        if(!pair) {
            return;
        }

        if(!pair.key || !pair.values) {
            return;
        }

        this.initialize(pair);
    };

    JSAV.utils.extend(AVKeyValuePair, JSAV._types.ds.JSAVDataStructure);
    AVKeyValuePair._templates = templates;

    var keyValuePairPrototype = AVKeyValuePair.prototype;

    keyValuePairPrototype._newPair = function(key, values) {
        if(!key) {
            key = "";
        }

        if(!values) {
            values = "";
        }

        var pair = new Pair(this, key, values, this.options);

        return pair;
    };

    keyValuePairPrototype._setPairCss = JSAV.anim(function(cssprops, options) {
        var oldProps = $.extend(true, {}, cssprops);
        var el = this.element;

        if (typeof cssprops !== "object") {
            return [cssprops];
        } else {
            for (var i in cssprops) {
                if (cssprops.hasOwnProperty(i)) {
                    oldProps[i] = el.css(i);
                }
            }
        }

        if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
            this.jsav.effects.transition(this.element, cssprops, options);
        } else {
            this.element.css(cssprops);
        }

        return [oldProps];
    });

    keyValuePairPrototype.css = function(cssprop, options) {
        if (typeof cssprop === "string") {
            return this.element.css(cssprop);
        } else if (!$.isArray(cssprop) && typeof cssprop === "object") { // object, apply for array
            return this._setPairCss(cssprop, options);
        }
    };

    keyValuePairPrototype._initializeOptionClasses = function() {
        if (this.options.autoresize) {
            this.element.addClass("jsavautoresize");
        }

        if (this.options.center) {
            this.element.addClass("jsavcenter");
        }
    };

    keyValuePairPrototype.initialize = function(pair) {
        var el = $("<div/>");
        var key, val;

        $(this.jsav.canvas).append(el);
        this.element = el;
        this._initializeOptionClasses();

        //initialize variable to use anywhere else
        this._pairData = pair;
        this.options = jQuery.extend({visible: true}, this.options);

        //Assign attribute to element for every option.
        for (key in this.options) {
            if (this.options.hasOwnProperty(key)) {
                val = this.options[key];
                if (typeof(val) === "string" ||
                    typeof(val) === "number" ||
                    typeof(val) === "boolean") {

                    el.attr("data-" + key, val);
                }
            }
        }

        //Create new pair.
        this._newPair(pair.key, pair.values);

        JSAV.utils._helpers.handlePosition(this);
        this.layout();
        el.css("display", "none !important");
        JSAV.utils._helpers.handleVisibility(this, this.options);
    };

    keyValuePairPrototype.layout = function(options) {
        var layout = this.options.layout || "_default";
        return this.jsav.ds.layout.keyValuePair[layout](this, options);
    };

    keyValuePairPrototype.isHighlight = function() {
        return this.hasClass("jsav-pair-highlight");
    };

    keyValuePairPrototype.toggleClass = JSAV.anim(function(pairSection, className, options) {
        var $elems = "";
        if(pairSection === "pair") {
            $elems = $(this.element).find("div.jsav-pair");
        } else if (pairSection === "key") {
            $elems = $(this.element).find("span.jsav-pair-key");
        } else if (pairSection === "values") {
            $elems = $(this.element).find("span.jsav-pair-values");
        }

        if(this.jsav._shouldAnimate()) {
            this.jsav.effects._toggleClass($elems, className, options);
        } else {
            $elems.toggleClass(className);
        }

        return [pairSection, className, options];
    });

    keyValuePairPrototype.addClass = function(pairSection, className, options) {
        return this.toggleClass(pairSection, className, options);
    };

    keyValuePairPrototype.removeClass = function(pairSection, className, options) {
        return this.toggleClass(pairSection, className, options);
    };

    keyValuePairPrototype.highlight = function(options) {
        this.addClass("pair", "jsav-pair-highlight", options);
        return this;
    };

    keyValuePairPrototype.highlightKey = function(options) {
        this.addClass("key", "jsav-pair-key-highlight", options);
        return this;
    };

    keyValuePairPrototype.highlightValues = function(options) {
        this.addClass("values", "jsav-pair-values-highlight", options);
        return this;
    };

    keyValuePairPrototype.unhighlight = function(options) {
        this.removeClass("pair", "jsav-pair-highlight", options);
        return this;
    };

    keyValuePairPrototype.unhighlightKey = function(options) {
        this.removeClass("key", "jsav-pair-key-highlight", options);
        return this;
    };

    keyValuePairPrototype.unhighlightValues = function(options) {
        this.removeClass("values", "jsav-pair-values-highlight", options);
        return this;
    };

    keyValuePairPrototype.addIDContainer = function(title, id) {
        var $elems = $(this.element).find("div.jsav-pair");
        var span = document.createElement("div");
        span.className = "idContainer " + title + "Id";
        span.innerHTML = title + " ID <br/> " + id;
        $(span).insertAfter($elems);
    };

    keyValuePairPrototype.hasClass = function(className) {
        return $(this.element).find("div.jsav-pair")[0].className.indexOf(className) > 0 ? true : false;
    };

    keyValuePairPrototype.equals = function(otherPair) {
        if(this._pairData.key === otherPair._pairData.key &&
            this._pairData.values === otherPair._pairData.values) {
            return true;
        }

        return false;
    };

    var events = ["click"];

    // returns a function for the passed eventType that binds a passed
    // function to that eventType for the pair
    var eventhandler = function(eventType) {

        return function(data, handler) {
            // store reference to this, needed when executing the handler
            var self = this;

            // bind a jQuery event handler, limit to .jsav-pair
            this.element.on(eventType, ".jsav-pair", function(e) {

                // get the index of the clicked element
                var pair = self.element.find(".jsav-pair");

                // log the event
                self.jsav.logEvent({type: "jsav-pair-" + eventType, pair: pair});

                if ($.isFunction(data)) { // if no custom data..
                    // ..bind this to the pair and call handler
                    // with params pair index and the event
                    data.call(self, pair, e);
                } else if ($.isFunction(handler)) { // if custom data is passed
                    // ..bind this to the array and call handler
                    var params = $.isArray(data)?data.slice(0):[data]; // get a cloned array or data as array
                    params.unshift(pair); // add index to first parameter
                    params.push(e); // jQuery event as the last
                    handler.apply(self, params); // apply the function
                }
            });

            return this;
        };
    };

    // create the event binding functions and add to array prototype
    for (var i = events.length; i--; ) {
        keyValuePairPrototype[events[i]] = eventhandler(events[i]);
    }

    JSAV._types.ds.AVKeyValuePair = AVKeyValuePair;

    //expose data structure for the JSAV
    JSAV.ext.ds.keyValuePair = function(pair, options) {
        return new AVKeyValuePair(this, pair, options)
    }
}(jQuery));

(function($){
    "use strict";

    function keyValuePair(pair) {
        var $pair = $(pair.element.find("div"));
        var pairPosition = $pair.position();

        return {
            width: $pair.outerWidth(),
            left: pairPosition.left,
            top: pairPosition.top
        };
    };

    JSAV.ext.ds.layout.keyValuePair = {
        "_default": keyValuePair,
        "pair": keyValuePair
    };
}(jQuery));