Ext.define('gov.va.hmp.team.PersonSelector', {
    extend: 'gov.va.hmp.ux.PopUpButton',
    requires: [
        'gov.va.hmp.team.PersonPicker'
    ],
    mixins: [
        'Ext.form.field.Field'
    ],
    alias: 'widget.personselector',
    ui: 'link',
    value: null,
    menu: {
        cls: 'hmp-popupbutton-menu',
        width: 300,
        height: 360,
        plain: true,
        allowOtherMenus: true,
        enableKeyNav: false,
        layout: 'fit',
        items: [{
            xtype: 'personpicker'
        }]
    },
    initComponent: function () {
        this.callParent(arguments);
        this.initField();
        this.addEvents(
            /**
             * @event select
             * Fires when at least one list item is selected.
             * @param {gov.va.hmp.ptselect.PatientSelector} combo This SearchableList
             * @param {Array} records The selected persons
             */
            'select'
        );
    },
    initEvents: function () {
        this.callParent(arguments);
        this.mon(this.menu.down('personpicker'), 'selectionchange', this.onSelectPerson, this);
    },
    onSelectPerson: function (picker, records) {
        if (records && records.length > 0) {
            this.setValue(records[0].getId());
            this.resetOriginalValue();

            this.hideMenu();
            if (this.ownerCt && this.ownerCt.editing) {
                this.ownerCt.completeEdit();
            }
        }
        this.fireEvent('select', this, records);
    },
    getValue: function () {
        return this.value;
    },
    getRawValue: function () {
        return this.value;
    },
    setValue: function (value) {
        var me = this,
            personpicker = this.menu.down('personpicker'),
            selectionModel = personpicker.getSelectionModel(),
            personStore = personpicker.getStore();
        me.value = value;
        me.checkChange();
        if (me.value) {
            var person = personStore.getById(me.value);
            if (person) {
                selectionModel.select(person, false, true);
            } else {
                selectionModel.deselectAll(true);
            }
        } else {
            selectionModel.deselectAll(true);
        }
        if (!this.hasVisibleMenu() && this.ownerCt && !this.ownerCt.editing) {
            this.showMenu();
            // TODO: scroll to selected item
        }
        return me;
    },
    // @protected
    onMenuHide: function () {
        this.callParent(arguments);
        if (this.isDirty()) {
            this.ownerCt.cancelEdit(false);
        }
    }
});