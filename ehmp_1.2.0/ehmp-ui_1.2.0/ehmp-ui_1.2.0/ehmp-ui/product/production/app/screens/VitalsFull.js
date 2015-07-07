define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';

    // Channel constants
    var ADD_VITALS_REQUEST_CHANNEL = 'addVitalsRequestChannel',
        ADD_VITALS_MODAL = 'addVitalsModal',
        VISIT = 'visit',
        ADD_VITALS = 'addVitals',
        VITALS_OBSERVATION_LIST = 'vitalsObservationList',
        VITALS_OBSERVATION_LIST_VIEW = 'vitalsObservationListView',
        VITALSEIE = 'vitalsEiE',
        VITALSEIEVIEW = 'vitalsEiEView',
        ENFORCE_VISIT_SELECTION = 'enforceVisitSelection',
        defaultCallback = function(event, options) {
            return function(response) {
                response.view.showModal(event, options);
            };
        },
        defaultChannelConfig = function(command, callback) {
            return {
                'channel': ADD_VITALS_REQUEST_CHANNEL, //all commands will go through this channel
                'command': command, //the command is specific to the applet action we wish to initiate
                'callback': callback //this is what we want to do when the visit operation has finished
            };
        };

    function issueVisitRequest(appletKey, options) {
        ADK.Messaging.getChannel(VISIT)
            .command(ENFORCE_VISIT_SELECTION, appletKey, options);
    }

    /**
     * Shows a 'loading-text' in place of the normal button text with a loading gif
     * @param  {jQuery.Event} e - jquery event
     * @return {undefined}
     */
    function showLoadingTextOnButton(e) {
        var $element = $(e.currentTarget);
        var loadingText = $element.data('loading-text');
        $element.prop('disabled', true);
        $element.prop('aria-atomic', true);
        $element.html(loadingText);
    }

    /*
     ** @Addvitals Check if a visit exit. If not proceed to select visit applet
     */
    function onAddVitalsClicked(event) {
        var options = defaultChannelConfig(ADD_VITALS_MODAL, defaultCallback(event));
        issueVisitRequest(ADD_VITALS, options);
    }


    /**
     * Click event function for showing the Vitals Entered in Error modal
     * @param  {jQuery.Event} event - the jquery event through backbone
     * @param  {Object} options     - an object containing other objects
     * @return {undefined}
     */
    function onVitalsEiEClicked(event, options) {
        //showLoadingTextOnButton(event);
        var channel = ADK.Messaging.getChannel(VITALSEIE);
        var deferredResponse = channel.request(VITALSEIEVIEW);

        deferredResponse.done(function(response) {
            var vitalsEiEApplet = response.view;
            vitalsEiEApplet.showModal(event, options);
            //$('#mainModal').modal('show');
        });
    }

    /**
     * Click event function for showing teh Vitals Observation List modal
     * @param  {jQuery.Event} event - the jquery event through backbone
     * @param  {Object} options     - an object containing other objects
     * @return {undefined}
     */
    function onVitalsChangeObservationClicked(event) {
        //showLoadingTextOnButton(event);
        var channel = ADK.Messaging.getChannel(VITALS_OBSERVATION_LIST);
        var deferredResponse = channel.request(VITALS_OBSERVATION_LIST_VIEW);

        deferredResponse.done(function(response) {
            var vitalsChangeObservationApplet = response.view;
            var options = {};
            options.collection = response.collection;
            vitalsChangeObservationApplet.showModal(event, options);
            //$('#mainModal').modal('show');
        });
    }

    var screenConfig = {
        id: 'vitals-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'vitals',
            title: 'Vitals',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        globalDatepicker: false,
        onStart: function() {
            this.setUpEvents();
        },
        setUpEvents: function() {
            var addVitalsChannel = ADK.Messaging.getChannel(ADD_VITALS);
            addVitalsChannel.reset();
            addVitalsChannel.on('addVitals:clicked', onAddVitalsClicked);

            var vitalsEnteredInErrorChannel = ADK.Messaging.getChannel(VITALSEIE);
            vitalsEnteredInErrorChannel.on('vitalsEiE:clicked', onVitalsEiEClicked);

            var vitalsChangeObservationChannel = ADK.Messaging.getChannel(VITALS_OBSERVATION_LIST);
            vitalsChangeObservationChannel.on('vitalsObservationList:clicked', onVitalsChangeObservationClicked);
        },
        patientRequired: true
    };

    return screenConfig;
});
