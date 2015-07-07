require "rspec/expectations"
require "httparty"
require "json"
require "selenium-webdriver"

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "TestSupport.rb"
require "DomAccess.rb"

Given(/^user has successfully logged into HMP$/) do

  unless TestSupport.successfully_loggedin?
    TestSupport.navigate_to_url(DefaultLogin.hmp_url)
    TestSupport.driver.manage.window.maximize
    login_dom_objects= LoginHTMLElements.instance
    login_dom_objects.wait_until_element_present("AccessCode", DefaultLogin.wait_time)

    login_dom_objects.perform_action("Facility", DefaultLogin.facility)
    login_dom_objects.perform_action("AccessCode", DefaultLogin.access_code)
    login_dom_objects.perform_action("VerifyCode", DefaultLogin.verify_code)
    login_dom_objects.perform_action("SignIn")
    SeleniumCommand.wait_until_page_loaded
    PatientPickerElements.instance.wait_until_element_present("CPRS Default", DefaultLogin.wait_time)
    TestSupport.successfully_loggedin=true
  end
end

Given(/^user starts test with a fresh browser$/) do
  TestSupport.close_browser
end

Given(/^user views HMPDemo in browser$/) do
  puts "hmp_url: #{DefaultLogin.hmp_url}"
  TestSupport.navigate_to_url(DefaultLogin.hmp_url)
  TestSupport.driver.manage.window.maximize
  login_dom_objects = LoginHTMLElements.instance
  login_dom_objects.wait_until_element_present("AccessCode", 5)
end

Given(/^user attempts login$/) do |table|
  login_dom_objects = LoginHTMLElements.instance
  table.rows.each do |field, value |
    login_dom_objects.perform_action(field, value)
  end
end

Then(/^the main page displays$/) do |table|
  patient_dom_objects = PatientPickerElements.instance
  table.rows.each do |field, value |
    patient_dom_objects.wait_until_element_present(field, 30)
  end
end

Then(/^the page displays$/) do |table|
  login_dom_objects = LoginHTMLElements.instance
  seconds_to_wait = 10
  table.rows.each do |field |
    login_dom_objects.wait_until_element_present(field[0], seconds_to_wait)
    # only need to wait for the first element to be present
    # if the first element is loaded, then all elements should be loaded
    seconds_to_wait = 0
  end
end

at_exit do
  puts "calling close Browser"
  TestSupport.close_browser
end
