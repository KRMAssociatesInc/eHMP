define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars'
], function(Backbone, Marionette, $, _, Handlebars) {

    var WorkflowControllerView = Backbone.Marionette.CollectionView.extend({
        modelEvents: {
            'change:currentIndex': 'updateProgressIndicator'
        },
        initialize: function(options) {
            this.model = options.model;
            this.collection = this.model.get('steps');
        },
        getCurrentFormView: function() {
            return this.children.findByIndex(this.model.get('currentIndex'));
        },
        updateProgressIndicator: function() {
            var loopIndex = 0;
            // setting "completed: true" on all steps leading up to current step
            _.each(this.collection.models, function(model) {
                model.unset('currentStep');
                var index = this.model.get('currentIndex');
                if (loopIndex === index) {
                    model.set({
                        'currentStep': true,
                        'completed': true,
                        'currentIndex': index + 1
                    });
                } else if (loopIndex < index) {
                    model.set('completed', true);
                } else {
                    model.unset('completed');
                }
                loopIndex++;
            }, this);
        },
        getChildView: function(item) {
            if (item === item.collection.at(0)) {
                return item.get('view');
            }
            return item.get('view').extend({
                className: function() {
                    return item.get('view').prototype.className() + ' hidden';
                }
            });
        },
        childViewOptions: function(model, index) {
            return {
                workflow: this,
                viewIndex: index
            };
        },
        buildChildView: function(child, ChildViewClass, childViewOptions) {
            // build the final list of options for the childView class
            var options = _.extend({
                model: child.get('viewModel')
            }, childViewOptions);
            // create the child view instance
            var view = new ChildViewClass(options);
            // return it
            return view;
        },
        checkIndex: function(indexToCheck) {
            if (this._getImmediateChildren()[indexToCheck]) {
                return true;
            }
            return false;
        },
        goToNext: function() {
            var currentIndex = this.model.get('currentIndex');
            if (this.checkIndex(currentIndex + 1)) {
                this._getImmediateChildren()[currentIndex].$el.addClass('hidden');
                this._getImmediateChildren()[currentIndex + 1].$el.removeClass('hidden');
                this.model.set('currentIndex', currentIndex + 1);
                return true;
            }
            return false;
        },
        goToPrevious: function() {
            var currentIndex = this.model.get('currentIndex');
            if (this.checkIndex(currentIndex - 1)) {
                this._getImmediateChildren()[currentIndex].$el.addClass('hidden');
                this._getImmediateChildren()[currentIndex - 1].$el.removeClass('hidden');
                this.model.set('currentIndex', currentIndex - 1);
                return true;
            }
            return false;
        },
        goToIndex: function(indexToGoTo) {
            if (this.checkIndex(indexToGoTo)) {
                _.each(this._getImmediateChildren(), function(child, index) {
                    if (index === indexToGoTo) {
                        child.$el.removeClass('hidden');
                    } else {
                        child.$el.addClass('hidden');
                    }
                });
                this.model.set('currentIndex', indexToGoTo);
                return true;
            }
            return false;
        }
    });
    return WorkflowControllerView;
});