define([
    "backgrid"

], function(Backgrid) {

    var TabIndexCell = Backgrid.Cell.extend({
        attributes: {
            tabindex: "0"
        }
    });


    return TabIndexCell;
});
