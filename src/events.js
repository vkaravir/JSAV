/*global JSAV, jQuery */
(function($) {
  "use strict";
  // events to register as functions on tree
  var events = ["click", "dblclick", "mousedown", "mousemove", "mouseup",
                "mouseenter", "mouseleave"];
  // returns a function for the passed eventType that binds a passed
  // function to that eventType nodes/edges in the tree
  var eventhandler = function(eventType) {
    return function(data, handler, options) {
      // default options; not enabled for edges by default
      var defaultopts = {edge: false},
          jsav = this.jsav,
          opts = defaultopts; // by default, go with default options
      if (typeof options === "object") { // 3 arguments, last one is options
        opts = $.extend(defaultopts, options);
      } else if (typeof handler === "object") { // 2 arguments, 2nd is options
        opts = $.extend(defaultopts, handler);
      }
      if (!opts.edge || opts.node) {
        // bind an event handler for nodes in this tree
        this.element.on(eventType, ".jsavnode", function(e) {
          var node = $(this).data("node"); // get the JSAV node object
          jsav.logEvent({type: "jsav-node-" + eventType, nodeid: node.id(), nodevalue: node.value() });
          if ($.isFunction(data)) { // if no data -> 1st arg is the handler function
            // bind this to the node and call handler
            // with the event as parameter
            data.call(node, e);
          } else if ($.isFunction(handler)) { // data provided, 2nd arg is the handler function
            var params = $.isArray(data)?data.slice(0):[data]; // get a cloned array or data as array
            params.push(e); // jQuery event as the last parameter
            handler.apply(node, params); // apply the given handler function
          }
        });
      }
      if (opts.edge) { // if supposed to attach the handler to edges
        // find the SVG elements matching this tree's container
        this.jsav.canvas.on(eventType, '.jsavedge[data-container="' + this.id() + '"]', function(e) {
          var edge = $(this).data("edge"); // get the JSAV edge object
          jsav.logEvent({type: "jsav-edge-" + eventType, startvalue: edge.start().value(),
                        endvalue: edge.end().value(), startid: edge.start().id(), endid: edge.end().id() });
          if ($.isFunction(data)) { // no data
            // bind this to the edge and call handler
            // with the event as parameter
            data.call(edge, e);
          } else if ($.isFunction(handler)) { // data provided
            var params = $.isArray(data)?data.slice(0):[data]; // get a cloned array or data as array
            params.push(e); // jQuery event as the last parameter
            handler.apply(edge, params); // apply the function
          }
        });
      }
      return this; // enable chaining of calls
    };
  };
  var on = function(eventName, data, handler, options) {
    eventhandler(eventName).call(this, data, handler, options);
    return this;
  };
  
  JSAV.utils._events = {
    _addEventSupport: function(proto) {
      // create the event binding functions and add to the given prototype
      for (var i = events.length; i--; ) {
        proto[events[i]] = eventhandler(events[i]);
      }
      proto.on = on;
    }
  };
}(jQuery));