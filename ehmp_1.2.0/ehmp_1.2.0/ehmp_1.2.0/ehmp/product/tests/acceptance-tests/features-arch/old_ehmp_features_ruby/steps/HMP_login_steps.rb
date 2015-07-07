require "rspec/expectations"
require "httparty"
require "json"
require "selenium-webdriver"

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'FindElementFactory.rb'
require 'WebDriverFactory.rb'
require 'CommonDriver.rb'
require 'SeleniumCommand.rb'
require 'HMPCommands.rb'
require 'HMPSetup.rb'
require 'HMPAttributeParameters.rb'
require "TestSupport.rb"

Given(/^user lunch HMP$/) do
  setup_env = SetupEnv.new
  SeleniumCommand.navigate_to_url(setup_env.url)
# sleep 10
end

Given(/^user logs in with valid credentials to HMP$/) do
  setup_env = SetupEnv.new
  SeleniumCommand.navigate_to_url(setup_env.url)
  SeleniumCommand.driver.manage.window.maximize
  HMPCommands.perform_action('AccessCode', setup_env.accesscode)
  HMPCommands.perform_action('VerifyCode', setup_env.verifycode)
  HMPCommands.perform_action('Facility', setup_env.facility)
  HMPCommands.perform_action('SignIn')

# sleep 10
end

#Given(/^user logged with valid credentials to HMP$/) do
#  setup_env = SetupEnv.new
#
#  unless TestSupport.successfully_loggedin?
#    SeleniumCommand.navigate_to_url(setup_env.url)
#    HMPCommands.perform_action('AccessCode', setup_env.accesscode)
#    HMPCommands.perform_action('VerifyCode', setup_env.verifycode)
#    HMPCommands.perform_action('Facility', setup_env.facility)
#    HMPCommands.perform_action('SignIn')
#    TestSupport.successfully_loggedin=true
#  end
#end

Then(/^the main page displays with title "(.*?)"$/) do |page_title|
  runtime_title = SeleniumCommand.page_title
  expect(runtime_title).to eq page_title
end

Then(/^the physician name display as "(.*?)"$/) do |physician_name|
  runtime_name = HMPCommands.perform_verification('PhysicianName')
  expect(runtime_name).to eq physician_name
end

Then(/^the search selected "(.*?)" as default$/) do |search_selected|
  p runtime_attribute = HMPCommands.perform_verification('CPRS Default', 'unselectable')
  expect(runtime_attribute).to eq 'on'
end

Given(/^user attempts login with incorrect credentials$/) do |table|
  table.rows.each do |field, value|
    HMPCommands.perform_action(field, value)
  end
end

Then(/^the page displays login error message$/) do
  HMPCommands.perform_verification('loginErrorMessage', 20)
end

Given(/^"(.*?)" is selected as search default$/) do |search_selected|
  p runtime_attribute = HMPCommands.perform_verification('CPRS Default', 'unselectable')
  expect(runtime_attribute).to eq 'on'
end
