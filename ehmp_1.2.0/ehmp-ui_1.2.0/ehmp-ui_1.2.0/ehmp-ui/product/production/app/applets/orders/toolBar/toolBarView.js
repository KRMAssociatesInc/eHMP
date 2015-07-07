define([
    'backbone',
    'marionette',
    'hbs!app/applets/orders/toolBar/ordersFilterTemplate'
], function(Backbone, Marionette, ordersFilterTemplate) {
    'use strict';
    var fetchOptions;
    var self;
    var ToolBarView = Backbone.Marionette.ItemView.extend({

        initialize: function(options) {
            this.collection = options.collection;
            this.menuItems = options.menuItems;
            this.sharedModel = options.sharedModel;
            this.service = ADK.SessionStorage.getAppletStorageModel('orders', 'activeMenuItem') || 'ALL';
        },

        template: ordersFilterTemplate,
        className: 'list-group-item row-layout',
        events: {

            'change #order-type-options': 'filterChange'

        },

        clearSearchText: function() {

            $('#grid-filter-orders').find('.clear').click();
            ADK.SessionStorage.setAppletStorageModel('orders', 'filterText', '');

        },

        setActiveType: function(menuItems, activeService) {
            ADK.SessionStorage.setAppletStorageModel('orders', 'activeMenuItem', activeService);
        },

        filterChange: function() {
            this.clearSearchText(); //changing order type resets the search text
            this.service = this.$('#order-type-options').val();
            this.setActiveType(this.menuItems, this.service);
            this.sharedModel.set('service', this.service); //this update triggers the sharedModelChanged() function in the applet.js
        },

        onRender: function() {

            // create the drop-down template HTML
            this.$el.html(this.template({
                item: this.menuItems.toJSON()
            }));

            //set the drop-down default to the active item
            this.$('#order-type-options').val(ADK.SessionStorage.getAppletStorageModel('orders', 'activeMenuItem') || 'ALL');
        }

    });

    return ToolBarView;

});
