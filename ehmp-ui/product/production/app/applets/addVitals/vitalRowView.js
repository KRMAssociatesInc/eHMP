define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addVitals/templates/vitalRowTemplate',
    'app/applets/addVitals/vitalUpperRowView',
    'app/applets/addVitals/vitalLowerRowView',
], function(Backbone, Marionette, _,  vitalRowTemplate, VitalUpperView, VitalLowerView) {
    'use strict';

    return Backbone.Marionette.LayoutView.extend({
        tagName: 'div',
        template: vitalRowTemplate,
        regions: {
            upperRegion : '#upper-container',
            lowerRegion : '#lower-container',
        },
        onRender: function() {
            var upperView = new VitalUpperView({model:this.model});
            var lowerView = new VitalLowerView({model:this.model});
            this.upperView = upperView;
            this.lowerView = lowerView;
            this.upperRegion.show(upperView);
            this.lowerRegion.show(lowerView);
        }
    });
});
