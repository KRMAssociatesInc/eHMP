Ext.define('gov.va.hmp.team.PersonField', {
    extend: 'gov.va.hmp.ux.InfiniteComboBox',
    requires:[
        'gov.va.hmp.team.PersonStore'
    ],
    alias:'widget.personfield',
    queryMode: 'remote',
    valueField: 'uid',
    displayField: 'displayName',
    listDisplayTpl: "<div class='media'>" +
        "<img class='media-object pull-left' src='{photoHRef}' width='30' height='30'/>" +
        "<div class='media-body'>" +
        "<h5 class='media-heading'>{displayName}</h5>" +
        "<div class='text-muted'><span><tpl if='displayTitle'>{displayTitle}<tpl else>No Title</tpl></span>&nbsp;&#8209;&nbsp;<span><tpl if='displayService'>{displayService}<tpl else>No Service</tpl></span></div>" +
        "</div>" +
        "</div>",
    initComponent:function () {
        this.store = Ext.data.StoreManager.containsKey('personStore') ? Ext.getStore('personStore') : Ext.create('gov.va.hmp.team.PersonStore');

        this.callParent(arguments);
    },
    onBoxReady:function() {
        this.callParent(arguments);

        this.getStore().load();
    }
});