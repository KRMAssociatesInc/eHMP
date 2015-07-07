path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

#require 'login_helper_functions.rb'
require 'AccessBrowserV2.rb'

class MRMTestVitalsEnteredInError < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("ClickTestEiESubmit"), ClickAction.new, AccessHtmlElement.new(:id, "vitals-EiE-submit"))
    add_action(CucumberLabel.new("MainModal"), ClickAction.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("VitalsEiEModal"), ClickAction.new, AccessHtmlElement.new(:css, "#vitals-entered-in-error"))
  end
end

Given(/^the mrm-test user clicks on the first vital$/) do
  p 'clicking first vital'
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "div[title=Vitals] .a-table tr:nth-child(1) td")
    element.displayed?
  }
  p '  found element'
  element.click
  p '  clicked element'
end

Then(/^the mrm-test Vitals modal is opened$/) do
  p ' checking for vitals modal opening'
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#lr-data-table-view")
    element.displayed?
  }
  puts "Vitals Modal displayed..."
end

Then(/^the mrm-test Entered in Error modal is opened$/) do
  con = MRMTestVitalsEnteredInError.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("VitalsEiEModal", 240)
  p ' found modal'
end

Given(/^the mrm-test user clicks on the Entered in Error button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#error")
    element.displayed?
  }
  element.click
end

Then(/^check that the mrm-test vitals checkbox under vitals is checked$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-entered-in-error input[type=checkbox]:nth-child(1)")
    element.displayed?
  }
  element.attribute('checked') #true
end

Given(/^the mrm-test user checks first vitals checkbox$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-entered-in-error input[type=checkbox]:nth-child(1)")
    element.displayed?
  }
  element.click
end

Given(/^the mrm-test user checks vitals checkbox "([^"]*)"$/) do |element|
  driver = TestSupport.driver
  elements = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    elements = driver.find_elements(:css, "#vitals-entered-in-error input[type=checkbox]:nth-child(1)")
    elements[element.to_i].displayed?
  }
  elements[element.to_i].click
end

And(/^the mrm-test user checks the first reason radio button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-reason-for-removal input[type=radio]:nth-child(1)")
    element.displayed?
  }
  element.click
end

Then(/^the mrm-test Marked as Entered in Error button is "(.*?)"$/) do |enabled_state|
  p 'mrm-test2 checking enabled state of Marked as Entered in Error'
  con = MRMTestVitalsEnteredInError.instance
  driver = TestSupport.driver
  element = con.get_element("ClickTestEiESubmit")
  verify_element_enabled(element, enabled_state)
end

Then(/^click and wait for mrm-test Enter in Error dialogue to finish$/) do
  p 'click and wait'
  con = MRMTestVitalsEnteredInError.instance
  driver = TestSupport.driver
  con.perform_action("ClickTestEiESubmit")
  p ' clicked element. waiting for main modal to disappear'
  con.wait_until_action_element_invisible("MainModal", 240)
  p ' main modal is gone. giving time for sync'
  sleep 5
  p ' done with sync'
end

Then(/^the mrm-test user clicks the Mark as EiE button$/) do
  buttons = MRMTestVitalsEnteredInError.instance
  buttons.wait_until_action_element_visible('ClickTestEiESubmit', 60)
  buttons.perform_action('ClickTestEiESubmit')
  buttons.wait_until_action_element_invisible("VitalsEiEModal", 240)
  p ' main modal is gone. giving time for sync'
  sleep 5
  p ' done with sync'
end

Then(/^take mrm-test screenshot "(.*?)"$/) do |filename|
  con = VitalsEnteredInError.instance
  driver = TestSupport.driver
  driver.save_screenshot(filename)
end

Then(/^show mrm-test logs$/) do
  p "logs through selenium: #{TestSupport.print_logs}"
end
