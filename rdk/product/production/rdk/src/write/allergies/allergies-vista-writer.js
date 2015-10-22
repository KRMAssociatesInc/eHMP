'use strict';

var async = require('async');

var _ = require('underscore');
var VistaJS = require('../core/VistaJS');

var filemanDateUtil = require('../../utils/fileman-date-converter');
var nullChecker = require('../../utils/nullchecker');
var paramUtil = require('../../utils/param-converter');
var allergiesConstants = require('./constants');

// TODO: make sure comment is handled

module.exports.create = function(writebackContext, callback) {
    var logger = writebackContext.logger;
    var model = writebackContext.model;


    logger.debug({AllergiesVistaWriterModel: model});
    async.series([function callRPC(callback) {

        var allergies = {
            '"GMRAGNT"': model.allergyName,
            '"GMRATYPE"': '',
            '"GMRANATR"': model.natureOfReaction,
            '"GMRAORIG"': model.dfn,
            '"GMRAORDT"': null,
            '"GMRAOBHX"': model.historicalOrObserved
        };

        //Set GMRACMTS
        if (model.comment !== '') {
            allergies['"GMRACMTS",0'] = '1';
            allergies['"GMRACMTS",1'] = model.comment;
        }

        //Set GMRATYPE
        if (allergies['"GMRANATR"'] === allergiesConstants.GMRANATR_PHARMACOLGICAL) {
            allergies['"GMRATYPE"'] = allergiesConstants.GMRATYPE_DRUG;
        } else {
            allergies['"GMRATYPE"'] = allergiesConstants.GMRATYPE_OTHER;
        }

        //Set GMRAORDT
        var currentTime = new Date();
        allergies['"GMRAORDT"'] = filemanDateUtil.getFilemanDateTime(currentTime);

        //Set GMRASYMP
        allergies['"GMRASYMP",0'] = _.size(model.symptoms).toString();

        _.each(model.symptoms, function (symptom, index) {
            var fileManDT = '';
            var displayDate = '';

            if (!nullChecker.isNullish(symptom.dateTime)) {
                var sympDT = paramUtil.convertWriteBackInputDate(symptom.dateTime);
                fileManDT = filemanDateUtil.getFilemanDateTime(sympDT.toDate());
                displayDate = sympDT.format('MMM DD,YYYY@HH:mm');
            }

            allergies['"GMRASYMP",' + (index + 1)] = symptom.IEN + '^' + symptom.name + '^' + fileManDT + '^' + displayDate + '^';
        });

        //Set GMRACHT
        var eventDateTimeMoment = paramUtil.convertWriteBackInputDate(model.eventDateTime);
        var eventFilemanYear = filemanDateUtil.getFilemanDateWithArgAsStr(eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));

        if (eventFilemanYear !== -1) {
            allergies['"GMRACHT",0'] = '1';
            allergies['"GMRACHT",1'] = eventFilemanYear + '.' + eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_TIME_FORMAT);
        }

        if (model.historicalOrObserved === allergiesConstants.OBSERVED) {
            var observedDateTimeMoment = paramUtil.convertWriteBackInputDate(model.observedDate);
            var observedTime = observedDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_TIME_FORMAT);
            if (!nullChecker.isNullish(observedTime)) {
                observedTime = '.' + observedTime;
            }

            var observedDate = filemanDateUtil.getFilemanDateWithArgAsStr(observedDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));

            if (observedDate !== -1) {
                allergies['"GMRARDT"'] = observedDate + observedTime;
            }

            allergies['"GMRASEVR"'] = model.severity;
        }

        logger.debug({allergies: allergies});

        VistaJS.callRpc(logger, writebackContext.vistaConfig, 'ORWDAL32 SAVE ALLERGY', [0, model.dfn, allergies], callback);
    }], function (err, data) {
        if (err) {
            return callback(err, data);
        }

        writebackContext.vprResponse = new paramUtil.returnObject([]);
        return callback(null);
    });
};

module.exports.update = function(writebackContext, callback) {
    // not supported yet
    return callback(null);
};
