Ext.define('gov.va.cpe.TaskWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'gov.va.cpe.TaskEditPanel'
    ],
    title: 'New Task',
    header: false,
    height: 450,
    id: 'taskWindow',
    width: 600,
    padding: 0,
    bodyPadding: 0,
    linkUid: '',
    linkSummary: '',
    layout: {
        type: 'fit'
    },
    closeAction: 'hide',
    mixins: {
        patientaware: 'gov.va.hmp.PatientAware'
    },
    items: [
        {
            xtype: 'taskeditpanel',
            bodyPadding: 6
        }
    ],
    listeners: {
        beforepatientchange: function (pid, appChange, ccowSurvey, ccowChange) {
            var me = this;
            if ((typeof me.pid != 'undefined')&&(me.pid.length>0)) {
                if ((appChange == true)||(ccowChange == true)){
                    me.destroy();
                    return true;
                } else if (ccowSurvey == true) {
                    return false
                }

            } else return true;
//            return true;
        }
    },
    onConfirm:function(btn, value, opts) {
        if (btn != 'yes') return;
        this.doRemoveBoard(opts.board);
    },
    initComponent: function() {
    	var me = this;
        this.callParent(arguments);
        
        this.on('show', this.reset, this);
        
        var win = this.down('taskeditpanel');
        win.on('canceled', function () {me.close();});
        win.on('saved', function () {me.close();});
        gov.va.hmp.EventBus.on('beforepatientselectconfirmed', this.onBeforePatientSelectionConfirmed, this);
    },
    onBeforePatientSelectionConfirmed: function(confirmCmp) {
        // remove listener before destroy to avoid multiples of same listener
        gov.va.hmp.EventBus.removeListener('beforepatientselectconfirmed', this.onBeforePatientSelectionConfirmed, this);
        this.destroy();
        return true;
    },

    onBoxReady: function () {
        var me = this;
        me.initPatientContext();
        me.callParent(arguments);
    },
    updateTaskEditPanel: function(linkUid, linkSummary) {
        var me = this;
        me.linkUid = linkUid;
        me.linkSummary = linkSummary;
        var tep = me.down('taskeditpanel');
        tep.changeLinkInfo(me.linkUid, me.linkSummary);
        tep.show();
        tep.resetClaimLabels();
        // quirk if config 'value: new Date()' flags field as dirty
        tep.down('#dueDateField').resetOriginalValue();
    },
    initPatientContext: function () {
        var me = this;
        var po = gov.va.hmp.PatientContext.getPatientInfo();
        var pid, name;
        if (me.patientRec) {
            pid = me.patientRec.get('pid');
            name = me.patientRec.get('displayName');
        } else if (po != null) {
            pid = po.pid;
            name = po.displayName;
        } else {
            Ext.Msg.alert("Error", "No patient is selected");
            me.close();
            return;
        }
        me.setTitle('New Task for ' + name);
        me.pid = pid;
    },
    reset: function() {
    	var panel = this.down('taskeditpanel');
    	panel.getForm().reset();
    	panel.getForm().isValid();
    },
    statics: {
        showTaskForPatient: function (e, pid) {
            if (!pid) pid = gov.va.hmp.PatientContext.pid;
            if (e) {
                if (e.stopPropogation) {
                    e.stopPropogation();
                } else {
                    e.cancelBubble = true;
                }
            }
            var taskWindow = Ext.getCmp('taskWindow');
            if (!taskWindow) taskWindow = Ext.create('gov.va.cpe.TaskWindow', {
                task: {
                    data: {
                        'type': 'Order'
                    }
                }
            });
            var teepee = taskWindow.down('taskeditpanel');
            teepee.pid = pid;
            taskWindow.show();
            return taskWindow;
        }
    }
});
