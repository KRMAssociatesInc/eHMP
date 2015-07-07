path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require "rspec/expectations"
require "httparty"
require "json"
require "selenium-webdriver"
require 'FindElementFactory.rb'
require 'WebDriverFactory.rb'
require 'CommonDriver.rb'
require 'SeleniumCommand.rb'

def append_output_to_file(file_path, response_time_desc, total_time)
  file = File.open(file_path, 'a')
  file.write('Date= ' + Time.now.to_s + '; Selenium id= '+ @@web_driver.to_s + '; ' + response_time_desc + "= '#{total_time}' Sec"+"\n")
end

Given(/^user logs in with valid credentials to JLV$/) do

  Selenium_command.navigate_to_url("https://10.2.5.10/jlv/")

  Selenium_command.click_element('id', 'accept')
  # click_element('id', 'btnLogon')
  # element = Selenium_command.drive @@web_driver.find_element(:id, 'btnLogon')
  element = Selenium_command.driver.find_element(:id, 'btnLogon')

  value_map = Hash.new
  field = "PatientSearch"
  value_map["PatientSearch"] = { :function=>"wait", :searchOn=>"id", :locator=>"ext-gen135" }
  method = value_map[field][:searchOn]
  locator = value_map[field][:locator]

  element.click
  Selenium_command.select_frame('index', '2')
  @start_time = Time.now
  Selenium_command.wait_until_element_present(method, locator)
  # select_frame_wait('index', '2', method, locator)
  @end_time = Time.now

end

When(/^a user search for patient with id$/) do |table|
  parameters_class = Acc_Parameters.new
  Selenium_command.select_frame('index', '2')
  action_map = parameters_class.Acc()[0]

  table.rows.each do |field, value |
    element_function = action_map[field][:function]
    method = action_map[field][:searchOn]
    locator = action_map[field][:locator]

    perform_function(element_function, method, locator, value)

  end #table
  value_map = Hash.new
  field = "SearchResult"
  value_map["SearchResult"] = { :function=>"wait", :searchOn=>"id", :locator=>"patientsearchpdws-link-name-ext-record-6" }
  method = value_map[field][:searchOn]
  locator = value_map[field][:locator]

  @start_time = Time.now
  # common_driver.waitForPageLoaded()
  Selenium_command.wait_for_element_present(method, locator)
  @end_time = Time.now
end

Then(/^capture response time for "(.*?)"$/) do |response_time_desc|

  file_path = '/Users/zadehf/Desktop/test_run.txt'
  append_output_to_file(file_path, response_time_desc, @end_time-@start_time)

end

Given(/^a patient with id "(.*?)" has not been synced$/) do |patientId|
  base_url = ENV.keys.include?('LEIPR_IP') ? 'https://' + ENV['LEIPR_IP'] : 'https://10.2.3.5'
  database_ip = ENV['DATABASE_IP'] || '10.2.3.6'
  database_port = ENV['DATABASE_PORT'] || '27017'
  auth = { :username => "lu1234@200", :password => "lu1234!!" }

  url_path = "/admin/clear-cache?patientId=#{patientId}"
  full_path = "#{base_url}#{url_path}"
  HTTParty.post(full_path, { :verify => false, :basic_auth => auth })
end

When(/^user select the patient that has expected "(.*?)" data as "(.*?)"$/) do |field, value|
  value_map = Hash.new
  select_field = "SearchResult"
  value_map["SearchResult"] = { :function=>"wait", :searchOn=>"id", :locator=>"patientsearchpdws-link-name-ext-record-6" }
  method = value_map[select_field][:searchOn]
  locator = value_map[select_field][:locator]

  Selenium_command.click_element(method, locator)

  @start_time = Time.now

  div_container = find_element('xpath', "//span[contains(string(), '#{field}')]/ancestor::div[contains(@class, 'x-portlet')]")
  div_container_id = div_container.attribute("id")
  method = 'xpath'
  locator = "//div[@id='#{div_container_id}']/descendant::td[contains(string(), '#{value}')]"
  # test = find_element('xpath', "//div[@id='#{div_container_id}']/descendant::td[contains(string(), '#{value}')]")

  Selenium_command.wait_for_element_present(method, locator)
  @end_time = Time.now

end

Given(/^a patient with id "(.*?)" has been synced$/) do |patientId|

  base_url = ENV.keys.include?('LEIPR_IP') ? 'https://' + ENV['LEIPR_IP'] : 'https://10.2.3.5'
  database_ip = ENV['DATABASE_IP'] || '10.2.3.6'
  database_port = ENV['DATABASE_PORT'] || '27017'
  auth = { :username => "lu1234@200", :password => "lu1234!!" }

  short_path = "/patient-resource-directory?patientId=#{patientId}"
  patient_resource_directory_path = "#{base_url}#{short_path}"

  directory = HTTParty.get(patient_resource_directory_path, { :verify => false, :basic_auth => auth })
  directory_json = JSON.parse(directory.body)
  link_array = directory_json[0]["link"]
  expect(link_array.is_a?(Array)).to be_true
  vital_link = link_array.find { |array| array["title"] == "vital" }
  vital_path = vital_link["href"]
  # puts "fetch vitals from " + vital_path
  #--farid-s
  @response = HTTParty.get(vital_path, { :verify => false, :headers => { 'Accept' => 'application/json' }, :basic_auth => auth })
  response_http_status_code = @response.code
  patient_synced = false
  #sleep(4)
  wait_time = "2"
  time_out = "60"
  http_status_code = 200
  for i  in 0..Integer(time_out)/Integer(wait_time)
    if response_http_status_code != http_status_code
      sleep(Integer(wait_time))
      @response = HTTParty.get(vital_path, { :verify => false, :headers => { 'Accept' => 'application/json' }, :basic_auth => auth })
      response_http_status_code = @response.code
    else
      patient_synced = true
      break
    end
  end

  if patient_synced == false
    puts "Timeout error! a patient has not been synced within "+time_out+ " seconds."
  end
  expect(patient_synced).to be_true
end

Given(/^user log out$/) do
  Selenium_command.click_element('id', 'ext-gen190')
end
