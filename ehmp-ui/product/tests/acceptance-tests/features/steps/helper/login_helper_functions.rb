path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'singleton'
require 'AccessBrowserV2.rb'
require 'HTMLVerification.rb'
# @description: All the HTML Elements the tests need to access in order to login to the site
class LoginHTMLElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("AccessCode"), SendKeysAction.new, AccessHtmlElement.new(:id, "accessCode"))
    add_action(CucumberLabel.new("VerifyCode"),  SendKeysAction.new, AccessHtmlElement.new(:id, "verifyCode"))
    add_action(CucumberLabel.new("Facility"), ComboSelectAction.new, AccessHtmlElement.new(:id, "facility"))
    add_action(CucumberLabel.new("SignIn"), ClickAction.new, AccessHtmlElement.new(:id, "login"))
    add_action(CucumberLabel.new("Signout"), ClickAction.new, AccessHtmlElement.new(:id, "logoutButton"))
    add_verify(CucumberLabel.new("Login Error Message"), VerifyText.new, AccessHtmlElement.new(:id, "errorMessage"))
    add_action(CucumberLabel.new("center"), ClickAction.new, AccessHtmlElement.new(:id, "center"))
    add_action(CucumberLabel.new("currentuser"), ClickAction.new, AccessHtmlElement.new(:id, "eHMP-CurrentUser"))
  
  end
end

def navigate_to_logon_screen
  button_found = wait_until_dom_has_signin_or_signout
  unless button_found
    TestSupport.navigate_to_url(DefaultLogin.ehmpui_url+'/#logon-screen')
    TestSupport.driver.manage.window.maximize
  end
  login_elements = LoginHTMLElements.instance
  if login_elements.static_dom_element_exists?("Signout")
    perform_signout_steps login_elements
  end
  #expect(login_elements.wait_until_element_present('SignIn')).to be_true, "Timed out waiting for SignIn button"
  p "SignIn button never appeared" unless login_elements.wait_until_element_present('SignIn')
end

def perform_signout_steps(login_elements)
  expect(login_elements.perform_action('currentuser')).to be_true, "Could not find the Current user menu"
    
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) 
  wait.until { 
    TestSupport.driver.find_element(:xpath, "//*[@id='eHMP-CurrentUser']/parent::li[contains(@class, 'open')]")
  } 
  expect(login_elements.wait_until_element_present('Signout')).to be_true
  expect(login_elements.perform_action('Signout')).to be_true, "Could not find the Signout button"
  login_elements.wait_until_element_present('SignIn')
rescue Exception => e 
  p "COULD NOT SIGN OUT: #{e}"
  timestamp = Time.new
  screenshot_name = "features/after_scenario_fail_#{timestamp}"
  take_screenshot screenshot_name
  # hope the next text can perform signout in its background step
end
