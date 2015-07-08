define([
    "backbone",
    "marionette",
    "hbs!main/components/text_search/templates/searchBarAreaTemplate",
    "hbs!main/components/text_search/templates/searchSuggestTemplate",
    'api/SessionStorage',
    'api/Messaging',
    'api/ResourceService',
    'api/Navigation'
], function(Backbone, Marionette, searchBarAreaTemplate, searchSuggestTemplate, SessionStorage, Messaging, ResourceService, Navigation) {

    var SuggestView = Backbone.Marionette.ItemView.extend({
        template: searchBarAreaTemplate,
        searchSuggestTemplate: searchSuggestTemplate,
        isSearching: null, // wait (500ms) for user to stop typing before search
        suggestResults: {},
        searchResults: {},
        searchTerm: null,
        suggestionsLocked: false, // never display the suggestion list while this is true (should be true while there is an outstanding search until the search text changes)
        lastQuery: '',

        onBeforeDestroy: function() {

        },
        initialize: function() {
            var self = this;
            var storageText = SessionStorage.getAppletStorageModel('search', 'searchText');
            if (storageText) {
                this.searchTerm = storageText;
            }
        },
        onRender: function(event) {
            var self = this;
            $(document).on('click', function() {
                self.clearSuggestList($('#suggestList'));
                $('#suggestList').hide();
                $('#suggestListDiv').hide();
            });
        },
        events: {
            'keydown #searchtext': 'onSearchTextKey',
            'keydown #suggestList a': 'onSuggestionKey',
            'click #submit': 'doSubmitSearch'
        },
        doAutocomplete: function(keyEvent) {
            var self = this;


            this.cancelSuggest(); //cancel timeout previous suggestion

            this.isSearching = setTimeout(function() {
                var $searchText = $('#searchtext');
                var trimmedSearchText = $searchText.val().trim();
                if (trimmedSearchText && trimmedSearchText.length > 2) {
                    $('#suggestList').hide();
                    $('#noResults').hide();
                    $('#suggestListDiv').show();
                    $('#suggestSpinner').show();

                    var fetchOptions = {
                        criteria: {
                            "query": trimmedSearchText
                        }
                    };
                    fetchOptions.patient = ResourceService.patientRecordService.getCurrentPatient();

                    //fetchOptions.patient = ResourceService.patientRecordService.getCurrentPatient();
                    //fetchOptions.resourceTitle = 'patient-record-search-text';
                    fetchOptions.resourceTitle = 'patient-record-search-suggest';

                    self.suggestResults = ResourceService.patientRecordService.fetchCollection(fetchOptions);
                    self.suggestResults.on("sync", self.fillSuggestList, self);
                }
            }, 500);
        },
        clearSuggestList: function($list) {
            if (!$list) {
                $list = $('#suggestList');
            }
            $list.empty();
        },
        fillSuggestList: function() {
            // don't display this if suggestions are locked
            if (this.suggestionsLocked) {
                return;
            }
            var $suggestList = $('#suggestList');
            this.clearSuggestList($suggestList);
            $suggestList.show();
            $("#suggestSpinner").hide();

            var me = this,
                IDNumCount = 0;
            var duplicates = [];
            var modelsLength = this.suggestResults.models.length;
            if (modelsLength === 1) {
                $('#noResults').show();
                $('#suggestList').hide();
            } else {
                $('#noResults').hide();
                this.suggestResults.models.forEach(function(item) {
                    var category = '';
                    var query = item.get('query');
                    for (var i = 0; i < duplicates.length; i++) {
                        if (query == duplicates[i]) {
                            return;
                        }
                    }
                    duplicates.push(query);
                    document.getElementById('suggestPanel').className = 'dropdown open';
                    if (typeof(item.get('category')) !== 'undefined') {
                        category = item.get('category');
                    }
                    var suggestID = 'SuggestItem' + IDNumCount.toString();
                    var display = (item.get('display') || '');
                    var searchText = $('#searchtext').val().toString();

                    category = item.attributes.category;

                    var displaySplit = display.split(new RegExp(searchText, 'i'));

                    if (category === 'Spelling Suggestion') {
                        searchText = '';
                    }
                    var $suggestItem = $(me.searchSuggestTemplate({
                        itemId: suggestID,
                        category: category,
                        firstString: displaySplit[0],
                        boldString: display.indexOf(searchText) > -1 ? searchText : '',
                        lastString: displaySplit[1],
                        cleansedSearchResult: display.replace(/<[^>]*>/g, "")
                    }));
                    if (IDNumCount === 0) {
                        $suggestItem.remove('.suggestListCategory');
                    }
                    $suggestList.append($suggestItem);

                    $(document).ready(function() {
                        var query2 = query;
                        var me1 = me;
                        $("#" + suggestID).click(function(event) {
                            var query3 = query2;
                            var me2 = me1;
                            me2.searchFromSuggest(query3);

                        });
                    });

                    IDNumCount++;
                });
            }
        },

        cancelSuggest: function() {
            if (this.isSearching) {
                clearTimeout(this.isSearching);
            }
        },

        searchFromSuggest: function(suggestion) {
            $('#searchtext').val(suggestion);
            this.doSubmitSearch();
        },
        doSubmitSearch: function() {
            this.cancelSuggest(); //cancel any pending suggestion call

            var trimmedSearchText = $('#searchtext').val().trim();
            this.searchTerm = trimmedSearchText;
            if (trimmedSearchText) {
                this.doReturnResults();
            }

        },
        doReturnResults: function() {
            $("#suggestList").hide();
            $("#suggestSpinner").hide();
            //use this function to implement sending the data to the text-Search applet
            var completedSearchData = {
                searchTerm: this.searchTerm
            };
            Navigation.navigate('record-search');
            $('#searchtext').val(this.searchTerm);
            SessionStorage.setAppletStorageModel('search', 'searchText', completedSearchData);

            var interval = setInterval(function() {
                if (SessionStorage.getAppletStorageModel('search', 'searchText').searchTerm === completedSearchData.searchTerm) {
                    clearInterval(interval);
                    Messaging.getChannel('search').trigger('newSearch');
                }
            }, 500);
        },
        onAccessibilityKeydown: function(keyEvent) {
            if (keyEvent.keyCode === 32 || keyEvent.keyCode === 13) { // trigger click on space/enter key for accessibility
                $(keyEvent.target).trigger('click');
            }
        },
        getFirstSearchSuggestion: function() {
            return $('#suggestList > :first-child a');
        },
        getLastSearchSuggestion: function() {
            return $('#suggestList > :last-child a');
        },
        onSearchTextKey: function(keyEvent) {
            var $suggestList = $('#suggestList');
            switch (keyEvent.keyCode) {
                case 13: // enter key
                    // submit real search
                    keyEvent.preventDefault();
                    this.doSubmitSearch();
                    break;
                case 27: // escape key
                    // hide suggestion list
                    this.clearSuggestList($suggestList);
                    $suggestList.hide();
                    $('#suggestListDiv').hide();
                    break;
                case 38: // up arrow
                    // move focus to last search suggestion (if suggestion list is visible)
                    if ($suggestList.css('display') && $suggestList.css('display') !== 'none') {
                        this.getLastSearchSuggestion().focus();
                    }
                    break;
                case 40: // down arrow
                    // move focus to first search suggestion (if suggestion list is visible)
                    if ($suggestList.css('display') && $suggestList.css('display') !== 'none') {
                        this.getFirstSearchSuggestion().focus();
                    }
                    break;
                default: // any other key
                    // submit suggestion search (but only if the search text changed)
                    var me = this;
                    setTimeout(function() {
                        var currentQuery = $('#searchtext').val();
                        if (currentQuery !== me.lastQuery) {
                            me.lastQuery = currentQuery;
                            me.suggestionsLocked = false;
                            me.doAutocomplete(keyEvent);
                        }
                    }, 0);
                    break;
            }
        },
        onSuggestionKey: function(keyEvent) {
            var $target = $(keyEvent.target),
                currentSuggestionId = $target.parent().attr('id');
            switch (keyEvent.keyCode) {
                case 38: // up arrow
                    if ($target.is(this.getFirstSearchSuggestion())) {
                        // move focus to search box
                        setTimeout(function() {
                            $('#searchtext').focus();
                        }, 0);
                    }
                    break;
                case 8: // backspace
                    keyEvent.preventDefault();
                    break;
                case 40: // down arrow
                    if ($target.is(this.getLastSearchSuggestion())) {
                        // move focus to search box
                        setTimeout(function() {
                            $('#searchtext').focus();
                        }, 0);
                    }
                    break;
            }
        }
    });

    return SuggestView;
});