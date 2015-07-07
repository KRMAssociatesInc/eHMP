define([
    'underscore',
    'handlebars',
    'app/applets/immunizations_add_edit/views/immunizationVisitView',
    'app/applets/immunizations_add_edit/views/addEditImmunizationView',
    'hbs!app/applets/immunizations_add_edit/templates/searchImmunizationTemplate'
], function(_, Handlebars, VisitView, AddEditView, searchTemplate){
    var immunizationChannel = ADK.Messaging.getChannel('immunization'),
    visitChannel = ADK.Messaging.getChannel('visit'),
    currentAppletKey,
    modalView;

    function handleChannel(appletKey){
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        currentAppletKey = appletKey;
        visitChannel.on('set-visit-success:immunizations_search', function() {
            $("#mainModal").one('hidden.bs.modal', showSearchView);
        });

        if(currentPatient.get('visit')){
            showSearchView();
        }else {
            visitChannel.command('openVisitSelector', 'immunizations_search');
        }
    }

    function showSearchView(){
        var modalOptions = {
            title: 'Find an Immunization',
            footerView: SearchFooterView
        };

        modalView = new ModalView();

        ADK.showModal(modalView, modalOptions);
    }
    
    var SearchFooterView = Backbone.Marionette.ItemView.extend({
        template: _.template('<button class="btn btn-default pull-right" data-dismiss="modal">Cancel</button>')
    });
    
    var SearchItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('{{name}}'),
        tagName: 'li',
        className: 'list-group-item',
        attributes: {
            tabindex: -1 
        },
        events: {
            'click': 'handleItemSelected',
            'keyup': 'handleKeyPress'
        },
        handleItemSelected: function(){
            AddEditView.handleMessage('immunization_add', this.model);
        },
        handleKeyPress: function(e){
            if(e.keyCode === 13){
                this.handleItemSelected();
            }else if(e.keyCode === 40){
                var lastItem = $('#immunization-search-list li:last-child')[0];
                
                if($(this.el)[0] === lastItem){
                    $('#immunization-search-list li:first-child').focus();
                }else{
                    $(this.el).next().focus();
                }
            }else if(e.keyCode === 38){
                var firstItem = $('#immunization-search-list li:first-child')[0];
                
                if($(this.el)[0] === firstItem){
                    $('#immunization-search-list li:last-child').focus();
                }else{
                    $(this.el).prev().focus();
                }
            }
        }
    });

    var SearchView = Backbone.Marionette.CompositeView.extend({
        template: searchTemplate,
        events: {
            'keyup #immunization-search-term': 'handleSearchTermTyping'
        },
        childViewContainer: 'ul',
        childView: SearchItemView,
        initialize: function(){
            var fetchOptions = {
                resourceTitle: 'immunization-crud-getPatientImmunizations',
                onError: function(){
                    $('#immunization-loading').addClass('hidden').attr('aria-hidden', true);
                    $('#immunization-loading-error').removeClass('hidden').attr('aria-hidden', false);
                }, 
                onSuccess: function(){
                    $('#immunization-loading').addClass('hidden').attr('aria-hidden', true);
                    $('#immunization-search-term').attr('disabled', false);
                    setTimeout(function(){
                        $('#immunization-search-term').focus();
                    }, 700);
                }
            };
            
            this.masterCollection = ADK.ResourceService.fetchCollection(fetchOptions);
            this.masterCollection.comparator = 'name';
            this.collection = new Backbone.Collection();
        },
        handleSearchTermTyping: function(e){
            if(e.keyCode === 40 && this.collection.length > 0){
                $(this.el).find('#immunization-search-list li:first-child').focus();
            }else if(e.keyCode === 38 && this.collection.length > 0){
                $(this.el).find('#immunization-search-list li:last-child').focus();
            }else if($('#immunization-search-term').val().trim().length >=3){
                var masterCollection = this.masterCollection.models;
                this.collection.reset();

                $(this.el).find('#immunizations-no-results').addClass('hidden').attr('aria-hidden', true);
                if(e.keyCode !== 9){
                    var inputText = $('#immunization-search-term').val();
                    if(inputText.trim().length > 0){
                        var filteredCollection = _.filter(masterCollection, function(item){
                           return ~item.get('name').toLowerCase().indexOf(inputText.toLowerCase()); 
                        });

                        if(filteredCollection.length > 0){
                            this.collection.add(filteredCollection);
                        }else {
                            $(this.el).find('#immunizations-no-results').removeClass('hidden');
                        }
                    }
                }
            }else{
                $(this.el).find('#immunizations-no-results').addClass('hidden').attr('aria-hidden', true);
                this.collection.reset();
            }
        }
    });
    
    var ModalView = Backbone.Marionette.LayoutView.extend({
        regions: {
            visit: '#immunization-visit',
            search: '#search-view'
        },
        template: _.template('<div id="immunization-visit"></div><div id="search-view"></div>'),
        initialize: function(){
            this.visitsView = new VisitView();
            this.searchView = new SearchView();
        },
        onRender: function(){
            this.visit.show(this.visitsView);
            this.search.show(this.searchView);
        }
    });

    var ImmunizationSearchView = {
        handleMessage: handleChannel
    };

    return ImmunizationSearchView;
});
