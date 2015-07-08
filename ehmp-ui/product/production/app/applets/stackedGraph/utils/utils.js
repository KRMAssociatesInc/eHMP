var dependencies = [
    'main/ADK',
    'backbone',
    'marionette',
    'underscore'

];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK, Backbone, Marionette, _) {
    var params = {
        patient: {
            icn: "10108V420871",
            pid: "9E7A;3"
        },
        uid: "urn:va:vital:DOD:0000000003:1000000582"
    };
    var Utils = {
        onResultChosen: function(clickedResult) {
            var self = this;
            // request detail view from whatever applet is listening for this domain
            var channel = ADK.Messaging.getChannel('vitals'),
                deferredResponse = channel.request('chartInfo', params);
            deferredResponse.done(function(response) {
                self.chartOptions = response.view;
                self.renderChartFromApplet();

            });
        }
    };

    return Utils;
}