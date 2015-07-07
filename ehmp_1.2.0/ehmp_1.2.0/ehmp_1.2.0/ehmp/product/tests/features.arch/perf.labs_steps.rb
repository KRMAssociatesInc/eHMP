path = File.expand_path '../../../../acceptance-tests/features/steps', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'HMPCommands.rb'
require 'HMPSetup.rb'
require 'HMPAttributeParameters.rb'
require 'access_patient_steps.rb'
require 'access_domain_data_steps.rb'

path = File.expand_path '../../../../../acceptance-tests/features/steps/helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'TestSupport.rb'
require 'DomAccess.rb'
require 'DefaultHmpLogin.rb'
require 'HTMLAction.rb'
require 'PatientPickerDomElements.rb'
require 'SearchDomainsDomElements.rb'
require 'HTTPartyWithCookies.rb'
require 'ProcedureJsonVerifier.rb'
require 'JsonVerifier.rb'

path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'FindElementFactory.rb'
require 'WebDriverFactory.rb'
require 'CommonDriver.rb'
require 'SeleniumCommand.rb'

require 'rspec/expectations'
require 'httparty'
require 'json'
require 'selenium-webdriver'
require 'phantomjs'

file_path =  "#{Dir.home}/Responsetime.log"

Given(/^a patient in multiple VistAs$/) do
#   there is no way to verify this step now.  
end

When(/^user searches "(.*?)" for the patient "(.*?)"$/) do |arg1, patient_name|
  search_optien = "CPRS Default"
  HMPCommands.perform_action(search_optien)

  field = "Search Field"
  @start_time = Time.now
  HMPCommands.perform_action(field, patient_name)
  @end_time = Time.now
  response_time_desc = "Patient-Search"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  patient_selected_lactor = patient_name
  HMPCommands.call_locator_with_arg(patient_selected_lactor)
  # check if the element is not selected before
  if HMPCommands.perform_verification("Patient Name Selected").empty?
    @start_time = Time.now
    HMPCommands.perform_action("Patient Name")
    @end_time = Time.now
    response_time_desc = "Click Patient from Patient-Search list"
    append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

    @start_time = Time.now
    HMPCommands.perform_action("Confirm Change the Selected Button")
    @end_time = Time.now
    response_time_desc = "Patient-Changing Patient"
    append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
  end
end

When(/^user selected "(.*?)" from tasks option bar$/) do |arg_of_lactor1|
# HMPCommands.perform_action("Confirm Change the Selected Button")

  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("More Search MedsReiew Tasks", 10)
end

When(/^the client requests Labs for the patient "(.*?)"$/) do |pid|
  @start_time = Time.now
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.LabViewDef", pid
  @end_time = Time.now
end

Then(/^eHMP returns "(.*?)" in the results$/) do |number_of_results|
  json = JSON.parse(@response.body)
  expect(json['total']).to be(number_of_results.to_i)
end

Then(/^the results contain data group for lab$/) do | table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]

  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output()
    found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)

    result_array = json_verify.subarry

    p "subarray #{fieldvaluestring} #{json_verify.subarry.length}"
    p "------------------------"
    if found == false
      puts json_verify.error_message()
    end #if found == false
    expect(result_array.length).to_not eq(0)
  end #table.rows.each
end

Given(/^user selects "(.*?)" from tasks optien$/) do |arg_of_lactor1|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("More Search MedsReiew Tasks")
end

When(/^user looked and selected "(.*?)"$/) do |arg1|
  @start_time = Time.now  
  HMPCommands.perform_action("Search Bar", arg1)
  @end_time = Time.now
  response_time_desc = "Patient-expand Laboratory"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)    
# HMPCommands.call_locator_with_arg(arg1, arg2)
# HMPCommands.perform_action("Search bar drop list")
end

When(/the results for "(.*?)" displayed in "(.*?)"$/) do |click_on_arg1, arg2, table|
  HMPCommands.call_locator_with_arg(click_on_arg1)
  row_locator = HMPCommands.call_function_method_locator("Search Results drop list", 'action')[2]
  SeleniumCommand.wait_until_element_present('xpath', row_locator, 50)
  # # check if the domain is not extend, then click to extend it
  row_extend_locator = row_locator + '/parent::td/parent::tr'
  element = SeleniumCommand.find_element('xpath', row_extend_locator)
  if element.attribute("class").include? "collapsed"
    SeleniumCommand.click('xpath', row_locator)
  end

  table_rows_locator = HMPCommands.call_function_method_locator(arg2, 'verify')[2]
  # table_rows_locator = temp_xpath+"/tr"
  @start_time = Time.now
  SeleniumCommand.perform_table_verification('xpath', table_rows_locator, table)
  @end_time = Time.now
  response_time_desc = "View Search List - Labs" 
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
end

Then(/^view lab search results$/) do |table|
 table.rows.each do |row|
    row.each do |path|
      @start_time = Time.now
      SeleniumCommand.click("id", path)
      @end_time = Time.now
    end    
  response_time_desc = "View Search List - Labs"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
 end
 TestSupport.close_browser
end
