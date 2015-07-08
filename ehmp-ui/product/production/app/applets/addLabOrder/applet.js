define([
    'app/applets/addLabOrder/views/addLabOrderView'
], function(addLabOrderView) {
    var applet = {
        id: 'addLabOrder',
        getRootView: function() {
            return addLabOrderView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('addALabOrderRequestChannel');
        channel.reply('addLabOrderModal', function() {
            var view = applet.getRootView();
            var response = $.Deferred();
            response.resolve({
                view: new view(),
            });

            return response.promise();
        });
    })();

    return applet;
});
