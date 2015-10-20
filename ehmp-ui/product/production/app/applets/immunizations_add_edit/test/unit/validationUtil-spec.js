/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['backbone', 'jasminejquery', 'app/applets/immunizations_add_edit/utils/validationUtil'],
    function (Backbone, Jasmine, ValidationUtil) {
        var FormModel = Backbone.Model.extend({
            defaults: {
                errorModel: new Backbone.Model()
            },
            validate: function(attributes, options){
                return ValidationUtil.validateModel(this);
            }
        });

        function getFormModelInstance(properties){
            var formModel = new FormModel(properties);
            formModel.errorModel = formModel.get('errorModel');
            formModel.clear = function(){
                this.get('errorModel').clear();
            };
            formModel.clear();
            return formModel;
        }

        describe('Top level validation function to validate backbone model', function(){
            it('should fail validation if encounter location is not a uid', function(){
                var model = getFormModelInstance({encounterLocation: 'random text'});
                var errorMessage = ValidationUtil.validateModel(model);
                expect(errorMessage).toEqual('Validation errors. Please fix.');
                expect(model.get('errorModel').get('encounterLocation')).toEqual('Please choose a valid location');
            });

            it('should fail validation if administering provider is not valid', function(){
                var model = getFormModelInstance({validProviderSelected: false, administeringProvider: 'PROVIDER', immunizationOption: 'administered'});
                var errorMessage = ValidationUtil.validateModel(model);
                expect(errorMessage).toEqual('Validation errors. Please fix.');
                expect(model.get('errorModel').get('administeringProvider')).toEqual('Please choose a valid provider');
            });

            it('should fail validation if dose is not valid', function(){
                var model = getFormModelInstance({dose: 'xyzmL'});
                var errorMessage = ValidationUtil.validateModel(model);
                expect(errorMessage).toEqual('Validation errors. Please fix.');
                expect(model.get('errorModel').get('dose')).toEqual('Must be a number greater than 0');
            });
        });

        describe('Validation for encounter location', function(){
            it('Should fail if encounter location is not specified', function(){
                var model = getFormModelInstance();
                ValidationUtil.validateEncounterLocation(model, undefined);
                expect(model.get('errorModel').get('encounterLocation')).toEqual('This field is required');
            });

            it('Should fail if encounter location is not a uid', function(){
                var model = getFormModelInstance();
                ValidationUtil.validateEncounterLocation(model, 'random text');
                expect(model.get('errorModel').get('encounterLocation')).toEqual('Please choose a valid location');
            });
        });

        describe('Validation for administering provider', function(){
            it('Should pass if historical immunization', function(){
                var model = getFormModelInstance({immunizationOption: 'historical'});
                ValidationUtil.validateAdministeringProvider(model, '', false, 'historical');
                expect(model.get('errorModel').get('administeringProvider')).toEqual(undefined);
            });

            it('Should fail if administered provider is not specified', function(){
                var model = getFormModelInstance({immunizationOption: 'administered'});
                ValidationUtil.validateAdministeringProvider(model, '', false, 'administered');
                expect(model.get('errorModel').get('administeringProvider')).toEqual('This field is required');
            });

            it('Should fail if administered provider is not valid', function(){
                var model = getFormModelInstance({immunizationOption: 'administered', administeringProvider: 'PROVIDER', validProviderSelected: false});
                ValidationUtil.validateAdministeringProvider(model, 'PROVIDER', false, 'administered');
                expect(model.get('errorModel').get('administeringProvider')).toEqual('Please choose a valid provider');
            });

            it('Should pass if administered provider is valid', function(){
                var model = getFormModelInstance({immunizationOption: 'administered', administeringProvider: 'PROVIDER,ONE', validProviderSelected: true});
                ValidationUtil.validateAdministeringProvider(model, 'PROVIDER,ONE', true, 'administered');
                expect(model.get('errorModel').get('administeringProvider')).toEqual(undefined);
            });
        });

        describe('Validation for dose', function(){
            it('Should pass if dose is unspecified', function(){
                var model = getFormModelInstance();
                ValidationUtil.validateDose(model, '');
                expect(model.get('errorModel').get('dose')).toEqual(undefined);
            });

            it('Should pass if dose is a valid number with mL', function(){
                var model = getFormModelInstance({dose: '8mL'});
                ValidationUtil.validateDose(model, '8mL');
                expect(model.get('errorModel').get('dose')).toEqual(undefined);
            });

            it('Should pass if dose is a valid number with grams', function(){
                var model = getFormModelInstance({dose: '8g'});
                ValidationUtil.validateDose(model, '8g');
                expect(model.get('errorModel').get('dose')).toEqual(undefined);
            });

            it('Should fail if dose is not valid number', function(){
                var model = getFormModelInstance({dose: '8xymL'});
                ValidationUtil.validateDose(model, '8xymL');
                expect(model.get('errorModel').get('dose')).toEqual('Must be a number greater than 0');
            });

            it('Should fail if dose is 0', function(){
                var model = getFormModelInstance({dose: '0g'});
                ValidationUtil.validateDose(model, '0g');
                expect(model.get('errorModel').get('dose')).toEqual('Must be a number greater than 0');
            });

            it('Should fail if dose is negative', function(){
                var model = getFormModelInstance({dose: '-35cc'});
                ValidationUtil.validateDose(model, '-35cc');
                expect(model.get('errorModel').get('dose')).toEqual('Must be a number greater than 0');
            });
        });

        describe('Validate for VIS date offered', function(){
            it('Should pass if historical immunization selected', function(){
                var model = getFormModelInstance({informationStatement: ['Testing'], immunizationOption: 'historical'});
                ValidationUtil.validateVisDateOffered(model, '', 'historical');
                expect(model.get('errorModel').get('visDateOffered')).toEqual(undefined);
            });

            it('Should pass if adminstered immunization selected, information statement filled out and VIS date selected', function(){
                var model = getFormModelInstance({informationStatement: ['Testing'], immunizationOption: 'administered'});
                ValidationUtil.validateVisDateOffered(model, '07/21/2015', 'administered');
                expect(model.get('errorModel').get('visDateOffered')).toEqual(undefined);
            });

            it('Should fail if adminstered immunization selected, information statement filled out and VIS date not selected', function(){
                var model = getFormModelInstance({informationStatement: ['Testing'], immunizationOption: 'administered'});
                ValidationUtil.validateVisDateOffered(model, '', 'administered');
                expect(model.get('errorModel').get('visDateOffered')).toEqual('This field is required when a vaccine information statement is selected.');
            });

            it('Should pass if administered immunization selected, information statement not filled out and VIS date not selected', function(){
                var model = getFormModelInstance({informationStatement: [''], immunizationOption: 'administered'});
                ValidationUtil.validateVisDateOffered(model, '', 'administered');
                expect(model.get('errorModel').get('visDateOffered')).toEqual(undefined);
            });
        });
    });