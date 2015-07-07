define([
    'jquery',
    'jquery.inputmask',
    'bootstrap-datepicker',
    'moment',
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/immunizations/modal/dateRangeTemplate',
    'hbs!app/applets/immunizations/modal/dateRangeHeaderTemplate'
], function($, InputMask, DatePicker, moment, Backbone, Marionette, _, dateRangeTemplate, dateRangeHeaderTemplate) {
    'use strict';

    var fetchCollection = function(fetchOptions) {
        ADK.PatientRecordService.fetchCollection(fetchOptions);
    };

    var DateRangeHeaderView = Backbone.Marionette.ItemView.extend({
        template: dateRangeHeaderTemplate,
        className: 'row',
        initialize: function() {
            this.model.on('change', this.render, this);
            /* If the Tesxt Search Applet is Active use these Options */
            if (ADK.SessionStorage.getAppletStorageModel('search', 'useTextSearchFilter')) {
                var modalOptions = ADK.SessionStorage.getAppletStorageModel('search', 'modalOptions');
                this.model.set('selectedId', modalOptions.selectedId);
                if (modalOptions.selectedId === 'custom-range-apply') {
                    this.model.set('customFromDate', modalOptions.customFromDate);
                    this.model.set('customToDate', modalOptions.customToDate);
                }
                console.log(this.model.get('selectedId'));
            }
        }
    });

    var FilterDateRangeView = Backbone.Marionette.LayoutView.extend({
        fetchOptions: {},
        sharedDateRange: {},
        hasCustomDateRangeFieldsBeenInitialized: false,
        template: dateRangeTemplate,
        initialize: function(options) {
            this.parentView = options.parentView;
            this.fullScreen = options.fullScreen;
        },
        regions: {
            dateRangeHeaderRegion: '#dateRangeHeader'
        },
        events: {
            'click button': 'applyDateRange',
            'keydown button': 'handleEnterOrSpaceBar',
            'keyup input': 'monitorCustomDateRange',
            'blur input': 'monitorCustomDateRange',
            'change input': 'monitorCustomDateRange'
        },
        setSharedDateRange: function(value) {
            this.sharedDateRange = value;
        },
        getSharedDateRange: function() {
            return this.sharedDateRange;
        },
        monitorCustomDateRange: function(event) {
            if (this.checkCustomRangeCondition()) {
                this.$el.find('#custom-range-apply').removeAttr('disabled');
            } else {
                this.$el.find('#custom-range-apply').prop('disabled', true);
            }
        },
        setDatePickers: function(fromDate, toDate) {
            this.$('.input-group.date#custom-date-range1').datepicker({
                format: 'mm/dd/yyyy'
            });
            if (fromDate !== null) {
                this.$('.input-group.date#custom-date-range1').datepicker('update', fromDate);
            }

            this.$('.input-group.date#custom-date-range2').datepicker({
                format: 'mm/dd/yyyy'
            });
            if (toDate !== null) {
                this.$('.input-group.date#custom-date-range2').datepicker('update', toDate);
            }

            this.$('#filter-from-date').datepicker('remove');
            this.$('#filter-to-date').datepicker('remove');
        },
        applyDateRange: function(event) {
            var fromDate, toDate;
            var isFetchable = true;

            this.setDateRangeValues = function(timeUnit, timeValue, selectedId) {
                fromDate = moment().subtract(timeUnit, timeValue).format('MM/DD/YYYY');
                toDate = moment().format('MM/DD/YYYY');
                this.model.set('selectedId', selectedId);
            };

            if (event.currentTarget.id.indexOf('-range') !== -1 &&
                event.currentTarget.id.indexOf('custom-range-apply') === -1) {
                this.$el.find('#filter-from-date').val('');
                this.$el.find('#filter-to-date').val('');
                this.$el.find('#custom-range-apply').prop('disabled', true);
            }

            switch (event.currentTarget.id) {
                case 'custom-range-apply':
                    var filterFromDate = this.$el.find('#filter-from-date').val();
                    var filterToDate = this.$el.find('#filter-to-date').val();

                    if (filterFromDate <= filterToDate) {
                        fromDate = filterFromDate;
                        toDate = filterToDate;
                    } else {
                        toDate = filterFromDate;
                        fromDate = filterToDate;
                    }
                    this.model.set('selectedId', 'custom-range-apply');
                    break;
                case '2yr-range':
                    this.setDateRangeValues('years', 2, '2yr-range');
                    break;
                case '1yr-range':
                    this.setDateRangeValues('years', 1, '1yr-range');
                    break;
                case '3mo-range':
                    this.setDateRangeValues('months', 3, '3mo-range');
                    break;
                case '1mo-range':
                    this.setDateRangeValues('months', 1, '1mo-range');
                    break;
                case '7d-range':
                    this.setDateRangeValues('days', 7, '7d-range');
                    break;
                case '72hr-range':
                    this.setDateRangeValues('days', 3, '72hr-range');
                    break;
                case '24hr-range':
                    this.setDateRangeValues('days', 1, '24hr-range');
                    break;
                case 'all-range':
                    fromDate = null;
                    toDate = moment().format('MM/DD/YYYY');
                    this.model.set('selectedId', 'all-range');
                    break;
                default:
                    break;
            }

            if (fromDate !== undefined && fromDate !== null) {
                this.fetchOptions.criteria.observedFrom = moment(fromDate).format('YYYYMMDD');
            } else {
                delete this.fetchOptions.criteria.observedFrom;
            }

            if (toDate !== undefined && toDate !== null) {
                this.fetchOptions.criteria.observedTo = moment(toDate).format('YYYYMMDD');
            } else {
                delete this.fetchOptions.criteria.observedTo;
            }

            this.model.set('fromDate', fromDate);
            this.model.set('toDate', toDate);
            //TODO: Remove this once the new Resource is Created
            this.sharedDateRange.set('fromDate', fromDate);
            this.sharedDateRange.set('toDate', toDate);

            this.$el.find('button').removeClass('active-range');

            if (event.currentTarget.id !== 'custom-range-apply') {
                this.$el.find('#' + event.currentTarget.id).addClass('active-range');
            }

            if (isFetchable) {
                this.fetchDateRangeFilteredCollection();
            }
        },
        onBeforeDestroy: function(event) {
            this.sharedDateRange.set('fromDate', this.model.get('fromDate'));
            this.sharedDateRange.set('toDate', this.model.get('toDate'));
            this.sharedDateRange.set('customFromDate', this.model.get('customFromDate'));
            this.sharedDateRange.set('customToDate', this.model.get('customToDate'));
            this.sharedDateRange.set('selectedId', this.model.get('selectedId'));
        },
        checkCustomRangeCondition: function() {
            var hasCustomRangeValuesBeenSetCorrectly = true;
            var customFromDate = this.$el.find('#filter-from-date').val();
            var customToDate = this.$el.find('#filter-to-date').val();

            if (moment(customFromDate, 'MM/DD/YYYY', true).isValid()) {
                this.model.set('customFromDate', customFromDate);
                this.sharedDateRange.set('fromDate', customFromDate);
            } else {
                hasCustomRangeValuesBeenSetCorrectly = false;
            }

            if (moment(customToDate, 'MM/DD/YYYY', true).isValid()) {
                this.model.set('customToDate', customToDate);
                this.sharedDateRange.set('toDate', customToDate);
            } else {
                hasCustomRangeValuesBeenSetCorrectly = false;
            }

            return hasCustomRangeValuesBeenSetCorrectly;
        },
        handleEnterOrSpaceBar: function(event) {
            var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;

            if (keyCode == 13 || keyCode == 32) {
                var targetElement = this.$el.find('#' + event.currentTarget.id);
                targetElement.focus();
                targetElement.trigger('click');
            }
        },
        onRender: function(event) {
            this.$('#filter-from-date').inputmask('m/d/y', {
                'placeholder': 'MM/DD/YYYY'
            });

            this.$('#filter-to-date').inputmask('m/d/y', {
                'placeholder': 'MM/DD/YYYY'
            });

            this.dateRangeHeaderRegion.show(new DateRangeHeaderView({
                model: this.model
            }));

            var selectedId = this.model.get('selectedId');
            var customFromDate = this.model.get('customFromDate');
            var customToDate = this.model.get('customToDate');
            
            if (selectedId !== undefined && selectedId !== null) {
                this.setDatePickers(customFromDate, customToDate);
                this.$el.find('#' + selectedId).click();
            } else {
                if (this.fullScreen) {
                    selectedId = $('[data-appletid=\'immunizations\'] .grid-filter-daterange .active-range').attr('id');
                    customFromDate = $('[data-appletid=\'immunizations\'] .grid-filter-daterange #filter-from-date-immunizations').val();
                    customToDate = $('[data-appletid=\'immunizations\'] .grid-filter-daterange #filter-to-date-immunizations').val();
                } else {
                    var globalDate = ADK.SessionStorage.getModel('globalDate');
                    selectedId = globalDate.get('selectedId');
                    customFromDate = globalDate.get('customFromDate');
                    customToDate = globalDate.get('customToDate');
                }

                this.model.set('selectedId', selectedId);
                this.model.set('customFromDate', customFromDate);
                this.model.set('customToDate', customToDate);

                this.setDatePickers(customFromDate, customToDate);

                if (selectedId !== undefined && selectedId !== null && selectedId.trim().length > 0) {
                    if (selectedId.indexOf('2yr-range') >= 0) {
                        this.$el.find('#2yr-range').click();
                    } else if (selectedId.indexOf('1yr-range') >= 0) {
                        this.$el.find('#1yr-range').click();
                    } else if (selectedId.indexOf('3mo-range') >= 0) {
                        this.$el.find('#3mo-range').click();
                    } else if (selectedId.indexOf('1mo-range') >= 0) {
                        this.$el.find('#1mo-range').click();
                    } else if (selectedId.indexOf('7d-range') >= 0) {
                        this.$el.find('#7d-range').click();
                    } else if (selectedId.indexOf('72hr-range') >= 0) {
                        this.$el.find('#72hr-range').click();
                    } else if (selectedId.indexOf('24hr-range') >= 0) {
                        this.$el.find('#24hr-range').click();
                    } else if (selectedId.indexOf('all-range') >= 0) {
                        this.$el.find('#all-range').click();
                    } else if (selectedId.indexOf('custom-range-apply') >= 0) {
                        if (!this.$el.find('custom-range-apply').prop('disabled')) {
                            this.$el.find('#custom-range-apply').click();
                        }
                    }
                }
            }
        },
        fetchDateRangeFilteredCollection: function() {
            ADK.PatientRecordService.fetchCollection(this.fetchOptions);
            this.parentView.leftColumn.show(ADK.Views.Loading.create()); // this.parentView.tableLoadingView);
            // this.parentView.chart.show(ADK.Views.Loading.create()); // this.parentView.chartLoadingView);
        },
        setFetchOptions: function(fetchOptions) {
            this.fetchOptions = fetchOptions;
        }
    });

    return FilterDateRangeView;
});
