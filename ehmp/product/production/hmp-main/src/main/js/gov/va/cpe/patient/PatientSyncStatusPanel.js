Ext.define('gov.va.cpe.patient.PatientSyncStatusPanel', {
    extend: 'gov.va.cpe.patient.TransitoryPatientContextContainer',
    uses: [
        'gov.va.hmp.PatientContext'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    alias: 'widget.patientsyncstatuspanel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'component',
            itemId: 'syncInfo',
            minWidth: 480,
            tpl: '<div class="alert alert-info"><h4>Synchronizing Patient Data</h4></div>'
        },
        {
            xtype: 'container',
            itemId: 'patientSyncStat',
            layout: {
                type: 'vbox',
                align: 'center'
            }
        }
    ],
    initEvents: function () {
        this.callParent(arguments);
        this.mon(this, 'patientchange', this.onPatientChange, this);
        gov.va.hmp.EventBus.on('syncStatusChange', this.onSyncStatusChange, this);
    },
    onPatientChange: function (pid) {
        this.pid = pid;
        if (!this.pid || pid == 0) return;
        var cmp = this.down('#patientSyncStat');
        if (cmp) {
            cmp.removeAll();
        }
        if (gov.va.hmp.PatientContext.hasSyncStatus()) {
            this.load(gov.va.hmp.PatientContext.syncStatus);
            this.refreshSyncStatus(gov.va.hmp.PatientContext.syncStatus);
        }
    },
    syncComplete: function(syncStatus) {
        for(var key in syncStatus.syncStatusByVistaSystemId) {
            var vistaStat = syncStatus.syncStatusByVistaSystemId[key];
            if(vistaStat.syncComplete==false) {
                return false;
            }
        }
        return true;
    },
    refreshSyncStatus: function(syncStatus) {
        if (this.pid == syncStatus.pid) {
            var vistaId = gov.va.hmp.UserContext.userInfo.vistaId;
            if (this.syncComplete(syncStatus)) {
                var ccont = this.up('ptcontextcontainer');
                if (ccont.pid == this.pid) {
//                this.down('#syncPleaseWait').setLoading(false);
                    gov.va.hmp.PatientContext.syncStatus = syncStatus;
                    ccont.onPatientChange(this.pid);
                }
            } else if (!Ext.Object.isEmpty(syncStatus.syncStatusByVistaSystemId[vistaId].domainExpectedTotals)) {
                // update status panel
                // TODO: Refactor to show overall summary for each vista ID.
                var cmp = this.down('#patientSyncStat');
                var queueCmp = cmp.down('component');
                if(queueCmp) {cmp.remove(queueCmp);}
                var completeCount = 0;
                var completedCmp = cmp.down('#completedCount');
                if(!completedCmp) {
                    completedCmp = cmp.add({
                        id: 'completedCount',
                        xtype: 'component',
                        tpl: new Ext.XTemplate('<tpl><span>Completed {completeCount} domains for patient</span></tpl>')
                    });
                }
                var stat = syncStatus.syncStatusByVistaSystemId[vistaId];
                for (var key in stat.domainExpectedTotals) {
                    var dtot = stat.domainExpectedTotals[key];
                    if (dtot) {
                        var dval = dtot.count / dtot.total;
                        var statcmp = cmp.down('#' + key);
                        if(dval===1) {
                            completeCount++;
                            if(statcmp) {
                                cmp.remove(statcmp);
                            }
                        } else if (!statcmp) {
                            statcmp = cmp.add({
                                xtype: 'progressbar',
                                itemId: key,
                                value: dval,
                                width: 480,
                                text: 'Loading ' + key + ' data',
                                margin: '6 0 0 0'
                            });
                        } else {
                            statcmp.updateProgress(dval);
                        }
                    }
                }
                completedCmp.update({completeCount: completeCount});

            } else if (syncStatus.syncStatusByVistaSystemId[vistaId].queuePosition || syncStatus.syncStatusByVistaSystemId[vistaId].processingPosition) {
                var stat = syncStatus.syncStatusByVistaSystemId[vistaId];
                var cmp = this.down('#patientSyncStat');
                var queueCmp = cmp.down('component');
                if(!queueCmp) {
                    queueCmp = cmp.add({
                        xtype: 'component',
                        tpl: new Ext.XTemplate('<tpl if="processingPosition"><span>This patient\'s data is now being extracted</span>' +
                            '<tpl else><span>This patient is queued for data extract, in position {queuePosition}</span></tpl>')
                    });
                }
                queueCmp.update(stat);
            }
        }
    },
    onSyncStatusChange: function (syncStat) {
        if(!this.isVisible()) {
            return;
        }
        var syncStatus = syncStat.syncStatus;
        this.refreshSyncStatus(syncStatus);
    },
    load: function (data) {
        var me = this;

        // reset the var state
        me.continuePatientLoading = true;

        me.setPatient(gov.va.hmp.PatientContext.getPatientInfo());

        var stat = this.down('#syncInfo');
        stat.update(gov.va.hmp.PatientContext.getPatientInfo());
    }
});