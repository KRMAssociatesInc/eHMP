define([
    'moment',
    'handlebars',
    'hbs!app/applets/notesTray/writeback/formHeaderTemplate',
], function(moment, Handlebars, formHeaderTemplate) {
    return {
        form: [{
            control: "container",
            extraClasses: ["modal-body"],
            items: [{
                control: "container",
                extraClasses: ["container-fluid"],
                items: [{
                    //header bar with gear menu
                    control: "container",
                    extraClasses: ["row"],
                    template: formHeaderTemplate
                },
                {
                    //title container
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-12"],
                        template: Handlebars.compile('<p class="required-note">* indicates a required field.</class></p>'),
                        items: [{
                            control: "select",
                            name: "documentDefUidUnique",
                            id: "documentDefUidUnique",
                            label: "Title",
                            title: "Press enter to browse through select options",
                            pickList: [],
                            showFilter: true,
                            groupEnabled: true,
                            required: true
                        }]
                    }]
                }, {
                    //date / time container
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "datepicker",
                            id: "derivReferenceDate",
                            name: "derivReferenceDate",
                            title: "Please enter in a date in the following format, MM/DD/YYYY",
                            label: "Date",
                            required: true,
                            options: {
                                format: "mm/dd/yyyy",
                                endDate: moment().format("MM/DD/YYYY")
                            }
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "timepicker",
                            id: "derivReferenceTime",
                            title: "Please enter in a time in the following format, HH:MM",
                            label: "Time",
                            placeholder: "HH:mm",
                            name: "derivReferenceTime",
                            required: true
                        }]
                    }]
                }, {
                    //notes body container
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-12"],
                        items: [{
                            control: "textarea",
                            id: "derivBody",
                            name: "text.0.content",
                            title: "Please enter in note details",
                            label: "Note",
                            placeholder: "",
                            rows: 9,
                            required: true,
                            disabled: true,
                            maxlength: "1000000" // 1 Megabyte is the maximum for the RDK
                        }]
                    }]
                }]
            }]
        }, {
            //buttons container
            control: "container",
            extraClasses: ["modal-footer"],
            items: [{
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-3"],
                    template: Handlebars.compile('<p><span id="notes-saved-at-view2">{{#if lastSavedDisplayTime}}Saved {{formatRelativeTime lastSavedDisplayTime}}{{/if}}</span></p>'),
                    modelListeners: ["lastSavedDisplayTime"]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-9"],
                    items: [{
                        label: "Close",
                        type: "button",
                        control: "button",
                        name: "formStatus",
                        id: "close-form-btn",
                        extraClasses: ["btn-primary", "btn-sm"],
                        title: "Press enter to save and close note"
                    }, {
                        label: "Sign",
                        type: "submit",
                        control: "button",
                        id: "sign-form-btn",
                        title: "Press enter to sign note",
                        extraClasses: ["btn-primary", "btn-sm"]
                    }]
                }]
            }]
        }]
    };
});
