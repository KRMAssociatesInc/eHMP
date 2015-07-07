Ext.define('gov.va.hmp.admin.VistaRpcRunner', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.containers.LinkBar'
    ],
    alias: 'widget.vistarpcrunner',
    itemId: 'rpc-call',
    layout:{
        type:'vbox',
        align: 'stretch'
    },
    onBoxReady: function() {
        this.down("combobox").store = Ext.create('Ext.data.Store', {
            fields:[
                {name:'division', type:'string'},
                {name:'name', type:'string'},
                {name:'host', type:'string'},
                {name:'port', type:'string'}
            ],
            proxy:{
                type:'ajax',
                url:'/auth/accounts',
                reader:{
                    type:'json',
                    root:'data.items'
                }
            }
        });
    },
    items:[
        {
            xtype:'form',
            title:'Execute a VistA RPC',
            autoScroll:false,
            flex: 2,
            padding:0,
            bodyPadding:5,
            margin:'5 5 0 5',
            layout:'anchor',
            defaults:{
                anchor:'100%'
            },
            defaultType:'textfield',
            items:[
                {
                    xtype:'fieldset',
                    title:'VistA Account',
                    collapsible:true,
                    collapsed:true,
                    defaultType:'textfield',
                    defaults:{
                        anchor:'100%',
                        labelAlign:'right',
                        labelSeparator:''
                    },
                    items:[
                        {
                            xtype:'combo',
                            fieldLabel:'Division',
                            name:'division',
                            tabIndex:1,
                            forceSelection:true,
                            valueField:'division',
                            displayField:'name',
                            queryMode:'local'
                        },
                        {
                            fieldLabel:'Access Code',
                            inputType:'password',
                            name:'accessCode',
                            allowBlank:false,
                            tabIndex:2
                        },
                        {
                            fieldLabel:'Verify Code',
                            inputType:'password',
                            name:'verifyCode',
                            allowBlank:false,
                            tabIndex:3
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'RPC',
                    collapsible: false,
                    defaults:{
                        anchor:'100%',
                        labelAlign:'right',
                        labelSeparator:''
                    },
                    items: [
                        {
                            itemId:'rpcContextField',
                            xtype:'combobox',
                            fieldLabel:'RPC Context',
                            valueField:'name',
                            displayField:'name',
                            name:'context',
                            queryMode:'local',
                            store:Ext.create('Ext.data.Store', {
                                fields:['name'],
                                // some common options (user is not required to pick one of these though)
                                data:[
                                    {name:'VPR SYNCHRONIZATION CONTEXT'},
                                    {name:'VPR UI CONTEXT'},
                                    {name:'OR CPRS GUI CHART'}
                                ]
                            }),
                            allowBlank:true,
                            tabIndex:4
                        },
                        {
                            xtype: 'textfield',
                            itemId:'rpcNameField',
                            fieldLabel:'RPC Name',
                            name:'name',
                            allowBlank:false,
                            tabIndex:5
                        }
                    ]
                },
                {
                    xtype:'fieldset',
                    itemId:'rpcParametersField',
                    title:'Parameters',
                    collapsible:false,
                    defaults:{
                        xtype: 'fieldcontainer',
                        labelAlign:'right',
                        labelSeparator:'',
                        combineErrors:true,
                        msgTarget:'side',
                        layout:{
                            type: 'hbox',
                            align: 'middle'
                        },
                        defaults:{
                            margin:'0 0 0 2'
                        }
                    },
                    autoDestroy:true
                },
                {
                    itemId:'rpcFormatField',
                    xtype:'radiogroup',
                    fieldLabel:'Response Format',
                    minWidth:200,
                    anchor: '50%',
                    items:[
                        {
                            itemId:'plaintext',
                            boxLabel:'Plain&nbsp;Text',
                            name:'format',
                            inputValue:'text',
                            checked:true
                        },
                        {
                            itemId:'json',
                            boxLabel:'JSON',
                            name:'format',
                            inputValue:'json'
                        },
                        {
                            itemId:'xml',
                            boxLabel:'XML',
                            name:'format',
                            inputValue:'xml'
                        }
                    ]
                }
            ],
            fbar:[
                {
                    ui:'primary',
                    itemId:'executeButton',
                    text:'Execute'
                }
            ],
            dockedItems:[
                {
                    xtype:'linkbar',
                    dock:'top',
                    items:[
                        {
                            itemId:'vprExtractRpcButton',
                            xtype:'button',
                            text:'VPR Extract RPC'
                        },
                        ' ',
                        {
                            itemId:'cprsRpcButton',
                            xtype:'button',
                            text:'CPRS RPC'
                        },
                        ' ',
                        {
                            itemId:'deleteVprObjectRpcButton',
                            xtype:'button',
                            text:'VPR DELETE OBJECT RPC'
                        },
                        ' ',
                        {
                            itemId:'resetRpcFormButton',
                            xtype:'button',
                            text:'Other'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'splitter'
        },
        {
            xtype: 'component',
            html: '<h4>RPC Result</h4>'
        },
        {
            xtype:'container',
            flex: 3,
            margin:'0 5 5 5',
            layout: 'fit',
            autoEl: 'pre',
            padding: '5 0 5 5',
            items: [
                {
                    xtype: 'component',
                    itemId:'rpcResultPanel',
                    autoScroll: true,
                    tpl:'<div>{[Ext.htmlEncode(values.responseText)]}</div>'
                }
            ]
        }
    ]
});