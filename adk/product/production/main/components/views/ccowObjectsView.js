define([
    'backbone',
    'marionette',
    'underscore'
], function (Backbone, Marionette, _) {
    'use strict';

    var CCOWObjectsModel = Backbone.Model.extend({});

    var contextorControl;

    var pendingChangeCheck = function (contextItems) {
        console.log("Pending", contextItems);
    };

    var commitChange = function (contextItems) {
        if (ADK.CCOWService.getCcowStatus() !== 'Connected') {
            return;
        }
        var dfn = ADK.CCOWService.getDfnFromContextItems();
        ADK.CCOWService.ensureICNforPatient(dfn, function (ccowObject) {
            navigateToPatient(ccowObject.pid);
        });
    };

    var setPatientStatusClass = function (patient) {
        var patientType = 'Outpatient';
        if (patient.get('admissionUid') && patient.get('admissionUid') !== null) {
            patientType = 'Inpatient';
        }
        patient.set('patientStatusClass', patientType);
        return patient;
    };


    var navigateToDefaultScreen = function (newPatient) {

            var dataToBeSent = newPatient.attributes;
            var patientImageUrl = ADK.ResourceService.buildUrl('patientphoto-getPatientPhoto', {
                pid: dataToBeSent.icn
            });
            $.ajax({
                    url: patientImageUrl,
                    success: function(data, statusMessage, xhr) {
                        var base64PatientPhoto = 'data:image/jpeg;base64,'+ data +'';
                        var patientImageModel = new Backbone.Model({
                                image: base64PatientPhoto
                        });
                        ADK.SessionStorage.set.sessionModel('patient-image', patientImageModel);
            
                        var patientType = 'Outpatient';
                        if (newPatient.get('admissionUid') && newPatient.get('admissionUid') !== null) {
                            patientType = 'Inpatient';
                        }
                        newPatient.set('patientStatusClass', patientType);
            
                        ADK.SessionStorage.set.sessionModel('patient', newPatient);
            
                        ADK.UserDefinedScreens.screensConfigNullCheck();
                        ADK.Messaging.trigger("patient:selected", newPatient);
                        ADK.Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen, {
                            trigger: true
                        });
                    }
            });
    };


    var navigateToPatient = function (contextLocalId) {
        if (contextLocalId) {
            var currentPatient = ADK.SessionStorage.getModel('patient');
            var currentPatientId = currentPatient.get('icn') ? currentPatient.get('icn') : currentPatient.get('pid');
            var patientSearchChannel = ADK.Messaging.getChannel('patient_search');
            patientSearchChannel.comply('confirm_' + contextLocalId, function (patient) {
                navigateToDefaultScreen(patient);
            });
            if (currentPatientId !== contextLocalId) {
                var searchOptions = {
                    resourceTitle: 'patient-record-patient',
                    criteria: {
                        pid: contextLocalId
                    }
                };

                searchOptions.onError = function (collection, resp) {};

                searchOptions.onSuccess = function (collection, resp) {
                    var siteOptions = {
                        resourceTitle: 'authentication-list',
                        cache: false
                    };
                    siteOptions.onError = function (resp) {
                        console.log(resp);
                    };
                    siteOptions.onSuccess = function (collection2, resp) {
                        var domainModel = new Backbone.Model({
                            data: collection,
                            sites: collection2
                        });

                        ADK.SessionStorage.set.sessionModel('patient-domain', domainModel);
                        var modelIndex = _.indexOf(collection.pluck('pid'), contextLocalId);

                        if (modelIndex !== -1 || contextLocalId === collection.models[0].get('icn')) {
                            if (modelIndex === -1) {
                                modelIndex = 0;
                            }
                        }

                        var patient = collection.models[modelIndex];
                        patientSearchChannel.command('confirm_' + contextLocalId, patient);

                    };

                    ADK.ResourceService.fetchCollection(siteOptions);

                };


                ADK.ResourceService.fetchCollection(searchOptions);


            }
        }
    };



    var CCOWObjectsView = Backbone.Marionette.ItemView.extend({
        template: _.template(''),
        initialize: function (screen) {
            this.model = new CCOWObjectsModel();
            this.ccowSession = ADK.SessionStorage.getModel('ccow');
            try {
                contextorControl = new ActiveXObject("Sentillion.Contextor.1");

            } catch (e) {
                this.ccowSession.set('status', 'NotConnected');
                this.model.set('failed', 'yes');
            }
            //console.log(this.ccowSession.get('status'));
            if (this.ccowSession.get('status') === 'NotConnected') {
                return;
            }
            var state = this.ccowSession.get('state');

            if (!this.model.get('failed')) {
                if (!state || state === 'initial') {
                    this.runContext();
                } else if (state === 'listening') {
                    this.loadModelFromSession();
                }
            }
        },

        loadModelFromSession: function () {
            this.model.set('contextManagerUrl', this.ccowSession.get('contextManagerUrl'));
            this.model.set('contextCoupon', this.ccowSession.get('contextCoupon'));
            this.model.set('participantCoupon', this.ccowSession.get('participantCoupon'));
        },
        persistCcowSession: function () {
            ADK.SessionStorage.clear('ccow');
            ADK.SessionStorage.addModel('ccow', this.ccowSession);
        },
        loadSessionObject: function (ccowObject) {
            var self = this;
            self.ccowSession.set('pid', ccowObject.pid);
            self.ccowSession.set('state', 'listening');
            self.ccowSession.set('status', 'Connected');
            self.persistCcowSession();
        },
        runContext: function () {
            var self = this;
            var runContextManager = $.Deferred();
            var isSsoSession = ADK.SessionStorage.getModel('SSO').get('CPRSHostIP');
            var loginDeferred = $.Deferred();
            self.ccowSession.set('state', 'initial');

            loginDeferred.done(function (ccowObject) {
                self.loadSessionObject(ccowObject);
            });
            loginDeferred.fail(function () {
                ADK.Messaging.trigger('user:sessionEnd');
                self.ccowSession.set('status', 'NotConnected');
                self.persistCcowSession();
            });

            runContextManager.fail(function () {
                ADK.SessionStorage.clear('SSO');
                self.ccowSession.set('status', 'NotConnected');
                self.persistCcowSession();
                if (isSsoSession) {
                    window.location.href = '/';
                }
            });


            runContextManager.done(function () {
                self.ccowSession.set('state', 'ranlocator');
                var dfn = ADK.CCOWService.getDfnFromContextItems();
                self.persistCcowSession();
                
                //CCOW CONNECTION
                ADK.CCOWService.ensureICNforPatient(dfn, function (ccowObject) {
                    navigateToPatient(ccowObject.pid);
                });
            });

            if (contextorControl.State === 1) {
                var hasError = false;
                try {
                    contextorControl.Run("eHMP", "", true);
                } catch (e) {
                    try {
                        contextorControl.Run("eHMP#", "", true);
                    } catch (e2) {
                        hasError = true;
                    }
                } finally {
                    if (hasError) runContextManager.reject();
                    /* jshint ignore:start */
                    eval('function contextorControl::Pending(contextItems) { pendingChangeCheck(contextItems); }');
                    eval('function contextorControl::Committed(contextItems) { commitChange(contextItems); }');
                    /* jshint ignore:end */
                    ADK.CCOWService.contextorControl = contextorControl;
                    runContextManager.resolve();
                }
            }
        }



    });

    return CCOWObjectsView;
});