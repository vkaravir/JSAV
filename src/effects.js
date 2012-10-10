/**
* Module that contains interaction helpers for JSAV.
* Depends on core.js, anim.js
*/
(function($) {
  "use strict";
  var jsanim = JSAV.anim;
  var parseValueEffectParameters = function() {
    // parse the passed arguments
    // possibilities are:
    //  - array, ind, array, ind
    //  - array, ind, node
    //  - node, array, ind
    //  - node, node
    var params = {
        args1: [],
        args2: [],
        from: arguments[0] // first param is always 1st structure
    };
    if (arguments.length === 2) { // two nodes passed
      params.to = arguments[1];
    } else if (arguments.length === 4) { // case of two arrays
      params.args1 = [ arguments[1] ];
      params.to = arguments[2];
      params.args2 = [ arguments[3] ];
    } else { // one array, one node
      if (typeof arguments[1] === "object") { // second param not number or string
        params.to = arguments[1];
        params.args2 = [ arguments[2] ];
      } else { // 2nd param is an index
        params.args1 = [ arguments[1] ];
        params.to = arguments[2];
      }
    }
    return params;
  };
  var doValueEffect = function(opts) {
    // get the values of the from and to elements
    var from = opts.from, // cache the values
        to = opts.to,
        val = from.value.apply(from, opts.args1),
        oldValue = to.value.apply(to, opts.args2),
        $fromValElem, $toValElem;
    // get the HTML elements for the values, for arrays, use the index
    if (from.constructor === JSAV._types.ds.AVArray) {
      $fromValElem = from.element.find("li:eq(" + opts.args1[0] + ") .jsavvalue");
    } else {
      $fromValElem = from.element.find(".jsavvalue");
    }
    if (to.constructor === JSAV._types.ds.AVArray) {
      $toValElem = to.element.find("li:eq(" + opts.args2[0] + ") .jsavvalue");
    } else {
      $toValElem = to.element.find(".jsavvalue");
    }

    // set the value in original structure to empty string or, if undoing, the old value
    from.value.apply(from, opts.args1.concat([opts.old?opts.old:"", {record: false}]));
    // set the value of the target structure
    to.value.apply(to, opts.args2.concat([val, {record: false}]));

    if (this._shouldAnimate()) {  // only animate when playing, not when recording
      $toValElem.position({of: $fromValElem}); // let jqueryUI position it on top of the from element
      $toValElem.animate({"left": "0", top: 0}, this.speed, 'linear'); // animate to final position
    }

    // return "reversed" parameters and the old value for undoing
    return [{
      from: to,
      args1: opts.args2,
      to: from,
      args2: opts.args1,
      old: oldValue
    }];
  };

  JSAV.ext.effects = {
    /* toggles visibility of an element */
    _toggleVisible: function() {
      if (this.jsav._shouldAnimate()) { // only animate when playing, not when recording
        this.element.fadeToggle(this.jsav.SPEED);
      } else {
        this.element.toggle();
      }
      return [];
    },
    /* shows an element */
    show: function(options) {
      if (this.element.filter(":visible").size() === 0) {
        this._toggleVisible(options);
      }
      return this;
    },
    /* hides an element */
    hide: function(options) {
      if (this.element.filter(":visible").size() > 0) {
        this._toggleVisible(options);
      }
      return this;
    },
    copyValue: function() {

    },
    moveValue: function() {
      var params = parseValueEffectParameters.apply(null, arguments);

      // wrap the doTheMove function to JSAV animatable function
      JSAV.anim(doValueEffect).call(this, params);
    },
    swap: function($str1, $str2, translateY) {
      var $val1 = $str1.find("span.jsavvalue"),
          $val2 = $str2.find("span.jsavvalue"),
          posdiffX = JSAV.position($str1).left - JSAV.position($str2).left,
          posdiffY = translateY?JSAV.position($str1).top - JSAV.position($str2).top:0,
          $both = $($str1).add($str2),
          str1prevStyle = $str1.getstyles("color", "background-color"),
          str2prevStyle = $str2.getstyles("color", "background-color"),
          speed = this.SPEED/5,
          tmp;

      // ..swap the value elements...
      var val1 = $val1[0],
          val2 = $val2[0],
          aparent = val1.parentNode,
          asibling = val1.nextSibling===val2 ? val1 : val1.nextSibling;
      val2.parentNode.insertBefore(val1, val2);
      aparent.insertBefore(val2, asibling);

      // ..swap the values in the attributes..
      tmp = $str1.attr("data-value");
      $str1.attr("data-value", $str2.attr("data-value"));
      $str2.attr("data-value", tmp);
      
      // ..and finally animate..
      if (this._shouldAnimate()) {  // only animate when playing, not when recording
        if ('Raphael' in window) { // draw arrows only if Raphael is loaded
          var off1 = $val1.offset(),
              off2 = $val2.offset(),
              coff = this.canvas.offset(),
              x1 = off1.left - coff.left + $val1.outerWidth()/2,
              x2 = off2.left - coff.left + $val2.outerWidth()/2,
              y1 = off1.top - coff.top + $val1.outerHeight() + 5,
              y2 = y1,
              curve = 20,
              cx1 = x1,
              cx2 = x2,
              cy1 = y2 + curve,
              cy2 = y2 + curve,
              arrowStyle = "classic-wide-long";
          if (posdiffY > 1 || posdiffY < 1) {
            y2 = off2.top - coff.top + $val2.outerHeight() + 5;
            var angle = (y2 - y1) / (x2 - x1),
                c1 = Math.pow(y1, 2) - (curve*curve / (1 + angle*angle)),
                c2 = Math.pow(y2, 2) - (curve*curve / (1 + angle*angle));
            cy1 = y1 + Math.sqrt(y1*y1 - c1);
            cx1 = x1 - angle*Math.sqrt(y1*y1 - c1);
            cy2 = y2 + Math.sqrt(y2*y2 - c2);
            cx2 = x2 - angle*Math.sqrt(y2*y2 - c2);
          }
          // .. and draw a curved path with arrowheads
          var arr = this.getSvg().path("M" + x1 + "," + y1 + "C" + cx1 + "," + cy1 + " " + cx2 + "," + cy2 + " " + x2 + "," + y2).attr({"arrow-start": arrowStyle, "arrow-end": arrowStyle, "stroke-width": 5, "stroke":"lightGray"});
        }
        // .. then set the position so that the array appears unchanged..
        $val1.css({"transform": "translate(" + (posdiffX) + "px, " + (posdiffY) + "px)"});
        $val2.css({"transform": "translate(" + (-posdiffX) + "px, " + (-posdiffY) + "px)"});
        // .. animate the color ..
        $both.animate({"color": "red", "background-color": "pink"}, 3*speed, function() {
          // ..animate the translation to 0, so they'll be in their final positions..
          $val1.animate({"transform": "translate(0, 0)"}, 7*speed, 'linear');
          $val2.animate({"transform": "translate(0, 0)"}, 7*speed, 'linear',
            function() {
              if (arr) { arr.remove(); } // ..remove the arrows if they exist
              // ..and finally animate to the original styles.
              $str1.animate(str1prevStyle, speed);
              $str2.animate(str2prevStyle, speed);
          });
        });
      }
    }
  };
}(jQuery));