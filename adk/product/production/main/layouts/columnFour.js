define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/columnFour"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            one: "#one",
            two: "#two",
            three: "#three",
            four: "#four"
        },
        className: "contentPadding"
    });

    return layoutView;
});
