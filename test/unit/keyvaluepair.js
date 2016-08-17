/*global ok,test,module,deepEqual,equal,expect,notEqual,arrayUtils */
(function() {
    "use strict";
    module("datastructures.keyvaluepair", {  });
    test("Key-Value Pair", function() {
        var av = new JSAV("emptycontainer");
        ok( av, "JSAV initialized" );
        ok( JSAV._types.ds.AVKeyValuePair, "KeyValue pair exists" );
        var keyvaluepair = av.ds.keyValuePair({key: "hello", values: "1, 1"});
        ok(keyvaluepair);
    });

    test("Highlighting Key-Value Pair", function() {
        var av = new JSAV("emptycontainer"),
            keyvaluepair = av.ds.keyValuePair({key: "hello", values: "1, 1"});
        keyvaluepair.highlight();
        av.step();
        keyvaluepair.unhighlight();
        av.step();
        keyvaluepair.highlightKey();
        av.step();
        keyvaluepair.unhighlightKey();
        av.step();
        keyvaluepair.highlightValues();
        av.step();
        keyvaluepair.unhighlightValues();
        av.step();
        av.recorded();
        $.fx.off = true;

        equal(keyvaluepair.isHighlight(), false);

        av.forward();

        equal(keyvaluepair.isHighlight(), true);

        av.forward();

        equal(keyvaluepair.isHighlight(), false);

        av.forward();

        equal(document.getElementsByClassName("jsav-pair-key-highlight").length, 1);

        av.forward();

        equal(document.getElementsByClassName("jsav-pair-key-highlight").length, 0);

        av.forward();

        equal(document.getElementsByClassName("jsav-pair-values-highlight").length, 1);

        av.forward();

        equal(document.getElementsByClassName("jsav-pair-values-highlight").length, 0);
    });

    test("ID Container for Key-Value Pair", function() {
        var av = new JSAV("emptycontainer"),
            keyvaluepair = av.ds.keyValuePair({key: "hello", values: "1, 1"});

        keyvaluepair.addIDContainer("Test", 1);
        av.step();
        av.recorded();

        equal(document.getElementsByClassName("TestId").length, 1);
    });

    test("Pair Equality for Key-Value Pair", function() {
        var av = new JSAV("emptycontainer"),
            keyvaluepair1 = av.ds.keyValuePair({key: "hello", values: "1, 1"}),
            keyvaluepair2 = av.ds.keyValuePair({key: "hello", values: "1, 1"});

        var isEqual = keyvaluepair1.equals(keyvaluepair2);
        av.step();
        av.recorded();

        equal(isEqual, true);
    });
})();