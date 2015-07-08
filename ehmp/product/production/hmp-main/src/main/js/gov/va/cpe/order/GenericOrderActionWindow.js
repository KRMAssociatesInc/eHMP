Ext.define('gov.va.cpe.order.GenericOrderActionWindow', {
            extend: 'Ext.window.Window',
            requires: ['gov.va.cpe.SnippetPanel'],
            title: 'Order Action Form',
            height: 500,
//            alias: 'widget.qoitemlistwindow',
            itemId: 'genericOrderActionWindow',
            width: 300,
            layout: {type:'border'},
            closeAction: 'hide',
            model: true,
            worksheet: false,
            uid: "",
//            layout: 'vbox',
//            componentLayout: 'body',
//            autoScroll: true,
            mixins: {
                patientaware: 'gov.va.hmp.PatientAware'
            },
            listeners : {
                show: function() {
                    this.disable();
                    this.load();
                }},
            load: function() {
                var me = this;
                var grid = me.down('#qoItemListGrid');
//                var po = me.getPatientInfo();
                grid.getStore().getProxy().extraParams = {
                    command: "orderAction",
                    uid: me.uid,
                    action: "RENEW",
//                    user: 1089,
//                    patient: 229,
//                    location: 240,
                    orderChecksOnly: true,
                    isQO: false,
                    orderAction: "RENEW"
                };
                grid.getStore().load(function(records, operation, success) {
                     if (success) {
                        console.log(records[0].data);
                        var panel = me.down('#infoPanel');
                        panel.update(records[0].data.resultText + "order Checks" + records[0].data.orderChecks);
                        console.log(operation);
                        console.log(success);
                     }
//                    if (!success) {
//                        console.log(records);
//                        console.log(operation);
//                        console.log(success);
//                    }

                });
//                grid.store.proxy.extraParams = {command: "listQuickOrders", patient: po.icn};
//                cbDiscontinue.getStore().extraParams = {command: "dcReasonsList", uid: me.uid};
//                grid.store.load(function(records, operation, success) {
//                });
                me.show();
                me.enable();
            },
            items: [

//                {
//                    xtype: "grid",
//                    store: Ext.create('Ext.data.ArrayStore', {
//                fields: [
//    {name: 'action'},
//    {name: 'orderChecks'},
//    {name: 'resultText'},
//    {name: 'success'},
//    {name: 'error'}
//],
//    proxy: {
//    url: "/vpr/chart/orderingControl",
//        type: "ajax",
//        method: 'GET',
//        reader: {
//        type: 'json'
////                    root: "qo"
//    }
//}
//}),
//                    region: 'north',
////                    alias : 'widget.qoitemlistgrid',
//                    itemId: 'qoItemListGrid',
//                    layout: 'fit',
//                    columns: [
//                        {header: 'Quick Orders', dataIndex:'name', flex: 1}
//                    ],
//                    width: 300,
//                    height: 200,
//                    listeners : {
//                        itemclick: function(dv, record, item, index, e) {
//                            var win = Ext.getCmp('qoItemListWindow');
//                            var snippet = win.down('#snippetQO');
//                            snippet.setDisabled(false);
//                            var infoPanel = win.down('#infoPanel');
//                            var temp;
//                            if (record.data.description != null) {
//                                temp = record.data.description;
//                            }
//                            if (record.data.orderChecks != null) {
//                                if (temp != null) temp = temp + '\r\n' + record.data.orderChecks;
//                                else temp = record.data.orderChecks;
//                            }
//                            if (temp != null) {
//                                infoPanel.update('<html><head></head><body><pre>'+temp+'</pre></body></html>' );
//                                infoPanel.setAutoScroll(true);
//                                infoPanel.expand();
//                            } else {
//                                infoPanel.update('');
//                                infoPanel.collapse();
//                            }
//
//
//                        }
//                    }
//                },
                {
                    xtype: 'combo',
                    region: 'north',
                    label: '',
                    itemId: 'cbOrderAction'

                },
                {
                  xtype: "panel",
                  region: "center",
                  title: "Additional Information",
                  itemId: "infoPanel",
                  html: '',
                  height: 200,
                  width: 200
                },
                {
                    xtype: 'snippetpanel',
                    itemId: 'snippetQO',
                    region: 'south',
                    width: 300,
                    height: 100,
                    title: 'Indication',
                    disabled: true
//                        layout: 'fit'
//                        height: 200
                }

            ],
            buttons:  [
                { xtype: 'button', itemId: "closeBtn",  text: 'Close',
                    listeners: {
                        click: function() {
                            var win = Ext.getCmp('qoItemListWindow');
                            var panel = win.down('#snippetQO');
                            var textField = win.down('#reasonField');
                            textField.reset();
                            panel.setDisabled(true);
                            win.hide();
                        }
                    }
                },
                { xtype: 'button', itemId: "orderBtn",  text: 'Order',
                    listeners: {
                        click: function() {
                            var win = Ext.getCmp('qoItemListWindow');
                            var po = win.getPatientInfo();
                            var grid = win.down('#qoItemListGrid');
                            var selected = grid.getSelectionModel().getSelection();
                            var ien = selected[0].data.id;
                            var patientIcn = po.icn;
                            var textField = win.down('#reasonField');
                            var snippet = textField.getValue();
                            var command = 'ordering';
                            Ext.Ajax.request({
                                url: '/vpr/chart/orderingControl',
                                params: {qoIen:ien,patient:patientIcn,command:command,orderAction:"",uid:"",snippet:snippet},
                                success: function(response) {
                                    var data = Ext.decode(response.responseText);
//                                            if (data.success == true);
                                    if (data.success == false) {
                                        if (data.error) {
                                            alert(data.error);
                                        } else {
                                            alert("Error saving QO")
                                        }
                                    }
                                },
                                failure: function(response) {
                                    alert('Could not connect to the VistA account');
                                }
                            });
                        }
                    }
                }
            ]
        });
