define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/columnTwo"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            leftOne: "#leftOne",
            leftTwo: "#leftTwo",
            leftThree: "#leftThree",
            leftFour: "#leftFour",
            leftFive: "#leftFive",
            leftSix: "#leftSix",
            rightOne: "#rightOne",
            rightTwo: "#rightTwo",
            rightThree: "#rightThree",
            rightFour: "#rightFour",
            rightFive: "#rightFive",
            rightSix: "#rightSix",
        },
        className: "contentPadding"
    });

    return layoutView;
});
