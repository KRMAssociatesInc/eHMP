define(['backbone'], function(Backbone){
    var AddVitalsModel = Backbone.Model.extend({
        sync: function(method, model, options) {

            var params = {
                type: 'POST',
                url: model.url(),
                contentType: "application/json",
                data: JSON.stringify(model.toJSON()),
                dataType: "json"
            };

            $.ajax(_.extend(params, options));

        },
        url: function() {
            var pid = ADK.PatientRecordService.getCurrentPatient().get('pid');
            return 'resource/write-health-data/patient/' + pid + '/vitals';
        }
    });

    var WritebackUtil = {
        buildSaveVitalsModel: function(model, ienMap, user, currentPatient){
            var saveVitalsModel = new AddVitalsModel();
            var visit = currentPatient.get('visit');
            var dateTaken = moment(model.get('dateTakenInput'), 'MM/DD/YYYY').format('YYYYMMDD');
            var timeTaken = model.get('time-taken');

            if(timeTaken){
                timeTaken = timeTaken.replace(':', '');
                dateTaken += timeTaken;
            }

            saveVitalsModel.set('dateTime', dateTaken);

            var dfn = currentPatient.get('pid').split(';')[1];
            saveVitalsModel.set('dfn', dfn);

            if(visit){
                saveVitalsModel.set('locIEN', visit.uid);
            }

            var userId  = user.get('duz')[user.get('site')] ? user.get('duz')[user.get('site')] : user.get('duz')[0];
            saveVitalsModel.set('enterdByIEN', userId);

            var vitals = [];

            if(model.get('facility-name-pass-po') || model.get('bpInputValue') || model.get('bp-unavailable-po') || model.get('bp-refused-po')){
                vitals.push(this.buildVital(model, 'bpInputValue', ienMap, 'BLOOD PRESSURE', [], ['bp-cuff-size-po', 'bp-location-po', 'bp-method-po', 'bp-position-po'], 'bp-refused-po', 'bp-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('pulseInputValue') || model.get('pulse-unavailable-po') || model.get('pulse-refused-po')){
                vitals.push(this.buildVital(model, 'pulseInputValue', ienMap, 'PULSE', [], ['pulse-location-po', 'pulse-method-po', 'pulse-position-po', 'pulse-site-po'], 'pulse-refused-po', 'pulse-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('respirationInputValue') || model.get('respiration-unavailable-po') || model.get('respiration-refused-po')){
                vitals.push(this.buildVital(model, 'respirationInputValue', ienMap, 'RESPIRATION', [], ['respiration-method-po', 'respiration-position-po'], 'respiration-refused-po', 'respiration-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('temperatureInputValue') || model.get('temperature-unavailable-po') || model.get('temperature-refused-po')){
                vitals.push(this.buildVital(model, 'temperatureInputValue', ienMap, 'TEMPERATURE', ['F', 'C'], ['temperature-location-po'], 'temperature-refused-po', 'temperature-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('O2InputValue') || model.get('po-unavailable-po') || model.get('po-refused-po')){
                vitals.push(this.buildVital(model, 'O2InputValue', ienMap, 'PULSE OXIMETRY', [], ['po-method-po'], 'po-refused-po', 'po-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('heightInputValue') || model.get('height-unavailable-po') || model.get('height-refused-po')){
                vitals.push(this.buildVital(model, 'heightInputValue', ienMap, 'HEIGHT', ['in', 'cm'], ['height-quality-po'], 'height-refused-po', 'height-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('weightInputValue') || model.get('weight-unavailable-po') || model.get('weight-refused-po')){
                vitals.push(this.buildVital(model, 'weightInputValue', ienMap, 'WEIGHT', ['lb', 'kg'], ['weight-method-po', 'weight-quality-po'], 'weight-refused-po', 'weight-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('pain-value-po') || model.get('pain-unavailable-po') || model.get('pain-refused-po') || model.get('pain-checkbox-po')){
                vitals.push(this.buildVital(model, 'pain-value-po', ienMap, 'PAIN', [], [], 'pain-refused-po', 'pain-unavailable-po'));
            }

            if(model.get('facility-name-pass-po') || model.get('circumValue') || model.get('cg-unavailable-po') || model.get('cg-refused-po')){
                vitals.push(this.buildVital(model, 'circumValue', ienMap, 'CIRCUMFERENCE/GIRTH', ['cm', 'in'], ['cg-site-po', 'cg-location-po'], 'cg-refused-po', 'cg-unavailable-po'));
            }

            saveVitalsModel.set('vitals', vitals);
            return saveVitalsModel;
        },
        addVitals: function(model, ienMap, successCallback, errorCallback){
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            var user = ADK.UserService.getUserSession();
            var saveModel = this.buildSaveVitalsModel(model, ienMap, user, currentPatient);
            saveModel.save(null, {
                success:function() {
                    successCallback();
                },
                error: function(model, error) {
                    errorCallback();
                }
            });
        },
        buildVital: function(model, modelProperty, ienMap, ienProperty, possibleUnits, qualifiers, refusedProperty, unavailableProperty){
            var vital = {};
            if(model.get('facility-name-pass-po')){
                vital.reading = 'Pass';
            }else if(model.get(refusedProperty)){
                vital.reading = 'Refused';
            }else if(model.get(unavailableProperty)){
                vital.reading = 'Unavailable';
            }else {
                var readingValue = model.get(modelProperty);
                if(possibleUnits && possibleUnits.length > 0){
                    _.each(possibleUnits, function(unit){
                        var readingValueSubstr = readingValue.substring(readingValue.length - unit.length, readingValue.length);
                        if(readingValueSubstr === unit){
                            vital.unit = readingValueSubstr;
                            readingValue = readingValue.substring(0, readingValue.length - unit.length);
                        }
                    });
                }

                if(modelProperty === 'pain-value-po' && model.get('pain-checkbox-po')){
                    readingValue = '99 - Unable to Respond';
                }

                vital.reading = readingValue;

                var vitalQualifiers = [];
                _.each(qualifiers, function(item){
                    var qualifierValue = model.get(item);

                    if(qualifierValue){
                        vitalQualifiers.push(qualifierValue);
                    }
                });

                vital.qualifiers = vitalQualifiers;

                if(modelProperty === 'O2InputValue'){
                    if(model.get('suppO2InputValue')){
                        vital.flowRate = model.get('suppO2InputValue');
                    }
                }
            }

            vital.fileIEN = ienMap[ienProperty];
            return vital;
        }
    };

    return WritebackUtil;
});