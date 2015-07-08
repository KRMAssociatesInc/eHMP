define([
    'hbs!app/applets/immunizations_add_edit/templates/enteredInErrorTemplate',
    'app/applets/immunizations_add_edit/views/modalFooterEieView'
], function(enteredInErrorTemplate, modalFooter){
    
    var immunizationChannel = ADK.Messaging.getChannel('immunization'),
        currentAppletKey,
        modalView,
        currentModel,
        visitChannel = ADK.Messaging.getChannel('visit');    
    
   function onImmunizationEiEClicked(appletKey, immunizationModel) {
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        currentAppletKey = appletKey;
        currentModel =  immunizationModel;
               
        visitChannel.on('set-visit-success:immunizations_eie', showImmunizationsEieView);
        
       if(currentPatient.get('visit')){
            currentModel.set('visit', currentPatient.get('visit'));    
            showImmunizationsEieView();
        }else {
            visitChannel.command('openVisitSelector', 'immunizations_eie');
        }
       
        
    }
    
    function showImmunizationsEieView(){
        var modalOptions = {};
        
        modalOptions.title = currentModel.get('name');
        modalOptions.size = 'small';
        modalOptions.footerView = modalFooter.extend({model: currentModel});

        modalView = new ModalView({
            model: currentModel
        });

        ADK.showModal(modalView, modalOptions);
    }    

    var ModalView = Backbone.Marionette.ItemView.extend({
        template: enteredInErrorTemplate,
        model: ADK.PatientRecordService.getCurrentPatient(),
        events: {}
    });

    var EieView = {
        handleMessage: onImmunizationEiEClicked
    };

    
    return EieView;
});
