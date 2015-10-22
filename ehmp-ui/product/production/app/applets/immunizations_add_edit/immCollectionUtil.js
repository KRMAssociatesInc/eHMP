define([
    'underscore'
], function(_){
    var AddImmunizationModel = Backbone.Model.extend({
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
            return ADK.ResourceService.buildUrl('immunization-crud-AddImmunization', {'pid' : pid});
        }
    });
    var ImmCollectionUtil = {
        modifyInfoSourceCollection: function(collection){
            var newCollection = new Backbone.Collection();
            
            _.each(collection, function(item){
                if(item.source.toLowerCase().indexOf('historical') === 0){
                    var sourceSplit = item.source.split('-');
                    item.source = sourceSplit[1].charAt(0).toUpperCase() + sourceSplit[1].slice(1);
                    newCollection.add(item);
                }
            });
            
            return newCollection;
        },
        changeLotNumber: function(model){
            var expDate = model.get('expirationDate');
            var formattedDate = ADK.utils.formatDate(expDate, 'MM/DD/YYYY', 'MMM DD, YYYY');
            $('#expiration-date').val(formattedDate).attr('disabled', true);
            $('#manufacturer').val(model.get('manufacturer')).attr('disabled', true);
            ImmCollectionUtil.checkFormReadyForSubmit();
        },
        checkFormReadyForSubmit: function(){
            if($('#route-admin option:selected').text() && $('#anatomic-location option:selected').text() && $('#lot-num-obs option:selected').text()){
                $('#imm-submit').attr('disabled', false);
            }else {
                $('#imm-submit').attr('disabled', true);
            }
        },
        validateFormInputAndShowErrors: function(modalView){
            ImmCollectionUtil.removePreviousErrors();
            var errorCount = 0;
            
            if($('#immunization-btn-historical').attr('data-is-active') === 'true'){
                if($('#info-source').find(':selected').val() === 'default'){
                    $('#info-source-error').attr('aria-hidden', false).text('Required.').focus();
                    errorCount++;
                }
            }else {
                var firstErrorFocused = false;
                if(!modalView.adminProviderView.model){
                    $('#admin-provider-error').attr('aria-hidden', false).text('Must be selected from the list of providers.');
                    if(!firstErrorFocused){
                        $('#admin-provider-error').focus();
                        firstErrorFocused = true;
                    }
                    
                    errorCount++;
                }
                
                if(!modalView.orderingProviderView.model && $('#ordering-provider').val()){
                    $('#ordering-provider-error').attr('aria-hidden', false).text('Must be selected from the list of providers.');
                    if(!firstErrorFocused){
                        $('#ordering-provider-error').focus();
                        firstErrorFocused = true;
                    }
                    
                    errorCount++;
                }
                
                if(!modalView.locationView.model && $('#location').val()){
                    $('#location-error').attr('aria-hidden', false).text('Must be selected from the list of locations.');
                    if(!firstErrorFocused){
                        $('#location-error').focus();
                        firstErrorFocused = true;
                    }
                    
                    errorCount++;
                }
                
                if(!$('#lot-num-obs option:selected').text()){
                    $('#lot-num-obs-error').attr('aria-hidden', false).text('Required.');
                    if(!firstErrorFocused){
                        $('#lot-num-obs-error').focus();
                        firstErrorFocused = true;
                    }
                    
                    errorCount++;
                }
                
                if(!$('#route-admin option:selected').text()){
                    $('#route-admin-error').attr('aria-hidden', false).text('Required.');
                    if(!firstErrorFocused){
                        $('#route-admin-error').focus();
                        firstErrorFocused = true;
                    }
                    
                    errorCount++;
                }
                
                if(!$('#anatomic-location option:selected').text()){
                    $('#anatomic-location-error').attr('aria-hidden', false).text('Required.');
                    if(!firstErrorFocused){
                        $('#anatomic-location-error').focus();
                        firstErrorFocused = true;
                    }
                    
                    errorCount++;
                }
            }
            
            return errorCount === 0;
        },
        removePreviousErrors: function(){
            $('#add-edit-imm-error').attr('aria-hidden', true).addClass('hidden');
            $('#info-source-error').attr('aria-hidden', true).text('');
            $('#admin-provider-error').attr('aria-hidden', true).text('');
            $('#ordering-provider-error').attr('aria-hidden', true).text('');
            $('#location-error').attr('aria-hidden', true).text('');
            $('#anatomic-location-error').attr('aria-hidden', true).text('');
            $('#route-admin-error').attr('aria-hidden', true).text('');
            $('#lot-num-obs-error').attr('aria-hidden', true).text('');
        },
        filterOutInactiveLotNumbers: function(collection){
            var newCollection = new Backbone.Collection();
            
            _.each(collection, function(lotNum){
                if(lotNum.status.toLowerCase() === 'active'){
                    newCollection.add(lotNum);
                }
            });
            
            return newCollection;
        },
        filterOutHistoricalInfoStatements: function(collection){
            var newCollection = new Backbone.Collection();
            var alreadyAddedVis = [];
            
            _.each(collection, function(infoStatement){
                if(infoStatement.status && infoStatement.status.toLowerCase() !== 'historic' && !_.contains(alreadyAddedVis, infoStatement.name)){
                    alreadyAddedVis.push(infoStatement.name);
                    newCollection.add(infoStatement);
                }
            });
            
            return newCollection;
        },
        buildSubmitModel: function(immModel){
            var newImmModel = new AddImmunizationModel();
            var visitDate = moment($('#admin-date-time').val(), 'MM/DD/YYYY').format('YYYYMMDD');
            newImmModel.set('encounterServiceCategory', 'E');
            newImmModel.set('visitDate', visitDate);
            newImmModel.set('immunizationIEN', immModel.get('localId'));

            var reaction = $('#reaction').val();

            if(reaction){
                newImmModel.set('reaction', Number(reaction));
            }

            return newImmModel;
        }
    };

    return ImmCollectionUtil;
});
