define([
    'backbone',
    'underscore',
    'moment',
    'app/applets/notesTray/writeback/modelUtil'
], function(Backbone, _, Moment, util) {
    var userSession = function() {
        return ADK.UserService.getUserSession();
    };
    var patient = function() {
        return ADK.PatientRecordService.getCurrentPatient();
    };
    var visit = function() {
        var visit = patient().get('visit');
        console.log('visit: %o', visit);
        if (!_.isUndefined(visit)) {
            visit.formattedDate = moment(visit.dateTime, "YYYYMMDDhhmm").format('MM/DD/YYYY HH:mm');
            return visit;
        }
        return {};
    };
    var author = function() {
        return userSession().get('lastname') + ',' + userSession().get('firstname');
    };
    var calculateReferenceDateTime = function(model) {
        var referenceDateTime = null;
        if (model.get('derivReferenceDate')) {
            var referenceDateTimeString = model.get('derivReferenceDate') + ' ' + model.get('derivReferenceTime');
            referenceDateTime = moment(referenceDateTimeString, 'MM/DD/YYYY HH:mm').format('YYYYMMDDHHmm');
        }
        model.set('referenceDateTime', referenceDateTime);
        var text = model.get('text');
        text[0].dateTime = referenceDateTime;
        model.set('text', text);
    };

    var Model = Backbone.Model.extend({
        initialize: function() {
            if (!this.get('referenceDateTime')) {
                calculateReferenceDateTime(this);
            }
            this.on('change:derivReferenceDate', _.bind(calculateReferenceDateTime, null, this));
            this.on('change:derivReferenceTime', _.bind(calculateReferenceDateTime, null, this));
        },
        parse: function(response) {
            // we don't want model.save() to add to/edit our model
            return {};
        },
        defaults: function() {
            return {
                // TODO: some of the values below are hard-coded as they are currently unavailable
                formStatus: {},

                author: author(),
                authorDisplayName: author(),
                authorUid: userSession().get('duz') && userSession().get('duz')[userSession().get('site')],
                documentClass: 'PROGRESS NOTES',
                documentDefUid: null,
                documentTypeName: 'Progress Note',
                encounterName: visit().locationDisplayName + visit().formatteddateTime,
                encounterUid: visit().localId,
                locationUid: visit().locationUid,
                encounterDateTime: visit().dateTime,
                entered: moment().format(),
                facilityCode: visit().facilityCode,
                facilityName: visit().facilityName,
                isInterdisciplinary: 'false', // TODO what is this?
                lastUpdateTime: moment().format(),
                localId: null,
                localTitle: '',
                nationalTitle: {
                    name: '',
                    vuid: ''
                },
                patientIcn: patient().get('icn'),
                pid: patient().get('pid'),
                referenceDateTime: null,
                signedDateTime: null,
                signer: null,
                signerDisplayName: null,
                signerUid: null,
                status: 'UNSIGNED',
                statusDisplayName: 'Unsigned',
                summary: 'GENERAL SURGERY RESIDENT NOTE  ',
                text: [{
                    author: author(),
                    authorDisplayName: author(),
                    authorUid: userSession().get('duz') && userSession().get('duz')[userSession().get('site')],
                    content: '',
                    dateTime: '201505201418',
                    signer: null,
                    signerDisplayName: null,
                    signerUid: null,
                    status: 'UNSIGNED'
                }],
                facilityDisplay: visit().facilityDisplay,
                facilityMoniker: visit().facilityMoniker
            };
        },
        validate: function(attributes, options) {
            this.errorModel.clear();
            if (options.validateType && options.validationType === 'sign') {
                util.validateRequiredDate(this);
                util.validateRequiredTime(this);
            }

            if (!_.isEmpty(this.errorModel.toJSON())) {
                return 'Please correct validation errors before saving.';
            }
        }
    });

    return Model;
});
