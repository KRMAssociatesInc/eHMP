define([
    "app/applets/surgery/detailController"
], function(DetailController) {

    var appletDefinition = {
        appletId: "surgery",
        resource:"patient-record-document-view"
    };

    DetailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
});
