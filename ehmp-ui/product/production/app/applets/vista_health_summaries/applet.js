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
        var modal = new ADK.UI.Modal({
            view: new ModalView({
                model: params.model,
                navHeader: false
            }),
            options: {
                size: "large",
                title: params.model.get('facilityMoniker') + ' - ' + params.model.get('hsReport')
            }
        });
        modal.show();
    });

    return applet;
});
