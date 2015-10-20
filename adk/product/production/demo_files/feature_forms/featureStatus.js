define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {

    return [{
        featureNumber: 226,
        title: "Enter and Review Fee Text Progress Notes",
        wireframe: "http://wakirc.axshare.com/#p=v6_-_free_text_progress_notes_-_tray",
        workflowPath: "http://10.1.1.150/ui-components/docs/workflow/psi8/workflow-notes.pdf",
        workflowSize: "1.2MB",
        useCaseScenarioPath: "http://10.1.1.150/ui-components/docs/use-case/psi8/f226-use-case-enter-plain-text-progress-notes.pdf",
        useCaseScenarioSize: "86KB",
        controls: ['timepicker','select_filtering','textarea','button','datepicker'],
        components: ['workflow','alert','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: true
        }
    }, {
        featureNumber: 413,
        title: "Encounters Workflow",
        wireframe: "http://wakirc.axshare.com/#p=v3_-_encounter_workflow__single_form_",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['multiselectSideBySide','popover','checklist','select_filtering','yesNoChecklist','nestedCommentBox', 'button', 'checkbox', 'select_showMultiple', 'input', 'fieldset', 'container_showingModelData'],
        components: ['workflow','modal'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: true
        }
    }, {
        featureNumber: 423,
        title: "Enter & Store a Vital Tray",
        wireframe: "http://wakirc.axshare.com/#p=v1__enter___store_a_vital__old_",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['datepicker','timepicker','typeahead','collapsableContainer','select', 'button', 'radio', 'input_showUnit','input_chooseUnitRadio', 'fieldset', 'container_showingModelData'],
        components: ['workflow','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: true
        }
    }, {
        featureNumber: 432,
        title: "Enter & Store a Simple Lab Order Tray",
        wireframe: "http://wakirc.axshare.com/#p=v1__enter___store_a_simple_lab_order__old_",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['datepicker','timepicker','typeahead', 'select', 'button', 'radio', 'textarea', 'input', 'alertBanner', 'fieldset', 'container_showingModelData'],
        components: ['workflow','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: true
        }
    }, {
        featureNumber: 513,
        title: "Visit Management",
        wireframe: "http://wakirc.axshare.com/#p=v1_-_visit_management",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['datepicker','timepicker','typeahead','tableSelectableRows','tabs', 'button', 'checkbox', 'fieldset', 'container_showingModelData'],
        components: ['workflow','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: true
        }
    }, {
        featureNumber: 360,
        title: "Enter and Store Immunizations",
        wireframe: "http://wakirc.axshare.com/#p=v4_1_-_enter_and_store_immunizations",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['radio','select_filtering','select','button','datepicker','typeahead','input','container_showingModelData','select_selectMultiple','input_chooseUnitDropdown'],
        components: ['workflow','workflow_showProgressbar','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 414,
        title: "Record and Review Problem List",
        wireframe: "http://wakirc.axshare.com/#p=v4_-_record_and_review_problem_list",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['checkbox','input_showCharacterCount','alertBanner','radio','yesNoChecklist','commentBox','select','button','datepicker','select_dynamicFetching','input','container_showingModelData'],
        components: ['workflow','workflow_showProgressbar','growlNotifications'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 420,
        title: "Enter and Store Allergies",
        wireframe: "http://wakirc.axshare.com/#p=v3_-_enter_and_store_allergies",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['radio','timepicker','select_filtering','multiselectSideBySide','button','textarea','datepicker','select'],
        components: ['workflow','growlNotifications','alert'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 433,
        title: "Enter and Store Pharmacy (Medication) Orders",
        wireframe: "http://wakirc.axshare.com/#p=v3_-_enter_and_store_pharmacy__medication__orders",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['radio','checkbox','select','textarea','typeahead','select_filtering','button','dropdown','container_showingModelData','alertBanner','input'],
        components: ['workflow','workflow_showProgressbar','alert','growlNotifications'],
        notes: "Alert Needs to support multiple alerts shown at once.",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 568,
        title: "eSignature Modal",
        wireframe: "http://wakirc.axshare.com/#p=v2_-_esignature_modal",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['input','checklist','toggleOptionsChecklist','button','container_showingModelData'],
        components: ['workflow','alert'],
        notes: "This is only a temporary example",
        exampleForm: true,
        handOff: {
            trifecta: true,
            dev: false
        }
    }, {
        featureNumber: 412,
        title: "",
        wireframe: "",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: [],
        components: ['tray','alert'],
        notes: "",
        exampleForm: true,
        handOff: {
            trifecta: false,
            dev: false
        }
    }, {
        featureNumber: 431,
        title: "",
        wireframe: "",
        workflowPath: "",
        workflowSize: "",
        useCaseScenarioPath: "",
        useCaseScenarioSize: "",
        controls: ['textarea','checkbox','select','timepicker','datepicker','textarea','select_filtering','button','commentBox','container_showingModelData','alertBanner','select_selectMultiple'],
        components: ['workflow'],
        notes: "",
        exampleForm: false,
        handOff: {
            trifecta: false,
            dev: false
        }
    }];
});
