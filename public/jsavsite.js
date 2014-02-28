// add link to show example code to jsavexamples
$(function() {
  // get all jsavexamples
  var examples = $(".jsavexample");
  examples.each(function(index, item) {
    // find script and style elements (max one each) immediately after the example
    var script = $("#" + item.id + " + script, #" + item.id + " + style + script");
    var style = $("#" + item.id + " + style, #" + item.id + " + script + style");

    if (script.size() ||style.size()) { // if there is code
      // create the link
      var $link = $("<div class='example-link'><a href='#'><span class='action'>Show</span> Example Code</a></div>");
      $(item).after($link);
      $link = $link.find("a");
      // attach click handler
      $link.click(function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        // toggle class visible to show/hide the example codes
        script.toggleClass("visible");
        style.toggleClass("visible");
        // change the Show/Hide label to match the current state
        var $action = $link.find(".action");
        $action.text((script.hasClass("visible") || style.hasClass("visible"))?"Hide":"Show");
      });
    }
  });
});
