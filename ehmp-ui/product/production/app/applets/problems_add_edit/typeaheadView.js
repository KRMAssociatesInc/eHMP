define([
    "jquery",
    "underscore",
    "handlebars"
], function($, _, Handlebars) {

    var Typeahead = {
        generate: function(typeaheadId, labelText, fetchOptions, modelPropertyForList, fetchCriteriaQueryParam, defaultModel){

            var ListItemView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{' + modelPropertyForList + '}}'),
                tagName: 'li',
                className: 'list-group-item',
                attributes: function(){
                    return {
                        id: this.model.cid,
                        role: 'menuitem',
                        tabindex: -1,
                        'data-name': this.model.get(modelPropertyForList),
                        'data-icd9': this.model.get('icd9')
                    };
                },
                onRender : function() {
                    if (!($('#uncoded').is(':checked')) && (this.$el.attr('data-icd9') == "799.9")) {
                        this.$el.css('display','none');
                    }
                }
            });

            var TypeaheadView = Backbone.Marionette.CompositeView.extend({
                template: Handlebars.compile(
                            '<div class="input-group">' +
                                '<label class="sr-only" for="' + typeaheadId + '">Enter search term or SNOMED number</label>' +
                                '<span class="input-group-addon"><i class="fa fa-search"></i></span>' +
                                '<input class="form-control" autocomplete="off" id="' + typeaheadId + '" tabindex="0" data-uid="" placeholder="Enter search term or SNOMED number" value="{{searchTerm}}"/>' +
                            '</div>' +
                            '<div class="input-group uncoded-tool-tip" data-toggle="tooltip" data-placement="right" title="Expands search results to include problems which do not have SNOMED codes and/or have ICD 9 code of 799.9">' +
                                '<label for="uncoded"></label>' +
                                '<input type="checkbox" id="uncoded" value="1" {{uncoded}}> Extend Search' +
                            '</div>' +
                            '<div id="problemsNoResults" aria-hidden="true">' +
                                '<span><i>No results</i></span>' +
                            '</div>' +
                            '<div id="problemSearchLoadingIndicator" aria-hidden="true">' +
                                '<span><h5><i class="fa fa-spinner fa-spin"></i> Loading...</h5></span>' +
                            '</div>' +
                        '<div id="' + typeaheadId + '-typeahead-list">' +
                            '<ul role="menu" class="list-group"></ul>' +
                        '</div>' +
                        '<div id="' + typeaheadId + '-error"></div>'),
                childViewContainer: 'ul',
                childView: ListItemView,
                events: function(){
                    var _events = {};
                    _events["keyup #" + typeaheadId] = "searchItems";
                    _events["click #uncoded"] = "handleCodeCheck";
                    _events["keydown #uncoded"] = "handleCheckboxKeyPress";
                    _events["keyup ul"] = "searchItems";
                    _events["click li"] = "setModel";
                    _events["blur #" + typeaheadId] = "clearModelIfEmpty";
                    _events["keydown li"] = "handleItemKeyPress";

                    return _events;

                },
                searchItems: function(event){
                    if (event.keyCode === 38 || event.keyCode === 40) {
                        this.handleArrowSelection(event);
                    }else if(event.keyCode !== 9){
                        this.selectedModel = undefined;
                        this.performActionWhileTyping(event, 'keyup', 2, 500, this.handleTextEntered, this);
                    }
                },
                handleItemKeyPress: function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    if(e.keyCode === 13 || e.keyCode === 32){
                        this.setModel(e);
                    }else if(e.keyCode === 9){
                        if(e.shiftKey){
                            $('#uncoded').focus();
                        }else{
                            $('#cancelBtn').focus();
                        }
                    }
                },
                setModel: function(e){
                    var id = e.target.id;
                    var selectedModel = this.collection.get(id);

                    this.selectedModel = selectedModel;
                    $("#problem").attr("data-uid", this.model.get('uid'));
                    this.trigger('selected_typeahead:' + typeaheadId);

                    var focusables = $(document).find('a, button, :input, [tabindex]');
                    var typeaheadSelector = $('#' + typeaheadId);
                    var inputIndex = $(focusables).index(typeaheadSelector);

                    if(inputIndex === focusables.length - 1){
                        focusables[0].focus();
                    }else {
                        focusables[inputIndex + 1].focus();
                    }
                },
                initialize: function(options){
                    this.resultLimit = 50;
                    this.currentRequestCount = 0;
                    this.masterCollection = new Backbone.Collection();
                    this.codedCollection = new Backbone.Collection();
                    this.collection = new Backbone.Collection();

                    var comparator = function( model ) {
                        return( model.get( 'problem' ).toLowerCase() );
                    };

                    this.masterCollection.comparator = comparator;
                    this.codedCollection.comparator = comparator;
                    this.model = new Backbone.Model({uncoded : '', searchTerm : ''});
                },
                onRender: function(){
                    var self = this;
                    this.$el.find('#problemSearchLoadingIndicator').hide();
                    this.$el.find('#problemsNoResults').hide();
                    this.$el.find('#problem-typeahead-list').on('scroll', self, self.handleScroll);
                },
                handleScroll: function(event){
                    var div = $('#problem-typeahead-list');
                    var uncoded = event.data.model.get('uncoded');

                    if (div[0].scrollHeight - div.scrollTop() - 25 < div.height()) {
                        var endLimit;
                        if(uncoded){
                            endLimit = event.data.resultLimit + 50 <= event.data.masterCollection.length ? event.data.resultLimit + 50 : event.data.masterCollection.length - 1;
                        } else {
                            endLimit = event.data.resultLimit + 50 <= event.data.codedCollection.length ? event.data.resultLimit + 50 : event.data.codedCollection.length - 1;
                        }

                        if(event.data.resultLimit < endLimit){
                            for(var i=event.data.resultLimit + 1; i <= endLimit; i++){
                                if(uncoded){
                                    event.data.collection.push(event.data.masterCollection.at(i));
                                }else {
                                    event.data.collection.push(event.data.codedCollection.at(i));
                                }
                            }
                        }

                        event.data.resultLimit = endLimit;
                    }
                },
                handleTextEntered: function(view) {
                    var searchTerm = $('#' + typeaheadId).val() || '';
                    view.search(searchTerm);
                },
                performActionWhileTyping: function(event, eventType, characterThreshold, timeThreshold, callback, view) {
                    if (event.type !== eventType) {
                        return;
                    }

                    var target = (event.target) ? event.target : event.srcElement;

                    if ($(target).val().length <= characterThreshold && typeof timeoutHandle !== 'undefined') {
                            clearTimeout(timeoutHandle);
                            this.collection.set([]);
                    } else if ($(target).val().length > characterThreshold) {
                        if (typeof timeoutHandle === 'undefined') {
                            timeoutHandle = _.delay(callback, timeThreshold, view);
                        } else {
                            clearTimeout(timeoutHandle);
                            timeoutHandle = _.delay(callback, timeThreshold, view);
                        }
                    }
                },
                handleCodeCheck: function(e) {

                    this.model.set('uncoded', $('#uncoded').is(':checked') ? "checked" : "");
                    this.setInitialVisibleCollection(this.model.get('uncoded'));
                },
                handleCheckboxKeyPress: function(e){
                    if(!e.shiftKey && e.keyCode === 9){
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if(this.collection.length === 0){
                            $('#cancelBtn').focus();   
                        }else{
                            $('#problem-typeahead-list li.focused').removeClass('focused');
                            var listItem = $('#problem-typeahead-list li').first();
                            listItem.focus();
                            listItem.addClass('focused');
                            //$('#problem-typeahead-list li').first().focus();
                        }
                    }
                },
                search: function(term){
                    this.collection.set([]);
                    this.codedCollection.set([]);
                    this.masterCollection.set([]);
                    $('#problemSearchLoadingIndicator').show();
                    $('#problemSearchLoadingIndicator').focus();
                    $('#uncoded').attr('disabled', true);
                    this.model.set('searchTerm', term);
                    $('#searchProblemModal #error-container').text('');
                    $('#problemsNoResults').hide();

                    var that = this;

                    fetchOptions.onError =  function(model, resp) {
                        $('#searchProblemModal #error-container').text('Search Failed');
                        that.currentRequestCount--;
                        $('#problemSearchLoadingIndicator').hide();
                    };

                    fetchOptions.onSuccess = function(collection, resp){
                        that.codedCollection.set([]);
                        that.currentRequestCount--;

                        _.each(collection.models, function(element){
                            if(element.get('problem')){
                                that.codedCollection.push(element);
                            }
                        });

                        that.codedCollection.sort();

                        if(that.currentRequestCount === 0){
                            if(that.model.get('uncoded')){
                                that.setInitialVisibleCollection(true);
                            }else {
                                that.setInitialVisibleCollection(false);
                            }
                        }
                    };

                    fetchOptions.criteria[fetchCriteriaQueryParam] = term;

                    $.when(ADK.ResourceService.fetchCollection($.extend(true,{},fetchOptions,{criteria : {uncoded : 1}}), this.masterCollection)).done(function(){
                        that.currentRequestCount++;
                        // second call uncoded - alpha only (alphanumeric returns all coded/uncoded results)
                        var alphaRegEx = /^[a-zA-Z\s]+$/;

                        if (alphaRegEx.test(term)) {
                            var uncodedCollection = new Backbone.Collection();

                            uncodedCollection.on('add', function(model) {
                                if (!model.get('No data') && model.get('problem')) {
                                    that.masterCollection.push(model);
                                }
                            }, this);

                            fetchOptions.onSuccess = function() {
                                that.masterCollection.sort();
                                that.currentRequestCount--;

                                if(that.currentRequestCount === 0){
                                    if(that.model.get('uncoded')){
                                        that.setInitialVisibleCollection(true);
                                    }else {
                                        that.setInitialVisibleCollection(false);
                                    }
                                }
                            };

                            fetchOptions.onError = function() {
                                that.currentRequestCount--;
                                $('#problemSearchLoadingIndicator').hide();
                            };

                            that.currentRequestCount++;
                            ADK.ResourceService.fetchCollection(fetchOptions, uncodedCollection);
                        } else {
                            that.masterCollection.sort();
                        }

                    }).fail(function(){
                      // this is handled by fetchOptions.onError
                    });

                },
                setInitialVisibleCollection: function(uncoded){
                    this.collection.set([]);
                    $('#problemSearchLoadingIndicator').hide();

                    if(uncoded){
                        this.resultLimit = this.masterCollection.length >= 50 ? 50 : this.masterCollection.length - 1;
                        for(var i=0; i <= this.resultLimit; i++){
                            var model = this.masterCollection.at(i);
                            if(model.get('problem') && model.get('problem') !== 'Invalid'){
                               this.collection.push(model);
                            }
                        }
                    }else {
                        this.resultLimit = this.codedCollection.length >= 50 ? 50 : this.codedCollection.length - 1;
                        for(var j=0; j <= this.resultLimit; j++){
                            var codedModel = this.codedCollection.at(j);
                            if(codedModel.get('problem') && codedModel.get('problem') !== 'Invalid'){
                               this.collection.push(codedModel);
                            }
                        }
                    }

                    if(this.collection.length === 0 && this.model.get('searchTerm')){
                        $('#problemsNoResults').show();
                        $('#problemsNoResults').focus();
                    }

                    $('#uncoded').attr('disabled', false);

                },
                clearModelIfEmpty: function(){
                    var searchTerm = $('#' + typeaheadId).val();

                    if(!searchTerm){
                        this.model.set('searchTerm', '');
                        $('#problemsNoResults').hide();
                    }
                },
                handleArrowSelection: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var focusedItem = $(this.el).find('li.focused');

                    if(focusedItem[0]){
                        focusedItem.removeClass('focused');

                        var newFocusedItem;
                        if(e.keyCode === 40){
                            newFocusedItem = focusedItem.next();
                        }else {
                            if($(this.el).find('li:first-child')[0].id === focusedItem[0].id){
                                newFocusedItem = $(this.el).find('li:last-child');
                            }else {
                                newFocusedItem = focusedItem.prev();
                            }
                        }

                        newFocusedItem.addClass('focused');
                        newFocusedItem.focus();

                    }else {
                        e.preventDefault();
                        var listItem = $(this.el).find('li:first-child');
                        listItem.addClass('focused');
                        listItem.focus();
                    }
                }
            });

            return TypeaheadView;
        }
    };

    return Typeahead;
});
