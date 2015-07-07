define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';

    function onAddAllergyClicked(event, gridView) {
        var channel = ADK.Messaging.getChannel('addAllergyRequestChannel'),
            deferredResponse = channel.request('addAllergyModal');

        deferredResponse.done(function(response) {
            var addAllergyApplet = response.view;
            addAllergyApplet.showModal(event, gridView);
        });
    }

    function onAllergyEiEClicked(event, model, gridView) {
        var channel = ADK.Messaging.getChannel('allergyEiERequestChannel'),
            deferredResponse = channel.request('allergyEiEModal');

        deferredResponse.done(function(response) {
            var allergyEiEApplet = response.view;

            //var options = model.attributes;
            //options.gridView = gridView;

            var options = {
                'allergen': model.get('summary'),
                'uid': model.get('uid'),
                'gridView': gridView
            };

            allergyEiEApplet.showModal(event, options);
            $('#mainModal').modal('show');
        });
    }

    var dataGridConfig = {
        id: 'allergy-grid-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'allergy_grid',
            title: 'Allergies',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        globalDatepicker: false,
        onStart: function() {
            this.setUpEvents();
        },
        setUpEvents: function() {
            var addAllergyChannel = ADK.Messaging.getChannel("addAllergy");
            addAllergyChannel.on('addAllergy:clicked', onAddAllergyClicked);

            var allergyEnteredInErrorChannel = ADK.Messaging.getChannel('allergyEiE');
            allergyEnteredInErrorChannel.on('allergyEiE:clicked', onAllergyEiEClicked);
        },
        patientRequired: true
    };

    return dataGridConfig;
});
