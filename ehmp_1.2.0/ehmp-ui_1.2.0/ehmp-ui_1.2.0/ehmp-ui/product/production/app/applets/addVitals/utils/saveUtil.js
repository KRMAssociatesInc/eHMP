define([
    'backbone',
    'marionette',
    'underscore',
    'moment',
    'app/applets/addVitals/utils/modelUtils',
    'app/applets/addVitals/utils/dateTimeUtil'
], function(Backbone, Marionette, _, Moment, ModelUtil, DateTimeUtil) {
    'use strict';

    var gridView;

    var modelUtil = ModelUtil,
        dateUtil = DateTimeUtil,
        SaveModel = Backbone.Model.extend({
            urlRoot: '',
        });
    var SaveModelParams = Backbone.Model.extend({
        defaults: {
            'dfn': '',
            //'duz' : '',
            'locIEN': '',
            'dateTime': '',
            'vitals': {}
        }
    });

    var callbacks = {
        error: function(model, resp) {
            //add error banner to modal
            console.log('error');
            console.log(resp);
            modelUtil.errorView.addError(resp.responseText, "Save Failed");
        },
        success: function(model, resp) {
            //close modal...we are done with it
            console.log('success');
            ADK.hideModal();
            setTimeout(function() {
                //gridView.refresh({});
                ADK.Messaging.getChannel('vitals').request('refreshGridView');
            }, 2000);
        }
    };

    var getSaveModel = function(vitalsModel) {

        var saveParams = new SaveModelParams();
        saveParams.set('dfn', vitalsModel.get('dfn'));
        saveParams.set('locIEN', vitalsModel.get('locIEN'));
        var dateTime = dateUtil.getSaveDate(vitalsModel.getDate(), vitalsModel.getTime());
        saveParams.set('dateTime', dateTime);
        var isOnPass = vitalsModel.get('on-pass');
        var quals;
        var vitals = [];
        var that = this;
        vitalsModel.get('items').each(function(model) {
            if (isOnPass) {
                vitals.push({
                    'fileIEN': model.getFileIEN(),
                    'reading': 'Pass'
                });

            } else if (model.isRefused()) {
                vitals.push({
                    'fileIEN': model.getFileIEN(),
                    'reading': 'Refused'
                });

            } else if (model.isUnavailable()) {
                vitals.push({
                    'fileIEN': model.getFileIEN(),
                    'reading': 'Unavailable'
                });
            } else if (model.get('min-reqs')) {
                //special case for pulse oximetry
                //console.log('');
                //console.log(JSON.stringify(model));
                if (model.get('sname') === 'po') {
                    var flowRate = model.get('qual-1-val');
                    var o2conc = model.get('qual-2-val');
                    var retval = {};
                    var f = 'flowRate';
                    var o = 'o2Concentration';
                    retval.fileIEN = model.getFileIEN();
                    retval.reading = model.getReading();
                    if (flowRate) {
                        retval.flowRate = flowRate;
                    }
                    if (o2conc) {
                        retval.o2Concentration = o2conc;
                    }
                    retval.qualifiers = model.getQualifiers();
                    vitals.push(retval);
                } else {
                    vitals.push({
                        'fileIEN': model.getFileIEN(),
                        'reading': model.getReading(),
                        'unit': model.getUnit(),
                        'qualifiers': model.getQualifiers()
                    });
                }
            }
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

        saveParams.set('vitals', vitals);
        var save = new SaveModel({
            param: saveParams
        });
        save.urlRoot = ADK.ResourceService.buildUrl('write-back-save-vitals', {
            pid: id
        });

        console.log(JSON.stringify(save));
        return save;
    };

    var saveVitals = function(vitalsModel) {
        var saveModel = getSaveModel(vitalsModel);
        //console.log("!!!!!!!!  NOT SAVING  THIS IS A TEST !!!!!!!!!!!!");
        saveModel.save(null, callbacks);

    };

    var util = {

        save: function(vitalsModel, GridView) {
            gridView = GridView;
            saveVitals(vitalsModel);
            //this.dummySave(vitalsModel, callbacks);
        },

        dummySave: function(model, callbacks) {
            callbacks.error(model, 'this is a test');

        },

    };

    return util;
});
