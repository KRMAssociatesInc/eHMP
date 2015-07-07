Ext.define('gov.va.cpe.SnippetWindow', {
    extend:'Ext.window.Window',
    requires:['gov.va.cpe.SnippetPanel'],
    title:'Reason for Action',
    height:300,
    alias:'widget.snippetwindow',
    id:'snippetWindow',
    width:300,
    layout:'fit',
    closeAction:'hide',
    model:true,
    worksheet:false,
    mixins:{
        patientaware:'gov.va.hmp.PatientAware'
    },
    items:[
        {
            xtype:'snippetpanel',
            itemId:'snippetPanel'
        }
    ],
    buttons:[
        { xtype:'button', itemId:"okBtn", text:'Accept',
            listeners:{
                click:function () {
                    var win = Ext.getCmp('snippetWindow');
                    var existText = '';
                    var text = '';
                    var textField = win.down('#reasonField');
                    var cbField = win.down('#resultType');
                    if (win.worksheet) {

                        text = text + textField.value + ' result type of ' + cbField.valueModels[0].data.value;
                        var worksheet = Ext.ComponentQuery.query('#worksheetText')[0];
                        if (worksheet.html) existText = worksheet.html;
                        worksheet.update(existText + '<table><tr><span style="color: #00ff33;">Reason: ' + text + '</span></tr></table>');
                    }
                    textField.reset();
                    cbField.reset();
                    win.hide();
                }
            }
        }
    ],
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
    }
});

