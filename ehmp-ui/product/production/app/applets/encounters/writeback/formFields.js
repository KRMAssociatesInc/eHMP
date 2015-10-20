define([
    'moment',
    'handlebars'
], function(moment, Handlebars) {
    

    var defaultVisitRelated = new Backbone.Collection([
            {
                id: 'service-connected',
                name: 'service-connected',
                label: 'Service Connected',
                value: undefined,
                disabled: false
            }, {
                id: 'combat-vet',
                name: 'combat-vet',
                label: 'Combat Veteran',
                value: undefined,
                disabled: false
            }, {
                id: 'agent-orange',
                name: 'agent-orange',
                label: 'Agent Orange',
                value: undefined,
                disabled: false
            }, {
                id: 'ionizing-radiation',
                name: 'ionizing-radiation',
                label: 'Ionizing Radiation',
                value: undefined,
                disabled: false
            }, {
                id: 'sw-asia',
                name: 'sw-asia',
                label: 'Southwest Asia Conditions',
                value: undefined,
                disabled: false
            }, {
                id: 'shad',
                name: 'shad', //Might not be the right abbreviation
                label: 'Shipboard Hazard and Defense',
                value: undefined,
                disabled: false
            }, {
                id: 'mst',
                name: 'mst',
                label: 'Military Sexual Trauma',
                value: undefined,
                disabled: false
            }, {
                id: 'head-neck-cancer',
                name: 'head-neck-cancer',
                label: 'Head and Neck Cancer',
                value: undefined,
                disabled: false
    }]);



    var diagnosisHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Diagnoses</h5>'
                }]
            };

            var diagnosesContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "drilldownChecklist",
                        selectOptions: {
                            control: "select",
                            name: "diagnosesSection",
                            label: "Diagnoses Section",
                            pickList: "DiagnosisCollection",
                            size: 10
                        },
                        checklistOptions: {
                            control: "checklist",
                            name: "listItems",
                            extraClasses: ["scroll"]
                        }
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-3"],
                    items: [{
                        control: 'popover',
                        label: "Add Other Diagnosis...",
                        name: "add-other-diagnosis-popover",
                        title: "Press enter to add other diagnoses.",
                        options: {
                            placement: 'right'
                        },
                        extraClasses: ["btn-default", "btn-sm"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-other-diagnosis"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-10"],
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
                                extraClasses: ["col-xs-2"],
                                items: [{
                                    control: "button",
                                    type: "button",
                                    label: "",
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
                                    title: "Press enter to browse through select options."
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

            var selectedDiagnosesHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h6>Selected Diagnoses</h6>'
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
                            columnTitle: "Diagnosis",
                            columnClasses: ["percent-width-55"]
                        },
                        commentColumn: {
                            columnTitle: "Comments",
                            columnClasses: ["percent-width-15"]
                        },
                        additionalColumns: [{
                            columnClasses: ["percent-width-10"],
                            columnTitle: "Add to Condition List",
                            name: "addToCL",
                            control: 'checkbox'
                        }, {
                            columnClasses: ["percent-width-15"],
                            columnTitle: "Primary",
                            name: "primary",
                            control: 'button',
                            extraClasses: ["icon-btn", "icon-btn-mini"],
                            type: "button",
                            label: "Primary",
                            title: "This diagnosis is set as primary"
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

            var selectedConnectedHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Service Connected</h5><h6>Service Connection & Rated Disabilities</h6>'
                }]
            };

            var serviceConnectedContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "container",
                        extraClasses: ["well", "read-only-well"],
                        modelListeners: ['serviceConnected', 'ratedDisabilities'],
                        template: '<p>Service Connected: {{serviceConnected}}</p><p>Rated Disabilities: {{ratedDisabilities}}</p>'
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "container",
                        extraClasses: ["well", "read-only-well"],
                        items: [{
                            name: "yesNoChecklist",
                            label: "Visit Related To",
                            control: "yesNoChecklist",
                            collection: defaultVisitRelated
                        }]
                    }]
                }]
            };

            var visitTypeHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
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
                    extraClasses: ["col-md-6"],
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
                                size: 10
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "items",
                                extraClasses: ["scroll", "visit-checklist"]
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "multiselectSideBySide",
                        name: "availableVistModifiers",
                        label: "Modifiers",
                    }]
                }]
            };

            var providersEncounterHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h6>Providers for this encounter</h6>'
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
                        pickList: []
                    }]
                }]
            };

            var procedureHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Procedure</h5>'
                }]
            };

            var procedureContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "drilldownChecklist",
                        selectOptions: {
                            control: "select",
                            name: "procedureSection",
                            label: "Procedure Section",
                            pickList: "ProcedureCollection",
                            size: 10
                        },
                        checklistOptions: {
                            control: "checklist",
                            name: "listItems",
                            extraClasses: ["scroll"]
                        }
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-3"],
                    items: [{
                        control: 'popover',
                        label: "Add Other Procedure...",
                        name: "add-other-procedure-popover",
                        title: "Press enter to add other procedure.",
                        options: {
                            placement: 'right'
                        },
                        extraClasses: ["btn-default", "btn-sm"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-other-procedure"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-10"],
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
                                extraClasses: ["col-xs-2"],
                                items: [{
                                    control: "button",
                                    type: "button",
                                    label: "",
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
                                    title: "Press enter to browse through select options."
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

            var selectedProceduresHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h6>Selected Procedures</h6>'
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
                        label: "Selected Procedure",
                        extraClasses: ["nested-comment-box", "nested-comment-box-alt", "faux-table-row-container"],
                        itemColumn: {
                            columnTitle: "Procedure",
                            columnClasses: ["percent-width-40"]
                        },
                        commentColumn: {
                            columnTitle: "Comments",
                            columnClasses: ["percent-width-10", "text-center"]
                        },
                        additionalColumns: [{
                            columnTitle: "Quantity",
                            columnClasses: ["percent-width-13", "text-center"],
                            control: 'input',
                            extraClasses: ["input-sm", "percent-width-60", "center-margin"],
                            name: "quantity",
                            placeholder: "1",
                            srOnlyLabel: true,
                            title: "Please enter in quantity"
                        }, {
                            columnClasses: ["percent-width-16"],
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
                            columnClasses: ["percent-width-17"],
                            title: "Press enter to add modifiers.",
                            control: 'button',
                            extraClasses: ["btn-xs", "btn-link"],
                            name: "addModifiers",
                            type: "button",
                            label: "Add Modifiers..."
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

   var encounterFormFields = [{
        control: "container",
        extraClasses: ["modal-body"],
        items: [{
            control: "container",
            extraClasses: ["scroll-enter-form"],
            items: [diagnosisHeaderContainer, 
            diagnosesContainer, 
            selectedDiagnosesHeaderContainer, 
            selectedDiagnosesContainer, 
            selectedConnectedHeaderContainer, 
            serviceConnectedContainer, 
            visitTypeHeaderContainer, 
            visitTypeContainer, 
            providersEncounterHeaderContainer, 
            providersEncounterContainer, 
            primaryProviderContainer, 
            procedureHeaderContainer, 
            procedureContainer, 
            selectedProceduresHeaderContainer, 
            selectedProceduresContainer
            ]
        }]
    }, {
        control: "container",
        extraClasses: ["modal-footer"],
        items: [{
            control: "button",
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

return encounterFormFields;

});