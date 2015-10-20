define([
    'backbone', 
    'marionette', 
    'jquery', 
    'underscore', 
    'handlebars', 
    'moment',
    'app/applets/encounters/writeback/formFields',
    'app/applets/encounters/writeback/modelUtil',
    'hbs!app/applets/encounters/writeback/selectedDiagnosisBodyTemplate', 
    'hbs!app/applets/encounters/writeback/selectedProceduresTemplate'
],function(Backbone, Marionette, $, _, Handlebars, Moment, formFields, util, selectedDiagnosisBodyTemplate, selectedProceduresTemplate) {

    var DeleteMessageView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
        tagName: 'p'
    });

    var CloseMessageView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
        tagName: 'p'
    });

    var FooterView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('{{ui-button "Cancel" id="alert-cancel-btn" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" id="alert-continue-btn" classes="btn-primary" title="Click button to continue your action!"}}'),
        events: {
            'click #alert-continue-btn': function() {
                console.log("TEST Continue");
                ADK.UI.Alert.hide();
                ADK.UI.Workflow.hide();
            },
            'click #alert-cancel-btn': function() {
                console.log("TEST Cancel");
                ADK.UI.Alert.hide();
            }
        },
        tagName: 'span'
    });
  
    var formView = ADK.UI.Form.extend({
        ui: {
            'selectedPrimaryProvider': '.selectedPrimaryProvider',
            'provider': '.provider',
            'VisitChecklistCheckboxes': '.visit-checklist input',
            'InputAddOtherDiagnosis': '.add-other-diagnosis-popover #addOtherDiagnosisSearchString',
            'SearchAddOtherDiagnosis': '.add-other-diagnosis-popover #add-other-diagnosis-search-btn',
            'SelectAddOtherDiagnosis': '.add-other-diagnosis-popover #addOtherDiagnosisSelect',
            'CancelAddOtherDiagnosis': '.add-other-diagnosis-popover #add-other-diagnosis-cancel-btn',
            'AddOtherDiagnosisPopover': '.add-other-diagnosis-popover #add-other-diagnosis-add-btn',

            'InputAddOtherProcedure' : '.add-other-procedure-popover #addOtherProcedureSearchString',
            'SearchAddOtherProcedure': '.add-other-procedure-popover #add-other-procedure-search-btn',
            'SelectAddOtherProcedure': '.add-other-procedure-popover #addOtherProcedureSelect',
            'CancelAddOtherProcedure': '.add-other-procedure-popover #add-other-procedure-cancel-btn',
            'AddOtherProcedurePopover': '.add-other-procedure-popover #add-other-procedure-add-btn'
        },
        fields: formFields,
        onRender: function() {
            util.retrieveProcedureItems(this);
            util.retrieveDiagnosisItems(this);
            util.retrieveProviders(this);
            util.retrieveRatedDisabilties(this);
            util.retrieveVisitRelated(this);
            util.retrieveVisitType(this);
            var input = this.$(this.ui.InputAddOtherDiagnosis);
            input.keyup(function(e){
                if(e.keyCode === 13){
                    $('#addOtherDiagnosisSearchString').blur();
                    $('#add-other-diagnosis-search-btn').trigger('click');
                }
            });
            input = this.$(this.ui.InputAddOtherProcedure);
            input.keyup(function(e){
                if(e.keyCode === 13){
                     $('#addOtherProcedureSearchString').blur();
                    $('#add-other-procedure-search-btn').trigger('click');
                }
            });
            $(this.el).find('#available-Providers-modifiers-filter-results').attr("placeholder", "Select Provider");
        },
        events: {
            "click #ok-btn": function(e) {
                e.preventDefault();
                if (!this.model.isValid())
                    this.model.set("formStatus", {
                        status: "error",
                        message: self.model.validationError
                    });
                else {
                    this.model.unset("formStatus");
                    var saveAlertView = new ADK.UI.Notification({
                        title: 'Encounter Submitted',
                        icon: 'fa-check',
                        message: 'Encounter successfully submitted with no errors.',
                        type: "success"
                    });
                    saveAlertView.show();
                    ADK.UI.Workflow.hide();
                }
            },
            "click #cancel-btn": function(e) {
                e.preventDefault();
                var deleteAlertView = new ADK.UI.Alert({
                    title: 'Are you sure you want to cancel?',
                    icon: 'fa-warning',
                    messageView: DeleteMessageView,
                    footerView: FooterView
                });
                deleteAlertView.show();
            },
            "click @ui.CancelAddOtherDiagnosis": function(e) {
                e.preventDefault();
                this.closeAddOtherPopover("Diagnosis");
            },
            "click @ui.CancelAddOtherProcedure": function(e) {
                e.preventDefault();
                this.closeAddOtherPopover("Procedure");
            },
            "click @ui.SearchAddOtherDiagnosis": function(e) {
                e.preventDefault();
                this.searchForOther("Diagnosis");
            },
            "click @ui.SearchAddOtherProcedure": function(e) {
                e.preventDefault();
                this.searchForOther("Procedure");
            },
            "click @ui.AddOtherDiagnosisPopover": function(e) {
                e.preventDefault();
                this.addAddOtherPopover("Diagnosis");
            },
            "click @ui.AddOtherProcedurePopover": function(e) {
                e.preventDefault();
                this.addAddOtherPopover("Procedure");
            },
            "click @ui.VisitChecklistCheckboxes": function(e) {
                e.preventDefault();
                this.model.get('availableVistModifiers').add({
                    name: 'modifier',
                    label: 'A Modifier',
                    value: false
                });
            }
        },
        closeAddOtherPopover: function(context) {
            this.model.unset('addOther' + context + 'SearchString');

            this.model.unset('addOther' + context + 'Select');
            this.$(this.ui["SelectAddOther" + context]).trigger("control:picklist:set", [
                []
            ]);

            this.$(this.ui["AddOther" + context + "Popover"]).trigger('control:popover:hidden', true);
        },
        searchForOther: function(context) {
            var searchString = this.model.get("addOther" + context + "SearchString");
            if (searchString && searchString.length > 0) {
                if(context === 'Diagnosis'){
                    util.retrieveDiagnosisLexicon(this, searchString, context);
                } else {
                    util.retrieveProcedureLexicon(this, searchString, context);
                }
            }
        },
        addAddOtherPopover: function(context) {
            var itemToAddValue = this.model.get('addOther' + context + 'Select');
            var itemToAddLabel = this.$(this.ui["SelectAddOther" + context] + ' option[value="' + itemToAddValue + '"]').text() || itemToAddValue || "";
            if (context === "Procedure") {
                this.model.get(context + 'Collection').add({
                    value: "other",
                    label: "Other Diagnoses",
                    listItems: new Backbone.Collection([{
                        id: itemToAddValue,
                        label: itemToAddLabel,
                        value: true,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }])
                });
            } else {
                this.model.get(context + 'Collection').add({
                    value: "other",
                    label: "Other Diagnoses",
                    listItems: new Backbone.Collection([{
                        id: itemToAddValue,
                        label: itemToAddLabel,
                        value: true,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }])
                });
            }

            this.closeAddOtherPopover(context);
        },
    });
    return formView;
});