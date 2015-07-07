'use strict';

var _ = require('underscore');
var patientrecordUtil = require('../subsystems/jds/patientRecordUtil');
var vitalData = require('./input-data/patientrecordUtil-BMI-in');

describe('Patient Record Util ', function() {
    it('Test addCalculatedBMI()', function() {
        var jdsData = vitalData.inputValue;
        expect(jdsData.data.items.length).toBe(381);
        var appendedBMIData = patientrecordUtil.addCalculatedBMI(jdsData);
        expect(appendedBMIData.data.items.length).toBe(408);
        expect(appendedBMIData.data.totalItems).toEqual(408);
        expect(appendedBMIData.data.currentItemCount).toEqual(408);

        var lastBMI = _.last(appendedBMIData.data.items);
        expect(lastBMI.facilityCode).toBeDefined();
        expect(lastBMI.facilityName).toBeDefined();
        expect(lastBMI.observed).toBeDefined();
        expect(lastBMI.result).toBeDefined();
        expect(lastBMI.summary).toMatch(/BMI/);
        expect(lastBMI.typeName).toEqual('BMI');
        expect(lastBMI.facilityMoniker).toBeDefined();
    });

    it('Test calculateBMI()', function() {
        var bmi = patientrecordUtil._calculateBmi('70', 'in', '174', 'lb');
        expect(bmi).toEqual('25.0');
        bmi = patientrecordUtil._calculateBmi('170', 'cm', '50', 'kg');
        expect(bmi).toEqual('17.3');
    });
});
