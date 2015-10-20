path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class AddVitalsTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("ClickAddVitalsButton"), ClickAction.new, AccessHtmlElement.new(:xpath, "(//button[@type='button'])[27]"))
    add_action(CucumberLabel.new("ClickAcceptButton"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-vital-accept"))
    add_action(CucumberLabel.new("MainModal"), ClickAction.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("LoadingIndicator"), ClickAction.new, AccessHtmlElement.new(:id, "vitals-loading-indicator"))
    add_action(CucumberLabel.new("EnterBloodPressure"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:css, "#bp-reading"))
    add_action(CucumberLabel.new("ClickBloodPressureQualifierBtn"), ClickAction.new, AccessHtmlElement.new(:id, "bp-q-btn"))
    add_action(CucumberLabel.new("SelectsBloodPressureQualifierLocation"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-LOCATION-sel"))
    add_action(CucumberLabel.new("SelectsBloodPressureQualifierMethod"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-METHOD-sel"))
    add_action(CucumberLabel.new("SelectsBloodPressureQualifierPosition"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-POSITION-sel"))
    add_action(CucumberLabel.new("SelectsBloodPressureQualifierCuffSize"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-CUFF SIZE-sel"))
    add_verify(CucumberLabel.new("VerifyNewBloodPressure"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div/div/table/tbody/tr/td[2]"))
    add_verify(CucumberLabel.new("VerifyBloodPressureError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "bp-inner-error-container"))
    #Pulse
    add_action(CucumberLabel.new("EnterPulse"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "pu-reading"))
    add_action(CucumberLabel.new("ClickPulseQualifierBtn"), ClickAction.new, AccessHtmlElement.new(:id, "pu-q-btn"))
    add_action(CucumberLabel.new("SelectsPulseQualifierLocation"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pu-LOCATION-sel"))
    add_action(CucumberLabel.new("SelectsPulseQualifierMethod"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pu-METHOD-sel"))
    add_action(CucumberLabel.new("SelectsPulseQualifierPosition"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pu-POSITION-sel"))
    add_action(CucumberLabel.new("SelectsPulseQualifierSite"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pu-SITE-sel"))
    add_verify(CucumberLabel.new("VerifyPulsePressure"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div/div/table/tbody/tr[2]/td[2]"))
    add_verify(CucumberLabel.new("VerifyPulseError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "pu-inner-error-container"))
    #Respiration
    add_action(CucumberLabel.new("EnterRespiration"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "re-reading"))
    add_action(CucumberLabel.new("ClickRespirationQualifierBtn"), ClickAction.new, AccessHtmlElement.new(:id, "re-q-btn"))
    add_action(CucumberLabel.new("SelectsRespirationQualifierMethod"), ComboSelectAction.new, AccessHtmlElement.new(:id, "re-METHOD-sel"))
    add_action(CucumberLabel.new("SelectsRespirationQualifierPosition"), ComboSelectAction.new, AccessHtmlElement.new(:id, "re-POSITION-sel"))
    add_verify(CucumberLabel.new("VerifyRespirationPressure"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div/div/table/tbody/tr[3]/td[2]"))
    add_verify(CucumberLabel.new("VerifyRespirationError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "re-inner-error-container"))
    #Temperature
    add_action(CucumberLabel.new("EnterTemperature"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "te-reading"))
    add_action(CucumberLabel.new("SelectsTemperatureQualifierMethod"), ComboSelectAction.new, AccessHtmlElement.new(:id, "te-LOCATION-sel"))
    add_verify(CucumberLabel.new("VerifyTemperature"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div/div/table/tbody/tr[4]/td[2]"))
    add_verify(CucumberLabel.new("VerifyTemperatureError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "te-inner-error-container"))
    #Pulse Ox
    add_action(CucumberLabel.new("EnterPulseOx"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "po-reading"))
    add_action(CucumberLabel.new("SelectsPulseOxQualifierMethod"), ComboSelectAction.new, AccessHtmlElement.new(:id, "METHOD-sel"))
    add_verify(CucumberLabel.new("VerifyPulseOx"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div[2]/div/table/tbody/tr/td[2]"))
    add_verify(CucumberLabel.new("VerifyPulseOxError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "po-inner-error-container"))
    #Pain
    add_action(CucumberLabel.new("EnterPain"), ClickAndSendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "pa-reading"))
    add_verify(CucumberLabel.new("VerifyPain"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div[2]/div/table/tbody/tr[2]/td[2]"))
    #Weight
    add_action(CucumberLabel.new("EnterWeight"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "we-reading"))
    add_verify(CucumberLabel.new("VerifyWeight"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='grid-panel-vitals']/div[3]/div/div/div[2]/div/table/tbody/tr[3]/td[2]"))
    add_verify(CucumberLabel.new("VerifyWeightError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "we-inner-error-container"))
    #Height
    add_action(CucumberLabel.new("EnterHeight"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "he-reading"))
    add_verify(CucumberLabel.new("VerifyHeightError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "he-inner-error-container"))
    #CVP
    add_action(CucumberLabel.new("EnterCVP"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "cv-reading"))
    add_verify(CucumberLabel.new("VerifyCVPError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "cv-inner-error-container"))
    #Circumference/Girth
    add_action(CucumberLabel.new("EnterCircumference"), SelectAllSendKeysAndEnterActionNoClear.new, AccessHtmlElement.new(:id, "ci-reading"))
    add_verify(CucumberLabel.new("VerifyCircumferenceError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "ci-inner-error-container"))
    #Patient On Pass Button
    add_action(CucumberLabel.new("ClickPatientOnPass"), ClickAction.new, AccessHtmlElement.new(:id, "patient-on-pass-btn"))
    add_verify(CucumberLabel.new("VitalsTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#addVitalsDialog h4.modal-title"))
  end
end

class DuplicateAllergyTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("ClickLocation"), ClickAction.new, AccessHtmlElement.new(:id, "add-vital-visit-btn"))
    add_action(CucumberLabel.new("ClickActualLocation"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:204:A;2931206.11;23"))
    add_action(CucumberLabel.new("ClickConfirm"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
  end
end

class ChangeVisitTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("SelectChangeVisit"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='patientDemographic-providerInfo']/div/div/div[2]/span"))
    add_action(CucumberLabel.new("ClickChangeVisitButton"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))
    add_action(CucumberLabel.new("ClickVisit"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:228:A;2940907.08;23")) #{}"urn:va:appointment:9E7A:271:A;3000521.09;23"))
    add_action(CucumberLabel.new("ClickSetVisit"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
  end
end

class AddVitalsTestRefusedUnavailable < AccessBrowserV2
  include Singleton
  def initialize
    super
    #Unavailable Button
    add_action(CucumberLabel.new("ClickBloodPressureUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "bp-u-btn"))
    add_action(CucumberLabel.new("ClickPulseUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "pu-u-btn"))
    add_action(CucumberLabel.new("ClickRespirationUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "re-u-btn"))
    add_action(CucumberLabel.new("ClickTemperatureUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "te-u-btn"))
    add_action(CucumberLabel.new("ClickPulseOxUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "po-u-btn"))
    add_action(CucumberLabel.new("ClickPainUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "pa-u-btn"))
    add_action(CucumberLabel.new("ClickWeightUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "we-u-btn"))
    add_action(CucumberLabel.new("ClickPainUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "pa-u-btn"))
    add_action(CucumberLabel.new("ClickHeightUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "he-u-btn"))
    add_action(CucumberLabel.new("ClickCVPUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "cv-u-btn"))
    add_action(CucumberLabel.new("ClickCircumferenceUnavailable"), ClickAction.new, AccessHtmlElement.new(:id, "ci-u-btn"))

    #Refused Button
    add_action(CucumberLabel.new("ClickBloodPressureRefused"), ClickAction.new, AccessHtmlElement.new(:id, "bp-r-btn"))
    add_action(CucumberLabel.new("ClickPulseRefused"), ClickAction.new, AccessHtmlElement.new(:id, "pu-r-btn"))
    add_action(CucumberLabel.new("ClickRespirationRefused"), ClickAction.new, AccessHtmlElement.new(:id, "re-r-btn"))
    add_action(CucumberLabel.new("ClickTemperatureRefused"), ClickAction.new, AccessHtmlElement.new(:id, "te-r-btn"))
    add_action(CucumberLabel.new("ClickPulseOxRefused"), ClickAction.new, AccessHtmlElement.new(:id, "po-r-btn"))
    add_action(CucumberLabel.new("ClickPainRefused"), ClickAction.new, AccessHtmlElement.new(:id, "pa-r-btn"))
    add_action(CucumberLabel.new("ClickWeightRefused"), ClickAction.new, AccessHtmlElement.new(:id, "we-r-btn"))
    add_action(CucumberLabel.new("ClickPainRefused"), ClickAction.new, AccessHtmlElement.new(:id, "pa-r-btn"))
    add_action(CucumberLabel.new("ClickHeightRefused"), ClickAction.new, AccessHtmlElement.new(:id, "he-r-btn"))
    add_action(CucumberLabel.new("ClickCVPRefused"), ClickAction.new, AccessHtmlElement.new(:id, "cv-r-btn"))
    add_action(CucumberLabel.new("ClickCircumferenceRefused"), ClickAction.new, AccessHtmlElement.new(:id, "ci-r-btn"))
  end
end

class VitalEnterInError < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("ModalLarge"), ClickAction.new, AccessHtmlElement.new(:id, "modal-lg-region"))
    add_action(CucumberLabel.new("ModalMain"), ClickAction.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("ClickEiESubmit"), ClickAction.new, AccessHtmlElement.new(:id, "vitals-EiE-submit"))
  end
end

Then(/^the Vitals modal title is "(.*?)"$/) do |element|
  con = AddVitalsTest.instance
  con.wait_until_action_element_visible("VitalsTitle", 60)
  expect(con.static_dom_element_exists?("VitalsTitle")).to be_true
  expect(con.perform_verification("VitalsTitle", element)).to be_true
end

Then(/^the user selects a visit$/) do
  con = ChangeVisitTest.instance
  driver = TestSupport.driver

  con.wait_until_action_element_visible("SelectChangeVisit", 60)
  expect(con.static_dom_element_exists?("SelectChangeVisit")).to be_true
  con.perform_action("SelectChangeVisit")

  con.wait_until_action_element_visible("ClickChangeVisitButton", 60)
  expect(con.static_dom_element_exists?("ClickChangeVisitButton")).to be_true
  con.perform_action("ClickChangeVisitButton")

  con.wait_until_action_element_visible("ClickVisit", 60)
  expect(con.static_dom_element_exists?("ClickVisit")).to be_true
  con.perform_action("ClickVisit")

  con.perform_action("ClickSetVisit")
  con.wait_until_action_element_invisible("ClickSetVisit", 20)
end

Then(/^click and wait for Enter in Error dialogue to finish$/) do
  con = VitalEnterInError.instance
  con.wait_until_action_element_visible("ClickEiESubmit", 60)
  expect(con.static_dom_element_exists?("ClickEiESubmit")).to be_true
  con.perform_action("ClickEiESubmit")
  con.wait_until_action_element_invisible("ClickEiESubmit", 240)
end

Then(/^wait for enter-in-error dialogue to finish$/) do
  con_enter_in_error = VitalEnterInError.instance
  con_enter_in_error.wait_until_action_element_invisible("ModalMain", 60)
end

Given(/^the Vitals Write Back user clicks Marked as Entered in Error$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    #element = driver.find_element(:css, "#modal-footer .btn.btn-danger")
    element = driver.find_element(:id, "vitals-EiE-submit")
    element.displayed?
  }
  element.click
  sleep 10
end

When(/^the old Vitals Write Back user clicks Marked as Entered in Error$/) do
  con_enter_in_error = VitalEnterInError.instance
  driver = TestSupport.driver
  button_label = "ClickEiESubmit"
  element = "Mark as Entered in Error"
  expect(con_enter_in_error.static_dom_element_exists?(button_label)).to be_true
  success = con_enter_in_error.perform_action(button_label)
  #con_enter_in_error.wait_until_action_element_invisible("ModalLarge", 60)
end

When(/^the Vitals Write Back user Clicks the "([^"]*)" button$/) do |element|
  con = AddVitalsTest.instance
  con_enter_in_error = VitalEnterInError.instance
  driver = TestSupport.driver

  if element == "Plus"
    button_label = "ClickAddVitalsButton"
  elsif element == "Patient on Pass"
    button_label = "ClickPatientOnPass"
  elsif element == "Accept"
    button_label = "ClickAcceptButton"
  end
  con_enter_in_error.wait_until_action_element_invisible("ModalLarge", 60)
  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)

  if element == "Plus"
    con.wait_until_action_element_visible("MainModal", 60)
    con.wait_until_action_element_invisible("LoadingIndicator", 60)
  end

  if element == "Accept"
    con.wait_until_action_element_invisible("MainModal", 120)
  end
end

class ChangeDateTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("CloseDateWidget"), SendEnterAction.new, AccessHtmlElement.new(:css, "#vitals-obs-date"))
    add_action(CucumberLabel.new("ChangeVitalsObsDate"), SelectAllSendKeysAndEnterActionNoClear.new, AccessHtmlElement.new(:css, "#vitals-obs-date"))
    add_action(CucumberLabel.new("ChangeVitalsObsDate2"), SendKeysAndTabAction.new, AccessHtmlElement.new(:css, "#vitals-obs-date"))
    add_action(CucumberLabel.new("ClearDate"), SendKeysAction.new, AccessHtmlElement.new(:css, "#vitals-obs-date"))
    add_action(CucumberLabel.new("ChangeVitalsObsTime"), SelectAllSendKeysAndEnterActionNoClear.new, AccessHtmlElement.new(:css, "#vitals-obs-time"))
    add_verify(CucumberLabel.new("VitalsDateError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals-date-err"))
    add_verify(CucumberLabel.new("VitalsTimeError"), VerifyContainsText.new, AccessHtmlElement.new(:id, "vitals-time-err"))
  end
end

Given(/^the Vitals Write Back user closes the date widget$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsDate", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsDate")).to be_true
  con.perform_action("CloseDateWidget")
end

Given(/^the Vitals Write Back user clears the date field$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  backspaces = :backspace, :backspace, :backspace, :backspace, :backspace, :backspace, :backspace, :backspace
  con.perform_action("ClearDate", backspaces)
end

When(/^the Vitals Write Back user enters a future date$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsDate2", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsDate2")).to be_true
  time = Time.now
  time += 86_400
  date_string = time.strftime("%m/%d/%Y")
  con.perform_action("ChangeVitalsObsDate2", date_string)
end

When(/^the Vitals Write Back user enters current date$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsDate2", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsDate2")).to be_true

  time = Time.now
  date_string = time.strftime("%m/%d/%Y")
  con.perform_action("ChangeVitalsObsDate2", date_string)
end

When(/^the Vitals Write Back user enters a future time$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsTime", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsTime")).to be_true

  time = Time.now
  time += 3600
  date_string = time.strftime("%I:%M %p")

  if date_string.include? "PM"
    date_string.sub! "PM", "p"
  elsif date_string.include? "AM"
    date_string.sub! "AM", "a"
  end

  con.perform_action("ChangeVitalsObsTime", date_string)
end

When(/^the Vitals Write Back user enters past time$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsDate", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsDate")).to be_true

  time = Time.now
  time -= 3600
  date_string = time.strftime("%I:%M %p")

  if date_string.include? "PM"
    date_string.sub! "PM", "p"
  elsif date_string.include? "AM"
    date_string.sub! "AM", "a"
  end
  con.perform_action("ChangeVitalsObsTime", date_string)
end

When(/^the Vitals Write Back user enters invalid time$/) do
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsDate", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsDate")).to be_true
  con.perform_action("ChangeVitalsObsTime", "10:30")
end

Then(/^the client side validation date error displays "([^"]*)"$/) do |element|
  con = ChangeDateTest.instance
  driver = TestSupport.driver

  if element == ""
    if con.static_dom_element_exists?("VitalsDateError")
      con.perform_verification("VitalsDateError", element, 10)
    end
  else
    expect(con.static_dom_element_exists?("VitalsDateError")).to be_true
    con.perform_verification("VitalsDateError", element, 10)
  end
end

Then(/^the client side validation time error is hidden$/) do |_element|
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  expect(con.verify_element_hidden?("VitalsTimeError")).to be_true
end

Then(/^the client side validation time error displays "([^"]*)"$/) do |element|
  con = ChangeDateTest.instance
  driver = TestSupport.driver

  if element == ""
    if con.static_dom_element_exists?("VitalsTimeError")
      con.perform_verification("VitalsTimeError", element, 10)
    end
  else
    con.wait_until_action_element_visible("VitalsTimeError", 60)
    expect(con.static_dom_element_exists?("VitalsTimeError")).to be_true
    con.perform_verification("VitalsTimeError", element, 10)
  end
end

Then(/^the Vitals Write Back user enters Blood Pressure "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  driver.manage.timeouts.implicit_wait = 10
  #con.wait_until_action_element_visible("EnterBloodPressure", 60)
  expect(con.static_dom_element_exists?("EnterBloodPressure")).to be_true
  con.perform_action("EnterBloodPressure", element)
end

Then(/^the Vitals Write Back user enters Pulse "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterPulse", 60)
  expect(con.static_dom_element_exists?("EnterPulse")).to be_true
  con.perform_action("EnterPulse", element)
end

Then(/^the Vitals Write Back user enters Temperature "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  #con.wait_until_action_element_visible("EnterTemperature", 60)
  expect(con.static_dom_element_exists?("EnterTemperature")).to be_true
  con.perform_action("EnterTemperature", element)
end

Then(/^the Vitals Write Back user enters Respiration "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterRespiration", 60)
  expect(con.static_dom_element_exists?("EnterRespiration")).to be_true
  con.perform_action("EnterRespiration", element)
end

Then(/^the Vitals Write Back user enters Pulse Oximetry "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterPulseOx", 60)
  expect(con.static_dom_element_exists?("EnterPulseOx")).to be_true
  con.perform_action("EnterPulseOx", element)
end

Then(/^the Vitals Write Back user enters Pain "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterPain", 60)
  expect(con.static_dom_element_exists?("EnterPain")).to be_true
  con.perform_action("EnterPain", element)
end

Then(/^the Vitals Write Back user enters Weight "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterWeight", 60)
  expect(con.static_dom_element_exists?("EnterWeight")).to be_true
  con.perform_action("EnterWeight", element)
end

Then(/^the Vitals Write Back user enters Height "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterHeight", 60)
  expect(con.static_dom_element_exists?("EnterHeight")).to be_true
  con.perform_action("EnterHeight", element)
end

Then(/^the Vitals Write Back user enters CVP "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterCVP", 60)
  expect(con.static_dom_element_exists?("EnterCVP")).to be_true
  con.perform_action("EnterCVP", element)
end

Then(/^the Vitals Write Back user enters Circumference "([^"]*)"$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("EnterCircumference", 60)
  expect(con.static_dom_element_exists?("EnterCircumference")).to be_true
  con.perform_action("EnterCircumference", element)
end

When(/^the Vitals Write Back user clicks "([^"]*)" qualifier button$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver

  if element == "Blood Pressure"
    button_label = "ClickBloodPressureQualifierBtn"
  elsif element == "ActualLocation"
    button_label = "ClickActualLocation"
  elsif element == "Pulse"
    button_label = "ClickPulseQualifierBtn"
  elsif element == "Respiration"
    button_label = "ClickRespirationQualifierBtn"
  elsif element == "Temperature"
    button_label = "ClickTemperatureQualifierBtn"
  elsif element == "Pulse Oximetry"
    button_label = "ClickPulseOximetryQualifierBtn"
  elsif element == "Height"
    button_label = "ClickHeightQualifierBtn"
  elsif element == "Pain"
    button_label = "ClickPainQualifierBtn"
  elsif element == "Weight"
    button_label = "ClickWeightQualifierBtn"
  elsif element == "CVP"
    button_label = "ClickCVPQualifierBtn"
  elsif element == "Girth"
    button_label = "ClickGirthQualifierBtn"
  end

  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
end

Then(/^the Vitals Write Back user selects Blood Pressure "([^"]*)" qualifier$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver

  if element == "R Arm"
    button_label = "SelectsBloodPressureQualifierLocation"
  elsif element == "Palpated"
    button_label = "SelectsBloodPressureQualifierMethod"
  elsif element == "Sitting"
    button_label = "SelectsBloodPressureQualifierPosition"
  elsif element == "Adult"
    button_label = "SelectsBloodPressureQualifierCuffSize"
  end

  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
end

Then(/^Vitals applet contains "([^"]*)" for blood pressure$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  driver.manage.timeouts.implicit_wait = 10
  expect(con.static_dom_element_exists?("VerifyNewBloodPressure")).to be_true
  con.wait_until_action_element_visible("VerifyNewBloodPressure", 60)
  con.perform_verification("VerifyNewBloodPressure", element, 10)
end

Then(/^the Vitals Write Back user selects Pulse "([^"]*)" qualifier$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  #sleep 1
  if element == "Apical"
    button_label = "SelectsPulseQualifierLocation"
  elsif element == "Doppler"
    button_label = "SelectsPulseQualifierMethod"
  elsif element == "Sitting"
    button_label = "SelectsPulseQualifierPosition"
  elsif element == "Right"
    button_label = "SelectsPulseQualifierSite"
  end

  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
end

Then(/^Vitals applet contains "([^"]*)" for pulse$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  expect(con.static_dom_element_exists?("VerifyPulsePressure")).to be_true
  con.perform_verification("VerifyPulsePressure", element, 10)
end

Then(/^the Vitals Write Back user selects Respiration "([^"]*)" qualifier$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  #sleep 1
  if element == "At Rest"
    button_label = "SelectsRespirationQualifierMethod"
  elsif element == "Standing"
    button_label = "SelectsRespirationQualifierPosition"
  end

  con.wait_until_action_element_visible(button_label, 60)
  expect(con.static_dom_element_exists?(button_label)).to be_true
  con.perform_action(button_label, element)
end

Then(/^Vitals applet contains "([^"]*)" for respiration$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("VerifyRespirationPressure", 60)
  expect(con.static_dom_element_exists?("VerifyRespirationPressure")).to be_true
  con.perform_verification("VerifyRespirationPressure", element, 10)
end

Then(/^Vitals applet contains "([^"]*)" for temperature$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("VerifyTemperature", 60)
  expect(con.static_dom_element_exists?("VerifyTemperature")).to be_true
  con.perform_verification("VerifyTemperature", element, 10)
end

Then(/^Vitals applet contains "([^"]*)" for pulse oximetry$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("VerifyPulseOx", 60)
  expect(con.static_dom_element_exists?("VerifyPulseOx")).to be_true
  con.perform_verification("VerifyPulseOx", element, 10)
end

Then(/^Vitals applet contains "([^"]*)" for pain$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  # con.wait_until_action_element_visible("VerifyPain", 60)
  expect(con.static_dom_element_exists?("VerifyPain")).to be_true
  con.perform_verification("VerifyPain", element, 10)
end

Then(/^Vitals applet contains "([^"]*)" for weight$/) do |element|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  # con.wait_until_action_element_visible("VerifyWeight", 60)
  expect(con.static_dom_element_exists?("VerifyWeight")).to be_true
  con.perform_verification("VerifyWeight", element, 10)
end

Then(/^the Vitals Write Back user selects unavailable for all vitals$/) do
  con = AddVitalsTestRefusedUnavailable.instance
  driver = TestSupport.driver
  driver.manage.timeouts.implicit_wait = 10

  # con.wait_until_action_element_visible("ClickBloodPressureUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickBloodPressureUnavailable")).to be_true
  con.perform_action("ClickBloodPressureUnavailable")

  # con.wait_until_action_element_visible("ClickPulseUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickPulseUnavailable")).to be_true
  con.perform_action("ClickPulseUnavailable")

  # con.wait_until_action_element_visible("ClickRespirationUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickRespirationUnavailable")).to be_true
  con.perform_action("ClickRespirationUnavailable")

  # con.wait_until_action_element_visible("ClickTemperatureUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickTemperatureUnavailable")).to be_true
  con.perform_action("ClickTemperatureUnavailable")

  # con.wait_until_action_element_visible("ClickPulseOxUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickPulseOxUnavailable")).to be_true
  con.perform_action("ClickPulseOxUnavailable")

  # con.wait_until_action_element_visible("ClickPainUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickPainUnavailable")).to be_true
  con.perform_action("ClickPainUnavailable")

  # con.wait_until_action_element_visible("ClickWeightUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickWeightUnavailable")).to be_true
  con.perform_action("ClickWeightUnavailable")

  # con.wait_until_action_element_visible("ClickHeightUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickHeightUnavailable")).to be_true
  con.perform_action("ClickHeightUnavailable")

  # con.wait_until_action_element_visible("ClickCVPUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickCVPUnavailable")).to be_true
  con.perform_action("ClickCVPUnavailable")

  # con.wait_until_action_element_visible("ClickCircumferenceUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickCircumferenceUnavailable")).to be_true
  con.perform_action("ClickCircumferenceUnavailable")
end

#Then the Vitals Write Back user selects unavailable for Blood Pressure, Pulse, Respiration, Temperature, Pulse Oximetry, Pain, Weight, Height, CVP, Circumference
Then(/^the Vitals Write Back user selects refused for all vitals$/) do
  con = AddVitalsTestRefusedUnavailable.instance
  driver = TestSupport.driver
  driver.manage.timeouts.implicit_wait = 10
  # con.wait_until_action_element_visible("ClickBloodPressureRefused", 60)
  expect(con.static_dom_element_exists?("ClickBloodPressureRefused")).to be_true
  con.perform_action("ClickBloodPressureRefused")

  # con.wait_until_action_element_visible("ClickPulseRefused", 60)
  expect(con.static_dom_element_exists?("ClickPulseRefused")).to be_true
  con.perform_action("ClickPulseRefused")

  # con.wait_until_action_element_visible("ClickRespirationRefused", 60)
  expect(con.static_dom_element_exists?("ClickRespirationRefused")).to be_true
  con.perform_action("ClickRespirationRefused")

  # con.wait_until_action_element_visible("ClickTemperatureRefused", 60)
  expect(con.static_dom_element_exists?("ClickTemperatureRefused")).to be_true
  con.perform_action("ClickTemperatureRefused")

  # con.wait_until_action_element_visible("ClickPulseOxRefused", 60)
  expect(con.static_dom_element_exists?("ClickPulseOxRefused")).to be_true
  con.perform_action("ClickPulseOxRefused")

  # con.wait_until_action_element_visible("ClickPainRefused", 60)
  expect(con.static_dom_element_exists?("ClickPainRefused")).to be_true
  con.perform_action("ClickPainRefused")

  # con.wait_until_action_element_visible("ClickWeightRefused", 60)
  expect(con.static_dom_element_exists?("ClickWeightRefused")).to be_true
  con.perform_action("ClickWeightRefused")

  # con.wait_until_action_element_visible("ClickHeightRefused", 60)
  expect(con.static_dom_element_exists?("ClickHeightRefused")).to be_true
  con.perform_action("ClickHeightRefused")

  # con.wait_until_action_element_visible("ClickCVPRefused", 60)
  expect(con.static_dom_element_exists?("ClickCVPRefused")).to be_true
  con.perform_action("ClickCVPRefused")

  # con.wait_until_action_element_visible("ClickCircumferenceRefused", 60)
  expect(con.static_dom_element_exists?("ClickCircumferenceRefused")).to be_true
  con.perform_action("ClickCircumferenceRefused")
end

Then(/^the Vitals Write Back user selects refuse for Respiration$/) do
  con = AddVitalsTestRefusedUnavailable.instance
  driver = TestSupport.driver

  con.wait_until_action_element_visible("ClickRespirationRefused", 60)
  expect(con.static_dom_element_exists?("ClickRespirationRefused")).to be_true
  con.perform_action("ClickRespirationRefused")
end

Then(/^the Vitals Write Back user selects unavailable for Temperature and refuse for pain$/) do
  con = AddVitalsTestRefusedUnavailable.instance
  driver = TestSupport.driver

  con.wait_until_action_element_visible("ClickTemperatureUnavailable", 60)
  expect(con.static_dom_element_exists?("ClickTemperatureUnavailable")).to be_true
  con.perform_action("ClickTemperatureUnavailable")

  con.wait_until_action_element_visible("ClickPainRefused", 60)
  expect(con.static_dom_element_exists?("ClickPainRefused")).to be_true
  con.perform_action("ClickPainRefused")
end

Then(/^Add Vitals modal contains error "([^"]*)" for "([^"]*)"$/) do |value, vital|
  con = AddVitalsTest.instance
  driver = TestSupport.driver

  if vital == "blood pressure"
    label = "VerifyBloodPressureError"
  elsif vital == "pulse"
    label = "VerifyPulseError"
  elsif vital == "respiration"
    label = "VerifyRespirationError"
  elsif vital == "temperature"
    label = "VerifyTemperatureError"
  elsif vital == "pulse oximetry"
    label = "VerifyPulseOxError"
  elsif vital == "height"
    label = "VerifyHeightError"
  elsif vital == "weight"
    label = "VerifyWeightError"
  elsif vital == "CVP"
    label = "VerifyCVPError"
  elsif vital == "circumference"
    label = "VerifyCircumferenceError"
  end
  expect(con.static_dom_element_exists?(label)).to be_true
  con.perform_verification(label, value, 10)
end

# Then(/^the Vitals Write Back user opens the blood pressure details page$/) do
#   con = AddVitalsTest.instance
#   driver = TestSupport.driver
#   con.wait_until_action_element_visible("OpenBpDetails", 60)
#   expect(con.static_dom_element_exists?("OpenBpDetails")).to be_true
#   con.perform_action("OpenBpDetails")
# end

# Then(/^the latest Vital is "([^"]*)"$/) do |element|
#   con = AddVitalsTest.instance
#   driver = TestSupport.driver
#   con.wait_until_action_element_visible("VerifyBpDetails", 60)
#   expect(con.static_dom_element_exists?("VerifyBpDetails")).to be_true
#   con.perform_verification("VerifyBpDetails", element)
# end

# Then(/^the Vitals Write Back user enters a date range$/) do
#   con = AddVitalsTest.instance
#   driver = TestSupport.driver
#   con.wait_until_action_element_visible("EnterFromDate", 60)
#   expect(con.static_dom_element_exists?("EnterFromDate")).to be_true
#   con.perform_action("EnterFromDate", "11/14/2014")
#   driver.save_screenshot('EnterFromDate.png')

#   con.wait_until_action_element_visible("EnterToDate", 60)
#   expect(con.static_dom_element_exists?("EnterToDate")).to be_true
#   con.perform_action("EnterToDate", "11/14/2014")
#   driver.save_screenshot('EnterToDate.png')

#   con.wait_until_action_element_visible("ClickCustomRangeApply", 60)
#   expect(con.static_dom_element_exists?("ClickCustomRangeApply")).to be_true
#   con.perform_action("ClickCustomRangeApply")
# end

Then(/^the Vitals Write Back user enters "([^"]*)" measured date$/) do |element|
  con = ChangeDateTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ChangeVitalsObsDate", 60)
  expect(con.static_dom_element_exists?("ChangeVitalsObsDate")).to be_true
  con.perform_action("ChangeVitalsObsDate", element)
end

Then(/^the Vitals Accept button is "(.*?)"$/) do |enabled_state|
  con = AddVitalsTest.instance
  driver = TestSupport.driver
  expect(con.static_dom_element_exists?("ClickAcceptButton")).to be_true
  element = con.get_element("ClickAcceptButton")
  verify_element_enabled(element, enabled_state)
end

Then(/^the Vitals Write Back user clicks the cancel button to exit the vitals modal$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#btn-add-vital-cancel")
    element.displayed?
  }
  element.click
end
