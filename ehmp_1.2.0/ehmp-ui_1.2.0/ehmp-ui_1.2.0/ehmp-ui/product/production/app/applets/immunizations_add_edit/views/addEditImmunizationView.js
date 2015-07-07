define([
    'underscore',
    'app/applets/visit/typeaheadView',
    'app/applets/immunizations_add_edit/selectViewGenerator',
    'app/applets/immunizations_add_edit/immCollectionUtil',
    'app/applets/immunizations_add_edit/views/infoStatementView',
    'hbs!app/applets/immunizations_add_edit/templates/addEditImmunizationsTemplate',
    'moment',
    'jquery.inputmask'
], function(_, Typeahead, SelectViewGenerator, ImmCollectionUtil, InfoStatementView, addEditImmunizationTemplate, Moment, InputMask){

    var immunizationChannel = ADK.Messaging.getChannel('immunization'),
        visitChannel = ADK.Messaging.getChannel('visit'),
        currentAppletKey,
        modalView,
        currentModel;


    function handleChannel(appletKey, immunizationModel){
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        currentAppletKey = appletKey;
        currentModel = immunizationModel;
        visitChannel.on('set-visit-success:immunizations_add_edit', showImmunizationsView);

        if(currentPatient.get('visit')){
            showImmunizationsView(immunizationModel);
        }else {
            visitChannel.command('openVisitSelector', 'immunizations_add_edit');
        }
    }

    function showImmunizationsView(model){
        var modalOptions = {
            footerView: FooterView
        };

        if(currentAppletKey === 'immunization_edit'){
            modalOptions.title = 'Edit Immunization: ' + model.get('name');
        }else {
            modalOptions.title = 'Add Immunization: ' + model.get('name');
        }

        modalView = new ModalView({
            model: currentModel
        });

        ADK.showModal(modalView, modalOptions);
    }
    
    var FooterView = Backbone.Marionette.ItemView.extend({
        template: _.template('<button class="btn btn-default pull-left" id="imm-back-btn">Back</button><div class="pull-right"><button class="btn btn-default" data-dismiss="modal">Cancel</button><button class="btn btn-primary" id="imm-submit" disabled>Submit Immunization</button></div>'),
        events: {
            'click #imm-back-btn': 'goBack',
            'click #imm-submit': 'submitImmunization'
        },
        goBack: function(){
            immunizationChannel.command('openImmunizationSearch', currentAppletKey);
        },
        submitImmunization: function(){
            ImmCollectionUtil.removePreviousErrors();
            var isFormValid = ImmCollectionUtil.validateFormInputAndShowErrors(modalView);
            
            if(isFormValid){
                console.log('attempting to submit immunization');
                $('#mainModal').modal('hide');
            }
        }
    });

    var ModalView = Backbone.Marionette.LayoutView.extend({
        template: addEditImmunizationTemplate,
        regions: {
            adminProvider: '#admin-provider-region',
            orderingProvider: '#ordering-provider-region',
            location: '#location-region',
            infoSource: '#info-source-region',
            routeAdmin: '#route-admin-region',
            anatomicLocation: '#anatomic-location-region',
            reaction: '#reaction-region',
            series: '#series-region',
            lotNumObserved: '#lot-num-obs-region',
            infoStatement: '#info-statement-region'
        },
        events: {
            'click #immunization-btn-observer': 'displayObserver',
            'click #immunization-btn-historical': 'displayHistorical'
        },
        initialize: function(){
            var _view = this;
            var user = ADK.UserService.getUserSession();
            var siteCode = user.get('site');
            var provFetchOptions = {
                resourceTitle: 'visits-providers',
                criteria: {
                    'fcode': siteCode,
                    limit: 10
                }
            };
            
            var prov;
            if(_.contains(user.get('vistaKeys'), 'PROVIDER')){
                var provName = user.get('lastname') + ',' + user.get('firstname');
                var provId = user.get('duz')[user.get('site')] ? user.get('duz')[user.get('site')] : user.get('duz')[0];
                prov = new Backbone.Model({name: provName, localId: provId});
            }else {
                prov = new Backbone.Model();
            }

            var AdminProviderTypeaheadView = Typeahead.generate('admin-provider', 'Administering Provider', provFetchOptions, 'name', 'pname', prov);
            this.adminProviderView = new AdminProviderTypeaheadView();

            var OrderingProviderTypeaheadView = Typeahead.generate('ordering-provider', 'Ordering Provider', provFetchOptions, 'name', 'pname');
            this.orderingProviderView = new OrderingProviderTypeaheadView();
            
            var locationFetchOptions = {
                resourceTitle: 'locations-clinics',
                criteria: {
                    'siteCode': siteCode,
                    limit: 10
                }
            };
            
            var patient = ADK.PatientRecordService.getCurrentPatient();
            var localId = '';
            
            if(patient.get('visit').locationUid){
                localId = patient.get('visit').locationUid.split(':').pop();
            }

            var serviceLocation = new Backbone.Model({name: patient.get('visit').locationName, localId: localId});
            var LocationTypeaheadView = Typeahead.generate('location', 'Location', locationFetchOptions, 'name', 'name', serviceLocation);
            this.locationView = new LocationTypeaheadView();
            this.infoSourceView = SelectViewGenerator.createSelectView('info-source', 'Information Source', 'source', 'HL7Code');
            this.routeAdminView = SelectViewGenerator.createSelectView('route-admin', 'Route of Administration', 'route', 'hl7Code', ImmCollectionUtil.checkFormReadyForSubmit);
            this.anatomicLocationView = SelectViewGenerator.createSelectView('anatomic-location', 'Anatomic Location', 'site', 'hl7Code', ImmCollectionUtil.checkFormReadyForSubmit);
            this.reactionView = SelectViewGenerator.createSelectView('reaction', 'Reaction', 'DisplayText', 'Value');
            this.seriesView = SelectViewGenerator.createSelectView('series', 'Series', 'DisplayText', 'Value');
            this.lotNumObsView = SelectViewGenerator.createSelectView('lot-num-obs', 'Lot Number', 'lotNumber', 'lotNumber', ImmCollectionUtil.changeLotNumber);
            this.infoStatementView = new InfoStatementView();
            
            var opDataFetchOptions = {
                resourceTitle: 'immunization-crud-getImmunizationsOperationalData',
                criteria: {
                    searchforName: currentModel.get('name'),
                    searchforID: currentModel.get('localId')
                },
                onSuccess: function(model, response){
                    $('#immunization-add-loading').attr('aria-hidden', true).addClass('hidden');
                    $('#add-edit-imm').attr('aria-hidden', false).removeClass('grayed-out');
                    
                    var data = model.models[0];
                    var infoSourceCollection = ImmCollectionUtil.modifyInfoSourceCollection(data.get('infoSource'));
                    _view.infoSourceView.collection.add(infoSourceCollection.models);
                    _view.routeAdminView.collection.add(new Backbone.Collection(data.get('routeOfAdministration')).models);
                    _view.anatomicLocationView.collection.add(new Backbone.Collection(data.get('anatomicLocation')).models);
                    _view.reactionView.collection.add(new Backbone.Collection(data.get('reaction')).models);
                    _view.seriesView.collection.add(new Backbone.Collection(data.get('series')).models);
                    
                    var lotNumsColl = ImmCollectionUtil.filterOutInactiveLotNumbers(data.get('lotNumbers'));
                    var infoStatementColl = ImmCollectionUtil.filterOutHistoricalInfoStatements(data.get('vaccineInformationStatement'));
                    if(lotNumsColl.models.length > 0){
                        _view.lotNumObsView.collection.add(lotNumsColl.models);
                    }
                    
                    if(infoStatementColl.models && infoStatementColl.models.length > 0){
                        _view.infoStatementView.setFirstModel(infoStatementColl.models);
                    }else {
                        $('#vis-padding-column').removeClass('hidden').attr('aria-hidden', false);
                        $('#vis-region').addClass('hidden').attr('aria-hidden', true);
                        $('#info-statement-block').addClass('hidden').attr('aria-hidden', true);
                    }
                },
                onError: function(){}
            };
            ADK.ResourceService.fetchCollection(opDataFetchOptions);
        },
        onRender: function(){
            var patient = ADK.PatientRecordService.getCurrentPatient();
            this.adminProvider.show(this.adminProviderView);
            this.orderingProvider.show(this.orderingProviderView);
            this.location.show(this.locationView);
            this.infoSource.show(this.infoSourceView);
            this.routeAdmin.show(this.routeAdminView);
            this.anatomicLocation.show(this.anatomicLocationView);
            this.reaction.show(this.reactionView);
            this.series.show(this.seriesView);
            this.lotNumObserved.show(this.lotNumObsView);
            this.infoStatement.show(this.infoStatementView);
            
            var birthDate = patient.get('birthDate');
            this.initDatePicker('admin-date-time', birthDate);
            this.initDatePicker('vis-date-offered', birthDate);
            this.initDatePicker('expiration-date', birthDate);
            
            this.$('#admin-provider').attr('maxlength', '75');
            this.$('#ordering-provider').inputmask('Regex', {
               regex: '^[ A-Za-z,.-]*$'
            });
            
            this.listenTo(this.adminProviderView, 'selected_typeahead:admin-provider', function(){
                $('#admin-provider').attr('maxlength', '75');
            });
            
            this.listenTo(this.orderingProviderView, 'selected_typeahead:ordering-provider', function(){
                $('#ordering-provider').inputmask('Regex', {
                   regex: '^[ A-Za-z,.-]*$'
                });
            });
            
            if(currentAppletKey === 'immunization_add'){
                this.setDefaults();
            }
        },
        displayObserver: function(){
            ImmCollectionUtil.removePreviousErrors();
            $('#immunization-btn-observer').attr('data-is-active', 'true');
            $('#immunization-btn-historical').attr('data-is-active', 'false');
            $('#immunization-btn-observer').removeClass('toggle-off');
            $('#immunization-btn-observer').addClass('toggle-on');
            $('#immunization-btn-historical').removeClass('toggle-on');
            $('#immunization-btn-historical').addClass('toggle-off');
            $('#lot-num-historical-region').addClass('hidden').attr('aria-hidden', true);
            $('#lot-num-obs-region').removeClass('hidden').attr('aria-hidden', false);
            $('#info-source-region').addClass('hidden').attr('aria-hidden', true);
            $('#imm-submit').attr('disabled', true);
            $('#imm-data-entry').removeClass('hidden').attr('aria-hidden', false);
            
            this.setLotFieldsEnabled(false);
        },
        displayHistorical: function(){
            ImmCollectionUtil.removePreviousErrors();
            $('#immunization-btn-historical').attr('data-is-active', 'true');
            $('#immunization-btn-observer').attr('data-is-active', 'false');
            $('#immunization-btn-historical').removeClass('toggle-off');
            $('#immunization-btn-historical').addClass('toggle-on');
            $('#immunization-btn-observer').removeClass('toggle-on');
            $('#immunization-btn-observer').addClass('toggle-off');
            $('#lot-num-obs-region').addClass('hidden').attr('aria-hidden', true);
            $('#lot-num-historical-region').removeClass('hidden').attr('aria-hidden', false).find('input').val('');
            $('#info-source-region').removeClass('hidden').attr('aria-hidden', false);
            $('#admin-provider').val('');
            $('#lot-num-obs option:first-child').attr('selected', true);
            $('#imm-submit').attr('disabled', false);
            $('#imm-data-entry').removeClass('hidden').attr('aria-hidden', false);
            
            this.setLotFieldsEnabled(true);
        },
        initDatePicker: function(dpId, birthDate){
            var dpicker = this.$('#' + dpId);
            ADK.utils.dateUtils.datepicker(dpicker, {
                'endDate': new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder),
                'startDate': new Moment(birthDate, 'YYYYMMDD').format(ADK.utils.dateUtils.defaultOptions().placeholder),
            });
            this.enableDatePickerClick(dpId);
        },
        disableDatePickerClick: function(dpId){
            var dpicker = this.$('#' + dpId);
            dpicker.parent().find('#date-picker-icon').unbind('click');
        },
        enableDatePickerClick: function(dpId){
            var dpicker = this.$('#' + dpId);
            dpicker.attr('placeholder', ADK.utils.dateUtils.defaultOptions().placeholder);
            dpicker.parent().find('#date-picker-icon').on('click', function() {
                dpicker.datepicker('show');
            });
        },
        setLotFieldsEnabled: function(enabled){
            $(this.el).find('#expiration-date').val('').attr('disabled', !enabled);
            $(this.el).find('#manufacturer').val('').attr('disabled', !enabled);

            if(enabled){
                this.enableDatePickerClick('expiration-date');
            }else {
                this.disableDatePickerClick('expiration-date');
            }
        },
        setDefaults: function(){
            var currDate = new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder);
            this.$('#admin-date-time').val(currDate);
            this.$('#vis-date-offered').val(currDate);
        }
    });

    var AddEditImmunizationView = {
        handleMessage: handleChannel
    };

    return AddEditImmunizationView;

});
