define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'app/applets/addVitals/utils/modelUtils',    
    'app/applets/addVitals/utils/picklistUtil',
    'app/applets/addVitals/utils/validationUtil',
    'app/applets/addVitals/utils/writebackUtil'
], function(Backbone, Marionette, $, Handlebars, modelUtils, picklistUtil, validationUtil, writebackUtil) {    
    
    var AddVitalsView = {
        
        buildView: function(){
            var self = this;
            
            var params = {
                type: 'GET',
                url: 'resource/write-pick-list',
                data: {type:'vitals',site: '9E7A'},                
                dataType: 'json'
            };          

            var pickListRequest = $.ajax(params);                   
            pickListRequest.done(function( resp ) {
                if(resp && resp.data){
                    var items = resp.data;
                    self.vitalsIENMap = picklistUtil.getIENMap(items);
                    self.bloodPressureLocations = picklistUtil.getQualifier(items, 'BLOOD PRESSURE', 'LOCATION');
                    self.bloodPressureMethods = picklistUtil.getQualifier(items, 'BLOOD PRESSURE', 'METHOD');
                    self.bloodPressurePositions = picklistUtil.getQualifier(items, 'BLOOD PRESSURE', 'POSITION');
                    self.bloodPressureCuffSizes = picklistUtil.getQualifier(items, 'BLOOD PRESSURE', 'CUFF SIZE');
                    self.tempLocations = picklistUtil.getQualifier(items, 'TEMPERATURE', 'LOCATION');
                    self.respMethods = picklistUtil.getQualifier(items, 'RESPIRATION', 'METHOD');
                    self.respPositions = picklistUtil.getQualifier(items, 'RESPIRATION', 'POSITION');
                    self.pulseLocations = picklistUtil.getQualifier(items, 'PULSE', 'LOCATION');
                    self.pulseMethods = picklistUtil.getQualifier(items, 'PULSE', 'METHOD');
                    self.pulsePositions = picklistUtil.getQualifier(items, 'PULSE', 'POSITION');
                    self.pulseSites = picklistUtil.getQualifier(items, 'PULSE', 'SITE');
                    self.heightQualities = picklistUtil.getQualifier(items, 'HEIGHT', 'QUALITY');
                    self.weightMethods = picklistUtil.getQualifier(items, 'WEIGHT', 'METHOD');
                    self.weightQualities = picklistUtil.getQualifier(items, 'WEIGHT', 'QUALITY');
                    self.circumferenceLocations = picklistUtil.getQualifier(items, 'CIRCUMFERENCE/GIRTH', 'LOCATION');
                    self.circumferenceSites = picklistUtil.getQualifier(items, 'CIRCUMFERENCE/GIRTH', 'SITE');
                    self.pulseOximetryMethods = picklistUtil.getQualifier(items, 'PULSE OXIMETRY', 'METHOD');
                }

                self.createForm();                             
            });
        },
        createForm: function() {
            var rowSubheader1 = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: 'container',
                    extraClasses: ["col-xs-12"],
                    template: Handlebars.compile('<p>* indidcates a required field</p>')
                }]
            };

            var rowSubheader = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: 'container',
                        extraClasses: ['col-xs-5'],
                        items: [{
                            control: "datepicker",
                            name: "dateTakenInput",
                            title: "Please enter in a date in the following format, MM/DD/YYYY",
                            label: "Date Taken",
                            required: true,
                            options: {
                                endDate: '0d'
                            }
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-5"],
                        items: [{
                            control: "timepicker",
                            name: "time-taken",
                            title: "Please enter in a time in the following format, HH:MM",
                            label: "Time Taken",
                            options: {
                                defaultTime: false
                            }
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
                    },{
                        control: 'spacer'
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
                        control: 'checkbox',
                        label: 'Open All',
                        name: 'expandCollapseAll',
                        extraClasses: ["pull-right"],
                        title: "To select this checkbox, press the spacebar"
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
                        name: "bpInputValue",
                        label: "Blood Pressure",
                        title: "Please enter in a numeric value",
                        units: "mm[HG]"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "bp-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "bp-refused-po"
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
                    pickList: this.bloodPressureLocations
                }, {
                    control: "select",
                    name: "bp-method-po",
                    label: "Method",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.bloodPressureMethods
                }, {
                    control: "select",
                    label: "Cuff Size",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "bp-cuff-size-po",
                    extraClasses: ["col-xs-6"],
                    pickList: this.bloodPressureCuffSizes
                }, {
                    control: "select",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    name: "bp-position-po",
                    extraClasses: ["col-xs-6"],
                    pickList: this.bloodPressurePositions
                }]
            };

            var bloodPressureSection = {
                control: 'collapsibleContainer',
                name: 'bpSection',
                headerItems: [bloodPressureHeader],
                collapseItems: [bloodPressureBody]
            };

            var pulseHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        label: "Pulse",
                        name: "pulseInputValue",
                        units: "/min",
                        title: "Please enter in a numeric value"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "pulse-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "pulse-refused-po"
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
                    pickList: this.pulseMethods
                }, {
                    control: "select",
                    name: "pulse-position-po",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.pulsePositions
                }, {
                    control: "select",
                    name: "pulse-site-po",
                    label: "Site",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.pulseSites
                }, {
                    control: "select",
                    name: "pulse-location-po",
                    label: "Location",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.pulseLocations
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
                        name: "respirationInputValue"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "respiration-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "respiration-refused-po"
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
                    pickList: this.respMethods
                }, {
                    control: "select",
                    name: "respiration-position-po",
                    label: "Position",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.respPositions
                }]
            };

            var respirationSection = {
                control: 'collapsibleContainer',
                name: 'respirationSection',
                headerItems: [respirationHeader],
                collapseItems: [respirationBody]
            };

            var temperatureHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        name: "temperatureInputValue",
                        label: "Temperature",
                        title: "Please enter in a numeric value",
                        units: [{
                            label: "F",
                            value: "F",
                            title: "fahrenheit"
                        }, {
                            label: "C",
                            value: "C",
                            title: "celsius"
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "temperature-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "temperature-refused-po"
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
                    pickList: this.tempLocations
                }]
            };

            var temperatureSection = {
                control: 'collapsibleContainer',
                name: 'temperatureSection',
                headerItems: [temperatureHeader],
                collapseItems: [temperatureBody]
            };

            var pulseOximetryHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        name: "O2InputValue",
                        label: "Pulse Oximetry",
                        title: "Please enter in a numeric value",
                        units: "%"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "po-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "po-refused-po"
                    }]
                }]
            };

            var pulseOximetryBody = {
                control: "container",
                items: [{
                    control: "input",
                    label: "Supplemental Oxygen Flow Rate",
                    name: "suppO2InputValue",
                    units: "(liters/minute)",
                    title: "Please enter in a numeric value",
                    extraClasses: ["col-xs-6"],
                }, {
                    control: "select",
                    label: "Method",
                    name: "po-method-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.pulseOximetryMethods
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
                        name: "heightInputValue",
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
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "height-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "height-refused-po"
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
                    pickList: this.heightQualities
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
                        name: "weightInputValue",
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
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "weight-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "weight-refused-po"
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
                    pickList: this.weightMethods
                }, {
                    control: "select",
                    name: "weight-quality-po",
                    label: "Quality",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.weightQualities
                }]
            };

            var weightSection = {
                control: 'collapsibleContainer',
                name: 'weightSection',
                headerItems: [weightHeader],
                collapseItems: [weightBody]
            };

            var painSection = {
                control: "container",
                extraClasses: ['row'],
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
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "pain-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "pain-refused-po"
                    }]
                }]
            };

            var circumferenceHeader = {
                control: "container",
                items: [{
                    control: "container",
                    extraClasses: ['col-xs-8'],
                    items: [{
                        control: "input",
                        label: "Circumference/Girth",
                        name: "circumValue",
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
                    extraClasses: ["col-xs-4"],
                    items: [{
                            control: "checkbox",
                            label: "Unavailable",
                            title: "To select this checkbox, press the spacebar",
                            name: "cg-unavailable-po"
                        },
                        {
                            control: "checkbox",
                            label: "Refused",
                            title: "To select this checkbox, press the spacebar",
                            name: "cg-refused-po"
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
                    pickList: this.circumferenceSites
                }, {
                    control: "select",
                    label: "Location",
                    name: "cg-location-po",
                    title: "To select an option, use the up and down arrow keys then press enter to select",
                    extraClasses: ["col-xs-6"],
                    pickList: this.circumferenceLocations
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
                    items: [rowSubheader1, rowSubheader, expandCollapseAll, bloodPressureSection, pulseSection, respirationSection,
                        temperatureSection, pulseOximetrySection, heightSection,
                        weightSection, painSection, circumferenceSection
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
                        extraClasses: ["col-xs-3"],
                        template: Handlebars.compile('<p><span id="observation-saved-at3">Saved at {{savedTime}}</span></p>'),
                        modelListeners: ["savedTime"]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-9"],
                        items: [{
                            control: "button",
                            id: 'form-cancel-btn',
                            extraClasses: ["icon-btn", "btn-sm"],
                            type: "button",
                            label: "Cancel",
                            title: "Press enter to leave the form without making any changes"
                        }, {
                            control: "button",
                            id: "form-saveAndClose-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Save & Close",
                            type: 'button',
                            icon: "fa-floppy-o",
                            title: "Press enter to leave the form without making any changes"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Submit",
                            id: "form-submit-btn",
                            icon: "fa-check-square-o",
                            title: "Press enter to submit changes in the form"
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    facilityName: 'D.C. VA Hospital',
                    savedTime: "00:00",
                    dateTakenInput: moment().format('MM/DD/YYYY'),
                    'time-taken': '',
                    'expandCollapseAll': false,
                    errorModel: new Backbone.Model()
                },
                validate: function(attributes, options){
                    return validationUtil.validateModel(this);
                }
            });

            var saveAlertView = new ADK.UI.Notification({
                title: 'Vitals Submitted',
                icon: 'fa-check',
                message: 'Vitals successfully submitted with no errors.'
            });
            
            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose your progress if you cancel..  Would you like to proceed with ending this observation?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('Your progress will be saved and remain in draft status. Would you like to proceed with closing this observation?'),
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

            var ErrorMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('We\'re sorry. There was an error submitting your form.'),
                tagName: 'p'
            });

            var ErrorFooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Ok" classes="btn-primary" title="Click button to close modal"}}'),
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        var form = workflow.getFormView(0);
                        form.$(form.ui.submitButton).trigger('control:disabled', false);
                    }
                },
                tagName: 'span'
            });

            var WarningFooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Submit" classes="btn-primary" title="Click button to save vitals!"}}'),
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        writebackUtil.addVitals(formModel, AddVitalsView.vitalsIENMap, function(){
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                            setTimeout(function() {
                                ADK.ResourceService.clearAllCache('vital');
                                var vitalsChannel = ADK.Messaging.getChannel('vitals');
                                vitalsChannel.request('refreshGridView');
                            }, 2000);
                        },
                        function(){
                            var errorAlertView = new ADK.UI.Alert({
                                title: 'System 500 Error',
                                icon: 'fa-exclamation-triangle',
                                messageView: ErrorMessageView,
                                footerView: ErrorFooterView
                            });
                            errorAlertView.show();
                        });
                    },
                    'click .btn-default': function() {
                        var form = workflow.getFormView(0);
                        form.$(form.ui.submitButton).trigger('control:disabled', false);
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var NoVitalsEnteredMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('No data entered for patient ' + ADK.PatientRecordService.getCurrentPatient().get('displayName') + '. Close the window?'),
                tagName: 'p'
            });

            var NoVitalsEnteredFooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "No" classes="btn-default" title="Click button to cancel your action"}}{{ui-button "Yes" classes="btn-primary" title="Click button to save vitals"}}'),
                events: {
                    'click .btn-primary': function(){
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click .btn-default': function(){
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var formView = ADK.UI.Form.extend({
                ui: {
                    'bpValueInput': '#bpInputValue',
                    'bpUnavailablePo': '#bp-unavailable-po',
                    'bpRefusedPo': '#bp-refused-po',
                    'bpLocationPo': '#bp-location-po',
                    'bpMethodPo': '#bp-method-po',
                    'bpCuffSizePo': '#bp-cuff-size-po',
                    'bpPositionPo': '#bp-position-po',
                    'pulseValue': '#pulseInputValue',
                    'pulseUnavailablePo': '#pulse-unavailable-po',
                    'pulseRefusedPo': '#pulse-refused-po',
                    'pulseLocationPo': '#pulse-location-po',
                    'pulseMethodPo': '#pulse-method-po',
                    'pulsePositionPo': '#pulse-position-po',
                    'pulseSitePo': '#pulse-site-po',
                    'respInputValue': '#respirationInputValue',
                    'respUnavailablePo': '#respiration-unavailable-po',
                    'respRefusedPo': '#respiration-refused-po',
                    'respMethodPo': '#respiration-method-po',
                    'respPositionPo': '#respiration-position-po',
                    'tempValuePo': '#temperatureInputValue',
                    'tempUnavailablePo': '#temperature-unavailable-po',
                    'tempRefusedPo': '#temperature-refused-po',
                    'tempLocationPo': '#temperature-location-po',
                    'tempValueRadioF': '#temperatureInputValue-F-radio',
                    'tempValueRadioC': '#temperatureInputValue-C-radio',
                    'poMeasurementPo': '#suppO2InputValue', //suppO2InputValue
                    'poConcentrationPo': '#O2InputValue',
                    'poMethodPo': '#po-method-po',
                    'poUnavailablePo': '#po-unavailable-po',
                    'poRefusedPo': '#po-refused-po',
                    'heightInputValue': '#heightInputValue',
                    'heightUnavailablePo': '#height-unavailable-po',
                    'heightRefusedPo': '#height-refused-po',
                    'heightQualityPo': '#heightQuality',
                    'heightRadioInputIn': '#heightInputValue-in-radio',
                    'heightRadioInputCm': '#heightInputValue-cm-radio',
                    'weightInputValue': '#weightInputValue',
                    'weightUnavailablePo': '#weight-unavailable-po',
                    'weightRefusedPo': '#weight-refused-po',
                    'weightQualityPo': '#weight-quality-po',
                    'weightMethodPo': '#weight-method-po',
                    'weightRadioInputLb': '#weightInputValue-lb-radio',
                    'weightRadioInputKg': '#weightInputValue-kg-radio',
                    'painValuePo': '#pain-value-po',
                    'painUnavailablePo': '#pain-unavailable-po',
                    'painRefusedPo': '#pain-refused-po',
                    'painUnableToRespond': '#pain-checkbox-po',
                    'circumValueInput': '#circumValue',
                    'circumSitePo': '#cg-site-po',
                    'circumLocationPo': '#cg-location-po',
                    'circumUnavailablePo': '#cg-unavailable-po',
                    'circumRefusedPo': '#cg-refused-po',
                    'circumValueInRadio': '#circumValue-in-radio',
                    'circumValueCmRadio': '#circumValue-cm-radio',
                    'allValueFields': '.bpInputValue, .pulseInputValue, .respirationInputValue, .temperatureInputValue, .O2InputValue, .heightInputValue, .weightInputValue, .pain-value-po, .pain-checkbox-po, .circumValue',
                    'allRadioButtons': '.bp-radio-po, .pulse-radio-po, .respiration-radio-po, .temperature-radio-po, .po-radio-po, .height-radio-po, .weight-radio-po, .pain-radio-po, .cg-radio-po',
                    'bpFields': '.bp-location-po, .bp-method-po, .bp-cuff-size-po, .bp-position-po',
                    'pulseFields': '.pulse-location-po, .pulse-method-po, .pulse-position-po, .pulse-site-po',
                    'respirationFields': '.respiration-method-po, .respiration-position-po',
                    'tempLocation': '.temperature-location-po',
                    'poFields': '.suppO2InputValue, .po-method-po',
                    'heightQuality': '.height-quality-po',
                    'weightFields': '.weight-quality-po, .weight-method-po',
                    'cgFields': '.cg-site-po, .cg-location-po',
                    'expandCollapseAll': '.expandCollapseAll',
                    'allUnavailableBoxes': '.bp-unavailable-po, .pulse-unavailable-po, .respiration-unavailable-po, .temperature-unavailable-po, .height-unavailable-po, .weight-unavailable-po, .po-unavailable-po, .pain-unavailable-po, .cg-unavailable-po',
                    'allRefusedBoxes': '.bp-refused-po, .pulse-refused-po, .respiration-refused-po, .temperature-refused-po, .height-refused-po, .weight-refused-po, .po-refused-po, .pain-refused-po, .cg-refused-po',
                    'allCollapsibleContainers': '.bpSection, .temperatureSection, .pulseSection, .respirationSection, .poSection, .heightSection, .weightSection, .cgSection',
                    'submitButton': '#form-submit-btn'
                },
                fields: F423Fields,
                events: {
                    "click #form-cancel-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to cancel?',
                            icon: 'fa-exclamation-triangle',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #form-saveAndClose-btn": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to close this form?',
                            icon: 'fa-exclamation-triangle',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        closeAlertView.show();
                    },
                    "submit": function(e) {
                        var self = this;
                        e.preventDefault();

                        if(validationUtil.areAllDataFieldsEmpty(self.model)){
                            var noVitalsEnteredAlertView = new ADK.UI.Alert({
                                title: 'No Data Entered',
                                icon: 'fa-exclamation-triangle',
                                messageView: NoVitalsEnteredMessageView,
                                footerView: NoVitalsEnteredFooterView
                            });
                            noVitalsEnteredAlertView.show();
                            return;
                        }

                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.$(this.ui.submitButton).trigger('control:disabled', true);
                            validationUtil.validateHistorical(this.model, function(showRulesMessage, warningMessagesHTML){                              
                                if(showRulesMessage){
                                    var WarningMessageView = Backbone.Marionette.ItemView.extend({
                                        template: Handlebars.compile(warningMessagesHTML),
                                        tagName: 'p'
                                    });                                    
                                    var warningView = new ADK.UI.Alert({
                                        title: 'Height/Weight Warnings Exist',
                                        icon: 'fa-exclamation-triangle',
                                        messageView: WarningMessageView,
                                        footerView: WarningFooterView
                                    });
                                    warningView.show();                                    
                                }else{
                                    writebackUtil.addVitals(self.model, AddVitalsView.vitalsIENMap, function(){
                                        saveAlertView.show();
                                        ADK.UI.Workflow.hide();

                                        setTimeout(function() {
                                            ADK.ResourceService.clearAllCache('vital');
                                            var vitalsChannel = ADK.Messaging.getChannel('vitals');
                                            vitalsChannel.request('refreshGridView');
                                        }, 2000);
                                    },
                                    function(){
                                        var errorAlertView = new ADK.UI.Alert({
                                            title: 'System 500 Error',
                                            icon: 'fa-exclamation-triangle',
                                            messageView: ErrorMessageView,
                                            footerView: ErrorFooterView
                                        });
                                        errorAlertView.show();
                                    });
                                }

                            });
                        }

                        var fourDigitTime = function() {
                            var date = new Date();
                            var hours = "";
                            var mins = "";
                            if (date.getHours() < 10) {
                                hours = "0" + date.getHours();
                            } else {
                                hours = date.getHours();
                            }
                            if (date.getMinutes() < 10) {
                                mins = "0" + date.getMinutes();
                            } else {
                                mins = date.getMinutes();
                            }
                            return hours + ":" + mins;
                        };
                        this.model.set("savedTime", fourDigitTime());

                        return false;
                    }
                },
                modelEvents: {
                    'change:cg-unavailable-po': function(e){
                        if(!this.$(this.ui.circumRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.circumUnavailablePo).prop('checked'), [this.ui.circumValueInput, this.ui.circumSitePo, this.ui.circumLocationPo, this.ui.circumValueInRadio, this.ui.circumValueCmRadio], ['circumValue', 'cg-location-po', 'cg-location-po']);
                        }else{
                            this.$(this.ui.circumRefusedPo).attr('checked', false);
                            this.model.set({'cg-refused-po':false}, {silent: true});
                        }
                    },
                    'change:cg-refused-po': function(e){
                        if(!this.$(this.ui.circumUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.circumRefusedPo).prop('checked'), [this.ui.circumValueInput, this.ui.circumSitePo, this.ui.circumLocationPo, this.ui.circumValueInRadio, this.ui.circumValueCmRadio], ['circumValue', 'cg-location-po', 'cg-location-po']);
                        }else{
                            this.$(this.ui.circumUnavailablePo).attr('checked', false);                          
                            this.model.set({'cg-unavailable-po': false}, {silent: true});                            
                        }
                    },
                    'change:bp-unavailable-po': function(e){
                        if(!this.$(this.ui.bpRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.bpUnavailablePo).prop('checked'), [this.ui.bpValueInput, this.ui.bpLocationPo, this.ui.bpMethodPo, this.ui.bpCuffSizePo, this.ui.bpPositionPo], ['bp-cuff-size-po', 'bp-location-po', 'bp-method-po', 'bp-position-po', 'bpInputValue']);
                        }else{
                            this.$(this.ui.bpRefusedPo).attr('checked', false);        
                            this.model.set({'bp-refused-po':false}, {silent: true});                            
                        }
                    },
                    'change:bp-refused-po': function(e){
                        if(!this.$(this.ui.bpUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.bpRefusedPo).prop('checked'), [this.ui.bpValueInput, this.ui.bpLocationPo, this.ui.bpMethodPo, this.ui.bpCuffSizePo, this.ui.bpPositionPo], ['bp-cuff-size-po', 'bp-location-po', 'bp-method-po', 'bp-position-po', 'bpInputValue']);
                        }else{
                            this.$(this.ui.bpUnavailablePo).attr('checked', false);                        
                            this.model.set({'bp-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:pulse-unavailable-po': function(e){
                        if(!this.$(this.ui.pulseRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.pulseUnavailablePo).prop('checked'), [this.ui.pulseValue, this.ui.pulseLocationPo, this.ui.pulseMethodPo, this.ui.pulsePositionPo, this.ui.pulseSitePo], ['pulse-location-po', 'pulse-method-po', 'pulse-position-po', 'pulseInputValue', 'pulseInputValue']);
                        }else{
                            this.$(this.ui.pulseRefusedPo).attr('checked', false);                        
                            this.model.set({'pulse-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:pulse-refused-po': function(e){
                        if(!this.$(this.ui.pulseUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.pulseRefusedPo).prop('checked'), [this.ui.pulseValue, this.ui.pulseLocationPo, this.ui.pulseMethodPo, this.ui.pulsePositionPo, this.ui.pulseSitePo], ['pulse-location-po', 'pulse-method-po', 'pulse-position-po', 'pulse-site-po', 'pulseInputValue']);
                        }else{
                            this.$(this.ui.pulseUnavailablePo).attr('checked', false);                        
                            this.model.set({'pulse-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:respiration-unavailable-po': function(e){
                        if(!this.$(this.ui.respRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.respUnavailablePo).prop('checked'), [this.ui.respInputValue, this.ui.respMethodPo, this.ui.respPositionPo], ['respiration-method-po', 'respiration-position-po', 'respirationInputValue']);
                        }else{
                            this.$(this.ui.respRefusedPo).attr('checked', false);                        
                            this.model.set({'respiration-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:respiration-refused-po': function(e){
                       if(!this.$(this.ui.respUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.respRefusedPo).prop('checked'), [this.ui.respInputValue, this.ui.respMethodPo, this.ui.respPositionPo], ['respiration-method-po', 'respiration-position-po', 'respirationInputValue']);
                        }else{
                            this.$(this.ui.respUnavailablePo).attr('checked', false);                        
                            this.model.set({'respiration-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:temperature-unavailable-po': function(e){
                        if(!this.$(this.ui.tempRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.tempUnavailablePo).prop('checked'), [this.ui.tempValuePo, this.ui.tempLocationPo, this.ui.tempValueRadioC, this.ui.tempValueRadioF], ['temperature-location-po', 'temperatureInputValue']);
                        }else{
                            this.$(this.ui.tempRefusedPo).attr('checked', false);                        
                            this.model.set({'temperature-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:temperature-refused-po': function(e){
                        if(!this.$(this.ui.tempUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.tempRefusedPo).prop('checked'), [this.ui.tempValuePo, this.ui.tempLocationPo, this.ui.tempValueRadioC, this.ui.tempValueRadioF], ['temperature-location-po', 'temperatureInputValue']);
                        }else{
                            this.$(this.ui.tempUnavailablePo).attr('checked', false);                        
                            this.model.set({'temperature-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:po-unavailable-po': function(e){
                        if(!this.$(this.ui.poRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.poUnavailablePo).prop('checked'), [this.ui.poConcentrationPo, this.ui.poMeasurementPo, this.ui.poMethodPo], ['O2InputValue', 'suppO2InputValue', 'po-method-po']);
                        }else{
                            this.$(this.ui.poRefusedPo).attr('checked', false);                        
                            this.model.set({'po-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:po-refused-po': function(e){
                        if(!this.$(this.ui.poUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.poRefusedPo).prop('checked'), [this.ui.poConcentrationPo, this.ui.poMeasurementPo, this.ui.poMethodPo], ['O2InputValue', 'suppO2InputValue', 'po-method-po']);
                        }else{
                            this.$(this.ui.poUnavailablePo).attr('checked', false);                        
                            this.model.set({'po-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:height-unavailable-po': function(e){
                        if(!this.$(this.ui.heightRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.heightUnavailablePo).prop('checked'), [this.ui.heightInputValue, this.ui.heightQuality, this.ui.heightRadioInputCm, this.ui.heightRadioInputIn], ['heightInputValue', 'height-quality-po']);
                        }else{
                            this.$(this.ui.heightRefusedPo).attr('checked', false);                        
                            this.model.set({'height-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:height-refused-po': function(e){
                        if(!this.$(this.ui.heightUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.heightRefusedPo).prop('checked'), [this.ui.heightInputValue, this.ui.heightQuality, this.ui.heightRadioInputCm, this.ui.heightRadioInputIn], ['heightInputValue', 'height-quality-po']);
                        }else{
                            this.$(this.ui.heightUnavailablePo).attr('checked', false);                        
                            this.model.set({'height-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:weight-unavailable-po': function(e){
                        if(!this.$(this.ui.weightRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.weightUnavailablePo).prop('checked'), [this.ui.weightInputValue, this.ui.weightMethodPo, this.ui.weightQualityPo, this.ui.weightRadioInputKg, this.ui.weightRadioInputLb], ['weight-method-po', 'weight-quality-po', 'weightInputValue']);
                        }else{
                            this.$(this.ui.weightRefusedPo).attr('checked', false);                        
                            this.model.set({'weight-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:weight-refused-po': function(e){
                        if(!this.$(this.ui.weightUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.weightRefusedPo).prop('checked'), [this.ui.weightInputValue, this.ui.weightMethodPo, this.ui.weightQualityPo, this.ui.weightRadioInputKg, this.ui.weightRadioInputLb], ['weight-method-po', 'weight-quality-po', 'weightInputValue']);
                        }else{
                            this.$(this.ui.weightUnavailablePo).attr('checked', false);                        
                            this.model.set({'weight-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:pain-unavailable-po': function(e){
                        if(!this.$(this.ui.painRefusedPo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.painUnavailablePo).prop('checked'), [this.ui.painValuePo, this.ui.painUnableToRespond], ['pain-value-po', 'pain-checkbox-po']);
                        }else{
                            this.$(this.ui.painRefusedPo).attr('checked', false);                        
                            this.model.set({'pain-refused-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:pain-refused-po': function(e){
                        if(!this.$(this.ui.painUnavailablePo).prop('checked')){
                            this.toggleDisabled(this.$(this.ui.painRefusedPo).prop('checked'), [this.ui.painValuePo, this.ui.painUnableToRespond], ['pain-value-po', 'pain-checkbox-po']);
                        }else{
                            this.$(this.ui.painUnavailablePo).attr('checked', false);                        
                            this.model.set({'pain-unavailable-po':false}, {silent: true});                                                        
                        }
                    },
                    'change:pain-checkbox-po': function(e){
                        this.model.unset('pain-value-po');
                        this.model.errorModel.clear();
                        this.$(this.ui.painValuePo).trigger('control:disabled', this.model.get('pain-checkbox-po'));
                    },
                    'change:facility-name-pass-po': function(e){
                        var isPassChecked = this.model.get('facility-name-pass-po');
                        if(isPassChecked){
                            this.unsetModelProperties();
                        }

                        this.$(this.ui.allValueFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.allRadioButtons).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.bpFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.pulseFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.respirationFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.tempLocation).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.poFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.heightQuality).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.weightFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.cgFields).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.allUnavailableBoxes).trigger('control:disabled', isPassChecked);
                        this.$(this.ui.allRefusedBoxes).trigger('control:disabled', isPassChecked);
                    },
                    'change:expandCollapseAll': function(){
                        var model = this.model;
                        this.$(this.ui.allCollapsibleContainers).trigger("control:collapsed", !model.get('expandCollapseAll'));

                        _.each(collapsedStatus, function(item){
                            item.collapsed = !model.get('expandCollapseAll');
                        });
                    }
                },
                toggleDisabled: function(isChecked, uiFields, modelProperties){
                    this.model.errorModel.clear();
                    var self = this;
                    if(isChecked){
                        _.each(modelProperties, function(property){
                            self.model.unset(property, {silent: true});
                        });
                    }

                    _.each(uiFields, function(field){
                        if(isChecked && !self.$(field).is('input[type="radio"]')){
                            self.$(field).val('');
                        }
                        self.$(field).trigger('control:disabled', isChecked);
                    });
                },
                unsetModelProperties: function(){
                    var model = this.model;
                    _.each(model.attributes, function(attribute, key){
                        if(key !== 'dateTakenInput' && key !== 'time-taken' && key !== 'facility-name-pass-po' && key !== 'errorModel' && key !== 'savedTime' && key !== 'expandCollapseAll'){
                            model.unset(key);
                        }
                    });
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Vitals",
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

            var collapsedStatus = [
                { target: '#collapsibleContainerCollapseRegion-bpSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-pulseSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-respirationSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-temperatureSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-poSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-heightSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-weightSection', collapsed: true},
                { target: '#collapsibleContainerCollapseRegion-cgSection', collapsed: true}
            ];

            var dataTargetSelector = 'button[data-target="#collapsibleContainerCollapseRegion-bpSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-pulseSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-respirationSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-temperatureSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-poSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-heightSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-weightSection"], ' +
                'button[data-target="#collapsibleContainerCollapseRegion-cgSection"]';

            $(dataTargetSelector).on('click', function(e){
                handleClickOrEnterOnCollapse(this);
            });

            function handleClickOrEnterOnCollapse(context){
                var dataTarget = $(context).attr('data-target');
                var collapsedItem = _.findWhere(collapsedStatus, {target: dataTarget});
                collapsedItem.collapsed = !collapsedItem.collapsed;

                var allOpen = true;
                _.each(collapsedStatus, function(item){
                    if(item.collapsed === true){
                        allOpen = false;
                    }
                });

                if(allOpen){
                    formModel.set({'expandCollapseAll': true});
                }else {
                    formModel.set({'expandCollapseAll': false}, {silent: true});
                    $('#expandCollapseAll').attr('checked', false);
                }
            }
        }
    };
    return AddVitalsView;
});