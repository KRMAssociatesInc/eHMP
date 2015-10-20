define([
    "underscore",
    "app/applets/add_nonVA_med/opData/opDataUtil",
    "app/applets/add_nonVA_med/utils/validation",
    "moment",
    'backbone'
], function(_, opDataUtil, Validation, Moment, Backbone) {
    'use strict';

    var strength,
        verb,
        amount,
        dose,
        route,
        schedule,
        prn,
        comments,
        definedComments,
        startDate,
        gatherInput,
        getPreviewString,
        instructions,
        defaultSaveObj,
        saveMed,
        callbacks,
        doseString,
        isEdit,
        doseIEN,
        routeIEN,
        patientIEN,
        medName,
        providerDuz,
        locationUid,
        NonVAModel = Backbone.Model.extend({});

    patientIEN = function() {
        return ADK.PatientRecordService.getCurrentPatient().get('localId');
    };

    providerDuz = function() {
        var userSession = ADK.UserService.getUserSession();
        return userSession.get('duz')[userSession.get('site')];
    };

    locationUid = function() {
        return ADK.PatientRecordService.getCurrentPatient().get('visit').locationUid.split(':').splice(-1)[0];
    };

    callbacks = {
        error: function(model, resp) {
            //add error banner to modal
            opDataUtil.errorView.addError(resp.responseText, "Save Failed");
        },
        success: function(model, resp) {
            // Send updated model to meds medChangeChannel
            var channel = ADK.Messaging.getChannel('medicationChannel');
            var deferredResponse = channel.request('refresh');
            var afterSync = function(response) {
                // Wait for sync to complete, then update applet
                var medicationCollectionHandler = response.medicationCollectionHandler;
                medicationCollectionHandler.fetchAllMeds();
                ADK.UI.Modal.hide();
            };
            _.delay(deferredResponse.done, 6000, afterSync);
        }
    };

    gatherInput = function() {
        var displayObj = opDataUtil.getPreviewValues();
        doseString = displayObj.doseString || '';
        strength = displayObj.strength || '';
        verb = displayObj.verb || '';
        dose = displayObj.dose || '';
        amount = displayObj.amount || '';
        route = displayObj.route || '';
        schedule = displayObj.schedule || '';
        doseIEN = displayObj.doseIEN || '';
        routeIEN = displayObj.routeIEN || '';
        medName = displayObj.medName || '';
        prn = $('#prn').is(':checked') ? 'PRN' : '';
        comments = $('#comments').val() || '';
        definedComments = [];

        if ($('#notRecommended').is(':checked')) {
            definedComments.push('<p>' + $("label[for=notRecommended]").text());
        }
        if ($('#recommended').is(':checked')) {
            definedComments.push('<p>' + $("label[for=recommended]").text());
        }
        if ($('#nonVApharmacy').is(':checked')) {
            definedComments.push('<p>' + $("label[for=nonVApharmacy]").text());
        }
        if ($('#nonVAprovider').is(':checked')) {
            definedComments.push('<p>' + $("label[for=nonVAprovider]").text());
        }

        startDate = $('#startDate').val();

        instructions = (verb && verb + ' ') + (amount && amount + ' ') +
            (route && route + ' ') + (schedule && schedule + ' ') +
            (prn && prn + ' ');
    };

    getPreviewString = function() {
        gatherInput();
        var line1 = '<p>',
            line2 = '<p>',
            line3 = '<p>';
        line1 += medName;
        line2 += strength;
        line3 += (instructions && instructions + ' ') +
            (startDate && 'Start Date: ' + startDate + ' ') +
            (definedComments && definedComments + '\t') +
            (comments && comments + ' ');

        return line1 + line2 + line3;
    };

    defaultSaveObj = function() {
        // This call may be unnecessary since it is via 'getPreviewString' on change.
        gatherInput();
        // var m = new NonVAModel();
        var m = opDataUtil.model;
        m.set({
            // TODO: Hardcoded values are marked below with //***
            param: {
                "ien": patientIEN(),
                "provider": providerDuz(), //*** Currently using the current user. May need to update to the selected provider
                "location": locationUid(),
                "orderDialog": "PSH OERR",
                "displayGroup": 48,
                "quickOrderDialog": 389,
                "orderID": opDataUtil.getMed().get('orderUid') || '',
                "ORDIALOG": {
                    "medIEN": opDataUtil.getMed().get('IEN'),
                    "strength": strength,
                    "doseIEN": doseIEN,
                    "doseString": doseString,
                    "dose": dose,
                    "routeIEN": routeIEN,
                    "schedule": schedule,
                    "instructions": instructions,
                    "comment": comments,
                    "definedComments": _.map(definedComments, function(str) {
                        return str.replace(/<p>/g, '');
                    }),
                    "ORCHECK": 0, //*** This seems to always be '0' in cprs
                    "ORTS": 9, //*** This seems to always be '9' in cprs
                    "startDate": startDate,
                    "date": new Moment(startDate).format('YYYYMMDD')
                }
            }
        }, {
            'validate': true
        });

        var id = '',
            patient = ADK.PatientRecordService.getCurrentPatient();

        // Get the pid param in the same way as ADK.PatientRecordService.fetchCollection does
        if (patient.get("icn")) {
            id = patient.get("icn");
        } else if (patient.get("pid")) {
            id = patient.get("pid");
        } else {
            id = patient.get("id");
        }

        m.urlRoot = ADK.ResourceService.buildUrl('write-back-save-nonVA-med', {
            pid: id
        });


        return m;
    };

    saveMed = function() {
        var saveModel = defaultSaveObj();
        saveModel.save(null, callbacks);
    };

    function isEmpty(obj) {
        return typeof obj === 'undefined';
    }

    var util = {
        buildPreview: function() {
            if (opDataUtil.model.isValid()) {
                $('#previewOrder').html(getPreviewString());
            }
        },
        saveMed: function() {
            saveMed();
        },
        setIsEdit: function(edit) {
            isEdit = edit || false;
        },
        isEdit: function() {
            return isEdit;
        },
        getVisitModel: function() {
            var selectedVisit = new Backbone.Model({
                'visit': ADK.PatientRecordService.getCurrentPatient().get('visit')
            });
            return selectedVisit;
        },
        getModel: function() {
            return NonVAModel.extend(Validation);
        },
        update: function() {
            opDataUtil.model.hideClientErrors();
            defaultSaveObj();
            if (opDataUtil.model.isValid()) {
                $('#btn-add-non-va-med-accept').prop('disabled', false);
            } else {
                $('#btn-add-non-va-med-accept').prop('disabled', true);
            }
        }
    };

    return util;
});
