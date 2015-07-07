define([
    "hbs!app/applets/consults/table",
    "hbs!app/applets/consults/row",
    "app/applets/consults/detailController"
], function(consultsTableTemplate, consultsRowTemplate, detailController) {

    var appletDefinition = {
        appletId: "consults",
        resource: "patient-record-consult",
        tableTemplate: consultsTableTemplate,
        rowTemplate: consultsRowTemplate
    };

    detailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
});
