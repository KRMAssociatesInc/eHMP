define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/serverSideErrorTemplate",
    "hbs!main/components/views/serverSideError"
], function(Backbone, Marionette, _, ServerSideErrorTemplate, ServerSideError) {
    var Error = Backbone.Model.extend({
        defaults: {
            errormsg: 'Server timed out',
            prefix: 'Error'
        }
    });

    var ErrorCollection = Backbone.Collection.extend({
        model: Error,
        comparator: 'errormsg',
    });

    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: ServerSideError,
        tagName: 'li',
        model: Error,
    });

    var ErrorListView = Backbone.Marionette.CompositeView.extend({
        template: ServerSideErrorTemplate,
        childViewContainer: '#server-side-error-list',
        id: 'server-side-errors',
        className: 'well well-sm',
        childView: ErrorView,
        collection: new ErrorCollection(),
        attributes: {
            "hidden": "true"
        },
        events: {
            'click .errorMessageClose': 'clearErrors',
        },
        initialize: function() {
            this.listenTo(this.collection, "change", this.render());
        },
        addError: function(msg, title) {
            this.collection.add(new Error({
                errormsg: msg,
                prefix: title
            }));
            this.el.removeAttribute('hidden');
            this.$el.attr('hidden', false);  //have to do this for IE rather than just this.el.hidden = true
        },
        clearErrors: function() {
            this.collection.reset();
            this.$el.attr('hidden', true);
        },
    });

    return ErrorListView;
});
