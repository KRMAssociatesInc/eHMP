::: page-description
# What's new in the ADK? #
The following changelog has been provided to better communicate changes made to the ADK
:::

::: definition
Changes that will be reflected in this changelog:
- Any new additions or changes to ADK.UI components, API functionality, or code conventions
- Any other changes to the ADK that affect consumption/implementation for applet developers

Changes that will **NOT** be reflected:
- Any behind-the-scenes optimizations
- Non-relevant changes to the application
- Any other changes to the ADK that do not affect applet developers
:::

<!-- Update categories: Additions, Changes, Removals, and Fixes -->

## 2015-07-28 (July 28th, 2015) ##

### Additions ###
- Images for each [ADK.UI.Form controls][FormControls]. These were added to make it more clear what each control is.

### Changes ###
- [Nested Comment Box](form-controls.md#Nested-Comment-Box) column `title` option now is `columnTitle`. This change was made in order to avoid conflicts with each _additionalColumns_ object, which allows for all options of controls. In other words, the change to `columnTitle` will allows there to be a specific `title` option passed in for the desired control.
	- **Note**: this change takes effect in the `itemColumn`, `commentColumn`, and `additionalColumns` options object. Please review the [Nested Comment Box documentation](form-controls.md#Nested-Comment-Box) for a full list of options.
	- Was:
		``` JavaScript
		...
		additionalColumns: [{
			// this also set the title for the control specified
			title: "Header title"
			...
		}]
		``` 
	- Now: 
		``` JavaScript
		...
		additionalColumns: [{
			// now allows for separate control-specific title option
			columnTitle: "Header Title",
			title: "Control-specific title"
			...
		}]
		``` 


## 2015-07-22 (July 22nd, 2015) ##

### Additions ###
- **headerOptions** option added to [Workflow](ui-library.md#Workflow--window-). This enables the use of the dropdown menu through specifying an **actionItems** array.

### Fixes ###
- HTML updated for [Nested Comment Box](form-controls.md#Nested-Comment-Box) and [Comment Box](form-controls.md#Comment-Box). These now match the prescribed 508 compliant HTML.
	- **Note**: you can use the columnClasses option in the [Nested Comment Box](form-controls.md#Nested-Comment-Box) to pass in style classes to each column, for example `columnClasses: ["percent-width-50"]`

## 2015-07-17 (July 17th, 2015) ##
_Initial Entry (recent changes)_

### Additions ###

- Growl Notifications added as [ADK.UI.Notification](ui-library.md#Notification)
- New ADK.UI.Form controls: [Collapsible Container](form-controls.md#Collapsible-Container), [Comment Box](form-controls.md#Comment-Box), [Dropdown](form-controls.md#Dropdown), [Nested Comment Box](form-controls.md#Nested-Comment-Box), [Popover](form-controls.md#Popover)

### Changes ###

- Update to the way ADK.UI components are instantiated (please see [ADK.UI Library documentation][UILibrary], in the code examples)
	- For example, instantiating [ADK.UI.Alert](ui-library.md#Alert) used to look like: 
	```JavaScript
	var alertView = ADK.UI.Alert.create(options);
	ADK.UI.Alert.show(alertView);
	```
	- Now instantiating [ADK.UI.Alert](ui-library.md#Alert) looks like: 
	```JavaScript
	var alertView = new ADK.UI.Alert(options);
	alertView.show();
	```
- ADK.UI.Form controls now support jquery trigger eventing. This can be used for dynamically changing ADK.UI.Form controls dynamically (after initial load)
	- The syntax would look similar to: "$('[_selector for control or group of controls_]').trigger('control:[_specific event_]', [_parameters_])"
		- Example (will hide all [**input**](form-controls.md#Input) controls): 
		```JavaScript
		// only an example selector, better to use form view's $el
		$('.control.input-control').trigger('control:hidden', true)
		```
	- **Note**: These events will only work when the top level control is selected
	- Each control has "control:hidden" built in. Review the [ADK.UI.Form controls documentation][FormControls] for an extensive list of options for each control



[UILibrary]: ui-library.md
[FormControls]: form-controls.md