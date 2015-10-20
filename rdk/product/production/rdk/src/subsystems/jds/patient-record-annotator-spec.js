'use strict';

var _ = require('underscore');
var patientrecordUtil = require('./patient-record-annotator');
var vitalData = require('./patient-record-annotator-spec-data');
var vlerData = require('./patient-record-annotator-vler-spec-data');

describe('Patient Record Util ', function() {
    it('Test addCalculatedBMI()', function() {
        var jdsData = vitalData.inputValue;
        expect(jdsData.data.items.length).to.equal(381);
        var appendedBMIData = patientrecordUtil.addCalculatedBMI(jdsData);
        expect(appendedBMIData.data.items.length).to.equal(408);
        expect(appendedBMIData.data.totalItems).to.equal(408);
        expect(appendedBMIData.data.currentItemCount).to.equal(408);

        var lastBMI = _.last(appendedBMIData.data.items);
        expect(lastBMI.facilityCode).not.to.be.undefined();
        expect(lastBMI.facilityName).not.to.be.undefined();
        expect(lastBMI.observed).not.to.be.undefined();
        expect(lastBMI.result).not.to.be.undefined();
        expect(lastBMI.summary).to.match(/BMI/);
        expect(lastBMI.typeName).to.equal('BMI');
        expect(lastBMI.facilityMoniker).not.to.be.undefined();
    });

    it('Test calculateBMI()', function() {
        var bmi = patientrecordUtil._calculateBmi('70', 'in', '174', 'lb');
        expect(bmi).to.equal('25.0');
        bmi = patientrecordUtil._calculateBmi('170', 'cm', '50', 'kg');
        expect(bmi).to.equal('17.3');
    });

    it('Test decompressFullHtml()', function(done) {
        var jdsData = vlerData.inputValue;
        expect(jdsData.data.items.length).be.equal(11);

        patientrecordUtil.decompressFullHtml(jdsData, function(err, result) {
            expect(err).be.null();

            expect(result.data.items.length).be.equal(11);
            _.each(result.data.items, function(item) {
                if (item.compressed) {
                    expect(item.fullHtml).to.match('<head>');
                }
            });

            done();
        });
    });
});
