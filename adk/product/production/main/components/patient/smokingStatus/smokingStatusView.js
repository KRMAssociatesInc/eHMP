define([
    "backbone",
    "marionette",
    "underscore",
    "main/ADK",
    "api/Messaging",
    "api/ResourceService",
    "api/UserService",
    "hbs!main/components/patient/smokingStatus/smokingStatusTemplate"
], function(Backbone, Marionette, _, ADK, Messaging, ResourceService, UserService, smokingStatusTemplate) {

    var SmokingStatusModal = {
        displayModal: function(){
            var self = SmokingStatusModal;
            var modalOptions = {
                title: 'Smoking Status',
                size: 'medium',
                footerView: self.getFooterView()
            };

            var modal = new ADK.UI.Modal({
                view: self.getModalView(),
                options:  modalOptions
            });
            modal.show();
            $('#mainModal').show();
        },
        getModalView: function(){
            var ModalView =  Backbone.Marionette.ItemView.extend({
               template: smokingStatusTemplate,
                events: {
                    'keydown .error-container': 'handleKeyPress'
                },
                handleKeyPress: function(e){
                    if(e.keyCode === 9){
                        e.preventDefault();
                        e.stopPropagation();
                        $('#ssEveryDay').focus();
                    }
                }
            });

            return new ModalView();
        },
        getFooterView: function(){
            return Backbone.Marionette.ItemView.extend({
                template: _.template('<button class="btn btn-default" type="button" data-dismiss="modal"  id="smokingStatusCancel">Cancel</button><button class="btn btn-primary" type="button" id="smokingStatusSave">Save</button>'),
                events: {
                    'click #smokingStatusSave': 'handleNext'
                },
                handleNext: function(){
                    var smokingStatusChannel = Messaging.getChannel('smokingstatus');
                    var selectedInput = $('#smokingStatusModal input:checked')[0];
                    var model = new SmokingStatusModel();
                    model.set('snowmedCode', selectedInput.value);
                    var statusText = $(selectedInput).parent().text().trim();
                    model.set('text', statusText);
                    model.save(null, {
                        success:function() {
                            ADK.UI.Modal.hide();
                            smokingStatusChannel.command('smokingstatus:updated', statusText);
                        },
                        error: function() {
                            $('#smokingStatusModal .error-container').text('Save Failed');
                            $('#smokingStatusModal .error-container').focus();
                        }
                    });
                }
            });
        }
    };

    function sendAuthentication(xhr, settings) {
        var userSession = UserService.getUserSession(),
            user = userSession.attributes.username,
            pass = userSession.attributes.password,
            token = user.concat(":", pass);

        xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))));
    }

    var SmokingStatusModel = Backbone.Model.extend({
        sync: function(method, model, options) {

            var params = {
                type: 'POST',
                beforeSend: sendAuthentication,
                url: model.url(),
                contentType: "application/json",
                data: JSON.stringify(model.toJSON()),
                dataType: "json"
            };

            $.ajax(_.extend(params, options));

        },
        url: function() {
            var pid = ResourceService.PatientRecordService.getCurrentPatient().get('pid');
            return ResourceService.buildUrl('smoking-status', {'pid' : pid});
        }
    });

    var SmokingStatusView  = {
        handleStatusChange: function(){
            var patient = ResourceService.PatientRecordService.getCurrentPatient();

            if(patient.get('visit')){
                SmokingStatusModal.displayModal();
            }else {
                var visitChannel = Messaging.getChannel('visit');
                visitChannel.command('openVisitSelector', 'smokingstatus');
                visitChannel.on('set-visit-success:smokingstatus', SmokingStatusModal.displayModal);
            }
        }
    };

    return SmokingStatusView;
});
