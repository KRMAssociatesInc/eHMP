define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridNine"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            topLeft: "#topLeft",
            topCenter: "#topCenter",
            topRight: "#topRight",
            middleLeft: "#middleLeft",
            middleCenter: "#middleCenter",
            middleRight: "#middleRight",
            bottomLeft: "#bottomLeft",
            bottomCenter: "#bottomCenter",
            bottomRight: "#bottomRight"
        },
        className: "contentPadding"
    });

    return layoutView;
});
