path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class AutoLogOffPopup < AccessBrowserV2
  include Singleton

  def initialize
    super
    add_verify(CucumberLabel.new("popup"), VerifyContainsText.new, AccessHtmlElement.new(:id, "base-modal"))
    add_action(CucumberLabel.new("Control - popup - continue"), ClickAction.new, AccessHtmlElement.new(:id, "#ContBtn .btn btn-primary"))
    add_action(CucumberLabel.new("Control - popup - close"), ClickAction.new, AccessHtmlElement.new(:css, ".close"))
    add_action(CucumberLabel.new("Control - popup - logout"), ClickAction.new, AccessHtmlElement.new(:css, "#LgtBtn .btn"))
  end
end

#Wait for the popup to be distplayed then move into the next part of the test.
Given(/^a popup is displayed warning the user they will be automatically logged off$/) do
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 1000)
  wait.until { TestSupport.driver.find_element(:css, "#base-modal") }
  element = TestSupport.driver.find_element(:css, "#base-modal")
  wait = Selenium::WebDriver::Wait.new(:timeout => 1000)
  wait.until { element.displayed? }
end

#close is when the x at the top right of the popup is clicked and ignore is when the user chooses to do nothing.
Then(/^the user chooses to "(.*?)"$/) do |arg|
  choice = arg
  case choice
  when "close"
    driver = TestSupport.driver
    element = TestSupport.driver.find_element(:css, "#base-modal .close")
    wait = Selenium::WebDriver::Wait.new(:timeout => 1000)
    wait.until { element.displayed? }
    element.click
  when "continue"
    driver = TestSupport.driver
    element = TestSupport.driver.find_element(:css, "#ContBtn")
    wait = Selenium::WebDriver::Wait.new(:timeout => 1000)
    wait.until { element.displayed? }
    element.click
  when "logout"
    driver = TestSupport.driver
    element = TestSupport.driver.find_element(:css, "#LgtBtn")
    wait = Selenium::WebDriver::Wait.new(:timeout => 1000)
    wait.until { element.displayed? }
    element.click
    wait.until { TestSupport.driver.find_element(:css, "#applet-main") }
  when "ignore"
    wait = Selenium::WebDriver::Wait.new(:timeout => 1000)
    wait.until { TestSupport.driver.find_element(:css, "#applet-main") }
  end
end
