define([
    "backbone",
    "marionette",
    'app/applets/problems_add_edit/views/problemsAddView'
], function(Backbone, Marionette, AddView) {
    'use strict';
    var screenConfig = {
        id: 'problems-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'problems',
            title: 'Conditions',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        onStart: function(){
            this.setUpEvents();
        },
        setUpEvents: function(){
            //var problemsChannel = ADK.Messaging.getChannel('problems');
            //problemsChannel.comply('addProblem', AddView.handleShowView);
        },
        patientRequired: true,
        globalDatepicker: false
    };

    return screenConfig;
});
