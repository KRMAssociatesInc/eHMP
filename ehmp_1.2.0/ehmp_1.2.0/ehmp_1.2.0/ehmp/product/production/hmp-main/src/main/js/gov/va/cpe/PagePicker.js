Ext.define('gov.va.cpe.PagePicker', {
    extend:'Ext.form.field.ComboBox',
    requires:[
        'gov.va.hmp.AppContext'
    ],
    alias:'widget.pagepicker',
    fieldLabel:'Page Config',
    labelSeparator:'',
    forceSelection:true,
    editable:false,
    allowBlank:false,
    autoSelect:false,
    emptyText:'-- select page --',
    queryMode:'local',
    displayField:'name',
    valueField:'code',
    store:Ext.create('Ext.data.Store', {
        fields:['code', 'url', 'name']
    }),
    initComponent:function () {
        this.callParent(arguments);
        this.getStore().loadRawData(gov.va.hmp.AppContext.getAppInfo().panels);
    },
    onBoxReady:function () {
        var me = this;
        me.callParent(arguments);

        var panelId = null;
        if (Ext.isDefined(gov.va.hmp.AppContext.getAppInfo().contexts.panelId)) {
            panelId = gov.va.hmp.AppContext.getAppInfo().contexts.panelId;
        }
        if (!panelId) panelId = this.getStore().getAt(0).get('code');

        Ext.defer(function () {
            me.setValue(panelId)
        }, 100, me);
    }
});