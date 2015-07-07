define([
    'backbone',
    'marionette',
    'underscore',
    "hbs!app/applets/addLabOrder/templates/addLabOrderTemplate",
    'hbs!app/applets/addLabOrder/templates/footerTemplate'
], function(Backbone, Marionette, _, addLabOrderTemplate, footerTemplate) {
    'use strict';

    var addLabOrderChannel = ADK.Messaging.getChannel('addLabOrder'),
        visitChannel = ADK.Messaging.getChannel('visit'),
        currentAppletKey,
        modalView,
        currentModel;
    var gridView;


    var FooterView = Backbone.Marionette.ItemView.extend({
        template: footerTemplate
    });

    return Backbone.Marionette.LayoutView.extend({
        className: 'add-lab-order-styles',
        template: addLabOrderTemplate,
        showModal: function(event, GridView) {
            gridView = GridView;
            var options = {
                'title': 'Lab',
                'size': 'medium',
                'footerView': FooterView
            };

            ADK.showModal(this, options);
        }
    });

});
