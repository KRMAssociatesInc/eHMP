define([
    'underscore',
    'app/applets/vitals/util',
    'hbs!app/applets/vitals/list/observedTemplate',
    'hbs!app/applets/vitalsObservationList/templates/vitalsObservationListBodyTemplate',
    'app/applets/vitalsObservationList/views/vitalsObservationListFooterView'
], function(_, Util, observedDateTemplate, vitalsObservationListBodyTemplate, vitalsObservationListFooterView) {

    var APPLET_EMPTY_TEXT = 'No Records Found';
    var APPLET_MODAL_OPTIONS_TITLE = 'Patient Vitals Observed List';

    var dataGridOptions = {
        'appletConfig': {
            name: 'vitalsObservedList_modal',
            id: 'vitalsObservedList-modalView'
        },
        filterDateRangeEnabled: false,
    };

    dataGridOptions.columns = [{
        name: 'observedFormatted',
        label: 'Date',
        template: observedDateTemplate,
        cell: 'handlebars',
        sortable: true,
    }];

    var observationListCollection = new Backbone.Collection();

    var gridView = {};

    var observationListView = Backbone.Marionette.LayoutView.extend({
        template: vitalsObservationListBodyTemplate,
        collection: observationListCollection,
        regions: {
            grid: '.js-backgrid'
        },
        showModal: function(event, options) {
            var _this = this;
            var collection = options.collection;

            if (options.hasOwnProperty('gridView') === true) {
                gridView = options.gridView;
            }

            var footerView = vitalsObservationListFooterView.extend({
                bodyView: this
            });
            var modalOptions = {
                'size': 'large',
                'title': APPLET_MODAL_OPTIONS_TITLE,
                'footerView': footerView,
                'regionName': 'vitalsObservationDialog'
            };
            //show the modal so we can deal with the grid

            var modal = new ADK.UI.Modal({
                view: this,
                options: modalOptions
            });
            modal.show();

            observationListCollection = collection;

            dataGridOptions.collection = uniqueModels(collection);
            dataGridOptions.emptyText = APPLET_EMPTY_TEXT;
            dataGridOptions.onClickRow = _this.onClickRow;

            _this.dataGrid = ADK.Views.DataGrid.create(dataGridOptions);

            //show something now and then parse
            _this.grid.reset();
            _this.grid.show(_this.dataGrid);

            //append a paginator to the gird view
            if (dataGridOptions.collection > 0) {
                _this.paginatorView = ADK.Views.Paginator.create({
                    collection: dataGridOptions.collection
                });
                _this.grid.$el.append(_this.paginatorView.render().el);
            }
        },
        onClickRow: function(model, event, context) {
            var observedDate = model.attributes.observedFormatted;
            var list = _.filter(observationListCollection.models, function(model) {
                return model.get('observedFormatted') == observedDate;
            });

            var vitalEnteredInErrorChannel = ADK.Messaging.getChannel('vitalsEiE');
            vitalEnteredInErrorChannel.trigger('vitalsEiE:clicked', event, {
                'collection': list,
                'title': observedDate,
                'checked': '',
                'gridView': gridView
            });
        }
    });


    function parseModel(response) {
        //add the Observed Formatted Date
        response = Util.getObservedFormatted(response);
        response = Util.getFacilityColor(response);
        response = Util.getObservedFormattedCover(response);
        response = Util.getResultedFormatted(response);
        response = Util.getDisplayName(response);
        response = Util.getTypeName(response);
        response = Util.getResultUnits(response);
        response = Util.getMetricResultUnits(response);
        response = Util.getResultUnitsMetricResultUnits(response);
        response = Util.getReferenceRange(response);
        return response;
    }

    function uniqueModels(collection) {
        var coll = _.clone(collection);

        coll.models = _.uniq(coll.models, true, function(model) {
            return model.get('observedFormatted');
        });

        return coll;
    }

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('vitalsObservationList');
        channel.reply('vitalsObservationListView', function() {

            var View = applet.getRootView();

            fetchOptions = {
                criteria: ADK.UserService.getUserSession(),
                patient: ADK.PatientRecordService.getCurrentPatient(),
                resourceTitle: 'patient-record-vital',
                viewModel: {
                    parse: parseModel
                },
                pageable: true
            };

            var response = $.Deferred();

            var data = ADK.PatientRecordService.fetchCollection(fetchOptions);

            data.on('sync', function() {
                response.resolve({
                    'view': new View(),
                    'collection': data
                });
            }, this);

            return response.promise();
        });
    })();

    var applet = {
        id: 'vitalsObservationList',
        getRootView: function() {
            return observationListView;
        }
    };

    return applet;

});
