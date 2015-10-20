define([
    'backbone',
    'marionette',
    'underscore',
    'moment',
    'app/applets/addOrder/helpers/opDataUtil',
    'app/applets/addOrder/helpers/validation',
    'hbs!app/applets/addOrder/templates/alertTemplate'
], function(Backbone, Marionette, _, Moment, opDataUtil, Validation, alertTemplate) {
    'use strict';

    var strength,
        verb,
        amount,
        route,
        schedule,
        prn,
        supply,
        quantity,
        refills,
        pickup,
        priority,
        comments,
        gatherInput,
        getPreviewString,
        instructions,
        defaultSaveObj,
        saveMed,
        callbacks,
        doseString,
        drugIEN,
        routeIEN,
        patientIEN,
        medName,
        MedModel = Backbone.Model.extend({});

    patientIEN = function() {
        return ADK.PatientRecordService.getCurrentPatient().get('localId');
    };

    callbacks = {
        error: function(model, resp) {
            //add error banner to modal
            //opDataUtil.errorView.addError(resp.responseText, 'Save Failed');
            $('#btn-add-order-accept').html('<span class="sr-only"> Press enter to </span>Accept Order');
            $('#btn-add-order-accept').removeClass('disabled');
            alert(resp.responseText);
        },
        success: function(model, resp) {
            // this is a temporary option to display the order number
            var message = 'Saved Successfully. Order#: ' + resp.data.items.split(';')[0];
            var msgModel = new Backbone.Model();
            msgModel.set('message', message);
            var MessageBox = Backbone.Marionette.ItemView.extend({
                template: alertTemplate
            });
            var messageBox = new MessageBox({
                model: msgModel
            });
            var modalOptions = {
                'size': 'small'
            };

            // Send updated model to meds medChangeChannel
            var channel = ADK.Messaging.getChannel('medicationChannel');
            var deferredResponse = channel.request('refresh');
            var afterSync = function(response) {
                var medicationCollectionHandler = response.medicationCollectionHandler;
                medicationCollectionHandler.fetchAllMeds();
                ADK.UI.Modal.hide();
            };
            //Wait for sync to complete, then update applet
            _.delay(deferredResponse.done, 6000, afterSync);

            var modal = new ADK.UI.Modal({
                view: messageBox,
                options: modalOptions
            });
            modal.show();
        }
    };

    gatherInput = function() {
        var displayObj = opDataUtil.getPreviewValues();
        doseString = displayObj.doseString || '';
        strength = displayObj.strength || '';
        verb = displayObj.verb || '';
        amount = displayObj.amount || '';
        route = displayObj.route || '';
        schedule = displayObj.schedule || '';
        drugIEN = displayObj.drugIEN || '';
        routeIEN = displayObj.routeIEN || '';
        medName = displayObj.medName || '';
        supply = displayObj.supply || '';
        quantity = displayObj.quantity || '';
        refills = displayObj.refills || '';
        pickup = displayObj.pickup || '';
        priority = displayObj.priority || '';

        prn = $('#prn').is(':checked') ? 'AS NEEDED' : '';
        comments = $('#comments').val() || '';

        instructions = (verb && verb + ' ') + (amount && amount + ' ') +
            (route && route + ' ') + (schedule && schedule + ' ') +
            (prn && prn + ' ');
    };

    getPreviewString = function() {
        gatherInput();
        // TODO: Get medication from opDataUtil
        var line1 = '<p>',
            line2 = '<p>',
            line3 = '<p>';
        line1 += medName + ' ' + (strength && strength + ' ');
        line2 += (instructions && instructions + ' ') +
            (comments && comments + ' ');
        line3 += 'Quantity: ' + quantity + ' Refills: ' + refills;

        return line1 + line2 + line3;
    };

    defaultSaveObj = function() {
        gatherInput();
        var m = opDataUtil.model;
        m.set({
            param: {
                'ien': patientIEN(),
                'provider': 10000000226,    //check the visit context for this
                'location': 23,             //check the visit context for this
                'orderDialog': 'PSO OERR',
                'displayGroup': 4,
                'quickOrderDialog': 147,
                'orderID': '',
                'ORDIALOG': {
                    'medIEN': opDataUtil.getMed().get('IEN'),
                    'strength': strength,
                    'drugIEN': drugIEN,
                    'doseString': doseString,
                    'dose': strength,
                    'routeIEN': routeIEN,
                    'schedule': schedule,
                    'supply': supply,
                    'quantity' : quantity,
                    'refills': refills,
                    'pickup': pickup,
                    'priority': priority,
                    'instructions': instructions,
                    'comment': comments,
                    'ORCHECK': 0,
                    'ORTS': 0   //0 for outpatient, 9 for inpatient
                }
            }
        }, {
            'validate': true
        });

        var id = '',
            patient = ADK.PatientRecordService.getCurrentPatient();

        // Get the pid param in the same way as ADK.PatientRecordService.fetchCollection does
        if (patient.get('icn')) {
            id = patient.get('icn');
        } else if (patient.get('pid')) {
            id = patient.get('pid');
        } else {
            id = patient.get('id');
        }

        m.urlRoot = ADK.ResourceService.buildUrl('write-back-outpatient-med-save', {
            pid: id
        });

        return m;
    };

    saveMed = function() {
        var saveModel = defaultSaveObj();

        saveModel.save(null, callbacks);
    };

    var util = {

        buildPreview: function() {
            if (opDataUtil.model.isValid()) {
                $('#previewOrder').html(getPreviewString());
            }
        },
        saveMed: function() {
            saveMed();
        },

        getVisitModel: function() {
            var selectedVisit = new Backbone.Model({
                'visit': ADK.PatientRecordService.getCurrentPatient().get('visit')
            });
            return selectedVisit;
        },
        getModel: function() {
            return MedModel.extend(Validation);
        },
        update: function() {
            defaultSaveObj();
            $('#btn-add-order-accept').prop('disabled', false);
        }
    };

    return util;
});
