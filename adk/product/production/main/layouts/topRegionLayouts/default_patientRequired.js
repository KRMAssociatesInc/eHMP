define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/layouts/topRegionLayouts/templates/default_patientRequired"
], function(Backbone, Marionette, _, Template) {
    layoutView = Backbone.Marionette.LayoutView.extend({
        template: Template,
        className: "navbar-fixed-top",
        regions: {
            header_region: '#header-region',
            patientDemographic_region: '#patientDemographic-region',
            navigation_region: '#navigation-region'
        }
    });

    return layoutView;
});
