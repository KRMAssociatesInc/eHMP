/**
 * Provides a tag input field with a tag picker dropdown.
 *
 * This field recognizes and uses a JavaScript Array object as its main {@link #value} type.
 */
Ext.define('gov.va.hmp.ux.TagField', {
	extend: 'Ext.form.field.Picker',
	requires: [
        'gov.va.hmp.ux.TagPicker'
    ],
    alias: 'widget.tagfield',
    /**
     * @cfg {String} idField Name of the property within a tag object that contains a tag identifier value.
     */
    idField: 'id',
    /**
     * @cfg {String} displayField Name of the property within a tag object that contains a tag display value.
     */
    displayField: 'name',
    /**
     * @cfg {Number} queryDelay
     * The length of time in milliseconds to delay between the start of typing and sending the query to filter the
     * dropdown list.
     *
     * Defaults to `10`
     */
    /**
     * @cfg {Number} minChars
     * The minimum number of characters the user must type before autocomplete and {@link #typeAhead} activate.
     *
     * Defaults to `0`
     */
    /**
     * @property {String} lastQuery
     * The value of the match string used to filter the store. Delete this property to force a requery. Example use:
     *
     * To make sure the filter in the store is not cleared the first time the tagfield trigger is used configure the
     * field with `lastQuery=''`. Example use:
     *
     *     var field = Ext.create('gov.va.hmp.ux.TagField',{
     *         ...
     *         lastQuery: ''
     *     });
     */
    /**
     * @cfg {Object} pickerConfig
     * A config object that will be applied to the fields's picker component. Any of the config options available for
     * {@link gov.va.hmp.ux.TagPicker} can be specified here.
     */
    // private
    pickerAlign: 'tl-bl?',
    // private
    pickerOffset:[0, 2],
    // private
    childEls: [
    /**
     * @property {Ext.Element} tagsWrapCell
     * A reference to the `TD` element wrapping the tag elements. Only set after the field has been rendered.
     */
        'tagsWrapCell'
    ],
    // private
    componentLayout: 'tagfield',

    initComponent:function () {
        var me = this;
        me.addEvents(
            /**
             * @event tagadd
             * Fired when a tag object has been added to the array value of this field.
             * @param {gov.va.hmp.ux.TagField} store The field
             * @param {Object} tag The tag object that was added
             */
            'tagadd',

            /**
             * @event tagremove
             * Fired when a tag object has been removed from the array value of this field.
             *
             * @param {gov.va.hmp.ux.TagField} field The field
             * @param {Object} record The tag object that was removed
             */
            'tagremove',
            /**
             * @event beforequery
             * Fires before all queries are processed. Return false to cancel the query or set the queryEvent's cancel
             * property to true.
             *
             * @param {Object} queryEvent An object that has these properties:
             *
             *   - `field` : gov.va.hmp.ux.TagField
             *
             *     This tag field
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
            'beforequery'
        );
        if (!Ext.isDefined(me.queryDelay)) {
            me.queryDelay = 10;
        }
        if (!Ext.isDefined(me.minChars)) {
            me.minChars = 0;
        }
        me.pickerConfig = me.pickerConfig || {};
        me.callParent(arguments);
        me.doQueryTask = new Ext.util.DelayedTask(me.doRawQuery, me);
    },
    initEvents:function() {
        var me = this;
        me.callParent(arguments);
        /*
         * Setup keyboard handling. If enableKeyEvents is true, we already have
         * a listener on the inputEl for keyup, so don't create a second.
         */
        if (!me.enableKeyEvents) {
            me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
        }
        me.mon(me.inputEl, 'paste', me.onPaste, me);
//        me.mon(me, 'keydown', me.keyDownHandler, me);
//        me.mon(me, 'keyup', me.keyUpHandler, me);
    },
    onRender: function() {
        var me = this;
        me.callParent(arguments);
        me.tagsWrapCell.unselectable();
    },
    afterRender:function() {
        var me = this;
        me.callParent(arguments);
        me.refreshTags();
        me.tagsWrapCell.on('click', me.onTagsWrapCellClick, me);
    },

    /**
     * Returns the store associated with this field.
     * @return {Ext.data.Store} The store
     */
    getStore : function(){
        return this.store;
    },

    beforeBlur: function() {
        this.doQueryTask.cancel();
    },
    createPicker: function() {
        var me = this;
        return Ext.create('gov.va.hmp.ux.TagPicker', Ext.apply({}, me.pickerConfig, {
            pickerField: me,
            ownerCt: me.ownerCt,
            floating: true,
            focusOnToFront: false,
            store: me.store,
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        }));
    },
    /**
     * Performs the alignment on the picker using the class defaults
     * @private
     */
    doAlign: function(){
        var me = this,
            picker = me.picker,
            aboveSfx = '-above',
            isAbove;

        var alignToEl = me.bodyEl;
        me.picker.alignTo(alignToEl, me.pickerAlign, me.pickerOffset);
        // add the {openCls}-above class if the picker was aligned above
        // the field due to hitting the bottom of the viewport
        isAbove = picker.el.getY() < alignToEl.getY();
        me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
        picker[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
    },
    getSubTplMarkup: function() {
        var me = this,
        field = Ext.form.field.Trigger.superclass.getSubTplMarkup.call(me, arguments);
        return '<table id="' + me.id + '-triggerWrap" class="' + Ext.baseCSSPrefix + 'form-trigger-wrap" cellpadding="0" cellspacing="0"><tbody><tr>' +
            '<td id="' + me.id + '-tagsWrapCell" class="hmp-tags-wrap-cell">' + me.getTagsMarkup() + '</td>' +
            '<td id="' + me.id + '-inputCell" class="' + Ext.baseCSSPrefix + 'form-trigger-input-cell">' +
            field +
            '</td>' +
            me.getTriggerMarkup() +
            '</tr></tbody></table>';
    },
    tagsTpl:'<tpl for="tags"><span class="hmp-tag label label-info">{[values[parent.displayField]]}<span class="tag-remove" data-id="{[values[parent.idField]]}" data-dismiss="alert">&times;</span></span></tpl>',
    getTagsMarkup:function() {
        var me = this,
            tpl = me.getTpl('tagsTpl'),
            val = me.getValue();
        var result = tpl.apply({
            tags: val,
            idField: me.idField,
            displayField: me.displayField
        });
        return result;
    },
    /**
     * @private
     */
    onTagsWrapCellClick: function (event, element) {
        var me = this;
        var dismiss = element.getAttribute('data-dismiss');
        if (dismiss === 'alert') {
            var id = element.getAttribute('data-id');
            if (id) {
                var removeme = null;
                var vals = me.getValue();
                Ext.each(vals, function(item, index) {
                    if (id == item[me.idField]) {
                        removeme = item;
                        return false;
                    }
                });
                if (removeme) {
                    me.removeTag(removeme);
                }
            }
        }
    },
    // @private
	onSelect: function(picker, tag) {
		this.addTag(tag);
        this.collapse();
        this.inputEl.dom.value = '';
        this.inputEl.focus();
	},
    /**
     * @protected
     * overridden so that getting the rawValue doesn't alter the inputEl
     */
    getRawValue: function() {
        var me = this;
        return me.rawValue;
    },
    /**
     * @protected
     * overridden so that setting the rawValue doesn't alter the inputEl
     */
    setRawValue: function(value) {
        var me = this;
        value = me.transformRawValue(value);
        me.rawValue = value;
        return value;
    },
    /**
     * @protected
     * overridden so that setting the rawValue array only contains unique objects according to their {@link idField}
     */
    transformRawValue: function (value) {
        var me = this;
        if (Ext.isArray(value)) {
            var unique = [],
                ids = [],
                length = value.length,
                element = null,
                id = null;
            for (var i = 0; i < length; i++) {
                element = value[i];
                // Do something with element i.
                id = element[me.idField];
                if (Ext.isDefined(id) && !Ext.Array.contains(ids, id)) {
                    ids.push(id);
                    unique.push(element);
                }
            }
            return unique;
        } else {
            return value;
        }
    },
    /**
     * @protected
     * overriden so that there is no difference between value and rawValue
     */
    valueToRaw: function(value) {
        return value;
    },
    /**
     * Sets a data value into the field and runs the change detection and validation. To set the value directly
     * without these inspections see {@link #setRawValue}.
     * @param {Object} value The value to set
     * @return {gov.va.hmp.ux.TagField} this
     */
    setValue: function(value) {
        var me = this;
        var returnVal = me.callParent(arguments);
        me.refreshTags();
        return returnVal;
    },
    addTag:function(tag) {
        var me = this,
            val = me.getValue();
        if(!val) {
            val = [];
        }
        if (tag instanceof Ext.data.Model) {
           tag = tag.getData();
        }
		val.push(tag);
		me.setValue(val);

        me.fireEvent('tagadd', me, tag);
    },
    removeTag:function(tag) {
        var me = this,
            val = me.getValue();
        val.splice(val.indexOf(tag), 1);
        me.setValue(val);

        me.fireEvent('tagremove', me, tag);
    },
    /**
     * overridden so all values validate
     * @protected
     */
    getErrors: function(value) {
        return [];
    },
    /**
     * @private
     */
    refreshTags: function () {
        var me = this;
        if (me.tagsWrapCell) {
            var tags = me.getTagsMarkup();
            me.tagsWrapCell.update(tags);
            me.autoSize();
        }
    },
    onPaste: function(){
        var me = this;

        if (!me.readOnly && !me.disabled && me.editable) {
            me.doQueryTask.delay(me.queryDelay);
        }
    },
    // store the last key and doQuery if relevant
    onKeyUp: function(e, t) {
        var me = this,
            key = e.getKey(),
            query = me.inputEl.getValue(),
            val = me.getValue();

        if (!me.readOnly && !me.disabled && me.editable) {
            me.lastKey = key;
            // we put this in a task so that we can cancel it if a user is
            // in and out before the queryDelay elapses

            // perform query w/ any normal key or backspace or delete
            if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
                me.doQueryTask.delay(me.queryDelay);
            }
        }

        if (me.enableKeyEvents) {
            me.callParent(arguments);
        }
    },
    /**
     * @private
     * Execute the query with the raw contents within the textfield.
     */
    doRawQuery: function() {
        this.doQuery(this.inputEl.getValue(), false, true);
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
    doQuery: function(queryString, forceAll, rawQuery) {
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
            store = me.store,
            needsRefresh;

        if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
            return false;
        }

        // get back out possibly modified values
        queryString = qe.query;
        forceAll = qe.forceAll;

        // query permitted to run
        if (forceAll || (queryString.length >= me.minChars)) {

            // expand before starting query so LoadMask can position itself correctly
            me.expand();

            // make sure they aren't querying the same thing
            if (!me.queryCaching || me.lastQuery !== queryString) {
                me.lastQuery = queryString;

                // forceAll means no filtering - show whole dataset.
                store.suspendEvents();
                needsRefresh = me.clearFilter();
                if (queryString || !forceAll) {
                    me.activeFilter = new Ext.util.Filter({
                        root: 'data',
                        property: me.displayField,
                        value: new RegExp(queryString, "i")
                    });

                    store.filter(me.activeFilter);
                    needsRefresh = true;
                } else {
                    delete me.activeFilter;
                }
                store.resumeEvents();
                if (me.rendered && needsRefresh) {
                    me.picker.getSelectionModel().deselectAll();
                    me.getPicker().refresh();
                }
            }

            // Clear current selection if it does not match the current value in the field
//            if (me.getRawValue() !== me.getDisplayValue()) {
//                me.ignoreSelection++;
//                me.picker.getSelectionModel().deselectAll();
//                me.ignoreSelection--;
//            }

//            me.doAutoSelect();

//            if (me.typeAhead) {
//                me.doTypeAhead();
//            }
        }
        return true;
    },
    /**
     * Clears any previous filters applied by the combo to the store
     * @private
     * @return {Boolean} True if a filter was removed
     */
    clearFilter: function() {
        var store = this.store,
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
    // @protected
    onDestroy: function() {
        this.clearFilter();
        this.tagsWrapCell.un('click', this.onTagsWrapCellClick);
        Ext.destroyMembers(this, 'tagsWrapCell');
        this.callParent();
    }
});

/**
 * Layout class for {@link gov.va.hmp.ux.TagField} fields. Adjusts the input field size to accommodate
 * the tags and the trigger button(s).
 * @private
 */
Ext.define('gov.va.hmp.ux.TagFieldComponentLayout', {

    /* Begin Definitions */

    alias: 'layout.tagfield',

    extend: 'Ext.layout.component.field.Field',

    /* End Definitions */

    type: 'tagfield',

    beginLayout: function(ownerContext) {
        var me = this,
            owner = me.owner,
            flags;

        ownerContext.triggerWrap = ownerContext.getEl('triggerWrap');
        ownerContext.tagsWrapCell = ownerContext.getEl('tagsWrapCell');

        me.callParent(arguments);

        // if any of these important states have changed, sync them now:
        flags = owner.getTriggerStateFlags();
        if (flags != owner.lastTriggerStateFlags) {
            owner.lastTriggerStateFlags = flags;
            me.updateEditState();
        }
    },

    beginLayoutFixed: function (ownerContext, width, suffix) {
        var me = this,
            owner = ownerContext.target,
            inputWidth = '100%',
            triggerWrap = owner.triggerWrap;

        me.callParent(arguments);

        owner.inputCell.setStyle('width', '100%');
        owner.tagsWrapCell.setStyle('width', '1px');
        triggerWrap.setStyle('width', '100%');
    },

    updateEditState: function() {
        var me = this,
            owner = me.owner,
            inputEl = owner.inputEl,
            noeditCls = Ext.baseCSSPrefix + 'trigger-noedit',
            displayed,
            readOnly;

        if (me.owner.readOnly) {
            inputEl.addCls(noeditCls);
            readOnly = true;
            displayed = false;
        } else {
            if (me.owner.editable) {
                inputEl.removeCls(noeditCls);
                readOnly = false;
            } else {
                inputEl.addCls(noeditCls);
                readOnly = true;
            }
            displayed = !me.owner.hideTrigger;
        }

        owner.triggerCell.setDisplayed(displayed);
        inputEl.dom.readOnly = readOnly;
    }
});