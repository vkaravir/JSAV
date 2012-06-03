/**
* Module that contains the configurable settings panel implementation
* Depends on core.js, utils.js
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  var speedChoices = [5000, 3000, 1500, 1000, 500, 400, 300, 200, 100, 50];
  var speedSetting = function() {
    var curSpeed = JSAV.ext.SPEED;
    return function() {
      var rangeSupported = !!$.support.inputTypeRange;
      // add explanation if using range slider, help text otherwise
      var $elem = $('<div class="jsavrow">Animation speed' + (rangeSupported?' (slow - fast)':'') + 
          ': <input type="range" min="1" max="10" step="1" size="30"/></div> ' +
          (rangeSupported?'':'<div class="jsavhelp">Value between 1 (Slow) and 10 (Fast).') + 
          '</div>');
      // get the closest speed choice to the current speed
      var curval = speedChoices.length - 1;
      while (curval && speedChoices[curval] < curSpeed) {
        curval--;
      }
      // set the value and add a change event listener
      $elem.find("input").val(curval + 1).change(function() {
        var speed = parseInt($(this).val(), 10);
        if (isNaN(speed) || speed < 1 || speed > 10) { return; }
        speed = speedChoices[speed - 1]; // speed in milliseconds
        curSpeed = speed;
        JSAV.ext.SPEED = speed;
        //trigger speed change event to update all AVs on the page
        $(document).trigger("jsav-speed-change", speed);
      });
      // return the element
      return $elem;
    };
  };
  
  /* Creates an input component to be used in the settings panel. varname should be unique
    within the document. Options can specify the label of the component, in which case
    a label element is created. Option value specifies the default value of the element.
    Every other option will be set as an attribute of the input element. */
  var createInputComponent = function(varname, options) {
    var label,
        opts = $.extend({"type": "text"}, options),
        input = $('<input id="jsavsettings-' + varname + '" type="' +
          opts.type + '"/>');
    if ('label' in opts) {
      label = $('<label for="jsavsettings-' + varname + '">' + opts.label + "</label>");
    }
    if ('value' in opts) {
      input.val(opts.value);
    }
    for (var attr in opts) {
      if (['label', 'value', 'type'].indexOf(attr) === -1) {
        input.attr(attr, opts[attr]);
      }
    }
    return $('<div class="jsavrow"/>').append(label).append(input);
  };
  
  /* Creates a select component to be used in the settings panel. varname should be unique
    within the document. Options can specify the label of the component, in which case
    a label element is created. Option value specifies the default value of the element.
    Option options should be a map where every key-value pair will make for an option element
    in the form. Every other option will be set as an attribute of the input element. */
  var createSelectComponent = function(varname, options) {
    var label, 
        select = $('<select id="jsavsettings-' + varname + '" />');
    if ('label' in options) {
      label = $('<label for="jsavsettings-' + varname + '">' + options.label + "</label>");
    }
    for (var key in options.options) {
      select.append('<option value="' + key + '">' + options.options[key] + '</option>');
    }
    if ('value' in options) {
      select.val(options.value);
    }
    var toCheck = ['label', 'value', 'options', 'type'];
    for (var attr in options) {
      if ($.inArray(attr, toCheck) === -1) {
        input.attr(attr, options[attr]);
      }
    }
    return $('<div class="jsavrow"/>').append(label).append(select);
  };
  
  var Settings = function(elem) {
      this.components = [];
      this.add(speedSetting());
      
      var that = this;
      if (elem) {
        $(elem).click(function(e) {
          e.preventDefault();
          that.show();
        });
      }
    },
    sproto = Settings.prototype;
  sproto.show = function() {
    var $cont = $("<div class='jsavsettings'></div>"),
      that = this,
      $close = $('<button class="jsavrow">Close</button>').click(function() {
        that.close();
      });
    for (var i = 0; i < this.components.length; i++) {
      $cont.append(this.components[i]);
    }
    $cont.append($close);
    
    this.dialog = JSAV.utils.dialog($cont, {title: "Settings"});
  };
  sproto.close = function() {
    if (this.dialog) {
      this.dialog.close();
    }
  };
  sproto.add = function(create, options) {
    if ($.isFunction(create)) {
      // create is a function that returns a DOM Element or jQuery object or HTML string
      this.components.push(create);
    } else {
      // create is a name of a variable
      if (!('type' in options)) {
        return;
      }
      var elem, func;
      if (options.type === 'select') {
        func = createSelectComponent;
      } else {
        func = createInputComponent;
      }
      elem = func(create, options);
      this.components.push(elem);
      return elem.find("input, select");
    }
  };
  JSAV.utils.Settings = Settings;
  JSAV.init(function() {
    if (this.options.settings) {
      this.settings = this.options.settings;
    } else {
      this.settings = new Settings($(this.container).find(".jsavsettings").show());
    }
  });
})(jQuery);