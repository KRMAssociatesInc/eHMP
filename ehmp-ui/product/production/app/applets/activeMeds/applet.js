define([
    "app/applets/activeMeds/appletLayout",
    "app/applets/activeMeds/gistView",
], function(AppletLayoutView, GistView) {

    var applet = {
        id: "activeMeds",
        viewTypes: [{
            type: 'gist',
            view: GistView,
            chromeEnabled: true
        }, {
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }],
        defaultViewType: 'summary'
    };

    return applet;
});
