path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class AddNonVAMedsTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("mainModalDialog"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "mainModalDialog"))
    add_action(CucumberLabel.new("mainModal"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "mainModal"))
    add_action(CucumberLabel.new("MedsSearchInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "medsSearchInput"))
    add_verify(CucumberLabel.new("MedsSearchInput"), VerifyPlaceholder.new, AccessHtmlElement.new(:id, "medsSearchInput"))
    add_verify(CucumberLabel.new("MedSearchList"), VerifyContainsText.new, AccessHtmlElement.new(:link, "HALOPERIDOL TAB"))
    add_action(CucumberLabel.new("MedSearchList"), ClickAction.new, AccessHtmlElement.new(:link, "HALOPERIDOL TAB"))
    add_verify(CucumberLabel.new("MedSearchList1"), VerifyContainsText.new, AccessHtmlElement.new(:link, "GEFITINIB TAB"))
    add_action(CucumberLabel.new("MedSearchList1"), ClickAction.new, AccessHtmlElement.new(:link, "GEFITINIB TAB"))
    add_verify(CucumberLabel.new("MedSearchList2"), VerifyContainsText.new, AccessHtmlElement.new(:link, "MEPERIDINE TAB"))
    add_action(CucumberLabel.new("MedSearchList2"), ClickAction.new, AccessHtmlElement.new(:link, "MEPERIDINE TAB"))
    add_action(CucumberLabel.new("dosage"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:id, "dosage"))
    add_action(CucumberLabel.new("dosages"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:css, "#dosages > ul > li > option"))
    add_action(CucumberLabel.new("route"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:id, "route"))
    add_action(CucumberLabel.new("schedule"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:id, "schedule"))
    add_action(CucumberLabel.new("startDate"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "startDate"))
    add_action(CucumberLabel.new("modal"), ClickAction.new, AccessHtmlElement.new(:id, "medication-form"))
    add_verify(CucumberLabel.new("Preview"), VerifyContainsText.new, AccessHtmlElement.new(:id, "previewOrder"))
    add_action(CucumberLabel.new("notRecommended"), ClickAction.new, AccessHtmlElement.new(:id, "notRecommended"))
    add_verify(CucumberLabel.new("notRecommended"), VerifyContainsText.new, AccessHtmlElement.new(:id, "notRecommended"))
    add_action(CucumberLabel.new("recommended"), ClickAction.new, AccessHtmlElement.new(:id, "recommended"))
    add_verify(CucumberLabel.new("recommended"), VerifyContainsText.new, AccessHtmlElement.new(:id, "recommended"))
    add_action(CucumberLabel.new("undeclared"), ClickAction.new, AccessHtmlElement.new(:id, "undeclared"))
    add_verify(CucumberLabel.new("undeclared"), VerifyContainsText.new, AccessHtmlElement.new(:id, "undeclared"))
    add_action(CucumberLabel.new("prn"), ClickAction.new, AccessHtmlElement.new(:id, "prn"))
    add_verify(CucumberLabel.new("prn"), VerifyValue.new, AccessHtmlElement.new(:id, "prn"))
    add_action(CucumberLabel.new("nonVAprovider"), ClickAction.new, AccessHtmlElement.new(:id, "nonVAprovider"))
    add_verify(CucumberLabel.new("nonVAprovider"), VerifyContainsText.new, AccessHtmlElement.new(:id, "nonVAprovider"))
    add_action(CucumberLabel.new("nonVApharmacy"), ClickAction.new, AccessHtmlElement.new(:id, "nonVApharmacy"))
    add_verify(CucumberLabel.new("nonVApharmacy"), VerifyContainsText.new, AccessHtmlElement.new(:id, "nonVApharmacy"))
    add_action(CucumberLabel.new("comments"), ClickClearAndSendKeysAction.new, AccessHtmlElement.new(:id, "comments"))
    add_action(CucumberLabel.new("Save"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-non-va-med-accept"))
    add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Cancel Button"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-non-va-med-cancel"))
    add_action(CucumberLabel.new("Back"), ClickAction.new, AccessHtmlElement.new(:id, "btn-add-non-va-med-back"))
    add_verify(CucumberLabel.new("AddModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#addEditDialog h4.modal-title"))
    add_verify(CucumberLabel.new("SearchModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#searchDialog h4.modal-title"))
    add_verify(CucumberLabel.new("DiscModalTitle"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#mainModalDialog h4.modal-title"))
    add_action(CucumberLabel.new("Meds Review"), ClickAction.new, AccessHtmlElement.new(:css, "#medication-review-button > a"))
    add_action(CucumberLabel.new("Non-VA"), ClickAction.new, AccessHtmlElement.new(:xpath, "(//div[@id='medGroupType'])[2]"))
    add_verify(CucumberLabel.new("DateError"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#date-gp > span.help-inline.applet-error"))
    add_verify(CucumberLabel.new("Haloperidol"), VerifyText.new, AccessHtmlElement.new(:xpath, "(//*[@id='Non-VA-med-panel-body']/descendant::span[@class='capitalize'])[2]"))
    add_action(CucumberLabel.new("Order Med filter"), ClickAction.new, AccessHtmlElement.new(:id, "#grid-filter-button-orders"))
    add_action(CucumberLabel.new("Add Non-VA-Med"), ClickAction.new, AccessHtmlElement.new(:css, "#add-non-va-med-btn"))
    add_verify(CucumberLabel.new("Med Review button"), VerifyContainsClass.new, AccessHtmlElement.new(:id, "medsReviewTab"))
    add_action(CucumberLabel.new("Non-VA_label"), ClickAction.new, AccessHtmlElement.new(:id, "Non-VAGroup"))
  end
end

Then(/^the Med Review is active$/) do
  browser_access = AddNonVAMedsTest.instance
  expect(browser_access.wait_until_element_present("Med Review button")).to be_true
  expect(browser_access.perform_verification("Med Review button", "active")).to be_true
end

Then(/^the Non-VA Med list contains: "(.*?)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Haloperidol", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Haloperidol")).to be_true
  expect(con.perform_verification("Haloperidol", element)).to be_true
end

Then(/^the Non-VA Med list does not contains: "(.*?)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("GEFITINIB", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("GEFITINIB")).to be_true
  expect(con.perform_verification("GEFITINIB", element)).to be_true
end

Given(/^the user Selects "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Non-VA", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Non-VA")).to be_true
  con.perform_action("Non-VA", element)
  con.wait_until_action_element_visible("Haloperidol", DefaultLogin.wait_time)
end

Then(/^the Med user Selects "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  #sleep 3
  con.wait_until_action_element_visible("Meds Review", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Meds Review")).to be_true
  con.perform_action("Meds Review", element)
end

Then(/^the search modal title reads "(.*?)"$/) do |title|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("SearchModalTitle", 60)
  expect(con.static_dom_element_exists?("SearchModalTitle")).to be_true
  expect(con.perform_verification("SearchModalTitle", title)).to be_true
end
Then(/^the add modal title reads "(.*?)"$/) do |title|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("AddModalTitle", 60)
  expect(con.static_dom_element_exists?("AddModalTitle")).to be_true
  expect(con.perform_verification("AddModalTitle", title)).to be_true
end
Then(/^the disc modal title reads "(.*?)"$/) do |title|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("DiscModalTitle", 60)
  expect(con.static_dom_element_exists?("DiscModalTitle")).to be_true
  expect(con.perform_verification("DiscModalTitle", title)).to be_true
end

Then(/^the modal contains the Med search input/) do
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedsSearchInput", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("MedsSearchInput")).to be_true
  expect(con.perform_verification("MedsSearchInput", "Lookup Non-VA Medication")).to be_true
end

Given(/^the user enters in the Med Search "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedsSearchInput", 60)
  expect(con.static_dom_element_exists?("MedsSearchInput")).to be_true
  con.perform_action("MedsSearchInput", element)
end

Then(/^the Med search results populate "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedSearchList", 60)
  expect(con.static_dom_element_exists?("MedSearchList")).to be_true
  expect(con.perform_verification("MedSearchList", element)).to be_true
end

Then(/^the Med1 search results populate "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedSearchList1", 60)
  expect(con.static_dom_element_exists?("MedSearchList1")).to be_true
  expect(con.perform_verification("MedSearchList1", element)).to be_true
end

Then(/^the Med2 search results populate "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedSearchList2", 60)
  expect(con.static_dom_element_exists?("MedSearchList2")).to be_true
  expect(con.perform_verification("MedSearchList2", element)).to be_true
end

Given(/^the user selects "(.*?)" check box$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  con.perform_action(element, "")
end

Given(/^the user selects "(.*?)" Radio button$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?(element)).to be_true
  con.perform_action(element, "")
end

Given(/^the user selects Med "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedSearchList", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("MedSearchList")).to be_true
  con.perform_action("MedSearchList", element)
  con.wait_until_element_present("dosages", DefaultLogin.wait_time)
end

Given(/^the user selects Med1 "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("MedSearchList1", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("MedSearchList1")).to be_true
  con.perform_action("MedSearchList1", element)
end

Given(/^the user has selected a dosage "(.*?)"$/) do |dose|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("dosage", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("dosage")).to be_true
  con.perform_action("dosage", dose)
end

Given(/^the user has selected a route "(.*?)"$/) do |route|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("route", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("route")).to be_true
  con.perform_action("route", route)
end

Given(/^the user has selected a schedule "(.*?)"$/) do |schedule|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("schedule", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("schedule")).to be_true
  con.perform_action("schedule", schedule)
end

Given(/^the user has entered a start date "(.*?)"$/) do |startDate|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("startDate", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("startDate")).to be_true
  con.perform_action("startDate", startDate)
end

Then(/^the preview contains text "(.*?)"$/) do |element|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("modal", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("modal")).to be_true
  con.perform_action("modal")
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Preview", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Preview")).to be_true
  expect(con.perform_verification("Preview", element)).to be_true
end

Then(/^the Date Error message dispalys: "(.*?)"$/) do |element|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("modal", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("modal")).to be_true
  con.perform_action("modal")
  driver = TestSupport.driver
  con.wait_until_action_element_visible("DateError", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("DateError")).to be_true
  expect(con.perform_verification("DateError", element)).to be_true
end

Then(/^the user entered comments: "(.*?)"$/) do |element|
  con = AddNonVAMedsTest.instance
  con.wait_until_action_element_visible("comments", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("comments")).to be_true
  con.perform_action("comments", element)
end

When(/^the Med user clicks "([^"]*)"$/) do |element|
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible(element, DefaultLogin.wait_time)
  #sleep 1
  expect(con.static_dom_element_exists?(element)).to be_true
  con.perform_action(element, "")
  con.wait_until_action_element_invisible("mainModal")
end

class NonVAmedVisits < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("SelectChangeVisit"), ClickAction.new, AccessHtmlElement.new(:css, "#setVisitContextBtn > div.col-md-12 > div"))
    add_action(CucumberLabel.new("ClickChangeVisitButton"), ClickAction.new, AccessHtmlElement.new(:id, "visit-tab-appts"))
    add_action(CucumberLabel.new("ClickVisit"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:271:A;3000521.09;23")) #{}"urn:va:appointment:9E7A:271:A;3000521.09;23"))
    add_action(CucumberLabel.new("ClickSetVisit"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
  end
end

Then(/^the Non VA Med user selects a visit$/) do
  con = NonVAmedVisits.instance
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

  con.wait_until_action_element_visible("ClickSetVisit", 60)
  expect(con.static_dom_element_exists?("ClickSetVisit")).to be_true
  con.perform_action("ClickSetVisit")
  con.wait_until_action_element_invisible("mainModalDialog", DefaultLogin.wait_time)
end

Then(/^the Med user expands Non-VA med panel$/) do
  con = AddNonVAMedsTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Non-VA_label", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Non-VA_label")).to be_true
  con.perform_action("Non-VA_label")
  con.wait_until_action_element_visible("Haloperidol")
end
