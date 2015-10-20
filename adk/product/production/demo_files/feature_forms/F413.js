define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!demo_files/feature_forms/supporting_templates/F413_selectedDiagnosisBody',
    'hbs!demo_files/feature_forms/supporting_templates/F413_selectedProceduresTemplate'
], function(Backbone, Marionette, $, Handlebars, SelectedDiagnosesBody, SelectedProceduresTemplate) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // http://10.1.1.150/documentation/#/adk/conventions#Writeback
    //=============================================================================================================

    var F413 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        cssClass: "encounters-container",
        createForm: function() {

            // *********************************************** CONTAINERS ***********************************************
            // Okay to copy and paste this !!!!!!!!!!!!! BUT ENSURE TO REPLACE STATIC OPTIONS/DATA WITH REAL DATA !!!!!!!!!!!!!
            var diagnosisHeaderContainer = {
                control: "container",
                extraClasses: ["row", "bottom-pad-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5 class="no-margin">Diagnosis List</h5>'
                }]
            };

            var diagnosesContainer = {
                control: "container",
                extraClasses: ["row", "bottom-pad-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-11"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "drilldownChecklist",
                            selectOptions: {
                                control: "select",
                                name: "diagnosesSection",
                                label: "Diagnoses Section",
                                pickList: "DiagnosisCollection",
                                extraClasses: ["items-shown-md"],
                                size: 10,
                                required: true,
                                srOnlyLabel: true
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "listItems",
                                extraClasses: ["items-shown-md"]
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-1"],
                    items: [{
                        control: 'popover',
                        label: "Add Other",
                        name: "add-other-diagnosis-popover",
                        header: "Add Other Diagnosis",
                        title: "Press enter to add other diagnoses.",
                        size: 'sm',
                        options: {
                            placement: 'left'
                        },
                        extraClasses: ["btn-default", "offset-btn-md"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-other-diagnosis"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-10", "bottom-pad-xs"],
                                items: [{
                                    control: "input",
                                    name: "addOtherDiagnosisSearchString",
                                    placeholder: "Search for diagnosis",
                                    label: "Add Other Diagnosis Input",
                                    srOnlyLabel: true,
                                    title: "Please enter in a diagnosis to filter."
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-2", "bottom-pad-xs"],
                                items: [{
                                    control: "button",
                                    type: "button",
                                    label: "",
                                    size: 'sm',
                                    extraClasses: ["btn-default", "btn-block"],
                                    icon: "fa-search",
                                    title: "Press enter to search",
                                    id: "add-other-diagnosis-search-btn"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "select",
                                    name: "addOtherDiagnosisSelect",
                                    srOnlyLabel: true,
                                    label: "Add Other Diagnosis Selection",
                                    size: 10,
                                    extraClasses: ["items-shown-md"],
                                    title: "Press eneter to browse through select options."
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["text-right"],
                                    items: [{
                                        control: "button",
                                        type: "button",
                                        label: "Cancel",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to cancel.",
                                        id: "add-other-diagnosis-cancel-btn"
                                    }, {
                                        control: "button",
                                        type: "button",
                                        label: "Add",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to add.",
                                        id: "add-other-diagnosis-add-btn"
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectedDiagnosesContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "nestedCommentBox",
                        name: "DiagnosisCollection",
                        label: "Selected Diagnosis",
                        itemColumn: {
                            columnTitle: "Selected Diagnosis",
                            columnClasses: ["percent-width-55"]
                        },
                        commentColumn: {
                            columnTitle: "Comments",
                            columnClasses: ["percent-width-10", "text-center"]
                        },
                        additionalColumns: [{
                            columnClasses: ["percent-width-15", "text-center"],
                            columnTitle: "Add to Condition List",
                            name: "addToCL",
                            control: 'checkbox',
                            disabled: true
                        }, {
                            columnClasses: ["percent-width-15", "text-center"],
                            columnTitle: "Primary Diagnoses",
                            name: "primary",
                            control: 'checkbox'
                        }],
                        attributeMapping: {
                            collection: "listItems",
                            commentsCollection: "comments",
                            comment: "commentString",
                            value: "value",
                            label: "label",
                            unique: "id",
                            author: "author",
                            timeStamp: "timeStamp"
                        }
                    }]
                }]
            };

            var serviceConnectedContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    extraClasses: ["row", "row-eq-height"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-6", "well", "well-flex"],
                        template: [
                            '<p>Service Connected: {{serviceConnected}}%</p>',
                            '<ul><li>Vitamin Deficiency (10% SC)</li>',
                            '<li>Hemorrhoids (10% SC)</li>',
                            '<li>Inguinal Hernia (0% SC)</li>',
                            '<li>Gastric Ulcer (20% SC)</li>',
                            '</ul>'
                        ].join("\n")
                    }, {
                        control: "container",
                        extraClasses: ["col-md-6", "well", "well-flex"],
                        items: [{
                            control: "container",
                            tagName: "fieldset",
                            template: "<legend>Visit Related To</legend>",
                            items: [{
                                control: "radio",
                                name: "serviceConnectedCondition",
                                label: "Service Connected Condition",
                                options: [{
                                    label: "Yes",
                                    value: 'true'
                                }, {
                                    label: "No",
                                    value: 'false'
                                }]
                            }, {
                                control: "radio",
                                name: "combatVet",
                                label: "Combat Vet (Combat Related)",
                                title: "Combat Vet (Combat Related)",
                                options: [{
                                    label: "Yes",
                                    value: 'true'
                                }, {
                                    label: "No",
                                    value: 'false'
                                }]
                            }, {
                                control: "radio",
                                name: "agentOrange",
                                label: "Agent Orange Exposure",
                                title: "Agent Orange Exposure",
                                options: [{
                                    label: "Yes",
                                    value: 'true'
                                }, {
                                    label: "No",
                                    value: 'false'
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectedConnectedHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12","bottom-pad-xs"],
                    template: '<h5>Service Connected</h5>'
                }, serviceConnectedContainer]
            };

            var visitTypeHeaderContainer = {
                control: "container",
                extraClasses: ["row", "bottom-pad-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Visit Type</h5>'
                }]
            };

            var visitTypeContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-9"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "drilldownChecklist",
                            selectOptions: {
                                control: "select",
                                name: "visitTypeSelection",
                                label: "Type of Visit",
                                pickList: "visitCollection",
                                extraClasses: ["items-shown-md"],
                                size: 10,
                                required: true,
                                srOnlyLabel: true
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "items",
                                extraClasses: ["items-shown-md", "visit-checklist"]
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-3"],
                    items: [{
                        control: 'popover',
                        label: "Add Modifiers...",
                        name: "add-visit-modifiers-popover",
                        title: "Add modifiers.",
                        options: {
                            placement: 'left'
                        },
                        extraClasses: ["btn-default", "btn-sm", "btn-block"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-modifiers"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "multiselectSideBySide",
                                    name: "availableVistModifiers",
                                    label: "Modifiers",
                                    size: "small"
                                }],
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["text-right"],
                                    items: [{
                                        control: "button",
                                        type: "button",
                                        label: "Close",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to close.",
                                        id: "add-visit-modifiers-close-btn"
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["well", "read-only-well"],
                        template: Handlebars.compile([
                            '<ul class="list-inline">{{#each selectedModifiersForVist}}<li>{{this}}</li>{{/each}}</ul>'
                        ].join("\n")),
                        modelListeners: ["selectedModifiersForVist"]
                    }]
                }]
            };

            var providersEncounterContainer = {
                control: "multiselectSideBySide",
                name: "providerList",
                label: "Providers",
                attributeMapping: {
                    unique: 'name'
                }
            };

            var primaryProviderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "select",
                        name: "selectedPrimaryProvider",
                        label: "Primary provider",
                        picklist: new Backbone.Collection([{
                            label: "Me Myself and I",
                            name: "me"
                        }]),
                        attributeMapping: {
                            value: 'name'
                        }
                    }]
                }]
            };

            var procedureHeaderContainer = {
                control: "container",
                extraClasses: ["row", "bottom-pad-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Procedure</h5>'
                }]
            };

            var procedureContainer = {
                control: "container",
                extraClasses: ["row", "bottom-pad-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-11"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "drilldownChecklist",
                            selectOptions: {
                                control: "select",
                                name: "procedureSection",
                                label: "Procedure Section",
                                pickList: "ProcedureCollection",
                                extraClasses: ["items-shown-md"],
                                size: 10,
                                required: true,
                                srOnlyLabel: true
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "listItems",
                                extraClasses: ["items-shown-md"],
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-1"],
                    items: [{
                        control: 'popover',
                        label: "Add Other",
                        name: "add-other-procedure-popover",
                        header: "Add Other Procedure",
                        title: "Press enter to add other procedure.",
                        size: 'sm',
                        options: {
                            placement: 'left'
                        },
                        extraClasses: ["btn-default", "offset-btn-md"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-other-procedure"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-10", "bottom-pad-xs"],
                                items: [{
                                    control: "input",
                                    name: "addOtherProcedureSearchString",
                                    placeholder: "Search for procedure",
                                    label: "Add Other Procedure Input",
                                    srOnlyLabel: true,
                                    title: "Please enter in a procedure to filter."
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-2", "bottom-pad-xs"],
                                items: [{
                                    control: "button",
                                    type: "button",
                                    label: "",
                                    size: 'sm',
                                    extraClasses: ["btn-default", "btn-block"],
                                    icon: "fa-search",
                                    title: "Press enter to search",
                                    id: "add-other-procedure-search-btn"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "select",
                                    name: "addOtherProcedureSelect",
                                    srOnlyLabel: true,
                                    label: "Add Other Procedure Selection",
                                    size: 10,
                                    extraClasses: ["items-shown-md"],
                                    title: "Press eneter to browse through select options."
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["text-right"],
                                    items: [{
                                        control: "button",
                                        type: "button",
                                        label: "Cancel",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to cancel.",
                                        id: "add-other-procedure-cancel-btn"
                                    }, {
                                        control: "button",
                                        type: "button",
                                        label: "Add",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to add.",
                                        id: "add-other-procedure-add-btn"
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectedProceduresContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "nestedCommentBox",
                        name: "ProcedureCollection",
                        label: "Selected Procedures",
                        extraClasses: ["nested-comment-box", "nested-comment-box-alt", "faux-table-row-container"],
                        itemColumn: {
                            columnTitle: "Selected Procedures",
                            columnClasses: ["percent-width-55"]
                        },
                        commentColumn: {
                            columnTitle: "Comments",
                            columnClasses: ["percent-width-8", "text-center"]
                        },
                        additionalColumns: [{
                            columnTitle: "Quantity",
                            columnClasses: ["percent-width-8", "text-center"],
                            control: 'input',
                            extraClasses: ["input-sm", "percent-width-60", "center-margin"],
                            name: "quantity",
                            placeholder: "1",
                            srOnlyLabel: true,
                            title: "Please enter in quantity"
                        }, {
                            columnClasses: ["percent-width-14","text-center"],
                            columnTitle: "Provider",
                            control: "select",
                            extraClasses: ["input-sm", "percent-width-90", "no-margin"],
                            name: "provider",
                            srOnlyLabel: true,
                            title: "Please enter in provider.",
                            picklist: new Backbone.Collection([{
                                value: 'provider1',
                                label: 'Provider 1'
                            }, {
                                value: 'provider2',
                                label: 'Provider 2'
                            }])
                        }, {
                            columnTitle: "Add Modifiers",
                            columnClasses: ["percent-width-10","text-center"],
                            title: "Press enter to add modifiers.",
                            control: 'container',
                            items: [{
                                control: 'popover',
                                extraClasses: ["icon-btn", "icon-btn-mini"],
                                name: "addModifiers",
                                label: "Add Modifiers...",
                                options: {
                                    trigger: "click",
                                    header: "Add Modifiers"
                                },
                                items: [{
                                    control: "container",
                                    extraClasses: ["row"],
                                    items: [{
                                        control: "multiselectSideBySide",
                                        name: "ProcedureCollection",
                                        label: "Modifiers",
                                        attributeMapping: {
                                            unique: 'id',
                                            value: 'booleanValue',
                                            label: 'description'
                                        }
                                    }]
                                }]
                            }]
                        }],
                        attributeMapping: {
                            collection: "listItems",
                            commentsCollection: "comments",
                            comment: "commentString",
                            value: "value",
                            label: "label",
                            unique: "id",
                            author: "author",
                            timeStamp: "timeStamp"
                        }
                    }]
                }]
            };
            // *********************************************** END OF CONTAINERS ****************************************

            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F413Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [diagnosisHeaderContainer, diagnosesContainer, selectedDiagnosesContainer, selectedConnectedHeaderContainer, visitTypeHeaderContainer, visitTypeContainer, providersEncounterContainer, primaryProviderContainer, procedureHeaderContainer, procedureContainer, selectedProceduresContainer]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "button",
                    id: "cancel-btn",
                    label: "Cancel",
                    title: "Press enter to cancel.",
                    extraClasses: ["btn-default", "btn-sm"],
                    name: "cancel"
                }, {
                    control: "button",
                    id: "ok-btn",
                    label: "OK",
                    title: "Press enter to confirm.",
                    extraClasses: ["btn-primary", "btn-sm"],
                    name: "ok"
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {}
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** VIEWS **********************************************
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
                    'VisitChecklistCheckboxes': '.visit-checklist input',
                    'SearchAddOtherDiagnosis': '.add-other-diagnosis-popover #add-other-diagnosis-search-btn',
                    'SelectAddOtherDiagnosis': '.add-other-diagnosis-popover #addOtherDiagnosisSelect',
                    'CancelAddOtherDiagnosis': '.add-other-diagnosis-popover #add-other-diagnosis-cancel-btn',
                    'AddOtherDiagnosisPopover': '.add-other-diagnosis-popover #add-other-diagnosis-add-btn',

                    'SearchAddOtherProcedure': '.add-other-procedure-popover #add-other-procedure-search-btn',
                    'SelectAddOtherProcedure': '.add-other-procedure-popover #addOtherProcedureSelect',
                    'CancelAddOtherProcedure': '.add-other-procedure-popover #add-other-procedure-cancel-btn',
                    'AddOtherProcedurePopover': '.add-other-procedure-popover #add-other-procedure-add-btn',

                    'AddVisitModifiersPopover': '.add-visit-modifiers-popover',
                    'ClosAddVisitModifiers': '.add-visit-modifiers-popover #add-visit-modifiers-close-btn',
                },
                fields: F413Fields,
                modelEvents: {
                    'change': function(model) {
                        console.log("F413 Model Change!!!");
                        console.log(arguments);
                        console.log(this.model.attributes);
                    },
                    'change:providerList': function() {
                        this.$('.selectedPrimaryProvider').trigger("control:picklist:set", new Backbone.Collection(this.model.get('providerList').where({
                            value: true
                        })));
                    },
                    'change:availableVistModifiers': function() {
                        this.model.set('selectedModifiersForVist', _.map(this.model.get('availableVistModifiers').where({
                            value: true
                        }), function(model) {
                            return model.get('label');
                        }));
                    }
                },
                events: {
                    // "submit": function(e) {
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
                    "click @ui.ClosAddVisitModifiers": function(e) {
                        e.preventDefault();
                        this.$(this.ui["AddVisitModifiersPopover"]).trigger('control:popover:hidden', true);
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
                    // "click @ui.VisitChecklistCheckboxes": function(e) {
                    //     e.preventDefault();
                    //     this.model.get('availableVistModifiers').add({
                    //         name: 'modifier',
                    //         label: 'A Modifier',
                    //         value: false
                    //     });
                    // }
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
                        this.$(this.ui["SelectAddOther" + context]).trigger("control:picklist:set", [
                            [{
                                label: searchString + ' 1',
                                value: 'opt1'
                            }, {
                                label: searchString + ' 2',
                                value: 'opt2'
                            }]
                        ]);
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
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel({
                serviceConnected: '40',
                ratedDisabilities: 'Combat',
                selectedPrimaryProvider: "me",
                providerList: new Backbone.Collection([{
                    name: 'me',
                    label: 'Me Myself and I',
                    value: false
                }, {
                    name: 'provider2',
                    label: 'Provider 2',
                    value: false
                }, {
                    name: 'provider3',
                    label: 'Provider 3',
                    value: false
                }, {
                    name: 'provider4',
                    label: 'Provider 4',
                    value: false
                }, {
                    name: 'provider5',
                    label: 'Provider 5',
                    value: false
                }, {
                    name: 'provider6',
                    label: 'Provider 6',
                    value: false
                }, {
                    name: 'provider7',
                    label: 'Provider 7',
                    value: false
                }, {
                    name: 'provider8',
                    label: 'Provider 8',
                    value: false
                }, {
                    name: 'provider9',
                    label: 'Provider 9',
                    value: false
                }, {
                    name: 'provider10',
                    label: 'Provider 10',
                    value: false
                }]),
                availableVistModifiers: new Backbone.Collection([{
                    name: 'modifier1',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier2',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier3',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier4',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier5',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier6',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier7',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier8',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier9',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier10',
                    label: 'Modifier name',
                    value: false
                }]),
                visitTypeSelection: "opt1",
                visitCollection: new Backbone.Collection([{
                    label: "Office Visit - New Pt.",
                    value: "opt1",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Focused, HX & Exam 99201',
                        value: true
                    }, {
                        name: 'opt2',
                        label: 'Expanded, HX & Exam 99202',
                        value: true
                    }, {
                        name: 'opt3',
                        label: 'Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Office Visit - Est Pt.",
                    value: "opt2",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Est Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Est Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Est Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Est Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Office Consult New",
                    value: "opt3",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Office Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Office Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Office Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Office Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Prev Medicine Svcs",
                    value: "opt4",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Prev Medicine Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Prev Medicine Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Prev Medicine Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Prev Medicine Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Counseling / Psychotherapy",
                    value: "opt5",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Counseling Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Counseling Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Psychotherapy Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Psychotherapy Comprehensive, Moderate 99204',
                        value: false
                    }])
                }]),
                diagnosesSection: "conditionListItems",
                addOtherDiagnosisSearchString: "",
                DiagnosisCollection: new Backbone.Collection([{
                    value: "conditionListItems",
                    label: "Condition List Items",
                    listItems: new Backbone.Collection([{
                        id: "group1-diagnosis1",
                        label: "Hypertension",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis2",
                        label: "Hyperlipidemia",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }, {
                        id: "group1-diagnosis3",
                        label: "Acute Myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group1-diagnosis4",
                        label: "Chronic Systolic Heart failure",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }, {
                        id: "group1-diagnosis5",
                        label: "Diabetes Mellitus Type II or unspecified",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group1-diagnosis6",
                        label: "Adverse effect of Calcium-Channel Blockers, Initial Encount…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis6",
                        label: "Acute myocardial infarction, unspecified site, episode of car…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis7",
                        label: " Diabetes Mellitus Type III",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis8",
                        label: "Adverse effect of Calcium-Channel Blockers, Initial Encount…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis9",
                        label: "Hypertension",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis10",
                        label: "Hyperlipidemia",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis11",
                        label: "Chronic Systolic Heart failure",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis12",
                        label: "Adverse effect of Calcium-Channel Blockers, Initial Encount…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }])
                }, {
                    value: "infectiousDisease",
                    label: "Infectious Disease",
                    listItems: new Backbone.Collection([{
                        id: "group2-diagnosis1",
                        label: "Infectious Disease Diagnosis 1",
                        value: false,
                        addToCL: true,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group2-diagnosis2",
                        label: "Infectious Disease Diagnosis 2",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }])
                }, {
                    value: "neoplasm",
                    label: "Neoplasm",
                    listItems: new Backbone.Collection([{
                        id: "group3-diagnosis1",
                        label: "Neoplasm Procedure 1",
                        value: false,
                        addToCL: true,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group3-diagnosis2",
                        label: "Neoplasm Procedure 2",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }])
                }]),
                procedureSection: "procedureABC",
                addOtherProcedureSearchString: "",
                ProcedureCollection: new Backbone.Collection([{
                    value: "procedureABC",
                    label: "Procedure ABC",
                    listItems: new Backbone.Collection([{
                        id: "group1-procedure1",
                        label: "Item 12345",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, {
                        id: "group1-procedure2",
                        label: "Item 23456",
                        value: false,
                        quantity: 2,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "I am a demo comment string.",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }, {
                        id: "group1-procedure3",
                        label: "Item 34567",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-procedure4",
                        label: "Item 45678",
                        value: false,
                        quantity: 8,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }, {
                        id: "group1-procedure5",
                        label: "Item 56789",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, ])
                }, {
                    value: "procedureDEF",
                    label: "Procedure DEF",
                    listItems: new Backbone.Collection([{
                        id: "group2-procedure1",
                        label: "Item 98765",
                        value: false,
                        quantity: 3,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, {
                        id: "group2-procedure2",
                        label: "Item 87654",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }])
                }, {
                    value: "procedureGHI",
                    label: "Procedure GHI",
                    listItems: new Backbone.Collection([{
                        id: "group3-procedure1",
                        label: "Item 19234",
                        value: false,
                        quantity: 3,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, {
                        id: "group3-procedure2",
                        label: "Item 34254",
                        value: false,
                        quantity: 4,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }])
                }])
            });
            var workflowOptions = {
                size: "large",
                title: "Encounter Form for Eight, Patient (MM dd, YYYY @00:00)",
                showProgress: false,
                keyboard: true,
                steps: [{
                    view: formView,
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            $('body').addClass('encounters-container');
            $('#mainWorkflow').one('hidden.bs.modal', function(e) {
                $('body').removeClass('encounters-container');
            });
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F413;
});
