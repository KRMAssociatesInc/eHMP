define([
    "app/applets/newsfeed/visitDetail/visitDetailView"
], function(VisitDetailView) {

    var VisitDetailController = {
        initialize: function () {
            var channel = ADK.Messaging.getChannel('visitDetail');
            channel.reply('detailView', function (params) {
                var response = $.Deferred();
                if (params.model !== undefined) {
                    response.resolve({
                        view: new VisitDetailView({
                            model: params.model
                        }),
                        title: params.model.get('summary') || params.model.get('typeDisplayName') //hacktasktic

                    });
                }
                else {
                    //go fetch the details from the server
                }
                return response.promise();
            });
        }
    };
    return VisitDetailController;
});
