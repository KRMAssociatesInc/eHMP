define([
    'app/applets/addOrder/helpers/searchMedsScrollEventHandler',
], function(SearchUtil, ScrollEventHandler) {
    'use strict';

    var view,
        errorView,
        fetchQueue = [],
        isFetching = false,
        fetchOptions = {
            resourceTitle: 'write-back-outpatient-med-formulary',
            criteria: {},
            onError: function(model, resp) {
                $('#meds-loading-indicator').hide();
                isFetching = false;
                if (errorView) {
                    errorView.addError(resp.responseText);
                }
            },
            onSuccess: function(model, resp) {
                view.collection.reset(model.toJSON());
                $('#meds-loading-indicator').hide();
                if (fetchQueue.length > 0) {
                    medsSearchEventHandler.medsEventHandler(undefined);
                } else {
                    isFetching = false;
                }
            }
        };

    var medsSearchEventHandler = {
        fetchOptions: fetchOptions,
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

                var param = {
                    'count': '40'
                };

                if (fetchQueue.length > 0) {
                    param.search = fetchQueue.shift();
                } else {
                    param.search = $(event.target).val();
                }

                isFetching = true;
                fetchOptions.criteria.param = JSON.stringify(param);
                ADK.PatientRecordService.fetchCollection(fetchOptions);
                $('#meds-loading-indicator').show();
                if (errorView) {
                    errorView.clearErrors();
                }
            }
        },
    };

    return medsSearchEventHandler;
});
