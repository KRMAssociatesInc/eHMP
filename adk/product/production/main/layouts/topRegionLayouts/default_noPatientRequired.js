define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/topRegionLayouts/templates/default_noPatientRequired"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        className: "navbar-fixed-top",
        regions: {
            header_region: '#header-region'
        }
    });

    return layoutView;
});
