::: page-description
# Code review checklist #
Code review checklist for ADK and eHMP-UI developers
:::

## JavaScript in general ##
+ There are no _commented_ lines of codes. Rely on git to find obsolete code blocks instead of keeping them in the latest revision.
+ There are no _ambiguous_ or _obsolete_ comments.  Having bad comments is far worse than having no comment.
+ There are no _global_ variables.  Don't define global variables unless there is a compelling reason to do so.
+ Each local variable is declared with its own var statement.  Don't definemultiple local variables with a single _var_.
  ```JavaScript
    // Bad practice
    var foo = 1,
        bar = 2;
  ```
  ```JavaScript
    // Good practice
    var foo = 1;
    var bar = 2;
  ```
+ There should be _'use strict'_ for better [ECMAScript5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) semetic checking.
  ```JavaScript
    // Good practice
    define([
        'backbone',
        'backbone.radio'
    ], function(Backbone) {
        'use strict';
        ...
    }
  ```
+ Do not use _inline_ style.
  ```JavaScript
    // Bad practice
    $('a[title="Search"] img').css('background-position','0px 0px');
  ```
+ Each line should not exceed 120 characters.
+ Newly added or updated lines of code have reasonably good indentation for good readability.
+ There are no code blocks that can be replaced by utility functions of __[lodash](https://lodash.com/docs)__ or __ADK.Utils__.
+ There are no unnecessary console _loggings_.
+ Each variable should be declared with unique naming within its visibility.
  ```JavaScript
    // Bad practice
    var patientName;
    ...
    var = function(patientInfo) {
        var patientName;
        ...
    }
  ```
+ All variable names adhere to the variable naming standards.
  ```JavaScript
    // Bad practice. Those variable names are not descriptive enough.
    var a1;
    var a11;
    var a111;
    var f1;

    // This function name is misleading.
    var isSwitchOn = function(switchFlash) {
        return (switchFlash !== true);
    }

  ```
+ There are no functions with too many lines.  Break into smaller functions.
+ There are no heavily nested codes. Refactor such codes for better readability.
  ```JavaScript
    // Bad practice
    if (condition1) {
        ...
        if (condition2) {
            ...
            if (condition3) {
                ...
                if (condition4) {
                    ...
                    if (condition5) {
                        ...
                    }
                }
            }
        }
    }
  ```
* There are no excessive nested iterations.
* There are no double quotes around string values.
  ```JavaScript
    // Bad practice
    var fistName = "Joe";
  ```
## Backbone and Marionette ##
* There are no memory leaks from 'zombie' views. See [Marionette](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html#re-rendering-a-layoutview) documentation.
  ```JavaScript
    // Good practice. Instantiate a child view when it is needed
    layoutView.showChildView('menu', new MenuView());
  ```
* Ensure destroy() is issued to views when parent is destroyed, ideally through Marionette mechanisms.
* There is no asynchronous template rendering.
  ```JavaScript
    // Good practice. Let a single painting render all children views
    onBeforeShow: function() {
        this.showChildView('header', new HeaderView());
        this.showChildView('footer', new FooterView());
    }
  ```
* There are no redundant divs.
* There is no full DOM tree traversing by jQuery.  Use this.$(selector) for better performance.
* There are no events to elements outside of the scope of the current view.
* Every resource is released when a listening view is destroyed.
  ```JavaScript
    // Good practice
    onBeforeDestroy: function() {
      ADK.Messaging.off('globalDate:selected');
    },
  ```
* No code relies on obsolete/deprecated ADK features.
* Parent views should always be of type _CompositeView_, _CollectionView_, or _LayoutView_ instead of _ItemView_.
* There are no `.html()` calls and there are no `.append()` calls.

## HTML Template ##
* Tags are 508-compliant.
* Do not use `tabindex=0` to make non-actionable items navigable via the tab key.
* Do not use `tabindex` to adjust tab navigation that breaks the left->right top->bottom visual flow.
* Do not use inline style.
* Do not use deprecated HTML elements & attributes.
* There are no misleading or ambiguous element id values.
* Do not use single quotes around attributes.
  ```JavaScript
    <!-- Bad practice -->
    <button type='button' class='btn btn-default' title='Active'>Active</button>
  ```
## Miscellaneous ##
* Specify exact library version in _bower.json_.
  ```
    "lodash": "1.3.1",
    "jquery": "1.9.1",
  ```
* Run `gradle build` to verify newly generated css files are identical to the ones from git.
  ```
    Running "shell:sass" (shell) task
    Running "compass:dist" (compass) task
    overwrite _assets/css/adk.css (1.229s)
    identical _assets/css/browser-not-supported.css (0.004s)
    identical _assets/css/ui-components.css (0.443s)
    identical _assets/css/vendor.css (0.002s)
  ```