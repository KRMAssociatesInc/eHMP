class ScreenEditor < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Workspace Manager"), ClickAction.new, AccessHtmlElement.new(:id, "workspace-manager-button"))
    add_action(CucumberLabel.new("Add New Worksheet"), ClickAction.new, AccessHtmlElement.new(:id, "addScreen"))
    add_action(CucumberLabel.new("Add New Workspace"), ClickAction.new, AccessHtmlElement.new(:css, "i.fa-plus"))
    add_action(CucumberLabel.new("Title Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "screen-title"))  
    add_action(CucumberLabel.new("Description Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "screen-description")) 
    add_action(CucumberLabel.new("Add and Load"), ClickAction.new, AccessHtmlElement.new(:css, ".btn.btn-primary.addLoadButton"))
    add_action(CucumberLabel.new("Launch"), ClickAction.new, AccessHtmlElement.new(:css, "li.launch-worksheet:nth-child(5)")) 
    add_action(CucumberLabel.new("Delete Workspace"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.manageOptions.manager-open > ul > li.delete-worksheet > i")) 
    add_action(CucumberLabel.new("Open Menu"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div.col-xs-1 > i.fa-ellipsis-v")) 
    add_action(CucumberLabel.new("Plus Button"), ClickAction.new, AccessHtmlElement.new(:id, "plus-button"))
    add_action(CucumberLabel.new("Done"), ClickAction.new, AccessHtmlElement.new(:id, "exitEditing"))
    add_action(CucumberLabel.new("workspace1"), ClickAction.new, AccessHtmlElement.new(:css, "#screens-carousel > div:nth-child(2) > div.carousel-inner > div > div:nth-child(6)")) 
    add_action(CucumberLabel.new("Workspace Manager Delete Button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.addEditFormRegion > div > div > div:nth-child(4) > div.col-md-2 > button")) 
    # add_action(CucumberLabel.new("Confirm Delete"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.deleteActiveRegion > div > div > div:nth-child(2) > div.col-md-40.text-right > button.btn.btn-danger.deleteActiveScreen")) 
    add_action(CucumberLabel.new("Confirm Delete"), ClickAction.new, AccessHtmlElement.new(:id, "workspace-delete")) 
    #add_action(CucumberLabel.new("Allergies Gist View"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.applet-gridster > div.gridsterContainer > div > ul > li > div > div > ul > li > div ")) 
    #add_action(CucumberLabel.new("Allergies Gist View"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion .gridsterContainer .options-panel .options-box.gist")) 
    add_action(CucumberLabel.new("Allergies Gist View"), ClickAction.new, AccessHtmlElement.new(:css, "#applet-1 > div > div.options-list > ul > li:nth-child(1) > div.options-box.gist"))
    add_action(CucumberLabel.new("Workspace Manager Close"), ClickAction.new, AccessHtmlElement.new(:id, "doneEditing")) 
    add_action(CucumberLabel.new("Appointments Summary View"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.applet-gridster > div.gridsterContainer > div > ul(2) > li > div > div > ul > li > div ")) 
    add_action(CucumberLabel.new("Appointments Summary applet"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.applet-gridster > div.gridsterContainer > div > ul(2) > li > div > div > ul > li > div ")) 
    add_action(CucumberLabel.new("Lab Results Expanded View"), ClickAction.new, AccessHtmlElement.new(:css, ".expanded")) 
    add_action(CucumberLabel.new("Vitals Summery View"), ClickAction.new, AccessHtmlElement.new(:css, "#vitals > div > div.options-list > ul > li:nth-child(2) > div.options-box.summary")) 
    add_action(CucumberLabel.new("Orders Summery View"), ClickAction.new, AccessHtmlElement.new(:css, "div.summary")) 
    add_action(CucumberLabel.new("Condition Expanded View"), ClickAction.new, AccessHtmlElement.new(:css, ".expanded")) 
    add_action(CucumberLabel.new("Workspace Test"), ClickAction.new, AccessHtmlElement.new(:id, "user-defined-workspace-1"))
    add_action(CucumberLabel.new("Stacked Graph expanded view"), ClickAction.new, AccessHtmlElement.new(:css, "#applet-1 > div > div.options-list > ul > li.viewType-optionsBox.col-xs-3.col-xs-offset-3 > div.options-box.expanded")) 
  end
  
  def click_on_workspace(workspace_name)
    workspace_xpath = "//p[contains(string(),'#{workspace_name}')]"
    p workspace_xpath
    add_action(CucumberLabel.new("My Workspace Name"), ClickAction.new, AccessHtmlElement.new(:xpath, workspace_xpath))
    # deliberate use of wait time other then the DefaultLogin.wait_time
    return false unless wait_until_element_present("My Workspace Name", 60)
    return perform_action("My Workspace Name")
  end 
end #ScreenEditor
 
When(/^that a user defined screen has been created$/) do
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  screen.wait_until_action_element_visible("Add New Worksheet", 40)
  TestSupport.driver.manage.window.maximize
  expect(screen.perform_action("Add New Worksheet")).to be_true, "Error when attempting to click on Add New Workspace"
  screen.wait_until_action_element_visible("Title Field", 40)
  expect(screen.perform_action("Title Field", "test")).to be_true, "Error when attempting to enter test into the Title Field"
  expect(screen.perform_action("Description Field", "test")).to be_true, "Error when attempting to enter test into the Description Field"
  expect(screen.perform_action("Add and Load")).to be_true, "Error when attempting to click on Add and Load"
end

When(/^delete the test screen$/) do
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  TestSupport.driver.manage.window.maximize
  screen.wait_until_action_element_visible("workspace1", 40)
  expect(screen.perform_action("workspace1")).to be_true, "Error when attempting to click on workspace 1"
  screen.wait_until_action_element_visible("Workspace Manager Delete Button", 40)
  expect(screen.perform_action("Workspace Manager Delete Button")).to be_true, "Error when attempting to click on Workspace Manager Delete Button"
  screen.wait_until_action_element_visible("Confirm Delete", 40)
  expect(screen.perform_action("Confirm Delete")).to be_true, "Error when attempting to click on Confirm Delete"
  screen.wait_until_action_element_invisible("Workspace Test", 40) 
  expect(screen.perform_action("Workspace Manager Close")).to be_true, "Workspace Manager Close"
end

When(/^user creates a workspace named "(.*?)"$/) do |workspace_name|
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  screen.wait_until_action_element_visible("Add New Worksheet", 40)
  TestSupport.driver.manage.window.maximize
  expect(screen.perform_action("Add New Worksheet")).to be_true, "Error when attempting to click on Add New Workspace"
  screen.wait_until_action_element_visible("Title Field", 40)
  expect(screen.perform_action("Title Field", workspace_name)).to be_true, "Error when attempting to enter test into the Title Field"
  expect(screen.perform_action("Description Field", workspace_name)).to be_true, "Error when attempting to enter test into the Description Field"
  expect(screen.perform_action("Add and Load")).to be_true, "Error when attempting to click on Add and Load"
end

When(/^user deletes workspace named "(.*?)"$/) do |workspace_name|
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  TestSupport.driver.manage.window.maximize
  expect(screen.click_on_workspace(workspace_name)).to be_true
  screen.wait_until_action_element_visible("Workspace Manager Delete Button", 40)
  expect(screen.perform_action("Workspace Manager Delete Button")).to be_true, "Error when attempting to click on Workspace Manager Delete Button"
  screen.wait_until_action_element_visible("Confirm Delete", 40)
  expect(screen.perform_action("Confirm Delete")).to be_true, "Error when attempting to click on Confirm Delete"
  screen.wait_until_action_element_invisible("Workspace Test", 40) 
  expect(screen.perform_action("Workspace Manager Close")).to be_true, "Workspace Manager Close"
end

When(/^user clicks "(.*?)" on the screen editor$/) do |html_action_element|
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible(html_action_element, 40)
  expect(screen.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

Then(/^drag and drop the Allergies preview right by ((?:\-)?\d+) and down by ((?:\-)?\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  applet_preview = driver.find_element(:css, "#gridster2 > ul > li")
  driver.action.drag_and_drop_by(applet_preview, right_by, down_by).perform
end

Then(/^drag and drop the Allergies applet right by ((?:\-)?\d+) and down by ((?:\-)?\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  applet_preview = driver.find_element(:css, "#content-region > div > div > div > div > div > div > div > div")
  driver.action.drag_and_drop_by(applet_preview, right_by, down_by).perform
end

Then(/^resize the Allergies applet to the right by ((?:\-)?\d+) and down by ((?:\-)?\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  applet_preview = driver.find_element(:css, "#gridster2 > ul > li > div > span")
  driver.action.drag_and_drop_by(applet_preview, right_by, down_by).perform
end
