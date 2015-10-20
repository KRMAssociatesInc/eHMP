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

    var UpdateOrderModel = Backbone.Model.extend({
        sync: function(method, model, options) {

            var params = {
                type: 'PUT',
                url: model.url(),
                contentType: "application/json",
                data: JSON.stringify(model.toJSON()),
                dataType: "json"
            };

            $.ajax(_.extend(params, options));

        },
        url: function() {
            //var pid = ADK.PatientRecordService.getCurrentPatient().get('pid');
            return ADK.ResourceService.buildUrl('user-defined-stack'/*, {'pid' : pid}*/);
        }
    });

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
        },
        buildUpdateModel: function(id, instanceId, collection){
            var model = new UpdateOrderModel();
            model.set('id', id);
            model.set('instanceId', instanceId);

            var graphs = [];
            _.each(collection.models, function(graph){
                graphs.push({ graphType: graph.get('graphType'), typeName: graph.get('typeName')});
            });

            model.set('graphs', graphs.reverse());
            return model;
        }
    };

    return Utils;
}