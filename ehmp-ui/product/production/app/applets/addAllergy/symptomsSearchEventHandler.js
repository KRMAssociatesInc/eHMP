define([
    "app/applets/addAllergy/utils/symptomsUtil",
    "app/applets/addAllergy/models/symptomsCollection"
], function(SymptomsUtil, SymptomsCollection) {
    'use strict';
    var view,
        errorView,
        fetchQueue = [],
        isFetching = false,
        symptomsSearchEventHandler = {
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
            symptomsEventHandler: function(event) {
                if (isFetching && typeof event !== 'undefined') {
                    fetchQueue.push($(event.target).val());
                } else {
                    var param = {
                        "dir": 1
                    };

                    if (fetchQueue.length > 0) {
                        param.from = fetchQueue.shift();
                    } else {
                        param.from = $(event.target).val();
                    }

                    //Replace tabs with a space. Needed because the RDK service will fetch inclusively on symtoms with a <>
                    param.from = param.from.replace(/\t/g, ' ');

                    isFetching = true;

                    symptomsSearchEventHandler.fetchOptions = { //save it here to unit test
                        reset: true,
                        data: $.param({
                            'param': JSON.stringify(param)
                        }),
                        success: function(resp) {
                            SymptomsUtil.addIdCountToModel(resp, 0);
                            view.collection.reset(resp.toJSON());
                            $('#allergy-loading-annoucement').hide();
                            $('#allergy-loading-annoucement').text('Lookup complete');
                            $('#allergy-loading-annoucement').show();
                            SymptomsUtil.enableLoadingIndictor(false);

                            if (fetchQueue.length > 0) {
                                symptomsSearchEventHandler.symptomsEventHandler(undefined);
                            } else {
                                isFetching = false;
                            }
                        },
                        error: function(collection, resp) {
                            symptomsSearchEventHandler.showError(resp.responseText);
                            SymptomsUtil.enableLoadingIndictor(false);
                            isFetching = false;
                        }
                    };
                    var symptomsCollection = new SymptomsCollection();

                    symptomsCollection.fetch(symptomsSearchEventHandler.fetchOptions);
                    SymptomsUtil.enableLoadingIndictor(true);
                    if (errorView) {
                        errorView.clearErrors();
                    }
                }
            },
        };

    return symptomsSearchEventHandler;
});
