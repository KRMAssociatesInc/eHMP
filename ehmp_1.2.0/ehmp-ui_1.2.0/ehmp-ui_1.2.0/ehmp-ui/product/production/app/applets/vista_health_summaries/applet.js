define([
    "backbone",
    "marionette",
    'underscore',
    "app/applets/lab_results_grid/appletHelpers",
    "app/applets/vista_health_summaries/gridView"
], function(Backbone, Marionette, _, AppletHelper, GridView) {

    var applet = {
        id: 'vista_health_summaries',
        viewTypes: [{
            type: 'summary',
            view: GridView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }],
        defaultViewType: 'summary'
    };

    // expose detail view through messaging
    var channel = ADK.Messaging.getChannel(applet.id);

    channel.on('detailView', function(params) {
        ADK.showModal(
            new ModalView({
                model: params.model,
                navHeader: false
            }), {
                size: "large",
                title: params.model.get('facilityMoniker') + ' - ' + params.model.get('hsReport')
            });
    });

    return applet;
});
