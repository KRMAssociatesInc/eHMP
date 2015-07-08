define([
    "app/applets/newsfeed/visitDetail/visitDetailView"
], function(VisitDetailView) {

    SummaryController = {
        handleVisitDetail : function(model) {
            var view = new VisitDetailView({
                model: model
            });

            view.showAsModal();
        },
        detailRouter : function(model, event) {

            var newsfeedType = model.get("kind").toLowerCase();
            switch(newsfeedType.toLowerCase()) {
                case "admission":
                case "visit":
                    return this.handleVisitDetail(model);
                default: {
                    //prevent any modals from popping up
                    event.stopPropagation();
                }
            }
        }
    };

    return SummaryController;
});
