path = File.expand_path '..', __FILE__
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

#require 'login_helper_functions.rb'
require 'AccessBrowserV2.rb'

class VitalsEnteredInError < AccessBrowserV2
  include Singleton

  def initialize
    super
    add_action(CucumberLabel.new("ClickSubmit"), ClickAction.new, AccessHtmlElement.new(:id, "vitals-EiE-submit"))
    add_action(CucumberLabel.new("ChangeObservationModal"), ClickAction.new, AccessHtmlElement.new(:id, "data-grid-vitalsObservedList-modalView"))
    add_action(CucumberLabel.new("EIE Button"), ClickAction.new, AccessHtmlElement.new(:css, "#vitals-EiE-submit > span"))
  end
end

Given(/^the user clicks on the first vital$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "div[title=Vitals] .a-table tr:nth-child(1) td")
    element.displayed?
  }
  element.click
end

Then(/^the Vitals modal is opened$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#lr-data-table-view")
    element.displayed?
  }
end

Then(/^the Entered in Error modal is opened$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 60).until {
    element = driver.find_element(:css, "#vitals-entered-in-error")
    element.displayed?
  }
  puts "EIE Modal displayed...."
end

Then(/^the Obervation List modal is opened$/) do
  con = VitalsEnteredInError.instance
  drive = TestSupport.driver
  con.wait_until_action_element_visible("ChangeObservationModal", 60)
  expect(con.static_dom_element_exists?("ChangeObservationModal")).to be_true
end

Then(/^the old Obervation List modal is opened$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#data-grid-vitalsObservedList-modalView")
    element.displayed?
  }
  puts "Observation List Modal displayed...."
end

Given(/^the user clicks on the Entered in Error button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 60).until {
    element = driver.find_element(:css, "#error")
    element.displayed?
  }
  element.click
end

Then(/^check that the vitals checkbox under vitals is checked$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-entered-in-error input[type=checkbox]:nth-child(1)")
    element.displayed?
  }
  element.attribute('checked') #true
end

Given(/^the user checks first vitals checkbox$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-entered-in-error input[type=checkbox]:nth-child(1)")
    element.displayed?
  }
  element.click
end

Given(/^the user checks vitals checkbox "([^"]*)"$/) do |element|
  driver = TestSupport.driver
  elements = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    elements = driver.find_elements(:css, "#vitals-entered-in-error input[type=checkbox]:nth-child(1)")
    #elements = driver.find_elements(:css, "#vitals-entered-in-error input[type=checkbox]")
    elements[element.to_i].displayed?
  }
  elements[element.to_i].click
end

And(/^the user checks the first reason radio button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-reason-for-removal input[type=radio]:nth-child(1)")
    element.displayed?
  }
  element.click
end

And(/^then no Reason for Removal is ticked$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-reason-for-removal input[type=radio]:nth-child(1)")
    element.displayed?
  }
  element.attribute('checked') #false
end

Given(/^the user clicks Marked as Entered in Error$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 90).until {
    element = driver.find_element(:css, "#vitals-EiE-submit > span")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks the Change Observation button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#changeObservation")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks an entry on the vitals observed list$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 60).until {
    element = driver.find_element(:css, "#data-grid-vitalsObservedList-modalView tbody tr:nth-child(1)")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks the cancel button to exit the vitals EIE modal$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#vitals-EiE-cancel")
    element.displayed?
  }
  element.click
end

Then(/^the Mark as Entered in Error button is "(.*?)"$/) do |enabled_state|
  con = VitalsEnteredInError.instance
  driver = TestSupport.driver
  element = con.get_element("ClickSubmit")
  verify_element_enabled(element, enabled_state)
end

Then(/^take screenshot "(.*?)"$/) do |filename|
  con = VitalsEnteredInError.instance
  driver = TestSupport.driver
  driver.save_screenshot(filename)
end

Then(/^show logs$/) do
  p "logs through selenium: #{TestSupport.print_logs}"
end
