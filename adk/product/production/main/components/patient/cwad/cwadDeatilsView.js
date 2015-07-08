define([
    "backbone",
    "marionette",
    "underscore",
    "handlebars",
    "main/Utils",
    "api/ResourceService",
    "hbs!main/components/patient/cwad/templates/cwadDetailContainer",
    "hbs!main/components/patient/cwad/templates/allergiesDetails",
    "hbs!main/components/patient/cwad/templates/directiveDetails",
    "hbs!main/components/patient/cwad/templates/patientFlagsDetails"
], function(Backbone, Marionette, _, Handlebars, Utils, ResourceService, cwadDetailContainer, AllergiesDetailsTemplate, DirectiveDetails, PatientFlagsDetails) {

    var cwadDeatil = Backbone.Marionette.ItemView.extend({
        className: "row-layout cwad-detail",
        initialize: function(options) {
            this.template = options.template;
        },
        attributes: {
            'tabindex': '0'
        }
    });

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: _.template('<h5 class="loading"><i class="fa fa-spinner fa-spin"></i> Loading...</h5>'),
    });

    var NoResultsView = Backbone.Marionette.ItemView.extend({
        template: _.template('<p class="error-message padding" role="alert" tabindex="0">No results found.</p>'),
        tagName: "p"
    });
    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('<p class="error-message padding" role="alert" tabindex="0">Error: {{errorCode}} </p>'),
        initialize: function(options) {
            this.model.set('errorCode', options.errorCode);
        },
        tagName: "p"
    });

    var TitleModel = Backbone.Model.extend({
        defaults: {
            'title': '',
        }
    });

    var cwadContainerView = Backbone.Marionette.LayoutView.extend({
        template: cwadDetailContainer,
        regions: {
            cwadDetails: '#cwad-detail-list'
        },
        events: {
            'click .close': 'closeDetail'
        },
        initialize: function(options) {
            this.model = new TitleModel();
            this.model.set('title', options.cwadIdentifier);
            this.deatilView = new cwadDeatilsView(options);
        },
        modelEvents: {
            "change": "render"
        },
        onRender: function() {
            this.cwadDetails.show(this.deatilView);
        },
        closeDetail: function(event) {
            this.$el.parent().addClass('hidden');
            $("body").off("mousedown");
        }
    });

    var cwadDeatilsView = Backbone.Marionette.CollectionView.extend({
        childView: cwadDeatil,
        tagName: "div",
        emptyView: LoadingView,
        initialize: function(options) {
            this.childViewOptions = {
                template: _.template('Empty')
            };
            if (options.cwadIdentifier !== 'patient flags') {
                this.emptyViewOptions = {
                    errorCode: 'undefined'
                };
                var filterString;
                if (options.cwadIdentifier === 'crisis notes') {
                    filterString = 'ilike(kind,"%Crisis%")';
                    this.childViewOptions.template = DirectiveDetails;
                } else if (options.cwadIdentifier === 'warnings') {
                    filterString = 'ilike(kind,"%Warning%")';
                    this.childViewOptions.template = DirectiveDetails;
                } else if (options.cwadIdentifier === 'allergies') {
                    filterString = 'ilike(kind,"%Allergy%")';
                    this.childViewOptions.template = AllergiesDetailsTemplate;
                } else if (options.cwadIdentifier === 'directives') {
                    filterString = 'ilike(kind,"%Directive%")';
                    this.childViewOptions.template = DirectiveDetails;
                } else {
                    filterString = '';
                    this.childViewOptions.template = _.template('Empty');
                }
                var fetchOptions = {
                    resourceTitle: 'patient-record-cwad',
                    criteria: {
                        'filter': filterString
                    },
                    cache: true
                };
                var self = this;
                fetchOptions.onSuccess = function(collection, resp) {
                     _.each(collection.models, function(model) {
                        if (model.get("observations") !== undefined) {
                            model.set("observedDate", Utils.formatDate(model.get("observations")[0].date));
                            model.set("severity", model.get("observations")[0].severity);
                        }
                    });
                    self.emptyView = NoResultsView;
                    self.collection = collection;
                    self.render();
                };
                fetchOptions.onError = function(collection, resp) {
                    self.emptyViewOptions.errorCode = resp.status;
                    self.emptyView = ErrorView;
                    self.render();

                };
                this.collection = ResourceService.patientRecordService.fetchCollection(fetchOptions);
            } else {
                this.childViewOptions.template = PatientFlagsDetails;
                this.collection = new Backbone.Collection(options.patientModel.get('patientRecordFlag'));
            }
        }
    });

    return cwadContainerView;
});
