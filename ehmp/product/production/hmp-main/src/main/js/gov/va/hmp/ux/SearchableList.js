/**
 * Like an editable ComboBox with its popUp stuck open.
 * <p/>
 * Implemented as a {@link Ext.field.TextField} and a {@link Grid}, with
 * bits of {@link ComboBox} thrown in to do remote/local query stuff.
 */
Ext.define('gov.va.hmp.ux.SearchableList', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.data.StoreManager',
        'gov.va.hmp.ux.SearchField'
    ],
    mixins: {
        bindable: 'Ext.util.Bindable'
    },
    alias: 'widget.searchablelist',
    /**
     * @cfg {Boolean} [triggerDisabled=true]
     * True to enable 'triggerclick' event on searchfield and clickable styling on its trigger
     */
    triggerDisabled: true,
    /**
     * @cfg {String} queryParam
     * Name of the parameter used by the Store to pass the typed string when the SearchableList is configured with
     * `{@link #queryMode}: 'remote'`. If explicitly set to a falsy value it will not be sent.
     */
    queryParam: 'query',
    /**
     * @cfg {Ext.data.Store/String/Array} store
     * The data source to which this searchable list is bound. Acceptable values for this property are:
     *
     *   - **any {@link Ext.data.Store Store} subclass**
     *   - **an {@link Ext.data.Store#storeId ID of a store}**
     *   - **an Array** : Arrays will be converted to a {@link Ext.data.Store} internally, automatically generating
     *     {@link Ext.data.Field#name field names} to work with all data components.
     *
     *     - **1-dimensional array** : (e.g., `['Foo','Bar']`)
     *
     *       A 1-dimensional array will automatically be expanded (each array item will be used for both the searchable list
     *       {@link #valueField} and {@link #displayField})
     *
     *     - **2-dimensional array** : (e.g., `[['f','Foo'],['b','Bar']]`)
     *
     *       For a multi-dimensional array, the value in index 0 of each item will be assumed to be the searchable list
     *       {@link #valueField}, while the value at index 1 is assumed to be the searchable list {@link #displayField}.
     *
     * See also {@link #queryMode}.
     */

    /**
     * @cfg {String} queryMode
     * The mode in which the SearchableList uses the configured Store. Acceptable values are:
     *
     *   - **`'remote'`** :
     *
     *     In `queryMode: 'remote'`, the SearchableList loads its Store dynamically based upon user interaction.
     *
     *     This is typically used for "autocomplete" type inputs, and after the user finishes typing, the Store is
     *     {@link Ext.data.Store#method-load load}ed.
     *
     *     A parameter containing the typed string is sent in the load request. The default parameter name for the input
     *     string is `query`, but this can be configured using the {@link #queryParam} config.
     *
     *     In `queryMode: 'remote'`, the Store may be configured with `{@link Ext.data.Store#remoteFilter remoteFilter}:
     *     true`, and further filters may be _programatically_ added to the Store which are then passed with every load
     *     request which allows the server to further refine the returned dataset.
     *
     *     Typically, in an autocomplete situation, {@link #hideTrigger} is configured `true` because it has no meaning for
     *     autocomplete.
     *
     *   - **`'local'`** :
     *
     *     SearchableList loads local data
     *
     *         var searchable = new gov.va.hmp.ux.SearchableList({
     *             queryMode: 'local',
     *             store: new Ext.data.ArrayStore({
     *                 id: 0,
     *                 fields: [
     *                     'myId',  // numeric value is the key
     *                     'displayText'
     *                 ],
     *                 data: [[1, 'item1'], [2, 'item2']]  // data is local
     *             }),
     *             valueField: 'myId',
     *             displayField: 'displayText',
     *             triggerAction: 'all'
     *         });
     */
    queryMode: 'remote',

    /**
     * @cfg {Boolean} [queryCaching=true]
     * When true, this prevents the list from re-querying (either locally or remotely) when the current query
     * is the same as the previous query.
     */
    queryCaching: true,

    /**
     * @cfg {Number} queryDelay
     * The length of time in milliseconds to delay between the start of typing and sending the query to filter the
     * dropdown list.
     *
     * Defaults to `500` if `{@link #queryMode} = 'remote'` or `10` if `{@link #queryMode} = 'local'`
     */

    /**
     * @cfg {Number} minChars
     * The minimum number of characters the user must type before autocomplete and {@link #typeAhead} activate.
     *
     * Defaults to `0`
     */
    minChars: 0,
    /**
     * @cfg {Object} defaultListConfig
     * Set of options that will be used as defaults for the user-configured {@link #listConfig} object.
     */
    defaultListConfig: {
        minHeight: 70,
        minWidth: 70
    },
    /**
     * @cfg {Boolean} caseSensitive
     * True to make the regex case sensitive (adds 'i' switch to regex).
     */
    caseSensitive: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    constructor: function (config) {
        this.mixins.bindable.constructor.call(this, config);
        this.initConfig(config);
        return this.callParent(arguments);
    },
    initComponent: function () {
        var me = this,
            isDefined = Ext.isDefined,
            store = me.store,
            isLocalMode,
            textCfg,
            matchListCfg;

//        me.bindStore(store || 'ext-empty-store', true);
//        store = me.store;
//        if (store.autoCreated) {
//            me.queryMode = 'local';
//            me.valueField = me.displayField = 'field1';
//            if (!store.expanded) {
//                me.displayField = 'field2';
//            }
//        }

        if (!isDefined(me.valueField)) {
            me.valueField = me.displayField;
        }

        isLocalMode = me.queryMode === 'local';
        if (!isDefined(me.queryDelay)) {
            me.queryDelay = isLocalMode ? 10 : 500;
        }

        if (!me.displayTpl) {
            me.displayTpl = '{[values["' + me.displayField + '"]]}';
        }

        me.callParent(arguments);

        // configure text field emptyText
        textCfg = {
            xtype: 'searchfield',
            itemId: 'searchField',
            minWidth: 70,
            enableKeyEvents: true,
            emptyText: me.emptyText,
            triggerDisabled: me.triggerDisabled
        };
        me.add(textCfg);

        // configure grid for displaying matches
        matchListCfg = Ext.apply({
            xtype: 'grid',
            itemId: 'searchMatchList',
            flex: 1,
            hideHeaders: true,
            rowLines: true,
            selModel: {
                pruneRemoved: false
            },
            viewConfig: {
                overflowY: 'scroll',
                plugins: {
                    ptype: 'gridviewdragdrop'
                },
                stripeRows: false
            },
            plugins: 'bufferedrenderer',
            emptyText: 'No matching items found.',
            columns: [
                { xtype: 'templatecolumn', text: 'Items', flex: 1, sortable: true, hideable: false, menuDisabled: true}
            ]
        }, me.listConfig, me.defaultListConfig);
        matchListCfg.store = store;
        matchListCfg.columns[0].tpl = me.displayTpl;
        if (isDefined(me.dragGroup)) {
            matchListCfg.viewConfig.plugins.dragGroup = me.dragGroup;
        }
        me.add(matchListCfg);

        me.addEvents(
            /**
             * @event beforedeselect
             * Fires before the deselected item is removed from the collection
             * @param {gov.va.hmp.ux.SearchableList} cmp This SearchableList
             * @param {Ext.data.Record} record The deselected record
             * @param {Number} index The index of the deselected record
             */
            'beforedeselect',
            /**
             * @event beforequery
             * Fires before all queries are processed. Return false to cancel the query or set the queryEvent's cancel
             * property to true.
             *
             * @param {Object} queryEvent An object that has these properties:
             *
             *   - `cmp` : SearchableList
             *
             *     This SearchableList
             *
             *   - `query` : String
             *
             *     The query string
             *
             *   - `forceAll` : Boolean
             *
             *     True to force "all" query
             *
             *   - `cancel` : Boolean
             *
             *     Set to true to cancel the query
             */
            'beforequery',
            /**
             * @event beforeselect
             * Fires before the selected item is added to the collection
             * @param {gov.va.hmp.ux.SearchableList} cmp This SearchableList
             * @param {Ext.data.Record} record The selected record
             * @param {Number} index The index of the selected record
             */
            'beforeselect',
            'deselect',
            'select',
            /**
             * @event selectionchange
             * Fires when at least one list item is selected.
             * @param {gov.va.hmp.ux.SearchableList} cmp This SearchableList
             * @param {Array} selected The selected records
             */
            'selectionchange');

       me.doQueryTask = new Ext.util.DelayedTask(me.doRawQuery, me);
    },
    initEvents: function () {
        var me = this;

        me.callParent(arguments);

        var textfield = me.down('#searchField');
        me.mon(textfield, 'keyup', me.onKeyUp, me);
        me.mon(textfield, 'change', me.onChange, me);

        var matchList = me.down('#searchMatchList');
        me.mon(matchList, {
            beforedeselect: me.onBeforeDeselect,
            beforeselect: me.onBeforeSelect,
            deselect: me.onDeselect,
            select: me.onSelect,
            selectionchange: me.onListSelectionChange,
            scope: me
        });
    },
    onDestroy: function () {
        this.bindStore(null);
        this.callParent();
    },
    beforeReset: function () {
        this.callParent();
        this.clearFilter();
    },
    /**
     * @private
     */
    onUnbindStore: function (store) {
        var matchList = this.down('#searchMatchList');
        if (!store && matchList) {
            matchList.bindStore(null);
        }
        this.clearFilter();
    },
    /**
     * @private
     */
    onBindStore: function (store, initial) {
        var matchList = this.down('#searchMatchList');
        if (!initial) {
            this.resetToDefault();
        }
        if (matchList) {
            matchList.bindStore(store);
            }
    },
    getStore: function () {
        return this.down('#searchMatchList').getStore();
    },
    /**
     * @private
     * store the last key and doQuery if relevant
     */
    onKeyUp: function (textfield, e) {
        var me = this,
            key = e.getKey();

        if (!me.disabled) {
            me.lastKey = key;
            // we put this in a task so that we can cancel it if a user is
            // in and out before the queryDelay elapses

            // perform query w/ any normal key or backspace or delete
            if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
                me.doQueryTask.delay(me.queryDelay);
            }
        }
    },
    /**
     * @private
     */
    onChange: function (textfield, newValue, oldValue, e) {
        if (oldValue && !newValue) {
            this.doRawQuery();
        }
    },
    /**
     * @private
     * Execute the query with the raw contents within the textfield.
     */
    doRawQuery: function () {
        this.doQuery(this.getRawValue(), false, true);
    },

    /**
     * Executes a query to filter the dropdown list. Fires the {@link #beforequery} event prior to performing the query
     * allowing the query action to be canceled if needed.
     *
     * @param {String} queryString The SQL query to execute
     * @param {Boolean} [forceAll=false] `true` to force the query to execute even if there are currently fewer characters in
     * the field than the minimum specified by the `{@link #minChars}` config option. It also clears any filter
     * previously saved in the current store.
     * @param {Boolean} [rawQuery=false] Pass as true if the raw typed value is being used as the query string. This causes the
     * resulting store load to leave the raw value undisturbed.
     * @return {Boolean} true if the query was permitted to run, false if it was cancelled by a {@link #beforequery}
     * handler.
     */
    doQuery: function (queryString, forceAll, rawQuery) {
        queryString = queryString || '';

        // store in object and pass by reference in 'beforequery'
        // so that client code can modify values.
        var me = this,
            qe = {
                query: queryString,
                forceAll: forceAll,
                combo: me,
                cancel: false
            },
            store = me.getStore(),
            isLocalMode = me.queryMode === 'local',
            needsRefresh;

        if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
            return false;
        }

        // get back out possibly modified values
        queryString = qe.query;
        forceAll = qe.forceAll;

        // query permitted to run
        if (forceAll || (queryString.length >= me.minChars)) {
            // make sure they aren't querying the same thing
            if (!me.queryCaching || me.lastQuery !== queryString) {
                me.lastQuery = queryString;

                if (isLocalMode) {
                    // forceAll means no filtering - show whole dataset.
                    store.suspendEvents();
                    needsRefresh = me.clearFilter();
                    if (queryString || !forceAll) {
                        me.activeFilter = new Ext.util.Filter({
                            root: 'data',
                            property: me.displayField,
                            value: me.enableRegEx ? new RegExp(queryString) : queryString
                        });
                        store.filter(me.activeFilter);
                        needsRefresh = true;
                    } else {
                        delete me.activeFilter;
                    }
                    store.resumeEvents();
                    if (me.rendered && needsRefresh) {
                        me.down('#searchMatchList').getView().refresh();
                    }
                } else {
                    // Set flag for onLoad handling to know how the Store was loaded
                    me.rawQuery = rawQuery;

                    store.getProxy().extraParams = me.getParams(queryString);

                    // In queryMode: 'remote', we assume Store filters are added by the developer as remote filters,
                    // and these are automatically passed as params with every load call, so we do *not* call clearFilter.
                    store.load();
                }
            }

            if (isLocalMode) {
                me.doAutoSelect();
            }
            if (me.typeAhead) {
                me.doTypeAhead();
            }
        } else {
            store.getProxy().extraParams = {};
        }
        return true;
    },
    /**
     * Clears any previous filters applied by the searchable list to the store
     * @private
     * @return {Boolean} True if a filter was removed
     */
    clearFilter: function () {
        var store = this.getStore(),
            filter = this.activeFilter,
            filters = store.filters,
            remaining;

        if (filter) {
            if (filters.getCount() > 1) {
                // More than 1 existing filter
                filters.remove(filter);
                remaining = filters.getRange();
            }
            store.clearFilter(true);
            if (remaining) {
                store.filter(remaining);
            }
        }
        return !!filter;
    },
    // private
    getParams: function (queryString) {
        var params = {},
            param = this.queryParam;

        if (param) {
            params[param] = queryString;
        }
        return params;
    },
    /**
     * @private
     * If the autoSelect config is true, highlights the first item.
     */
    doAutoSelect: function () {
        var me = this,
            matchList = me.down('#searchMatchList'),
            lastSelected, itemNode;
        if (matchList && me.autoSelect && me.getStore().getCount() > 0) {
            // Highlight the last selected item and scroll it into view
            lastSelected = matchList.getSelectionModel().lastSelected;
            itemNode = matchList.getView().getNode(lastSelected || 0);
            if (itemNode) {
                matchList.getView().highlightItem(itemNode);
                matchList.getView().focusRow(itemNode);
//                matchList.listEl.scrollChildIntoView(itemNode, false);
            }
        }
    },
    reset:function() {
        var field = this.down('#searchField');
        return field.reset();
    },
    getSelectionModel: function () {
        return this.down('#searchMatchList').getSelectionModel();
    },
    getRawValue: function () {
        var field = this.down('#searchField');
        return field.getRawValue();
    },
    setEmptyText: function (emptyText) {
        var field = this.down('#searchField');
        field.emptyText = emptyText;
        this.emptyText = emptyText;
        field.reset();
    },
    setListEmptyText: function (emptyText) {
        var matchList = this.down('#searchMatchList');
        matchList.getView().emptyText = '<div class="x-grid-empty">' + emptyText + '</div>';
    },
    deselectAll: function (suppressEvent) {
        var me = this,
            matchList = me.down('#searchMatchList');
        matchList.getSelectionModel().deselectAll(suppressEvent);
    },
    getView:function(){
       return this.down('#searchMatchList').getView();
    },
    // TODO: might be able to handle these with relayEvents
    onBeforeDeselect: function (list, record, index) {
        return this.fireEvent('beforedeselect', this, record, index);
    },
    onDeselect: function (list, record, index) {
        return this.fireEvent('deselect', this, record, index);
    },
    onBeforeSelect: function (list, record, index) {
        return this.fireEvent('beforeselect', this, record, index);
    },
    onSelect: function (list, record, index) {
        return this.fireEvent('select', this, record, index);
    },
    onListSelectionChange: function (list, selectedRecords) {
        var me = this,
            hasRecords = selectedRecords.length > 0;
        if (hasRecords) {
            me.fireEvent('selectionchange', me, selectedRecords);
        }
    }
});