var dataStore = Ext.create('Ext.data.ArrayStore', {
    fields:[
        {name:'id', mapping:0},
        {name:'value', mapping:1}
    ]
});


Ext.define('gov.va.cpe.order.DcReasonsListWindow', {
    extend:'Ext.window.Window',
    title:'Discontinue Reasons',
    height:300,
    alias:'widget.dcreasonslistwindow',
    id:'dcReasonsListWindow',
    width:400,
    closeAction:'hide',
    model:true,
    uid:'',
    layout:{type:'border'},
    worksheet:false,
    mixins:{
        patientaware:'gov.va.hmp.PatientAware'
    },
    listeners:{
        show:function () {
            this.disable();
            this.load();
        }},
    items:[
        {
            xtype:"combobox",
            store:dataStore,
            itemId:'dcReasonsListcb',
            region:'center',
            layout:'fit',
            fieldLabel:'Discontinue Reason',
            width:300,
            displayField:'value',
            valueField:'id',
            queryMode:'local'
        },
        {
            xtype:'snippetpanel',
            itemId:'snippetQO',
            region:'south',
            width:300,
            height:200,
            title:'Reason for action'
        }

    ],
    buttons:[
        { xtype:'button', itemId:"doneBtn", text:'Cancel',
            listeners:{
                click:function () {
                    var win = Ext.getCmp('dcReasonsListWindow');
                    var cbDiscontinue = win.down('#dcReasonsListcb');
                    var textField = win.down('#reasonField');
                    var cbField = win.down('#resultType');
                    cbDiscontinue.reset();
                    textField.reset();
                    cbField.reset();
                    win.hide();
                }
            }
        },
        { xtype:'button', itemId:"dcBtnWindow", text:'Discontinue Order',
            listeners:{
                click:function () {
                    var win = Ext.getCmp('dcReasonsListWindow');
                    var cbDiscontinue = win.down('#dcReasonsListcb');
                    var po = win.getPatientInfo();
                    var dcIen = cbDiscontinue.valueModels[0].data.value;
                    var patientIcn = po.icn;
                    var command = 'discontinue';
                    Ext.Ajax.request({
                        url:'/vpr/chart/orderingControl',


                        params:{reason:dcIen, patient:patientIcn, command:command, uid:win.uid},
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
                                        var replaceText = text.replace(/\\r\\n/g, "<br />");
                                        if (win.worksheet) {
                                            var existText = '';
                                            var worksheet = Ext.ComponentQuery.query('#worksheetText')[0];
                                            if (worksheet.html) existText = worksheet.html;
                                            var textField = win.down('#reasonField');
                                            var cbField = win.down('#resultType');
                                            var snippetText = textField.value + ' result type of ' + cbField.valueModels[0].data.value;
                                            worksheet.update(existText + '<table><tr><span style="color: #cc0033;">Order Discontinued: ' + replaceText + '</span></tr></table>' +
                                                '<table><tr><span style="color: #00ff33;">Reason for action: ' + snippetText + '</span></tr></table>');
                                        } else alert(text);
                                    }
                                }
                            }
                            cbDiscontinue.reset();
                            textField.reset();
                            cbField.reset();
                            win.hide();
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
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
    },
    load:function () {
        var me = this;
        Ext.Ajax.request({
            url:"/vpr/chart/orderingControl?command=dcReasonsList&uid=" + me.uid,
            success:function (response) {

                var xml = response.responseXML;
                var dq = Ext.DomQuery;
                var dcl = dq.select('reason', xml);
                if (!dcl) {
                    alert('Cannot discontinued this order');
                    me.hide();
                    return
                }
                var str;
                var id;
                var data = [];

                Ext.iterate(dcl, function (key, value) {
                    str = key.attributes[0].nodeValue;
                    id = key.attributes[1].nodeValue;
                    data[value] = [id, str];
                });
                var cbDiscontinue = me.down('#dcReasonsListcb');
                cbDiscontinue.store.removeAll();
                cbDiscontinue.store.loadData(data);
                me.show();
                me.enable();
            },
            failure:function (resp) {
                console.log("I failed; "+resp.responseText);
            }
        })
    }
});

