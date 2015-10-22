class CIW < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Workspace Manager"), ClickAction.new, AccessHtmlElement.new(:id, "workspace-manager-button"))
    add_action(CucumberLabel.new("Add New Workspace"), ClickAction.new, AccessHtmlElement.new(:css, ".addScreen"))
    add_action(CucumberLabel.new("Done Editing"), ClickAction.new, AccessHtmlElement.new(:id, "doneEditing"))
    add_action(CucumberLabel.new("Workspace-Name Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, ".workspaceTable .editor-title > input"))
    add_action(CucumberLabel.new("Workspace-Description Text Filter"), SendKeysAction.new, AccessHtmlElement.new(:css, ".workspaceTable .editor-description > input"))
    add_verify(CucumberLabel.new("User Defined Workspace 1"), VerifyContainsText.new, AccessHtmlElement.new(:id, "user-defined-workspace-1"))
    add_verify(CucumberLabel.new("User Defined Workspace 2"), VerifyContainsText.new, AccessHtmlElement.new(:id, "user-defined-workspace-2"))
    add_action(CucumberLabel.new("Associate Problems Button - User Defined Workspace 1"), ClickAction.new, AccessHtmlElement.new(:id, "association-trigger-user-defined-workspace-1"))
    add_action(CucumberLabel.new("Associate Problems Button - User Defined Workspace 2"), ClickAction.new, AccessHtmlElement.new(:id, "association-trigger-user-defined-workspace-2"))
    add_action(CucumberLabel.new("More Options Button - User Defined Workspace 1"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 .fa.fa-ellipsis-v"))
    add_action(CucumberLabel.new("More Options Button - User Defined Workspace 2"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 .fa.fa-ellipsis-v"))
    add_action(CucumberLabel.new("Delete Workspace Button - User Defined Workspace 1"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 .delete-worksheet"))
    add_action(CucumberLabel.new("Delete Workspace Button - User Defined Workspace 2"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 .delete-worksheet"))
    add_action(CucumberLabel.new("Delete Workspace Confirm"), ClickAction.new, AccessHtmlElement.new(:css, "#workspace-delete"))
    add_action(CucumberLabel.new("Search Problem Text field"), SendKeysAction.new, AccessHtmlElement.new(:id, "screen-problem-search"))
    add_verify(CucumberLabel.new("Problem Result"), VerifyContainsText.new, AccessHtmlElement.new(:class, "problem-result"))
    add_action(CucumberLabel.new("Manic bipolar I disorder - Problem Text"), ClickAction.new, AccessHtmlElement.new(:id, "problem-result-68569003"))
    add_action(CucumberLabel.new("Recurrent manic episodes - Problem Text"), ClickAction.new, AccessHtmlElement.new(:id, "problem-result-191590005"))
    add_action(CucumberLabel.new("Essential hypertension - Problem Text"), ClickAction.new, AccessHtmlElement.new(:id, "problem-result-59621000"))
    add_verify(CucumberLabel.new("Associated Problems List"), VerifyContainsText.new, AccessHtmlElement.new(:class, "popover-content"))
    add_verify(CucumberLabel.new("No Results"), VerifyContainsText.new, AccessHtmlElement.new(:id, "no-results-text"))
    add_action(CucumberLabel.new("Manic bipolar I disorder - Remove Text"), ClickAction.new, AccessHtmlElement.new(:id, "remove-problem-68569003"))
    
    essential_hypertension_xpath = "//*[@id='event_urn_va_problem_9E7A_711_79']"
    applet_toolbar_xpath = "preceding-sibling::div[@class='appletToolbar']"
    add_action(CucumberLabel.new("Essential Hypertension CIW Icon"), ClickAction.new, AccessHtmlElement.new(:xpath, "#{essential_hypertension_xpath}/#{applet_toolbar_xpath}/descendant::*[@id='submenu-button-toolbar']"))
    add_verify(CucumberLabel.new("User Defined Workspace 1 - Link Text Verify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .dropdown-menu>li:nth-child(2)"))   #.dropdown-menu>li>a
    add_verify(CucumberLabel.new("User Defined Workspace 2 - Link Text Verify"), VerifyContainsText.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .dropdown-menu>li:nth-child(3)"))
    add_action(CucumberLabel.new("User Defined Workspace 1 - Link Text"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .dropdown-menu>li:nth-child(2)"))
    add_action(CucumberLabel.new("User Defined Workspace 2 - Link Text"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .dropdown-menu>li:nth-child(3)"))
    add_verify(CucumberLabel.new("User Defined Workspace 1 - Screen Name"), VerifyText.new, AccessHtmlElement.new(:css, "#screenName"))
  end
end #CIW

Given(/^user navigates to User Defined Workspace manager$/) do
  aa = CIW.instance
  aa.wait_until_action_element_visible("Workspace Manager", DefaultLogin.wait_time)
  expect(aa.perform_action("Workspace Manager")).to be_true, "Error when attempting to open Workspace Manager"
end

Given(/^user creates New User defined workspace "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  aa.wait_until_action_element_visible("Add New Workspace", DefaultLogin.wait_time)
  if !aa.am_i_visible?(workspace_name)    
    expect(aa.perform_action("Add New Workspace")).to be_true, "Error when attempting to click on Add New Workspace"
    expect(aa.wait_until_element_present(workspace_name, DefaultLogin.wait_time)).to be_true, "User Defined Workspace #{workspace_name} is not present"
  else
    expect(aa.am_i_visible?(workspace_name)).to be_true, "Workspace #{workspace_name} already exists"
  end
end

Given(/^user names the workspace "(.*?)" with description "(.*?)"$/) do |workspace_name, description|
  aa = CIW.instance
  aa.wait_until_action_element_visible("Workspace-Name Text Filter", DefaultLogin.wait_time)
  expect(aa.perform_action("Workspace-Name Text Filter", "")).to be_true, "Error when deleting the workspace name"
  expect(aa.perform_action("Workspace-Name Text Filter", workspace_name)).to be_true, "Error when changing the workspace name"
  aa.wait_until_action_element_visible("Workspace-Description Text Filter", DefaultLogin.wait_time)
  expect(aa.perform_action("Workspace-Description Text Filter", description)).to be_true, "Error when changing the workspace description"
end

Given(/^user closes the user defined work space manager$/) do
  aa = CIW.instance
  aa.wait_until_action_element_visible("Done Editing", DefaultLogin.wait_time)
  expect(aa.perform_action("Done Editing")).to be_true, "Error when attempting to close Workspace Manager"
end
     
When(/^user clicks on association button on "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.wait_until_element_present("Associate Problems Button" + " - " + workspace_name, DefaultLogin.wait_time)).to be_true, "Associate Problem button is not present"
  expect(aa.perform_action("Associate Problems Button"+ " - " + workspace_name, "")).to be_true, "Error when attempting to click on Search Problem button"  
end

Then(/^user sees the search problems text field$/) do
  aa = CIW.instance
  expect(aa.wait_until_element_present("Search Problem Text field", DefaultLogin.wait_time)).to be_true, "Search Problmes screen did not display"
end

When(/^user enters "(.*?)" in the search problems text field$/) do |problem_text|
  aa = CIW.instance
  expect(aa.wait_until_element_present("Search Problem Text field", DefaultLogin.wait_time)).to be_true, "Search Problmes screen did not display"
  expect(aa.perform_action("Search Problem Text field", problem_text)).to be_true, "Error when attempting to enter text on Search Problem button"
end

Then(/^a suggestion list is displayed to the user$/) do
  aa = CIW.instance
  expect(aa.wait_until_element_present("Problem Result", DefaultLogin.wait_time)).to be_true, "List of suggested problems didn't display"
end

Then(/^user chooses "(.*?)" from the suggestion list$/) do |problem_text|
  aa = CIW.instance
  expect(aa.wait_until_element_present(problem_text + " - Problem Text", DefaultLogin.wait_time)).to be_true, "User not able to choose this particular problem from suggestion list"
  expect(aa.perform_action(problem_text + " - Problem Text")).to be_true, "Unable to choose the selected problem"
end

Then(/^the selected problem "(.*?)" is added to associated problems list$/) do |problem_text|
  aa = CIW.instance
  expect(aa.wait_until_element_present("Associated Problems List", DefaultLogin.wait_time)).to be_true, "User not able to choose this particular problem from suggestion list"
  expect(aa.perform_verification("Associated Problems List", problem_text)).to be_true, "Problem not found in the Associated problems list"
end

When(/^user clicks on more options button on "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.wait_until_element_present("More Options Button" + " - " + workspace_name, DefaultLogin.wait_time)).to be_true, "Unable to locate more options for the workspace #{workspace_name}"
  expect(aa.perform_action("More Options Button" + " - " + workspace_name)).to be_true, "Unable to locate more options for the workspace #{workspace_name}"
end

Then(/^user sees the option to delete the workspace "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.wait_until_element_present("Delete Workspace Button" + " - " + workspace_name, DefaultLogin.wait_time)).to be_true, "User not able to see Delete Workspace option"
end

Then(/^user should confirm "(.*?)" can be deleted$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.wait_until_element_present("Delete Workspace Confirm", DefaultLogin.wait_time)).to be_true, "User not able to see Delete Workspace option"
  expect(aa.perform_action("Delete Workspace Confirm")).to be_true, "Unable to delete workspace #{workspace_name}"
end

When(/^user chooses delete from workspace "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.perform_action("Delete Workspace Button" + " - " + workspace_name)).to be_true, "Unable to locate delete for the workspace #{workspace_name}"
end

Then(/^the workspace "(.*?)" is deleted$/) do |workspace_name|
  aa = CIW.instance
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { !aa.am_i_visible?(workspace_name) }
end

Then(/^the problem "(.*?)" from the suggestion list is disabled$/) do |problem_text|
  aa = CIW.instance
  driver = TestSupport.driver
  expect(aa.wait_until_element_present(problem_text + " - " + "Problem Text", DefaultLogin.wait_time)).to be_true, "User not able to see Delete Workspace option"
  case problem_text
  when 'Manic bipolar I disorder'
    element = driver.find_element(:xpath, "//*[@id='problem-result-68569003']")
  when 'Recurrent manic episodes'
    element = driver.find_element(:xpath, "//*[@id='problem-result-191590005']")
  else
    fail "**** No function found! Check your script ****"
  end
  class_name = element.attribute("class")
  p class_name
  expect(class_name).to include("disabled"), "The problem text is not disabled"
end

Then(/^the problem "(.*?)" from the suggestion list is enabled again$/) do |problem_text|
  aa = CIW.instance
  driver = TestSupport.driver
  expect(aa.wait_until_element_present(problem_text + " - " + "Problem Text", DefaultLogin.wait_time)).to be_true, "User not able to see Delete Workspace option"
  case problem_text
  when 'Manic bipolar I disorder'
    element = driver.find_element(:xpath, "//*[@id='problem-result-68569003']")
  when 'Recurrent manic episodes'
    element = driver.find_element(:xpath, "//*[@id='problem-result-191590005']")
  else
    fail "**** No function found! Check your script ****"
  end
  
  class_name = element.attribute("class")
  p class_name
  expect(class_name).should_not include("disabled"), "The problem text is not disabled"
end

When(/^user deletes the problem "(.*?)" from the associated problems list$/) do |problem_text|
  aa = CIW.instance
  expect(aa.perform_action(problem_text + " - " + "Remove Text")).to be_true, "Unable to locate delete icon for the problem #{problem_text}"
end

Then(/^a suggestion list says "(.*?)" on "(.*?)"$/) do |no_results_text, workspace_name|
  aa = CIW.instance
  expect(aa.perform_verification(no_results_text, no_results_text)).to be_true, "No Results found is not displayed" 
  #close the association search box
  expect(aa.perform_action("Associate Problems Button - " + workspace_name)).to be_true, "Unable to locate association icon for the workspace #{workspace_name}" 
end

When(/^user navigates back to overview screen$/) do
  navigate_in_ehmp '#overview'
end

Then(/^user selects the "(.*?)" CIW icon in Conditions Gist$/) do |arg1|
  aa = CIW.instance
  label = "#{arg1} CIW Icon"
  expect(aa.perform_action(label)).to be_true
end

Then(/^user is presented with two associated workspace "(.*?)" and "(.*?)"$/) do |arg1, arg2|
  aa = CIW.instance
  expect(aa.wait_until_element_present(arg1 + " - Link Text Verify", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(arg1 + " - Link Text Verify", arg1)).to be_true, "#{arg1} workspace not found under CIW icon"
  expect(aa.perform_verification(arg2 + " - Link Text Verify", arg2)).to be_true, "#{arg2} workspace not found under CIW icon"
end

When(/^user chooses the associated workspace "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.wait_until_element_present(workspace_name + " - Link Text", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action(workspace_name + " - Link Text")).to be_true, "#{workspace_name} workspace not found under CIW icon"
end

Then(/^user is navigated to the custom workspace "(.*?)"$/) do |workspace_name|
  aa = CIW.instance
  expect(aa.wait_until_element_present(workspace_name + " - Screen Name", DefaultLogin.wait_time)).to be_true  
  expect(aa.perform_verification(workspace_name + " - Screen Name", workspace_name)).to be_true
end


