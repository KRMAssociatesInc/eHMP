define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // https://10.1.1.150/documentation/#/adk/conventions#Writeback
    //
    // Additional Form Documentation:
    //  - List of Controls and Options: https://10.1.1.150/documentation/#/adk/form-controls
    //  - UI Library Components : https://10.1.1.150/documentation/#/adk/ui-library#Components
    //=============================================================================================================

    var F513 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            // *********************************************** STATIC PICKLISTS *****************************************
            // NOTE: PICKLIST IS ONLY FOR THIS DEMO EXAMPLE
            var pickListArray = [{
                pickList: [{
                    value: 'opt1',
                    label: 'Option 1'
                }, {
                    value: 'opt2',
                    label: 'Option 2'
                }, {
                    value: 'opt3',
                    label: 'Option 3'
                }, {
                    value: 'opt4',
                    label: 'Option 4'
                }, {
                    value: 'opt5',
                    label: 'Option 5'
                }, {
                    value: 'opt6',
                    label: 'Option 6'
                }, {
                    value: 'opt7',
                    label: 'Option 7'
                }, {
                    value: 'opt8',
                    label: 'Option 8'
                }, {
                    value: 'opt9',
                    label: 'Option 9'
                }]
            }];
            // *********************************************** END OF STATIC PICKLISTS **********************************

            // *********************************************** CONTAINERS ***********************************************
            // Okay to copy and paste this !!!!!!!!! BUT ENSURE TO REPLACE STATIC OPTIONS/DATA WITH REAL DATA !!!!!!!
            var selectEncounterProviderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "container",
                        tagName: "h5",
                        extraClasses: ["encounters-sub-heading"],
                        template: "Select Encounter Provider"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "select",
                        label: "Search for Provider",
                        srOnlyLabel: false,
                        name: "selectEncounterProvider",
                        pickList: pickListArray,
                        showFilter: true,
                        groupEnabled: true
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "container",
                        extraClasses: ["well", "read-only-well"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            template: '<h6>Encounter Provider<br><span id="encounters-provider">{{encounterProvider}}</span></h6>'
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            template: '<h6>Encounter Location<br><span id="encounters-location">{{encounterLocation}}</span></h6>',
                            items: [{
                                control: "button",
                                id: "viewEncouters-btn",
                                type: "button",
                                label: "View Encounters",
                                extraClasses: ["btn", "btn-primary", "btn-xs"],
                                name: "viewEncouters-btn"
                            }]
                        }]
                    }]
                }]
            };
            var clinicalAppointmentsTab = {
                title: "Clinic Appointments",
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-12"],
                        template: '<h6>Clinic Appointments / Visits</h6>'
                    }]
                }, {
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "datepicker",
                        extraClasses: ["col-md-6"],
                        name: "clinicAppointmentsFromDate",
                        label: "From",
                        srOnlyLabel: false
                    }, {
                        control: "datepicker",
                        extraClasses: ["col-md-6"],
                        name: "clinicAppointmentsThroughDate",
                        label: "Through",
                        srOnlyLabel: false
                    }]
                }, {
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "selectableTable",
                        name: "selectTableModel",
                        id: "selectableTableExample",
                        collection: new Backbone.Collection([{
                            date: "05/09/2015 - 12:00",
                            details: "Was prescribed some pain meds",
                            location: "Primary Care"
                        }, {
                            date: "05/09/2014 - 2:00",
                            details: "Was given a cast for broken foot",
                            location: "General Medicine"
                        }, {
                            date: "05/09/2013 - 1:00",
                            details: "Hurt neck in plane crash",
                            location: "Therapy"
                        }, {
                            date: "05/09/2012 - 2:30",
                            details: "Swallowed a fork, need internal stitches",
                            location: "ENT Surgery"
                        }]),
                        columns: [{
                            title: "Date",
                            id: "date"
                        }, {
                            title: "Details",
                            id: "details"
                        }, {
                            title: "Location",
                            id: "location"
                        }],
                        extraClasses: ["special-class"]
                    }]
                }]
            };
            var hospitalAdmissionsTab = {
                title: "Hospital Admissions",
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-12"],
                        template: '<h6>Hospital Admissions</h6>'
                    }]
                }, {
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["faux-table-container"],
                        items: [{
                            control: "selectableTable",
                            name: "selectTableModel",
                            id: "selectableTableExample",
                            collection: new Backbone.Collection([{
                                date: "05/09/2015 - 12:00",
                                details: "Was prescribed some pain meds",
                                location: "Primary Care"
                            }, {
                                date: "05/09/2014 - 2:00",
                                details: "Was given a cast for broken foot",
                                location: "General Medicine"
                            }, {
                                date: "05/09/2013 - 1:00",
                                details: "Hurt neck in plane crash",
                                location: "Therapy"
                            }, {
                                date: "05/09/2012 - 2:30",
                                details: "Swallowed a fork, need internal stitches",
                                location: "ENT Surgery"
                            }]),
                            columns: [{
                                title: "Date",
                                id: "date"
                            }, {
                                title: "Details",
                                id: "details"
                            }, {
                                title: "Location",
                                id: "location"
                            }],
                            extraClasses: ["special-class"]
                        }]
                    }]
                }]
            };
            var newVisitTab = {
                title: "New Visit",
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-12"],
                        template: '<h6>New Visit</h6>'
                    }]
                }, {
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-6"],
                        items: [{
                            control: "select",
                            label: "New Encounter Location",
                            srOnlyLabel: false,
                            name: "new-encounter-location",
                            pickList: pickListArray,
                            showFilter: true,
                            groupEnabled: true
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-md-6"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "datepicker",
                                name: "newVisitDate",
                                srOnlyLabel: false,
                                label: "From"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "timepicker",
                                placeholder: "HH:MM",
                                name: "newVisitTime",
                                srOnlyLabel: false,
                                label: "Time of Visit"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["row"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-md-12"],
                                items: [{
                                    control: "checkbox",
                                    srOnlyLabel: true,
                                    name: "checkGreat",
                                    label: "Historical Visit: a visit that occurred at some time in the past or at some other location (possibly non-VA) but is not used for workload credit."
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectEncounterProviderLocation = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "container",
                        tagName: "h5",
                        extraClasses: ["encounters-sub-heading"],
                        template: "Select Encounter Location"
                    }, {
                        control: "tabs",
                        tabs: [clinicalAppointmentsTab, hospitalAdmissionsTab, newVisitTab]
                    }]
                }]
            };
            // *********************************************** END OF CONTAINERS ****************************************

            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F513Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [selectEncounterProviderContainer, selectEncounterProviderLocation]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "button",
                    type: "button",
                    id: "cancel-btn",
                    label: "Cancel",
                    extraClasses: ["btn-default"],
                    name: "cancel"
                }, {
                    control: "button",
                    id: "ok-btn",
                    label: "OK",
                    extraClasses: ["btn-primary"],
                    name: "ok"
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    encounterProvider: 'Not Specified',
                    encounterLocation: 'Not Specified'
                }
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** FOOTER VIEW **********************************************
            // Okay to copy and paste - WITH 1 EXCEPTION (see below)
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary" title="Click button to continue your action!"}}'),
                // ONLY USE THESE EVENTS AS REFERENCE - need to have custom events that statisfy the requirements of the feature
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click .btn-default': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });
            // *********************************************** END OF FOOTER VIEW ***************************************

            // *********************************************** ALERT MESSAGE VIEWS **************************************
            // ONLY USE AS REFERENCE - need to have custom messages that statisfy the requirements of the feature
            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
                tagName: 'p'
            });
            // *********************************************** END OF ALERT MESSAGE VIEWS *******************************

            // *********************************************** FORM VIEW ************************************************
            // ONLY USE AS REFERENCE - need to have custom events/modelEvents .... that statisfy the requirements of the feature
            var formView = ADK.UI.Form.extend({
                fields: F513Fields,
                events: {
                    "submit": function(e) {
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
                                type: 'success',
                                message: 'Encounter successfully submitted with no errors.'
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
                    }
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();
            var workflowOptions = {
                size: "large",
                title: "Provider & Location for Current Activities",
                showProgress: false,
                keyboard: true,
                headerOptions:{
                    actionItems: [{
                        label: 'Close',
                        onClick: function(){ 
                            ADK.UI.Workflow.hide();
                        } 
                    }] 
                },
                steps: [{
                    view: formView,
                    viewModel: formModel
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F513;
});