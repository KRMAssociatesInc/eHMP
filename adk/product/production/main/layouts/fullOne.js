define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/templates/gridOne"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            center: "#center"
        }
    });

    return layoutView;
});
