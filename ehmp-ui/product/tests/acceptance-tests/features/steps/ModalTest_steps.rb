path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class ModalTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("appletPath"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:id, "appletPath"))
    add_action(CucumberLabel.new("launchModal"), ClickAction.new, AccessHtmlElement.new(:id, "launchModal"))

    add_action(CucumberLabel.new("Close Button"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button")) 
    add_action(CucumberLabel.new("Cancel Button"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-footer div div.pull-right #cancelBtn"))
    add_verify(CucumberLabel.new("ModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))
  end
end

Then(/^a modal with the title "(.*?)" is displayed$/) do |title|
  expect(ModalTest.instance.perform_verification("ModalTitle", title)).to be_true
end

Then(/^the applet selection input is displayed$/) do
  con = ModalTest.instance
  con.wait_until_action_element_visible("appletPath", 60)
  expect(con.static_dom_element_exists?("appletPath")).to be_true
end

Given(/^the user selects the applet "(.*?)"$/) do |applet|
  con = ModalTest.instance
  con.wait_until_action_element_visible("appletPath", 60)
  expect(con.static_dom_element_exists?("appletPath")).to be_true
  con.perform_action("appletPath", applet)
end

When(/^the user launches the modal$/) do
  con = ModalTest.instance
  con.wait_until_action_element_visible("launchModal", 60)
  expect(con.static_dom_element_exists?("launchModal")).to be_true
  con.perform_action("launchModal")
end

When(/^the user clicks the modal "(.*?)"$/) do |button|
  expect(ModalTest.instance.perform_action(button)).to be_true
end

def element_is_not_present?(how, what)
  driver = TestSupport.driver
  driver.find_element(how, what)
  return false
rescue
  return true
end

def wait_until_modal_is_not_displayed
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  # wait.until { !driver.find_element(:id, 'mainModal').displayed? }
  wait.until { element_is_not_present?(:id, 'mainModal') }
  wait.until { element_is_not_present?(:css, 'div.modal-backdrop.fade.in') }
end

Then(/^the modal is closed$/) do
  wait_until_modal_is_not_displayed
end

