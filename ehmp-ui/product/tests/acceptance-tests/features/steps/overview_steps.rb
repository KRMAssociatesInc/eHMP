path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class Overview < GlobalDateFilter
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Coversheet Dropdown"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
    add_action(CucumberLabel.new("Overview"), ClickAction.new, AccessHtmlElement.new(:link_text, "Overview"))
    add_verify(CucumberLabel.new("Overview Screen"), VerifyText.new, AccessHtmlElement.new(:css, "#screenName"))

    @@applet_count = AccessHtmlElement.new(:xpath, "//*[@data-appletid]")
    add_verify(CucumberLabel.new("Number of Applets"), VerifyXpathCount.new(@@applet_count), @@applet_count)
    
  end
end # 

def verify_on_overview
  browser_access = Overview.instance
  expect(browser_access.wait_until_element_present("Overview Screen", DefaultLogin.wait_time)).to be_true
  expect(browser_access.perform_verification("Overview Screen", "Overview")).to be_true
  expect(browser_access.wait_until_xpath_count("Number of Applets", 9)).to be_true
end

Then(/^Default Screen is active$/) do
  #Default screen is currently Overview
  patient_search = PatientSearch.instance
  expect(patient_search.wait_until_element_present("patientSearch", 60)).to be_true
  # if the default screen changes, create a new function, do not change verify_on_overview
  verify_on_overview
end

Then(/^Overview is active$/) do
  browser_access = Overview.instance
  # at the time of this comment, overview was expected to be default screen
  # if for some reason default screen changes, don't break scenarios that don't care what default screen is
  # they only care that the next step needs  to be on overview
  navigate_in_ehmp '#overview'
  verify_on_overview
end

Then(/^Overview is active by default$/) do
  verify_on_overview
end

class OverviewApplets < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("ENCOUNTERS"), VerifyContainsText.new, applet_panel_title("encounters"))
    add_verify(CucumberLabel.new("LAB RESULTS"), VerifyContainsText.new, applet_panel_title("lab_results_grid"))
    add_verify(CucumberLabel.new("VITALS"), VerifyContainsText.new, applet_panel_title("vitals"))
    add_verify(CucumberLabel.new("REPORTS"), VerifyContainsText.new, applet_panel_title("reports"))
    add_verify(CucumberLabel.new("IMMUNIZATIONS"), VerifyContainsText.new, applet_panel_title("immunizations"))
    add_verify(CucumberLabel.new("CONDITIONS"), VerifyContainsText.new, applet_panel_title("problems"))
    add_verify(CucumberLabel.new("ALLERGIES"), VerifyContainsText.new, applet_panel_title("allergy_grid"))
    add_verify(CucumberLabel.new("CLINICAL REMINDERS"), VerifyContainsText.new, applet_panel_title("cds_advice"))
    add_verify(CucumberLabel.new("MEDICATIONS"), VerifyContainsText.new, applet_panel_title("activeMeds"))
   

    # count the number of applets on the screen
    @@applet_count = AccessHtmlElement.new(:xpath, "//*[@data-appletid]")
    add_verify(CucumberLabel.new("Number of Applets"), VerifyXpathCount.new(@@applet_count), @@applet_count)

    # count the number of rows in the allergy_grid table
    #@@vitals_applet_data_grid_rows = AccessHtmlElement.new(:xpath, ".//*[@id='grid-panel-vitals']/div[3]/div/div/div[1]/div/table/tbody/tr")
    @@vitals_applet_data_grid_rows = AccessHtmlElement.new(:xpath, "//*[@id='vitals-OBSERVATION-gist-items']/div")
    add_verify(CucumberLabel.new("Number of Vitals Applet Rows"), VerifyXpathCount.new(@@vitals_applet_data_grid_rows), @@vitals_applet_data_grid_rows)
  end
  
  def applet_panel_title(dataapplet_id)
    panel_title_accesser = AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .panel-title")
    return panel_title_accesser
  end
end
#
Then(/^the applets are displayed on the overview$/) do |table|
  access_cover_sheet_applets = OverviewApplets.instance
  table.rows.each do |field_name|
    single_cell = field_name[0]
    access_cover_sheet_applets.wait_until_element_present(single_cell)
    expect(access_cover_sheet_applets.perform_verification(single_cell, single_cell)).to be_true, "Failed looking for #{field_name}"
  end
end

Then(/^the Vitals applet contains data grid rows$/) do 
  access_cover_sheet_applets = CoverSheetApplets.instance
  expect(access_cover_sheet_applets.wait_until_xpath_count_greater_than("Number of Vitals Applet Rows", 2)).to be_true
end
