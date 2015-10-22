define([
    "app/applets/problems_add_edit/views/problemsAddView"
], function(problemsAddView){
    var problemsChannel = ADK.Messaging.getChannel('problems');
    problemsChannel.comply('addProblem', problemsAddView.handleShowView);
    return {
        id: "problems_add_edit",
        getRootView: function() {
            return problemsAddView;
        }
    };
});
