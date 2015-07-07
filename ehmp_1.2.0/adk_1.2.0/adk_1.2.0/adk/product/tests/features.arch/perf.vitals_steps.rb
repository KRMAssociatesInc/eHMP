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

class DefaultVitalPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_vitals
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_vitals = 166
  end
end

file_path =  "#{Dir.home}/Responsetime.log"

Given(/^a patient with vitals in multiple VistAs$/) do
  @test_patient = DefaultVitalPatient.new
end

When(/^the client requests vitals for that patient$/) do
  pid = @test_patient.pid
  @start_time = Time.now
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.VitalsViewDef", pid
  @end_time = Time.now
end

Then(/^eHMP returns all vitals in the results$/) do
  num_expected_results = @test_patient.num_vitals
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to be(num_expected_results)
end

When(/^user searches for "(.*?)"$/) do |search_string|
  search_elements = SearchElements.instance
  search_elements.wait_until_action_element_visible("Search Tab", 20)
  search_elements.perform_action("Search Tab", search_string)
  search_elements.wait_until_action_element_visible("Search Field", 20)
  @start_time = Time.now
  search_elements.perform_action("Search Field", search_string)
  @end_time = Time.now
end

Then(/^search results displays "(.*?)" titles$/) do |num_titles|
  search_elements = SearchElements.instance
  search_elements.wait_until_xpath_count("Number of result titles", num_titles)
  expect(search_elements.perform_verification("Number of result titles", num_titles)).to be_true
end

When(/^user opens title "(.*?)"$/) do |title_text|
  search_elements = SearchElements.instance
  html_access = AccessHtmlElement.new(:xpath, search_elements.build_title_xpath(title_text))
  search_elements.add_action(CucumberLabel.new("Open Title"), OpenTitle.new, html_access)
  search_elements.wait_until_action_element_visible("Open Title", 3)
  search_elements.perform_action("Open Title", title_text)
end

Then(/^search results displays "(.*?)" summaries$/) do |num_summaries_under_title, table|
  expect(SearchElements.instance.perform_verification("Number of result summaries", num_summaries_under_title)).to be_true
  all_found = true
  table.rows.each do | row|
    summary_found = SearchElements.instance.summary_displayed? row[0]
    all_found = all_found && summary_found
  end
  expect(all_found).to be true
end

Then(/^search results include$/) do |table|
  all_found = true
  table.rows.each do | summary, summary_date|
    summary_found = SearchElements.instance.result_displayed? summary, summary_date
    all_found = all_found && summary_found
  end
  expect(all_found).to be true
end

When(/^user searches for "(.*?)" for that patient$/) do |search_string|
  #cucumber step: When user types "Eight" in the "Search Field"
  search_term = @test_patient.search_term
  select_patient_from_list = @test_patient.patient_name
  @start_time = Time.now  
  AccessPatientStepReuse.user_types_in_the(search_term, "Search Field")

  #cucumber step: Then the patient list displays "38" results
  num_results =  @test_patient.search_result_count
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length(num_results, 5)
  @end_time = Time.now
  response_time_desc = "Patient-Search"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)  
  expect(verification_passed).to be_true

  #cucumber step: And user selects "Eight,Patient" from the patient list
  @start_time = Time.now   
  AccessPatientStepReuse.user_selects_from_patient_list(select_patient_from_list)
  @end_time = Time.now
  response_time_desc = "Click Patient from Patient-Search list"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  patient_details = PatientDetailsHTMLElements.instance
  patient_details.wait_until_action_element_visible("Search Tab", 20)
  patient_details.perform_action("Search Tab", search_string)
  
  @start_time = Time.now  
  search_elements = SearchElements.instance
  @end_time = Time.now
  response_time_desc = "Patient-Changing Patient"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  search_elements.wait_until_action_element_visible("Search Field", 20)
  @start_time = Time.now  
  search_elements.perform_action("Search Field", search_string)
  @end_time = Time.now
  response_time_desc = "Patient-Vitals Search"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
end

Then(/^view vitals search results$/) do |table|
 table.rows.each do |row|
    row.each do |path|
      @start_time = Time.now
      SeleniumCommand.click("id", path)
      @end_time = Time.now
    end    
  response_time_desc = "View Search List - Vitals"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
 end
 TestSupport.close_browser
end


