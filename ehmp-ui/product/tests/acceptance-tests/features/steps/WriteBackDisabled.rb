path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class WriteBackDisable < AccessBrowserV2
  include Singleton

  def initialize
    super
    #Plus button on applets
    add_action(CucumberLabel.new("VitalsPlusButton"), ClickAction.new, AccessHtmlElement.new(:css, '[title="Vitals"] button.applet-add-button'))
    add_action(CucumberLabel.new("ImmunizationsPlusButton"), ClickAction.new, AccessHtmlElement.new(:css, '[title="Immunizations"] button.applet-add-button'))
    add_action(CucumberLabel.new("ConditionPlusButton"), ClickAction.new, AccessHtmlElement.new(:css, '[title="Conditions"] button.applet-add-button'))
    add_action(CucumberLabel.new("AllergyPlusButton"), ClickAction.new, AccessHtmlElement.new(:css, '[title="Allergies"] button.applet-add-button'))
    add_action(CucumberLabel.new("Add Non-VA-Med button"), ClickAction.new, AccessHtmlElement.new(:css, "#add-non-va-med-btn"))
    #expandApplets
    add_action(CucumberLabel.new("Condition"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .applet-maximize-button"))
    add_action(CucumberLabel.new("Allergy"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='allergy_grid'] .grid-resize button"))
    add_action(CucumberLabel.new("Vitals"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='vitals'] .applet-maximize-button"))
    add_action(CucumberLabel.new("Immunizations"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=immunizations] .applet-maximize-button"))
    add_action(CucumberLabel.new("New Observation Button"), ClickAction.new, AccessHtmlElement.new(:id, 'new-observation'))
  end
end

Then(/^the "(.*?)" is not visible$/) do |element|
  con = WriteBackDisable.instance
  driver = TestSupport.driver
  expect(con.static_dom_element_exists?(element)).to be_false
end
  
When(/^the "(.*?)" applet expanded$/) do |element|
  con = WriteBackDisable.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  expect(con.perform_action(element, "")).to be_true
end

Then(/^the "(.*?)" is visible$/) do |element|
  con = WriteBackDisable.instance
  driver = TestSupport.driver
  expect(con.static_dom_element_exists?(element)).to be_true
end
