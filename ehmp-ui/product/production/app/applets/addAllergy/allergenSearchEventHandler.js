define([
    'app/applets/addAllergy/utils/allergiesUtil',
], function(SearchUtil, ScrollEventHandler) {
    'use strict';
    var view,
        errorView,
        fetchQueue = [],
        isFetching = false;

    var allergenSearchEventHandler = {
        setView: function(newView) {
            view = newView.allergenView;
            errorView = newView.errorView;
        },
        getView: function() {
            return view;
        },
        allergenEventHandler: function(event) {
            if (isFetching && typeof event !== 'undefined') {
                fetchQueue.push($(event.target).val());
            } else {
                isFetching = true;

                SearchUtil.enableLoadingIndicator(true);
                if (errorView) {
                    errorView.clearErrors();
                }
            }
        }
    };

    return allergenSearchEventHandler;
});
