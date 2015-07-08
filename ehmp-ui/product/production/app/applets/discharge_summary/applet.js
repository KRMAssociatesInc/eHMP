define([
    "app/applets/discharge_summary/detailController"
], function(DetailController) {

    var appletDefinition = {
        appletId: "discharge_summary",
        resource:"patient-record-document"
    };

    DetailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
});
