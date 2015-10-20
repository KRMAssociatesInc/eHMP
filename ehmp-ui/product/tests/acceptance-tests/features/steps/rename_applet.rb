class RenameApplet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Applet Option button"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-options-button- > span"))
    # add_action(CucumberLabel.new("Header Rename"), SendKeysAndTabAction.new, AccessHtmlElement.new(:css, "#applet-1 > div > div > div.panel-heading.grid-applet-heading > span.panel-title.center-block.text-center > input"))
    add_action(CucumberLabel.new("Header Rename"), SendKeysAction.new, AccessHtmlElement.new(:css, "#applet-1 > div > div > div.panel-heading.grid-applet-heading > span.panel-title.center-block.text-center > input"))
    add_verify(CucumberLabel.new("Header Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".panel-title-label"))
    add_verify(CucumberLabel.new("Tooltip Message"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".tooltip"))
    add_action(CucumberLabel.new("Confirm Deleting Workspace"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-delete']"))
    add_action(CucumberLabel.new("New Workspace"), ClickAction.new, AccessHtmlElement.new(:id, "user-defined-workspace-1"))
  end
end 

Then(/^user scrolls the window to bring applet 1 to view$/) do 
  driver = TestSupport.driver
  element = driver.find_element(:css, "#applet-1")
  element.location_once_scrolled_into_view
end

When(/^enters "(.*?)" to the header text$/) do |new_text|
  p "in"
  screen = RenameApplet.instance
  screen.wait_until_action_element_visible("Header Rename", DefaultLogin.wait_time)
  input_element = screen.get_element("Header Rename")

  for i in 0...input_element.attribute("value").size
    input_element.send_keys(:backspace)
  end
  expect(screen.perform_action("Header Rename", new_text)).to be_true
  input_element.send_keys [:tab]
end

Then(/^applet with title "(.*?)" is displayed$/) do |title_text|
  screen = RenameApplet.instance
  screen.wait_until_action_element_visible("Header Title", DefaultLogin.wait_time)
  # expect(screen.wait_until_action_element_visible("Header Title", title_text)).to be_true
  expect(screen.perform_verification("Header Title", title_text)).to be_true
end

Then(/^a tooltip is displayed containing message "(.*?)"$/) do |tooltip_text|
  screen = RenameApplet.instance
  screen.wait_until_action_element_visible("Tooltip Message", DefaultLogin.wait_time)
  # expect(screen.wait_until_action_element_visible("Header Title", title_text)).to be_true
  expect(screen.perform_verification("Tooltip Message", tooltip_text)).to be_true
end

When(/^user creates a user defined workspace$/) do
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  screen.wait_until_action_element_visible("Add New Workspace", 40)
  TestSupport.driver.manage.window.maximize
  expect(screen.perform_action("Add New Workspace")).to be_true, "Error when attempting to click on Add New Workspace"
  expect(screen.perform_action("Open Menu")).to be_true, "Error when attempting to Open Menu"
  screen.wait_until_action_element_visible("Launch", 40)
  expect(screen.perform_action("Launch")).to be_true, "Error when attempting to click on Add and Load"
end

When(/^user opens the newly created workspce$/) do
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  screen.wait_until_action_element_visible("Add New Worksheet", 40)
  TestSupport.driver.manage.window.maximize
  expect(screen.perform_action("Add New Workspace")).to be_true, "Error when attempting to click on Add New Workspace"
  expect(screen.perform_action("Open Menu")).to be_true, "Error when attempting to Open Menu"
  screen.wait_until_action_element_visible("Launch", 40)
  expect(screen.perform_action("Launch")).to be_true, "Error when attempting to click on Add and Load"
end

When(/^user deletes the newly created workspace$/) do
  screen = ScreenEditor.instance
  screen.wait_until_action_element_visible("Workspace Manager", 40)
  expect(screen.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
  TestSupport.driver.manage.window.maximize
  expect(screen.perform_action("Open Menu")).to be_true, "Error when attempting to Open Menu"
  screen.wait_until_action_element_visible("Delete Workspace", 40)
  expect(screen.perform_action("Delete Workspace")).to be_true, "Error when attempting to click on Add and Load"
end






