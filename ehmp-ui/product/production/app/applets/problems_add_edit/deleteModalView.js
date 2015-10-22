define([
    "underscore",
    "hbs!app/applets/problems_add_edit/delete",
    'app/applets/problems/util'
], function(_, deleteTemplate, Util){

    // Using an applet key for success event so we don't broadcast success and every applet tries to take action
    var problemChannel = ADK.Messaging.getChannel('problem-add-edit'),
        currentAppletKey,
        modalView,
        uid,
        comment,
        currentModel;

    //
    // model
    //
    var ProblemModel = {
        sync: function(method, model, options) {

            var params = {
                type: 'POST',
                url: model.url(),
                contentType: "application/json",
                data: JSON.stringify({
                    problemIEN : model.get('uid').split(':').pop(), // localId is not available in all results.
                    providerID : model.get('providerUid') ? model.get('providerUid').split(':').pop() : -1,
                    reason : reason,
                    action: 'delete'
                }),
                dataType: "json"
            };

            $.ajax(_.extend(params, options));

        },
        url: function() {
            var pid = ADK.PatientRecordService.getCurrentPatient().get('pid');
            return ADK.ResourceService.buildUrl('problems-UpdateProblem', {'pid' : pid});
        },
        parse: function(response) {

            response = Util.getStandardizedDescription(response);
            response = Util.getStatusName(response);
            response = Util.getServiceConnected(response);
            response = Util.getProblemText(response);
            response = Util.getICDCode(response);
            response = Util.getAcuityName(response);
            response = Util.getFacilityColor(response);
            response = Util.getOnsetFormatted(response);
            response = Util.getEnteredFormatted(response);
            response = Util.getUpdatedFormatted(response);
            response = Util.getCommentBubble(response);

            return response;
        }
    //});
    };

    var ViewParseModel = {
        parse: function(response) {

            response = Util.getStandardizedDescription(response);
            response = Util.getStatusName(response);
            response = Util.getServiceConnected(response);
            response = Util.getProblemText(response);
            response = Util.getICDCode(response);
            response = Util.getAcuityName(response);
            response = Util.getFacilityColor(response);
            response = Util.getOnsetFormatted(response);
            response = Util.getEnteredFormatted(response);
            response = Util.getUpdatedFormatted(response);
            response = Util.getCommentBubble(response);

            return response;
        }
    };

    //
    // channel
    //
    function updateView() {

        modalView = new ModalView({
            model: currentModel
        });

        var modalOptions = {
            'title': "Remove Problem : " + currentModel.get('summary'),
            'size': 'medium',
            'footerView': footerView,
            'callShow': true
        };

        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });
        modal.show();
        //$('#modal-region').empty();
    }

    function handleChannel(appletKey, problemModel){

        currentAppletKey = appletKey;
        currentModel = problemModel;
        currentModel.sync = ProblemModel.sync;
        currentModel.parse = ProblemModel.parse;
        currentModel.url = ProblemModel.url;

        var patientModel = ADK.PatientRecordService.getCurrentPatient();

        if (!patientModel.get('visit')) {
            var visitChannel = ADK.Messaging.getChannel('visit');
            visitChannel.command('openVisitSelector', 'visit_select');
            visitChannel.on('set-visit-success:visit_select', function() {
                $('#mainModal').one('hidden.bs.modal', updateView);
            });
        } else {
            updateView();
        }
    }

    problemChannel.comply('openProblemDelete', handleChannel);

    //
    // methods
    //
    function enableNextButton(){
        // Don't have a handle to the modal after it's shown, so not sure how else to accomplish this
        $("#nextBtn").attr("disabled", false);
    }

    function disableNextButton(){
        $("#nextBtn").attr("disabled", true);
    }

    //
    // views
    //

    // footer view
    var footerView = Backbone.Marionette.ItemView.extend({
        template: _.template(
            '<div class="pull-right">' +
                '<button id="cancelBtn" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                '<button id="deleteBtn" type="button" class="btn btn-danger">Remove</button>' +
            '</div>'),
        events: {
            'click #deleteBtn': function(e) {
                this.deleteProblem(e);
            },
        },
        deleteProblem: function(event){
            $('#deleteProblemModal #error-container').text('');
            reason = $('#reason').val();
            modalView.model.destroy({
                success:function() {
                    ADK.UI.Modal.hide();
                },
                error: function(model) {
                    $('#deleteProblemModal #error-container').text('Remove Failed');
                    $('#deleteProblemModal #error-container' ).focus();
                }
            });
        }
    });

    var ProblemView = Backbone.Marionette.ItemView.extend({
        model: ProblemModel,
        template: deleteTemplate,
        tagName: "div",
        attributes: {
            // Note : uncomment during testing.
            // id: this.model.cid
            //"problemText": problemText
        },
        initialize: function(){
            this.model = new ProblemModel();
            this.model.set('id', "xxx");
        }
    });

    // main view
    var ModalView = Backbone.Marionette.LayoutView.extend({
        template: deleteTemplate, 
        regions: {
            problem: "#problem-body"
        },
        initialize: function() {
            this.model.set('id', "xxx");  // need any id set for destroy
        },
        updateProblems: function(){
            enableNextButton();
        },
    });

    return ModalView;
});
