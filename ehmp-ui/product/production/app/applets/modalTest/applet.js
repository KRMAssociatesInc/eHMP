define([
    'underscore',
    'hbs!app/applets/modalTest/assets/modalTestTemplate'
], function(_, modalTestTemplate) {
    var applet = {
        id: 'modalTest',
        getRootView: function() {
            return Backbone.Marionette.LayoutView.extend({
                events: {
                    'click button': 'showModal'
                },
                showModal: function(event) {
                    event.preventDefault();
                    var options, path = $('#appletPath').val();
                    path = path.split(' ');
                    options = path.splice(1).join(' ');
                    path = path[0];
                    require(['app/applets/'+path+'/applet'],function(modalApplet) {
                        var json,
                            view = modalApplet.getRootView(),
                            addModal = new view();

                        try { json = JSON.parse(options); }
                        catch (e) { json = {}; }

                        addModal.showModal(event, json);
                    });
                },
                template: modalTestTemplate
            });
        }
    };

    return applet;
});
