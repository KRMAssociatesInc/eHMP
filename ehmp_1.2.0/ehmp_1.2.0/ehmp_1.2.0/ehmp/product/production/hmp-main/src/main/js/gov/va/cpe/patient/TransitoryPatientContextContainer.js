/**
 * Base class for panels that display some info while PatientContext is in transition (i.e. 'transitory), like patient
 * checks or patient data sync status.
 *
 * @abstract
 */
Ext.define('gov.va.cpe.patient.TransitoryPatientContextContainer', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.patient.TransitoryPatientBar'
    ],
    minWidth: 600,
    cls: 'hmp-context-bar-ct',
    initComponent: function () {
        // use existing items and layout config nested
        var bodyCt = Ext.apply({
            xtype: 'container',
            region: 'center',
            cls: 'hmp-context-bar-body',
            overflowY: 'auto'
        }, {
            layout: this.layout,
            items: this.items
        });
        this.items = [
            {
                xtype: 'transitorypatientbar',
                region: 'north'
            },
            bodyCt
        ];
        this.layout = 'border';

        this.callParent(arguments);
    },
    /**
     * Updates the patient currently being displayed by this panel
     *
     * @param {Object} pt
     */
    setPatient:function(pt) {
       this.down('transitorypatientbar').update(pt);
    }
});