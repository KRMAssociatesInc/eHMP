path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class PatientInformationHeaders < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Patient Information"), ClickAction.new, AccessHtmlElement.new(:css, "#patientDemographic-patientInfo-detail .media-body i"))
    #drop down group level heading: (blue labels in drop down)
    add_verify(CucumberLabel.new("Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".demographic-group-header"))
    add_verify(CucumberLabel.new("Adressess"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-pt-address .demographic-group .demographic-group-header"))
    add_verify(CucumberLabel.new("Email"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-email .demographic-group .demographic-group-header"))
    add_verify(CucumberLabel.new("Emergency Contact"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-em-contact .demographic-group .demographic-group-header"))
    add_verify(CucumberLabel.new("Next of Kin"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-nok-contact .demographic-group .demographic-group-header"))
    add_verify(CucumberLabel.new("Health Benefits and Insurance"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-em-ins .demographic-group .demographic-group-header"))
    add_verify(CucumberLabel.new("Service and Social History"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#pt-header-em-misc .demographic-group .demographic-group-header"))
    #Drop down heading (field level)
    add_verify(CucumberLabel.new("Home Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-home-phone"))
    add_verify(CucumberLabel.new("Cell Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-cell-phone"))
    add_verify(CucumberLabel.new("Work Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-work-phone"))
    add_verify(CucumberLabel.new("Home Address"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-home-address"))
    add_verify(CucumberLabel.new("Temporary Address"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-temp-address"))
    add_verify(CucumberLabel.new("Emergency Name Label"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-em-name"))
    add_verify(CucumberLabel.new("Emergency Home Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-em-hphone"))
    add_verify(CucumberLabel.new("Emergency Work Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-em-wphone"))
    add_verify(CucumberLabel.new("Emergency Address"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-em-address"))
    add_verify(CucumberLabel.new("NOK Name Label"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-nok-name"))
    add_verify(CucumberLabel.new("NOK Home Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-nok-hphone"))
    add_verify(CucumberLabel.new("NOK Work Phone"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-nok-wphone"))
    add_verify(CucumberLabel.new("NOK Address"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-nok-address"))
    add_verify(CucumberLabel.new("Service Connected"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-svc-connected"))
    add_verify(CucumberLabel.new("Service Connected Conditions"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-svc-conditions"))
    add_verify(CucumberLabel.new("Insurance"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-insurance"))
    add_verify(CucumberLabel.new("Insurance Name"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-insurance-name"))
    add_verify(CucumberLabel.new("Group"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-insurance-gp"))
    add_verify(CucumberLabel.new("Holder"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-insurance-holder"))
    add_verify(CucumberLabel.new("Effective Date"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-insurance-eff-date"))
    add_verify(CucumberLabel.new("Expiration Date"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-insurance-exp-date"))
    add_verify(CucumberLabel.new("Veteran Status"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-vet-status"))
    add_verify(CucumberLabel.new("Marital Status"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-marital-status"))
    add_verify(CucumberLabel.new("Religion"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-religion-status"))
  end
end

Then(/^user selects Patient Name drop down$/) do 
  con = PatientInformationHeaders.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Patient Information", 60)
  expect(con.static_dom_element_exists?("Patient Information")).to be_true
  con.perform_action("Patient Information")
end

Then(/^the Patient Information header displays: "(.*?)"$/) do |element|
  con = PatientInformationHeaders.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  expect(con.perform_verification(element, "")).to be_true
end

Then(/^the Patient Information header does not displays: "(.*?)"$/) do |element|
  con = PatientInformationHeaders.instance
  driver = TestSupport.driver
  expect(con.static_dom_element_exists?(element)).to be_false
end

class PatientInformationData < AccessBrowserV2
  include Singleton
  def initialize
    super
    #Drop down data values 
    add_verify(CucumberLabel.new("Home Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-home-phone-val"))
    add_verify(CucumberLabel.new("Cell Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-cell-phone-val"))
    add_verify(CucumberLabel.new("Work Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-work-phone-val"))
    add_verify(CucumberLabel.new("Home Address line1"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-haddress-line1"))
    add_verify(CucumberLabel.new("Home Address line2"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#demo-haddress-line4"))
    add_verify(CucumberLabel.new("Temp Address line1"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-taddress-line1"))
    add_verify(CucumberLabel.new("Temp Address line2"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-taddress-line4"))
    add_verify(CucumberLabel.new("Email_1"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-email-val"))
    add_verify(CucumberLabel.new("Sister"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-name-val"))
    add_verify(CucumberLabel.new("Nephew"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-name-val"))
    add_verify(CucumberLabel.new("Emergency Home Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-hphone-val"))
    add_verify(CucumberLabel.new("Emergency Work Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-wphone-val"))
    add_verify(CucumberLabel.new("Emergency Address1"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-line1"))
    add_verify(CucumberLabel.new("Emergency Address2"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-em-line4"))
    add_verify(CucumberLabel.new("NOK Brother"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-name-val"))
    add_verify(CucumberLabel.new("NOK cousin"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-name-val"))
    add_verify(CucumberLabel.new("NOK Home Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-hphone-val"))
    add_verify(CucumberLabel.new("NOK Work Phone"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-wphone-val"))
    add_verify(CucumberLabel.new("NOK Address line1"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-line1"))
    add_verify(CucumberLabel.new("NOK Address line2"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-nok-line4"))
    add_verify(CucumberLabel.new("Service Connected"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-svc-connected-status-val"))
    add_verify(CucumberLabel.new("Service Conditions l1"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-svc-conditions-values :nth-child(1)"))
    add_verify(CucumberLabel.new("Service Conditions l2"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-svc-conditions-values :nth-child(2)"))
    add_verify(CucumberLabel.new("Service Conditions l3"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-svc-conditions-values :nth-child(3)"))
    add_verify(CucumberLabel.new("Service Conditions l4"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-svc-conditions-values :nth-child(4)"))
    add_verify(CucumberLabel.new("Insurance Name"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-insurance-name-val"))
    add_verify(CucumberLabel.new("Group"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-insurance-gp-val"))
    add_verify(CucumberLabel.new("Holder"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-insurance-holder-val"))
    add_verify(CucumberLabel.new("Effective Date"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-insurance-eff-date-val"))
    add_verify(CucumberLabel.new("Expiration Date"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-insurance-exp-date-val"))
    add_verify(CucumberLabel.new("Veteran Status"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-vet-status-val"))
    add_verify(CucumberLabel.new("Marital Status"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-marital-status-val"))
    add_verify(CucumberLabel.new("Religion"), VerifyText.new, AccessHtmlElement.new(:css, "#demo-religion-status-val"))
    add_verify(CucumberLabel.new("Status"), VerifyText.new, AccessHtmlElement.new(:css, ".pull-right.bold"))
    #Patient demographic data (coversheet)
    add_verify(CucumberLabel.new("DOB"), VerifyText.new, AccessHtmlElement.new(:css, "#patientDemographic-patientInfo-dob"))
    add_verify(CucumberLabel.new("SSN"), VerifyText.new, AccessHtmlElement.new(:css, "#patientDemographic-patientInfo-ssn"))
    add_verify(CucumberLabel.new("Gender"), VerifyText.new, AccessHtmlElement.new(:css, "#patientDemographic-patientInfo-gender"))
    add_verify(CucumberLabel.new("Name"), VerifyText.new, AccessHtmlElement.new(:css, ".media-heading > span"))
   
  end
end
Then(/^the Patient's "(.*?)" is "(.*?)"$/) do |element, value|
  con = PatientInformationData.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  expect(con.perform_verification(element, value)).to be_true  
end
