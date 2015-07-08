path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class CareTeamHeaders < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Care Team Information"), ClickAction.new, AccessHtmlElement.new(:css, "#patientDemographic-providerInfoSummary"))
    add_action(CucumberLabel.new("Care Team Inpatient Attending Provider Quicklook"), ClickAction.new, AccessHtmlElement.new(:class, "inpatient-attending-provider"))
    add_action(CucumberLabel.new("Care Team Primary Provider Quicklook"), ClickAction.new, AccessHtmlElement.new(:class, "primary-provider"))
    # heading
    add_verify(CucumberLabel.new("Primary Care Team"), VerifyText.new, AccessHtmlElement.new(:css, "#primaryCareTeam"))
    add_verify(CucumberLabel.new("Primary Care Providers"), VerifyText.new, AccessHtmlElement.new(:css, "#pimaryCareProviders"))
    add_verify(CucumberLabel.new("Primary Care Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#primaryCarePhone"))

    add_verify(CucumberLabel.new("Inpatient Attending/Provider Label"), VerifyText.new, AccessHtmlElement.new(:css, ".inpatientAttending-summary .text-muted"))
    add_verify(CucumberLabel.new("Inpatient Attending/Provider Data"), VerifyText.new, AccessHtmlElement.new(:css, "#inpatientProviders .col-md-6"))

    add_verify(CucumberLabel.new("Mental Health"), VerifyText.new, AccessHtmlElement.new(:css, "#mhTeam"))
    add_verify(CucumberLabel.new("MH Provider"), VerifyText.new, AccessHtmlElement.new(:css, "#mhProvider"))
  end
end

And(/^the Care Team "(.*?)" data displays: "(.*?)"$/) do |element, text|
  con = CareTeamHeaders.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  expect(con.perform_verification(element, text)).to be_true
end

And(/^the Care Team Information does not display: "(.*?)"$/) do |element|
  con = CareTeamHeaders.instance
  driver = TestSupport.driver
  expect(con.static_dom_element_exists?(element)).to be_false
end

Then(/^user selects "(.*?)" drop down$/) do |element|
  con = CareTeamHeaders.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  con.perform_action(element)
end

And(/^Resize browser$/) do
  driver = TestSupport.driver
  driver.manage.window.resize_to(2000, 700)
end
