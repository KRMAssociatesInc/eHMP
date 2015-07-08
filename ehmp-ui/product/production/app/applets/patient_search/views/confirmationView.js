define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/patient_search/templates/confirmationTemplate",
    "hbs!app/applets/patient_search/templates/acknowledgeTemplate",
    "hbs!app/applets/patient_search/templates/patientFlagTemplate",
    "hbs!app/applets/patient_search/templates/common/blankTemplate"
], function(Backbone, Marionette, _, confirmationTemplate, acknowledgeTemplate, patientFlagTemplate, blankTemplate) {

    var ConfirmationView = Backbone.Marionette.ItemView.extend({
        template: blankTemplate,
        attributes: {
            'id': 'confirmSection'
        },
        events: {
            'click button#ackButton': 'ackPatient',
            'click button#confirmFlaggedPatinetButton': 'confirmPatient',
            'click button#confirmationButton': 'onClickOfConfirm'
        },
        initialize: function(options) {
            this.searchApplet = options.searchApplet;
            this.patientSearchChannel = ADK.Messaging.getChannel('patient_search');
            var that = this;
            var siteOptions = {
                resourceTitle: 'authentication-list',
                cache: false
            };
            siteOptions.onError = function(resp) {};
            siteOptions.onSuccess = function(collection, resp) {
                that.sites = collection;
            };
            ADK.ResourceService.fetchCollection(siteOptions);
        },
        updateSelectedPatientModel: function(patient) {
            this.currentPatient = patient.get('pid');
            this.showLoading();

            if (this.model && this.model.attributes.fullName) {
                this.patientSearchChannel.stopComplying('confirm_' + this.model.get('pid'));
                this.model.clear();
            } else {
                this.model = new Backbone.Model();
            }

            var searchOptions = {
                resourceTitle: 'authorize-authorize',
                patient: patient
            };
            if (patient.has('acknowledged')) {
                patient.unset('acknowledged');
            }

            var self = this;

            searchOptions.onError = function(resp) {
                self.model.set(patient.attributes);

                if ((resp.status == 307) || (resp.status == 308)) {
                    self.model.set({
                        'ackTitle': "Restricted Record",
                        'ackMessage': resp.responseText.replace(/\s*(\*{3}.*?\*{3})|(?:[*\s]*([^*\s]+ ?)[*\s]*)/g, '$2')
                    });
                    self.showConfirm(acknowledgeTemplate);
                } else if (resp.status == 403) {
                    self.showUnAuthorized();
                } else {
                    self.template = _.template('<br /><p class="error-message padding" role="alert" tabindex="0">' + ADK.ErrorMessaging.getMessage(resp.status) + ' </p>');
                    self.render();
                }
            };
            searchOptions.onSuccess = function(resp) {
                self.model.set(patient.attributes);
                self.showConfirm(confirmationTemplate);
            };
            ADK.PatientRecordService.fetchResponseStatus(searchOptions);
        },
        getFullSSN: function(patientModel) {
            var searchOptions = {
                resourceTitle: 'patient-search-pid',
                patient: patientModel
            };
            var self = this;
            searchOptions.onSuccess = function(resp) {
                if (resp.length > 0) {
                    self.model.set('ssn', resp.models[0].get('ssn'));
                    self.render();
                } else {
                    console.log("Error when retrieving full ssn for: " + self.model.get('displayName'));
                    self.render();
                }
            };
            ADK.PatientRecordService.fetchCollection(searchOptions);
        },
        maskSSN: function(patientModel) {
            var maskedSSN = patientModel.get('ssn').toString().replace(/(?=\d{5})\d/gmi, '*');
            patientModel.set('ssn', maskedSSN);
        },
        updateTemplateToBlank: function() {
            this.template = blankTemplate;
            this.render();
            if (!this.$el.parent().hasClass("hidden")) {
                this.$el.parent().addClass("hidden");
            }
        },
        showUnAuthorized: function() {
            this.template = _.template("<div class='unAuthorized well' tabindex='0'><h4 class='text-danger'>You are not authorized to view this record.</h4><h4>Please select another patient.</h4></div>");
            this.render();
            this.$el.find('.unAuthorized').focus();
        },
        showConfirm: function(temp) {
            this.template = temp;
            this.getFullSSN(this.model); //gets the full ssn for the patient's model

            if (this.$el.find('#ackButton').is(':visible')) {
                this.$el.find('#ackMessagePanel').focus();
            } else {
                this.$el.find('#confirmationButton').focus();
            }
            $("#confirmSection").on('affixed.bs.affix', function() {
                $(this).addClass("col-md-3");
                $(this).parent().addClass("noPadding");

            });
            $("#confirmSection").on('affix-top.bs.affix', function() {
                if ($(this).hasClass('col-md-3')) {
                    $(this).removeClass('col-md-3');
                    $(this).parent().removeClass("noPadding");
                }
            });
            $('#confirmSection').affix({
                offset: {
                    top: 227
                }
            });
        },
        showLoading: function() {
            if (this.$el.parent().hasClass("hidden")) {
                this.$el.parent().removeClass("hidden");
            }
            this.template = _.template('<h5 class="loading"><i class="fa fa-spinner fa-spin"></i> Loading...</h5>');
            this.render();
        },
        ackPatient: function(event) {
            this.$el.find('#ackMessagePanel').removeClass('in');
            this.$el.find('#ackButton').addClass('hide');
            this.$el.find('.acknowledged').removeClass('hidden');
            this.$el.find('.patientDetails').removeClass('hidden');
            this.$el.find('#confirmationButton').removeClass('hidden');
            if (this.$el.find('#confirmationButton').is(':visible')) {
                this.$el.find('#ackMsgTitleId').focus();
            }
            this.model.set({
                'acknowledged': true
            });
        },
        onClickOfConfirm: function(event) {
            this.maskSSN(this.model);
            var confirmationView = this;
            var syncOptions = {
                resourceTitle: 'synchronization-status',
                patient: this.model
            };
            syncOptions.onSuccess = function(collection, resp) {};
            syncOptions.onError = function(collection, resp) {
                if (resp.status === 404) {
                    $(event.currentTarget).html("<i class='fa fa-spinner fa-spin'></i> <span> Syncing Patient Data...</span>");
                    $(event.currentTarget).addClass('disabled').attr('disabled');
                    confirmationView.$el.find('#screenReaderSyncing').addClass('sr-only').removeClass('hidden').focus();
                }
            };
            ADK.PatientRecordService.fetchCollection(syncOptions);

            var patientImageModel = new Backbone.Model({
                    image: this.model.get('patientImage')
                });
            ADK.SessionStorage.set.sessionModel('patient-image', patientImageModel);

            $(event.currentTarget).button('loading');
            confirmationView.$el.find('#screenReaderLoading').addClass('sr-only').removeClass('hidden').focus();
            if (this.model.has('acknowledged')) {
                this.model.set({
                    'acknowledged': true
                });
            }

            var searchOptions = {
                resourceTitle: 'patient-record-patient',
                patient: this.model
            };
            searchOptions.onError = function(collection, resp) {
                var message = '';
                if (resp.message !== "") {
                    try {
                        message = JSON.parse(resp.responseText).error.message;
                    } catch (error) {
                        message = ADK.ErrorMessaging.getMessage('default');
                    }
                } else {
                    message = ADK.ErrorMessaging.getMessage(resp.status);
                }
                confirmationView.template = _.template('<br /><p class="error-message padding" role="alert" tabindex="0">' + message + '</p>');
                confirmationView.render();
            };
            searchOptions.onSuccess = function(collection, resp) {
                var modelIndex = _.indexOf(collection.pluck('pid'), confirmationView.currentPatient);
                var domainModel = new Backbone.Model({
                    data: collection,
                    sites: confirmationView.sites
                });
                console.log(collection.models);
                ADK.SessionStorage.set.sessionModel('patient-domain', domainModel);
                if (modelIndex !== -1 || confirmationView.currentPatient === collection.models[0].get('icn')) {
                    if (modelIndex === -1) {
                        modelIndex = 0;
                    }
                    if (confirmationView.model.has('acknowledged') && (confirmationView.model.get('acknowledged') === true)) {
                        var title, message;
                        title = confirmationView.model.get('ackTitle');
                        message = confirmationView.model.get('ackMessage');
                        confirmationView.model = collection.models[modelIndex];
                        confirmationView.model.set({
                            'acknowledged': true,
                            'ackTitle': title,
                            'ackMessage': message,
                        });
                    } else {
                        confirmationView.model = collection.models[modelIndex];
                    }

                    if (patientModel.models[modelIndex].has('patientRecordFlag')) {
                        confirmationView.model.set('patientRecordFlag', _.sortBy(confirmationView.model.attributes.patientRecordFlag, 'category'));
                        confirmationView.showConfirm(patientFlagTemplate);
                    } else {
                        confirmationView.patientSearchChannel.command('confirm_' + confirmationView.currentPatient);
                    }
                }
            };
            this.searchApplet.closeButtonView.model.clear();
            this.searchApplet.closeButtonView.render();

            this.patientSearchChannel.comply('confirm_' + this.model.get('pid'), function() {
                confirmationView.confirmPatient(event);
            });

            var patientModel = ADK.PatientRecordService.fetchCollection(searchOptions);
        },

        setPatientStatusClass: function(patient) {
            var patientType = 'Outpatient';
            if (patient.get('admissionUid') && patient.get('admissionUid') !== null) {
                patientType = 'Inpatient';
            }
            patient.set('patientStatusClass', patientType);
            return patient;
        },
        confirmPatient: function(event) {
            var patient = this.model;
            console.log('confirmationView.confirmPatient');
            console.log('   name: ' + patient.get('displayName'));
            console.log('   pid: ' + patient.get('pid'));
            console.log('   admissionUid: ' + patient.get('admissionUid'));
            this.searchApplet.resetModels();
            patient = this.setPatientStatusClass(patient);

            // update CCOW session with newly selected patient context
            if ("ActiveXObject" in window && ADK.CCOWService.getCcowStatus() === 'Connected') {
                ADK.CCOWService.setContext(patient);
                this.updateTemplateToBlank();
            }

            ADK.UserDefinedScreens.screensConfigNullCheck();
            ADK.Messaging.trigger("patient:selected", patient);
            ADK.Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen, {
                trigger: true
            });
        }
    });

    return ConfirmationView;
});
