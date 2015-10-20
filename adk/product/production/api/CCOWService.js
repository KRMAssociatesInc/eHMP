define([
    "backbone",
    "jquery",
    "api/ResourceService",
    "api/SessionStorage",
    "api/UserService",
    "api/Messaging",
    "main/components/views/ccowModalView",
    "api/UserDefinedScreens"
], function (Backbone, $, ResourceService, SessionStorage, UserService, Messaging, ccowModalView, UserDefinedScreens) {
    'use strict';

    var CCOWService = {
        contextorControl: null,

        getTokenFromContextItems: function () {
            var contextItems = this.contextorControl.CurrentContext;
            var token = "~~TOK~~";
            var coll = new Enumerator(contextItems);
            if (!coll.atEnd()) {
                for (; !coll.atEnd(); coll.moveNext()) {
                    var itemName = coll.item().name;
                    var itemValue = coll.item().value;
                    if (itemName.indexOf("vistatoken") > 0) token += itemValue;
                }
            }
            return token;
        },
        getDfnFromContextItems: function () {
            var contextItems = this.contextorControl.CurrentContext;
            var dfn;
            var coll = new Enumerator(contextItems);
            if (!coll.atEnd()) {
                for (; !coll.atEnd(); coll.moveNext()) {
                    var itemName = coll.item().name;
                    var itemValue = coll.item().value;
                    if (itemName.indexOf("dfn") > 0) dfn = itemValue;
                }
            }
            return dfn;
        },
        loadSessionObject: function (ccowObject) {
            var ccowModel = SessionStorage.getModel('ccow');
            ccowModel.set('pid', ccowObject.pid);
            ccowModel.set('state', 'listening');
            ccowModel.set('status', 'Connected');
            this.persistCcowSession(ccowModel);
            //this.navigateToPatient(ccowObject.pid);

        },
        persistCcowSession: function (ccowModel) {
            SessionStorage.clear('ccow');
            SessionStorage.addModel('ccow', ccowModel);
        },

        //Ensure ICN for patient
        ensureICNforPatient: function (dfn, callback) {
            var self = this;

            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-geticnforccow'),
                type: "POST",
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                data: JSON.stringify({
                    dfn: dfn,
                    site: UserService.getUserSession().get('site')
                }),
                success: function (response) {
                    self.loadSessionObject(response);
                    if (callback && typeof callback == 'function') {
                        callback(response);
                    }
                },
                error: function (response) {
                    self.updateCcowStatus('Disconnected');
                }
            });
        },

        handleContextChange: function (patient, callback) {
            var self = this;
            //console.log(self.contextorControl, self.contextorControl.State);
            if (self.contextorControl && self.contextorControl.State === 2) {
                try {
                    var nameItem = new ActiveXObject("Sentillion.ContextItem.1");
                    var localIdItem = new ActiveXObject("Sentillion.ContextItem.1");
                    var nationalIdItem = new ActiveXObject("Sentillion.ContextItem.1");
                    var contextCollection = new ActiveXObject("Sentillion.ContextItemCollection.1");
                
                    //patient name
                    nameItem.name = 'Patient.co.PatientName';
                    nameItem.value = patient.get('displayName') + '^^^^';
                    contextCollection.Add(nameItem);
                    self.getSiteInfo(function (response) {
                        //console.log('Site Info Response', response);
                        if (response.error) {
                            self.updateCcowStatus('Disconnected', '');
                        } else {
                            self.updateCcowStatus('Connected');
                        }
                        
                        //Check if vault is down
                        var tempContextControl = new ActiveXObject("Sentillion.Contextor.1");
                        try
                        {
                            tempContextControl.Run("eHMP#", "", true);
                            tempContextControl.Suspend();
                        }
                        catch (ex) {
                            self.updateCcowStatus('Disconnected');  
                            return callback();   
                        }
                        //Vault is up...continue
                        
                        self.contextorControl.StartContextChange();

                        //dfn
                        localIdItem.name = 'Patient.id.MRN.DFN_' + response.Site.division;
                        if (!response.Site.production) localIdItem.name = localIdItem.name + '_TEST';
                        localIdItem.value = patient.get('pid');
                        contextCollection.Add(localIdItem);
                        //icn
                        if (patient.get('icn') !== null) {
                            nationalIdItem.name = 'Patient.id.MRN.NationalIDNumber';
                            if (!response.Site.production) nationalIdItem.name = nationalIdItem.name + '_TEST';
                            nationalIdItem.value = patient.get('icn');
                            contextCollection.Add(nationalIdItem);
                        }
                        var coll = new Enumerator(contextCollection);
                        for (; !coll.atEnd(); coll.moveNext()) {
                            var itemName = coll.item().name;
                            var itemValue = coll.item().value;
                            //console.log("in ccowChangePatient " + itemName + ": " + itemValue);
                        }
                        try{
                            var contextResponse = self.contextorControl.EndContextChange(true, contextCollection);
                            if (contextResponse === 1) {
                                callback();
                            } else if (contextResponse === 2) {
                                //TODO: Go back to previous patient default screen
                                callback(true);
                            } else {
                                self.updateCcowStatus('Suspended');
                                callback();
                            }
                        }
                        catch (e1) {  
                            self.updateCcowStatus('Disconnected');  
                            callback();                      
                        }

                    });
                } catch (e) {
                    self.updateCcowStatus('Disconnected');
                    callback();
                }
            }
        },

        getSiteInfo: function (callback) {
            $.ajax({
                url: ResourceService.buildUrl('vergencevaultproxy-getSiteInfo'),
                contentType: 'application/json',
                data: {
                    site: UserService.getUserSession().get('site')
                },
                success: function (response) {
                    callback(response);
                },
                error: function (response) {
                    callback({
                        error: 'Site Info cannot be obtained'
                    });
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
        suspendContext: function (successCallback) {
            try {
                this.contextorControl.Suspend();
                this.updateCcowStatus('Suspended');
                successCallback && successCallback();
            } catch (e) {
                this.updateCcowStatus('Disconnected');
            }

        },
        breakContextLink: function (successCallback, errorCallback) {
            this.contextorControl.Suspend();
            try {
                this.updateCcowStatus('Suspended');
                successCallback && successCallback();
            } catch (e) {
                this.updateCcowStatus('Disconnected');
                errorCallback();
            }

        },
        resumeContext: function (successCallback) {
            this.contextorControl.Resume();
            try {
                this.updateCcowStatus('Connected');
                successCallback && successCallback();
            } catch (e) {
                this.updateCcowStatus('Disconnected');
            }

        },
        updateCcowStatus: function (status) {
            //console.log('updateCcowStatus');
            var ccowModel = SessionStorage.getModel('ccow');
            ccowModel.set('status', status);
            SessionStorage.clear('ccow');
            SessionStorage.addModel('ccow', ccowModel);
            Messaging.trigger('ccow:updatedStatus', status);
        },
        getCcowStatus: function () {
            return SessionStorage.getModel('ccow').get('status');
        },
        quit: function () {
            if (this.contextorControl && this.contextorControl.State === 2) {
                this.contextorControl.Suspend();
            }
        }
    };

    if ("ActiveXObject" in window) {
        window.onbeforeunload = function () {
            var ccowModel = SessionStorage.getModel('ccow');
            ccowModel.set('state', 'initial');
            SessionStorage.clear('ccow');
            SessionStorage.addModel('ccow', ccowModel);
            CCOWService.quit();
        };

        Messaging.on('user:beginSessionEnd', function () {
            try
            {    
                if (CCOWService.contextorControl && CCOWService.contextorControl.State === 2) {
                    CCOWService.contextorControl.Suspend();
                }
            } catch (e) {
                //Do nothing as vault server may be down
            }
            
        });
    }

    return CCOWService;
});