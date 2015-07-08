define([
    'underscore',
    'app/applets/vitalsEiE/views/vitalsEiEBodyView'
], function(_, vitalsEiEBodyView) {

    var applet = {
        id: 'vitalsEiE',
        getRootView: function() {
            return vitalsEiEBodyView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('vitalsEiE');
        channel.reply('vitalsEiEView', function() {
            var View = applet.getRootView();
            var response = $.Deferred();
            response.resolve({
                view: new View(),
            });

            return response.promise();
        });
    })();

    return applet;
});
