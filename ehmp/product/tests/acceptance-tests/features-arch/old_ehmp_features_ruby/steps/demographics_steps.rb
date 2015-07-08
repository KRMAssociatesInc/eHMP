path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

# All the HTML Elements the tests need to access in order to view the Patient's Demographics
class DemographicsHTMLElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Home Phone"), VerifyValue.new, AccessHtmlElement.new(:name, "homePhone"))
    add_verify(CucumberLabel.new("Cell Phone"), VerifyValue.new, AccessHtmlElement.new(:name, "cellPhone"))
    add_verify(CucumberLabel.new("Emergency Phone"), VerifyValue.new, AccessHtmlElement.new(:name, "emergencyPhone"))
    add_verify(CucumberLabel.new("Next of Kin Phone"), VerifyValue.new, AccessHtmlElement.new(:name, "nokPhone"))

    add_verify(CucumberLabel.new("Work Phone"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Work Phone')]/parent::td/following-sibling::td/div"))
    add_verify(CucumberLabel.new("Marital Status"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Marital Status')]/parent::td/following-sibling::td/div"))
    add_verify(CucumberLabel.new("Veteran"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Veteran')]/parent::td/following-sibling::td/div"))
    add_verify(CucumberLabel.new("Service Connected"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Service Connected')]/parent::td/following-sibling::td/div"))

    add_verify(CucumberLabel.new("Service Connected Conditions"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Service Connected Conditions')]/parent::td/following-sibling::td/div"))
    add_verify(CucumberLabel.new("Emergency Contact"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Emergency Contact')]/parent::td/following-sibling::td/div"))
    add_verify(CucumberLabel.new("Next of Kin"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Next of Kin')]/parent::td/following-sibling::td/div"))
    add_verify(CucumberLabel.new("Date of death"), VerifyText.new, AccessHtmlElement.new(:xpath, "//label[contains(string(), 'Date of Death')]/parent::td/following-sibling::td/div"))

    add_action(CucumberLabel.new("Close Button"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[@id='patientdemographicspanel']/parent::div/parent::div/descendant::span[contains(string(), 'Close')]"))
  end

  def build_header_xpath(text)
    return "//h4[contains(string(), '#{text}')]/ancestor::a"
  end

  def add_dynamic_xpath_to_actions(key, function, xpath)
    add_action(CucumberLabel.new(key), function, AccessHtmlElement.new(:xpath, xpath))
  end
end

Then(/^user views the "(.*?)" demographics$/) do |chosen_patient, table|
  demo_details = DemographicsHTMLElements.instance
  new_action_key = "View Demographics"
  header_xpath = demo_details.build_header_xpath(chosen_patient)
  demo_details.add_dynamic_xpath_to_actions(new_action_key, ClickAction.new, header_xpath)
  demo_details.wait_until_element_present(new_action_key, 5)
  demo_details.static_dom_element_exists?(new_action_key)
  demo_details.perform_action(new_action_key)
  sleep 5 # TODO: change so not hard coded sleep
  table.rows.each do | cucumber_label, value_expected |
    demo_details.perform_verification(cucumber_label, value_expected)
  end
end

When(/^the client requests demographics for that patient "(.*?)"$/) do |pid|
  temp = QueryFhir.new("patient")
  temp.add_parameter("identifier", pid)
  temp.add_format("json")
  #p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^a user "(.*?)" with password "(.*?)" requests demographics for that patient "(.*?)"$/) do |user, pass, pid|
  temp = QueryFhir.new("patient")
  temp.add_parameter("identifier", pid)
  temp.add_format("json")
  #p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(temp.path, user, pass)
end

When(/^the client breaks glass and repeats a request for demographics for that patient "(.*?)"$/) do |pid|
  temp = QueryFhir.new("patient")
  temp.add_parameter("identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  #p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

Then(/^a successful response is returned$/) do
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^an unauthorized response is returned$/) do
  expect(@response.code).to eq(401), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a forbidden response is returned$/) do
  expect(@response.code).to eq(403), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a temporary redirect response is returned$/) do
  expect(@response.code).to eq(307), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^the client requests demographics for that sensitive patient "(.*?)"$/) do |pid|
  temp = QueryFhir.new("patient")
  temp.add_parameter("identifier", pid)
  temp.add_format("json")
  #p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests demographics for the patient "(.*?)" in VPR format$/) do |pid|
  p path = QueryVPR.new("patient", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

