Ext.define('gov.va.hmp.appbar.AppInfoPropertiesGrid', {
    extend:'Ext.grid.property.Grid',
    requires:[
        'gov.va.hmp.AppContext'
    ],
    alias:'widget.appinfopropertygrid',
    /**
     * @cfg {String} appInfo (required)
     * The name of the node in the @{link AppContext#getAppInfo}'s JSON data to use as this Property Grid's source.
     */
    nameColumnWidth:200,
    source:{},
    initEvents: function () {
        this.callParent(arguments);
        //make the grid readonly
        this.on('beforeedit',function () { return false; }, this);
    },
    beforeRender:function() {
        this.refreshSource();
        return this.callParent(arguments);
    },
    refreshSource: function() {
        this.setSource(gov.va.hmp.AppContext.getAppInfo()[this.appInfo]);
    }
});