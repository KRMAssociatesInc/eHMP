define([
	'backbone',
	'marionette',
	'underscore',
	'hbs!app/applets/allergy_grid/modal/modalTemplate'
], function(Backbone, Marionette, _, modalTemplate) {
	'use strict';
	return Backbone.Marionette.ItemView.extend({
		template: modalTemplate
	});
});