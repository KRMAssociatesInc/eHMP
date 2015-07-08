define([
	"backbone",
	"marionette",
	"underscore",
	"hbs!app/applets/problems/modalView/table"
], function(Backbone, Marionette, _, modalTemplate) {
	return Backbone.Marionette.ItemView.extend({
		template: modalTemplate
	});
});
