define([
    "backbone",
    "marionette",
    'app/applets/immunizations_add_edit/views/immunizationAddView'
], function(Backbone, Marionette, AddView, EieView ) {
    'use strict';

    var dataGridConfig = {
        id: 'immunizations-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'immunizations',
            title: 'Immunizations',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        onStart: function(){
            this.setUpEvents();
        },
        setUpEvents: function(){
            var immunizationChannel = ADK.Messaging.getChannel('immunization');
            immunizationChannel.comply('addImmunization', AddView.handleShowView);
        },
        patientRequired: true,
        globalDatepicker: false
    };

    return dataGridConfig;
});
