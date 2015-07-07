define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/patient/patientSidebarInfoTemplate"
], function(Backbone, Marionette, _, PatientSidebarInfoTemplate) {

    var PatientHeaderView = Backbone.Marionette.ItemView.extend({
        template: PatientSidebarInfoTemplate,
        modelEvents: {
            "change": "render"
        },
        className: "patientDemographicsSideBar patientInfo"
    });

    return PatientHeaderView;
});
