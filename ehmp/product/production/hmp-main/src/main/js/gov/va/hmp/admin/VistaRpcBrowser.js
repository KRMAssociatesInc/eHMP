Ext.define('gov.va.hmp.admin.VistaRpcBrowser', {
    extend:'Ext.grid.Panel',
    requires:[
        'gov.va.hmp.UserContext'
    ],
    alias: 'widget.vistarpcbrowser',
    itemId:'rpc-log',
    title:'VistA Remote Procedure Calls (RPCs)',
    tools: [
        {
            xtype: 'button',
            ui: 'link',
            text: 'Refresh',
            handler: function(button) {
                button.up('vistarpcbrowser').down('pagingtoolbar').doRefresh();
            }
        }
    ],
    viewConfig: {
        getRowClass: function(record, index) {
            return record.get('error') ? 'text-danger' : '';
        }
    },
    columns:[
        { text:'Remote Procedure Call', dataIndex:'rpc', flex:1, renderer: function(value, metadata, record, rowIndex, colIndex) {
            metadata.tdAttr = 'title="' + record.get('uri') + '"';
            return value;
        }},
        { text:'User', dataIndex:'user' },
        { text:'Host', dataIndex:'host' },
        { text:'Millis', dataIndex:'millis' }
    ],
    plugins:[
        {
            ptype:'rowexpander',
            rowBodyTpl:[
                '<table width="100%" class="x-grid-rowbody">' +
                    '<thead>' +
                        '<tr><th align="left" style="font-weight: bold">Params</th><th align="left" style="font-weight: bold">Response</th><th style="text-align:right;width: 100%">{timestamp}</th></tr>' +
                    '</thead>' +
                    '<tr valign="top">' +
                        '<td style="min-width: 300px">' +
                            '<table class="hmp-labeled-values">' +
                                '<tpl for="params">' +
                                    '<tr valign="top"><td>{[xindex-1]}</td><td><pre>{[JSON.stringify(values, null, 4)]}</pre></td></tr>' +
                                '</tpl>' +
                                '<tr><td>timeout</td><td>{timeout}</td></tr>' +
                            '</table>' +
                        '</td>' +
                        '<td colspan="2"><pre>{body}</pre></td>' +
                    '</tr>' +
                '</table>'
            ]
        }
    ],
    dockedItems:[
        {
            xtype:'toolbar',
            dock:'top',
            items:[
                {
                    itemId:'logAllRpcsToggleButton',
                    text:'Enable Logging RPCs for All Users',
                    enableToggle:true,
                    listeners:{
                        click:function (btn) {
                            btn.nextSibling('#logUserRpcsToggleButton').setDisabled(btn.pressed);
                            Ext.Ajax.request({
                                url:'/rpc/log/toggle',
                                method:'POST',
                                params:{
                                    enable:btn.pressed,
                                    all:true
                                }
                            });
                        }
                    }
                },
                '->',
                {
                    itemId:'logUserRpcsToggleButton',
                    enableToggle:true,
                    listeners:{
                        click:function (btn) {
                            btn.previousSibling('#logAllRpcsToggleButton').setDisabled(btn.pressed);
                            Ext.Ajax.request({
                                url:'/rpc/log/toggle',
                                method:'POST',
                                params:{
                                    enable:btn.pressed,
                                    all:false
                                }
                            });
                        }
                    }
                }
            ]
        },
        {
            xtype:'pagingtoolbar',
            dock:'bottom',
            displayInfo:true
        }
    ],
    initComponent:function () {
        this.callParent(arguments);
        this.store=Ext.create('Ext.data.Store', {
            buffered: false,
            pageSize: 50,
            autoLoad:true,
            fields:[
                {name:'rpc', type:'string', mapping:'request', convert:function (v, rec) {
                    return v.rpcContext + '/' + v.rpcName;
                }},
                {name:'uri', type:'string', mapping:'request.uri'},
                {name:'error', type:'boolean'},
                {name:'user', type:'string', mapping:'request.credentials'},
                {name:'host', type:'string', mapping:'request.host', convert:function (v, rec) {
                    return v.hostname + ':' + v.port;
                }},
                {name:'params', type:'auto', mapping:'request.params'},
                {name:'timeout', type:'string', mapping:'request.timeout'},
                {name:'millis', mapping:'response', type:'int', convert:function(v, rec) {
                    return rec.get('error') ? -1 : v.elapsedMillis;
                }},
                {name:'body', type:'string', convert:function(v, rec) {
                    if (rec.get('error')) {
                        return rec.raw.exception.message;
                    } else {
                        var body = rec.raw.response.body;
                        var json = Ext.JSON.decode(body, true);
                        if (json) {
                            body = JSON.stringify(json, null, 4);
                        }
                        return body;

                    }
                }},
                {name:'timestamp', type:'date'}
            ],
            proxy:{
                type:'ajax',
                url:'/rpc/log',
                reader:{
                    type:'json',
                    root:'data.items',
                    totalProperty:'data.totalItems'
                }
            }
        });
        this.down('pagingtoolbar').store = this.store;
        this.down('#logUserRpcsToggleButton').setText('Enable Logging RPCs for ' + gov.va.hmp.UserContext.getUserInfo().displayName);
        this.getStore().on('load', this.onLoad, this);
    },
//    autorefresh:function () {
//        this.getStore().load();
//    },
    onLoad:function (store, records, successful) {
        var rawData = store.getProxy().getReader().rawData;

        var enabledForAll = rawData.data.enabledForAllUsers;
        var enabledForCurrentUser = rawData.data.enabledForCurrentUser;

        // FIXME: sometimes these components aren't done yet when this returns
        this.down('#logAllRpcsToggleButton').toggle(enabledForAll);
        this.down('#logUserRpcsToggleButton').toggle(enabledForCurrentUser);
    }
});