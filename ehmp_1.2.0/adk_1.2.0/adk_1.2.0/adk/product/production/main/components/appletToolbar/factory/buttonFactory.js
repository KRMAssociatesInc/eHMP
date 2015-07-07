define([
	"jquery",
	"underscore",
	"main/components/appletToolbar/factory/buttons"
], function($, _, Buttons) {

	function ButtonFactory() {}

	ButtonFactory.prototype.createButton = function (options,buttonType){
		buttonType = buttonType.toLowerCase();
		if (buttonType == 'detailsviewbutton') {
			return new Buttons.detailsViewButton(options);
		} else if (buttonType == 'quicklookbutton') {
			return new Buttons.quickLookButton(options);
		} else if (buttonType == 'submenubutton') {
			return new Buttons.subMenuButton(options);

		}else if (buttonType == 'infobutton') {
            return new Buttons.infoButton(options);
        } else if (buttonType == 'deletestackedgraphbutton') {
            return new Buttons.deleteStackedGraphButton(options);
        } else if (buttonType == 'tilesortbutton') {
            return new Buttons.tileSortButton(options);
        } else {
			return new Buttons.genericButton(options);
		}
	};
	ButtonFactory.prototype.buttonInstanceOf = function(button, instance) {
		return (button instanceof Buttons[instance]);
	};
	return ButtonFactory;
});