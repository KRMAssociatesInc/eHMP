define([
    "underscore",
    "handlebars"
], function(_, Handlebars) {

    var Typeahead = {
        generate: function(typeaheadId, labelText, fetchOptions, modelPropertyForList, fetchCriteriaQueryParam, defaultModel){
            var ListItemView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{' + modelPropertyForList + '}}'),
                tagName: 'li',
                className: 'list-group-item',
                model: fetchOptions.model,
                attributes: function(){
                    return {
                        id: this.model.cid,
                        role: 'menuitem',
                        tabindex: -1,
                        'data-name': this.model.get(modelPropertyForList)
                    };
                }
            });

            var TypeaheadView = Backbone.Marionette.CompositeView.extend({
                template: Handlebars.compile('<label for="' + typeaheadId + '">' + labelText + '</label><input class="form-control" autocomplete="off" id="' + typeaheadId + '" value="{{' + modelPropertyForList + '}}"/><div id="' + typeaheadId + '-typeahead-list"><ul role="menu" class="list-group"></ul></div><div id="' + typeaheadId + '-error"></div>'),
                model: defaultModel,
                childViewContainer: 'ul',
                childView: ListItemView,
                events: function(){
                    var _events = {};
                    _events["keyup #" + typeaheadId] = "searchItems";
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
                        this.model = undefined;
                        this.performActionWhileTyping(event, 'keyup', 2, 500, this.handleTextEntered, this);
                    }
                },
                handleItemKeyPress: function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    if(e.keyCode === 13 || e.keyCode === 32){
                        this.setModel(e);
                    }
                },
                setModel: function(e){
                    var id = e.target.id;
                    var selectedModel = this.collection.get(id);

                    if(!selectedModel.get('isLoading')){
                        this.model = selectedModel;
                        this.render();
                        this.collection.reset();
                        this.trigger('selected_typeahead:' + typeaheadId);
                    }

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
                    this.collection = new Backbone.Collection();
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
                            this.collection.reset();
                    } else if ($(target).val().length > characterThreshold) {
                        if (typeof timeoutHandle === 'undefined') {
                            timeoutHandle = _.delay(callback, timeThreshold, view);
                        } else {
                            clearTimeout(timeoutHandle);
                            timeoutHandle = _.delay(callback, timeThreshold, view);
                        }
                    }
                },
                search: function(searchTerm){
                    if(!fetchOptions.criteria){
                        fetchOptions.criteria = {};
                    }

                    fetchOptions.criteria[fetchCriteriaQueryParam] = searchTerm;
                    this.collection.reset();

                    var dummyLoadingModel = new Backbone.Model({name: "Loading...", isLoading: true});
                    this.collection.push(dummyLoadingModel);
                    ADK.ResourceService.fetchCollection(fetchOptions, this.collection);
                },
                clearModelIfEmpty: function(){
                    var searchTerm = $('#' + typeaheadId).val();

                    if(!searchTerm){
                        this.model = undefined;
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
