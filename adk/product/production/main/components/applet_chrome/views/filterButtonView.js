define('main/components/applet_chrome/views/filterButtonView', [
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'hbs!main/components/applet_chrome/templates/filterButtonTemplate',
    "api/SessionStorage",
    'api/Messaging',
    'main/api/WorkspaceFilters'
], function(Backbone,Marionette,$, _, filterButtonTemplate, SessionStorage, Messaging, WorkspaceFilters) {
    'use strict';

    var FilterButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: filterButtonTemplate,
        onShow: function() {
            var appletInstanceId = this.model.get('instanceId');
            WorkspaceFilters.onAppletFilterCollectionChanged(appletInstanceId, this.setVisibilityIfFilters, this);
        },
        setVisibilityIfFilters: function(args) {
            var appletFilterTitle = this.$('.applet-filter-title');
            this.setVisible(appletFilterTitle, args.anyFilters);
        },
        setVisible: function(element, makeVisible) {
            if (makeVisible) {
                element.removeClass('hidden');
            } else {
                element.addClass('hidden');
            }
        },
        events: {
            'click button': 'toggleFilterButtonEvent'
        },
        toggleFilterButtonEvent: function() {
            var appletInstanceId = this.model.get('instanceId');
            var filterArea = $('#grid-filter-' + appletInstanceId);
            var filterButton = this.$el;

            if (filterArea.hasClass('in')) {
                // we chagnged the call from hide.bs.collapse to hidden.bs.collapse to trigger it when it was fully hidden instead of when the hide action started
                filterArea.one('hidden.bs.collapse', function() {
                    filterButton.find('button').removeClass('filterOpen').attr('title', 'Show Filter');
                    filterButton.find('button .sr-only').html('Show Filter');

                    // clear search text field upon collaping filter view
                    var filterText = SessionStorage.getAppletStorageModel(appletInstanceId, 'filterText');
                    if (filterText !== undefined && filterText !== null && filterText.trim().length > 0) {
                        var queryInputSelector = 'input[name=\'q-' + appletInstanceId + '\']';
                        $(queryInputSelector).val('').change().keydown();
                    }
                });

                filterArea.collapse('hide');
            } else {
                // we chagnged the call from show.bs.collapse to shown.bs.collapse to trigger it when it was fully shown instead of when the show action started
                filterArea.one('shown.bs.collapse', function() {
                    filterButton.find('button').addClass('filterOpen').attr('title', 'Hide Filters');
                    filterButton.find('button .sr-only').html('Hide Filters');

                });
                filterArea.one('shown.bs.collapse', function() {
                    filterArea.find('input[type=search]').focus();
                });

                filterArea.collapse('show');
            }
            filterArea.collapse('toggle');
        }
    });
    return FilterButtonView;
});
