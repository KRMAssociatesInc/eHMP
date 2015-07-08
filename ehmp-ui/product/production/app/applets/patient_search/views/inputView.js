define([
    "backbone",
    "marionette",
    "app/applets/patient_search/views/mySite/all/mySiteAllSearchInputView",
    "app/applets/patient_search/views/filter/filterPatientInputView",
    "app/applets/patient_search/views/global/globalSearchInputView"
], function(Backbone, Marionette, MySiteAllSearchInputView, FilterPatientInputView, GlobalSearchInputView) {

    var GlobalSearchInputModel = Backbone.Model.extend({
        defaults: {
            'name-last': '',
            'name-first': '',
            'dob': '',
            'ssn': '',
            'isGlobalSearchErrorMessageDisplayed': false
        }
    });

    var MySiteAllSearchInputModel = Backbone.Model.extend({
        defaults: {
            'searchString': ''
        }
    });

    var MySiteFilterInputModel = Backbone.Model.extend({
        defaults: {
            'filterString': ''
        }
    });

    var MyCPRSFilterInputModel = Backbone.Model.extend({
        defaults: {
            'filterString': ''
        }
    });

    var InputView = Backbone.Marionette.LayoutView.extend({
        template: _.template("<div id='input-view-region'></div>"),
        regions: {
            inputViewRegion: "#input-view-region"
        },
        initialize: function(options) {
            this.mySiteModel = new MySiteAllSearchInputModel();
            this.globalModel = new GlobalSearchInputModel();
            this.mySiteFilterModel = new MySiteFilterInputModel();
            this.myCPRSModel = new MyCPRSFilterInputModel();

            this.currentInputView = new MySiteAllSearchInputView();
            this.currentInputView.model = this.mySiteModel;
            //this.changeView('mySite', 'all');
        },
        onRender: function() {
            this.inputViewRegion.show(this.currentInputView);
        },
        changeView: function(searchType, pillsType) {
            if (searchType == "myCPRSList") {
                this.createInputView(new FilterPatientInputView(), this.myCPRSModel);
            } else if (searchType == "mySite") {
                if (pillsType == "all") {
                    this.createInputView(new MySiteAllSearchInputView(), this.mySiteModel);
                } else {
                    this.createInputView(new FilterPatientInputView(), this.mySiteFilterModel);
                }
            } else if (searchType == "global") {
                this.createInputView(new GlobalSearchInputView(), this.globalModel);
            } else {
                this.createInputView(new MySiteAllSearchInputView(), this.mySiteModel);
            }
            this.render();
        },
        createInputView: function(view, model) {
            this.currentInputView = view;
            this.currentInputView.model = model;
        },
        resetModels: function() {
            this.mySiteModel.clear({
                silent: true
            });
            this.mySiteFilterModel.clear({
                silent: true
            });
            this.globalModel.clear({
                silent: true
            });
            this.myCPRSModel.clear({
                silent: true
            });
        }
    });

    return InputView;
});
