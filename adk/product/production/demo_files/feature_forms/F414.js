define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // http://10.1.1.150/documentation/#/adk/conventions#Writeback
    //=============================================================================================================

    var F414 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            // *********************************************** STATIC COLLECTION ****************************************
            // NOTE: PICKLIST IS ONLY FOR THIS DEMO EXAMPLE
            var yesNoPick = new Backbone.Collection([{
                name: '001',
                label: 'Service Connected Condition',
                // value: undefined
            }, {
                name: '002',
                label: 'Agent Orange',
                // value: true
            }, {
                name: '003',
                label: 'Radiation',
                // value: false
            }]);

            var pickList1 = new Backbone.Collection([{
                value: 'Option1',
                label: 'Option1'
            }, {
                value: 'Option2',
                label: 'Option2'
            }, {
                value: 'Option3',
                label: 'Option3'
            }, {
                value: 'Option4',
                label: 'Option4'
            }, {
                value: 'Option5',
                label: 'Option5'
            }, {
                value: 'Allergic Headache',
                label: 'Allergic Headache'
            }]);
            // *********************************************** END OF STATIC PICKLISTS **********************************

            // *********************************************** CONTAINERS ***********************************************
            // Okay to copy and paste this !!!!!!!!! BUT ENSURE TO REPLACE STATIC OPTIONS/DATA WITH REAL DATA !!!!!!!
            var warningContainer = {
                control: "container",
                extraClasses: ["row", "row-subheader"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "checkbox",
                        extraClasses: ["hidden"],
                        name: "request-new-term",
                        label: "Request New Term"
                    }, {
                        control: "alertBanner", //Patient is taking other drug that may react with this one
                        name: "alertMessage",
                        type: "warning",
                        dismissible: true,
                        title: "Warning",
                        icon: "fa-warning"
                    }]
                }]
            };

            var prevSelectProblemTypeahead = '';

            var selectProblemContainer = {
                control: "container",
                extraClasses: ["row", "section-divider"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "container",
                        tagName: "p",
                        template: "* indicates a required field."
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "typeahead",
                        id: "selectProblemTypeahead",
                        name: "selectProblemTypeahead",
                        label: "Select a Problem",
                        srOnlyLabel: false,
                        placeholder: "Search for available problems...",
                        pickList: pickList1,
                        required: true
                    }]
                }]
            };

            var allergicHeadacheContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-8", "col-xs-8"],
                    items: [{
                        control: "container",
                        tagName: "h5",
                        template: '{{selectProblemTypeahead}}',
                        modelListeners: ["selectProblemTypeahead"]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-3", "col-xs-3"],
                    items: [{
                        control: "button",
                        extraClasses: ["icon-btn", "icon-btn-mini", "btn-link"],
                        type: "button",
                        label: "Change problem..."
                    }]
                }, {
                    control: "spacer"
                }]
            };

            var requiredText = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    tagName: "p",
                    template: "* indicates as a required field."
                }]
            };

            var statusContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "radio",
                    required: true,
                    name: "statusRadioValue",
                    label: "Status",
                    options: [{
                        label: "Option 1",
                        value: "sr-opt1"
                    }, {
                        label: "Option 2",
                        value: "sr-opt2"
                    }]
                }]
            };

            var immediacyContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "radio",
                    required: true,
                    name: "immediacyRadioValue",
                    label: "Immediacy",
                    options: [{
                        label: "Option 1",
                        value: "ir-opt1"
                    }, {
                        label: "Option 2",
                        value: "ir-opt2"
                    }, {
                        label: "Option 3",
                        value: "ir-opt3"
                    }]
                }]
            };

            var onsetDateContainer = {
                control: "container",
                extraClasses: ["col-xs-6"],
                items: [{
                    control: "datepicker",
                    name: "onset-date",
                    label: "Onset Date"
                }]
            };

            var clinicContainer = {
                control: "container",
                extraClasses: ["col-xs-6"],
                items: [{
                    control: "input",
                    name: "clinic",
                    label: "Clinic"
                }]
            };

            var resProviderContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "input",
                    name: "res-provider",
                    label: "Res Provider *"
                }]
            };

            var treatmentFactorsContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    extraClasses: ["well", "read-only-well"],
                    items: [{
                        name: "yesNoChecklist",
                        label: "Treatment Factors",
                        control: "yesNoChecklist",
                        collection: yesNoPick
                    }]
                }]
            };

            var annotationsContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    tagName: "h6",
                    template: "Annotate"
                }, {
                    control: "container",
                    extraClasses: ["panel", "panel-default"],
                    items: [{
                        control: "container",
                        extraClasses: ["panel-body"],
                        items: [{
                            control: "commentBox",
                            name: "commentCollection",
                            collection: new Backbone.Collection([{
                                commentString: "The patient is lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                author: {
                                    name: "Vehu, Five",
                                    duz: {
                                        "9E7A": "10000000255"
                                    }
                                },
                                timeStamp: "12/14/2014 11:15PM"
                            }, {
                                commentString: "The patient is lorem ipsum dolor sit amet.",
                                author: {
                                    name: "Vehu, Five",
                                    duz: {
                                        "9E7A": "10000000238"
                                    }
                                },
                                timeStamp: "12/13/2014 11:17PM"
                            }]),
                            attributeMapping: {
                                comment: "commentString",
                                author: "author",
                                timeStamp: "timeStamp"
                            }
                        }]
                    }]
                }]
            };

            var lowerBodyContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [requiredText, statusContainer, immediacyContainer, onsetDateContainer, clinicContainer, resProviderContainer, treatmentFactorsContainer, annotationsContainer]
            };
            // *********************************************** END OF CONTAINERS ****************************************

            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F414_SelectProblemFields = [{
                // **************************************** Modal Body Start ********************************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [warningContainer, selectProblemContainer]
                }]
            }, {
                // **************************************** Modal Footer Start ******************************************
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
                            id: 'delete-btn',
                            // name: 'delete-btn',
                            extraClasses: ["icon-btn", "btn-sm"],
                            type: "button",
                            icon: "fa-trash-o fa-lg",
                            label: ""
                        }, {
                            control: "button",
                            id: "next-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Next",
                            type: 'button',
                            name: "next",
                            disabled: true
                        }]
                    }]
                }]
            }];

            var F414_EnterProblemFields = [{
                // **************************************** Modal Body Start ********************************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [allergicHeadacheContainer, lowerBodyContainer]
                }]
            }, {
                // **************************************** Modal Footer Start ******************************************
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
                            id: 'delete-btn',
                            // name: "delete-btn",
                            extraClasses: ["icon-btn", "btn-sm"],
                            type: "button",
                            icon: "fa-trash-o fa-lg",
                            label: ""
                        }, {
                            control: "button",
                            id: "close-btn",
                            name: "close-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            type: 'button',
                            name: "close-btn"
                        }, {
                            control: "button",
                            id: "back-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Back",
                            type: 'button',
                            name: "back"
                        }, {
                            control: "button",
                            id: "add-btn",
                            name: 'add-btn',
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Add",
                            name: "add"
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    savedDay: 'MM/dd/YYYY',
                    selectProblemTypeahead: ''
                }
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** FOOTER VIEW **********************************************
            // Okay to copy and paste - WITH 1 EXCEPTION (see below)

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

            var selectProblemView = ADK.UI.Form.extend({
                ui: {
                    "nextBtn": "#next-btn", // # for id
                    "requestNewTerm": ".request-new-term" // . for name
                },
                fields: F414_SelectProblemFields,
                events: {
                    "click #next-btn": function(e) {
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

                        if(prevSelectProblemTypeahead != this.model.get('selectProblemTypeahead')) {
                            console.log("*** clear input at this point");
                            //
                            this.clearInput();
                        }

                        prevSelectProblemTypeahead = this.model.get('selectProblemTypeahead');
                        console.log("prev = " + prevSelectProblemTypeahead);

                        return false;
                    },
                    "click #delete-btn": function(e) {
                        // alert
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    }
                },
                modelEvents: {
                    'change:selectProblemTypeahead': function(model) {

                        var selectProblem = model.get('selectProblemTypeahead');

                        var checkName = _.find(pickList1.models, function(obj) {
                            return obj.get('label') === selectProblem;
                        });

                        if (_.isUndefined(checkName)) {
                            this.model.set('alertMessage', 'If you proceed with this nonspecific term, an ICD code of "799.9 - OTHER UNKNOWN AND UNSPECIFIED CAUSE OF MORBIDITY OR MORTALITY" will be filed.');
                            this.$(this.ui.requestNewTerm).trigger('control:hidden', false);
                            this.$(this.ui.nextBtn).trigger('control:disabled', true);

                        } else {
                            this.model.unset('alertMessage');
                            this.$(this.ui.requestNewTerm).trigger('control:hidden', true);

                            // console.log("setting checkmark to false");
                            this.model.set('request-new-term', false);
                            // this.$(this.ui.requestNewTerm).trigger('control:checked', false);

                            this.$(this.ui.nextBtn).trigger('control:disabled', false);

                        }

                    },
                    'change:request-new-term': function(model) {
                        var requestNewTerm = model.get('request-new-term');
                        var reqHidden = this.$(this.ui.requestNewTerm).attr('class');

                        if (requestNewTerm == true)
                            this.$(this.ui.nextBtn).trigger('control:disabled', false);
                        else
                            this.$(this.ui.nextBtn).trigger('control:disabled', true);

                    }
                }, 
                clearInput: function() {

                    console.log("*** should be clearing data !!!");

                    this.model.unset("statusRadioValue");
                    this.model.unset("immediacyRadioValue");
                    this.model.unset("onset-date");
                    this.model.unset("clinic");
                    this.model.unset("res-provider");
                    this.model.unset("yesNoChecklist");
                }
            });

            var enterProblemInfoView = ADK.UI.Form.extend({
                ui: {
                    // "acceptBtn": ".acceptBtn",
                    // "howLong": ".howLong",
                },
                fields: F414_EnterProblemFields,
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
                                title: 'Problem Submitted',
                                icon: 'fa-check',
                                message: 'Problem successfully submitted with no errors.',
                                type: "sucess"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
                    "click #back-btn": function(e) {
                        // console.log("BACK button clicked");

                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToPrevious();
                        }
                        return false;
                    },
                    "click #delete-btn": function(e) {
                        // alert
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #close-btn": function(e) {
                        // growl alert
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to close this form?',
                            icon: 'fa-warning',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        closeAlertView.show();
                    }
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Problem",
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
                    view: selectProblemView,
                    viewModel: formModel,
                    stepTitle: 'Select a Problem'
                }, {
                    view: enterProblemInfoView,
                    viewModel: formModel,
                    stepTitle: 'Enter Problem Info'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F414;
});