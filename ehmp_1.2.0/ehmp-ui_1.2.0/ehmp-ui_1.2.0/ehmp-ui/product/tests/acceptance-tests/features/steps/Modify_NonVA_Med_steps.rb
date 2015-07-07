path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class ModifyNonVAMedsTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("ViewingDateRangeButton"), ClickAction.new, AccessHtmlElement.new(:id, "date-region2"))
    add_action(CucumberLabel.new("AllDatesLink"), ClickAction.new, AccessHtmlElement.new(:id, "all-range-global"))
    add_verify(CucumberLabel.new("MedsList"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#Non-VAGroup"))
    add_action(CucumberLabel.new("Non-VA"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='medicationsAccordion']/descendant::*[@data-target='#list_Non-VA']"))
    add_action(CucumberLabel.new("ExpandMedPanel"), ClickAction.new, AccessHtmlElement.new(:xpath, "(//div[@id='medGroupItem']/div[2])[6]"))
    add_action(CucumberLabel.new("ClickModifyButton"), ClickAction.new, AccessHtmlElement.new(:css, "#edit"))
    add_verify(CucumberLabel.new("DosageCorrect"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "(//div[@id='order-detail-panel']/div[1]/div[1]/p[1]/span[1])[6]"))
    add_action(CucumberLabel.new("ClickCancelButton"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-non-va-med-cancel"))
    add_action(CucumberLabel.new("Non-VA_label"), ClickAction.new, AccessHtmlElement.new(:id, "Non-VAGroup"))
  end
end

Then(/^the Med user expands Non-VA med$/) do
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Non-VA_label", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Non-VA_label")).to be_true
  con.perform_action("Non-VA_label")
end

Then(/^the Med user clicks view date range button$/) do
  con = ModifyNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ViewingDateRangeButton", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("ViewingDateRangeButton")).to be_true
  con.perform_action("ViewingDateRangeButton")
end

Then(/^the Med Review list contains "([^"]*)"$/) do |element|
  con = ModifyNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedsList", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("MedsList")).to be_true
  expect(con.perform_verification("MedsList", element)).to be_true
  con.wait_until_action_element_visible("Non-VA", DefaultLogin.wait_time)
end

Then(/^the Med user expands "([^"]*)" panel$/) do |element|
  con = ModifyNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Non-VA", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Non-VA")).to be_true
  con.perform_action("Non-VA", element)
end

Then(/^the Med user expands "([^"]*)" med panel$/) do |element|
  con = ModifyNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ExpandMedPanel", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("ExpandMedPanel")).to be_true
  con.perform_action("ExpandMedPanel", element)
end

When(/^the Med user clicks "([^"]*)" button$/) do |element|
  con = ModifyNonVAMedsTest.instance
  driver = TestSupport.driver

  if element == "Modify"
    button_label = "ClickModifyButton"
  else
    button_label = "ClickCancelButton"
  end
  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
end

Then(/^the Med has "([^"]*)"$/) do |element|
  con = ModifyNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("DosageCorrect", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("DosageCorrect")).to be_true
  expect(con.perform_verification("DosageCorrect", element)).to be_true
end
