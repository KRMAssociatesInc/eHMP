define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    var F420 = {
        createForm: function() {
            var genericPicklist = [{
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

            var allergySymptoms = new Backbone.Collection([{
                id: 'congestion',
                description: 'Nasal Congestion',
                booleanValue: false
            }, {
                id: 'sneezing',
                description: 'Sneezing',
                booleanValue: false
            }, {
                id: 'itchyWateryEyes',
                description: 'Itchy / Watery Eyes',
                booleanValue: false
            }, {
                id: 'irritatedSkin',
                description: 'Irritated Skin',
                booleanValue: false
            }]);

            var headerText = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: Handlebars.compile('<p>* indicates a required field.</p>')
                }, {
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: Handlebars.compile("<h5>Select an Allergy</h5><hr>")
                }]
            };

            var topFields = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "select",
                        name: "search-allergies",
                        label: "Search for allergies",
                        pickList: genericPicklist,
                        showFilter: true,
                        groupEnabled: true
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "radio",
                        name: "allergyType",
                        options: [{
                            value: "observed",
                            label: "Observed"
                        }, {
                            value: "historical",
                            label: "Historical"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6", "col-xs-6"],
                    items: [{
                        control: "datepicker",
                        name: "reaction-date",
                        label: "Reaction Date",
                        required: true,
                        disabled: true
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6", "col-xs-6"],
                    items: [{
                        control: "timepicker",
                        name: "time",
                        label: "Time",
                        placeholder: "HH:MM",
                        required: true,
                        disabled: true,
                        options: {
                            defaultTime: false
                        }
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6", "col-xs-6"],
                    items: [{
                        control: "select",
                        name: "severity",
                        label: "Severity",
                        required: true,
                        disabled: true,
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
                    extraClasses: ["col-md-6", "col-xs-6"],
                    items: [{
                        control: "select",
                        name: "nature-of-reaction",
                        label: "Nature of Reaction",
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
            };

            var bottomFields = {
                control: "container",
                extraClasses: ["row", "section-divider"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        name: "signsSymptoms",
                        label: "Signs / Symptoms",
                        control: "multiselectSideBySide",
                        // collection: pickList1,
                        header: "Providers for this encounter",
                        extraClasses: ["fancy", "BIGGGG"],
                        attributeMapping: {
                            unique: 'id',
                            value: 'booleanValue',
                            label: 'description'
                        }
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "textarea",
                        rows: 5,
                        name: "moreInfo",
                        label: "Comment",
                        title: "Please enter in more information about yourself"
                    }]
                }]
            };

            var bottomView = {
                control: "container",
                // extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    template: Handlebars.compile('<h6>Signs/Symptoms (Required if Observed)</h6>'),
                    items: [{
                        control: "container",
                        template: Handlebars.compile('<h4>Multi-Select Side By Side with date and time picker</h4>')
                    }]
                }, {
                    control: 'textarea',
                    name: "comments",
                    label: "Comments",
                    // extraClasses: ["col-xs-12"],
                    rows: 5
                }]
            };

            var F420Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [headerText, topFields, bottomFields]
                }]
            }, { //*************************** Modal Footer START ***************************
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        items: [{
                            control: "button",
                            id: "form-delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            title: "Press enter to delete",
                            type: 'button'
                        }, {
                            control: "button",
                            id: "form-cancel-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Cancel",
                            type: 'button',
                            title: "Press enter to cancel",
                            name: "cancelBtn"
                        }, {
                            control: "button",
                            id: "form-close-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            type: 'button',
                            title: "Press enter to close",
                            name: "closeBtn"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Add",
                            name: "addBtn",
                            title: "Press enter to add",
                            disabled: true
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    signsSymptoms: allergySymptoms
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
                    "dateTimeSeverity": ".reaction-date, .time, .severity, .signsSymptoms",
                    "allergyType": ".allergyType",
                    "addBtn": ".addBtn"
                },
                fields: F420Fields,
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
                                title: 'Allergy Submitted',
                                icon: 'fa-check',
                                message: 'Allergy successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
                },
                modelEvents: {
                    'change:allergyType': function(model) {
                        var allergyType = model.get('allergyType');
                        if (allergyType === 'observed') {
                            this.$(this.ui.dateTimeSeverity).trigger("control:disabled", false);
                        } else {
                            this.$(this.ui.dateTimeSeverity).trigger("control:disabled", true);
                        }
                    },
                    'change:search-allergies': function(model) {
                        var searchAllergies = model.get('search-allergies');
                        if (searchAllergies) {
                            this.$(this.ui.addBtn).find('button').attr('disabled', false);
                        }
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Allergies",
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
                    stepTitle: 'Select an Allergy'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F420;
});