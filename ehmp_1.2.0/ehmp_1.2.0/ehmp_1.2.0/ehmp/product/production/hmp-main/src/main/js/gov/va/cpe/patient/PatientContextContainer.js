/**
 * Panel that displays a 'No Patient Selected' message when that is the case, a PatientBar and the content specified in
 * the items config when a patient is selected and patient checks when those need to be confirmed.
 */
Ext.define('gov.va.cpe.patient.PatientContextContainer', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.patient.PatientBar',
        'gov.va.cpe.patient.PatientChangingPanel',
        'gov.va.cpe.patient.PatientSyncStatusPanel',
        'gov.va.cpe.patient.PatientChecksPanel'
    ],
    uses: [
        'gov.va.hmp.PatientContext'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    alias: 'widget.ptcontextcontainer',
    // @private
    initComponent: function () {
        var me = this;
        var contentConfig = Ext.apply(
            {
                xtype: 'container',
                region: 'center',
                style: {
                    borderStyle: 'solid',
                    borderWidth: '0px 1px 1px 1px',
                    borderColor: '#ddd'
                }
            },
            {
                layout: me.layout || 'fit',
                items: me.items
            }
        );
        me.layout = 'card';
        me.items = [
            {
                xtype: 'container',
                itemId: 'none',
                cls: 'hmp-context-bar-ct',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'container',
                        cls: 'hmp-pt-bar-ct',
                        layout: {
                            type: 'vbox',
                            align: 'center'
                        },
                        items: [
                            {
                                xtype: 'component',
                                autoEl: 'h4',
                                html: 'No Patient Selected'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'patientsyncstatuspanel',
                itemId: 'ptsyncstatus'
            },
            {
                xtype: 'patientcheckspanel',
                itemId: 'ptchecks'
            },
            {
                xtype: 'patientchangingpanel',
                itemId: 'ptcontextchanging'
            },
            {
                xtype: 'container',
                itemId: 'ptselected',
                layout: 'border',
                cls: 'hmp-context-bar-ct',
                items: [
                    {
                        xtype: 'ptbar',
                        region: 'north'
                    },
                    contentConfig
                ]
            }
        ];
        me.callParent(arguments);
    },
    // @private
    initEvents: function () {
        this.callParent(arguments);
        this.on('patientchanging', this.onPatientChanging, this);
        this.on('patientchange', this.onPatientChange, this);
        this.mon(this.down('#ptchecks'), 'patientchecksconfirmed', this.onPatientChecksConfirmed, this);
    },
    // @private
    onBoxReady: function () {
        this.callParent(arguments);
        this.initPatientContext();
    },
    // @private
    onPatientChanging: function (cmp, pid) {
        this.getLayout().setActiveItem('ptcontextchanging');
        return true;
    },
    // @private
    onPatientChange: function (pid) {
        this.pid = pid;
        if (!this.pid || this.pid == null) {
            this.getLayout().setActiveItem('none');
        } else {
            if (this.syncIncomplete(gov.va.hmp.PatientContext.syncStatus)) {
                this.getLayout().setActiveItem('ptsyncstatus');
            } else if (gov.va.hmp.PatientContext.hasPatientChecks()) {
                this.getLayout().setActiveItem('ptchecks');
            } else {
                this.getLayout().setActiveItem('ptselected');
            }
        }
    },
    syncIncomplete: function(syncStatus) {
        if(syncStatus==null) {
            return true;
        }
        for(var key in syncStatus.syncStatusByVistaSystemId) {
            var vistaStat = syncStatus.syncStatusByVistaSystemId[key];
            if(vistaStat.syncComplete==false) {
                return true;
            }
        }
        return false;
    },
    // @private
    onPatientChecksConfirmed: function (cmp) {
        this.getLayout().setActiveItem('ptselected');
    },
    showConfirm: function(pt) {
        this.down('#ptselectconfirm').setPatient(pt);
        this.down('#ptcontextchanging').setPatient(pt);
        this.getLayout().setActiveItem('ptselectconfirm');
    }
});