define([
    'app/applets/stackedGraph/list/stackedGraphView',
    'app/applets/stackedGraph/list/pickListView'
], function(StackedGraphView, PickListView) {

    var stackedGraphChannel = ADK.Messaging.getChannel('stackedGraph');
    var chromeEnabled = ADK.ADKApp.currentScreen.config.predefined === true ? false : true;

    var applet = {
        id: 'stackedGraph',
        getRootView: function(viewTypeOption) {
            return ADK.Views.AppletControllerView.extend({
                viewType: viewTypeOption
            });
        },
        viewTypes: [{
            type: 'expanded',
            view: StackedGraphView,
            chromeEnabled: chromeEnabled,
            chromeOptions: {
                additionalButtons: [{
                    'id': 'drop3',
                    'view': PickListView
                }]
            }
        }],

        defaultView: StackedGraphView
    };



    return applet;
});
