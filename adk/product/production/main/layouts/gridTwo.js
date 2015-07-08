define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridTwo"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            left: "#left",
            right: "#right",
            left2: "#left2",
            right2: "#right2",
            left3: "#left3",
            right3: "#right3",
            left4: "#left4",
            right4: "#right4",
            left5: "#left5",
            right5: "#right5"
        },
        className: "contentPadding"
    });

    return layoutView;
});
