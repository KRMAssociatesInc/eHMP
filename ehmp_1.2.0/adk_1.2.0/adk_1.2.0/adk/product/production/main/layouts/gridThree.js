define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridThree"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            left: "#left",
            center: "#center",
            right: "#right",
            left2: "#left2",
            center2: "#center2",
            right2: "#right2",
            left3: "#left3",
            center3: "#center3",
            right3: "#right3",
            left4: "#left4",
            center4: "#center4",
            right4: "#right4"
        },
        className: "contentPadding"
    });

    return layoutView;
});
