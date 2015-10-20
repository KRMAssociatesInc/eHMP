define([
    "backbone",
    "underscore",
    "marionette",
    "handlebars"
], function(Backbone, _, Marionette, Handlebars) {
    'use strict';

    // temporary default detail view. remove once all detail view have been implemented
    var DefaultDetailView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('<div>A detail view for this domain is not yet implemented.</div>')
    });
    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('<div>{{ error }}</div>')
    });
    var keywords = [];

    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review_v2",
        "allergy": "allergy_grid",
        "immunization": "immunizations",
        "problem": "problems",
        "vital": "vitals",
        "lab": "labresults_timeline_detailview",
        "document": "documents",
        "order": "orders",
        "surgery": "documents",
        "procedure": "documents",
        "consult": "documents",
        "image": "documents"
    };

    function getAllKeywords(uid) {
        var keys = [];
        $("[data-uid='" + uid + "']").find('.cpe-search-term-match').contents().each(function() {
            var keyword = {
                key: $(this).text().toString().toLowerCase(),
                nextChar: ''
            };
            if (keyword.key.length < 4) {
                var parentElement = $(this).parent().parent().get(0);
                var parentText = parentElement.innerHTML;
                var $clone = $(this).parent().clone();
                $clone.wrap('<div>');
                var txtToFind = $clone.parent().html();
                var indexOfKeyword = parentText.indexOf(txtToFind) + txtToFind.length;
                if (parentElement.id.substring('ResultSummary')) {
                    keyword.nextChar = parentText.substring(indexOfKeyword, indexOfKeyword + 1);
                } else if (parentElement.parentElement.id.substring('ResultHighlightssubgroupItem')) {
                    parentText = parentText.substring(3);
                    parentText = parentText.substring(0, parentText.length - 3);
                    indexOfKeyword = parentText.indexOf(txtToFind) + txtToFind.length;
                    keyword.nextChar = parentText.substring(indexOfKeyword, indexOfKeyword + 1);
                    if (keyword.nextChar === ' ' && parentText.charCodeAt(indexOfKeyword + 2) === 10) {
                        keyword.nextChar = parentText.charAt(indexOfKeyword + 2);
                    }
                }
            }
            keys.push(keyword);
        });
        if (keys.length < 1) {
            var searchText = ADK.SessionStorage.getAppletStorageModel('search', 'searchText');
            keys.push({
                key: searchText.searchTerm.toString().toLowerCase(),
                nextChar: searchText.searchTerm.length < 4 ? ' ' : ''
            });
        }
        keys.sort(function(a, b) {
            return a.key.length < b.key.length;
        });
        return keys.filter(function(elem, pos) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].key + keys[i].nextChar === elem.key + elem.nextChar && i !== pos) {
                    return false;
                } else {
                    return true;
                }
            }
            return true;
        });
    }

    function highlightHtmlElement(htmlToHighlight, keywords) {
        $(htmlToHighlight).find("*").contents().each(function() {
            if (this.nodeType == 3) {
                $(this).replaceWith(addSearchResultElementHighlighting($(this).text(), keywords));
            }
        });
    }

    function addSearchResultElementHighlighting(textToHighlight, keywords) {
        var searchString = textToHighlight.toString().toLowerCase();
        var highlightedText = textToHighlight;
        var markStart = '<mark class="cpe-search-term-match">';
        var markEnd = '</mark>';
        for (var i = 0; i < keywords.length; i++) {
            var startIndex = 0;
            var keyword = keywords[i];
            var textToFindAndHighlight = keyword.key.toString().toLowerCase() + keyword.nextChar.toLowerCase();
            while (searchString.indexOf(textToFindAndHighlight, startIndex) > -1) {
                startIndex = searchString.indexOf(textToFindAndHighlight, startIndex);
                var endIndex = startIndex + textToFindAndHighlight.length - keyword.nextChar.length;
                var stringToHighlight = highlightedText.substring(startIndex, endIndex);

                highlightedText = highlightedText.substring(0, startIndex) + markStart + stringToHighlight + markEnd + highlightedText.substring(endIndex);
                searchString = searchString.substring(0, startIndex) + markStart + textToFindAndHighlight.substring(0, textToFindAndHighlight.length - keyword.nextChar.length) + markEnd + searchString.substring(endIndex);
                startIndex = endIndex + markStart.length + markEnd.length + keyword.nextChar.length;
            }
        }
        return highlightedText;
    }

    function onDocumentsLoaded(view) {
        if (view) {
            highlightHtmlElement(view, keywords);
        }
    }

    function onResultClicked(clickedResult) {
        var domain = clickedResult.uid.split(":")[2],
            channelName = detailAppletChannels[domain];
        keywords = getAllKeywords(clickedResult.uid);
        if (channelName) {
            // display spinner in modal while detail view is loading
            var channel = ADK.Messaging.getChannel(channelName),
                deferredResponse = channel.request('detailView', clickedResult);

            if (!deferredResponse) {
                return;
            }
            var modal = new ADK.UI.Modal({
                view: ADK.Views.Loading.create(),
                options: {
                    size: "large",
                    title: "Loading..."
                }
            });
            modal.show();

            // request detail view from whatever applet is listening for this domain
            deferredResponse.done(function(response) {
                var modalOptions = {
                    size: "large",
                    title: addSearchResultElementHighlighting(response.title, keywords)
                };
                if (response.headerView) {
                    modalOptions.headerView = response.headerView;
                    highlightHtmlElement(response.headerView.$el, keywords);
                }
                if (response.footerView) {
                    modalOptions.footerView = response.footerView;
                }
                var modal = new ADK.UI.Modal({
                    view: response.view,
                    options: modalOptions
                });
                modal.show();
                highlightHtmlElement(response.view.$el, keywords);
            });
            deferredResponse.fail(function(response) {
                var errorMsg = _.isString(response) ? response : response && _.isString(response.statusText) ? response.statusText : "An error occurred";
                var modal = new ADK.UI.Modal({
                    view: new ErrorView({
                        model: new Backbone.Model({
                            error: errorMsg
                        })
                    }),
                    options: {
                        size: "large",
                        title: "An Error Occurred"
                    }
                });
                modal.show();
            });
        } else {
            // no detail view available; use the default placeholder view
            var modalView = new ADK.UI.Modal({
                view: new DefaultDetailView(),
                options: {
                    size: "large",
                    title: "Detail - Placeholder"
                }
            });
            modalView.show();
        }
    }

    var screenConfig = {
        id: 'record-search',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'search',
            title: 'Search',
            region: 'center'
        }],
        onStart: function() {
            ADK.SessionStorage.setAppletStorageModel('search', 'useTextSearchFilter', true);
            var searchAppletChannel = ADK.Messaging.getChannel("search");
            searchAppletChannel.on('resultClicked', onResultClicked);
            searchAppletChannel.on('documentsLoaded', onDocumentsLoaded);
        },
        onStop: function() {
            ADK.SessionStorage.setAppletStorageModel('search', 'useTextSearchFilter', false);
            var searchAppletChannel = ADK.Messaging.getChannel("search");
            searchAppletChannel.off('resultClicked', onResultClicked);
            searchAppletChannel.off('documentsLoaded', onDocumentsLoaded);
        },
        patientRequired: true,
        globalDatepicker: false
    };
    return screenConfig;
});