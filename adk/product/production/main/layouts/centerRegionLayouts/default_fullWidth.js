define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/centerRegionLayouts/templates/fullWidth"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        regions: {
            content_region: '#content-region'
        }
    });

    return layoutView;
});
