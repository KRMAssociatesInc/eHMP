::: page-description
# Getting Started #
Creating applets and screens for applet developers
:::

## What is an Applet? ##
The majority of web developers working within the creation of the eHMP UI will spend their time developing applets.  The applet is the incremental user functionality.  An applet is a set of HTML/SASS/JavaScript that runs within the ADK.

Applet development begins with using a devops service/offering to initialize the applet (currently all applet development will be done in a single eHMP-UI App repo).  The result of this service includes: a new git repository for the applet, seeded based upon an applet template; CI (Jenkins) jobs responsible for reacting to check-in, compiling the HTML/SASS/JavaScript,  running unit and acceptance tests, and publishing the resulting artifact to an artifact repository.

The resulting artifact of an applet will likely include two versions: a development version optimized for debugging (not minified) and a version optimized for production (minified).

The goal of the ADK is to provide the guidelines, constraints, and technology to ensure that teams can efficiently create incremental functionality WITHOUT requiring unscalable close collaboration between development teams.  Yes, collaboration is a good thing.  However, many teams modifying the same code or having to coordinate routine changes is not scalable to an ecosystem of many parallel functional development areas.

::: side-note
The ADK:
- provides a mechanism for applet developers to discover the current patient
- provides a mechanism for applet developers to fetch patient data from vista exchange, can use canonical model (based on VPR) or provide custom "view" model
- provides a mechanism for applet developers to bind data to backbone views, provide templating
- provides a mechanism for applet developers to choose from preselected display paradigms (grid view, pill view, etc) and UI controls.  UI style set by application
- includes a CI pipeline / devops for "compiling" applet, packing, running tests, publishing to artifact repository. This produces a CM-ed version of the applet
- allows applet developers to produce a marionette "view".  The view returned by the applet can be any type of marionette view, CollectionView, CompositeView, ItemView, or LayoutView.  A CompositeView and LayoutView can include additional regions that applet developers have control of to load other sub views.  This often will fall into patterns as below:
    - HTML template for a row using handlebars
    - Creation of backbone view-model
    - Registering these with ADK
:::

## How to build Applets ##
**Make sure to reference the Developer Specific Instructions on how to create/deploy/test an Applet.** <br />(Links to these instructions can be found in the footer)

> **Important**: The applet must also be added to the **appletsManifest** _(/applets/appletsManifest.js)_ by adding a new applet object to the appletsManifest's **applets array** (example code below).
>
> **Note**: specify _true_ for **showInUDWSelection** in order for the applet to display in the User Defined Workspaces' add applet carousel.
> ```JavaScript
> var applets = [{
>       id: 'sample_applet',                    // same as name given to applet on
>                                               //      creation (same as applet folder name)
>       title: 'Sample Applet Display Name',    // what is displayed on title bar
>       maximizeScreen: 'sample-applet-full',   // (optional) screen for maximized version of applet.
>       showInUDWSelection: true                // true to show up in User Defined Workspace Carousel
>   },
>     ...
> }];
> ```

### Basic Applet Structure ###
An applet is made up of marionette "views".  Each applet should have an **applet.js** file that returns an applet object that includes the following attributes:

| Required                                      | Attributes         | Description                                                                       |
|-----------------------------------------------|--------------------|-----------------------------------------------------------------------------------|
|<i class="fa fa-check-circle center"></i>      | **id**             | **unqiue identifier** to reference the applet by                                  |
|<i class="fa fa-check-circle note center">*</i>| **getRootView**    | returns the applet view                                                           |
|<i class="fa fa-check-circle note center">*</i>| **viewTypes**      | an array of applet viewType objects (see description of **viewType object** below)|
|<i class="fa fa-check-circle note center">*</i>| **defaultViewType**| _(string)_ the name of the default viewType to use if not defined in the screen   |

::: callout
 **<i class="fa fa-check-circle note">\*</i> IMPORTANT**: it is required to either have a **getRootView** attribute **or** a **viewTypes** array in an applet configuration.  When specifying a **viewTypes** array, a **defaultViewType** is also _required_ in the applet config.
:::

::: definition
#### **viewType object** - attributes ####
- "**type**" - the viewType id (ex. 'gist', 'summary', 'expanded')
- "**view**" - a marionette view
- "**chromeEnabled**" - boolean <br /> _true_ : wraps your view in a common container that is styled by the ADK _(optional)_ <br /> (_default_: false)
:::

The following is an example **applet.js** file.
```JavaScript
define([], function () {

  var AppletGistView = Backbone.Marionette.ItemView.extend({
      template: _.template('<div>I am a simple Item View</div>'),
  });
  var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
      initialize: function() {
          this.sampleView = new SampleView();
      },
      onRender: function() {
          this.appletMain.show(this.sampleView);
      },
      template: _.template('<div id="sample-applet-main"></div>'),
      regions: {
          appletMain: "#sample-applet-main"
      }
  });
  var applet = {
      id: "sample",
      getRootView: function() {
          return AppletLayoutView;
      },
      viewTypes: [{
          type: 'gist',
          view: AppletGistView,
          chromeEnabled: true
      }, ...]
  };
  return applet;
});
```
::: side-note
### For creating views for use in an applet config an applet developer can either: ###
  - create a custom view using [Marionette][MarionetteViews]'s ItemView, CompositeView, LayoutView ...
  - extend an [ADK.AppletView][AppletViews] or [ADK.BaseDisplayApplet][BaseDisplayApplet] as a starting point
:::

#### Applet Javscript Files ####
For all applet JavaScript files, use the following shell to wrap your applet code, as seen also in the example applet.js file above:
```JavaScript
define([], function () {

  /* Applet Code Goes Here*/

});
```

#### Requiring Libraries / Files from the ADK ####
To use any libraries or include any files into your current javascript, follow the steps below:


1. Add file's file path string to the dependencies array
    - Note: the App's root directory is **.../product/production/**, therefore you simply need to state the remaining file path with the file's extension omitted
    <br />e.g. ".../product/production/app/applets/sampleApplet/helper.js" &#10140; "app/applets/sampleApplet/helper"

    - Note: for including html templates the same rules apply from the previous bullet point, except you also need to prepend the string **"hbs!"** to the file path string
    <br />e.g. ".../product/production/app/applets/sampleApplet/template.html" &#10140; "hbs!app/applets/sampleApplet/template"

2. Add a parameter name to the onResolveDependencies function that is used as a reference to the file.
    - Note: **Order of the array strings and function parameters are very important!** (need to make up to each other)

See below for a full example:
```JavaScript
define([
  "main/ADK",
  "app/applets/sampleApplet/helper",
  "hbs!app/applets/sampleApplet/template"
], function (ADK, AppletHelper, AppletTemplate) {

  /* Note how the dependency strings are in the same order as the parameters above
   *
   * "main/ADK"  "app/applets/sampleApplet/helper"  "hbs!app/applets/sampleApplet/template"
   *    ADK              AppletHelper                          AppletTemplate
   */

  var ItemView = Backbone.Marionette.ItemView.extend({
      template: AppletTemplate, // Referencing template.html
      initialize: function(){
        AppletHelper.helperFunction(); // Referencing helper.js
      }
  });
  ...

});
```

## How to build screens ##
A screen is javascript file that returns a "screen config" object.
To build a screen start off by creating a javascript file in the **"screens" directory** (follow lower camelCase naming convention) and then follow the steps for adding a screen config.

> **Important**: The screen must also be added to the **screensManifest** _(/screens/ScreensManifest.js)_ by pushing new screen object to the screenManifest's **screens array** (example code below)
> ```JavaScript
> screens.push({
>   routeName: 'user-visible-screen-name-url', // the screens's id
>   fileName: 'sampleScreen' // screen's file name with the file's extension omitted
> });
> ```

### Screen Config ###
A screen configuration describes the screen and how it should be built. There are several component options available to keep in mind while building a screen. The configuration determines which applet layout to use and which applets go in which regions within that layout. Various components can be specified to be placed in various regions around the screen. Below is a complete list of accecpted screen config attributes.

| Required         | Attributes              | Description   |
|:----------------:|-------------------------|---------------|
| <i class="fa fa-check-circle center"></i> | **id**                  | **unqiue identifier** that will also be the **url path** to get to the screen <br /> When specifying an id one should always use hypens versus camel case. (e.g. _sample-screen_) |
| <i class="fa fa-check-circle center"></i> | **applets**             | array of **applet screen config objects** to render on the screen <br /> _(see below for more details on a applet screen config)_ |
|                  | **contentRegionLayout** | name of layout to use for center/applet region <br /> _(see choices below)_ |
| <i class="fa fa-check-circle center"></i> | **requiresPatient**     | boolean used to show or hide patient demographic header |
|                  | **onStart**             | method that gets called when the screen is shown  |
|                  | **onStop**              | method that gets called before screen is changed |

**Note**: _the onStart and onStop methods are generally the place to start and stop listening to the screen's applets on their respective channels using ADK.Messaging..._

::: definition
### Applet Screen Config Object ###
An applet screen config object contains the following attributes:
- **id** : _(string)_ the [applet's id](#Basic-Applet-Structure) which is defined in the applet's configuration object
- **title** : _(string)_ visible to user when using [Applet Chrome][AppletChrome]
- **region** : _(string)_ region of the _contentRegionLayout_ in which to display the applet (see below for a list of regions)
- **fullScreen** : _(boolean)(optional)_ true if the applet is the only one on the screen
- **maximizeSceen** : _(string)(optional)_ id of the screen to navigate to when the applet's chrome maximize event is called ([applet chrome details][AppletChrome])
- **viewType** : _(string)_ name of the applet's viewType to display

### Content Region Layouts ###
The following are supported layouts to be used when defining a screen's  **contentRegionLayout** attribute:
| Layout Title            | Regions                                                                                            |
|-------------------------|----------------------------------------------------------------------------------------------------|
| gridOne                 | <div class="c-r-l"><div class="row"><div class="col-md-12"><div>center</div></div></div></div>     |
| fullOne                 | <div class="c-r-l nm"><div class="row"><div class="col-md-12"><div>center</div></div></div></div>  |
| gridTwo                 | <div class="c-r-l"><div class="row"><div class="col-md-6"><div>left</div><div>left2</div><div>left3</div><div>left4</div><div>left5</div></div><div class="col-md-6"><div>right</div><div>right2</div><div>right3</div><div>right4</div><div>right5</div></div></div></div> |
| gridThree               | <div class="c-r-l"><div class="row"><div class="col-md-4"><div>left</div><div>left2</div><div>left3</div><div>left4</div></div><div class="col-md-4"><div>center</div><div>center2</div><div>center3</div><div>center4</div></div><div class="col-md-4"><div>right</div><div>right2</div><div>right3</div><div>right4</div></div></div></div> |
| columnFour              | <div class="c-r-l"><div class="row"><div class="col-md-3"><div>one</div></div><div class="col-md-3"><div>two</div></div><div class="col-md-3"><div>three</div></div><div class="col-md-3"><div>four</div></div></div></div> |

_**Note**_: each layout only supports enough applets to fit one in each region_
:::

### Basic Screen Config ###
Below is an example of a screen's javascript file:

```JavaScript
define([], function () {
  var screenConfig = {
      id: 'user-visible-screen-name-url',
      contentRegionLayout: 'gridOne',
      applets: [{
          id: 'some-applet-id',
          title: 'User Visible Title',
          region: 'center'
      }],
      requiresPatient: true,
      onStart: function() {
        var someAppletChannel = ADK.Messaging.getChannel("someAppletName");
        someAppletChannel.on('someEventToListenTo', someFunctionToBeCalled);
      },
      onStop: function() {
          var someAppletChannel = ADK.Messaging.getChannel("someAppletName");
          someAppletChannel.off('someEventToListenTo', someFunctionToBeCalled);
      }
  };
  return screenConfig;
});
```

[sublimeWebsite]: http://www.sublimetext.com/3
[bsCSS]: http://getbootstrap.com/css/
[bsComponents]: http://getbootstrap.com/components/
[bsJQ]: http://getbootstrap.com/javascript/
[backboneWebPage]: http://backbonejs.org/
[marionetteWebPage]: https://github.com/marionettejs/backbone.marionette/tree/master/docs
[requireJsWebPage]: http://requirejs.org/
[amdWebPage]: http://requirejs.org/docs/whyamd.html
[handlebarsWebPage]: http://handlebarsjs.com/
[underscoreFilterWebPage]: http://underscorejs.org/#filter
[BackboneRadio]: https://github.com/marionettejs/backbone.radio
[sass]: http://sass-lang.com/
[appletLevelConventions]: adk/conventions.md#Applet-Level-Conventions
[BaseDisplayApplet]: adk/using-adk.md#BaseDisplayApplet
[AppletViews]: adk/using-adk.md#ADK-AppletViews
[MarionetteViews]: http://marionettejs.com/docs/v2.4.1/marionette.view.html
[AppletChrome]: adk/using-adk.md#Applet-Chrome
