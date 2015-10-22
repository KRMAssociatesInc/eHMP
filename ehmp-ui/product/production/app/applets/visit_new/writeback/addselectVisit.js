define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'moment',
    '../collectionHandler'
], function(Backbone, Marionette, $, Handlebars, moment, collectionHandler) {


    var providerspickListArray;
    var locationspickListArray;
    var appointmentsArray = new Backbone.Collection([{}]);
    var cachedData = {
        "locations": new Backbone.Collection(),
        "providers": new Backbone.Collection(),
        "appointments": new Backbone.Collection([{}]),
        "admissions": new Backbone.Collection([{}])
    };
    var admissionsArray = new Backbone.Collection([{}]);
    var newvisitModel = Backbone.Model.extend({
        defaults: {
            "locationUid": "",
            "locationDisplayName": "",
            "dateTime": "",
            "formattedDate": "",
            "isHistorical": "off",
            "existingVisit": false,
            "selectedProvider": {}
        }
    });
var newVisit;

    var selectEncounterProviderContainer = {
        control: "container",
        extraClasses: ["row"],
        items: [{
            control: "container",
            extraClasses: ["col-md-12"],
            items: [{
                control: "container",
                tagName: "h5",
                extraClasses: ["encounters-sub-heading"],
                template: "Select Encounter Provider"
            }]
        }, {
            control: "container",
            extraClasses: ["col-md-6"],
            items: [{
                control: "select",
                label: "Search for Provider",
                srOnlyLabel: false,
                name: "selectEncounterProvider",
                placeholder: "Please wait while the list is loading.",
                pickList: providerspickListArray,
                showFilter: true,
                groupEnabled: true
            }]
        }, {
            control: "container",
            extraClasses: ["col-md-6"],
            items: [{
                control: "container",
                extraClasses: ["well", "read-only-well"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-6"],
                    template: '<h6>Encounter Provider<br><span id="encounters-provider">{{encounterProvider}}</span></h6>',
                    modelListeners: ['encounterProvider']
                }, {
                    control: "container",
                    extraClasses: ["col-md-6"],
                    template: '<h6>Encounter Location<br><span id="encounters-location">{{encounterLocation}}</span></h6>',
                    modelListeners: ['encounterLocation'],
                    items: [{
                        control: "button",
                        id: "viewEncouters-btn",
                        type: "button",
                        label: "View Encounter",
                        extraClasses: ["btn", "btn-primary", "btn-xs"],
                        name: "viewEncouters-btn"
                    }]
                }]
            }]
        }]
    };
    var clinicalAppointmentsTab = {
        title: "Clinic Appointments",
        items: [{
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["col-md-12"],
                template: '<h6>Clinic Appointments / Visits</h6>'
            }]
        }, {
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "datepicker",
                extraClasses: ["col-md-6", "appointmentsDate"],
                name: "clinicAppointmentsFromDate",
                label: "From",
                srOnlyLabel: false
            }, {
                control: "datepicker",
                extraClasses: ["col-md-6", "appointmentsDate"],
                name: "clinicAppointmentsThroughDate",
                label: "Through",
                srOnlyLabel: false
            }]
        }, {
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "selectableTable",
                name: "appointmentsModel",
                id: "selectableTableAppointments",
                collection: appointmentsArray,
                columns: [{
                    title: "Date",
                    id: "formatteddateTime"
                }, {
                    title: "Details",
                    id: "summary"
                }, {
                    title: "Facility",
                    id: "facilityDisplay"
                }, {
                    title: "Location",
                    id: "locationDisplayName"
                }],
                extraClasses: ["special-class"]
            }]
        }]
    };
    var hospitalAdmissionsTab = {
        title: "Hospital Admissions",
        items: [{
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["col-md-12"],
                template: '<h6>Hospital Admissions</h6>'
            }]
        }, {
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["faux-table-container"],
                items: [{
                    control: "selectableTable",
                    name: "admissionsModel",
                    id: "selectableTableAdmissions",
                    collection: admissionsArray,
                    columns: [{
                        title: "Date",
                        id: "formatteddateTime"
                    }, {
                        title: "Details",
                        id: "reasonName"
                    }, {
                        title: "Facility",
                        id: "facilityDisplay"
                    }, {
                        title: "Location",
                        id: "locationDisplayName"
                    }],
                    extraClasses: ["special-class"]
                }]
            }]
        }]
    };
    var newVisitTab = {
        title: "New Visit",
        items: [{
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["col-md-12"],
                template: '<h6>New Visit</h6>'
            }]
        }, {
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["col-md-6"],
                items: [{
                    control: "select",
                    label: "New Encounter Location",
                    srOnlyLabel: false,
                    name: "selectnewencounterLocation",
                    pickList: locationspickListArray,
                    showFilter: true,
                    groupEnabled: true
                }]
            }, {
                control: "container",
                extraClasses: ["col-md-6"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "datepicker",
                        name: "newVisitDate",
                        srOnlyLabel: false,
                        label: "From"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "timepicker",
                        placeholder: "HH:MM",
                        name: "newVisitTime",
                        srOnlyLabel: false,
                        label: "Time of Visit"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-12"],
                        items: [{
                            control: "checkbox",
                            srOnlyLabel: true,
                            name: "isHistorical",
                            label: "Historical Visit: a visit that occurred at some time in the past or at some other location (possibly non-VA) but is not used for workload credit."
                        }]
                    }]
                }]
            }]
        }]
    };

    var selectEncounterProviderLocation = {
        control: "container",
        extraClasses: ["row"],
        items: [{
            control: "container",
            extraClasses: ["col-md-12"],
            items: [{
                control: "container",
                tagName: "h5",
                extraClasses: ["encounters-sub-heading"],
                template: "Select Encounter Location"
            }, {
                control: "tabs",
                id: "tabs-container",
                tabs: [clinicalAppointmentsTab, hospitalAdmissionsTab, newVisitTab]
            }]
        }]
    };
    // *********************************************** END OF CONTAINERS ****************************************

    // *********************************************** FIELDS ***************************************************
    var VisitFields = [{
        control: "container",
        extraClasses: ["modal-body"],
        items: [{
            control: "container",
            extraClasses: ["scroll-enter-form"],
            items: [selectEncounterProviderContainer, selectEncounterProviderLocation]
        }]
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
    // *********************************************** END OF FIELDS ********************************************

    // *********************************************** FOOTER VIEW **********************************************
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
    // *********************************************** END OF FOOTER VIEW ***************************************

    // *********************************************** ALERT MESSAGE VIEWS **************************************
    var DeleteMessageView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
        tagName: 'p'
    });
    var CloseMessageView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
        tagName: 'p'
    });
    // *********************************************** END OF ALERT MESSAGE VIEWS *******************************

    // *********************************************** FORM VIEW ************************************************
    var formView = ADK.UI.Form.extend({
        fields: VisitFields,
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
                    var PatientModel = ADK.PatientRecordService.getCurrentPatient();
                    var saveAlertView = new ADK.UI.Notification({
                        title: 'Visit context',
                        icon: 'fa-check',
                        type: 'success',
                        message: 'The visit context was succesfully set.'
                    });
                    var currentStep = this.workflow.options.model.get('steps').findWhere({
                        currentStep: true
                    });
                    this.setProvider(this.model);
                    //get the selected tab (is there a better way to get the selected tab ?)
                    var selectedTab = this.$('a[aria-selected="true"]').attr('aria-controls');
                    switch (selectedTab) {
                        case "New-Visit-tab-panel":
                            {
                                newVisit.set('isHistorical', this.model.get('isHistorical'));
                                newVisit.set('formattedDate', this.model.get('newVisitDate'));
                                newVisit.set('dateTime', moment(this.model.get('newVisitDate') + ' ' + this.model.get('newVisitTime')).format('YYYYMMDDhhmm'));
                                break;
                            }
                    }


                    PatientModel.set({
                        visit: JSON.parse(JSON.stringify(this.model.get('visit')))
                    });
                    //console.log(PatientModel.get('visit'));
                    ADK.SessionStorage.addModel('patient', PatientModel);
                    //check if we're in a workflow
                    if (currentStep) {
                        //check if we're the last step in the flow
                        if (currentStep.get('numberOfSteps') === currentStep.get('currentIndex')) {
                            ADK.UI.Workflow.hide();
                        } else {
                            this.workflow.goToNext();
                        }
                    }
                    saveAlertView.show();
                }
            },
            "click #cancel-btn": function(e) {
                e.preventDefault();
                var deleteAlertView = new ADK.UI.Alert({
                    title: 'Are you sure you want to cancel?',
                    icon: 'fa-exclamation-triangle',
                    messageView: DeleteMessageView,
                    footerView: FooterView
                });
                deleteAlertView.show();
            },
            'click #viewEncouters-btn' : function(e){
                e.preventDefault();
                var encounterFormChannel = ADK.Messaging.getChannel('encounterFormRequestChannel');
                encounterFormChannel.command('openEncounterForm');
            }
        },
        modelEvents: {
            "change:selectEncounterProvider": "setProvider",
            "change:clinicAppointmentsFromDate": "setDates",
            "change:clinicAppointmentsThroughDate": "setDates",
            "change:admissionsModel": "setAdmission",
            "change:appointmentsModel": "setAppointment",
            "change:selectnewencounterLocation": "setnewencounterLocation"
        },
        setAdmission: function(model) {
            model.set('encounterLocation', model.get('admissionsModel').get('locationDisplayName'));
            model.set('visit', model.get('admissionsModel'));
            model.get('visit').set('existingVisit', true);
        },
        setAppointment: function(model) {
            model.set('encounterLocation', model.get('appointmentsModel').get('locationDisplayName'));
            model.set('visit', model.get('appointmentsModel'));
            model.get('visit').set('existingVisit', true);
        },
        setnewencounterLocation: function(model) {
            var locationUid = model.get('selectnewencounterLocation');
            var locationModel = cachedData.locations.findWhere({
                uid: locationUid
            });
            model.set('encounterLocation', locationModel.get('name'));
            newVisit.set(locationModel.attributes);
            //additional fields
            newVisit.set({
                existingVisit: false,
                locationDisplayName: model.get('encounterLocation'),
                locationUid: locationUid
            });
            //set service category
            var locationIEN = locationUid.split(':').pop();
            if (locationIEN) {
                collectionHandler.getServiceCategory(431, 0, this.setServiceCategory);
            }

        },
        setServiceCategory: function(collection) {
            newVisit.set('serviceCategory', collection.models[0].get('serviceCategory'));
        },
        setProvider: function(model) {
            var selectedProvider = cachedData.providers.findWhere({
                code: model.get('selectEncounterProvider')
            });
            if (selectedProvider) {
                model.set('encounterProvider', selectedProvider.get('name'));
                model.get('visit').set('selectedProvider', selectedProvider.toJSON());
            } else {
                model.get('visit').set('selectedProvider', {});
            }
        },
        setDates: function(model) {
            var fromDate = this.model.get('clinicAppointmentsFromDate');
            var toDate = this.model.get('clinicAppointmentsThroughDate');
            //filter the collection
            appointmentsArray.set(collectionHandler.collectionDateFilter(cachedData.appointments, fromDate, toDate));
        },
        initialize: function() {
            //defaults
            var now = moment();
            this.model.set('newVisitDate', now.format('MM/DD/YYYY'));
            newVisit = new newvisitModel();
            this.model.set('visit', newVisit);

            var self = this;
            this._super = ADK.UI.Form.prototype;
            this._super.initialize.apply(this, arguments);
            // the providers picklist
            // collectionHandler.getProviders(function(collection) {
            //     self.updateprovidersPickList(self, collectionHandler.providerlocationsParser(collection));
            //     cachedData.providers.set(collection.models);
            // });
            collectionHandler.getProvidersPicklist(function(collection){
                self.updateprovidersPickList(self, collectionHandler.providerParser(collection));
                cachedData.providers.set(collection.models);
            });
            //locations picklist
            collectionHandler.getLocations(function(collection) {
                self.updatelocationsPickList(self, collectionHandler.locationsParser(collection));
                cachedData.locations.set(collection.models);
            });
            // admissions
            collectionHandler.getAdmissions(function(collection) {
                cachedData.admissions.set(collectionHandler.admissionsParser(collection).models);
                admissionsArray.set(collectionHandler.admissionsParser(collection).models);
            });
            // appointments
            collectionHandler.getAppointments(function(collection) {
                cachedData.appointments.set(collectionHandler.appointmentsParser(collection).models);
                appointmentsArray.set(collectionHandler.appointmentsParser(collection).models);
            });


        },
        render: function() {
            this._super.render.apply(this, arguments);

        },
        updateprovidersPickList: function(form, options) {
            form.callControlFunction({
                controlType: 'select',
                controlName: 'selectEncounterProvider',
                functionName: 'setPickList',
                options: {
                    pickList: options
                }
            });
        },
        updatelocationsPickList: function(form, options) {
            form.callControlFunction({
                controlType: 'select',
                controlName: 'selectnewencounterLocation',
                functionName: 'setPickList',
                options: {
                    pickList: options
                }
            });
        }
    });
    // *********************************************** END OF FORM VIEW *****************************************
    return formView;
});