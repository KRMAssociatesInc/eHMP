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

Given(/^user has successfully logged into HMP$/) do

  unless TestSupport.successfully_loggedin?
    TestSupport.navigate_to_url(DefaultLogin.hmp_url)
    TestSupport.driver.manage.window.maximize
    login_dom_objects= LoginHTMLElements.instance
    login_dom_objects.wait_until_element_present("AccessCode", 15)
    login_dom_objects.perform_action("Facility", DefaultLogin.facility)
    login_dom_objects.perform_action("AccessCode", DefaultLogin.access_code)
    login_dom_objects.perform_action("VerifyCode", DefaultLogin.verify_code)
    @start_time = Time.now
    login_dom_objects.perform_action("SignIn")
    SeleniumCommand.wait_until_page_loaded
    PatientPickerElements.instance.wait_until_element_present("CPRS Default", 30)
    @end_time = Time.now
    TestSupport.successfully_loggedin=true
    response_time_desc = "Login"
    append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
  end
end

Given(/^user logs in with valid credentials to HMP$/) do
  setup_env = SetupEnv.new
  SeleniumCommand.navigate_to_url(setup_env.url)
  SeleniumCommand.driver.manage.window.maximize
  HMPCommands.perform_action('AccessCode', setup_env.accesscode)
  HMPCommands.perform_action('VerifyCode', setup_env.verifycode)
  HMPCommands.perform_action('Facility', setup_env.facility)
  @start_time = Time.now
  HMPCommands.perform_action('SignIn')
  @end_time = Time.now
  response_time_desc = "Login"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
# sleep 10
end

Given(/^user logged with valid credentials to HMP$/) do
  setup_env = SetupEnv.new
  
  unless TestSupport.successfully_loggedin?
    SeleniumCommand.navigate_to_url(setup_env.url)
    HMPCommands.perform_action('AccessCode', setup_env.accesscode)
    HMPCommands.perform_action('VerifyCode', setup_env.verifycode)
    HMPCommands.perform_action('Facility', setup_env.facility)
    @start_time = Time.now
    HMPCommands.perform_action('SignIn')
    TestSupport.successfully_loggedin=true
    @end_time = Time.now
    response_time_desc = "Login"
    append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
  end
end

class DefaultAllergyPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_allergies
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_allergies = 2
  end
end

class DefaultAllergyDemoPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_procedures
  def initialize
    @pid = "10102"
    @search_term = "Two,Patient"
    @search_result_count = 1
    @patient_name = "Two,Patient"
    @num_allergies = 9
    @num_procedures = 6
  end
end

def append_output_to_file(file_path, response_time_desc, total_time)
  # File.open('/Users/zadehf/Desktop/test_run.txt', 'w') { |file| file.write("login time : '#{t}'") }
  file = File.open(file_path, 'a')
  # file.close
  #file.write"\n"
  file.write('Date= ' + Time.now.to_s + '; ' + response_time_desc + " = '#{total_time}' Sec"+"\n")
end

Then(/^capture response time for "(.*?)"$/) do |response_time_desc|
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
end

Given(/^a patient with allergies in HMPDemo$/) do
  @test_patient = DefaultAllergyDemoPatient.new
end

Given(/^a patient with allergies in multiple VistAs$/) do
  @test_patient = DefaultAllergyPatient.new
  p  @test_patient.pid
end

When(/^the client requests allergies for that patient$/) do
  pid = @test_patient.pid
  @start_time = Time.now
  query_with_path "/vpr/view/gov.va.cpe.vpr.queryeng.AllergiesViewDef", 10118
  @end_time = Time.now
end

Then(/^eHMP returns all allergies in the results$/) do
  num_expected_results = @test_patient.num_allergies
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to be(num_expected_results)
end

When(/^user requests allergies for that patient$/) do
  #cucumber step: When user types "Eight" in the "Search Field"
  search_term = @test_patient.search_term
  select_patient_from_list = @test_patient.patient_name
  @start_time = Time.now
  AccessPatientStepReuse.user_types_in_the(search_term, "Search Field")

  #cucumber step: Then the patient list displays "38" results
  num_results =  @test_patient.search_result_count
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length(num_results, 5)
  @end_time = Time.now
  expect(verification_passed).to be_true

  response_time_desc = "Patient-Search"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  #cucumber step: And user selects "Eight,Patient" from the patient list
  @start_time = Time.now
  AccessPatientStepReuse.user_selects_from_patient_list(select_patient_from_list)
  @end_time = Time.now
  response_time_desc = "Click Patient from Patient-Search list"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  expected_posting = "Allergies"
  #cucumber step: patient has a "Allergies" posting
  posting = expected_posting + "posting"
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.wait_until_element_present(posting, 10)
  expect(patient_details.static_dom_element_exists?(posting)).to be_true

  #cucumber step: user views the posting details
  @start_time = Time.now
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.perform_action("Postings")
  @end_time = Time.now
  response_time_desc = "Patient-Changing Patient"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)
end

When(/^user search for "(.*?)" for that patient$/) do |search_string|
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
  response_time_desc = "Patient-Allergies Search"
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

  id = "gridview-1321-hd-Allergy / Adverse Reaction"
  @start_time = Time.now
  SeleniumCommand.click("id", id)
  @end_time = Time.now
end

Then(/^view allergies search results$/) do |table|
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