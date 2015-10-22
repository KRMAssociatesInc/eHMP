define('main/backgrid/filterTagView', [
    'backbone',
    'marionette',
    'underscore',
    'api/ResourceService',
    'main/api/WorkspaceFilters'
], function(Backbone, Marionette, _, ResourceService, WorkspaceFilters) {
    'use strict';

    var UserDefinedFilter = Backbone.Model.extend({
        defaults: {
            name: '',
            workspaceId: '',
            instanceId: '',
            status: ''
        }
    });
    var filterTagView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        className: 'udaf-tag',
        events: {
            'click a.clear-udaf-tag': 'clear'
        },

        clear: function(e) {
            e.preventDefault();
            // Execute remove all filters if this is the only filter.
            if (this.model.collection.length === 1) {
                this.$el.parent().parent().find('.remove-all').click();
                return;
            }
            //when deleting a filter, the onUserDefinedFilterRemove event will be triggered in the Filter view.
            var workspaceId, instanceId, filter;
            filter = this.model.get('name');
            workspaceId = this.model.get('workspaceId');
            instanceId = this.model.get('instanceId');
            this.model.collection.remove(this.model);
            this.remove();
            WorkspaceFilters.deleteFilterFromJDS(workspaceId, instanceId, filter);
        },

        initialize: function(options) {
            var filter = this.model.get('name');
            if (options.onUserWorkspace) {
                this.template = _.template('<span class="btn btn-default btn-xs">' + filter +
                    '<a href="#" class="clear-udaf-tag"><i class="fa fa-times-circle"></i><span class="sr-only">Press enter to delete ' + filter + ' filter</span></a></span>', null, {
                        variable: null
                    });
            } else {
                this.template = _.template('<span class="btn btn-default btn-xs">' + filter +
                    '</span>', null, {
                        variable: null
                    });
            }

            if (this.model.get('status') === 'new') { //persist it
                var workspaceId, instanceId;
                workspaceId = this.model.get('workspaceId');
                instanceId = this.model.get('instanceId');
                WorkspaceFilters.saveFilterToJDS(workspaceId, instanceId, filter);
            }
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }

    });

    return filterTagView;
});