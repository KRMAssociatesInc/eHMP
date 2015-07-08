define([
    'backbone',
    'marionette',
    'hbs!app/applets/addOrder/templates/orderTypeTemplate',
], function(Backbone, Marionette, orderTypeTemplate) {
    'use strict';
    var OrderEntryView;

    OrderEntryView = Backbone.Marionette.ItemView.extend({
        template: orderTypeTemplate,
        initialize: function(options) {
            this.options = options;
        },
        events: {
            'click a': 'chooseAMedType'
        },
        chooseAMedType: function(e) {
            e.preventDefault();
            var val = $(e.currentTarget).attr('id');
            var txt = $(e.currentTarget).text() + ' Order';
            this.model.set('orderType', val);
            this.model.set('orderTypeText', txt);
        }

    });

    return OrderEntryView;
});
