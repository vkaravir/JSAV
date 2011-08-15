/**
* Module that contains the configurable settings panel implementation
* Depends on core.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  var Settings = function() {
      this.components = [];
    },
    sproto = Settings.prototype;
  sproto.show = function() {
    // behavior:
    // 1. create the HTML for settings panel
    // 2. position the HTML panel correctly
    // 3. create the shutter for modal panel
    // 4. add the components to the HTML
    // 5. register listeners for the components
    // 6. register listener for closing the panel
    // 7. show the panel using JSAV.utils.dialog()
    var $cont = $("<div></div>");
    for (var i = 0; i < this.components.length; i++) {
      $cont.append(this.components[i]);
    }
    JSAV.utils.dialog($cont);
  };
  sproto.close = function() {
    // 0. apply changed values
    // 1. unregister listeners
    // 2. remove the HTML elements
    // 3. delete the variables
  };
  sproto.add = function(create) {
    // parameters needed:
    //   label, shown next to the component
    //   attrs/type/create (object of attributes for input element, or a simple string for type, or function that generates the HTML and registers listeners for it)
    //   apply, function that will do the necessary changes to apply a changed setting
    this.components.push(create);
  };
  
  JSAV.init(function() {
    this.settings = new Settings();
  });
})(jQuery);