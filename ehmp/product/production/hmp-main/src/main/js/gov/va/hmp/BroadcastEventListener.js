/**
 * Listens for broadcast events from the server.
 *
 * TODO: Consider moving "disconnected mode" stuff into AppContext or ErrorHandler.
 */
Ext.define('gov.va.hmp.BroadcastEventListener',{
	requires: [
        'gov.va.hmp.EventBus'
    ],
	singleton:true,
    // private
    disconnected: false,
    secondsUntilReconnect: 10,
    startListener: function() {
        if (gov.va.hmp.BroadcastEventListener.listening) {
            return;
        }
        gov.va.hmp.BroadcastEventListener.listening = true;
        Ext.EventManager.on(window, 'beforeunload', gov.va.hmp.BroadcastEventListener.onBeforeUnload);
        gov.va.hmp.BroadcastEventListener.listen();
    },
    // private
	listen: function() {
        var me = this;

		// must set this on window or document, otherwise 2 windows w/ same URL will have the same id!
		if (!window.name) window.name = Ext.id(null, 'hmp-');
		
		// if currently disconnected, lower the timeout threshold to recover faster
		var params = {clientid: window.name}
		if (me.disconnected) params.timeoutMS = 1000;
		
        me.listenRequest = Ext.Ajax.request({
			url: '/broadcast/listen',
			params: params,
			method: 'GET',
			skipErrors: true,
			success: function(response, opts) {
                if (me.disconnected) { me.setDisconnected(false); }
				gov.va.hmp.BroadcastEventListener.handleSuccessResponse(response);
				gov.va.hmp.BroadcastEventListener.listen();
			},
			failure: function(response, opts) {
                var err = Ext.decode(response.responseText, true);
				if(response.aborted || (err && err.error && err.error.message && err.error.message.substring(0, 3)=="409")) {
					if(err && err.error && err.error.message) {console.log(err.error.message);}
					window.name = Ext.id(null, 'hmp-');
					gov.va.hmp.BroadcastEventListener.listen();
				} else {
                    me.setDisconnected(true);
				}
			},
			timeout: 10000000,
			scope: me
		});
	},
    /**
     *
     */
    setDisconnected: function(disconnected) {
        var me = this,
            viewport = Ext.ComponentQuery.query('viewport')[0];

        if (me.disconnected && !disconnected) {
            me.countdownTask.cancel();
            delete me.countdownTask;
            viewport.setLoading(false);
        }
        me.disconnected = disconnected;
        if (me.disconnected) {
            me.secondsUntilReconnect = 10;
            me.countdownTask = new Ext.util.DelayedTask(gov.va.hmp.BroadcastEventListener.onReconnectCountDown, me);
            me.countdownTask.delay(1000);
        }
    },
    // private
    onReconnectCountDown:function() {
        var me = this,
            viewport = Ext.ComponentQuery.query('viewport')[0],
            loadMaskCfg = {
                msg: '<h2>HMP Server Unavailable</h2>' +
                    '<p>The last attempt to connect to the server failed due to either network or server unavailability.</p>' +
                    '<p>This program does not have the ability to diagnose the problem further.</p>',
                cls: 'alert alert-danger'
            };
        if (--me.secondsUntilReconnect > 0) {
            loadMaskCfg.msg += '<p>Will try to reconnect in <strong>' + me.secondsUntilReconnect + '</strong> seconds.</p>'
            viewport.setLoading(loadMaskCfg);
            me.countdownTask.delay(1000);
        } else {
            loadMaskCfg.msg += '<p><strong>Reconnecting...</strong></p>'
            viewport.setLoading(loadMaskCfg);
            gov.va.hmp.BroadcastEventListener.listen();
        }
    },
    // private
    handleSuccessResponse: function(response) {
        var json = Ext.decode(response.responseText);
        if(json && json.data && json.data.length>0) {
            for(var idx in json.data) {
                var event = json.data[idx];
                if (!event['eventName']) {
                    Ext.Error.raise({msg:"Expected 'eventName' property on broadcast event...", event: event});
                }

                gov.va.hmp.EventBus.fireEvent(event.eventName, event);
            }
        }
    },
    // private
    onBeforeUnload:function() {
        Ext.Ajax.abort(gov.va.hmp.BroadcastEventListener.listenRequest);
    }
});