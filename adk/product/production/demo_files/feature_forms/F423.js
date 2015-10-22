define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    var F423 = {
        createForm: function() {
            var rowSubheader1 = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: 'container',
                    extraClasses: ["col-xs-12"],
                    template: Handlebars.compile('<p>* indidcates a required field</p>')
                }]
            }

            var rowSubheader = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-5"],
                        items: [{
                            control: "datepicker",
                            name: "dateTaken",
                            title: "Please enter in a date in the following format, MM/DD/YYYY",
                            label: "Date Taken",
                            required: true
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-5"],
                        items: [{
                            control: "timepicker",
                            name: "time-taken",
                            title: "Please enter in a time in the following format,HH:MM",
                            label: "Time Taken"
                        }]

                    }, {
                        control: "container",
                        extraClasses: ["col-xs-2"],
                        items: [{
                            control: "checkbox",
                            title: "To select this checkbox, press the spacebar",
                            name: "facility-name-pass-po",
                            label: "Pass",
                            extraClasses: ["pull-right"]
                        }]
                    }, {
                        control: "spacer"
                    }]
                }]
            };

            var expandCollapseAll = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: 'button',
                        type: 'button',
                        label: 'Expand All',
                        id: 'expandCollapseAll',
                        name: 'expandCollapseAll',
                        extraClasses: ["pull-right", "icon-btn"],
                        title: "Press enter to expand all vitals"
                    }]
                }]

            };

            var bloodPressureHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-8", "bpInput"],
                    items: [{
                        control: "input",
                        name: "bp-value-po",
                        label: "Blood Pressure",
                        title: "Please enter in a numeric value",
                        units: "mm[HG]"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-3"],
                    items: [{
                        control: "radio",
                        name: "bp-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "bp-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "bp-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var bloodPressureBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "bp-location-po",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    name: "bp-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    label: "Cuff Size",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "bp-cuff-size-po",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "bp-position-po",
                    extraClasses: ["col-xs-6"],
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
            };

            var bloodPressureSection = {
                control: 'collapsibleContainer',
                name: 'bpSection',
                headerItems: [{
                    control: "container",
                    extraClasses: ["col-xs-8", "bpInput"],
                    items: [{
                        control: "input",
                        name: "bp-value-po",
                        label: "Blood Pressure",
                        title: "Please enter in a numeric value",
                        units: "mm[HG]"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-3"],
                    items: [{
                        control: "radio",
                        name: "bp-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "bp-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "bp-refused",
                            label: "Refused"
                        }]
                    }]
                }],
                collapseItems: [bloodPressureBody]
            };

            var temperatureHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        name: "temperature-value-po",
                        label: "Temperature",
                        title: "Please enter in a numeric value",
                        units: [{
                            label: "F",
                            value: "f",
                            title: "fahrenheit"
                        }, {
                            label: "C",
                            value: "c",
                            title: "celcius"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "temperature-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "temperature-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "temperature-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var temperatureBody = {
                control: "container",
                extraClasses: ["col-xs-12"],
                items: [{
                    control: "select",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "temperature-location-po",
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
            };

            var temperatureSection = {
                control: 'collapsibleContainer',
                name: 'temperatureSection',
                headerItems: [temperatureHeader],
                collapseItems: [temperatureBody]
            };

            var pulseHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        label: "Pulse",
                        name: "pulse-value-po",
                        units: "/min",
                        title: "Please enter in a numeric value"
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "pulse-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "pulse-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "pulse-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var pulseBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "pulse-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    name: "pulse-position-po",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    name: "pulse-site-po",
                    label: "Site",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    name: "pulse-location-po",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
            };

            var pulseSection = {
                control: 'collapsibleContainer',
                name: 'pulseSection',
                headerItems: [pulseHeader],
                collapseItems: [pulseBody]
            };

            var respirationHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        label: "Respiration",
                        units: "/min",
                        title: "Please enter in a numeric value",
                        name: "respiration-measurement-po"
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "respiration-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "respiration-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "respiration-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var respirationBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "respiration-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    name: "respiration-position-po",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
            };

            var respirationSection = {
                control: 'collapsibleContainer',
                name: 'respirationSection',
                headerItems: [respirationHeader],
                collapseItems: [respirationBody]
            };

            var pulseOximetryHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        name: "po-concentration-po",
                        label: "Pulse Oximetry",
                        title: "Please enter in a numeric value",
                        units: "%"
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "po-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "po-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "po-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var pulseOximetryBody = {
                control: "container",
                items: [{
                    control: "input",
                    label: "Supplimental Oxygen Flow Rate",
                    name: "po-measurement-po",
                    units: "(liters/minute)",
                    title: "Please enter in a numeric value",
                    extraClasses: ["col-xs-6"],
                    disabled: true
                }, {
                    control: "select",
                    label: "Method",
                    name: "po-method-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
            };

            var pulseOximetrySection = {
                control: 'collapsibleContainer',
                name: 'poSection',
                headerItems: [pulseOximetryHeader],
                collapseItems: [pulseOximetryBody]
            };

            var heightHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        name: "height-value-po",
                        label: "Height",
                        title: "Please enter in a numeric value",
                        units: [{
                            label: "in",
                            value: "in",
                            title: "inches"
                        }, {
                            label: "cm",
                            value: "cm",
                            title: "centimeters"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "height-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "height-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "height-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var heightBody = {
                control: "container",
                extraClasses: ["col-xs-12"],
                items: [{
                    control: "select",
                    label: "Quality",
                    name: "height-quality-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
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
            };

            var heightSection = {
                control: 'collapsibleContainer',
                name: 'heightSection',
                headerItems: [heightHeader],
                collapseItems: [heightBody]
            };

            var weightHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        name: "weight-value-po",
                        label: "Weight",
                        title: "Please enter in a numeric value",
                        units: [{
                            label: "lb",
                            value: "lb",
                            title: "lb Units"
                        }, {
                            label: "kg",
                            value: "kg",
                            title: "kg Units"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "weight-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "weight-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "weight-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var weightBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "weight-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    name: "weight-quality-po",
                    label: "Quality",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
            };

            var weightSection = {
                control: 'collapsibleContainer',
                name: 'weightSection',
                headerItems: [weightHeader],
                collapseItems: [weightBody]
            };

            var painHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-8"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "input",
                            name: "pain-value-po",
                            label: "Pain",
                            placeholder: "0-10",
                            title: "Please enter in a numeric value for pain from 0 to 10, 0 being no pain and 10 being the greatest amount of pain"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "checkbox",
                            label: "Unable to Respond",
                            name: "pain-checkbox-po",
                            title: "To select this checkbox, press the spacebar"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-3"],
                    items: [{
                        control: "radio",
                        name: "pain-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "pain-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "pain-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var painSection = {
                control: 'collapsibleContainer',
                name: 'painSection',
                headerItems: [painHeader],
                // collapseItems: [painBody]
            };

            var circumferenceHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        label: "Circumference/Girth",
                        name: "cg-value-po",
                        title: "Please enter in a numeric value",
                        units: [{
                            label: "in",
                            value: "in",
                            title: "in Units"
                        }, {
                            label: "cm",
                            value: "cm",
                            title: "cm Units"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ['col-xs-3'],
                    items: [{
                        control: "radio",
                        name: "cg-radio-po",
                        title: "Press up and down arrows keys to view options and press spacebar to select",
                        options: [{
                            value: "cg-unavailable",
                            label: "Unavailable"
                        }, {
                            value: "cg-refused",
                            label: "Refused"
                        }]
                    }]
                }]
            };

            var circumferenceBody = {
                control: "container",
                items: [{
                    control: "select",
                    name: "cg-site-po",
                    label: "Site",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
                }, {
                    control: "select",
                    label: "Location",
                    name: "cg-location-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
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
            };

            var circumferenceSection = {
                control: 'collapsibleContainer',
                name: 'cgSection',
                headerItems: [circumferenceHeader],
                collapseItems: [circumferenceBody]
            };

            var F423Fields = [{
                //*************************** Modal Body START ***************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [rowSubheader1, rowSubheader, expandCollapseAll, bloodPressureSection, temperatureSection, pulseSection,
                        respirationSection, pulseOximetrySection, heightSection, weightSection, painSection, circumferenceSection
                    ]
                }]

            }, { //*************************** Modal Footer START ***************************
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
                            extraClasses: ["btn-primary", "btn-sm"],
                            type: "button",
                            label: "Delete",
                            title: "Press enter to delete vital"
                        }, {
                            control: "button",
                            id: "form-close-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            type: 'button',
                            title: "Press enter to close vital"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Add",
                            type: "button",
                            id: "form-add-btn",
                            title: "Press enter to add vital"
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    facilityName: 'D.C. VA Hospital',
                    labOrderDate: '5/5/2015',
                    labOrderTime: '14:40',
                    dateTaken: moment().format('MM/DD/YYYY'),
                },
                errorModel: new Backbone.Model(),
                validate: function(attributes, options) {
                    this.errorModel.clear();

                    var painValue = this.get("pain-value-po");
                    var bpValue = this.get("bp-value-po");
                    var tempValue = this.get("temperature-value-po");
                    var pulseValue = this.get("pulse-value-po");
                    var respValue = this.get("respiration-measurement-po");
                    var poValue = this.get("po-concentration-po"); 
                    var heightValue = this.get("height-value-po");
                    var weightValue = this.get("weight-value-po");
                    var cgValue = this.get("cg-value-po");

                    if (tempValue !== undefined) {
                        tempValue = tempValue.substring(0, tempValue.length - 1);
                    }
                    if (heightValue !== undefined) {
                        heightValue = heightValue.substring(0, heightValue.length - 2);
                    }
                    if (weightValue !== undefined) {
                        weightValue = weightValue.substring(0, weightValue.length - 2);
                    }
                    if (cgValue !== undefined) {
                        cgValue = cgValue.substring(0, cgValue.length - 2);
                    }


                    if (isNaN(bpValue) && bpValue !== undefined) {
                        this.errorModel.set({
                            'bp-value-po': "Not a number!"
                        });
                    }
                    if (isNaN(tempValue) && tempValue != undefined) {
                        this.errorModel.set({
                            'temperature-value-po': "Not a number!"
                        });
                    }
                    if (isNaN(pulseValue) && pulseValue != undefined) {
                        this.errorModel.set({
                            'pulse-value-po': "Not a number!"
                        });
                    } 
                    if (isNaN(respValue) && respValue != undefined) {
                        this.errorModel.set({
                            'respiration-measurement-po': "Not a number!"
                        });
                    } 
                    if (isNaN(poValue) && poValue != undefined) {
                        this.errorModel.set({
                            'po-concentration-po': "Not a number!"
                        });
                    } 
                    if (isNaN(heightValue) && heightValue != undefined) {
                        this.errorModel.set({
                            'height-value-po': "Not a number!"
                        });
                    } 
                    if (isNaN(weightValue) && weightValue != undefined) {
                        this.errorModel.set({
                            'weight-value-po': "Not a number!"
                        });
                    } 
                    if (isNaN(painValue) && painValue != undefined) {
                        this.errorModel.set({
                            'pain-value-po': "Not a number!"
                        });
                    } else if (painValue < 0 || painValue > 10) {
                        this.errorModel.set({
                            'pain-value-po': "Must be from 0 to 10"
                        });
                    }
                    if (isNaN(cgValue) && cgValue != undefined) {
                        this.errorModel.set({
                            'cg-value-po': "Not a number!"
                        });
                    } 
                    if (!_.isEmpty(this.errorModel.toJSON())) {
                        return "Validation errors. Please fix.";
                    }
                }
            });

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

            var toggleBoolean = false;

            var formView = ADK.UI.Form.extend({
                ui: {
                    "bpInput": ".bpInput",
                    "tempLocation": ".temperature-location-po",
                    "heightQuality": ".height-quality-po",
                    "bpFields": ".bp-location-po, .bp-method-po, .bp-cuff-size-po, .bp-position-po",
                    "pulseFields": ".pulse-location-po, .pulse-method-po, .pulse-position-po, .pulse-site-po",
                    "respirationFields": ".respiration-method-po, .respiration-position-po",
                    "poFields": ".po-measurement-po, .po-method-po",
                    "weightFields": ".weight-quality-po, .weight-method-po",
                    "cgFields": ".cg-site-po, .cg-location-po",
                    // "painFields": "."
                    "expandCollapseAll": ".expandCollapseAll",
                    "allCollapsibleContainers": ".bpSection, .temperatureSection, .pulseSection, .respirationSection, .poSection, .heightSection, .weightSection, .cgSection"
                },
                fields: F423Fields,
                events: {
                    "click #expandCollapseAll": function(e) {

                        this.$(this.ui.allCollapsibleContainers).trigger("control:collapsed", toggleBoolean);

                        if (toggleBoolean) {
                            this.$(this.ui.expandCollapseAll).trigger("control:label", 'Expand All');
                            this.$(this.ui.expandCollapseAll).trigger("control:title", 'Press enter to expand all vitals');
                        } else {
                            this.$(this.ui.expandCollapseAll).trigger("control:label", 'Collapse All');
                            this.$(this.ui.expandCollapseAll).trigger("control:title", 'Press enter to collapse all vitals');
                        }
                        toggleBoolean = !toggleBoolean;
                    },
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
                        var closeAlertView = new ADK.UI.Notification({
                            title: 'Vitals Submitted',
                            icon: 'fa-check',
                            message: 'Vitals successfully saved without errors.',
                            type: "success"
                        });
                        closeAlertView.show();
                        ADK.UI.Workflow.hide();
                    },
                    "click #form-add-btn": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: this.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Vitals Submitted',
                                icon: 'fa-check',
                                message: 'Vitals successfully submitted without errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                modelEvents: {
                    'change:bp-value-po': function() {
                        var val = this.model.get('bp-value-po');

                        if (val) {
                            this.$(this.ui.bpFields).trigger("control:disabled", false);
                            this.model.unset('bp-radio-po');
                        } else {
                            this.$(this.ui.bpFields).trigger("control:disabled", true);
                        }
                    },
                    'change:bp-radio-po': function() {
                        var val = this.model.get('bp-radio-po');

                        if (val) {
                            this.$(this.ui.bpFields).trigger("control:disabled", true);
                            this.model.unset('bp-value-po');
                        } else {
                            this.$(this.ui.bpFields).trigger("control:disabled", false);
                        }
                    },
                    'change:temperature-value-po': function() {
                        var val = this.model.get('temperature-value-po');

                        if (val) {
                            this.$(this.ui.tempLocation).trigger("control:disabled", false);
                            this.model.unset('temperature-radio-po');
                        } else {
                            this.$(this.ui.tempLocation).trigger("control:disabled", true);
                        }
                    },
                    'change:temperature-radio-po': function() {
                        var val = this.model.get('temperature-radio-po');

                        if (val) {
                            this.$(this.ui.tempLocation).trigger("control:disabled", true);
                            this.model.unset('temperature-value-po');
                        } else {
                            this.$(this.ui.tempLocation).trigger("control:disabled", false);
                        }
                    },
                    'change:pulse-value-po': function() {
                        var val = this.model.get('pulse-value-po');

                        if (val) {
                            this.$(this.ui.pulseFields).trigger("control:disabled", false);
                            this.model.unset('pulse-radio-po');
                        } else {
                            this.$(this.ui.pulseFields).trigger("control:disabled", true);
                        }
                    },
                    'change:pulse-radio-po': function() {
                        var val = this.model.get('pulse-radio-po');

                        if (val) {
                            this.$(this.ui.pulseFields).trigger("control:disabled", true);
                            this.model.unset('pulse-value-po');
                        } else {
                            this.$(this.ui.pulseFields).trigger("control:disabled", false);
                        }
                    },
                    'change:respiration-measurement-po': function() {
                        var val = this.model.get('respiration-measurement-po');

                        if (val) {
                            this.$(this.ui.respirationFields).trigger("control:disabled", false);
                            this.model.unset('respiration-radio-po');
                        } else {
                            this.$(this.ui.respirationFields).trigger("control:disabled", true);
                        }
                    },
                    'change:respiration-radio-po': function() {
                        var val = this.model.get('respiration-radio-po');

                        if (val) {
                            this.$(this.ui.respirationFields).trigger("control:disabled", true);
                            this.model.unset('respiration-measurement-po');
                        } else {
                            this.$(this.ui.respirationFields).trigger("control:disabled", false);
                        }
                    },
                    'change:po-concentration-po': function() {
                        var val = this.model.get('po-concentration-po');

                        if (val) {
                            this.$(this.ui.poFields).trigger("control:disabled", false);
                            this.model.unset('po-radio-po');
                        } else {
                            this.$(this.ui.poFields).trigger("control:disabled", true);
                        }
                    },
                    'change:po-radio-po': function() {
                        var val = this.model.get('po-radio-po');

                        if (val) {
                            this.$(this.ui.poFields).trigger("control:disabled", true);
                            this.model.unset('po-concentration-po');
                        } else {
                            this.$(this.ui.poFields).trigger("control:disabled", false);
                        }
                    },
                    'change:height-value-po': function() {
                        var val = this.model.get('height-value-po');

                        if (val) {
                            this.$(this.ui.heightQuality).trigger("control:disabled", false);
                            this.model.unset('height-radio-po');
                        } else {
                            this.$(this.ui.heightQuality).trigger("control:disabled", true);
                        }
                    },
                    'change:height-radio-po': function() {
                        var val = this.model.get('height-radio-po');

                        if (val) {
                            this.$(this.ui.heightQuality).trigger("control:disabled", true);
                            this.model.unset('height-value-po');
                        } else {
                            this.$(this.ui.heightQuality).trigger("control:disabled", false);
                        }
                    },
                    'change:weight-value-po': function() {
                        var val = this.model.get('weight-value-po');

                        if (val) {
                            this.$(this.ui.weightFields).trigger("control:disabled", false);
                            this.model.unset('weight-radio-po');
                        } else {
                            this.$(this.ui.weightFields).trigger("control:disabled", true);
                        }
                    },
                    'change:weight-radio-po': function() {
                        var val = this.model.get('weight-radio-po');

                        if (val) {
                            this.$(this.ui.weightFields).trigger("control:disabled", true);
                            this.model.unset('weight-value-po');
                        } else {
                            this.$(this.ui.weightFields).trigger("control:disabled", false);
                        }
                    },
                    'change:pain-value-po': function() {
                        var val = this.model.get('pain-value-po');

                        if (val) {
                            this.model.unset('pain-radio-po');
                            this.model.unset('pain-checkbox-po');
                        }
                    },
                    'change:pain-checkbox-po': function() {
                        var val = this.model.get('pain-checkbox-po');

                        if (val) {
                            this.model.unset('pain-radio-po');
                            this.model.unset('pain-value-po');
                        }
                    },
                    'change:pain-radio-po': function() {
                        var val = this.model.get('pain-radio-po');

                        if (val) {
                            this.model.unset('pain-value-po');
                            this.model.unset('pain-checkbox-po');
                        }
                    },
                    'change:cg-value-po': function() {
                        var val = this.model.get('cg-value-po');

                        if (val) {
                            this.$(this.ui.cgFields).trigger("control:disabled", false);
                            this.model.unset('cg-radio-po');
                        } else {
                            this.$(this.ui.cgFields).trigger("control:disabled", true);
                        }
                    },
                    'change:cg-radio-po': function() {
                        var val = this.model.get('cg-radio-po');

                        if (val) {
                            this.$(this.ui.cgFields).trigger("control:disabled", true);
                            this.model.unset('cg-value-po');
                        } else {
                            this.$(this.ui.cgFields).trigger("control:disabled", false);
                        }
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Vitals",
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
    return F423;
});
