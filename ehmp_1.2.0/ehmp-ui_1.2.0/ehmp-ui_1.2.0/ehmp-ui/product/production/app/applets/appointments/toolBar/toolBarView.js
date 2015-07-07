define([
    'backbone',
    'marionette',
    'hbs!app/applets/appointments/toolBar/apptsFilterTemplate'
], function(Backbone, Marionette, apptsFilterTemplate) {
    'use strict';

    var ToolBarView = Backbone.Marionette.ItemView.extend({

        apptSite: 'ALL',
        initialize: function (options) {
            this.collection = options.collection;
            this.siteMenuItems = options.siteMenuItems;
            this.setActiveSite(this.siteMenuItems, 'ALL');
        },
        template: apptsFilterTemplate,
        className: 'list-group-item row-layout',
        events: {
            'click .nav-pills-appts': 'filterBySite',
            'keydown .nav-pills-appts': 'accessibility',

        },
        //treat spacebar press as Enter key
        accessibility: function (event) {
            if (event.keyCode == 32) {
                var target = '#' + event.currentTarget.id;
                this.$(target).trigger('click');
            }
        },
        clearSearchText: function () {
            $('#grid-filter-appointments').find('.clear').click();
            ADK.SessionStorage.setAppletStorageModel('appointments', 'filterText', '');
        },
        filterBySite: function (event) {
            this.apptSite = event.currentTarget.id;
            // ADK.SessionStorage.setAppletStorageModel('appointments', 'siteFilter', this.apptSite);    

            this.filterResults(this.apptSite, this.collection, this.filterValue);
            this.setActiveSite(this.siteMenuItems, this.apptSite);
            var $target = $(event.currentTarget);
            $target.closest('.btn-group').find('[data-bind="label"]').text($target.text());
            this.clearSearchText(); //changing order type resets the search text

            event.preventDefault();
            return true;
        },
        setActiveSite: function (menuItems, activeSite) {
            for (var i = 0; i < menuItems.models.length; i++) {
                if (menuItems.models[i].get('site') == activeSite) {
                    menuItems.models[i].set('active', true);
                } else {
                    menuItems.models[i].set('active', false);
                }
            }
        },
        filterResults: function (apptSite, collection, filterValue) {
            var filterFunction;
            switch (apptSite) {
                case 'LOCAL':
                    ADK.utils.filterCollectionSubstring(collection, 'uid', filterValue);
                    break;
                case 'ALLVA':
                    ADK.utils.filterCollectionNoSubstring(collection, 'uid', ':DOD:');
                    break;
                default:
                    ADK.utils.resetCollection(collection);
                    break;
            }

        },
        filterResultsDefault: function (collection) {
            return this.filterResults(this.apptSite, collection, this.filterValue);
        },
        isAppointment: function (model) {
            var isVAAppt = false;
            var isDODAppt = false;
            if (model.get('appointmentStatus')) {
                isVAAppt = model.get('appointmentStatus').indexOf('FUTURE') > -1 ||
                    model.get('appointmentStatus').indexOf('CANCELLED') > -1
                ;
            }
            if (model.get('categoryName')) {
                isDODAppt = model.get('categoryName').indexOf('Appointment') > -1;
            }

            return isVAAppt || isDODAppt;
        },
        onRender: function () {
            //set the overflow: visible for the orders panel to allow
            //the drop-down to drop below the boundaries of the applet, if needed
            $('#grid-panel-appointments').css({
                'overflow': 'visible'
            });

            //create the drop-down template HTML
            this.$el.html(this.template({
                siteitems: this.siteMenuItems.toJSON(),
//                typeitems: this.typeMenuItems.toJSON()
            }));

            //set the drop-down button to the active item
            var siteitem = this.siteMenuItems.findWhere({
                'active': true
            });
            this.$('#appts-site-menu-btn-label-span').text(siteitem.get('siteLabel'));
        }
    });

    return ToolBarView;

});
