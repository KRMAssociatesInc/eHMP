Ext.define('gov.va.cpe.patient.PatientChecksPanel', {
    extend: 'gov.va.cpe.patient.TransitoryPatientContextContainer',
    uses: [
        'gov.va.hmp.PatientContext'
    ],
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    alias: 'widget.patientcheckspanel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'component',
            minWidth: 600,
            itemId: 'deceased',
            autoEl: 'pre'
        },
        {
            xtype: 'component',
            minWidth: 600,
            itemId: 'security',
            autoEl: 'pre'
        },
        {
            minWidth: 600,
            itemId: 'prf',
            xtype: 'dataview',
            tpl: '<tpl for=".">' +
                '<div class="hmp-patient-record-flag">' +
                '<h2>{name}<span style="margin-left: 10px" class="label <tpl if=\'category == \"I (NATIONAL)\"\'>label-danger<tpl else>label-warning</tpl>">Category {category}</span></h2>' +
                '<p class="lead">{text}</p>' +
                '<table class="hmp-labeled-values" style="margin-top: 1em">' +
                '<tr><td>Initial Assigned Date</td><td>{[PointInTime.format(values.assignTS)]}</td><td>Assignment Status</td><td>{assignmentStatus}</td></tr>' +
                '<tr><td>Approved by</td><td>{approved}</td><td>Owner Site</td><td>{ownerSite}</td></tr>' +
                '<tr><td>Next Review Date</td><td>{[PointInTime.format(values.nextReviewDT)]}</td><td>Originating Site</td><td>{originatingSite}</td></tr>' +
                '</table>' +
                '</div>' +
                '</tpl>',
            itemSelector: 'div.hmp-patient-record-flag',
            store: {
                fields: ['name', 'category', 'assignmentStatus', 'text', 'assignTS', 'approved', 'nextReviewDT', 'originatingSite', 'ownerSite'],
                groupField: 'category',
                proxy: {
                    type: 'memory'
                }
            }
        },
        {
            minWidth: 600,
            xtype: 'component',
            itemId: 'similar',
            autoEl: 'pre'
        },
        {
            xtype: 'button',
            ui: 'primary',
            scale: 'large',
            text: 'Confirm',
            margin: '10 0 0 0',
            handler: function (btn) {
                var cmp = btn.up('patientcheckspanel');
                cmp.fireEvent('patientchecksconfirmed', cmp);
            }
        }
    ],
    initComponent: function () {
        this.callParent(arguments);

        this.addEvents('patientchecksconfirmed');
    },
    initEvents: function () {
        this.callParent(arguments);

        this.mon(this, 'patientchange', this.onPatientChange, this);
    },
    onPatientChange:function (pid) {
        this.pid = pid;
        if (!this.pid || pid == 0) return;

        if (gov.va.hmp.PatientContext.hasPatientChecks()) {
            this.load(gov.va.hmp.PatientContext.patientCheckData);
        }
    },
    load: function (data) {
        var me = this;

        // reset the var state
        me.continuePatientLoading = true;
        me.mayAccess = true;
        me.logAccess = false;
        me.isSecurePatient = false;

        me.setPatient(gov.va.hmp.PatientContext.getPatientInfo());

        var dp = me.down('#deceased');
        dp.setVisible(data.deceased);
        if (data.deceased) {
            dp.update(data.deceased.text);
        }

        var snst = me.down('#security');
        me.isSecurePatient = data.sensitive;
        if (data.sensitive) {
            snst.update(data.sensitive.text.trim());
            me.mayAccess = data.sensitive.mayAccess;
            if (!me.mayAccess) {
                snst.update('This patient record may not be accessed.');
            }
            me.logAccess = data.sensitive.logAccess;
        }
        snst.setVisible(data.sensitive);

        var ptrecordflags = me.down('#prf');
        ptrecordflags.store.removeAll();
        if (data.patientRecordFlags) {
            ptrecordflags.store.loadData(data.patientRecordFlags);
        }
        ptrecordflags.setVisible(data.patientRecordFlags);

        var smlr = me.down('#similar');
        if (data.similar) {
            smlr.update(data.similar.text);
        }
        smlr.setVisible(data.similar);
    }
});