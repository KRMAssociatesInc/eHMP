define([
    "app/applets/medication_review_v2/views/appletView",
    "app/applets/medication_review_v2/detailController/detailController"
], function(AppletView, DetailController) {

    var applet = {
        id: "medication_review_v2",
        hasCSS: true,
        viewTypes: [{
            type: 'expanded',
            view: AppletView,
            chromeEnabled: true
        }],
        defaultViewType: 'expanded'
    };
    DetailController.initialize(applet.id);
    return applet;
});