define([
    'backbone',
    'handlebars'
], function(Backbone, Handlebars) {

    var SingleFacilityListItemView = Backbone.Marionette.ItemView.extend({
        tagName: "option",
        className: "list-group-item row-layout simple",
        template: Handlebars.compile('{{name}}'),
        onShow: function() {
            this.$el.val(this.model.get('siteCode'));
        }
    });
    var FacilityListView = Backbone.Marionette.CompositeView.extend({
        template: Handlebars.compile('<option class="{{cssClass}}" selected="selected" value="noneSelected">{{message}}</option>'),
        childView: SingleFacilityListItemView,
        tagName: "select",
        className: "form-control",
        modelEvents: {
            'change': 'render',
            'change:disabled': 'updateDisabled'
        },
        attributes: {
            name: "facility",
            id: "facility",
            disabled: true
        },
        initialize: function(options) {
            this.parentView = options.parentView;
            this.collection = new Backbone.Collection();
            this.model = new Backbone.Model({
                'message': 'Loading facilities...',
                'disabled': true,
                'cssClass': ''
            });
        },
        onShow: function() {
            var self = this;
            var searchOptions = {
                resourceTitle: 'authentication-list',
                cache: false,
                onError: function(resp) {
                    if(window.console && window.console.log) {
                        console.log('Error loading facility list', resp);
                    }
                    self.model.set({
                        'message': 'Server error while trying to load list of facilities.',
                        'disabled': true,
                        'cssClass': 'bg-danger'
                    });
                    self.parentView.$el.find('#errorMessage').html('Unable to login due to server error. Status code: ' + resp.status);
                },
                onSuccess: function() {
                    self.model.set({
                        'message': 'Select a facility...',
                        'disabled': false
                    });
                }
            };
            ADK.ResourceService.fetchCollection(searchOptions, this.collection);
        },
        updateDisabled: function() {
            this.$el.attr('disabled', this.model.get('disabled'));
        },
    });

    return FacilityListView;
});
