Ext.define('gov.va.hmp.jira.TroubleTicket', {
    requires: ['gov.va.hmp.jira.JiraAuth'],
    statics: {
        sessionAuthenticated: false,
        showTicket: function(stacktrace) {
            gov.va.hmp.jira.JiraAuth.doWithAuth(function() {
                gov.va.hmp.jira.TroubleTicket.showTicketForm(stacktrace);
            });
        },
        showTicketForm: function(stacktrace) {
            Feedback({
                h2cPath: '/lib/html2canvas.js',
                url: '/jira/submitBlob',
                label: "Submit Ticket",
                header: "Jira Ticket Submission (authenticated as: "+gov.va.hmp.jira.JiraAuth.username+")",
                messageSuccess: "Done!",
                messageError: "Uh oh..."
            });
        }
    }
});