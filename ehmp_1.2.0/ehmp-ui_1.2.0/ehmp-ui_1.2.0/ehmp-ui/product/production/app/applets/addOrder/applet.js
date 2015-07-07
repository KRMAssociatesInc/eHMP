define([
    'app/applets/addOrder/views/addOrderView'
], function(orderAddView) {
    var applet = {
        id: 'addOrder',
        getRootView: function() {
            return orderAddView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('medicationChannel');
        channel.reply('addOrderModal', function() {
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
