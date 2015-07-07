/**
 * Created by IntelliJ IDEA.
 * User: vhaislpuleoa
 * Date: 11/29/11
 * Time: 6:39 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('gov.va.cpe.order.MedOrderingToolbar', {
            extend: 'Ext.toolbar.Toolbar',
            alias: "widget.medorderingtoolbar",
//            id: 'medOrderingToolbar',
            hidden: false,
            worksheet: false,
            items: [
//                        { xtype: 'button', text: 'Change', href: "/shell/chart/orderDialog" },
                        { xtype: 'button', itemId: "copyBtn",  text: 'Copy',
                            listeners: {
                                click: function() {
                                    var grid = this.up("viewdefgridpanel");
                                    var po = grid.getPatientInfo();
                                    var icn = po.icn;
                                    var itemUid = grid.selModel.selected.items[0].data.uid;
                                    var command = 'ordering';
                                    var tbar = this.up("toolbar");
                                    if (tbar.worksheet) {
                                        var panel = grid.up('panel').up('panel');
                                        var worksheet = panel.down('#worksheetText');
                                    }
                                    Ext.Ajax.request({
                                          url: '/vpr/chart/orderingControl',

                                        params: {uid:itemUid,command:command,orderAction:"C",patient:icn},
                                        success: function(response) {
                                            var xml = response.responseXML;
                                            var success = Ext.select("success", false, xml);
                                            if (success.elements[0].textContent == "false") {
                                                var message = Ext.select("error message", false, xml);
                                                if (message.elements[0].nextSibling.nodeValue) {
                                                    alert(message.elements[0].nextSibling.nodeValue);
                                                } else {
                                                    alert("Error copying the order to a new order.")
                                                }
                                            } else {
                                                if (success.elements[0].textContent == "true") {
                                                    var message = Ext.select("data message", false, xml);
                                                    if (message.elements[0].nextSibling.nodeValue) {
                                                        var text = message.elements[0].nextSibling.nodeValue;
                                                        var replaceText = text.replace(/\\r\\n/g,"<br />");
                                                        var snippet = Ext.getCmp('snippetWindow');
                                                        if (!snippet) snippet = Ext.create('gov.va.cpe.SnippetWindow', {});
                                                        var existText = '';
                                                        if (tbar.worksheet) {
                                                            console.log(worksheet);
                                                            if (worksheet.html) existText = worksheet.html;
                                                            worksheet.update(existText + '<table><tr><span style="color: #3333ff;">Order Placed: ' + replaceText + '</span></tr></table>');
                                                            snippet.worksheet = true;
                                                            snippet.show();
                                                        }
                                                        else {

                                                            alert(text);

                                                        }
                                                    }else {alert("Order copy to new order go into CPRS to sign the order")}

                                                }
                                            }
                                        },
                                        failure: function(response) {

                                            alert('Unknown error!');
                                        }
                                    });
                                }}
                        },
                        { xtype: 'button', itemId: "renewBtn",  text: 'Renew',
                        listeners: {
                                click: function() {
                                	var grid = this.up("viewdefgridpanel");
                                    var po = grid.getPatientInfo();
                                    var icn = po.icn;
                                    var itemUid = grid.selModel.selected.items[0].data.uid;
                                    var command = 'renewOrder';
                                    var tbar = this.up("toolbar");
                                    if (tbar.worksheet) {
                                        var panel = grid.up('panel').up('panel');
                                        var worksheet = panel.down('#worksheetText');
                                    }
                                    Ext.Ajax.request({
//                                        url: '/shell/chart/renew',
                                        url: '/vpr/chart/orderingControl',

                                        params: {uid:itemUid,command:command,patient:icn},
                                        success: function(response) {
                                            var xml = response.responseXML;
                                            var success = Ext.select("success", false, xml);
                                            if (success.elements[0].textContent == "false") {
                                                var message = Ext.select("error message", false, xml);
                                                if (message.elements[0].nextSibling.nodeValue) {
                                                    alert(message.elements[0].nextSibling.nodeValue);
                                                } else {
                                                    alert("Error renewing the order.")
                                                }
                                            } else {
                                                if (success.elements[0].textContent == "true") {
                                                    var message = Ext.select("data message", false, xml);
                                                    var snippet = Ext.getCmp('snippetWindow');
                                                    if (!snippet) snippet = Ext.create('gov.va.cpe.SnippetWindow', {});
                                                    if (message.elements[0].nextSibling.nodeValue) {
                                                        var text = message.elements[0].nextSibling.nodeValue;
                                                        var replaceText = text.replace(/\\r\\n/g,"<br />");
                                                        var existText = '';
                                                        if (tbar.worksheet) {
                                                            if (worksheet.html) existText = worksheet.html;
                                                            worksheet.update(existText + '<table><tr><span style="color: #3333ff;">Order Placed: ' + replaceText + '</span></tr></table>');
                                                            snippet.worksheet = true;
                                                            snippet.show();
                                                        }
                                                        else alert(text);
                                                    }else {alert("Order renew to a new order go into CPRS to sign order")}
                                                }
                                            }
                                        },
                                        failure: function(response) {

                                            alert('Unknown error!');
                                        }
                                    });
                                }}
                        },
                        { xtype: 'button', itemId: "dcBtn", text: 'Discontinue', //href: "/shell/chart/dcReasonsList"
                            listeners: {
                                click: function() {
                                    var grid = this.up("viewdefgridpanel");
                                    var itemUid = grid.selModel.selected.items[0].data.uid;
                                    var dcWindow = Ext.getCmp('dcReasonsListWindow');
                                    if (!dcWindow) dcWindow = Ext.create('gov.va.cpe.order.DcReasonsListWindow', {});
                                    dcWindow.uid = itemUid;
                                    var tbar = this.up("toolbar");
                                    if (tbar.worksheet) dcWindow.worksheet = true;
                                    dcWindow.show();
                                }}
                        },
                        { xtype: 'button', itemId: "qolBtn", text: 'Quick Order',
                            dockedItems: [
                                {
                                    xtype: 'qoitemlistwindow',
                                    dock: 'top'
                                }
                            ],
                            listeners: {
                                click: function() {

                                    var qoWindow = Ext.getCmp('qoItemListWindow');
                                    if (!qoWindow) qoWindow = Ext.create('gov.va.cpe.order.QoItemListWindow', {});
                                    var tbar = this.up("toolbar");
                                    if (tbar.worksheet) qoWindow.worksheet = true;
                                    qoWindow.show();
                                }
                            }
                        }
//                    }
                    ]
        });