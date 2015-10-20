define([
    "jquery",
    "underscore",
    "hbs!app/applets/problems_add_edit/search",
    "hbs!app/applets/problems_add_edit/headerTemplate",
    "app/applets/problems_add_edit/typeaheadView",
    "app/applets/problems_add_edit/addEditModalView",
    'app/applets/problems_add_edit/util',
    'typeahead',
    "app/applets/problems_add_edit/util/problemSearchBloodhound"
], function($, _, searchTemplate, headerTemplate, Typeahead, AddEditModalView, Util, TwitterTypeahead, problemSearchBloodhound){

    var problemChannel = ADK.Messaging.getChannel('problem-add-edit'),
        visitChannel = ADK.Messaging.getChannel('visit'),
        currentAppletKey,
        modalView;

    function handleChannel(appletKey){
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        currentAppletKey = appletKey;

        if(currentPatient.get('visit')){
            showSearchView();
        }else {
            visitChannel.command('openVisitSelector', 'problem_add_edit');
            visitChannel.on('set-visit-success:problem_add_edit', function() {
                $('#mainModal').one('hidden.bs.modal', showSearchView);
            });
        }
    }

    problemChannel.comply('openProblemSearch', handleChannel);

    function showSearchView(){
        modalView = new ModalView();
        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });
        modal.show();
        $('#modal-lg-region').empty();
    }

    function enableFreeTextButton(){
        $("#freeTextBtn").attr("disabled", false);
    }

    function disableFreeTextButton(){
        $("#freeTextBtn").attr("disabled", true);
    }

    var problemParseModel = {
        parse: function(response) {
            response = Util.getProblem(response);
            response = Util.getProblemText(response);

            return response;
        }
    };

    function showAddModal(selectedProblem) {

        if(selectedProblem){
            problemChannel.command('openProblemAdd', 'problem_add',selectedProblem);
        }else {
            var freeTextModel = new Backbone.Model({problemText: $('#bs-problem').val() + ' (ICD-9-CM 799.9)'});
            problemChannel.command('openProblemAdd', 'problem_add', freeTextModel);
        }
    }

    var footerView = Backbone.Marionette.ItemView.extend({
        template: _.template(
            '<div class="pull-right">' +
                '<button id="cancelBtn" type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                '<button id="freeTextBtn" type="button" class="btn btn-primary" data-dismiss="modal" disabled>Use Entered Term</button>' +
            '</div>'),
        events: {
            'click #freeTextBtn': "popAddModal",
            'keydown #freeTextBtn': 'handleFreeTextKeyPress',
            'keydown #cancelBtn': 'handleCancelKeyPress'
        },
        popAddModal: function(event){
            showAddModal();
        },
        handleFreeTextKeyPress: function(e){
            if(e.keyCode === 9){
                e.preventDefault();
                e.stopPropagation();
                if(e.shiftKey){
                    $('#cancelBtn').focus();
                }else {
                    $('button.close').focus();
                }
            }
        },
        handleCancelKeyPress: function(e){
               if(e.keyCode === 9){
                   e.preventDefault();
                   e.stopPropagation();
                   if(e.shiftKey){
                       if(modalView.problemView.collection.length === 0){
                           $('#uncoded').focus();
                       }else{
                           $('#problem-typeahead-list li.focused').removeClass('focused');
                           var firstListItem = $('#problem-typeahead-list li').first();
                           firstListItem.focus();
                           firstListItem.addClass('focused');
                       }
                   }else{
                        $('#freeTextBtn').focus();
                   }
               }
        }
    });

    var ModalHeaderView = Backbone.Marionette.ItemView.extend({
        template: _.template('<button type="button" id="problemSearchClose" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="mainModalLabel">Add Active Problem</h4>'),
        events: {
            'keydown #problemSearchClose' : 'handleKeyPress'
        },
        handleKeyPress: function(e){
               if(e.shiftKey && e.keyCode === 9){
                   e.preventDefault();
                   e.stopPropagation();
                   $('#freeTextBtn').focus();
               }
        }
    });
    
    var modalOptions = {
        'title': 'Add Active Problem',
        'size': 'medium',
        'footerView': footerView,
        'headerView': ModalHeaderView,
        'callShow': true
    };

    var ModalView = Backbone.Marionette.LayoutView.extend({
        template: searchTemplate,
        regions: {
            problem: "#problem-select"
        },
        events: function(){
            var _events = {};
            //_events["keyup #problem"] = "enableFreeTextButton";
            _events["keyup #bs-problem"] = "enableFreeTextButton";
            _events['change [name=chkVAT]']= 'uncodedSelect';
            return _events;
        },
        initialize: function() {
            var siteCode = ADK.UserService.getUserSession().get('site');

            var fetchOptions = {
                viewModel: problemParseModel,
                resourceTitle: "problems-getProblems",
                criteria: {
                    "site.code": siteCode
                }
            };

//            var TypeaheadView = Typeahead.generate("problem", "Problem", fetchOptions, "problem", "searchfor");
//            this.problemView = new TypeaheadView();
//            this.listenTo(this.problemView, 'selected_typeahead:problem', showAddModal);

            setTimeout(function() {
                $('#problem').focus();

                $('#searchProblemModal .uncoded-tool-tip').tooltip({
                    delay: {
                     "show": 300,
                     "hide": 0
                    }
                });
            }, 1000);


        },
        showModal: function(event) {
            event.preventDefault();
            var modal = new ADK.UI.Modal({
                view: this,
                options: problemSearchModalOptions
            });
            modal.show();
        },
        onRender: function(){

            var problemSearch = problemSearchBloodhound;
            problemSearch.initialize();

            $(this.el).find('#bs-problem').typeahead({
                minLength: 1,
                highlight: true,
                hint: true
            }, {
              name: 'problem-search-item',
              displayKey: 'value',
              source: problemSearch.ttAdapter()
            }).on('typeahead:selected', function(event, item) {
                var selectedProblem = new Backbone.Model({
                    problem: item.value, 
                    problemNumber: item.problemNumber,
                    icd: item.icd,
                    lexiconCode: item.lexiconCode,
                    snomed: item.snomed,
                    problemText: item.problemText
                });
                showAddModal(selectedProblem);
            });

            //this.problem.show(this.problemView);
        },
        enableFreeTextButton: function(){
            var searchTerm = $('#bs-problem').val();
            if (searchTerm && searchTerm.length >= 3) {
                enableFreeTextButton();
            }
        },
        uncodedSelect: function(e){
            var searchTerm = $("#bs-problem").val();
            //kind of a hack, but works to trigger extended search
            $("#bs-problem").focus().typeahead('val', '');
            $("#bs-problem").focus().typeahead('val', searchTerm);
        } 

    });

    return ModalView;
});
