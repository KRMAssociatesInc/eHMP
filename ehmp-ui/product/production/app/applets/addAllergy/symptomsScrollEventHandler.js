define([
    "app/applets/addAllergy/utils/symptomsUtil",
    "app/applets/addAllergy/models/symptomsCollection"
], function(SymptomsUtil, SymptomsCollection) {
    'use strict';
    var view,
        errorView,
        enableScrolling = true,
        lastScrollTop = 0,
        symptomsScrollEventHandler = {
            fetchOptions: {},
            setView: function(newView) {
                view = newView.symptomsView;
                errorView = newView.errorView;
            },
            getView: function() {
                return view;
            },
            showError: function(msg) {
                if (errorView) {
                    errorView.addError(msg);
                }
            },
            symptomsEventHandler: function() {
                if (enableScrolling) {
                    var totalHeight = $("#symptoms-inner-list").height();
                    var currentScrollTop = $("#symptomsList").scrollTop();
                    var scrollTop = currentScrollTop + $("#symptomsList").height();
                    var margin = 10;

                    if (currentScrollTop > lastScrollTop && scrollTop + margin >= totalHeight) {
                        var param = {
                            'dir': '1'
                        };
                        param.from = $('#symptoms-inner-list li:last-child a:last-child').text();
                        param.from = param.from.replace(/\t/g, ' '); //Replace tabs with a space. Needed because the RDK service will fetch inclusively on symtoms with a <>

                        symptomsScrollEventHandler.doFetch(param);
                    }

                    lastScrollTop = currentScrollTop;
                }
            },
            doFetch: function(param) {
                symptomsScrollEventHandler.fetchOptions = { //save it here to unit test
                    reset: true,
                    data: $.param({
                        'param': JSON.stringify(param)
                    }),
                    success: function(resp) {
                        SymptomsUtil.addIdCountToModel(resp, view.collection.at(view.collection.length - 1).get('count') + 1);
                        view.collection.add(resp.toJSON());
                        SymptomsUtil.enableLoadingIndictor(false);
                        enableScrolling = true;
                    },
                    error: function(collection, resp) {
                        symptomsScrollEventHandler.showError(resp.responseText);
                        SymptomsUtil.enableLoadingIndictor(false);
                        enableScrolling  = true;
                    }
                };
                var symptomsCollection = new SymptomsCollection();

                symptomsCollection.fetch(symptomsScrollEventHandler.fetchOptions);
                SymptomsUtil.enableLoadingIndictor(true);
                enableScrolling = false;
                if (errorView) {
                    errorView.clearErrors();
                }
            }
        };

    return symptomsScrollEventHandler;
});
