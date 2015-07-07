path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class AssociateVitalswithVisit < AccessBrowserV2
  include Singleton

  def initialize
    super
    add_action(CucumberLabel.new("ClickAddVitalsButton"), ClickAction.new, AccessHtmlElement.new(:xpath, "(//button[@type='button'])[27]"))
    add_action(CucumberLabel.new("MainModal"), ClickAction.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("LoadingIndicator"), ClickAction.new, AccessHtmlElement.new(:id, "vitals-loading-indicator"))
    add_action(CucumberLabel.new("ChangeVisitButton"), ClickAction.new, AccessHtmlElement.new(:id, "add-vital-visit-btn"))
    add_action(CucumberLabel.new("CancelButton"), ClickAction.new, AccessHtmlElement.new(:id, "visitCancelBtn"))
    add_action(CucumberLabel.new("7A Gen Med listitem"), ClickAction.new, AccessHtmlElement.new(:id, 'urn:va:visit:9E7A:228:H4008'))
    add_verify(CucumberLabel.new('selected info'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'selectedInfo'))
    add_verify(CucumberLabel.new('visit region'), VerifyContainsText.new, AccessHtmlElement.new(:id, 'visit-region'))
  end
end

Given(/^the vitals applet is loaded$/) do
  driver = TestSupport.driver
  Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time).until {
    p "latestVital: #{driver.find_elements(:css, '#grid-panel-vitals .latestVital').length}"
    driver.find_elements(:css, '#grid-panel-vitals .latestVital').length > 0
  }
end

Given(/^the user clicks the add vitals button$/) do
  con = AssociateVitalswithVisit.instance
  driver = TestSupport.driver
  button_label = "ClickAddVitalsButton"
  element = "Plus"
  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
  con.wait_until_action_element_visible("MainModal", 60)
  con.wait_until_action_element_invisible("LoadingIndicator", 60)
end

Given(/^the user clicks the change button$/) do
  con = AssociateVitalswithVisit.instance
  driver = TestSupport.driver
  button_label = "ChangeVisitButton"
  element = "Change"
  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
end

When(/^the user clicks on the Hospital Admissions header$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time).until {
    element = driver.find_element(:css, "#visit-tab-admits")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks on an item under the header$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time).until {
    element = driver.find_element(:css, "#urn:va:visit:9E7A:228:H4008 > span:nth-child(1)")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks on another item under the header$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 60).until {
    element = driver.find_element(:css, "#admits .list-group .list-group-item:nth-child(1)")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks on the confirm button to confirm changes$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time).until {
    element = driver.find_element(:css, "#setVisitBtn")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks on the change button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time).until {
    element = driver.find_element(:css, ".applet-add-button")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks on the cancel button to return to the Add Vital Signs page$/) do
  con = AssociateVitalswithVisit.instance
  driver = TestSupport.driver

  element = nil
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until {
    element = driver.find_element(:css, "#visitRegion [data-dismiss='modal']")
    element.displayed?
  }
  element.click
end

Then(/^Hospital Admissions header is active$/) do
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until {
    element = driver.find_element(:xpath, "//a[@id='visit-tab-admits']/parent::li")
    element.attribute('class').include? 'active'
  }
end

When(/^the user clicks on an item under the header "(.*?)"$/) do |arg1|
  con = AssociateVitalswithVisit.instance
  expect(con.perform_action("#{arg1} listitem")).to be_true
end

Then(/^Encounter Location displays "(.*?)"$/) do |arg1|
  con = AssociateVitalswithVisit.instance
  expect(con.perform_verification('selected info', arg1)).to be_true
end

Then(/^Visit Information displays "(.*?)"$/) do |arg1|
  con = AssociateVitalswithVisit.instance
  expect(con.perform_verification('visit region', arg1)).to be_true
end

When(/^the user cancels the Add Vitals Signs$/) do
  #Add Vitals Cancel Button
  con = AssociateVitalswithVisit.instance
  expect(con.perform_action("Add Vitals Cancel Button")).to be_true
end

class ChangeDefaultVisitTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("SelectChangeVisit"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='patientDemographic-providerInfo']/div/div/div[2]/span"))
    add_action(CucumberLabel.new("ClickChangeVisitButton"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))
    add_action(CucumberLabel.new("ClickVisit"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:228:A;2940907.08;23")) #{}"urn:va:appointment:9E7A:271:A;3000521.09;23"))
    add_action(CucumberLabel.new("ClickSetVisit"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
  end
end

Given(/^the user selects a Thirteen,Patient visit$/) do
  con = ChangeDefaultVisitTest.instance
  driver = TestSupport.driver

  con.wait_until_action_element_visible("SelectChangeVisit", 60)
  expect(con.static_dom_element_exists?("SelectChangeVisit")).to be_true
  con.perform_action("SelectChangeVisit")

  con.wait_until_action_element_visible("ClickChangeVisitButton", 60)
  expect(con.static_dom_element_exists?("ClickChangeVisitButton")).to be_true
  con.perform_action("ClickChangeVisitButton")

  con.wait_until_action_element_visible("ClickVisit", 60)
  expect(con.static_dom_element_exists?("ClickVisit")).to be_true
  con.perform_action("ClickVisit")

  con.wait_until_action_element_visible("ClickSetVisit", 60)
  expect(con.static_dom_element_exists?("ClickSetVisit")).to be_true
  con.perform_action("ClickSetVisit")
  con.wait_until_action_element_invisible("ClickSetVisit", 60)
end
