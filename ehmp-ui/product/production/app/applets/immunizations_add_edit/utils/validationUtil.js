define([], function(){
    return {
        validateModel: function(model){
            model.errorModel.clear();
            this.validateEncounterLocation(model, model.get('encounterLocation'));
            this.validateAdministeringProvider(model, model.get('administeringProvider'), model.get('validProviderSelected'), model.get('immunizationOption'));
            this.validateVisDateOffered(model, model.get('visDateOffered'), model.get('immunizationOption'));
            this.validateDose(model, model.get('dose'));

            if (!_.isEmpty(model.errorModel.toJSON())) {
                var errorMessage = 'Validation errors. Please fix.';
                return errorMessage;
            }
        },
        validateEncounterLocation: function(model, locationValue){
            if(locationValue){
                if(locationValue.indexOf('urn:va:location') === -1){
                    model.errorModel.set({encounterLocation: 'Please choose a valid location'});
                }
            } else {
                model.errorModel.set({encounterLocation: 'This field is required'});
            }
        },
        validateAdministeringProvider: function(model, administeringProvider, validProviderSelected, immunizationOption){
            if(immunizationOption === 'administered'){
                if(administeringProvider){
                    if(!validProviderSelected){
                        model.errorModel.set({administeringProvider: 'Please choose a valid provider'});
                    }
                } else {
                    model.errorModel.set({administeringProvider: 'This field is required'});
                }
            }
        },
        validateDose: function(model, doseValue){
            if(doseValue){
                var trimmedDoseValue = doseValue.trim();

                var twoCharUnitSlice = trimmedDoseValue.slice(-2);
                if(twoCharUnitSlice === 'mL' || twoCharUnitSlice === 'cc' || twoCharUnitSlice === 'fl'){
                    trimmedDoseValue = trimmedDoseValue.substring(0, trimmedDoseValue.length - 2);
                } else if(trimmedDoseValue.slice(-1) === 'g'){
                    trimmedDoseValue = trimmedDoseValue.substring(0, trimmedDoseValue.length - 1);
                }

                var num = Number(trimmedDoseValue);

                var decimalRegEx = /^-?[0-9]\d*(\.\d+)?$/;
                if(!decimalRegEx.test(num) || isNaN(num) || num <= 0){
                    model.errorModel.set({dose: 'Must be a number greater than 0'});
                }
            }
        },
        validateVisDateOffered: function(model, visDateOfferedValue, immunizationOption){
            if(immunizationOption === 'administered' && !visDateOfferedValue && model.get('informationStatement')){
                var infoStatementArray = model.get('informationStatement');
                var infoStatementExists = false;
                if(infoStatementArray.length > 0){
                    _.each(infoStatementArray, function(infoStatement){
                        if(infoStatement){
                            infoStatementExists = true;
                        }
                    });
                }

                if(infoStatementExists){
                    model.errorModel.set({visDateOffered: 'This field is required when a vaccine information statement is selected.'});
                }
            }
        }
    };
});