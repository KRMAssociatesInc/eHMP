define([], function() {
    'use strict';
    var view,
        errorView, errorRegion;
    var enableScrolling = true;
    var lastScrollTop = 0;

    var fetchOptions = {
        resourceTitle: 'write-back-outpatient-med-formulary',
        criteria: {},
        onError: function(model, resp) {
            $('#meds-loading-indicator').hide();
            medsScrollEventHandler.showError(resp.responseText);
            this.enableScrolling = true;
        },
        onSuccess: function(resp) {
            enableScrolling = false;
            view.collection.add(resp.toJSON());
            $('#meds-loading-indicator').hide();
            setTimeout(function() {
                enableScrolling = true;
            }, 500);
        }
    };

    var medsScrollEventHandler = {
        fetchOptions: fetchOptions,
        setView: function(newView) {
            view = newView.medsView;
            errorView = newView.errorView;
            errorRegion = newView.medsSearchError;
        },
        getView: function() {
            return view;
        },
        showError: function(msg) {
            if (errorView){
                errorView.addError(msg);
                errorRegion.show(errorView);
            }
        },
        handleScroll: function() {
            if (enableScrolling) {
                var innerHeight = $('#med-results-inner-container').height();
                var currentScrollTop = $('#search-scroll').scrollTop();
                var myScrollHeight = $('#search-scroll').height();
                var scrollTop = currentScrollTop + myScrollHeight;
                var margin = 10;
                if (currentScrollTop > lastScrollTop && scrollTop + margin >= innerHeight) {
                    var param = {
                        'count' : '40'
                    };
                    param.search = $('#meds-ul li:last-child a:last-child').text();
                    fetchOptions.criteria.param = JSON.stringify(param);
                    enableScrolling = false;
                    ADK.PatientRecordService.fetchCollection(fetchOptions);
                    $('#meds-loading-indicator').show();
                    if (errorView) {
                        errorView.clearErrors();
                    }
                }
                lastScrollTop = currentScrollTop;
            }
        },
    };

    return medsScrollEventHandler;
});
