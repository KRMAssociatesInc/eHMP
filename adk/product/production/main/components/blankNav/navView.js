define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/blankNav/navTemplate"
], function(Backbone, Marionette, _, navTemplate) {
    return Backbone.Marionette.ItemView.extend({
        template: navTemplate,
        className: 'col-md-12 navbar-fixed-top'
    });
});
