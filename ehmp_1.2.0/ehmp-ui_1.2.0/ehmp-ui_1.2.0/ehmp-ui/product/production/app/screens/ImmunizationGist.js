define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';
   var DEBUG = true;
   // temporary default detail view. remove once all detail view have been implemented
    var DefaultDetailView = Backbone.Marionette.ItemView.extend({
        template: _.template('<div>A detail view for this domain is not yet implemented.</div>')
    });

    var detailAppletChannels = {
        // mapping of domain --> appletId
        "immunization": "immunizations"
    };

    var screenConfig = {
        id: 'immunization-gist',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: "ImmunizationGist",
            title: "Immunizations",
            region: "center"
            //fullScreen: true
        }],
       detailApplets: [{
            id: 'immunizations'
        }],        
        started: false,
        onStart: function() {

            if (this.started) {
                if(DEBUG) console.log("already executed onStart; skipping");
                return; // only execute this method the first time it's called
            }
            var  igv_screen_Channel = ADK.Messaging.getChannel("igv_applet");  // Immunization gist view Channel

            // gets view Detail request from Immunization Gist View
            igv_screen_Channel.on('resultClicked', function(params) {
                    if(DEBUG) console.log(params);
                    var domain = params.uid.split(":")[2],
                        channelName = detailAppletChannels[domain] || params.channelName;

                    if (channelName) {
                        // display spinner in modal while detail view is loading
                        ADK.showModal(ADK.Views.Loading.create(), {
                            size: "large",
                            title: "Loading..."
                        });
                        // request detail view from whatever applet is listening for this domain
                        var channel = ADK.Messaging.getChannel(channelName),
                            deferredResponse = channel.request('detailView', params);

                        deferredResponse.done(function(response) {
                            ADK.showModal(response.view, {
                                size: "large",
                                title: response.title
                            });
                        });
                    } else {
                        // no detail view available; use the default placeholder view
                        ADK.showModal(new DefaultDetailView(), {
                            size: "large",
                            title: "Detail - Placeholder"
                        });
                    }

            });
            this.started = true;
        },
        patientRequired: true
    };
    return screenConfig;
});
