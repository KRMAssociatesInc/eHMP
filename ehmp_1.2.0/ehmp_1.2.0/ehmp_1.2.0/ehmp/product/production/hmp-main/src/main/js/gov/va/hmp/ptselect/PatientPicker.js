Ext.define('gov.va.hmp.ptselect.PatientPicker', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.hmp.ux.SearchableList',
        'gov.va.hmp.ux.SegmentedButton',
        'gov.va.hmp.ux.DateRangePicker',
        'gov.va.hmp.ux.PopUpButton',
        'gov.va.hmp.ptselect.Location',
        'gov.va.hmp.ptselect.PatientStore',
        'gov.va.hmp.UserContext',
        'gov.va.hmp.healthtime.PointInTime'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    alias: 'widget.patientpicker',
    cls: 'patientpicker',
    collapsedCls: 'patientpicker-collapsed',
    title: 'Select Patient',
    config: {
        patientFilterType: "cprs-default-list",
        patientFilterId: null,
        dateRange: 'T..T'
    },
    /**
     * @cfg
     */
    enablePreselect: false,
    // private
    deselectingPatient: false,
    // private
    preselectedPt: null,
    // private
    ptListLoaded: false,
    tbar: [
        {
            xtype: 'segmentedbutton',
            itemId: 'filterTypes',
            ui: 'pill',
            margin: '0 0 6 0',
            allowDepress: false,
            allowMultiple: true,
            defaultType: 'popupbutton',
            defaults: {
                arrowCls: ''
            },
            items: [
                {
                    xtype: 'button',
                    itemId: 'cprsDefaultListButton',
                    text: 'My CPRS List',
                    pressed: true,
                    allowDepress: false
                },
                {
                    text: 'Clinics',
                    popUp: {
                        xtype: 'container',
                        width: 320,
                        height: 400,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'segmentedbutton',
                                itemId: 'dateRangePicker',
                                ui: 'pill',
                                scale: 'extra-small',
                                margin: '0 0 6 0',
                                allowDepress: true,
                                items: [
                                    {
                                        text: 'Past Month',
                                        dateRange: 'T-1m..T'
                                    },
                                    {
                                        text: 'Past Week',
                                        dateRange: 'T-1w..T'
                                    },
                                    {
                                        text: 'Yesterday',
                                        dateRange: 'T-1..T-1'
                                    },
                                    {
                                        text: 'Today',
                                        pressed: true,
                                        dateRange: 'T..T'
                                    },
                                    {
                                        text: 'Tomorrow',
                                        dateRange: 'T+1..T+1'
                                    }
                                ]
                            },
                            {
                                xtype: 'searchablelist',
                                itemId: 'clinicList',
                                emptyText: 'Search Clinics',
                                displayTpl:'{displayName}',
                                minChars: 1,
                                header: false,
                                hideHeaders: true,
                                flex: 1,
                                store: {
                                    model: 'gov.va.hmp.ptselect.Location',
                                    buffered: true,
                                    pageSize: 100,
                                    proxy: {
                                        type: 'ajax',
                                        url: '/patientselect/v1/clinics',
                                        reader: {
                                            type: 'json',
                                            root: 'data.items',
                                            totalProperty: 'data.totalItems'
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    text: 'Wards',
                    popUp: {
                        xtype: 'searchablelist',
                        itemId: 'wardList',
                        width: 300,
                        height: 400,
                        emptyText: 'Search Wards',
                        displayTpl:'{displayName}',
                        minChars: 1,
                        header: false,
                        hideHeaders: true,
                        store: {
                            model: 'gov.va.hmp.ptselect.Location',
                            buffered: true,
                            pageSize: 100,
                            proxy: {
                                type: 'ajax',
                                url: '/patientselect/v1/wards',
                                reader: {
                                    type: 'json',
                                    root: 'data.items',
                                    totalProperty: 'data.totalItems'
                                }
                            }
                        }
                    }
                }
            ]
        }
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'searchablelist',
            itemId: 'patientSearch',
            flex: 3,
            minChars: 1,
            emptyText: 'Search All Patients',
            listConfig: {
                emptyText: 'No matching patients found.',
                selModel: {
                    pruneRemoved: true
                },
                features: [{
                    ftype:'grouping',
                    collapsible: false
                }]
            }
        }
    ],
    statics: {
        formatPatientType: function(patientType) {
            return (patientType.charAt(0) == 'O' ? patientType.substr(0,3) : patientType.substr(0,2)) + 'Pt';
        },
        isGroupedByAppointment:function() {
            var sort = gov.va.hmp.ptselect.PatientPicker.getDefaultPatientListSourceSort(),
                sourceType = gov.va.hmp.ptselect.PatientPicker.getDefaultPatientListSourceType();
            return sourceType == 'C' || sort == 'P';
        },
        getDefaultPatientListSourceType: function () {
            var store = Ext.StoreManager.lookup("ptSelectStore"),
                reader = store.getProxy().getReader(),
                rawData = reader.rawData;
            return rawData.data.defaultPatientListSourceType;
        },
        getDefaultPatientListSourceSort: function () {
            var store = Ext.StoreManager.lookup("ptSelectStore"),
                reader = store.getProxy().getReader(),
                rawData = reader.rawData;
            return rawData.data.defaultPatientListSourceSort;
        }
    },
    initComponent: function () {
        var me = this;
        var patientList = me.items[0];
        patientList.store = Ext.create('gov.va.hmp.ptselect.PatientStore');
        // setting this template here so that the static functions can be shared
        patientList.displayTpl = [
                '<div>' +
                '<div class="clearfix">' +
                '<strong class="pull-left" style="font-weight: 500">{displayName}</strong>' +
                '<span class="pull-right"><tpl if="appointment"><tpl if="!this.isGroupedByAppointment()"><span class="text-muted">{[PointInTime.format(values.appointment, "DefaultDate")]}</span>&nbsp;</tpl><span style="font-weight: 500">{[PointInTime.format(values.appointment, Ext.Date.patterns.Time)]}</span><tpl elseif="roomBed"><span style="font-weight: 500">{roomBed}</span></tpl></span>' +
                '</div>' +
                '<div class="clearfix">' +
                '<span class="pull-left text-muted">' +
                '<tpl if="!sensitive">' +
                '<span class="text-muted">&#9679;&#9679;&#9679;-&#9679;&#9679;-{last4}</span>' +
                '<tpl else>' +
                '<span class="pull-left">*Sensitive*</span>' +
                '</tpl>' +
                '</span>' +
                '<span class="pull-right"><tpl if="this.getDefaultPatientListSourceType() != \'W\'"><span class="text-muted">{sourceDisplayName}</span></tpl></span>' +
                '</div>' +
                '<div class="clearfix text-muted">' +
                '<span class="pull-left"><tpl if="!sensitive">{birthDate}<span><tpl if="deceased">&nbsp;Deceased<tpl else>,&nbsp;{age}y</tpl></span>&nbsp;{genderName}</tpl></span>&nbsp;' +
                '<span class="pull-right"><tpl if="appointment">{patientType:this.formatPatientType}</tpl></span>' +
                '</div>' +
                '</div>',
            {
                formatPatientType: gov.va.hmp.ptselect.PatientPicker.formatPatientType,
                isGroupedByAppointment: gov.va.hmp.ptselect.PatientPicker.isGroupedByAppointment,
                getDefaultPatientListSourceType: gov.va.hmp.ptselect.PatientPicker.getDefaultPatientListSourceType,
                getDefaultPatientListSourceSort: gov.va.hmp.ptselect.PatientPicker.getDefaultPatientListSourceSort
            }
        ];
        // setting this template here so that the static functions can be shared
        patientList.listConfig.features[0].groupHeaderTpl = [
                '<div style="margin-top: 10px" class="text-center">' +
                '<tpl if="this.isGroupedByAppointment()">{[values.name != "none" ? PointInTime.formatDateFromNow(values.name) : "No Appointment Date"]}<tpl else>{name}</tpl></div>',
            {
                isGroupedByAppointment: gov.va.hmp.ptselect.PatientPicker.isGroupedByAppointment,
                getDefaultPatientListSourceType: gov.va.hmp.ptselect.PatientPicker.getDefaultPatientListSourceType,
                getDefaultPatientListSourceSort: gov.va.hmp.ptselect.PatientPicker.getDefaultPatientListSourceSort
            }
        ];

        me.callParent(arguments);

        if (me.enablePreselect) {
            me.down('#patientSearch').getSelectionModel().setSelectionMode('SIMPLE');
        }
        me.addEvents(   /**
                         * @event select
                         * Fires when at least one patient is selected.
                         * @param {gov.va.hmp.ptselect.PatientPicker} cmp This patient picker
                         * @param {Array} records The selected records
                         */
                        'select');
    },
    initEvents: function () {
        var me = this;
        var patientSearch = me.down('#patientSearch');

        me.callParent(arguments);

        me.on('beforepatientchange', me.onBeforePatientChange, me);
        me.on('patientchange', me.onPatientChange, me);
        if (me.enablePreselect) {
            me.mon(patientSearch, 'beforedeselect', me.onBeforeDeselect, me);
            me.mon(patientSearch, 'select', me.onSelect, me);
            me.mon(patientSearch.down('grid'), 'beforeitemclick', me.onBeforeItemClick, me);
        }
        me.mon(patientSearch, 'selectionchange', me.onSelectionChange, me);
        me.mon(me.down('#patientSearch #searchField'), 'change', me.onSearchFieldChange, me);
        me.mon(patientSearch.getStore(), 'load', me.onPatientListLoad, me);
        me.mon(me.down('#cprsDefaultListButton'), 'toggle', me.onCprsDefaultListButtonToggle, me);

        var filtersWithStores = me.query('#filterTypes popupbutton');
        var filterList = null,
            dateRangePicker = null;
        for (var i = 0; i < filtersWithStores.length; i++) {
            me.mon(filtersWithStores[i], 'menushow', me.onFilterMenuShow, me);
            me.mon(filtersWithStores[i], 'menuhide', me.onFilterMenuHide, me);
            filterList = filtersWithStores[i].menu.down('searchablelist');
            me.mon(filterList, 'selectionchange', me.onSelectFilter, me);
            if (filterList.itemId === 'clinicList') {
                dateRangePicker = filtersWithStores[i].menu.down('#dateRangePicker');
                me.mon(dateRangePicker, 'toggle', me.onDateRangeToggle, me);
            }
        }
    },
    onBoxReady:function() {
        this.callParent(arguments);
        this.initPatientContext();

        this.setPatientFilterId(gov.va.hmp.UserContext.getUid()); // use current user's CPRS Default List
    },
    // @private
    onBeforePatientChange: function(pid) {
        if (!this.firingSelectEvent) {
            this.down('#patientSearch').getSelectionModel().deselectAll();
        }
    },
    // @private
    onPatientChange: function(pid) {
        this.pid = pid;

        this.refreshSelectedPatient();

        return true;
    },
    // @private
    onBeforeDeselect: function (cmp, record, index) {
//        console.log('beforedeselect: ' + index + ": " + this.preselectedIndex);
        var patients = this.down('#patientSearch'),
            searchList = cmp.down('#searchMatchList'),
            selModel = searchList.getSelectionModel(),
            store = patients.getStore(),
            selectedPatient = store.findRecord('pid', this.pid, 0, false, false, true),
            id = record.getId();
//        console.log('beforedeselect: ' + id + ": " + (this.preselectedPt ? this.preselectedPt.getId() : null) + ":" + (selectedPatient ? selectedPatient.getId() : null));
        if (this.preselectedPt && id === this.preselectedPt.getId()) {
            var selection = selModel.getSelection();
            Ext.Array.each(selection, function(item) {
                if (item.getId() !== id) {
                    this.deselectingPatient = true;
                    selModel.deselect(item);
                    this.deselectingPatient = false;
                }
            });
            var node = Ext.get(searchList.getView().getNode(record));
            node.removeCls('hmp-preselect');
            node.down('button').remove();
            this.preselectedPt = null;
            this.fireSelectionChange(selModel.getSelection());

            return false; // reject deselection of preselected item
        } else {
            return true;
        }
    },
    // @private
    onSelect: function(cmp, record, index) {
        var me = this;
//        console.log('select: ' + record.getId() + ": " + (this.preselectedPt ? this.preselectedPt.getId() : null));
        var searchList = cmp.down('#searchMatchList');
        var searchListView = searchList.getView();
        var rowNode = Ext.get(searchListView.getNode(record));
        var oldPreselectedPt = this.preselectedPt;

        if (this.preselectedPt != null && record.getId() === this.preselectedPt.getId()) {
            this.preselectedPt = null;
            console.log('change actual patient selection now ' + record.getId());
        } else {
            rowNode.addCls('hmp-preselect');
            var btnNode = Ext.DomHelper.append(rowNode.down('.x-grid-cell-inner'), '<button type="button" class="btn btn-warning">Confirm Selection</button>', true);
            btnNode.on('click', me.onConfirmSelectionClick, me, { single: true });

            this.preselectedPt = record;

            // might be able to do this in onBeforeSelect
            if (oldPreselectedPt != null && record.getId() !== oldPreselectedPt.getId()) {
                var oldPreselectedNode = Ext.get(searchListView.getNode(oldPreselectedPt));
                if (oldPreselectedNode) {
                    oldPreselectedNode.removeCls('hmp-preselect');
                    oldPreselectedNode.down('button').remove();
                }
                searchList.getSelectionModel().deselect(oldPreselectedPt);
            }
        }
    },
    // @private
    onBeforeItemClick:function(grid, record, item, index, evt) {
        var me = this;
        if (me.preselectedPt && record.getId() === me.preselectedPt.getId()) {
//            console.log("beforeitemclick on preselected item");
            if (me.confirmingSelection) {
                me.confirmingSelection = false;
                return true;
            }

            return false;
        }
    },
    // @private
    onConfirmSelectionClick: function() {
//        console.log("onConfirmSelectionClick");
        this.confirmingSelection = true;
    },
    // @private
    fireSelectionChange: function (records) {
        this.firingSelectEvent = true;
        this.fireEvent('selectionchange', this, records);
        this.firingSelectEvent = false;
    },
    // @private
    onSelectionChange: function (cmp, records) {
        if (!this.enablePreselect) {
            this.fireSelectionChange(records);
        }
    },
    // @private
    onSearchFieldChange:function(field, newValue, oldValue) {
        var patientSearch = this.down('#patientSearch'),
            store = patientSearch.getStore();
        this.refreshFilteredEmptyTextAndTitle(this.getPatientFilterType());
        if ((oldValue && oldValue.length > 0 && newValue.length == 0)
            || (newValue.length > 0 && newValue.length < patientSearch.minChars)) {
            store.removeAll();
        }
        if (newValue.length == 0) {
            this.filterPatients(this.getPatientFilterType(),
                this.getPatientFilterId(),
                this.getDateRange());
        }
    },
    // @private
    onCprsDefaultListButtonToggle:function(btn, pressed) {
        if (!pressed) return;

        var patientSearchField = this.down('#patientSearch');
        patientSearchField.reset();

        // reset the patient list metadata
        this.defaultPatientListSourceName = null;
        this.defaultPatientListSourceType = null;
        this.defaultPatientListSourceSort = null;

        this.setPatientFilterType('cprs-default-list');
        this.setPatientFilterId(gov.va.hmp.UserContext.getUid());

        this.refreshFilteredEmptyTextAndTitle(this.getPatientFilterType());
    },
    // @private
    onFilterMenuShow: function(btn, menu) {
        var me = this,
            list = menu.down('searchablelist'),
            store = list.getStore(),
            selModel = list.getSelectionModel();
        me.selectingFilter = true;

        if (selModel.hasSelection()) {
            selModel.deselectAll(true);
        }

        store.removeAll();
        store.load({
            scope: me,
            callback: function (records, operation, success) {
                if (!success) return;

                var selectedId = me.getPatientFilterId();
                if (selectedId && selectedId !== gov.va.hmp.UserContext.getUid()) {
                    var idx = store.findExact('uid', selectedId);
                    if (idx != -1) {
                        selModel.select(idx, false, true);
                        list.getView().focusRow(idx, true);
                    }
                }
            }
        });
    },
    // @private
    onFilterMenuHide: function(btn, menu) {
        if (this.selectingFilter) {
            this.selectingFilter = false;
            this.refreshFilteredEmptyTextAndTitle(this.getPatientFilterType());
        }
    },
    // @private
    onSelectFilter: function (list, records) {
        var record = records[0],
            patientSearchField = this.down('#patientSearch'),
            toggleBtn = list.up('popupmenu').ownerButton,
            filterTypes = toggleBtn.up('#filterTypes');
        this.selectingFilter = false;
        patientSearchField.reset();
        this.setPatientFilterType(toggleBtn.getText());
        this.setPatientFilterId(record.getId());
        this.refreshFilteredEmptyTextAndTitle(this.getPatientFilterType());
        var hideTask = new Ext.util.DelayedTask(function() {
            toggleBtn.hideMenu();
        });
        hideTask.delay(10);
    },
    // @private
    onDateRangeToggle: function (container, button, pressed) {
        if (!button.rendered) return;
        if (!pressed) return;

        this.setDateRange(button.dateRange);
    },
    // @private
    onPatientListLoad:function(store, records, successful) {
//        console.log("onPatientLoad()");
        var reader = store.getProxy().getReader(),
            rawData = reader.rawData;
        if (successful) {
            this.defaultPatientListSourceName = rawData.data.defaultPatientListSourceName;
            this.defaultPatientListSourceType = rawData.data.defaultPatientListSourceType;
            this.defaultPatientListSourceSort = rawData.data.defaultPatientListSort;

            if (this.defaultPatientListSourceType === 'M') { // combination list
                if (this.defaultPatientListSourceSort === 'P') {
                    this.groupByAppointment();
                } else if (this.defaultPatientListSourceSort === 'S') {
                    this.groupBySource();
                } else {
                    if (store.isGrouped()) {
                        store.clearGrouping();
                    }
                }
            } else if (this.defaultPatientListSourceType === 'C') { // clinic
                this.groupByAppointment();
            } else {
                if (store.isGrouped()) {
                    store.clearGrouping();
                }
            }

            this.ptListLoaded = true;
            this.refreshFilteredEmptyTextAndTitle(this.getPatientFilterType());
            this.refreshSelectedPatient();
        }
    },
    /**
     * Called by Sencha Class system by {@link gov.va.hmp.ptselect.PatientPicker#setPatientFilterId}
     * @private
     * @aside guide class-system-guide
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    applyPatientFilterId: function (filterId) {
//        console.log('applyPatientFilterId('+ filterId + ')');
        var patientSearch = this.down('#patientSearch'),
            store = patientSearch.getStore(),
            filterType = this.getPatientFilterType(),
            dateRange = this.getDateRange();
        if (filterId == null) {
            patientSearch.deselectAll();
            store.clearFilter();
        }
        store.removeAll();
        if (this.rendered && filterId && filterType && dateRange) {
            this.filterPatients(this.getPatientFilterType(), filterId, this.getDateRange());
        }
        return filterId;
    },
    /**
     * Called by Sencha Class system by {@link gov.va.hmp.ptselect.PatientPicker#setDateRange}
     * @private
     * @aside guide class-system-guide
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    applyDateRange: function (dateRange) {
        var filterType = this.getPatientFilterType(),
            filterId = this.getPatientFilterId();
        if (this.rendered && filterType && filterId)  {
            this.refreshFilteredEmptyTextAndTitle(filterType);
            this.filterPatients(filterType, filterId, dateRange);
        }
        return dateRange;
    },
    // @private
    groupByAppointment:function() {
        var patientSearch = this.down('#patientSearch'),
            store = patientSearch.getStore();
        store.suspendEvents(true);
        store.group([
            {
                property: 'appointment',
                direction: 'DESC',
                sorterFn: function (o1, o2) {
                    var a1 = o1 != null ? o1.get('appointment') : null;
                    var a2 = o2 != null ? o2.get('appointment') : null;
                    if (!a1 && !a2) { return 0; }
                    else if (a1 && !a2) { return -1; }
                    else if (!a1 && a2) { return 1; }

                    var date1 = a1.substr(0,8);
                    var time1 = parseInt(a1.substr(8,4), 10);
                    var date2 = a2.substr(0,8);
                    var time2 = parseInt(a2.substr(8,4), 10);

                    if (date1 < date2) {
                        return -1;
                    } else if (date1 > date2) {
                        return 1;
                    } else if (date1 === date2) {
                        if (time1 < time2) {
                            return 1;
                        } else if (time1 > time2) {
                            return -1;
                        } else if (time1 === time2) {
                            return 0;
                        }
                    }
                },
                getGroupString: function (instance) {
                    var appointment = instance.get('appointment');
                    appointment = appointment ? appointment.substr(0, 8) : 'none';
                    return appointment;
                }
            }
        ]);
//        store.sort([{
//            property: 'appointment',
//            direction: 'ASC'
//        }]);
        store.resumeEvents();
    },
    // @private
    groupBySource:function() {
        var patientSearch = this.down('#patientSearch'),
            store = patientSearch.getStore();
        store.group([
            {
                property: 'defaultPatientListSourceName',
                direction: 'ASC',
                root: 'data'
            }
        ]);
    },
    /**
     * @private
     */
    filterPatients:function(filterType, filterId, dateRange) {
        if (!this.rendered) return;

        var patientSearch = this.down('#patientSearch'),
            store = patientSearch.getStore(),
            query = patientSearch.getRawValue(),
            filterType = filterType.toLowerCase();
        // depluralize filterType
        if (filterType !== 'cprs-default-list') {
            filterType = (filterType == 'specialties' ? filterType.slice(0, -3) + 'y' : filterType.slice(0, -1));
        }
        store.removeAll();
        store.getProxy().extraParams = {};

        var params = {};
        if (query.length == 0) {
            params[filterType] = filterId;
            if (filterType === 'clinic') {
                params.dateRange = dateRange;
            }
        }

        if (query.length == 0 || query.length >= patientSearch.minChars) {
            store.getProxy().extraParams = params;
            store.load();
        }
   },
    refreshFilteredEmptyTextAndTitle:function(filterType) {
        var dateRangePicker = null,
            thingy = null,
            selectedDateRange = '',
            patientSearchField = this.down('#patientSearch'),
            query = patientSearchField.getRawValue(),
            filter_buttons = this.down('#filterTypes');
        if (query.length == 0) {
            if (filterType === 'cprs-default-list') {
                // reselect the filter
                filter_buttons.setPressedButton(filter_buttons.getComponent(0), true);

                this.setTitle('My CPRS List' + (this.defaultPatientListSourceName ? "&nbsp;&nbsp;<span class='text-muted'>" + this.defaultPatientListSourceName + "</span>" : ""));
            } else {
                // reselect the filter
                filter_buttons.setPressedButton(filter_buttons.down('[text=' + filterType + ']'), true);

                var filter = filterType.toLowerCase().slice(0, -1);
                var filterList = this.down('#' + filter + 'List');
                if (!filterList) {
                    return;
                }

                var selectedFilter = filterList.getSelectionModel().getLastSelected();
                if (selectedFilter) {
                    thingy = selectedFilter.get('displayName') || selectedFilter.get('name');
                    if (filterType == 'Clinics') {
                        dateRangePicker = this.down('#dateRangePicker');
                        selectedDateRange = dateRangePicker.getPressedButtons()[0].getText();
                        if (selectedDateRange.toLowerCase().lastIndexOf("past", 0) === 0) selectedDateRange = " in the " + selectedDateRange;
                    }
                    this.setTitle(thingy + (filterType == 'Clinics' ? "&nbsp;&nbsp;<span class='text-muted'>" + selectedDateRange.trim() + "</span>" : ""));
                }
            }
            this.setPatientSearchListEmptyText("No matching patients found.");
        } else if (query.length > 0 && query.length < patientSearchField.minChars) {
            filter_buttons.clearPressedButtons(true);
            this.setTitle("'" + Ext.String.htmlEncode(query) + "'");
            this.setPatientSearchListEmptyText("A minimum of " + patientSearchField.minChars + " characters are required to search all patients.");
        } else {
            filter_buttons.clearPressedButtons(true);
            this.setTitle("'" + Ext.String.htmlEncode(query) + "'");
            this.setPatientSearchListEmptyText("No patients matching '"+ Ext.String.htmlEncode(query)+"' found.");
        }
    },
    /**
     * @private
     */
    setPatientSearchFieldEmptyText: function (text) {
        var patientSearch = this.down('#patientSearch');
        patientSearch.setEmptyText(text);
    },
    /**
     * @private
     */
    setPatientSearchListEmptyText: function (text) {
        var patientSearch = this.down('#patientSearch');
        patientSearch.setListEmptyText(text);
    },
    // @private
    refreshSelectedPatient:function() {
        var me = this;
        var patients = this.down('#patientSearch'),
            store = patients.getStore(),
            i = -1;

        var perfectMatches = store.queryBy(function(record, id) {
            var ptSelect = record.data;
            var uid = (ptSelect.appointment !== null && ptSelect.appointment != '') ? ptSelect.appointmentUid : ptSelect.admissionUid;
            //console.log('record.data.pid=' +  record.data.pid + ', ' + me.pid + '   record.data.uid=' + uid + ', ' + gov.va.hmp.EncounterContext.getEncounterInfo().uid);
            return record.data.pid == me.pid && (uid == null || uid == '' || uid == gov.va.hmp.EncounterContext.getEncounterInfo().uid);
        }, me);

        if ( perfectMatches.getCount() == 1) {
            i = store.findExact('id', perfectMatches.getAt(0).data.id);
        }

        // at this point there should be a match found if this method is invoked from Single Patient View and encounter context is already set
        // otherwise, possibly a match found, or not for the cases: 1. when  switched from multi pt board to spv 2. when ccow changed the patient
        // we don't know which one (SPV, MPV, or CCOW) invoked this method so that we should call setEncounterContext here ...
        if (i == -1 && this.ptListLoaded)  {
            var matches = store.queryBy(function(record, id) {
                return record.data.pid == me.pid;
            }, me);

            if ( matches.getCount() == 0 ) {
                // no patient found in patient select list ... set encounter context using data in patient demographic
                var ptInfo = gov.va.hmp.PatientContext.getPatientInfo();
                var admissionUid = '';
                if ( Ext.isDefined(ptInfo.admissionUid) &&  ptInfo.admissionUid != null && ptInfo.admissionUid != '' ) {
                    admissionUid = ptInfo.admissionUid;
                }
                // create pt-select object manually with minimal data
                var ptSelect = { uid: 'urn:va:pt-select:', appointmentUid: '', admissionUid: admissionUid, roomBed: ptInfo.roomBed, locationShortName: ptInfo.shortInpatientLocation};
                gov.va.hmp.EncounterContext.setAndPostEncounterContext(me.pid, ptSelect);
            }
            else if ( matches.getCount() == 1 ) {
                i = store.findExact('id', matches.getAt(0).data.id);
            }
            else {
                // find admission first, and then no encounter one ...  and then return anything ...
                var id = this.findClosestMatch(matches, 'InPt');
                if ( id == 'NOT_FOUND' ) {
                    id = this.findClosestMatch(matches, 'NoEncounter');
                }
                if ( id != 'NOT_FOUND' ) {
                    i = store.findExact('id', id);
                }
                else {
                    i = store.findExact('pid', this.pid);
                }
            }
        }

        if (i != -1) {
            gov.va.hmp.EncounterContext.setAndPostEncounterContext(me.pid, store.getAt(i).data);    // set encounter context
            patients.getSelectionModel().select(i, false, true);
        }
    },
    deselectAll: function(suppressEvent) {
        var patientSearch = this.down('#patientSearch');
        patientSearch.deselectAll(suppressEvent);
    },
    findClosestMatch: function(matches, matchStr) {
        var id = 'NOT_FOUND';
        for ( var i=0; i<matches.items.length; i++) {
            var pt = matches.items[i].data;
            if ( matchStr == 'InPt' && pt.admissionUid !== null && pt.admissionUid !== '' ) {
                return pt.id;
            }
            else if ( matchStr == 'NoEncounter' && (pt.admissionUid == null || pt.admissionUid == '') && (pt.appointmentUid == null || pt.appointmentUid == '') ) {
                return pt.id;
            }
        }
        return id;
    }
});
