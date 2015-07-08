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

Given(/^a patient with "(.*?)" in multiple VistAs$/) do |arg1|
#   there is no way to verify this step now.
end

Then(/^the patient list displays "(.*?)" results for CPRS Default$/) do |arg1|
# sleep 10
  p runtime_patient_list_size = HMPCommands.perform_verification('Patient List').size
  expect(runtime_patient_list_size.to_s).to eq arg1

end

When(/^user search for "(.*?)" in the "(.*?)"$/) do |value, field|
  HMPCommands.perform_action(field, value)
end

Given(/^user selects "(.*?)" from search option$/) do |search_option|
  HMPCommands.perform_action(search_option)
end

Given(/^user selects "(.*?)" from header$/) do |search_option|
  HMPCommands.perform_action(search_option)
end

Given(/^user selects "(.*?)" from tasks option$/) do |arg_of_lactor1|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("More Search MedsReiew Tasks")
end

Given(/^user selects "(.*?)" from search Filter option$/) do |arg_of_lactor1|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("Search Filter")
end

Given(/^user selects "(.*?)" from search Date Range option$/) do |arg_of_lactor1|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("Search Date Range")
end

Given(/^user create new task using the below data$/) do |table|
  table.rows.each do |field, value|
    if field == 'Description'
      SeleniumCommand.select_frame('index', '0')
      HMPCommands.perform_action(field, value)
      SeleniumCommand.driver.switch_to.default_content
    else
      HMPCommands.perform_action(field, value)
    end
  end
end

Then(/^user be able to verify the new task "(.*?)" undr "(.*?)"$/) do |arg1, arg2, table|
  HMPCommands.call_locator_with_arg(arg2)
  HMPCommands.perform_action("More Search MedsReiew Tasks")
  temp_xpath = "//td/div[contains(string(), '#{arg1}')]"
  SeleniumCommand.click("xpath", temp_xpath)
  table.rows.each do |field, value|
    p runtime_patient_detail = HMPCommands.perform_verification(field)
    expect(runtime_patient_detail).to include value
  end
end
