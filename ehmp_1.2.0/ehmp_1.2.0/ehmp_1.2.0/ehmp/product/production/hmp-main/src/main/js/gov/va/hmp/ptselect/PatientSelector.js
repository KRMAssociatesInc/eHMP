/**
 * Anchored popup that contains a {@link gov.va.hmp.ptselect.PatientPicker}
 */
Ext.define('gov.va.hmp.ptselect.PatientSelector', {
    extend: 'gov.va.hmp.ux.PopUpButton',
    requires: [
        "gov.va.hmp.ptselect.PatientPicker"
    ],
    alias: "widget.patientselector",
    text: 'Select Patient',
    popUp: {
        xtype: 'patientpicker',
        itemId: 'picker',
        ignorePatientChangeEvents: true,
        width: 300,
        height: 360
    },
    initComponent: function () {
        this.callParent(arguments);
//        this.relayEvents(this.menu.getComponent(0), ['select','beforeselect','beforedeselect']);
        this.addEvents(
            /**
             * @event select
             * Fires when at least one list item is selected.
             * @param {gov.va.hmp.ptselect.PatientSelector} combo This SearchableList
             * @param {Object} record The selected patient
             */
            'select'
        );
    },
    initEvents:function () {
        this.callParent(arguments);
        this.mon(this.menu.getComponent(0), 'selectionchange', this.onSelectionChange, this);
    },
    onSelectionChange: function (picker, records) {
        if (records && records.length > 0) {
            this.fireEvent("select", this, records[0]);
        }
        var picker = this.menu.getComponent(0);
        picker.deselectAll(true);
        this.hideMenu();
    },
    onMenuShow: function () {
        var ptSearchField = this.menu.down('#patientSearch searchfield');

        this.callParent(arguments);

        if (!ptSearchField.hasFocus) {
            ptSearchField.focus(false, 100);
        }
    }
});
