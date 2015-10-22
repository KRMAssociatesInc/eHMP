define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!demo_files/feature_forms/supporting_templates/F412_summaryTemplate',
    'hbs!demo_files/feature_forms/supporting_templates/F412_clinicApptTemplate'
], function(Backbone, Marionette, $, Handlebars, SummaryTemplate, ClinicApptTemplate) {

    var F412 = {
        createForm: function() {
            // *********************************************** CONTAINERS ***********************************************
            var topStaticContainer = {
                control: "container",
                extraClasses: [/*"row",*/ "col-xs-12"],
                template: '<h5 class="encounters-sub-heading">Select Encounter Provider</h5>',

                items: [{
                    control: "container",
                    extraClasses: ["col-sm-6"],
                    items: [{
                        control: "typeahead",
                        name: "selectEncounterProvider",
                        placeholder: "Search for Provider",
                        pickList: [{
                            value: 'opt1',
                            label: 'Option 1'
                        }, {
                            value: 'opt2',
                            label: 'Option 2'
                        }, {
                            value: 'opt3',
                            label: 'Option 3'
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-sm-6", "well", "well-sm"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        template: '<h6>Encounter Provider<br><span id="encounters-provider">{{encounterProvider}}</span></h6>'
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        template: '<h6>Encounter Location<br><span id="encounters-location">{{encounterLocation}}</span></h6>',
                        items: [{
                            control: "button",
                            id: "viewEncouters-btn",
                            label: "View Encounters",
                            extraClasses: ["btn", "btn-primary", "btn-xs"],
                            name: "viewEncouters-btn"
                        }]
                    }]
                }]
            };

            /*
            *
            ****************************

            $('.comet .workflow-container .modal-dialog .modal-content').css('width', 'auto')
            $('.comet .workflow-container .modal-dialog .modal-content').css('height', 'auto')
            
            ****************************
            *
            */

            var tabContainer = {
                control: "container",
                extraClasses: [/*"row", */"col-xs-12"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    template: '<h5 class="encounters-sub-heading">Select Encounter Location</h5>',
                    items: [{
                        control: "tabs",
                        extraClasses: ["tab-container"],
                        tabs: [{
                            // ******************** Tab 1 ********************
                            title: "Clinic Appointments",
                            items: [{
                                control: "container",
                                extraClasses: ["tab-pane"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["row"],
                                    items: [{
                                        control: "datepicker",
                                        extraClasses: ["col-md-9", "col-md-3"],
                                        name: "fromDatepickerValue",
                                        label: "From"
                                    }, {
                                        control: "datepicker",
                                        extraClasses: ["col-md-3", "col-md-9"],
                                        name: "throughDatepickerValue",
                                        label: "Through"
                                    }]
                                }, {
                                    control: "container",
                                    extraClasses: ["row"],
                                    template: '<h6>Clinic Appointments / Visits</h6>',
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
                        }, {
                            // ******************** Tab 2 ********************
                            title: "Hospital Admissions",
                            items: [{
                                control: "container",
                                extraClasses: ["tab-pane"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["row"],
                                    template: '<h6>Hospital Admissions</h6>',
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
                        }, {
                            // ******************** Tab 3 ********************
                            title: "New Visit",
                            items: [{
                                control: "container",
                                extraClasses: ["tab-pane"],
                                items: [{
                                    control: "typeahead",
                                    extraClasses: ["col-sm-6"],
                                    name: "nv-typeahead",
                                    label: "New Encounter Location",
                                    placeholder: "Search for New Encounter Location",
                                    pickList: [{
                                        value: 'opt1',
                                        label: 'Option 1'
                                    }, {
                                        value: 'opt2',
                                        label: 'Option 2'
                                    }, {
                                        value: 'opt3',
                                        label: 'Option 3'
                                    }]
                                }, {
                                    control: "container",
                                    extraClasses: ["col-sm-6"],
                                    items: [{
                                        control: "datepicker",
                                        extraClasses: ["col-sm-6"],
                                        name: "nv-fromDatepickerValue",
                                        label: "From"
                                    }, {
                                        control: "timepicker",
                                        extraClasses: ["col-sm-6"],
                                        placeholder: "HH:MM",
                                        name: "nv-timepickerValue",
                                        label: "Time of Visit"
                                    }, {
                                        control: "checkbox",
                                        extraClasses: ["col-sm-12"],
                                        name: "nv-checkboxValue",
                                        label: "Historical Visit: a visit that occurred at some time in the past or at some other location (possibly non-VA) but is not used for workload credit."
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            };

            // *********************************************** MODEL ***********************************************

            var F412Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [topStaticContainer, tabContainer]
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

            var FormModel = Backbone.Model.extend({
                defaults: {
                    encounterProvider: 'Not Specified',
                    encounterLocation: 'Not Specified'
                }
            });

            var formView = ADK.UI.Form.extend({
                fields: F412Fields,
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
                                message: 'Encounter successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
                    "click #cancel-btn": function() {
                        alert('Cancel');
                    }
                }
            });

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
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F412;
});