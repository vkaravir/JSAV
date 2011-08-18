/**
* Module that contains the configurable settings panel implementation
* Depends on core.js, utils
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
  sproto.add = function(create) {
    // create should be a function that returns a DOM Element or jQuery object or HTML string
    this.components.push(create);
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