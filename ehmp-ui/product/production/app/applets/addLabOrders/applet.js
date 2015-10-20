define([
    'app/applets/addLabOrders/views/addLabOrderView',
    'hbs!app/applets/addLabOrders/templates/footerTemplate'
], function(addLabOrderView) {
    var applet = {
        id: 'addLabOrders',
        getRootView: function() {
            return addLabOrderView;
        }
    };
    return applet;
});


