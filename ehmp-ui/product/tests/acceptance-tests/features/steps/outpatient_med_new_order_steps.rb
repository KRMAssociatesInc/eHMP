path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class NewOutpatientMedOrder < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("OkWarning"), ClickAction.new, AccessHtmlElement.new(:id, "ok"))
    add_action(CucumberLabel.new("ConfirmVisit"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
    add_verify(CucumberLabel.new("Cancel"), VerifyContainsText.new, AccessHtmlElement.new(:id, "visitCancelBtn"))
    add_verify(CucumberLabel.new("warningWindow"), VerifyText.new, AccessHtmlElement.new(:id, "warning-container"))
    add_action(CucumberLabel.new("Visit Information"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='accordion']/div/div[1]/h4/a"))
    add_action(CucumberLabel.new("Outpatient Medication"), ClickAction.new, AccessHtmlElement.new(:id, "outpatientMeds"))
    add_verify(CucumberLabel.new("Change Visit"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='change-visit-btn']"))
    add_verify(CucumberLabel.new("Visit Information Location"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='collapseOne']/div/span[2]"))
    add_verify(CucumberLabel.new("orderTypeSearchInput"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='orderType']"))
    add_action(CucumberLabel.new("orderTypeSearchResults"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='orderType']/option[2]"))
    add_action(CucumberLabel.new("MedsSearchInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "medsSearchInput"))
    add_verify(CucumberLabel.new("MedsSearchInput"), VerifyPlaceholder.new, AccessHtmlElement.new(:id, "medsSearchInput"))
    add_verify(CucumberLabel.new("HospitalMedSearchList"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='meds-ul']/li[3]/a"))
    add_action(CucumberLabel.new("HospitalMedSearchList"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='meds-ul']/li[3]/a"))
    add_verify(CucumberLabel.new("ClinicMedSearchList"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='meds-ul']/li[1]/a"))
    add_action(CucumberLabel.new("ClinicMedSearchList"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='meds-ul']/li[1]/a"))
    add_action(CucumberLabel.new("NonFormularyMedSearchList"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='meds-ul']/li[1]/a"))
    add_verify(CucumberLabel.new("NonFormularyMedSearchList"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='meds-ul']/li[1]/a"))
    add_verify(CucumberLabel.new("Panel Title"), VerifyText.new, AccessHtmlElement.new(:id, "medicationName"))
    add_action(CucumberLabel.new("daysSupply"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:xpath, "//*[@id='supply']"))
    add_action(CucumberLabel.new("numTablet"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:xpath, "//*[@id='quantity']"))
    add_action(CucumberLabel.new("numRefill"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:xpath, "//*[@id='refills']"))
    add_action(CucumberLabel.new("pickupwindow"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:xpath, "//*[@id='pickupWindow']"))
    add_verify(CucumberLabel.new("Preview"), VerifyContainsText.new, AccessHtmlElement.new(:id, "previewOrder"))
    add_action(CucumberLabel.new("acceptOrder"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='btn-add-order-accept']"))
    add_verify(CucumberLabel.new("Success"), VerifyPlaceholder.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-body']/div"))
    add_action(CucumberLabel.new("7A Gen Med"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:visit:9E7A:100013:H4178"))
    add_action(CucumberLabel.new("General Medicine"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:100013:A;3010525.1215;23"))
    add_action(CucumberLabel.new("AddMedicatonOrder"), ClickAction.new, AccessHtmlElement.new(:id, "add-med-order-btn"))
  end
end

Then(/^the user gets a warning window/) do
  con = NewOutpatientMedOrder.instance
  con.wait_until_element_present("warningWindow", 60)
  expect(con.static_dom_element_exists?("warningWindow")).to be_true
  expect(con.perform_verification("warningWindow", "This drug is not in the formulary! There are no formulary alternatives entered for this item.")).to be_true
end

Then(/^the user selects clinic appt first row "(.*?)"$/) do |_arg1|
  con = NewOutpatientMedOrder.instance
  expect(con.wait_until_action_element_visible("General Medicine", 60)).to be_true
  expect(con.perform_action("General Medicine")).to be_true
end

When(/^the Outpatient Med user clicks "([^"]*)"$/) do |element|
  con = NewOutpatientMedOrder.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  con.perform_action(element, "")
end

When(/^the user clicks the "([^"]*)" button$/) do |element|
  con = NewOutpatientMedOrder.instance
  if element == "OK"
    button_label = "OkWarning"
  elsif element == "Confirm"
    button_label = "ConfirmVisit"
  elsif element == "Change"
    button_label = "ChangeVisit"
  elsif element == "Add Medication Order"
    button_label = "AddMedicatonOrder"
  end
  wait_until_present_and_perform_action(con, button_label)
end

Then(/^the user clicks on "([^"]*)" link$/) do |element|
  aa = NewOutpatientMedOrder.instance
  expect(aa.wait_until_action_element_visible(element, 60)).to be_true
  expect(aa.perform_action(element, "")).to be_true
end

Then(/^the outpatient "(.*?)" button appears$/) do |_selected_item|
  con = NewOutpatientMedOrder.instance
  expect(con.wait_until_action_element_visible("Change Visit", 60)).to be_true
  #expect(con.perform_verification("Change Visit", selected_item)).to be_true
end

Then(/^the location modal contains button "(.*?)"$/) do |buttonname|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible(buttonname, 60)
  expect(con.static_dom_element_exists?(buttonname)).to be_true
  expect(con.perform_verification("Cancel", buttonname)).to be_true
end

#Then(/^location for outpatient Visit Information tab is populated with "(.*?)"$/) do |arg1|
#  con = NewOutpatientMedOrder.instance
#  expect(con.wait_until_action_element_visible("Visit Information Location", 30)).to be_true
#  expect(con.perform_verification("Visit Information Location", arg1)).to be_true
#end

Then(/^the modal contains the order type search input/) do
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("orderTypeSearchInput", 60)
  expect(con.static_dom_element_exists?("orderTypeSearchInput")).to be_true
  con.perform_verification("orderTypeSearchInput", "Choose an order Type")
end

#Given(/^the user selects order type/) do
#  con = NewOutpatientMedOrder.instance
#  con.perform_action("orderTypeSearchResults")
#end

Then(/^the modal contains the outpatient Med search input/) do
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("MedsSearchInput", 60)
  expect(con.static_dom_element_exists?("MedsSearchInput")).to be_true
  con.perform_verification("MedsSearchInput", "Enter at least 3 letters to lookup medication")
end

Given(/^the outpatient Med search results populate "([^"]*)"$/) do |medication|
  con = NewOutpatientMedOrder.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedsSearchInput", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("MedsSearchInput")).to be_true
  expect(con.perform_verification("MedsSearchInput", medication)).to be_true
end

#Given(/^the user selects outpatient Med "([^"]*)"$/) do |element|
#  con = NewOutpatientMedOrder.instance
#  driver = TestSupport.driver
#  con.wait_until_action_element_visible("MedSearchList", DefaultLogin.wait_time)
#  expect(con.static_dom_element_exists?("MedSearchList")).to be_true
#  con.perform_action("MedSearchList", element)
#end

Given(/^the user selects outpatient Med "([^"]*)"$/) do |element|
  con = NewOutpatientMedOrder.instance
  if element == "SIMVASTATIN TAB"
    button_label = "ClinicMedSearchList"
  elsif element == "LORAZEPAM TAB"
    button_label = "HospitalMedSearchList"
  elsif element == "SODIUM CHLORIDE GRANULES NF"
    button_label = "NonFormularyMedSearchList"
  end
  wait_until_present_and_perform_action(con, button_label)
end

Then(/^the outpatient med panel title is "(.*?)"$/) do |arg1|
  aa = NewOutpatientMedOrder.instance
  aa.wait_until_action_element_visible("Panel Title")
  expect(aa.perform_verification("Panel Title", arg1)).to be_true
end

Given(/^the user selects "(.*?)" days supply$/) do |days|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("daysSupply", 60)
  expect(con.static_dom_element_exists?("daysSupply")).to be_true
  con.perform_action("daysSupply", days)
end

Given(/^the user selects "(.*?)" tablets$/) do |num|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("numTablet", 60)
  expect(con.static_dom_element_exists?("numTablet")).to be_true
  con.perform_action("numTablet", num)
end

Given(/^the user selects "(.*?)" refills$/) do |refill|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("numRefill", 60)
  expect(con.static_dom_element_exists?("numRefill")).to be_true
  con.perform_action("numRefill", refill)
end

Given(/^the user selects "(.*?)" Radio button for pick up$/) do |pickup|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("pickupwindow", 60)
  expect(con.static_dom_element_exists?("pickupwindow")).to be_true
  con.perform_action("pickupwindow", pickup)
end

Then(/^the outpatient preview contains text "(.*?)"$/) do |element|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("Preview", 60)
  expect(con.perform_verification("Preview", element)).to be_true
end

When(/^the outpatient Med user clicks "([^"]*)"$/) do |element|
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("acceptOrder", 60)
  expect(con.static_dom_element_exists?("acceptOrder")).to be_true
  con.perform_action("acceptOrder", element)
end

Then(/^the modal contains successful order number/) do
  con = NewOutpatientMedOrder.instance
  con.wait_until_action_element_visible("Success", 60)
  expect(con.static_dom_element_exists?("Success")).to be_true
end

Then(/^the user selects hospital admissions first row "(.*?)"$/) do |_arg1|
  con = NewOutpatientMedOrder.instance
  expect(con.wait_until_action_element_visible("7A Gen Med", 30)).to be_true
  expect(con.perform_action("7A Gen Med")).to be_true
end
