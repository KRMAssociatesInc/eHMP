define([
    'app/applets/add_nonVA_med/utils/searchUtil',
    'app/applets/add_nonVA_med/models/MedsCollection'
], function(SearchUtil, MedsCollection) {
    'use strict';
    var view,
        errorView,
        fetchQueue = [],
        isFetching = false;

    var medsSearchEventHandler = {
        setView: function(newView) {
            view = newView.medsView;
            errorView = newView.errorView;
        },

        getView: function() {
            return view;
        },

        medsEventHandler: function(event) {
            if (isFetching && typeof event !== 'undefined') {
                fetchQueue.push($(event.target).val());
            } else {

                var search = '';

                if (fetchQueue.length > 0) {
                    search = fetchQueue.shift();
                } else {
                    search = $(event.target).val();
                }

                medsSearchEventHandler.fetchOptions = {
                    reset: true,
                    data: $.param({
                        'filter': 'and(ilike(name,"%' + search + '%"),eq("types[].type","NON-VA MEDS"))'
                    }),
                    error: function(resp) {
                        SearchUtil.enableLoadingIndicator(false);
                        isFetching = false;
                        if (errorView) {
                            errorView.addError(resp.responseText);
                        }
                    },
                    success: function(resp) {
                        view.collection.reset(resp.toJSON());
                        SearchUtil.enableLoadingIndicator(false);
                        if (fetchQueue.length > 0) {
                            medsSearchEventHandler.medsEventHandler(undefined);
                        } else {
                            isFetching = false;
                            $('#meds-loading-annoucement').hide();
                            $('#meds-loading-annoucement').text('Lookup complete');
                            $('#meds-loading-annoucement').show();
                        }
                    }
                };

                isFetching = true;
                new MedsCollection().fetch(medsSearchEventHandler.fetchOptions);
                SearchUtil.enableLoadingIndicator(true);
                if (errorView) {
                    errorView.clearErrors();
                }
            }
        },
    };

    return medsSearchEventHandler;
});
