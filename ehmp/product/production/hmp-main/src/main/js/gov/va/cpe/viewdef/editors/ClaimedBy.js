Ext.define('gov.va.cpe.viewdef.editors.ClaimedBy', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.claimedby',
	myVal: null,
    setValue: function(val) {
    	if(val=='' || val==null) {val = {code:'',name:''}}
    	this.myVal = val;
    	this.refreshButtonState();
    },
    claim: function() {
    	this.myVal = {
    		code: gov.va.hmp.UserContext.userInfo.uid,
    		name: gov.va.hmp.UserContext.userInfo.displayName
    	};
    	this.refreshButtonState();
    },
    release: function() {
    	this.myVal = {code:'',name:''};
    	this.refreshButtonState();
    },
    refreshButtonState: function() {
    	if(this.myVal && this.myVal.code == gov.va.hmp.UserContext.userInfo.uid) {
    		this.items.items[0].hide();
    		this.items.items[1].show();
    	} else {
    		this.items.items[0].show();
    		this.items.items[1].hide();
    	}
    },
    getValue: function() {
    	return this.myVal;
    },
    items: [{
    	xtype: 'button',
    	text: 'Claim',
    	hidden: true,
    	handler: function(button) {
    		var pnl = button.up('claimedby');
    		pnl.claim();
    	}
    },{
    	xtype: 'button',
    	text: 'Release',
    	hidden: true,
    	handler: function(button) {
    		var pnl = button.up('claimedby');
    		pnl.release();
    	}
    }]
});