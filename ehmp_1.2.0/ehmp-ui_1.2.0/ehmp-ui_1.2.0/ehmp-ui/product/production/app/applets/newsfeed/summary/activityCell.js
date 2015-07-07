define([
    "app/applets/newsfeed/summary/tabbedCell",
    "app/applets/newsfeed/newsfeedUtils",
    "hbs!app/applets/newsfeed/summary/visit_templates/stopCodeVisitTemplate",
    "hbs!app/applets/newsfeed/summary/visit_templates/emergencyDeptVisitTemplate",
    "hbs!app/applets/newsfeed/summary/visit_templates/defaultVisitTemplate",
    "hbs!app/applets/newsfeed/summary/visit_templates/admittedPatientTemplate",
    "hbs!app/applets/newsfeed/summary/visit_templates/dischargedPatientTemplate",
    "hbs!app/applets/newsfeed/summary/immunization_templates/immunizationTemplate",
    "hbs!app/applets/newsfeed/summary/surgery_templates/surgeryTemplate",
    "hbs!app/applets/newsfeed/summary/consult_templates/consultTemplate",
    "hbs!app/applets/newsfeed/summary/procedure_templates/procedureTemplate",
    "hbs!app/applets/newsfeed/summary/laboratory_templates/laboratoryTemplate"
], function(TabIndexCell, newsfeedUtils, stopCodeVisitTemplate,
                               emergencyDeptTemplate, defaultVisitTemplate, admittedPatientTemplate,
                               dischargedPatientTemplate, immunizationTemplate, surgeryTemplate, consultTemplate,
                               procedureTemplate, laboratoryTemplate) {


    var templateSelector = function(model) {
        var json = model.toJSON();
        var templateName = newsfeedUtils.templateSelector(json);

        switch(templateName) {
            case "emergencyDeptTemplate" :
                return emergencyDeptTemplate(json);
            case "dischargedPatientTemplate" :
                return dischargedPatientTemplate(json);
            case "admittedPatientTemplate" :
                return admittedPatientTemplate(json);
            case "stopCodeVisitTemplate" :
                return stopCodeVisitTemplate(json);
            case "defaultVisitTemplate" :
                return defaultVisitTemplate(json);
            case "immunizationTemplate" :
                return immunizationTemplate(json);
            case "surgeryTemplate" :
                return surgeryTemplate(json);
            case "procedureTemplate" :
                return procedureTemplate(json);
            case "consultTemplate" :
                return consultTemplate(json);
            case "laboratoryTemplate" :
                return laboratoryTemplate(json);
        }
    };

    var ActivityCell = TabIndexCell.extend({
        render: function() {
            // todo: uncomment these lines for 508, it was reverted to fix the build
            //var templateResult = templateSelector(this.model);
            //screenReaderCell.setHtmlWithScreenReader(this, templateResult);
            this.$el.html(templateSelector(this.model));
            return this;
        }
    });




    return ActivityCell;
});
