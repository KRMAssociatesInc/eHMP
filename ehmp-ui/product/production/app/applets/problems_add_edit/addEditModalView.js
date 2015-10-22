define([
    "underscore",
    "hbs!app/applets/problems_add_edit/addEditProblem",
    "app/applets/visit/typeaheadView",
    "hbs!app/applets/problems_add_edit/problemComment",
    "moment",
    'typeahead',
    "app/applets/problems_add_edit/util/addEditBloodhound"
], function(_, addEditProblemTemplate, Typeahead, problemCommentTemplate, Moment, TwitterTypeahead, addEditBloodhound){

    var problemChannel = ADK.Messaging.getChannel('problem-add-edit'),
        visitChannel = ADK.Messaging.getChannel('visit'),
        currentAppletKey,
        modalView,
        currentModel;

    function handleChannel(appletKey, problemModel){
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        currentAppletKey = appletKey;
        currentModel = problemModel;

        if(currentPatient.get('visit')){
            showProblemsView();
        }else {
            visitChannel.command('openVisitSelector', 'problem_add_edit');
            visitChannel.on('set-visit-success:problem_add_edit', function() {
                $('#mainModal').one('hidden.bs.modal', showProblemsView);
            });
        }
    }

    function showProblemsView(){
        var modalOptions = {};

        if(currentAppletKey === 'problem_edit'){
            modalOptions.title = 'Edit Problem: ' + currentModel.get('summary');
        }else {
            modalOptions.title = 'Add Problem: ' + currentModel.get('problemText');
        }

        modalOptions.footerView = getFooterView();
        modalOptions.size = 'medium';

        modalView = new ModalView({
            model: currentModel
        });

        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });
        modal.show();

        $('#modal-lg-region').empty();

        setTimeout(function() {
            $('#active').focus();
        }, 1000);
    }

    problemChannel.comply('openProblemAdd', handleChannel);
    problemChannel.comply('openProblemEdit', handleChannel);

    var ProblemCommentModel = Backbone.Model.extend({
        defaults: {
        }
    });

    var EditProblemModel = Backbone.Model.extend({
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
            return ADK.ResourceService.buildUrl('problems-UpdateProblem', {'pid' : pid});
        }
    });

    var AddProblemModel = Backbone.Model.extend({
        sync: function(method, model, options) {

            var params = {
                type: 'PUT',
                url: model.url(),
                contentType: "application/json",
                data: JSON.stringify(model.toJSON()),
                dataType: "json"
            };

            $.ajax(_.extend(params, options));

        },
        url: function() {
            var pid = ADK.PatientRecordService.getCurrentPatient().get('pid');
            return ADK.ResourceService.buildUrl('problems-AddProblem', {'pid' : pid});
        }
    });

    var ProblemCommentView = Backbone.Marionette.ItemView.extend({
        model: ProblemCommentModel,
        tagName: "li",
        template: problemCommentTemplate,
        className: "clearfix",
        events: {
            'click .remove-comment': 'removeComment',
            'click .edit-comment': 'editComment',
            'click .cancel-comment': 'cancelComment',
            'click .save-comment': 'saveComment',
            'keyup .commentText' : 'handleCommentTyping',
            'keydown .remove-comment': 'handleKeyPress',
            'keydown .cancel-comment': 'handleKeyPress',
            'keydown .save-comment': 'handleKeyPress',
            'keydown .edit-comment': 'handleKeyPress',
            'mouseenter': 'makeActionsVisible',
            'mouseleave': 'makeActionsInvisible',
            'focus .commentText': 'makeActionsVisible',
            'focus .problem-comment-actions span': 'makeActionsVisible',
            'focusout .commentText': 'makeActionsInvisible',
            'focusout .problem-comment-actions span': 'makeActionsInvisible'
        },
        initialize: function(){
            var currentUser = ADK.UserService.getUserSession();
            if(this.model.get('type') === 'new'){
                this.model.set('entered', new Moment(new Date()).format('YYYYMMDD'));
                this.model.set('enteredByName', currentUser.get('lastname') + ', ' + currentUser.get('firstname'));
                this.enterEditMode();
            }else{
                this.model.set('type', 'existing');
                this.model.set('edit-mode', '');
            }
        },
        onDomRefresh: function(){
            if(!this.model.get('removed')){
                $(this.el).find('.commentText').focus();
                $(this.el).find('.commentText')[0].setSelectionRange(60, 60);
                this.handleCommentTyping();
            }
        },
        makeActionsVisible: function(){
            $(this.el).find('.problem-comment-actions').removeClass('hidden');
        },
        makeActionsInvisible: function(e){
            if(e.type === 'mouseleave'){
                var focused = $(this.el).find(':focus');
                if(focused.length < 1){
                   $(this.el).find('.problem-comment-actions').addClass('hidden');   
                }
            }else {
                $(this.el).find('.problem-comment-actions').addClass('hidden');
            }
        },
        handleKeyPress: function(e){
            if(e.keyCode === 13 || e.keyCode === 32){
                $(e.currentTarget).click();
            }else if(e.keyCode === 9){
                var className = e.currentTarget.className;
                if(e.shiftKey && (className === 'edit-comment' || className === 'save-comment')){
                    var previousListItem = $(this.el).prev();
                    if(previousListItem.length > 0){
                        $(previousListItem).find('.problem-comment-actions').removeClass('hidden');
                    }
                }else if(!e.shiftKey && (className === 'cancel-comment' || className === 'remove-comment')){
                    var nextListItem = $(this.el).next();
                    if(nextListItem.length > 0){
                        $(nextListItem).find('.problem-comment-actions').removeClass('hidden');
                    }
                }
            }
        },
        removeComment: function(){
            this.model.set('removed', 'yes');
            this.model.set('comment', '');
            if(this.model.get('type') === 'new'){
                this.trigger('comment:removefromlist', this);
            }else{
                $(this.el).addClass('hidden');
                this.leaveEditMode();
            }
        },
        cancelComment: function(){
            if(this.model.get('type') === 'new'){
               this.trigger('comment:removefromlist', this);
            }else {
               this.model.set('comment', this.model.get('previousComment'));
                this.leaveEditMode();
            }
        },
        editComment: function(){
            this.enterEditMode();
        },
        saveComment: function(){
            if(this.model.get('canSave')){
                this.model.set('comment', $(this.el).find('.commentText').val());
                this.leaveEditMode();
            }
        },
        handleCommentTyping: function(){
            var currentLength = $(this.el).find('.commentText').val().trim().length;
            $(this.el).find('.commentCharsRemaining').text(60 - currentLength);
            if(currentLength > 0){
                $(this.el).find('.save-comment b').removeClass('disabled');
                this.model.set('canSave', 'yes');
            }else {
                $(this.el).find('.save-comment b').addClass('disabled');
                this.model.set('canSave', '');
            }
        },
        enterEditMode: function(){
            this.model.set('edit-mode', 'yes');
            this.model.set('previousComment', this.model.get('comment'));
            this.render();
        },
        leaveEditMode: function(){
            this.model.set('edit-mode', '');
            this.render();
            this.trigger('comment:finishedEditing');
        }
    });

    var CommentListView = Backbone.Marionette.CollectionView.extend({
        tagName: "ul",
        childView: ProblemCommentView,
        childEvents: {
            'comment:removefromlist': 'removeItem',
            'comment:finishedEditing': 'focusAddButton'
        },
        focusAddButton: function(){
            $('#addCommentBtn').focus();
        },
        removeItem: function(childView){
            this.collection.remove(childView.model);
            this.focusAddButton();
        },
        addNewComment: function(){
            var newModel = new Backbone.Model({comment: '', type: 'new'});
            this.collection.add(newModel);
        }
    });

    function getFooterView(){
        var template;

        if(currentAppletKey === 'problem_edit'){
            template = '<button id="cancelBtn" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                '<button type="button" id="editProblemUpdate" class="btn btn-primary">Update Active Problem</button>';
        }else {
            template = '<div class="pull-left">' +
                    '<button type="button" class="btn btn-default" id="addProblemBackBtn">Back</button>' +
                '</div>' +
                '<div class="pull-right">' +
                    '<button id="cancelBtn" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                    '<button type="button" id="addProblemSubmitBtn" class="btn btn-primary">Add Active Problem</button>' +
                '</div>';
        }

        function ucfirst(textString) {
            if (textString) {
                return textString.substring(0, 1).toUpperCase() + textString.substring(1).toLowerCase();
            }
            return '';
        }

        gatherInput = function() {
            var model = modalView.model;
            var service = selectedService;
            var provider = selectedVisitProvider;
            var comments = modalView.commentsView.collection;

            var obj = {};
            var patient = ADK.PatientRecordService.getCurrentPatient();
            var user = ADK.UserService.getUserSession();
            var userId  = user.get('duz')[user.get('site')] ? user.get('duz')[user.get('site')] : user.get('duz')[0];

            if(currentAppletKey === 'problem_add'){
                obj.patientIEN = patient.get('localId');
                obj.patientName = patient.get('fullName');
                obj.enteredByIEN = userId;
                obj.enteredBy = user.get('lastname') + ',' + user.get('firstname');
            }

            //Responsible provider
            if(provider){
                if(provider.get('localId') !== -1){
                    obj.responsibleProviderIEN = provider.get('localId');
                    obj.providerIEN = provider.get('localId');
                }

                obj.responsibleProvider = provider.get('name');
            } else {
                obj.responsibleProviderIEN = userId;
                obj.providerIEN = userId;
                obj.responsibleProvider = user.get('lastname') + ',' + user.get('firstname');
            }

            obj.userIEN = userId;

            obj.status = $('#status .btn.active').data('value');

            obj.lexiconCode = model.get('lexiconCode') || "";
            obj.problemName = model.get('problem') || model.get('problemText');
            obj.problemText = model.get('problemText');

            if(model.get('problemNumber')){
                obj.problemNumber = model.get('problemNumber');
            }else if (model.get('uid')) {
                obj.problemNumber = model.get('uid').split(':').pop();
            }

            if(service) {
                if (service.get('localId')){
                    obj.service = service.get('localId') + '^' + service.get('name');
                }
            }
            if  (!$('#problem').val() && (currentAppletKey === 'problem_edit')) {
                obj.service = '0';
            }

            if(currentAppletKey === 'problem_add'){
                obj.dateRecorded = ADK.utils.dateUtils.getRdkDateTimeFormatter().getCurrentDate();
            }else {
                obj.dateLastModified = ADK.utils.dateUtils.getRdkDateTimeFormatter().getCurrentDate();
            }

            var onsetDate = $('#dp-problem').val();
            if(onsetDate){
                obj.dateOfOnset = ADK.utils.dateUtils.getRdkDateTimeFormatter().getDateFromDateString(onsetDate);
            }

            var visit = patient.get('visit');
            if(visit && visit.selectedProvider){
                obj.recordingProvider = visit.selectedProvider.name;
                obj.recordingProviderIEN = visit.selectedProvider.localId;
            }

            obj.acuity = $('#problemAcuitySelect .btn.active').data('value');

            // treatment factors
            if (model.get('showRadiation') === "yes") {
                obj.radiation = ucfirst($('#tf-radiation .btn.active').data('value'));
            }
            if (model.get('showAgentOrange') === "yes") {
                obj.agentOrange = ucfirst($('#tf-agentorange .btn.active').data('value'));
            }
            if (model.get('showSouthwestAsiaConditions') === "yes") {
                obj.southwestAsiaConditions = ucfirst($('#tf-swasiaconditions .btn.active').data('value'));
            }
            if (model.get('showHeadNeckCancer') === "yes") {
                obj.headOrNeckCancer = ucfirst($('#tf-headneckcancer .btn.active').data('value'));
            }
            if (model.get('showMST') === "yes") {
                obj.MST = ucfirst($('#tf-mst .btn.active').data('value'));
            }
            if (model.get('showServiceConnected') === "yes") {
                obj.serviceConnected = ucfirst($('#tf-serviceconnected .btn.active').data('value'));
            }
            if (model.get('showShipboardHazard') === "yes") {
                obj.shipboard = ucfirst($('#tf-shipboardhazard .btn.active').data('value'));
            }

            if(model.get('snomed')){
                obj.snomedCode = model.get('snomed');
            }

            obj.comments = [];

            if(currentAppletKey === 'problem_add') {
                _.each(comments.models, function(element, index, list) {
                    obj.comments.push(element.get('comment'));
                });
            } else {
                // edit
                var commentsList = [];
                _.each(comments.models, function(element, index, list) {
                    var comment = element.get('comment'),
                        old = element.get('old'),
                        newComment = {};

                    // old, old + edit, old + remove
                    if (old) {
                        obj.comments.push({ old : old, 'new' : comment });
                    // add, add + edit, add + remove, add + edit + remove
                    } else {
                        if (comment !== "") {   // not a remove
                            obj.comments.push({ old : "", 'new' : comment });
                        }
                    }
                });
            }
            return obj;
        };

        buildSaveObject = function() {
            var obj = gatherInput();
            var model;

            if(currentAppletKey === 'problem_edit'){
                model = new EditProblemModel(obj);
            }else {
                model = new AddProblemModel(obj);
            }

            return model;

        };

        var footerView = Backbone.Marionette.ItemView.extend({
            template: _.template(template),
            events: {
                'click #editProblemUpdate': 'submitEdit',
                'click #addProblemBackBtn': 'navToSearch',
                'click #addProblemSubmitBtn': 'submitNewProblem',
                'keydown #cancelBtn': 'handleKeyPress'
            },
            submitEdit: function(){
                $('#addEditProblemForm #error-container').text('');
                var  saveModel = buildSaveObject();
                saveModel.save(null, {
                    success:function() {
                        ADK.UI.Modal.hide();

                        setTimeout(function() {
                            $('div[data-appletid="problems"] .applet-refresh-button').trigger('click');
                        }, 2000);
                    },
                    error: function(model) {
                        $('#addEditProblemForm #error-container').text('Save Failed');
                    }
                });
            },
            handleKeyPress: function(e){
                if(e.keyCode === 9 && e.shiftKey){
                    if(modalView.commentsView.collection.length > 0){
                        $('.problem-comment-actions').last().removeClass('hidden');
                    }
                }
            },
            submitNewProblem: function(){
                $('#addEditProblemForm #error-container').text('');
                var  saveModel = buildSaveObject();
                saveModel.save(null, {
                    success:function() {
                        ADK.UI.Modal.hide();

                        // refresh problem list
                        setTimeout(function() {
                            $('div[data-appletid="problems"] .applet-refresh-button').trigger('click');
                        }, 2000);
                    },
                    error: function(model, error) {
                        if(error.status === 400){
                            $('#addEditProblemForm #error-container').text('Save Failed: Please provide all required fields.');
                            $('#respProviderBlock div').addClass('has-error');
                        }else {
                            $('#addEditProblemForm #error-container').text('Save Failed');
                        }
                    }
                });
            },
            /* Future Story: keep this commented. this will support navigation going back to detailview in a future story.
            navToDetailView: function(event) {

                var patientModel = ADK.PatientRecordService.getCurrentPatient();
                var patient = {
                    icn: patientModel.get('icn'),
                    pid: patientModel.get('pid')
                };

                var channel = ADK.Messaging.getChannel('problems'),
                    deferredResponse = channel.request('detailView', { uid : modalView.model.get('uid'), patient : patient } );

                deferredResponse.done(function(response) {
                    var problemDetailApplet = response.view;
                    ADK.UI.Modal.show(problemDetailApplet, { title : 'test' } );
                });
            },
            */
            navToSearch: function(event) {
                problemChannel.command('openProblemSearch', 'problem_search');
            }
        });

        return footerView;
    }

    var selectedService;
    var selectedVisitProvider;
    var ModalView = Backbone.Marionette.LayoutView.extend({
        template: addEditProblemTemplate,
        regions: {
            service: "#serviceBlock",
            comments: "#comment-list",
            provider: "#respProviderBlock"
        },
        events: {
            'click #addCommentBtn': 'handleAddComment',
            'click #date-picker-icon': 'openDatePicker',
            'click .toggle-btn' : 'handleToggleButton',
            'keydown #addCommentBtn': 'handleKeyPress'
        },
        initialize: function(){
            var patient = ADK.PatientRecordService.getCurrentPatient();

            if(this.model.get('comments')){
                var commentsList = [];
                _.each(this.model.get('comments'), function(element, index, list) {
                    commentsList[index] = element;
                    commentsList[index].old = element.comment;
                });
                this.commentsView = new CommentListView({collection: new Backbone.Collection(commentsList)});
            }else {
                this.commentsView = new CommentListView({collection: new Backbone.Collection()});
            }

            var siteCode = ADK.UserService.getUserSession().get('site');
            var user = ADK.UserService.getUserSession();
            var fetchOptions = {};
            fetchOptions.resourceTitle = "locations-clinics";

            fetchOptions.criteria = {
                "site.code": siteCode,
                limit: 10
            };

            var serviceLocation;
            if(currentAppletKey === 'problem_edit' && this.model.get('locationName')){
                serviceLocation = new Backbone.Model({name: this.model.get('locationName')});
            }else if(currentAppletKey === 'problem_add' && patient.get('visit') && patient.get('visit').locationUid){
                var localId = patient.get('visit').locationUid.split(':').pop();
                serviceLocation = new Backbone.Model({name: patient.get('visit').locationName, localId: localId});
            }else {
                serviceLocation = new Backbone.Model();
            }

            this.model.set('serviceLocationName', serviceLocation.get('name'));
            
            var provFetchOptions = {
                resourceTitle: "visits-providers",
                criteria: {
                    "facility.code": siteCode,
                    limit: 10
                }
            };

            var prov;
            if(this.model.get('providerName')){
                //We're in edit mode - preload the provider
                var providerId = -1;
                if(this.model.get('providerUid')){
                    providerId = this.model.get('providerUid').split(':').pop();
                }

                prov = new Backbone.Model({name: this.model.get('providerName'), localId: providerId});
            }else if(user.get('provider')){
                // We're in add mode and the current user is a provider
                var provName = user.get('lastname') + ',' + user.get('firstname');
                var provId = user.get('duz')[user.get('site')] ? user.get('duz')[user.get('site')] : user.get('duz')[0];
                prov = new Backbone.Model({name: provName, localId: provId});
                
                this.model.set('serviceVisitProvider', provName);
            }

            var exposures = patient.get('exposure');
            if(exposures){
                for(var i=0; i < exposures.length; i++){
                    var name = exposures[i].name;

                    if(exposures[i].uid.indexOf('urn:va:ionizing-radiation') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showRadiation', 'yes');
                            this.model.set('treatmentFactor-radiation', exposures[i].name);
                        }
                    }else if(exposures[i].uid.indexOf('urn:va:agent-orange') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showAgentOrange', 'yes');
                            this.model.set('treatmentFactor-agentOrange', exposures[i].name);
                        }
                    }else if(exposures[i].uid.indexOf('urn:va:sw-asia') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showSouthwestAsiaConditions', 'yes');
                            this.model.set('treatmentFactor-swAsia', exposures[i].name);
                        }
                    }else if(exposures[i].uid.indexOf('urn:va:head-neck-cancer') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showHeadNeckCancer', 'yes');
                            this.model.set('treatmentFactor-headNeckCancer', exposures[i].name);
                        }
                    }else if(exposures[i].uid.indexOf('urn:va:mst') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showMST', 'yes');
                            this.model.set('treatmentFactor-mst', exposures[i].name);
                        }
                    }else if(exposures[i].uid.indexOf('urn:va:combat-vet') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showServiceConnected', 'yes');
                            this.model.set('treatmentFactor-serviceConnected', exposures[i].name);
                        }
                    }else if(exposures[i].uid.indexOf('urn:va:shipboard') > -1){
                        if (name.toUpperCase() !== "NO") {
                            this.model.set('showShipboardHazard', 'yes');
                            this.model.set('treatmentFactor-shipboardHazard', exposures[i].name);
                        }
                    }
                }
            }

        },
        setExistingDataAndDefaults: function(){
            var statusName = this.model.get('statusName') || 'Active';
            var locationName = this.model.get('locationName');
            var providerName = this.model.get('providerName');
            var acuityName = this.model.get('acuityName') || 'Unknown';

            if(statusName === 'Inactive'){
                this.$('#inactive').addClass('active');
            } else {
                this.$('#active').addClass('active');
            }

            this.$('#' + acuityName.toLowerCase()).addClass('active');

            if(this.model.get('treatmentFactor-radiation') === 'yes'){
                this.$('#radiationYes').addClass('active');
            }else {
                this.$('#radiationNo').addClass('active');
            }

            if(this.model.get('treatmentFactor-agentOrange') === 'yes'){
                this.$('#agentOrangeYes').addClass('active');
            }else {
                this.$('#agentOrangeNo').addClass('active');
            }

            if(this.model.get('treatmentFactor-swAsia') === 'yes'){
                this.activateRadioButton('swAsiaConditionsYes');
            }else {
                this.activateRadioButton('swAsiaConditionsNo');
            }

            if(this.model.get('treatmentFactor-headNeckCancer') === 'yes'){
                this.$('#headNeckCancerYes').addClass('active');
            }else {
                this.$('#headNeckCancerNo').addClass('active');
            }

            if(this.model.get('treatmentFactor-mst') === 'yes'){
                this.$('#mstYes').addClass('active');
            }else {
                this.$('#mstNo').addClass('active');
            }

            if(this.model.get('treatmentFactor-serviceConnected') === 'yes'){
                this.$('#serviceConnectedYes').addClass('active');
            }else {
                this.$('#serviceConnectedNo').addClass('active');
            }

            if(this.model.get('treatmentFactor-shipboardHazard') === 'yes'){
                this.$('#shipboardHazardYes').addClass('active');
            }else {
                this.$('#shipboardHazardNo').addClass('active');
            }

            if(this.model.get('onset')){
                this.$('#dp-problem').datepicker('update', new Moment(this.model.get('onset'), 'YYYYMMDD').format(ADK.utils.dateUtils.defaultOptions().placeholder));
            } else {
                this.$('#dp-problem').datepicker('update', new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder));
            }
        },
        onRender: function(){
            this.comments.show(this.commentsView);

            ADK.utils.dateUtils.datepicker(this.$('#dp-problem'));

            //resp provider typeahead
            var visitProviderSearch = addEditBloodhound.VisitProviderBloodhound;
            visitProviderSearch.initialize();

            $(this.el).find('#respProvider').typeahead({
                minLength: 1,
                highlight: true,
                hint: true
            }, {
              name: 'visit-search-item',
              displayKey: 'value',
              source: visitProviderSearch.ttAdapter()
            }).on('typeahead:selected', function(event, item) {
                selectedVisitProvider = new Backbone.Model({name: item.value, localId: item.localId});
            });                        
            
            //service provider typeahead
            var locationSearch = addEditBloodhound.LocationSearchBloodhound;
            locationSearch.initialize();

            $(this.el).find('#serviceLocation').typeahead({
                minLength: 1,
                highlight: true,
                hint: true
            }, {
              name: 'location-search-item',
              displayKey: 'value',
              source: locationSearch.ttAdapter()
            }).on('typeahead:selected', function(event, item) {
                selectedService= new Backbone.Model({name: item.value, localId: item.localId});
            });           

            this.setExistingDataAndDefaults();
        },
        handleKeyPress: function(e){
            if(e.keyCode === 13 || e.keyCode === 32){
                $(e.currentTarget).click();
            }else if(e.keyCode === 9){
                if(!e.shiftKey && this.commentsView.collection.length > 0){
                    $('.problem-comment-actions').first().removeClass('hidden');
                }
            }
        },
        handleAddComment: function(e){
            this.commentsView.addNewComment();
        },
        handleToggleButton : function(e) {
            // remove active from all  buttons at same level
            $(e.target).siblings().removeClass('active');
            $(e.target).addClass('active');

        },
        openDatePicker: function(){
            this.$('#dp-problem').datepicker('show');
        },
        activateRadioButton: function(buttonId){
            this.$('#' + buttonId).first().attr('checked', true);
            this.$('label[for="' + buttonId + '"]').first().addClass('active');
        }
    });
    return ModalView;
});
