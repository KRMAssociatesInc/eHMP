define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    'api/Messaging',
    'main/ui_components/workflow/controllerView',
    'main/ui_components/workflow/containerView'
], function(Backbone, Marionette, $, _, Handlebars, Messaging, ControllerView, ContainerView) {

    var HeaderModel = Backbone.Model.extend({
        defaults: {
            'title': '',
            'actionItems': false,
            'popOutToggle': false
        }
    });
    var WorkflowView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<div class="{{classPrefix}}-content{{#if showProgress}} with-progress-indicator{{/if}}">{{#if showHeader}}<div class="workflow-header"></div>{{/if}}{{#if showProgress}}<div class="workflow-progressIndicator"></div>{{/if}}<div class="workflow-controller"></div></div>'),
        ui: {
            HeaderRegion: '.workflow-header',
            ProgressIndicatorRegion: '.workflow-progressIndicator',
            ControllerRegion: '.workflow-controller'
        },
        regions: {
            ControllerRegion: '@ui.ControllerRegion'
        },
        events: {
            'keydown input': function(e) {
                if (e.which === 13) { //Prevent IE bug which issues data-dismiss in a modal on enter key
                    e.preventDefault();
                }
            }
        },
        modelEvents: {
            'change:title': 'render',
            'change:showProgress': 'render',
            'change:showHeader': 'render'
        },
        initialize: function(options) {
            var workflowOptions = {
                title: '',
                size: '',
                steps: [],
                backdrop: false,
                keyboard: true,
                headerOptions: {}
            };
            this.workflowOptions = _.defaults(options, workflowOptions);
            this.model = new Backbone.Model();
            this.model.set({
                title: this.workflowOptions.title,
                actionItems: this.workflowOptions.headerOptions.actionItems,
                popOutToggle: this.workflowOptions.headerOptions.popOutToggle,
                steps: new Backbone.Collection(this.workflowOptions.steps),
                currentIndex: 0,
                showProgress: (this.workflowOptions.steps.length > 1 ? this.workflowOptions.showProgress || false : false),
                showHeader: (_.isBoolean(this.workflowOptions.showHeader) ? this.workflowOptions.showHeader : true),
                classPrefix: this.workflowOptions.classPrefix || 'modal'
            });
        },
        getFormView: function(index) {
            return this.workflowControllerView.children.findByIndex(index);
        },
        onBeforeShow: function() {
            //Creation of Form Controller
            var steps = this.model.get('steps');
            steps.at(0).set({
                'completed': true,
                'currentStep': true,
                'currentIndex': this.model.get('currentIndex') + 1
            });

            _.each(steps.models, function(step) {
                step.set('numberOfSteps', steps.length);
            });

            this.workflowControllerView = new ControllerView({
                model: this.model
            });
            this.showChildView('ControllerRegion', this.workflowControllerView);

            //Creation of Header
            if (this.model.get('showHeader') === true) {
                this.addRegion('HeaderRegion', this.ui.HeaderRegion);
                var workflowTitle = this.model.get('title');
                var workflowpopOutToggle = this.model.get('popOutToggle');
                var workflowactionItems = this.model.get('actionItems');
                if (workflowTitle || workflowactionItems || this.workflowOptions.header) {
                    if (this.workflowOptions.header) {
                        this.HeaderView = this.workflowOptions.header.extend({
                            className: this.model.get('classPrefix') + '-header'
                        });
                    } else {
                        var headerModel = new HeaderModel({
                            'title': workflowTitle,
                            'actionItems': workflowactionItems,
                            'popOutToggle': workflowpopOutToggle
                        });
                        this.HeaderView = Backbone.Marionette.ItemView.extend({
                            initialize: function(options){
                                this.workflowControllerView = options.workflowControllerView;
                            },
                            events: {
                                'click .dropdown-menu li a': function(e){
                                    e.preventDefault();
                                    var menuOptionForClickedItem = workflowactionItems[this.$(e.currentTarget).attr('data-item-index')];
                                    this.workflowControllerView.getCurrentFormView();
                                    _.bind(menuOptionForClickedItem.onClick, this.workflowControllerView.getCurrentFormView())();
                                }
                            },
                            template: Handlebars.compile([
                                '<div class="row">',
                                '<div class="col-md-10 col-xs-10">',
                                '<h4 class="' +
                                this.model.get('classPrefix') +
                                '-title" id="main-workflow-label">{{title}}</h4>',
                                '</div>',
                                '<div class="col-md-2 col-xs-2">',
                                '{{#if actionItems}}',
                                '<div class="header-btns">',
                                '<div class="{{#if popOutToggle}}col-xs-6{{else}}col-xs-6 col-xs-offset-6{{/if}}">',
                                '<div class="dropdown">',
                                '<button class="btn icon-btn dropdown-toggle" type="button" id="action-items-dropdown" data-toggle="dropdown" aria-expanded="true">',
                                '<i class="fa fa-gear"><span class="sr-only">Settings</span></i>',
                                '</button>',
                                '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="action-items-dropdown">',
                                '{{#each actionItems}}',
                                '<li role="presentation"><a role="menuitem" data-item-index={{@index}} href="#">{{label}}</a></li>',
                                '{{/each}}',
                                '</ul>',
                                '</div>',
                                '</div>',
                                '{{#if popOutToggle}}',
                                '<div class="col-md-6 col-xs-6">',
                                    '<button type="button" class="btn icon-btn" title="Press enter to open the popover view"><i class="fa fa-compress"><span class="sr-only">Press enter to open the popover view</span></i></button>',
                                '</div>',
                                '{{/if}}',
                                '</div>',
                                '{{else}}',
                                '<button type="button" class="close" data-dismiss="modal">',
                                '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
                                '</button>',
                                '{{/if}}',
                                '</div>',
                                '</div>'
                            ].join("\n")),
                            model: headerModel,
                            className: this.model.get('classPrefix') + '-header'
                        });
                    }
                    this.headerView = new this.HeaderView({
                        workflowControllerView: this.workflowControllerView
                    });
                    this.showChildView('HeaderRegion', this.headerView);
                }
            }

            //Creation of Progressbar View
            if (this.model.get('showProgress') === true) {
                this.addRegion('ProgressIndicatorRegion', this.ui.ProgressIndicatorRegion);
                var ProgressIndicatorChildView = Backbone.Marionette.ItemView.extend({
                    tagName: 'li',
                    template: Handlebars.compile('<div{{#if completed}} class="completed"{{/if}}><span class="bubble"></span>{{stepTitle}}{{#if currentStep}}<span class="sr-only">You are currently on step {{currentIndex}} of {{numberOfSteps}}</span>{{/if}}'),
                    modelEvents: {
                        'change': 'render'
                    }
                });
                this.WorkflowProgressIndicatorView = Backbone.Marionette.CollectionView.extend({
                    collection: steps,
                    tagName: 'ul',
                    className: 'progress-indicator',
                    childView: ProgressIndicatorChildView
                });
                this.workflowProgressIndicatorView = new this.WorkflowProgressIndicatorView();
                this.showChildView('ProgressIndicatorRegion', this.workflowProgressIndicatorView);
            }
        },
        show: function() {
            var $triggerElem = $(':focus');

            var WorkflowRegion = Messaging.request('get:adkApp:region', 'workflowRegion');
            if (!_.isUndefined(WorkflowRegion)) {
                var workflowContainerView = new ContainerView({
                    workflowOptions: this.workflowOptions,
                    controllerView: this
                });
                WorkflowRegion.show(workflowContainerView);

                WorkflowRegion.currentView.$el.one('hidden.bs.modal', function(e) {
                    WorkflowRegion.empty();
                    $triggerElem.focus();
                });
                WorkflowRegion.currentView.$el.modal('show');
            }
        }
    });

    WorkflowView.hide = function() {
        var currentView = Messaging.request('get:adkApp:region', 'workflowRegion').currentView;
        if (currentView) {
            currentView.$el.modal('hide');
        }
    };
    return WorkflowView;
});