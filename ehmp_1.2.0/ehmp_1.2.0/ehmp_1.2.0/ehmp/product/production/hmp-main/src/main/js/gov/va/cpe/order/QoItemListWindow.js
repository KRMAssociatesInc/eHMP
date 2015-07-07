var dataStore = Ext.create('Ext.data.ArrayStore', {
    fields:[
        {name:'id', mapping:0},
        {name:'value', mapping:1}
    ]
});


Ext.define('gov.va.cpe.order.QoItemListWindow', {
    extend:'Ext.window.Window',
    requires:['gov.va.cpe.SnippetPanel'],
    title:'Quick Order Menu',
    height:400,
//            alias: 'widget.qoitemlistwindow',
    id:'qoItemListWindow',
    width:300,
    layout:{type:'border'},
    closeAction:'hide',
    model:true,
    worksheet:false,
//            layout: 'vbox',
//            componentLayout: 'body',
//            autoScroll: true,
    mixins:{
        patientaware:'gov.va.hmp.PatientAware'
    },
    listeners:{
        show:function () {
            this.disable();
            this.load();
        }},
    load:function () {
        var me = this;
        Ext.Ajax.request({
            url:"/vpr/chart/orderingControl?command=listQuickOrders",
            success:function (response) {

                var xml = response.responseXML;
                var dq = Ext.DomQuery;
                var qol = dq.select('qo', xml);
                var str;
                var id;
                var data = [];

                Ext.iterate(qol, function (key, value) {
                    str = key.attributes[0].nodeValue;
                    id = key.attributes[1].nodeValue;
                    data[value] = [id, str];
                });
                var grid = me.down('#qoItemListGrid');
                grid.store.removeAll();
                grid.store.loadData(data);
                var panel = me.down('#snippetQO');
//                                panel.setDisabled(true);
                me.show();
                me.enable();

            },
            failure:function () {
                console.log("I failed")
            }
        })
    },
    items:[

        {
            xtype:"grid",
            store:dataStore,
            region:'center',
//                    alias : 'widget.qoitemlistgrid',
            itemId:'qoItemListGrid',
            layout:'fit',
            columns:[
                {header:'Quick Orders', dataIndex:'value', flex:1}
            ],
            width:300,
            height:200,
            listeners:{
                itemclick:function (dv, record, item, index, e) {
                    var win = Ext.getCmp('qoItemListWindow');
                    var panel = win.down('#snippetQO');
                    panel.setDisabled(false);

                }
            }
        },
        {
            xtype:'snippetpanel',
            itemId:'snippetQO',
            region:'south',
            width:300,
            height:200,
            title:'Indication',
            disabled:true
//                        layout: 'fit'
//                        height: 200
        }

    ],
    buttons:[
        { xtype:'button', itemId:"closeBtn", text:'Close',
            listeners:{
                click:function () {
                    var win = Ext.getCmp('qoItemListWindow');
                    var panel = win.down('#snippetQO');
                    var textField = win.down('#reasonField');
                    var cbField = win.down('#resultType');
                    textField.reset();
                    cbField.reset();
                    panel.setDisabled(true);
                    win.hide();
                }
            }
        },
        { xtype:'button', itemId:"orderBtn", text:'Order',
            listeners:{
                click:function () {
                    var win = Ext.getCmp('qoItemListWindow');
                    var po = win.getPatientInfo();
                    var grid = win.down('#qoItemListGrid');
//                            console.log(grid);
                    var selected = grid.getSelectionModel().getSelection();
//                            console.log(selected);
                    var qoIen = selected[0].data.id;
                    var patientIcn = po.icn;
                    var command = 'ordering';
                    Ext.Ajax.request({
                        url:'/vpr/chart/orderingControl',


                        params:{qoIen:qoIen, patient:patientIcn, command:command, orderAction:"", uid:""},
                        success:function (response) {
                            var xml = response.responseXML;
                            var success = Ext.select("success", false, xml);
                            if (success.elements[0].textContent == "false") {
                                var message = Ext.select("error message", false, xml);
                                if (message.elements[0].nextSibling.nodeValue) {
                                    alert(message.elements[0].nextSibling.nodeValue);
                                } else {
                                    alert("Error saving QO")
                                }
                            } else {
                                if (success.elements[0].textContent == "true") {
                                    var message = Ext.select("data message", false, xml);
                                    if (message.elements[0].nextSibling.nodeValue) {
                                        var text = message.elements[0].nextSibling.nodeValue;
                                        console.log(text);
//                                                        var replaceText = replaceLineBreaks(text, '\r\n');
                                        var replaceText = text.replace(/\\r\\n/g, "<br />");
                                        if (win.worksheet) {
                                            var existText = '';
                                            var worksheet = Ext.ComponentQuery.query('#worksheetText')[0];
                                            if (worksheet.html) existText = worksheet.html;
                                            var textField = win.down('#reasonField');
                                            var cbField = win.down('#resultType');
                                            var snippetText = textField.value + ' result type of ' + cbField.valueModels[0].data.value;
//                                                            worksheet.update(existText + '<table><tr><span style="color: #3333ff;">Order Placed: ' + text + '</span></tr></table>' +
//                                                            '<table><tr><span style="color: #00ff33;">Indication: ' + snippetText + '</span></tr></table>');
                                            worksheet.update(existText + '<span style="color: #3333ff;">Order Placed: ' + replaceText + '</span>' +
                                                '<span style="color: #00ff33;">Indication: ' + snippetText + '</span>');
                                        } else alert(text);
                                    }
                                }
                            }
                        },
                        failure:function (response) {
                            alert('Could not connect to the VistA account');
                        }
                    });
//                            win.hide();
                }
            }
        }
    ],
    onBoxReady:function () {
        this.initPatientContext();
        this.callParent(arguments);
    }
});