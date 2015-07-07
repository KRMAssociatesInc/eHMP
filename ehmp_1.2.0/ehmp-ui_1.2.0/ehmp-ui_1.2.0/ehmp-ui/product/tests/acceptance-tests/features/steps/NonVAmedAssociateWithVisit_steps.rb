path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class NonVAMedsAssociateWithVisit < AccessBrowserV2
  include Singleton
  def initialize
    super
  end
end

Given(/^the visit information field is not set and the user clicks the change button$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 60).until {
    element = driver.find_element(:css, "#add-non-va-med-btn")
    element.displayed?
  }
  element.click
end

Then(/^the user is in the "(.*?)" modal$/) do |applet|
  con = ModalTest.instance
  con.wait_until_action_element_visible("appletPath", 60)
  expect(con.static_dom_element_exists?("appletPath")).to be_true
  con.perform_action("appletPath", applet)
end

When(/^the user clicks on the Clinic Apppointments header$/) do
  driver = TestSupport.driver
  element = nil
  element = driver.find_element(:css, ".list-group-item")
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  wait.until {
    element = driver.find_element(:css, ".list-group-item")
    element.displayed?
  }
  element.click
end

Then(/^the user clicks on the cancel button to return to the coversheet$/) do
  driver = TestSupport.driver
  element = nil
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)
  wait.until {
    element = driver.find_element(:css, "#visitCancelBtn")
    element.displayed?
  }
  element.click
end
