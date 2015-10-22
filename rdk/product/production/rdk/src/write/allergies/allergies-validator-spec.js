'use strict';

var _ = require('underscore');
var AllergyValidator = require('./allergies-validator')._AllergyValidator;

describe('Allergies input validator', function () {

    describe ('Allergies valid input', function () {

        it ('minimum historical input', function () {
            var input = {
                'allergyName': 'AMPICILLIN^79;PSNDF(50.6,',
                'natureOfReaction': 'A^ALLERGY',
                'eventDateTime': '20150120114900',
                'historicalOrObserved': 'h^HISTORICAL',
                'dfn' : '3'
            };

            var validator = new AllergyValidator(input);
            expect(validator.isValid()).to.equal(true);
        });

        it ('minimum observed input', function () {
            var input = {
                'dfn': '3',
                'allergyName': 'AMPICILLIN^79;PSNDF(50.6,',
                'natureOfReaction': 'A^ALLERGY',
                'severity': '1',
                'eventDateTime': '20150120114900',
                'name': 'CHEESE',
                'IEN': '20',
                'location': 'GMRD(120.82,',
                'historicalOrObserved': 'o^OBSERVED',
                'observedDate': '201501200100',
                'symptoms': [
                    {
                        'IEN': '173',
                        'name': 'STROKE',
                        'dateTime': '201501200200',
                        'symptomDate': '01/20/2015',
                        'symptomTime': '02:00 a'
                    }
                ]
            };

            var validator = new AllergyValidator(input);
            expect(validator.isValid()).to.equal(true);
        });

        it ('missing dfn and allergy name', function () {
            var input = {
                'natureOfReaction': 'A^ALLERGY',
                'severity': '1',
                'eventDateTime': '20150120114900',
                'name': 'CHEESE',
                'IEN': '20',
                'location': 'GMRD(120.82,',
                'historicalOrObserved': 'o^OBSERVED',
                'observedDate': '201501200100',
                'symptoms': [
                    {
                        'IEN': '173',
                        'name': 'STROKE',
                        'dateTime': '201501200200',
                        'symptomDate': '01/20/2015',
                        'symptomTime': '02:00 a'
                    }
                ]
            };

            var validator = new AllergyValidator(input);
            expect(validator.isValid()).to.equal(false);
            expect(_.size(validator.getErrors())).eql(2);
            var errors = validator.getErrors();
            errors = errors.join(';');
            expect(errors).eql('patient dfn is missing;allergy name is missing');
        });

        it ('missing natureOfReaction input', function () {
            var input = {
                'dfn': '3',
                'allergyName': 'AMPICILLIN^79;PSNDF(50.6,',
                'severity': '1',
                'eventDateTime': '20150120114900',
                'name': 'CHEESE',
                'IEN': '20',
                'location': 'GMRD(120.82,',
                'historicalOrObserved': 'o^OBSERVED',
                'observedDate': '201501200100',
                'symptoms': [
                    {
                        'IEN': '173',
                        'name': 'STROKE',
                        'dateTime': '201501200200',
                        'symptomDate': '01/20/2015',
                        'symptomTime': '02:00 a'
                    }
                ]
            };

            var validator = new AllergyValidator(input);
            expect(validator.isValid()).to.equal(false);
            expect(_.size(validator.getErrors())).eql(1);
        });

        it ('missing symptoms IEN input', function () {
            var input = {
                'dfn': '3',
                'allergyName': 'AMPICILLIN^79;PSNDF(50.6,',
                'natureOfReaction': 'A^ALLERGY',
                'severity': '1',
                'eventDateTime': '20150120114900',
                'name': 'CHEESE',
                'IEN': '20',
                'location': 'GMRD(120.82,',
                'historicalOrObserved': 'o^OBSERVED',
                'observedDate': '201501200100',
                'symptoms': [
                    {
                        'name': 'STROKE',
                        'dateTime': '201501200200',
                        'symptomDate': '01/20/2015',
                        'symptomTime': '02:00 a'
                    }
                ]
            };

            var validator = new AllergyValidator(input);
            expect(validator.isValid()).to.equal(false);
            expect(_.size(validator.getErrors())).eql(1);
        });

        it ('comment in observed input', function () {
            var input = {
                'dfn': '3',
                'allergyName': 'AMPICILLIN^79;PSNDF(50.6,',
                'natureOfReaction': 'A^ALLERGY',
                'comment' : 'sample comment',
                'severity': '1',
                'eventDateTime': '20150120114900',
                'name': 'CHEESE',
                'IEN': '20',
                'location': 'GMRD(120.82,',
                'historicalOrObserved': 'o^OBSERVED',
                'observedDate': '201501200100',
                'symptoms': [
                    {
                        'IEN': '173',
                        'name': 'STROKE',
                        'dateTime': '201501200200',
                        'symptomDate': '01/20/2015',
                        'symptomTime': '02:00 a'
                    }
                ]
            };

            var validator = new AllergyValidator(input);
            expect(validator.isValid()).to.equal(true);
        });
    });
});