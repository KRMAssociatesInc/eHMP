define([
    "underscore",
    "moment",
    "app/applets/addAllergy/utils/validation",
    "app/applets/addAllergy/models/symptomsCollection"
], function(_, Moment, Validation, SymptomsCollection) {
    'use strict';

    var userSession,
        AllergenModel = Backbone.Model
        .extend(Validation)
        .extend({
            initialize: function() {
                this.initializeValidation();
                this.get('param').symptoms.on('all', function() {
                    this.validateModel(this);
                    this.trigger('change', this);
                }, this);
            },
            urlRoot: function() {
                var patientRecord = ADK.PatientRecordService.getCurrentPatient();
                return ADK.ResourceService.buildUrl('write-back-save-allergy', {
                    pid: patientRecord.get('icn') || patientRecord.get('pid') || patientRecord.get('id')
                });
            },
            defaults: function() {
                userSession = ADK.UserService.getUserSession();
                return {
                    'originatorName': userSession.get('firstname') + ' ' + userSession.get('lastname'),
                    'historicalOrObserved': '',
                    'nature': '',
                    'obs-date': '',
                    'obs-time': '',
                    'param': {
                        'localId': ADK.PatientRecordService.getCurrentPatient().get('localId'),
                        'allergyName': '',
                        'natureOfReaction': '',
                        'cmtText': '',
                        'symptoms': new SymptomsCollection(),
                        'severity': '',
                        'eventDateTime': ''
                    }
                };
            },
            validation: {
                'historicalOrObserved': {
                    required: true
                },
                'obs-date': {
                    message: 'Please enter a valid date.',

                    fn: function(value, model) {
                        if (model.get('historicalOrObserved') === "h^HISTORICAL") {
                            return true;
                        }
                        var date = ADK.utils.formatDate(value, ADK.utils.dateUtils.defaultOptions().format, ADK.utils.dateUtils.defaultOptions().placeholder),
                            absoluteZeroDate = -5364662400000, //this is 1800-01-01 which is the oldest date the system can accept
                            myMatch = value.match(ADK.utils.dateUtils.defaultOptions().regex) || [];
                        if (date && (Date.parse(date) < absoluteZeroDate || (myMatch.length < 1 || myMatch[0] !== value))) {
                            return false;
                        }
                        return true;
                    },
                    required: {
                        message: '', //a default mesage is used if one is not specified
                        fn: function(value, model) {
                            if (model.get('historicalOrObserved') === "o^OBSERVED" && !value) {
                                return false;
                            }
                            return true;
                        }
                    }
                },
                'obs-time': {
                    message: 'Future time not allowed',
                    fn: function(value, model) {
                        if (model.get('historicalOrObserved') === "h^HISTORICAL" || value.length === 0) {
                            return true;
                        }
                        var obsDate = new Moment(model.get('obs-date') + ' ' + value + 'm');
                        if (obsDate.isAfter(new Moment())) {
                            return false;
                        }
                        return true;
                    }
                },
                'nature': {
                    required: true
                },
                'param.severity': {
                    required: {
                        fn: function(value, model) {
                            if (model.get('historicalOrObserved') === "o^OBSERVED" && !value) {
                                return false;
                            }
                            return true;
                        }
                    }
                },
                'param.symptoms': {
                    required: {
                        fn: function(value, model) {
                            if (model.get('historicalOrObserved') === "o^OBSERVED" && value.length === 0) {
                                return false;
                            }
                            return true;
                        }
                    }
                },
            }
        });

    return AllergenModel;

});
