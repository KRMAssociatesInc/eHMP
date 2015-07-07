define([
    "app/applets/lab_panels/gistView",
], function(GistView) {

    var applet = {
        id: "lab_panels",
        viewTypes: [{
            type: 'gist',
            view: GistView,
            chromeEnabled: true
        }],
        defaultViewType: 'gist'
    };

    return applet;
});
