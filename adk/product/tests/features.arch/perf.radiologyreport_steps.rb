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

When(/^the client requests Radiology for the patient "(.*?)"$/) do |pid|
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.RadViewDef", pid
end

Then(/^eHMP returns "(.*?)" in the radiology results$/) do |number_of_results|
  json = JSON.parse(@response.body)
  expect(json['total']).to be(number_of_results.to_i)
end

Then(/^the results contain data group for radiology$/) do | table|
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

When(/^user looks and selects "(.*?)"$/) do |arg1|
    @start_time = Time.now
  HMPCommands.perform_action("Search Bar", arg1)
   @end_time = Time.now
  response_time_desc = "Patient-Search Radiology report"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  id = "gridview-1321-hd-Radiology Report"
  @start_time = Time.now
  SeleniumCommand.click("id", id)
  @end_time = Time.now
end

Given(/^user selects "(.*?)" from tasks optien$/) do |arg_of_lactor1|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("More Search MedsReiew Tasks")
end

Then(/^Radiology search results displays "(.*?)" summaries$/) do |num_summaries_under_title, table|
  expect(SearchElements.instance.perform_verification("Number of result summaries", num_summaries_under_title)).to be_true
  all_found = true
  table.rows.each do | row|
    summary_found = SearchElements.instance.summary_displayed? row[0]
    all_found = all_found && summary_found
  end
  expect(all_found).to be true
end

Then(/^view radiology search results$/) do |table|
 table.rows.each do |row|
    row.each do |path|
      @start_time = Time.now
      SeleniumCommand.click("id", path)
      @end_time = Time.now
    end    
    response_time_desc = "View Search List - Radiology Report"
    append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
  end
TestSupport.close_browser
end


