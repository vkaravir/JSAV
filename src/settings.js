/**
* Module that contains the configurable settings panel implementation
* Depends on core.js, utils
*/
(function($) {
  if (typeof JSAV === "undefined") { return; }
  var speedChoices = [5000, 3000, 1500, 1000, 500, 400, 300, 200, 100, 50];
  var speedSetting = function(jsav) {
    return function() {
      var rangeSupported = !!$.support.inputTypeRange;
      // add explanation if using range slider, help text otherwise
      var $elem = $('<div class="jsavspeed">Animation speed' + (rangeSupported?' (slow - fast)':'') + 
          ': <input type="range" min="1" max="10" step="1" size="30"/> ' +
          (rangeSupported?'':'<span class="help">Value between 1 (Slow) and 10 (Fast).</span>') + 
          '</div>');
      // get the closest speed choice to the current speed
      var curval = speedChoices.length - 1;
      while (curval && speedChoices[curval] < jsav.SPEED) {
        curval--;
      }
      // set the value and add a change event listener
      $elem.find("input").val(curval + 1).change(function() {
        var speed = parseInt($(this).val(), 10);
        if (isNaN(speed) || speed < 1 || speed > 10) { return; }
        jsav.SPEED = speedChoices[speed-1];
      });
      // return the element
      return $elem;
    };
  };
  
  var Settings = function() {
      this.components = [];
    },
    sproto = Settings.prototype;
  sproto.show = function() {
    var $cont = $("<div class='jsavsettings'></div>"),
      that = this,
      $close = $('<button>Close</button>').click(function() {
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
      this.setting = this.options.settings;
    } else {
      this.settings = new Settings();
    }
    this.settings.add(speedSetting(this));
    var s = this.settings;
    $(this.container).find(".jsavsettings").show().click(function(e) {
      e.preventDefault();
      s.show();
    });
  });
})(jQuery);