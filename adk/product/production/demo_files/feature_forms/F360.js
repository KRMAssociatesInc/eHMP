define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    var F360 = {
        createForm: function() {
            var F360Fields = [{
                //*************************** Modal Body START ***************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: ["row", "section-divider"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            template: Handlebars.compile('<p>* indicates a required field.</class></p>')
                        },{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            items: [{
                                control: "radio",
                                name: "immunizationOption",
                                required: true,
                                label: "1. Choose an option.",
                                options: [{
                                    value: "administered",
                                    label: "Administered"
                                }, {
                                    value: "historical",
                                    label: "Historical"
                                }]
                            }]
                        },{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            items: [{
                                control: "select",
                                name: "immunizationType",
                                label: "2. Select an immunization type.",
                                title: "Press enter to begin searching content as you type. The results are listed below, use the up and down arrow keys to review the results.",
                                pickList: [{
                                    value: "chickenpox",
                                    label: "Chickenpox"
                                },{
                                    value: "flu shot, whole",
                                    label: "Flue Shot, Whole"
                                },{
                                    value: "hepatitis a",
                                    label: "Hepatitis A"
                                },{
                                    value: "hpv",
                                    label: "HPV"
                                },{
                                    value: "pnemucoccal",
                                    label: "Pnemucoccal"
                                },{
                                    value: "tetanus",
                                    label: "Tetanus"
                                }],
                                required: true,
                                disabled: true,
                                showFilter: true
                            }]
                        }]
                    }]
                }]
            }, { //*************************** Modal Footer START ***************************
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-3"],
                    }, {
                        control: "container",
                        extraClasses: ["col-md-9"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            type: 'button',
                            title: "Press enter to delete order",
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Next",
                            id: "nextBtn",
                            title: "Press enter to proceed to the next step",
                            name: "nextBtn",
                            disabled: true
                        }]
                    }]
                }]
            }];

            var generalOptionsArray = [{
                group: 'Group 1',
                pickList: [{
                    value: 'opt1',
                    label: 'Option 1'
                }, {
                    value: 'opt2',
                    label: 'Option 2'
                }]
            }, {
                group: 'Group 2',
                pickList: [{
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
                }]
            }, {
                group: 'Group 3',
                pickList: [{
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


            var F360Fields2 = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            template: Handlebars.compile('<h5>{{immunizationType}}<br><span class="small">{{immunizationOption}}</span></h5>'),
                            modelListeners: ["immunizationOption", "immunizationType"]
                        }, {
                            control: "spacer"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["form-highlight"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-md-12"],
                                items: [{
                                    control: "input",
                                    name: "lotNumberInput",
                                    label: "Lot Number",
                                    title: "Please enter in lot number"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-12"],
                                items: [{
                                    control: "select",
                                    name: "lotNumberSelect",
                                    label: "Lot Number",
                                    title: "To select an option, use the up and down arrow keys then press enter to select",
                                    required: true,
                                    pickList: [{
                                        value: "opt1",
                                        label: "Option 1"
                                    }, {
                                        value: "opt2",
                                        label: "Option 2"
                                    }, {
                                        value: "opt3",
                                        label: "Option 3"
                                    }]
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-6"],
                                items: [{
                                    control: "datepicker",
                                    name: "expirationDate",
                                    label: "Expiration Date"
                                }, {
                                    control: "input",
                                    name: "expirationDateReadOnly",
                                    label: "Expiration Date",
                                    title: "Please enter in a date in the following format, MM/DD/YYYY",
                                    readonly: true
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-6"],
                                items: [{
                                    control: "input",
                                    name: "manufacturer",
                                    label: "Manufacturer",
                                    title: "Please enter in manufacturer"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-12"],
                                items: [{
                                    control: "select",
                                    name: "informationSource",
                                    label: "Information Source",
                                    title: "To select an option, use the up and down arrow keys then press enter to select",
                                    pickList: [{
                                        value: "opt1",
                                        label: "Option 1"
                                    }, {
                                        value: "opt2",
                                        label: "Option 2"
                                    }, {
                                        value: "opt3",
                                        label: "Option 3"
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "datepicker",
                                name: "administrationDate",
                                label: "Administration Date",
                                title: "Please enter in a date in the following format, MM/DD/YYYY"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "input",
                                name: "administeringProvider",
                                label: "Administering Provider"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "input",
                                name: "orderingProvider",
                                label: "Ordering Provider",
                                title: "Please enter in ordering provider"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "encounterLocation",
                                label: "Encounter Location",
                                title: "Press enter to browse through select options",
                                showFilter: true,
                                pickList: [{
                                    value: "general medicine",
                                    label: "General Medicine"
                                },{
                                    value: "primary care",
                                    label: "Primary Care"
                                },{
                                    value: "dermatology",
                                    label: "Dermatology"
                                },{
                                    value: "intensive care unit",
                                    label: "Intensive Care Unit"
                                },{
                                    value: "emergency room",
                                    label: "Emergency Room"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "routeOfAdministration",
                                label: "Route of Administration",
                                    title: "To select an option, use the up and down arrow keys then press enter to select",
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "anatomicLocation",
                                label: "Anatomic Location",
                                title: "To select an option, use the up and down arrow keys then press enter to select",
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "input",
                                name: "historical-dosage-unit-text",
                                label: "Dosage/Unit",
                                type: "number",
                                title: "Please enter in dosage/unit",
                                placeholder: "Enter a temperature...",
                                units: [{
                                    label: "Unit 1",
                                    value: "unit1",
                                    title: "Unit 1",
                                }, {
                                    label: "Unit 2",
                                    value: "unit2",
                                    title: "Unit 2",
                                }, {
                                    label: "Unit 3",
                                    value: "unit3",
                                    title: "Unit 3",
                                }, {
                                    label: "Unit 4",
                                    value: "unit4",
                                    title: "Unit 4",
                                }, {
                                    label: "Unit 5",
                                    value: "unit5",
                                    title: "Unit 5",
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "series",
                                label: "Series",
                                title: "To select an option, use the up and down arrow keys then press enter to select",
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "informationStatement",
                                label: "Information Statement",
                                title: "To select an option, use the up and down arrow keys then press enter to select",
                                pickList: generalOptionsArray,
                                showFilter: false,
                                groupEnabled: true,
                                multiple: true,
                                size: 10
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "datepicker",
                                name: "visDateOffered",
                                label: "VIS Date Offered",
                                title: "Please enter in a date in the following format, MM/DD/YYYY"
                            }]
                        }]
                    },{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            items: [{
                                control: "textarea",
                                name:"comments2",
                                label: "Comments",
                                rows: 7,
                                title: "Please enter in more information"
                            }]
                        }]
                    }]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-3"]
                    }, {
                        control: "container",
                        extraClasses: ["col-md-9"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            title: "Press enter to delete order",
                            type: 'button'
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            title: "Press enter to close immunization",
                            id: "close-btn"
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Back",
                            title: "Press enter to go back to the previous step",
                            id: "back-btn"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Add",
                            title: "Press enter to add immunization",
                            id: "add-btn"
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    immunizationType: "flu shot, whole",
                    encounterLocation: "general medicine",
                    expirationDateReadOnly: moment().format('MM/DD/YYYY')
                }
            });

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary" title="Click button to continue your action!"}}'),
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

            var formView = ADK.UI.Form.extend({
                ui: {
                    "immunizationType": ".immunizationType",
                    "nextBtn": ".nextBtn"
                },
                fields: F360Fields,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "submit": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToNext();
                        }
                    }
                },

                modelEvents: {
                    'change:immunizationOption': function(model) {
                        var immunizationOption = model.get('immunizationOption');
                        if (immunizationOption) {
                            this.$(this.ui.immunizationType).trigger('control:disabled', false);
                        }
                        this.$(this.ui.nextBtn).trigger('control:disabled',false);
                    }
                }
            });

            var formView2 = ADK.UI.Form.extend({
                ui: {
                    "lotNumberInput": ".lotNumberInput",
                    "manufacturer": ".manufacturer",
                    "expirationDate": ".expirationDate",
                    "administrationDate": ".administrationDate",
                    "administeringProvider": ".administeringProvider",
                    "orderingProvider": ".orderingProvider",
                    "encounterLocation": ".encounterLocation",
                    "informationSource": ".informationSource",
                    "lotNumberSelect": ".lotNumberSelect",
                    "expirationDateReadOnly": ".expirationDateReadOnly",
                    "hiddenAdministered": ".expirationDate, .informationSource, .lotNumberInput",
                    "hiddenHistorical": ".expirationDateReadOnly, .lotNumberSelect",
                    "requiredToggle": ".administeringProvider, .orderingProvider, .administrationDate, .encounterLocation",

                    "resetFields": ".lotNumberInput, .lotNumberSelect, .manufacturer, .expirationDate, .administrationDate, .administeringProvider, .orderingProvider, .routeOfAdministration, .anatomicLocation, historical-dosage-unit-text, .series, .informationSource, .informationStatement .visDateOffered"
                },
                fields: F360Fields2,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #back-btn": function(e) {
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToPrevious();
                        }
                    },
                    "click #close-btn": function(e) {
                        e.preventDefault();
                        var saveAlertView = new ADK.UI.Notification({
                            title: 'Immunization Saved',
                            message: 'Immunization successfully saved without errors.',
                            type: "success"

                        });
                        saveAlertView.show();
                        ADK.UI.Workflow.hide();
                    },
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
                                title: 'Immunization Submitted',
                                icon: 'fa-check',
                                message: 'Immunization successfully submitted with no errors.',
                                type: "success"

                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                resetAll: function() {
                    this.model.unset("lotNumberInput");
                    this.model.unset("lotNumberSelect");
                    this.model.unset("expirationDate");
                    this.model.unset("informationSource");
                    this.model.unset("administrationDate");
                    this.model.unset("administeringProvider");
                    this.model.unset("orderingProvider");
                    this.model.unset("routeOfAdministration");
                    this.model.unset("anatomicLocation");
                    this.model.unset("historical-dosage-unit-text");
                    this.model.unset("series");
                    this.model.unset("informationStatement");
                    this.model.unset("visDateOffered");
                    this.model.unset("comments2");
                    this.model.set('encounterLocation', "general medicine");
                    
                },
                modelEvents: {
                    'change:immunizationOption': function(model) {
                        var immunizationOption = model.get('immunizationOption');
                        if (immunizationOption === 'administered') {
                            this.resetAll();
                            this.model.set('manufacturer', 'The Loren Ipsum'); //set default value for manufacturer since this field is read only

                            this.$(this.ui.requiredToggle).trigger('control:required', true);
                            this.$(this.ui.hiddenAdministered).trigger('control:hidden',true);
                            this.$(this.ui.hiddenHistorical).trigger('control:hidden', false);
                            this.$(this.ui.manufacturer).trigger('control:readonly', true);
                        } else {
                            this.resetAll();
                            this.model.unset("manufacturer");

                            this.$(this.ui.requiredToggle).trigger('control:required', false);
                            this.$(this.ui.hiddenAdministered).trigger('control:hidden', false);
                            this.$(this.ui.hiddenHistorical).trigger('control:hidden', true);
                            this.$(this.ui.manufacturer).trigger('control:readonly', false);
                        }
                        
                    },
                    'change:immunizationType': function(model) {
                        this.resetAll();
                        this.model.unset("manufacturer");
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Immunization",
                showProgress: true,
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
                    stepTitle: 'Select an Immunization type'
                }, {
                    view: formView2,
                    viewModel: formModel,
                    stepTitle: 'Enter Immunization Info'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F360;
});