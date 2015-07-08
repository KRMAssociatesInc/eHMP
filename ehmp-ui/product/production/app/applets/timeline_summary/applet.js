define([
    'app/applets/timeline_summary/views/timelineSummaryDG'
], function(timelineSummaryView) {

    var applet = {
        id: 'timeline_summary',
        //instanceId: 'timeline_summary',
        getRootView: function() {
            return timelineSummaryView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('globalDate');
        channel.reply('createTimelineSummary', function() {
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
