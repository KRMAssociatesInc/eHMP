class HealthSummary < AccessBrowserV2
  include Singleton
  def initialize
    super
    # In Support of Background, add user defined VistA Health Summary screen
    add_action(CucumberLabel.new("SelectSummaryView"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div[2]/ul/li[1]/div[2]"))
    add_verify(CucumberLabel.new("VistA Health Summaries"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='screenName']"))
    add_action(CucumberLabel.new("Workspace Manager Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-manager-button']"))
    add_action(CucumberLabel.new("Add New WorkSheet"), ClickAction.new, AccessHtmlElement.new(:id, "addScreen"))
    add_action(CucumberLabel.new("Default Title"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='mainOverlayRegion']/div/div/div[3]/div/div/div[1]/div/p/span"))
    add_action(CucumberLabel.new("Title"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "screen-title"))
    add_action(CucumberLabel.new("Description"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "screen-description"))
    add_action(CucumberLabel.new("AddLoadButton"), ClickAction.new, AccessHtmlElement.new(:css, ".btn.btn-primary.addLoadButton"))
    add_action(CucumberLabel.new("VistA Health Summaries Summary"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div[2]/p"))
    add_verify(CucumberLabel.new("newScreenTitle"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div/div[1]/span[3]/span"))
  end
end

#
# IN SUPPORT OF Background
#
#User serlect a view
When(/^user clicks the "(.*?)" on the screen editor$/) do |arg1|
  driver = TestSupport.driver
  view = HealthSummary.instance
  view.wait_until_action_element_visible(arg1, 30)
  driver.find_element(:xpath, "//*[@id='applet-1']/div/div[2]/ul/li[1]/div[2]").click
end

#The user is viewing the screen titled "VistA Health Summary"
When(/^the user is viewing the screen titled "(.*?)"$/) do |arg1|
  hs = HealthSummary.instance
  TestSupport.wait_for_page_loaded
  hs.perform_verification("VistA Health Summaries", arg1)
  TestSupport.wait_for_page_loaded
end

#Perform any selection or button click
When(/^the user clicks "(.*?)" for VistA Helth Summary$/) do |arg1|
  navigation = ScreenManager.instance
  driver = TestSupport.driver
  navigation.wait_until_action_element_visible(arg1, 20)
  expect(navigation.perform_action(arg1)).to be_true, "Error when attempting to excercise #{arg1}"
end

#Enter the title for user defined screen
Then(/^the user enters the "([^"]*)" on title field$/) do |element|
  hs = HealthSummary.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  hs.wait_until_action_element_visible("Title", 20)
  hs.perform_action("Title", element)
end

#Enter the description for user defined screen
Then(/^the user enters the "([^"]*)" on description field$/) do |element|
  hs = HealthSummary.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  hs.perform_action("Description", element)
end

#Verify added screen title
When(/^user views the applet titled "(.*?)"$/) do |arg1|
  hs = HealthSummary.instance
  hs.perform_verification("newScreenTitle", arg1)
  sleep(5)
end

#Drags VistA Health Summaries Summary
When(/^the user drags and drops VistA Health Summaries right by "(.*?)" and down by "(.*?)"$/) do |arg1, arg2|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  wait_until_loaded("VistA Health Summaries Summary")
  applet_preview = driver.find_element(:xpath, "//*[@id='applet-1']/div/div[2]/p")
  perform_drag(applet_preview, arg1, arg2)
end

class HealthSummaryReport < AccessBrowserV2
  include Singleton
  def initialize
    super
  # In Support of VistA Health Summaries Report Applet Page
    add_verify(CucumberLabel.new("Site"), VerifyContainsText.new, AccessHtmlElement.new(:id, "facilityName"))
    add_action(CucumberLabel.new("SelectSummaryView"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div[2]/ul/li[1]/div[2]"))
    add_verify(CucumberLabel.new("VistA Health Summaries Applet"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div/div[1]/span[3]/span"))
    add_action(CucumberLabel.new("VistA Health Summaries Summary"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applet-1']/div/div[2]/p"))
    add_action(CucumberLabel.new("Workspace Manager Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-manager-button']"))
    add_action(CucumberLabel.new("workspace1"), ClickAction.new, AccessHtmlElement.new(:css, "#screens-carousel [data-screen-id=workspace1]"))
    add_action(CucumberLabel.new("Delete Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-delete']"))
    add_action(CucumberLabel.new("Confirm Delete Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-delete']"))
    add_action(CucumberLabel.new("Close Button"), ClickAction.new, AccessHtmlElement.new(:xpath, " .//*[@id='doneEditing']"))
    add_action(CucumberLabel.new("BRIEF CLINICA"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[2]/td[2]"))
    add_action(CucumberLabel.new("ModalBody"), ClickAction.new, AccessHtmlElement.new(:id, "modal-body"))
  end
end

When(/^expands the view of reports under the first site listed$/) do

end

#Select TST1 local facility
When(/^selects the TST(\d+) local facility$/) do |arg1|
  driver = TestSupport.driver
  hs = HealthSummaryReport.instance
  sleep(3)
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[1]/td/b").click
  sleep(5)
end

#Find the Health Summary Report title "CAMP CPRS HEALTH SUMMARY"
When(/^selects the Health Summary Report title "(.*?)"$/) do |arg1|
  driver = TestSupport.driver
  hs = HealthSummaryReport.instance
  sleep(5)
  applet_preview = driver.find_element(:xpath, "//*[@id='TST1-63']/td[2]")
  driver.action.drag_and_drop_by(applet_preview, 40, 40).perform
  sleep(2)
  driver.find_element(:xpath, "//*[@id='TST1-63']/td[2]").click
  sleep(2)
end

#Find rows in the Health Summaries
Then(/^the Health Summaries table contains rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-clinical_reminders>tbody>tr")
  #Loop through rows in cucumber
  table.rows.each do | row_defined_in_cucumber |
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-clinical_reminders']/tbody/tr[#{i}]/td")
      if row_defined_in_cucumber.length != row_data.length
        matched = false
      else
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)
      end
      if matched
        break
      end
    end # for loop
    p "could not match data: #{row_defined_in_cucumber}" unless matched
    expect(matched).to be_true
  end#do loop
end #End of VistA Health Summaries Applet Page

#VistA Health Summaries Report Modal Page
class VistaHealthSummaryModalPage < AccessBrowserV2
  include Singleton
  def initialize
    super
        # In Support of VistA Health Summaries Report
    add_verify(CucumberLabel.new("TST1 - CAMP CPRS HEALTH SUMMARY"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='mainModalLabel']"))
    add_verify(CucumberLabel.new("EIGHTEEN,IMAGEPATIENT, 04/15/1953, 61y, 666-06-1018"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-header']/div/div/div/div[1]/div"))
    add_verify(CucumberLabel.new("TST1 - CARDIOLOGY REPORTS"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='mainModalLabel']"))
    add_verify(CucumberLabel.new("EIGHTEEN,IMAGEPATIENT, 04/15/1953, 61y, 666-06-1018"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-header']/div/div/div/div[1]/div"))
    add_verify(CucumberLabel.new("PatientName"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-header']/div/div/div/div[1]/div]"))
    add_verify(CucumberLabel.new("NextButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='vhs-next']"))
    add_verify(CucumberLabel.new("CloseButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-close-button']"))
    add_verify(CucumberLabel.new("XButtonVerify"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-header']/div/div/div/div[2]/button[3]/span[1]"))
  end
end

Then(/^a modal with the title "(.*?)" appears$/) do |arg1|
  sleep(20)
  driver = TestSupport.driver
  hsm = VistaHealthSummaryModalPage.instance
  hsm.wait_until_action_element_visible("TST1 - CAMP CPRS HEALTH SUMMARY", 20)
  hsm.perform_verification("TST1 - CAMP CPRS HEALTH SUMMARY", arg1)
  hsm.perform_verification("EIGHTEEN,IMAGEPATIENT, 04/15/1953, 61y, 666-06-1018", arg1)
end

Then(/^the content of the report is displayed$/) do
  hsm = VistaHealthSummaryModalPage.instance
  #hsm.wait_until_action_element_visible("EIGHTEEN,IMAGEPATIENT,04/15/1953,61y,666-06-1018", 20)
  pn="EIGHTEEN,IMAGEPATIENT,04/15/1953,61y,666-06-1018"
  hsm.perform_verification("PatientName", pn)

end

Then(/^an x button exists in the modal$/) do
  hsm = VistaHealthSummaryModalPage.instance
  xbutton="x"
  sleep(3)
  hsm.perform_verification("XButtonVerify", xbutton)
end

#Select TST2 remote facility
When(/^selects the TST(\d+) remote facility$/) do |arg1|
  driver = TestSupport.driver
  hs = HealthSummaryReport.instance
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[30]/td/b").click
  sleep(5)
end

Then(/^a Next button exists in the modal$/) do
  hsm = VistaHealthSummaryModalPage.instance
  expect(hsm.perform_verification("NextButtonVerify", "Next")).to be_true
end
Then(/^a Close button exists in the modal$/) do
  hsm = VistaHealthSummaryModalPage.instance
  expect(hsm.perform_verification("CloseButtonVerify", "Close")).to be_true
  sleep(2)
end

#User select a button("Next","Previous","Close")
When(/^the user selects the "(.*?)" button$/) do |arg1|
  driver = TestSupport.driver
  hsm = VistaHealthSummaryModalPage.instance
  if arg1 == "Next"
    #arg1.match("Next")
    sleep(10)
    driver.find_element(:xpath, "//*[@id='vhs-next']").click
    #hsm.perform_action("NextAction")
    sleep(10)
  elsif arg1 == "Previous"
    sleep(10)
    driver.find_element(:xpath, "//*[@id='vhs-previous']").click
    sleep(10)
  elsif arg1 == "Close"
    sleep(10)
    driver.find_element(:xpath, "//*[@id='modal-close-button']").click
    sleep(10)
  end
end

Then(/^the content of the "(.*?)" report is displayed$/) do |arg1|
  sleep(20)
  driver = TestSupport.driver
  hsm = VistaHealthSummaryModalPage.instance
  if arg1 =="TST1 - CARDIOLOGY REPORTS"
    hsm.wait_until_action_element_visible("TST1 - CARDIOLOGY REPORTS", 20)
    hsm.perform_verification("TST1 - CARDIOLOGY REPORTS", arg1)
  elsif arg1 =="TST1 - CAMP CPRS HEALTH SUMMAR"
    hsm.wait_until_action_element_visible("TST1 - CAMP CPRS HEALTH SUMMARY", 20)
    hsm.perform_verification("TST1 - CAMP CPRS HEALTH SUMMARY", arg1)
  end
end

#TST1 - CARDIOLOGY REPORTS
Then(/^the content of the second report is displayed$/) do
  sleep(20)
  driver = TestSupport.driver
  r1 = "TST1 - CARDIOLOGY REPORTS"
  hsm = VistaHealthSummaryModalPage.instance
  hsm.wait_until_action_element_visible("TST1 - CARDIOLOGY REPORTS", 20)
  hsm.perform_verification("TST1 - CARDIOLOGY REPORTS", r1)
end

#TST1 - CAMP CPRS HEALTH SUMMARY
Then(/^the content of the first report is displayed$/) do
  sleep(20)
  driver = TestSupport.driver
  r2 = "TST1 - CAMP CPRS HEALTH SUMMARY"
  hsm = VistaHealthSummaryModalPage.instance
  hsm.wait_until_action_element_visible("TST1 - CAMP CPRS HEALTH SUMMARY", 20)
  hsm.perform_verification("TST1 - CAMP CPRS HEALTH SUMMARY", r2)
end

When(/^sees "(.*?)" next to the facility name$/) do |arg1|
  driver = TestSupport.driver
  hs = HealthSummaryReport.instance
end

Then(/^the user navigates to the maximized gridster page$/) do
  driver = TestSupport.driver
  hs = HealthSummaryReport.instance
end

Then(/^the user navigates to the screen manager view$/) do
  driver = TestSupport.driver
  hsm = VistaHealthSummaryModalPage.instance
end

When(/^selects remote Health Summary Report title "(.*?)"$/) do |arg1|
  driver = TestSupport.driver
  hs = HealthSummaryReport.instance
  sleep(5)
  applet_preview = driver.find_element(:xpath, "//*[@id='TST2-63']/td[2]")
  driver.action.drag_and_drop_by(applet_preview, 40, 40).perform
  sleep(2)
  driver.find_element(:xpath, "//*[@id='TST2-63']/td[2]").click
  sleep(2)
end

#the followings are for the section 508 testing
When(/^user clicks "(.*?)" icon$/) do |arg1|
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='applet-1']/div/div/div[1]/span[1]/span/span/button/i").click
  sleep(5)
end

When(/^user hits tab key$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='applet-1']/div/div/div[1]/span[1]/span/span/button/i").send_keys:tab
end

Then(/^the focus is on the "(.*?)" icon$/) do |arg1|
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='help-button-applet-1']/i").click
  sleep(5)
end

Then(/^user hits tab key again$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='help-button-applet-1']/i").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the option icon$/) do
  driver = TestSupport.driver
  text = driver.find_element(:xpath, "//*[@id='grid-options-button-']/span").text
  if text == "Show Options"
  else fail("the test is failed")
  end
  sleep(3)
end

Then(/^user hits tab key from option icon$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='grid-options-button-']/span").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the "(.*?)" title$/) do |arg1|
  driver = TestSupport.driver
  text = driver.find_element(:xpath, "//*[@id='applet-1']/div/div/div[1]/span[3]/span").text
  if arg1 == text
  else fail("the test is failed")
  end
  sleep(3)
end

Then(/^user hits tab key from the vistA Health Summaries title$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='applet-1']/div/div/div[1]/span[3]/span").send_keys:tab
  sleep(3)
end

Then(/^the focus is on "(.*?)"$/) do |arg1|
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='vista_health_summaries-facilityMoniker']/a").click
  sleep(2)
end

Then(/^user hits tab key from the facility$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='vista_health_summaries-facilityMoniker']/a").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the Report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='vista_health_summaries-hsReport']/a").click
  sleep(3)
end

Then(/^user hits tab key from report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='vista_health_summaries-hsReport']/a").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the first site$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[1]/td").click
  sleep(2)
end

Then(/^user click the first site to expnd the site$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[1]/td").click
  sleep(3)
end

Then(/^user hits tab key from the first site$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[1]/td").send_keys:tab
end

Then(/^the focus is on the first report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='TST2-71']/td[2]").click
  sleep(5)
  driver.find_element(:xpath, "//*[@id='modal-close-button']").click
end

Then(/^user hits tab key from the first report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='TST2-71']/td[2]").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the second report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='TST1-71']/td[2]").click
  sleep(5)
  driver.find_element(:xpath, "//*[@id='modal-close-button']").click
  sleep(1)
end

Then(/^user hits tab\+shift keys$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='TST1-71']/td[2]").send_keys:tab, :shift
  sleep(3)
end

Then(/^user hits tab\+shift keys from the first report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='TST1-10']/td[2]").send_keys:tab, :shift
  sleep(3)
end

Then(/^user hits tab\+shift keys from the first site$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[1]/td").send_keys:tab, :shift
  sleep(3)
end

#the following steps are about modal level testing

When(/^user clicks the report$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='data-grid-vista_health_summaries']/tbody/tr[1]/td").click
  driver.find_element(:xpath, "//*[@id='TST1-10']/td[2]").click
  sleep(10)
end

Then(/^the report is displaying$/) do
  driver = TestSupport.driver
  report = driver.find_element(:xpath, "//*[@id='mainModalLabel']").text
end

Then(/^user clicks modal body scroll bar$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='modal-body']").click
end

Then(/^user hits tab key from report body$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='modal-body']").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the Next button$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='vhs-next']").click
  sleep(5)
end

Then(/^user hits tab key from Next button$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='vhs-next']").send_keys:tab
  sleep(10)
end

Then(/^the focus is on the X icon$/) do
  driver = TestSupport.driver
  text = driver.find_element(:xpath, "//*[@id='modal-header']/div/div/div/div[2]/button[3]/span[1]").text
end

Then(/^user hits tab key from X icon$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='modal-header']/div/div/div/div[2]/button[3]/span[1]").send_keys:tab
  sleep(3)
end

Then(/^the focus is on the Close button$/) do
  driver = TestSupport.driver
  text = driver.find_element(:xpath, "//*[@id='modal-close-button']").text
  if text == "Close"
  else fail("the test case is failed")
  end
end

Then(/^user hits shift\+tab keys from Close button$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='modal-close-button']").send_keys:tab, :shift
end

Then(/^user hits shift\+tab keys from X icon$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='modal-header']/div/div/div/div[2]/button[3]/span[1]").send_keys:tab, :shift
end

Then(/^user hits workspace button$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='workspace-manager-button']/i").click
  sleep(3)
end

Then(/^user clicks Close button$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='modal-close-button']").click
end

Then(/^user deletes user defined workspace$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='user-defined-workspace-1']/div/div[3]/div/div[3]/div/i").click
  sleep(5)
  driver.find_element(:xpath, "//*[@id='workspace-delete']").click
  sleep(5)
  #puts "End of delete workspace"
end

Then(/^user signs out the eHMP-UI$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='eHMP-CurrentUser']").click
  driver.find_element(:xpath, "//*[@id='logoutButton']").click
end

When(/^delete user defined workspaces$/) do
  driver = TestSupport.driver
  title = driver.find_elements(:xpath, "//*[@id='list-group']/div/div").size
  #puts title
  if title > 5
    i = 1
    while i <= title - 5
      driver.find_element(:xpath, "//*[@id='user-defined-workspace-#{i}']/div/div[3]/div[1]/div[3]/div/i").click
      driver.find_element(:xpath, "//*[@id='workspace-delete']").click
      i = i +1
    end
  end
end

When(/^the user clicks Add New Workspace Button$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='mainOverlayRegion']/div/div/div[1]/div[2]/button[1]/i").click
end

When(/^the user clicks the Customize$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='user-defined-workspace-1']/div/div[3]/div[3]").click
  sleep(20)
end

When(/^the user clicks the Summary View$/) do
  driver = TestSupport.driver
  driver.find_element(:xpath, "//*[@id='applet-1']/div/div[2]/ul/li[1]/div[1]  ").click
end
