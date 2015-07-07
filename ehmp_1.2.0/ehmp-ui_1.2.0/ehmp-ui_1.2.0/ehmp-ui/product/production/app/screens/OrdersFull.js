define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';

    function onAddOrderClicked(event){
        var channel = ADK.Messaging.getChannel('addOrderRequestChannel');
        var deferredResponse = channel.request('addOrderModal');

        deferredResponse.done(function(response) {
            var addOrderApplet = response.view;
            addOrderApplet.showModal(event);
            $('#mainModal').modal('show');
        });
    }

    var screenConfig = {
        id: 'orders-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'orders',
            title: 'Orders',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        patientRequired: true,
        globalDatepicker: false,
        onStart: function() {
            this.setUpEvents();
        },
        setUpEvents: function() {
            var addOrderChannel = ADK.Messaging.getChannel('addOrder');
            addOrderChannel.on('addOrder:clicked', onAddOrderClicked);
        },
        onStop: function() {
            this.turnOffEvents();
        },
        turnOffEvents: function() {
            var addOrderChannel = ADK.Messaging.getChannel('addOrder');
            addOrderChannel.off('addOrder:clicked');
        }
    };

    return screenConfig;
});
