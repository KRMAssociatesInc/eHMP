// Controls TeamCategoriesPanel.

Ext.define('gov.va.hmp.setup.PointOfCareController', {
    extend:'gov.va.hmp.Controller',
    requires:[
        'gov.va.hmp.setup.PointOfCarePanel'
    ],
    refs:[
        {
            ref:'nameField',
            selector:'#pointOfCareNameField'
        },
        {
            ref:'descField',
            selector:'#pointOfCareDescriptionField'
        },
        {
            ref:'pocList',
            selector:'#pocList'
        },
        {
            ref:'pocForm',
            selector:'#pointOfCareEdit'
        }
    ],
    init:function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;
        me.control({
            '#pocList':{
                select:me.onSelect
            },
            '#pocList actioncolumn':{
                click:me.onAction
            },
            '#createPointOfCareButton':{
                click:me.onNew
            },
            '#deletePointOfCareButton':{
                click:me.onClickDelete
            },
            '#savePointOfCareButton':{
                click:me.onSave
            },
            '#pointOfCareNameField':{
                blur:me.onNameBlur
            }
        });
    },
    onSelect:function (grid, record, index) {
        var formCmp = this.getPocForm();
        formCmp.setDisabled(false);
        formCmp.setTitle(record.get('displayName'));
        var form = formCmp.getForm();
        form.loadRecord(record);
    },
    onNameBlur:function (field) {
        var form = this.getPocForm().getForm();
        if (!form.isDirty()) return;
        form.updateRecord();
    },
    onNew:function () {
//        console.log("new category please!");
        var newLocation = Ext.create('gov.va.cpe.model.PointOfCareModel', {
            name:"New Location"
        });
        var pocStore = Ext.getStore('pocStore');
        pocStore.add(newLocation);
        this.getPocList().getSelectionModel().select(newLocation);
        this.getNameField().focus(true, 40);
    },
    onAction:function(view,cell,row,col,e) {
        var poc = this.getPocList().getStore().getAt(row);
        this.onDelete(poc);
    },
    onClickDelete:function() {
        var form = this.getPocForm().getForm();
        var poc = form.getRecord();
        this.onDelete(poc);
    },
    onDelete:function (poc) {
        var me = this;
        var locationName = poc.get('displayName');
        Ext.Msg.show({
            title: "Remove '" + locationName + "'",
            icon: this.QUESTION,
            msg: "Are you sure you want to remove location '" + locationName + "'?",
            buttons: Ext.Msg.YESNO,
            callback: function(btn) {
                if (btn != "yes") return;
                me.doDelete(poc);
            }
        });
    },
    doDelete:function(poc) {
        var uid = poc.get('uid');
        var form = this.getPocForm().getForm();
        var pocStore = Ext.getStore('pocStore');
        pocStore.remove(poc);
        Ext.Ajax.request({
            url: '/pointOfCare/' + uid,
            method: 'DELETE',
            jsonData: poc.getData(),
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
                form.reset(true);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },
    onSave:function () {
        var me = this;
        var form = me.getPocForm().getForm();
        var pocStore = Ext.getStore('pocStore');
        form.updateRecord();
        var poc = form.getRecord();
        if (!poc) return;
        poc.set('domain', 'pointOfCare');
        var uid = poc.getId();
        Ext.Ajax.request({
            url: uid ? '/pointOfCare/' + uid : '/pointOfCare/new',
            method: 'POST',
            jsonData: poc.getData(),
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
                if (!uid) poc.set('uid', json.data.uid);
                poc.commit();
                pocStore.sort();
                me.getPocList().getView().focusRow(poc);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }
});