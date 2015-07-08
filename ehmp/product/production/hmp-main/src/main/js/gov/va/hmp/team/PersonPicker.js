Ext.define('gov.va.hmp.team.PersonPicker', {
    extend:'gov.va.hmp.ux.SearchableList',
    requires:[
        'gov.va.hmp.team.PersonStore'
    ],
    alias:'widget.personpicker',
    emptyText: 'Search Staff',
    displayField: 'name',
    displayTpl: "<div class='media'>" +
                    "<img class='media-object pull-left' src='{photoHRef}' width='30' height='30'/>" +
                    "<div class='media-body'>" +
                        "<h5 class='media-heading'>{displayName}</h5>" +
                        "<div class='text-muted'><span><tpl if='displayTitle'>{displayTitle}<tpl else>No Title</tpl></span>&nbsp;&#8209;&nbsp;<span><tpl if='displayService'>{displayService}<tpl else>No Service</tpl></span></div>" +
                    "</div>" +
                "</div>",
    dragGroup: 'team',
    listConfig: {
        emptyText: 'No matching persons found.'
    },
    initComponent: function() {
        this.store = Ext.getStore('personStore') != null ? Ext.getStore('personStore') : Ext.create('gov.va.hmp.team.PersonStore');
        this.callParent(arguments);
    }
});