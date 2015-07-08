Ext.define('gov.va.cpe.ChatWindow', {
	extend: 'Ext.window.Window',
    requires: [
        'gov.va.hmp.EventBus',
        'gov.va.cpe.LoggedInUserStore'
    ],
    title:'Ping Window',
    height:570,
    alias: 'widget.chatwindow',
    id:'chatWindow',
    width:400,
    layout:{
        type:'fit'
    },
	items: [{
			xtype: 'form',
            itemId:'taskPanel',
            height:500,
            width:300,
            layout:{
                type:'vbox',
                align:'stretch'
            },
            border:false,
            bodyPadding:10,
            fieldDefaults:{
                labelAlign:'top',
                labelWidth:100,
                labelStyle:'font-weight:bold'
            },
            defaults:{
                margins:'0 0 10 0'
            },
            closeAction: 'dispose',
            modal: true,
			items: [
                {
                    xtype: 'component',
                    html: '<p><img src="/images/icons/under_construction_64.png" alt="HMP Vision" title="HMP Vision" style="float:left;margin:0 4 0 0"/>The vision for the &quot;Ping&quot; system is inter-provider messaging in the HMP. It aims to be similar to other message systems that facilitate communication amongst team members, such as Facebook Messenger, Google+ Messenger or iOS Messages.</p>' +
                        '<p style="margin:4 0 0 0">Currently, "Ping" only exercises the "push" technology that demonstrates it is possible to instant-message (IM) others that are logged in to the HMP. Full up inter-provider messaging with inboxes, status messages, read-receipts, and group conversations, etc. are TBD.</p>'
                },
				{
					  padding:'5 5 5 5',
					  xtype:'combobox',
					  name: 'uid',
					  itemId:'chatUserPicker',
					  grow:true,
					  fieldLabel:'Select User',
					  emptyText:'<Select User>',
					  typeAhead:true,
					  allowBlank:false,
					  forceSelection:true,
					  displayField:'displayName',
					  valueField:'uid'
				},
				{
					padding: '5 5 5 5',
					xtype: 'textfield',
					name: 'message',
					itemId:'chatMessageEntry',
					fieldLabel:'Message',
					emptyText:'<Enter Message>',
					allowBlank:false,
                    listeners:{
                        specialkey:function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                field.up('window').submitMsg();
                            }
                        }
                    }
				},
				{
					xtype: 'panel',
					title: 'Message Area',
					flex: 1,
					padding: '5 5 5 5',
					autoScroll: true						
				}
			]
		}
	],
    initComponent: function() {
        this.items[0].items[1].store = Ext.create('gov.va.cpe.LoggedInUserStore');
        this.callParent(arguments);
    },
    // private
    onBoxReady:function() {
        this.callParent(arguments);

        this.down('combobox').getStore().load();
        gov.va.hmp.EventBus.on('chatMessage', this.onChatMessage, this);
    },
    // private
    onDestroy:function() {
        gov.va.hmp.EventBus.un('chatMessage', this.onChatMessage, this);

        this.callParent(arguments);
    },
    // private
    onChatMessage:function(event) {
        var chatMsg = event.chatMessage;
        var targetUid = 'chatwindow-'+chatMsg.from.uid;
        if (this.getId() != targetUid) {
            return;
        }
        this.receiveMsg(chatMsg.from.uid, chatMsg.from.displayName, chatMsg.message);
    },
	submitMsg: function() {
		var parms = this.down('form').getForm().getValues();
		if(parms.uid!=null && parms.message!=null) {
			Ext.Ajax.request({
				url: '/chat/sendMessage',
				method: 'POST',
				params: parms,
				success: function(response) {
					//Ext.log(response);
					var msg = Ext.decode(response.responseText).message;
					var frm = this.down('form');
					var itms = frm.items;
					var pnl = frm.down('panel');
					pnl.insert(0, {xtype: 'panel', html: '<p style="color:#008888"> SENT: '+msg.message+'</p>'});
                    frm.down('#chatMessageEntry').reset();
				},
				failure: function(response) {
					Ext.log(response);
				},
				scope: this
			})
		}
	},
	receiveMsg: function(uid, userName, msg) {
		var frm = this.down('form');
		var itms = frm.items;
		var pnl = frm.down('panel');
		pnl.insert(0, {xtype: 'panel', html: '<p style="color:#888800">'+userName+': '+msg+'</p>'});
	}
});