/**
 * Controls TeamPositionPanel.
 */
Ext.define('gov.va.hmp.team.TeamPositionController', {
    extend:'gov.va.hmp.Controller',
    requires:[
        'gov.va.hmp.team.TeamPositionPanel'
    ],
    refs:[
        {
            ref:'nameField',
            selector:'#positionNameField'
        },
        {
            ref:'positionList',
            selector:'#positionList'
        },
        {
            ref:'positionForm',
            selector:'#positionEdit'
        }
    ],
    init:function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;
        me.control({
            '#positionList':{
                select:me.onSelect
            },
            '#positionList actioncolumn':{
                click:me.onAction
            },
            '#createPositionButton':{
                click:me.onNew
            },
            '#deletePositionButton':{
                click:me.onClickDelete
            },
            '#savePositionButton':{
                click:me.onSave
            },
            '#positionNameField':{
                blur:me.onNameBlur
            }
        });
    },
    onSelect:function (grid, record, index) {
//        console.log("select()");
        var formpanel = this.getPositionForm();
        var form = formpanel.getForm();
        form.loadRecord(record);
        formpanel.setTitle(record.get('name'));
    },
    onNameBlur:function (field) {
        var formpanel = this.getPositionForm();
        var form = formpanel.getForm();
        if (!form.isDirty()) return;
        form.updateRecord();
        formpanel.setTitle(form.getRecord().get('name'));
    },
    onNew:function () {
//        console.log("new position please!");
        var newPosition = Ext.create('gov.va.hmp.team.TeamPosition', {
            name:"New Position"
        });
        var positionStore = Ext.getStore('teamPositions');
        positionStore.add(newPosition);
        this.getPositionList().getSelectionModel().select(newPosition);
        this.getNameField().focus(true, 40);
    },
    onClickDelete:function() {
        this.removePosition(this.getPositionForm().getForm().getRecord());
    },
    onAction:function(view,cell,row,col,e) {
        var position = this.getPositionList().getStore().getAt(row);
        this.removePosition(position);
    },
    removePosition:function(position) {
        var me = this;
        var form = me.getPositionForm().getForm();
        var positionName = position.get('name');
        Ext.Msg.show({
            title: "Remove '" + positionName + "'",
            icon: Ext.Msg.QUESTION,
            msg: "Are you sure you want to remove position '" + positionName + "'?",
            buttons: Ext.Msg.YESNO,
            callback: me.onConfirmRemove,
            scope: me,
            position: position
        });
    },
    onConfirmRemove:function(btn, value, opts) {
        if (btn != "yes") return;
        this.doRemovePosition(opts.position);
    },
    doRemovePosition:function (position) {
        var me = this;
        var positionStore = Ext.getStore('teamPositions');
        positionStore.remove(position);
        var uid = position.getId();
        if (!uid) return; // no need to delete - it hasn't been saved yet.
        Ext.Ajax.request({
            url: '/teamMgmt/v1/position/' + uid,
            method: 'DELETE',
            jsonData: position.getData(),
            success: function(response, opts) {
                me.getPositionForm().setTitle('&nbsp;');
                me.getPositionForm().getForm().reset(true);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
//        this.down('grid').getSelectionModel()
    },
    onSave:function () {
        var me = this;
        var form = me.getPositionForm().getForm();
        var positionStore = Ext.getStore('teamPositions');
        form.updateRecord();
        var position = form.getRecord();
        if (!position) return;
        var uid = position.getId();
        Ext.Ajax.request({
            url: uid ? '/teamMgmt/v1/position/' + uid : '/teamMgmt/v1/position/new',
            method: 'POST',
            jsonData: position.getData(),
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
                if (!uid) position.set('uid', json.data.uid);
                position.commit();
                positionStore.sort();
                me.getPositionList().getView().focusRow(position);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }
});