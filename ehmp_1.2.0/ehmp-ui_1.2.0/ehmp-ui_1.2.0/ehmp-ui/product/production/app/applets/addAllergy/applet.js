define([
    'app/applets/addAllergy/allergenSearchView'
], function(allergenSearchView) {
    var applet = {
        id: 'addAllergy',
        getRootView: function() {
            return allergenSearchView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('addAllergyRequestChannel');
        channel.reply('addAllergyModal', function() {
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
