define([
    "app/applets/newsfeed/summary/summaryLayout",
    "app/applets/newsfeed/visitDetail/visitDetailController"
], function(SummaryLayout, VisitDetailController) {
    VisitDetailController.initialize();

    var applet = {
        id: "newsfeed",
        viewTypes: [{
            type: 'summary',
            view: SummaryLayout,
            chromeEnabled: true
        }],
        defaultViewType: 'summary'

    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('timelineSummary');
        channel.reply('createTimelineSummary', function() {
            var view = SummaryLayout;

            var response = $.Deferred();

            var AppletView = ADK.AppletViews.ChromeView.extend({
                appletScreenConfig: {
                    id: 'newsfeed',
                    instanceId: 'newsfeed-gdt',
                    title: 'TIMELINE SUMMARY',

                },
                AppletView: view,
                attributes: {
                    'data-appletid': 'newsfeed',
                    'data-instanceId': 'newsfeed-gdt',
                }
            });

            response.resolve({
                view: new AppletView({appletType: 'gdt'}),
            });

            return response.promise();
        });
    })();

    return applet;
});
