path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class NewOutpatientMedOrderONC < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Coversheet Dropdown Menu"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
    add_action(CucumberLabel.new("Medication Review"), ClickAction.new, AccessHtmlElement.new(:link, "Meds Review"))
    add_action(CucumberLabel.new("Outpatient Med"), ClickAction.new, AccessHtmlElement.new(:id, "outpatientMeds"))
    add_verify(CucumberLabel.new("SIMVASTATIN_TAB"), VerifyContainsText.new, AccessHtmlElement.new(:link, "SIMVASTATIN TAB"))
    add_verify(CucumberLabel.new("LORAZEPAM_TAB"), VerifyContainsText.new, AccessHtmlElement.new(:link, "LORAZEPAM TAB"))
    add_verify(CucumberLabel.new("LANTUS"), VerifyContainsText.new, AccessHtmlElement.new(:link, "LANTUS <PRAMLINTIDE PEN INJ,SOLN >"))
    add_action(CucumberLabel.new("Primary Care"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:149:A;2940218.1;32"))
    add_action(CucumberLabel.new("Add Med Order"), ClickAction.new, AccessHtmlElement.new(:link, "Add Medication Order"))
  end
end

When(/^user selects Medication Review from Coversheet dropdown$/) do
  aa = NewOutpatientMedOrderONC.instance
  expect(aa.wait_until_action_element_visible("Coversheet Dropdown Menu", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Coversheet Dropdown Menu", "")).to be_true
  expect(aa.wait_until_action_element_visible("Medication Review", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Medication Review", "")).to be_true
end

Given(/^the user clicks outpatient med/) do 
  con = NewOutpatientMedOrderONC.instance
  expect(con.perform_action("Outpatient Med")).to be_true
end

Given(/^the user selects Primary Care/) do 
  con = NewOutpatientMedOrderONC.instance
  con.wait_until_action_element_visible("Primary Care", DefaultLogin.wait_time)
  expect(con.perform_action("Primary Care")).to be_true
end

Then(/^the Med search results contains ONC item-1 "([^"]*)"$/) do |med_name|
  con = NewOutpatientMedOrderONC.instance
  con.wait_until_action_element_visible("SIMVASTATIN_TAB", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("SIMVASTATIN_TAB")).to be_true
  expect(con.perform_verification("SIMVASTATIN_TAB", med_name)).to be_true
end

Then(/^the Med search results contains ONC item-2 "([^"]*)"$/) do |med_name|
  con = NewOutpatientMedOrderONC.instance
  con.wait_until_action_element_visible("LORAZEPAM_TAB", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("LORAZEPAM_TAB")).to be_true
  expect(con.perform_verification("LORAZEPAM_TAB", med_name)).to be_true
end

Then(/^the Med search results contains ONC item-3 "([^"]*)"$/) do |med_name|
  con = NewOutpatientMedOrderONC.instance
  con.wait_until_action_element_visible("LANTUS", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("LANTUS")).to be_true
  expect(con.perform_verification("LANTUS", med_name)).to be_true
end

When(/^the user clicks button to add medication order/) do 
  con = NewOutpatientMedOrderONC.instance
  expect(con.perform_action("Add Med Order")).to be_true
end


