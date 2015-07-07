define([
    "backbone",
    "jquery",
    "api/ResourceService",
    "api/Messaging",
    "api/Navigation",
    "api/SessionStorage",
    "api/UserService",
    "main/components/views/ccowModalView",
    'main/ScreenBuilder',
    'api/UserDefinedScreens'
], function(Backbone, $, ResourceService, Messaging, Navigation, SessionStorage, UserService, ccowModalView, ScreenBuilder, UserDefinedScreens) {
    'use strict';

    var ScreensManifest = Messaging.request('ScreensManifest');

    var CCOWService = {
        navigateToPatient: function (contextLocalId) {
            var self = this;
            if (contextLocalId) {
                var currentPatient = SessionStorage.getModel('patient');
                var currentPatientId = currentPatient.get('icn') ? currentPatient.get('icn') : currentPatient.get('pid');
                console.log(currentPatientId);
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
                        siteOptions.onError = function(resp) {};
                        siteOptions.onSuccess = function(collection2, resp) {
                            var domainModel = new Backbone.Model({
                                data: collection,
                                sites: collection2
                            });
                            SessionStorage.set.sessionModel('patient-domain', domainModel);
                            var patient = collection.models[0];
                            Messaging.getChannel('patient_search').command('confirm_' + patient.get("pid"));
                            SessionStorage.set.sessionModel('patient', patient);
                            var patientType = 'Outpatient';
                            if (patient.get('admissionUid') && patient.get('admissionUid') !== null) {
                                patientType = 'Inpatient';
                            }
                            // this needs to be set for the case of changing a patient in CPRS and reloading it in eHMP
                            if (patient.get("pid") === null) {
                                patient.set("pid", currentPatientId);
                            }
                            patient.set('patientStatusClass', patientType);
                            UserDefinedScreens.screensConfigNullCheck();
                            var promise = UserDefinedScreens.getDefaultScreenIdFromScreenConfig();
                            promise.done(function(screenName) {
                                Messaging.trigger("patient:selected", patient);
                                Navigation.navigate(screenName, {
                                    trigger: true
                                });
                            });
                        };
                        ResourceService.fetchCollection(siteOptions);
                    };
                    ResourceService.fetchCollection(searchOptions);
                }
            }
        },
        loadPatientOnCoverSheet: function (patient) {
            Messaging.trigger("patient:selected", patient);
            Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen);
        },
        handleContextChange: function () {
            var ccowModel = SessionStorage.getModel('ccow');
            var self = this;
            if (ccowModel.get('blob') && this.getCcowStatus() === 'Connected') {
                $.ajax({
                    url: ResourceService.buildUrl('vergencevaultproxy-getNewContext'),
                    type: "POST",
                    contentType: 'application/json',
                    dataType: 'json',
                    processData: false,
                    data: JSON.stringify({
                        blob: ccowModel.get('blob'),
                        site: UserService.getUserSession().get('site')
                    }),
                    success: function (response) {
                        ccowModel.set('contextItems', response.contextItems);
                        ccowModel.set('pid', response.pid);
                        ccowModel.set('blob', response.blob);
                        SessionStorage.clear('ccow');
                        SessionStorage.addModel('ccow', ccowModel);
                        self.navigateToPatient(response.pid);
                    },
                    error: function (response) {
                        self.updateCcowStatus('Disconnected', response.blob);
                    }
                });
            }
        },
        setContext: function (patient) {
            var ccowModel = SessionStorage.getModel('ccow');
            var self = this;
            var patientDfn = patient.get('localId');
            var formattedPatientName = self.formatPatientNameForContext(patient.get('displayName'));
            var pid = patient.get('icn') ? patient.get('icn') : patient.get('pid');

            if (ccowModel.get('blob') && ccowModel.get('status') === 'Connected') {
                $.ajax({
                    url: ResourceService.buildUrl('vergencevaultproxy-addNewPatient'),
                    type: "POST",
                    contentType: 'application/json',
                    dataType: 'json',
                    processData: false,
                    data: JSON.stringify({
                        blob: ccowModel.get('blob'),
                        name: formattedPatientName,
                        dfn: patientDfn,
                        site: UserService.getUserSession().get('site')
                    }),
                    success: function (response) {
                        self.updateCcowStatus('Connected', response.blob);

                        if (response.contextCoupon) {
                            ccowModalView.activateModal(self, patient, response.msg[0]);
                        } else {
                            self.updateContextItems(pid, patientDfn, formattedPatientName);
                            self.loadPatientOnCoverSheet(patient);
                        }
                    },
                    error: function (response) {
                        self.updateCcowStatus('Disconnected', response.blob);
                        self.loadPatientOnCoverSheet(patient);
                    }
                });
            }
        },
        connectToContext: function (blob, participantUrl, contextUrl, successCallback) {
            var blobValue = blob || '';
            var self = this;

            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-setContext'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    participantUrl: participantUrl,
                    mContextManagerUrl: contextUrl,
                    blob: blobValue,
                    site: UserService.getUserSession().get('site')
                }),
                success: function (response) {
                    successCallback(response);
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected', response.blob);
                }
            });
        },
        formatPatientNameForContext: function (name) {
            var formattedName = name.replace(',', '^');
            formattedName = formattedName + '^^^^';
            return formattedName;
        },
        updateContextItems: function (pid, localId, name) {
            var ccowModel = SessionStorage.getModel('ccow');
            ccowModel.set('pid', pid);
            var contextItems = ccowModel.get('contextItems');

            for (var i = 0; i < contextItems.length; i++) {
                if (contextItems[i].name.indexOf('patient.id.mrn.dfn') > -1) {
                    contextItems[i].value = localId;
                } else if (contextItems[i].name.indexOf('patient.co.patientname') > -1) {
                    contextItems[i].value = name;
                }
            }

            ccowModel.set('contextItems', contextItems);
            SessionStorage.clear('ccow');
            SessionStorage.addModel('ccow', ccowModel);
        },
        cancelContextChange: function (successCallback, errorCallback) {
            var self = this;

            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-cancelContextChange'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    blob: SessionStorage.getModel('ccow').get('blob')
                }),
                success: function (response) {
                    self.updateCcowStatus('Connected', response.blob);
                    successCallback();
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected', response.blob);
                    errorCallback();
                }
            });
        },
        suspendContext: function (successCallback) {
            var self = this;
            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-suspend'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    blob: SessionStorage.getModel('ccow').get('blob')
                }),
                success: function (response) {
                    self.updateCcowStatus('Suspended', response.blob);
                    successCallback();
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected', response.blob);
                }
            });
        },
        breakContextLink: function (successCallback, errorCallback) {
            var self = this;
            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-breakContext'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    blob: SessionStorage.getModel('ccow').get('blob')
                }),
                success: function (response) {
                    self.updateCcowStatus('Suspended', response.blob);
                    successCallback();
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected', response.blob);
                    errorCallback();
                }
            });
        },
        resumeContext: function (successCallback) {
            var self = this;
            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-resume'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    blob: SessionStorage.getModel('ccow').get('blob')
                }),
                success: function (response) {
                    self.updateCcowStatus('Connected', response.blob);
                    successCallback();
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected', response.blob);
                }
            });
        },
        forceContextChange: function (successCallback, errorCallback) {
            var self = this;

            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-commitContextChange'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    blob: SessionStorage.getModel('ccow').get('blob')
                }),
                success: function (response) {
                    self.updateCcowStatus('Connected', response.blob);
                    successCallback();
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected', response.blob);
                    errorCallback();
                }
            });
        },
        updateCcowStatus: function (status, blob) {
            var ccowModel = SessionStorage.getModel('ccow');
            ccowModel.set('status', status);

            if (blob) {
                ccowModel.set('blob', blob);
            }

            SessionStorage.clear('ccow');
            SessionStorage.addModel('ccow', ccowModel);
            Messaging.trigger('ccow:updatedStatus', status);
        },
        getCcowStatus: function () {
            return SessionStorage.getModel('ccow').get('status');
        },
        quit: function () {
            var self = this;
            var blob = SessionStorage.getModel('ccow').get('blob');

            if (blob) {
                $.ajax({
                    url: ResourceService.buildUrl('vergencevaultproxy-stopContext'),
                    type: "POST",
                    contentType: 'application/json',
                    dataType: 'json',
                    processData: false,
                    async: false,
                    data: JSON.stringify({
                        blob: blob
                    }),
                    success: function (response) {
                        SessionStorage.clear('ccow');
                        SessionStorage.clear('SSO');
                    },
                    error: function (response) {}
                });
            }
        }
    };

    if ("ActiveXObject" in window) {
        // This function gets called when you refresh the page - we need to destroy the CCOW session but this may cause some issues if they try to refresh the cover sheet
        window.onbeforeunload = function () {
            CCOWService.quit();
        };

        Messaging.on('user:beginSessionEnd', CCOWService.quit);
    }

    return CCOWService;
});
