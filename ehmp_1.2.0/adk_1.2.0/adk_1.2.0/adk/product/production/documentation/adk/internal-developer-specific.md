::: page-description
# Internal Developer Specific Instructions #
Outlines Tasks and Conventions Specific to developers on the VistaCore/Tangent Project.
:::

## Applet Level Instructions ##
### Building Applets ###

Applets _must_ be created using the "**createApplet**" task.  Applet directories should not be manually created or deleted in the root applets directory.   The "createApplet" task will prompt for an applet name and create the applet directory for you along with additional tasks for deploying your applet (e.g. **deploy[applet name]**).  - Make sure to issue a commit for this initial applet creation before continuing.

### Deploying an Applet ###
To deploy your applet locally run the :`deploy[applet name]` task

The applet will be deployed to http://10.1.1.150:8080.  The "test nav" with links for showing your applet in different layouts including "full" view will be displayed.

You can see how your applet responds to changes in size when you cycle through _"Full"_, _"Half"_, and _"Quarter"_. Keep in mind that your applet may be used in different frame sizes when screen layouts are created and develop your applet accordingly.

### Applet Testing ###
Make sure that you run all tests (acceptance / unit) _locally_ before you commit/push any code changes to the repository.
(aka. Keep the build **_Green_**)

#### Applet Unit Testing ####
For Applet Unit Testing, each applet should have it's own test/unit directory.  The tests can be run with the `test[applet name]` task.

Here is look at an example **.js** unit test file:

```JavaScript
/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */
'use strict';
// Jasmine Unit Testing Suite
define(["jquery", "backbone", "marionette", "jasminejquery"],
    function ($, Backbone, Marionette) {

        //replace below with your own tests
        describe("A suite", function() {
            it("contains spec with an expectation", function() {
                expect(true).toBe(true);
            });
        });

    });
```

#### Applet Acceptance Testing ####
For Applet Acceptance Testing, each applet should have it's own test/acceptance-tests directory.  This directory should have a **features** folder that contains the **.feature** file as well as a folder called **steps** that holds all supporting **.rb** step files.

```
- applets
   - allergies
     - test
       - acceptance-tests
          - features
             F117_AllergiesApplet.feature
             - steps
               adk_steps.rb
               allergies_applet_load_path.rb
               keycapabilities_step.rb
               view_screen_steps.rb
               ...
```
In the **production/applets** directory there is a folder called **test_resources** that contains the common/shared resources used in applet acceptance testing.

```
 - production
   - applets
      - test_resources
         Gemfile
         + helper
         Rakefile
         + shared-test-ruby
```

Here is look at an example applet acceptance test **.feature** file:

```Feature
@F117
Feature: Allergies Applet Test
@allergies_applet
Scenario: First test to verify allergies applet
    Given user is logged into allergies applet in the browser
    Then the search results display 2 results
    Given user selects patient 0 in the list
    Then the panel title is "Allergies"
```

Here is look at an example applet acceptance test **steps** or **.rb** file:

```Ruby
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'AccessBrowserV2.rb'
class Allergies < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Allergies Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#applet-main h3.panel-title"))
  end
end
Given(/^user is logged into allergies applet in the browser$/) do
  con= LoginHTMLElements.instance
    #p DefaultLogin.ehmpui_url
  #p 'start'
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
  #p 'end'
  TestSupport.wait_for_page_loaded
  #sleep 100
  TestSupport.driver.manage.window.maximize
end
```
