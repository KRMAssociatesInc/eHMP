define([], function() {

    var ValidationUtil = {
        validateHistorical: function(model, result){
            var patient = ADK.PatientRecordService.getCurrentPatient();
            var pid = patient.get("pid");          

            var heightInput = model.get('heightInputValue');
            var weightInput = model.get('weightInputValue');            

            if(!heightInput && !weightInput){
                result();  
                return;
            }   

            var height;
            if(heightInput){
                var heightUnits = heightInput.substring(heightInput.length - 2, heightInput.length);
                height = Number(heightInput.substring(0, heightInput.length - 2));          
                if(heightUnits === 'cm'){
                    height = height * 2.54;
                }  
            }
            var weight;
            if(weightInput){
                var weightUnits = weightInput.substring(weightInput.length - 2, weightInput.length);            
                weight  = Number(weightInput.substring(0, weightInput.length - 2));                                    
                if(weightUnits === 'kg'){
                    weight = weight * 2.20462;
                }                
            }
  
            var siteCode = ADK.UserService.getUserSession().get('site');            
            var vitalsRuleURL = ADK.ResourceService.buildUrl('vitals-vitalsRule');            
            
            var params = {
                type: 'GET',
                url: vitalsRuleURL,   
                data: { 'height': height, 
                        'weight': weight,                     
                        'site' : siteCode,
                        'pid' : pid },
                dataType: 'json'
            };          

            var cdsRequest = $.ajax(params); 
            var heightSnowMed = '8302-2';
            var weightSnowMed = '29463-7';   
            var self = this;
            cdsRequest.done(function( resp ) {
                if(resp && resp.data){
                    var obj = resp.data.data;
       
                    var cdsResponse = JSON.parse(obj);                    
                    var heightError = _.filter(cdsResponse.results, function (o) {
                        if (o.body.reason) {
                            return _.some(o.body.reason[0].coding, {
                                code: heightSnowMed
                            });
                        }
                    });
                    var previousHeightValue;                     
                    if(!_.isEmpty( heightError )){                    
                        previousHeightValue = _.filter(cdsResponse.results, function (o) {
                            if (o.body.code) {
                                return _.some(o.body.code.coding, {
                                    code: heightSnowMed
                                });
                            }
                        });                    
                    }

                    var weightError = _.filter(cdsResponse.results, function (o) {
                        if (o.body.reason) {
                            return _.some(o.body.reason[0].coding, {
                                code: weightSnowMed
                            });
                        }
                    });                    

                    var previousWeightValue = _.filter(cdsResponse.results, function (o) {
                            if (o.body.code) {
                                return _.some(o.body.code.coding, {
                                    code: weightSnowMed
                                });
                            }
                    });                                      
                    var showRulesMessage = false;
                    if(!_.isEmpty( previousHeightValue) || !_.isEmpty(previousWeightValue) ){
                        showRulesMessage = true;                    
                    }
                    
                    var warningMessagesHTML = self.buildWarningMessage(height, weight, heightError, previousHeightValue, weightError, previousWeightValue);  

                    result(showRulesMessage, warningMessagesHTML);                                                                 
                }                     
            });  
            
            cdsRequest.fail(function(jqXHR, textStatus) {
                var warningMessagesHTML = '<p>Height (or Weight) difference from previous measurement could not be validated because the server is not available</p>';  
                result(true, warningMessagesHTML);                    
            });
        },
        areAllDataFieldsEmpty: function(model){
            if(model.get('circumValue') || model.get('bpInputValue') || model.get('heightInputValue') || model.get('respirationInputValue') ||
               model.get('pulseInputValue') || model.get('weightInputValue') || model.get('O2InputValue') ||
               model.get('temperatureInputValue') || model.get('pain-value-po') || model.get('facility-name-pass-po') || model.get('bp-unavailable-po') ||
               model.get('bp-refused-po') || model.get('pulse-unavailable-po') || model.get('pulse-refused-po') || model.get('respiration-unavailable-po') ||
               model.get('respiration-refused-po') || model.get('temperature-unavailable-po') || model.get('temperature-refused-po') ||
               model.get('height-unavailable-po') || model.get('height-refused-po') || model.get('weight-unavailable-po') || model.get('weight-refused-po') ||
               model.get('pain-unavailable-po') || model.get('pain-refused-po') || model.get('cg-unavailable-po') || model.get('cg-refused-po') ||
               model.get('po-unavailable-po') || model.get('po-refused-po') || model.get('pain-checkbox-po')){
                return false;
           }

            return true;
        },
        buildWarningMessage: function(heightValue, weightValue, heightError, previousHeightValue, weightError, previousWeightValue){

            var warningMessagesHTML = 'Warnings Exist: <ul>';
            if(!_.isEmpty( heightError )){
                warningMessagesHTML +=  '<li>' +  _.first(_.first(heightError).body.payload).contentString + ' </br>Just Entered: ' + heightValue + ' in ' + 
                                        moment().format('MM/DD/YYYY h:mm a');                                        
                if(!_.isEmpty( previousHeightValue )){                                    
                    warningMessagesHTML +=  '</br>Previous Value: ' + _.first(previousHeightValue).body.valueQuantity.value + ' in ' + 
                                            moment(_.first(previousHeightValue).body.issued).format('MM/DD/YYYY h:mm a');                                                                                            
                }
                warningMessagesHTML +=  '</li>';
            }

            if(!_.isEmpty( previousWeightValue )){                                    
                warningMessagesHTML +=  '<li>The new weight value differs by 20% or more from previous values.</br>Just Entered: ' + weightValue + ' in ' + 
                                        moment().format('MM/DD/YYYY h:mm a') +                       
                                        '</br>Previous Value: ' + _.first(previousWeightValue).body.valueQuantity.value + ' in ' + 
                                        moment(_.first(previousWeightValue).body.issued).format('MM/DD/YYYY h:mm a') + '</li>';                                                                            
            }                                

            warningMessagesHTML += '</ul> Check to ensure you have entered data for the correct patient\'s chart and in the correct units of measure Do you want to save the new value??';
            
            return warningMessagesHTML;
        },
        validateModel: function(model){
            model.errorModel.clear();
            this.validateCircumferenceFields(model, model.get('circumValue'));
            this.validateBPFields(model, model.get('bpInputValue'));            
            this.validateHeightFields(model, model.get('heightInputValue'));    
            this.validateRespirationFields(model, model.get('respirationInputValue'));          
            this.validatePulseFields(model, model.get('pulseInputValue'));
            this.validateWeightFields(model, model.get('weightInputValue'));
            this.validateSuppO2Fields(model, model.get('suppO2InputValue'));
            this.validateO2Fields(model, model.get('O2InputValue'));
            this.validateTemperatureFields(model, model.get('temperatureInputValue'));
            this.validateMeasuredDateAndTime(model, model.get('dateTakenInput'), model.get('time-taken'));    
            this.validatePainFields(model, model.get('pain-value-po'));
            if (!_.isEmpty(model.errorModel.toJSON())) {
                var errorMessage = 'Validation errors. Please fix.';
                return errorMessage;
            }                  
        },
        validatePainFields: function(model, painValue){
            if(painValue){
                if(!this.validWholeNumber(painValue) || Number(painValue) < 0 || Number(painValue) > 10){
                    model.errorModel.set({'pain-value-po': 'Pain value must be a whole number between 0 and 10'});
                }
            }
        },
        validateCircumferenceFields: function(model, circumValue){
            if(circumValue){               
                var units = circumValue.substring(circumValue.length - 2, circumValue.length);
                var circum = Number(circumValue.substring(0, circumValue.length - 2));
                
                if(!this.validDecimal(circum)){
                    model.errorModel.set({circumValue: 'Circumference must be a numeric value'});
                    return;
                } 
                
                if(units === 'in'){
                    if(circum < 1 || circum > 200){
                        model.errorModel.set({circumValue: 'Circumference must be between 1 and 200 inches'});
                    }
                } else {
                    if(circum < 2.54 || circum > 508){
                        model.errorModel.set({circumValue: 'Circumference must be between 2.54 and 508 centimeters'});
                    }
                }
            }
        },
        validateBPFields: function(model, value){
            if(value){
                bpRegExCommon = /^(\d{1,3})\/(\d{1,3})$/;
                bpRegEx = /^(\d{1,3})\/(\d{1,3})\/(\d{1,3})$/;
                var validBpCommon = bpRegExCommon.test(value);
                var validBp = bpRegEx.test(value);   
                if(!validBp && !validBpCommon)
                    model.errorModel.set({bpInputValue: 'Blood Pressure value must be a valid format: nnn/nnn or nnn/nnn/nnn'});  
                
                var bpValues = value.split('/');
                var systolic = bpValues[0];
                var diastolic = bpValues[1];                                    
                var intermediate = bpValues[1];                
                if(bpValues.length == 3){
                    diastolic = bpValues[2];                    
                    if(Number(intermediate) < 0 || Number(intermediate) > 300){
                        model.errorModel.set({bpInputValue: 'Blood Pressure Intermediate value must be a number between 0 and 300'});
                    }                    
                }
                if(Number(systolic) < 0 || Number(systolic) > 300){
                    model.errorModel.set({bpInputValue: 'Blood Pressure Systolic value must be a number between 0 and 300'});
                } 
                if(Number(diastolic) < 0 || Number(diastolic) > 300){
                    model.errorModel.set({bpInputValue: 'Blood Pressure Diastolic value must be a number between 0 and 300'});
                }                 

            }
        },
        validateHeightFields: function(model, value){
            if(value){               
                var units = value.substring(value.length - 2, value.length);
                var numberValue = Number(value.substring(0, value.length - 2));
                
                if(!this.validDecimal(numberValue)){
                    model.errorModel.set({heightInputValue: 'Height must be a numeric value'});
                    return;
                } 
                
                if(units === 'in'){
                    if(numberValue < 10 || numberValue > 100){
                        model.errorModel.set({heightInputValue: 'Height must be between 10 and 100 inches'});
                    }
                } else {
                    if(numberValue < 25.4 || numberValue > 254){
                        model.errorModel.set({heightInputValue: 'Height must be between 25.4 and 254 centimeters'});
                    }
                }
            }
        },
        validateRespirationFields: function(model, value){
            if(value){
                if(!this.validWholeNumber(value)){
                    model.errorModel.set({respirationInputValue: 'Respiration must be a whole numeric value'});
                    return;
                }                
                var numberValue = Number(value);
                if(numberValue < 0 || numberValue > 100){
                    model.errorModel.set({respirationInputValue: 'Respiration must be between 0 and 100 /min'});
                }
            }
        },
        validatePulseFields: function(model, value){
            if(value){
                if(!this.validDecimal(value)){
                    model.errorModel.set({pulseInputValue: 'Beats must be a numeric value'});
                    return;
                }
                
                var numberValue = Number(value);
                if(numberValue < 0 || numberValue > 300){
                    model.errorModel.set({pulseInputValue: 'Beats must be between 0 and 300 /min'});
                }
            }
        },
        validateWeightFields: function(model, value){
            if(value){
                
                var units = value.substring(value.length - 2, value.length);
                var numberValue = Number(value.substring(0, value.length - 2));
                
                if(!this.validDecimal(numberValue)){
                    model.errorModel.set({weightInputValue: 'Weight must be a numeric value'});
                    return;
                }                
                
                if(units === 'lb'){
                    if(numberValue < 0 || numberValue > 1500){
                        model.errorModel.set({weightInputValue: 'Weight must be between 0 and 1500 pounds'});
                    }
                } else {
                    if(numberValue < 0 || numberValue > 680.39){
                        model.errorModel.set({weightInputValue: 'Weight must be between 0 and 680.39 kilograms'});
                    }
                }
            }
        },
        validateSuppO2Fields: function(model, value){
            if(value){
                if(!this.validDecimal(value)){
                    model.errorModel.set({suppO2InputValue: 'Flow Rate must be a numeric value'});
                    return;
                }
                
                var numberValue = Number(value);
                if(numberValue < 0.5 || numberValue > 20){
                    model.errorModel.set({suppO2InputValue: 'Flow Rate must be between 0.5 and 20 (liters/minute)'});
                }
            }
        },
        validateO2Fields: function(model, value){
            if(value){
                if(!this.validWholeNumber(value)){
                    model.errorModel.set({O2InputValue: 'O2 Concentration must be a whole numeric value'});
                    return;
                }
                
                var numberValue = Number(value);
                if(numberValue < 21 || numberValue > 100){
                    model.errorModel.set({O2InputValue: 'O2 Concentration must be between 21 and 100'});
                }
            }
        },
        validateTemperatureFields: function(model, value){
            if(value){                
                var units = value.substring(value.length - 1, value.length);
                var numberValue = Number(value.substring(0, value.length - 1));
                
                if(!this.validDecimal(numberValue)){
                    model.errorModel.set({temperatureInputValue: 'Temperature must be a numeric value'});
                    return;
                }                
                
                if(units === 'F'){
                    if(numberValue < 45 || numberValue > 120){
                        model.errorModel.set({temperatureInputValue: 'Temperature must be between 45 and 120 degrees F'});
                    }
                } else {
                    if(numberValue < 7.2 || numberValue > 48.9){
                        model.errorModel.set({temperatureInputValue: 'Temperature must be between 7.2 and 48.9 degrees C'});
                    }
                }
            }
        },
        validateMeasuredDateAndTime: function(model, dateValue, timeValue){
            if(dateValue){
                var today = moment();

                if(timeValue){
                    var measured = moment(dateValue + ' ' + timeValue, 'MM/DD/YYYY hh:mm a');

                    if(measured.isAfter(today)){
                        if(measured.isSame(today, 'day')){
                            model.errorModel.set({'time-taken': 'Measured Date/Time must be in the past.'});
                        }else {
                            model.errorModel.set({'dateTakenInput': 'Measured Date/Time must be in the past.'});
                        }
                    }
                } else {
                    var dateMeasured = moment(dateValue, 'MM/DD/YYYY');

                    if(dateMeasured.isAfter(today)){
                        model.errorModel.set({'dateTakenInput': 'Measured Date/Time must be in the past.'});
                    }
                }
            }
        },
        validDecimal: function(value){
            var decimalRegEx = /^[+-]?\.?[0-9]{1,9}(?:\.[0-9]{1,10})?$/;
            return decimalRegEx.test(value);

        },
        validWholeNumber: function(value){
            if(/^-?\d+$/.test(value)){
                var n = Number(value);
                return !isNaN(n) && n % 1 === 0;
            }

            return false;
        }
    };

    return ValidationUtil;
});