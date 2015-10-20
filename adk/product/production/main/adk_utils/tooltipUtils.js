define([
	"backbone",
	"jquery",
	"_assets/js/tooltipMappings"
], function(Backbone, $, tooltipMappings) {
	'use strict';

	var tooltipUtils = {};

	tooltipUtils.initTooltip = function(event) {
		var eventTarget = $(event.target);

		//does it have the attribute?
		if (!eventTarget.attr('tooltip-data-key')) {
			eventTarget = eventTarget.closest('[tooltip-data-key]');
			if (!eventTarget) {
				return true;
			}
		}

		//init
		var tooltipDataKey = eventTarget.attr('tooltip-data-key');
		if (!tooltipDataKey) {
			return true; //???
		}

		//get the mapping
		var tooltipData = tooltipMappings[tooltipDataKey];
		if (tooltipData === undefined) {
			//if no mapping exists, get his own value
			tooltipData = eventTarget.attr('tooltip-data-key');
			//console.log('Tooltip mapping undefined: ' + tooltipDataKey);
			if (tooltipData === undefined) {
				return true;
			}
		}

		//tooltip placement
		var tooltipPlacement = eventTarget.attr('tooltip-data-placement');
		if (tooltipPlacement) {
			eventTarget.removeAttr('tooltip-data-placement');
		} else {
			tooltipPlacement = 'auto top';
		}

		//delete tooltip marker
		eventTarget.removeAttr('tooltip-data-key');

		//inject/set attributes
		eventTarget.attr({                            
			'data-toggle': 'tooltip',
			'data-placement': tooltipPlacement,
			'data-original-title': tooltipData,
			'data-container': 'body'                                         
		}).tooltip({
			'delay': {
				'show': 500,
				'hide': 100
			}
		}).mouseover();

		return true;
	};

	$('body').on('mouseenter focus', '[tooltip-data-key]', tooltipUtils.initTooltip);

	$('body').on('show.bs.tooltip', function() {
		// Only one tooltip should ever be open at a time
		$('.tooltip').not(this).hide();
	});

	return tooltipUtils;
});