/**
 * @class
 * This component present the task edit form panel for user viewing and editing.
 */
Ext.define('gov.va.cpe.TaskEditPanel', {
    extend: 'Ext.form.Panel',
    requires: [
        'gov.va.cpe.viewdef.editors.PointOfCareEditor',
        'gov.va.hmp.team.PersonField',
        'gov.va.hmp.team.PersonSelector'
    ],
    alias: 'widget.taskeditpanel',
    bodyPadding: 6,
    config: {
        linkUid: '',
        linkSummary: '',
        tasksPanel: null,
        initialRec: null,
        trackResetOnLoad: true
    },
    layout: {
        type: 'anchor'
//        align: 'stretch'
    },
    defaults: {
        anchor: '100%'
    },
//    fieldDefaults: {
//        labelSeparator: ''
//    },
	dockedItems: [{
	    xtype: 'toolbar',
	    dock: 'bottom',
	    ui: 'footer',
	    defaults: {minWidth: 75},
	    items: [
            {xtype: 'checkbox', fieldLabel: 'Claim Task', name: 'claimed', itemId: 'claimed', inputValue: true, submitValue: false},
            {xtype: 'checkbox', fieldLabel: 'Done', name: "completed", itemId: 'done', inputValue: true},
	        {xtype: 'tbfill'},
            {xtype: 'button', itemId: "closeBtn", ui: 'link', text: 'Cancel'},
            {xtype: 'button', itemId: "acceptBtn", disabled: true, text: 'Save'}
	    ]
	}],
    items: [
        {
            xtype: "textfield",
            name: 'taskName',
            fieldLabel: 'Task',
            allowBlank: false,
            itemId: 'taskNameField',
            maxLength: 150,
            enforceMaxLength: true,
            hideEmptyLabel: false,
            // IE9 workaround to make sure it can be edited
            listeners: {
                afterrender: function(field) {
                    field.focus();
                }
            }
        },
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: 'Due',
                    name: 'dueDate',
                    itemId: 'dueDateField',
                    flex: 1,
                    format: 'Y-m-d',
                    submitFormat: 'Ymd',
                    altFormats: 'Ymd|m/d/Y|n/j/Y|m/d/y|n/j/y|m-d-Y|n-j-Y|m-d-y|n-j-y|Y/m/d|Y/n/j|y/m/d|y/n/j|Y-m-d|Y-n-j|y-m-d|y-n-j',
                    maskRe: /[0-9\-\/]/,
                    invalidText: '\'{0}\' is invalid. Date must contain year, month and day separated by \'/\' or \'-\'.',
                    inputAttrTpl: " data-qtip='enter in yyyy-mm-dd or mm-dd-yyyy format' ",
                    value: new Date() // default value is now
                },
                {
		            xtype: 'combobox',
		            fieldLabel: 'Type',
		            flex: 1,
		            labelWidth: 40,
		            name: 'type',
                    itemId: 'typeField',
		            allowBlank: false,
		            store: ['Administrative', 'Nursing', 'Patient Phone Call'],
		            value: 'Administrative'
		        }
	        ]
        },
        {
            xtype: 'htmleditor',
            fieldLabel: 'Description',
            name: 'description',
            itemId: 'descriptionField',
            allowBlank: false
        },
        {
            xtype: 'displayfield',
            itemId: 'regardingField',
            fieldLabel: 'Regarding',
            name: 'regarding',
            hidden: true
        },
        {   xtype: 'displayfield',
            fieldLabel: 'Claimed By',
            name: 'claimedByName',
            itemId: 'claimedByName'
        },
//        {
//            xtype: 'personfield',
//            displayField: 'displayName',
//            valueField: 'uid',
//            fieldLabel: 'Assign To'
//        },
//        {
//            xtype: 'fieldcontainer',
//            fieldLabel: 'Assign To',
//            layout: {
//                type: 'hbox',
//                align: 'stretch'
//            },
//            items: [
//                {
//                    xtype: 'personselector',
//                    text: 'Choose Person',
//                    listeners: {
//                        select: function(cmp, records) {
//                             console.log(records[0]);
//                        }
//                    }
//                }
//            ]
//        }
    ],

    isTepDirty: function() {
        var me = this;
        if (me.down('#done').getValue()) { return true; }
        if (me.down('#claimed').getValue()) { return true; }
        if (me.down('#taskNameField').isDirty()) { return true; }
        if (me.down('#dueDateField').isDirty()) { return true; }
        if (me.down('#typeField').isDirty()) { return true; }
        if (me.down('#descriptionField').isDirty()) { return true; }
       return false;
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);

        // setup events and button handlers
        me.addEvents('saved','canceled');
    },
    initEvents:function() {
        var me = this;
        me.callParent(arguments);

        me.mon(me.down('#closeBtn'), 'click', function (btn, event) {
            var cancelBtn = btn;
            if (me.isTepDirty()) {
                Ext.Msg.show({
                    title: 'Task data has changed!',
                    icon: Ext.Msg.WARNING,
                    msg: 'Are you sure want to continue without saving changes?',
                    buttons: Ext.Msg.YESNO,
                    fn: function(btn) {
                        if (btn === 'yes') {
                                me.finishCancel(me.tasksPanel, me.initialRec);
                        }
                    }
                });
            } else {
                me.finishCancel(me.tasksPanel, me.initialRec);
            }
        }, me);

        me.mon(me.down('#acceptBtn'),'click', function(btn, event) {
            var success = function() {btn.enable();};
            btn.disable();
            me.submit(success, success); // TODO: how to handle/display fail?
            me.fireEvent('saved', {btn: this});
            if (me.tasksPanel) {
                // hide tep on panel
                me.tasksPanel.hideRowBody(me.initialRec);
                me.tasksPanel.deSelectSelection();
                me.tasksPanel.selcheckFn();
            }
        }, me);

        me.mon(me.getForm(), 'validitychange', function(form, isValid) {
            var savebtn = me.down('#acceptBtn');
            if (isValid) {
                savebtn.enable();
            } else {
                savebtn.disable();
            }
        }, me);

        // dynamically show/hide user name and labels if checked while 'Claim Task' mode
        me.mon(me.down('#claimed'), 'change', function(chkBox, newValue) {
            var cbn = me.down('#claimedByName');
            if (chkBox.getFieldLabel() === 'Claim Task') {
                if (newValue) {
                    cbn.setFieldLabel("Will be claimed by");
                    cbn.setValue(gov.va.hmp.UserContext.userInfo.displayName);
                } else {
                    cbn.setFieldLabel("Not Claimed");
                    cbn.setValue('');
                }
            }
        }, me);
    },
    /**
     * @method
     * Reset TaskEditPanel with data from initial state of 'rec'.
     * Note: reinitialize is not currently used but left in place in case it is needed in the future.
    */
    reinitialize: function(rec) {
        // reset tep data to initial values and form
        var me = this;
        me.loadTask(rec.getData());
        // quirk if config 'value: new Date()' flags field as dirty
        me.down('#dueDateField').resetOriginalValue();
        me.down('#claimed').setValue(false);
        me.down('#done').setValue(false);
        me.setClaimLabelsForRec(rec);
    },
    finishCancel: function(tasksPanel, rec) {
        var me = this;
        // finish cancel and deselect process
        me.fireEvent('canceled', {btn: me.down('#closeBtn')});
        me.changeLinkInfo(null, null);
        me.tasksPanel = null;
        me.initialRec = null;
        me.hide();
        // hide and deselect on tasks grid panel
        if (tasksPanel) {
            tasksPanel.hideRowBody(rec);
            tasksPanel.deSelectSelection();
            tasksPanel.selcheckFn();
        }
    },
    onBoxReady: function () {
        this.callParent(arguments);
        this.initForm();
    },
    initForm: function () {
        var me = this;

        if (me.task) {
            me.getForm().loadRecord(me.task);
        }
    },
    
    loadTask: function(task) {
        var form = this.getForm();
        if (task.taskName) {
            task.taskName = Ext.String.htmlDecode(task.taskName);
        }
        if (task.summary) {
            task.summary = Ext.String.htmlDecode(task.summary);
        }
        if (task.description) {
            task.description = Ext.String.htmlDecode(task.description);
        }
        form.setValues(task);
    },
    /**
     * called by ViewDefGridPanel when a record is selected
     */
    bindGrid: function(grid, rec) {
        var me = this;
        me.tasksPanel = grid;
        me.initialRec = rec;
        me.down('#acceptBtn').enable();
        me.loadTask(rec.getData());

        // setup uid and regarding config data and field
        me.uid = rec.get("uid");
        if (rec.get("linkUid") && ('link' in rec.data) && rec.get("link").summary) {
            me.changeLinkInfo(rec.get("linkUid"), rec.get("link").summary);
        }
        me.setClaimLabelsForRec(rec);
        me.show();
    },
    /**
     * Derive claimed label based on task record
     * @param rec
     */
    setClaimLabelsForRec: function(rec) {
        var me = this,
            cbn = me.down('#claimedByName');
        if ( rec.get("claimedByUid") ) {
            me.down('#claimed').setFieldLabel("Un-Claim Task");
            cbn.labelSeparator = ":";
            cbn.setFieldLabel("Claimed By");
        } else {
            me.down('#claimed').setFieldLabel("Claim Task");
            cbn.labelSeparator = "";
            cbn.setFieldLabel("Not Claimed");
        }
    },
    // used to reset labels for new task
    resetClaimLabels: function() {
        this.down('#claimed').setFieldLabel("Claim Task");
        this.down('#claimedByName').setFieldLabel("Not Claimed");
    },
    
    submit: function (successFn, failureFn) {
        var me = this;
        var pid = me.pid;
        if (!pid) { pid = gov.va.hmp.PatientContext.pid; }
        
        // are we adding a new task or editing an existing one?
        var uid = me.uid;
        var url = '/vpr/chart/addTask';
        if (uid) {
            // editing
            url = '/editor/submitTaskFormValues';
        }
        
        var form = me.getForm();
        if (form.isValid()) {
            // build up the extra (non-form) values
            var vals = form.getFieldValues();
            var params = {uid: uid, patientId: pid, linkUid: me.linkUid, linkSummary: me.linkSummary};
            if (vals.claimed && vals.claimed === true) {
                // convert claimed into name/id if checked
                if (me.down('#claimed').getFieldLabel() === 'Claim Task') {
                    params.claimedByUid = gov.va.hmp.UserContext.userInfo.uid;
                    params.claimedByName = gov.va.hmp.UserContext.userInfo.displayName;
                } else {
                    params.claimedByUid = null;
                    params.claimedByName = null;
                }
            }
            form.submit({
                url: url,
                params: params,
                success: function (form, action) {
                    me.changeLinkInfo(null, null);
                    if (successFn.call()) {}
                },
                failurexx: function (form, action) {
                    console.log('failure', arguments);
                    var data = Ext.decode(action.response.responseText);
                    Ext.Msg.alert('Failed', data.error.message);
                    me.changeLinkInfo(null, null);
//                    if (failureFn.call());
                }
            });
        } else {
            if (failureFn.call()) {}
        }
    },
    // method to use when seting both linkUid and linkSummary (which has always been the case so far)
    changeLinkInfo: function(linkUid, linkSummary) {
        var me = this;
        // both must be set
        if (linkUid && linkSummary) {
            me.setLinkSummary(linkSummary);
            me.setLinkUid(linkUid);
        } else {
            me.setLinkSummary('');
            me.setLinkUid('');
        }
    },
    /**
     * - Sets 'Regarding' based on newLinkUid, this.linkSummary
     * - Important to have this.linkSummary set before this.linkUid
     * - Use of this changeLinkInfo() recommended
    */
    updateLinkUid: function(newLinkUid, oldLinkUid) {
        var me = this,
            linkSummary = me.getLinkSummary();
            regarding = me.down('#regardingField');

        if ( newLinkUid && linkSummary ) {
            regarding.setValue(linkSummary);
            regarding.show();
        } else {
            regarding.setValue('');
            regarding.hide();
        }
    }
});
