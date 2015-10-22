define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!demo_files/feature_forms/supporting_templates/F432_summaryTemplate'
], function(Backbone, Marionette, $, Handlebars, SummaryTemplate) {

    var F432 = {
        createForm: function() {
            var alertMessageContainer = {
                control: "container",
                extraClasses: ["row", "row-subheader"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "alertBanner",
                        name: "alertMessage", //Please note if specimen is Random, Trough or Peak, lable both the tube and the order slip
                        dismissible: true
                    }]
                }]
            };

            var availableLabTestsContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    tagName: "p",
                    // template: Handlebars.compile('<p>* indicates a required field.</class></p>'),
                }, {
                    control: "container",
                    extraClasses: ["form-highlight"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-12"],
                        items: [{
                            control: "typeahead",
                            name: "availableLabTests",
                            label: "Available Lab Tests",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }, {
                                label: "Option 4",
                                value: "opt4"
                            }, {
                                label: "Option 5",
                                value: "opt5"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            name: "urgency",
                            label: "Urgency",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            name: "collectionDateTime",
                            label: "Collection Date/Time",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Immediate",
                                value: "immediate"
                            }]
                        }]
                    }]
                }]
            };

            var restOfBodyContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            name: "howOften",
                            label: "How Often?",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Hourly",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            name: "howLong",
                            label: "How Long?",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            disabled: true,
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            name: "collectionSample",
                            label: "Collection Sample",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            name: "collectionType",
                            label: "Collection Type",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "select",
                            name: "specimen",
                            label: "Specimen",
                            title: "Use up and down arrow keys to view options and press enter to select",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6", "hidden", "anticoagulantContainer"],
                        items: [{
                            control: "input",
                            name: "anticoagulant",
                            label: "What Kind of anticoagulant is the patient on?"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6", "hidden", "sampleDrawnAtContainer"],
                        items: [{
                            control: "fieldset",
                            legend: "Sampe Drawn At:",
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-6"],
                                items: [{
                                    control: "radio",
                                    name: "sampleDrawnAt",
                                    options: [{
                                        label: "Peak",
                                        value: "peak",
                                    }]
                                }, {
                                    control: "radio",
                                    name: "sampleDrawnAt",
                                    options: [{
                                        label: "Trough",
                                        value: "trough"
                                    }]
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-6"],
                                items: [{
                                    control: "radio",
                                    name: "sampleDrawnAt",
                                    options: [{
                                        label: "Mid",
                                        value: "mid"
                                    }]
                                }, {
                                    control: "radio",
                                    name: "sampleDrawnAt",
                                    options: [{
                                        label: "Unknown",
                                        value: "unknown"
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6", "hidden", "doneDateContainer"],
                        items: [{
                            control: "datepicker",
                            name: "doneDate",
                            label: "Enter last done date:"
                        }]
                    },
                    // {
                    //     control: "container",
                    //     extraClasses: ["col-xs-6"] //EXTRA COL FOR FORMATTING
                    // },
                    {
                        control: "container",
                        extraClasses: ["col-xs-6", "hidden", "doneTimeContainer"],
                        items: [{
                            control: "timepicker",
                            name: "drawTime",
                            placeholder: "HH:MM",
                            label: "Enter draw time:",
                            options: {
                                defaultTime: false
                            }
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-12", "hidden", "additionalCommentsContainer"],
                        items: [{
                            control: "textarea",
                            name: "additionalComments",
                            label: "Additional Comments",
                            rows: 3
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-12", "hidden", "herpesContainer"],
                        items: [{
                            control: "typeahead",
                            name: "herpesSimplexCommonA",
                            label: "Herpes Simplex Common A",
                            pickList: [{
                                label: "Option 1",
                                value: "opt1"
                            }, {
                                label: "Option 2",
                                value: "opt2"
                            }, {
                                label: "Option 3",
                                value: "opt3"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-12", "hidden", "immediateCollectionContainer"],
                        items: [{
                            control: "fieldset",
                            legend: "Immediate Collection Times",
                            items: [{
                                control: "container",
                                extraClasses: ["well"],
                                template: Handlebars.compile('<p>No Collection on Holidays</p><hr><p> MON - FRI: Collection between 06:00 and 23:00</p><p>Laboratory Service requires at least 5 minutes to collect this order.</p>'),
                                items: [{
                                    control: "container",
                                    extraClasses: ["row"],
                                    items: [{
                                        control: "container",
                                        extraClasses: ["col-xs-6"],
                                        items: [{
                                            control: "datepicker",
                                            label: "Date Taken",
                                            name: "immediateCollectionDate"
                                        }]
                                    }, {
                                        control: "container",
                                        extraClasses: ["col-xs-6"],
                                        items: [{
                                            control: "timepicker",
                                            label: "Time Taken",
                                            name: "immediateCollectionTime",
                                            options: {
                                                defaultTime: false
                                            }
                                        }]
                                    }]
                                }, {
                                    control: "container",
                                    extraClasses: ["row", "text-right"],
                                    items: [{
                                        control: "button",
                                        id: 'immediate-collection-delete-btn',
                                        extraClasses: ["icon-btn", "btn-sm"],
                                        type: "button",
                                        name: "trash",
                                        icon: "fa-trash-o",
                                        label: ""
                                    }, {
                                        control: "button",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        label: "Add",
                                        type: "button",
                                        name: "immediate-collection-add-btn"
                                    }]
                                }]
                            }]

                        }]
                    }
                ]
            };

            var orderPreviewContainer = {
                control: "container",
                template: SummaryTemplate,
                modelListeners: ["availableLabTests", "urgency", "collectionDateTime",
                    "collectionSample", "collectionType", "specimen", "howOften", "howLong",
                    "sampleDrawnAt", "additionalComments", "anticoagulant", "doneDate",
                    "drawTime", "herpesSimplexCommonA", "immediateCollectionDate", "immediateCollectionTime"
                ],
                extraClasses: ["order-preview"]
            };

            var F432Fields = [
                // **************************************** Modal Body Start ******************************************
                {
                    control: "container",
                    extraClasses: ["modal-body"],
                    items: [{
                        control: "container",
                        extraClasses: ["scroll-enter-form"],
                        items: [alertMessageContainer, availableLabTestsContainer, restOfBodyContainer, orderPreviewContainer]
                    }]
                }, { // **************************************** Modal Footer Start ******************************************
                    control: "container",
                    extraClasses: ["modal-footer"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-3"]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-9"],
                            items: [{
                                control: "button",
                                id: 'form-delete-btn',
                                extraClasses: ["icon-btn"],
                                type: "button",
                                name: "trash",
                                icon: "fa-trash-o fa-lg",
                                label: "",
                            }, {
                                control: "button",
                                id: "form-close-btn",
                                extraClasses: ["btn-primary", "btn-sm"],
                                label: "Close",
                                type: 'button',
                                name: "cancel",
                                title: "Press enter to close"
                            }, {
                                control: "button",
                                extraClasses: ["btn-primary", "btn-sm"],
                                label: "Accept",
                                name: "acceptBtn",
                                disabled: true,
                                title: "Press enter to accept"
                            }]
                        }]
                    }]
                }
            ];

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this lab order. Would you like to proceed?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this lab order. Would you like to proceed?'),
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

            var FormModel = Backbone.Model.extend({
                defaults: {
                    additionalComments: '',
                    alertMessage: '',
                    anticoagulant: '',
                    availableLabTests: '',
                    collectionDateTime: '',
                    collectionSample: '',
                    collectionType: '',
                    doneDate: '',
                    drawTime: '',
                    herpesSimplexCommonA: '',
                    howLong: '',
                    howOften: '',
                    sampleDrawnAt: '',
                    specimen: '',
                    theoSection: '',
                    urgency: ''
                }
            });

            var formView = ADK.UI.Form.extend({
                ui: {
                    "acceptBtn": ".acceptBtn",
                    "howLong": ".howLong",
                    "anticoagulantContainer": ".anticoagulantContainer",
                    "sampleDrawnAtContainer": ".sampleDrawnAtContainer",
                    "additionalCommentsContainer": ".additionalCommentsContainer",
                    "doneDateContainer": ".doneDateContainer",
                    "doneTimeContainer": ".doneTimeContainer",
                    "herpesContainer": ".herpesContainer",
                    "sampleDrawnAt": ".sampleDrawnAt",
                    "additionalComments": ".additionalComments",
                    "doneDate": ".doneDate",
                    "drawTime": ".drawTime",
                    "herpesSimplexCommonA": ".herpesSimplexCommonA",
                    "immediateCollectionContainer": ".immediateCollectionContainer",
                    "immediateCollectionDate": ".immediateCollectionDate",
                    "immediateCollectionTime": ".immediateCollectionTime"
                },
                fields: F432Fields,
                events: {
                    "click #form-delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #form-close-btn": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to close this form?',
                            icon: 'fa-warning',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        closeAlertView.show();
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
                                title: 'Lab Order Submitted',
                                icon: 'fa-check',
                                message: 'Lab order successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                hideAll: function() {
                    this.$(this.ui.anticoagulantContainer).addClass('hidden');
                    this.$(this.ui.sampleDrawnAtContainer).addClass('hidden');
                    this.$(this.ui.additionalCommentsContainer).addClass('hidden');
                    this.$(this.ui.doneDateContainer).addClass('hidden');
                    this.$(this.ui.doneTimeContainer).addClass('hidden');
                    this.$(this.ui.herpesContainer).addClass('hidden');
                },
                modelEvents: {
                    'change:howOften': function(model) {
                        var howOften = model.get('howOften');
                        if (howOften == "opt2") {
                            this.$(this.ui.howLong).find('select').attr('disabled', false);
                        } else {
                            this.$(this.ui.howLong).find('select').attr('disabled', true);
                        }
                    },
                    'change:availableLabTests': function(model) {
                        var method = model.get('availableLabTests');

                        this.hideAll();
                        this.model.unset('alertMessage');

                        if (method === "opt2") {
                            this.$(this.ui.sampleDrawnAtContainer).removeClass('hidden');
                            this.$(this.ui.additionalCommentsContainer).removeClass('hidden');
                            this.model.set('alertMessage', 'Please note if specimen is Random, Trough or Peak, label both the tube and the order slip');
                        } else if (method === "opt3") {
                            this.$(this.ui.anticoagulantContainer).removeClass('hidden');
                        } else if (method === "opt4") {
                            this.$(this.ui.doneDateContainer).removeClass('hidden');
                            this.$(this.ui.doneTimeContainer).removeClass('hidden');
                        } else if (method === "opt5") {
                            this.$(this.ui.herpesContainer).removeClass('hidden');
                        }

                        if (method) {
                            this.$(this.ui.acceptBtn).find('button').attr('disabled', false).removeClass('disabled');
                        } else {
                            this.$(this.ui.acceptBtn).find('button').attr('disabled', true).addClass('disabled');
                        }
                    },
                    'change:collectionDateTime': function(model) {
                        var method = model.get('collectionDateTime');
                        if (method === "immediate") {
                            this.$(this.ui.immediateCollectionContainer).removeClass('hidden');
                        } else {
                            this.$(this.ui.immediateCollectionContainer).addClass('hidden');
                        }
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Order a Lab Test",
                showProgress: false,
                keyboard: true,
                headerOptions: {
                    actionItems: [{
                        label: 'Close',
                        onClick: function() {
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
    return F432;
});