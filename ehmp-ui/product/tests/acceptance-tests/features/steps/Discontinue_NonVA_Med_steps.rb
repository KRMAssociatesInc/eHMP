path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class DiscontinueNonVaMedTest < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Per Policy"), ClickAction.new, AccessHtmlElement.new(:id, "discontinue-reason-2"))
    add_action(CucumberLabel.new("discontinue"), ClickAction.new, AccessHtmlElement.new(:id, "discontinueSubmit"))
    add_action(CucumberLabel.new("ExpandMedPanel"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='medGroupItem']/div[2]"))
    add_action(CucumberLabel.new("Non-VA"), ClickAction.new, AccessHtmlElement.new(:id, "listItem"))
    add_action(CucumberLabel.new("DiscontinueButton"), ClickAction.new, AccessHtmlElement.new(:id, "discontinue"))
    add_action(CucumberLabel.new("mainModalDialog"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "mainModalDialog"))
  end
end

Then(/^wait$/) do
  sleep 15
end

Given(/^the user selects the discontinue reason "(.*?)"$/) do |_reason|
  con = DiscontinueNonVaMedTest.instance
  con.wait_until_action_element_visible("Per Policy", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("Per Policy")).to be_true
  con.perform_action("Per Policy")
end

Then(/^the user clicks discontinue$/) do
  con = DiscontinueNonVaMedTest.instance
  con.wait_until_action_element_visible("discontinue", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("discontinue")).to be_true
  con.perform_action("discontinue")
  con.wait_until_action_element_invisible("mainModalDialog")
end

Then(/^the user clicks "([^"]*)" button$/) do |element|
  con = DiscontinueNonVaMedTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("DiscontinueButton", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("DiscontinueButton")).to be_true
  con.perform_action("DiscontinueButton", element)
  con.wait_until_action_element_invisible("mainModalDialog")
end

Then(/^Cover Sheet is displayed$/) do
  browser_access = CoverSheet.instance
  expect(browser_access.wait_until_element_present("Cover Sheet Pill")).to be_true
  expect(browser_access.perform_verification("Cover Sheet Pill", "active")).to be_true
end

Then(/^the Med user selects "([^"]*)" med panel$/) do |element|
  con = DiscontinueNonVaMedTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("ExpandMedPanel", DefaultLogin.wait_time)
  expect(con.static_dom_element_exists?("ExpandMedPanel")).to be_true
  con.perform_action("ExpandMedPanel", element)
end

Given(/^the user expands "([^"]*)"$/) do |element|
  con = DiscontinueNonVaMedTest.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Non-VA", 60)
  expect(con.static_dom_element_exists?("Non-VA")).to be_true
  con.perform_action("Non-VA", element)
  con.wait_until_action_element_visible("ExpandMedPanel", 60)
end

Then(/^the Non-VA med is discontinued$/) do
  driver = TestSupport.driver
  el = driver.find_element(:xpath, "//*[@id='Non-VA-med-panel-body']/descendant::*[@id='medGroupItem']/descendant::span[@class='labelStyleColor']")
  expect(el.text.strip == "Discontinued").to be_true
end

class DiscontinueMedVisits < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("SelectChangeVisit"), ClickAction.new, AccessHtmlElement.new(:css, "#setVisitContextBtn > div.col-md-12 > div"))
    add_action(CucumberLabel.new("ClickChangeVisitButton"), ClickAction.new, AccessHtmlElement.new(:id, "visit-tab-appts"))
    add_action(CucumberLabel.new("ClickVisit"), ClickAction.new, AccessHtmlElement.new(:id, "urn:va:appointment:9E7A:204:A;2931223.0945;23")) #{}"urn:va:appointment:9E7A:271:A;3000521.09;23"))
    add_action(CucumberLabel.new("ClickSetVisit"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
  end
end
Then(/^the Non-VA Med user selects a visit before Med Discontinued$/) do
  con = DiscontinueMedVisits.instance
  driver = TestSupport.driver

  con.wait_until_action_element_visible("SelectChangeVisit", 90)
  expect(con.static_dom_element_exists?("SelectChangeVisit")).to be_true
  con.perform_action("SelectChangeVisit")

  con.wait_until_action_element_visible("ClickChangeVisitButton", 90)
  expect(con.static_dom_element_exists?("ClickChangeVisitButton")).to be_true
  con.perform_action("ClickChangeVisitButton")

  con.wait_until_action_element_visible("ClickVisit", 90)
  expect(con.static_dom_element_exists?("ClickVisit")).to be_true
  con.perform_action("ClickVisit")

  con.wait_until_action_element_visible("ClickSetVisit", 90)
  expect(con.static_dom_element_exists?("ClickSetVisit")).to be_true
  con.perform_action("ClickSetVisit")
  sleep 5
end
