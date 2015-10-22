path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'

class CoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("patient identifying traits"), VerifyText.new, AccessHtmlElement.new(:id, "patientDemographic-patientInfo"))
    add_verify(CucumberLabel.new("patient name"), VerifyContainsText.new, AccessHtmlElement.new(:id, "patientDemographic-patientInfo"))
    add_verify(CucumberLabel.new("SSN"), VerifyContainsText.new, AccessHtmlElement.new(:id, "patientDemographic-patientInfo"))
    add_verify(CucumberLabel.new("DOB"), VerifyContainsText.new, AccessHtmlElement.new(:id, "patientDemographic-patientInfo"))
    add_verify(CucumberLabel.new("Gender"), VerifyContainsText.new, AccessHtmlElement.new(:id, "patientDemographic-patientInfo"))
    add_verify(CucumberLabel.new("Provider"), VerifyContainsText.new, AccessHtmlElement.new(:id, "UNKNOWN_ID"))
    add_verify(CucumberLabel.new("Ward"), VerifyContainsText.new, AccessHtmlElement.new(:id, "UNKNOWN_ID"))
    add_verify(CucumberLabel.new("Primary Care Team"), VerifyContainsText.new, AccessHtmlElement.new(:id, "UNKNOWN_ID"))
    add_verify(CucumberLabel.new("Attending Provider"), VerifyContainsText.new, AccessHtmlElement.new(:id, "UNKNOWN_ID"))
    add_verify(CucumberLabel.new("Inpatient Provider|"), VerifyContainsText.new, AccessHtmlElement.new(:id, "UNKNOWN_ID"))

    #coverscreen applet location
    add_verify(CucumberLabel.new("left Title"), VerifyText.new, AccessHtmlElement.new(:css, "#left span.panel-title"))
    add_verify(CucumberLabel.new("right Title"), VerifyText.new, AccessHtmlElement.new(:css, "#right span.panel-title"))

    #add_verify(CucumberLabel.new("Cover Sheet Pill"), VerifyContainsClass.new, AccessHtmlElement.new(:css, "#applet-nav #cover-sheet-button"))
      
    add_verify(CucumberLabel.new("Cover Sheet Pill"), VerifyText.new, AccessHtmlElement.new(:css, "#screenName"))
    #    add_action(CucumberLabel.new("Coversheet Screen"), ClickAction.new, AccessHtmlElement.new(:link_text, "Coversheet"))
    #    add_action(CucumberLabel.new("Coversheet Dropdown"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
      
    @@applet_count = AccessHtmlElement.new(:xpath, "//*[@data-appletid]")
    add_verify(CucumberLabel.new("Number of Applets"), VerifyXpathCount.new(@@applet_count), @@applet_count)
  end
end # 

Then(/^the "(.*?)" is displayed with information$/) do |arg1, table|
  browser_access = CoverSheet.instance

  browser_access.wait_until_element_present(arg1)
  expect(browser_access.static_dom_element_exists? arg1).to be_true

  table.rows.each do |field_name, value|
    browser_access.wait_until_element_present(field_name)
    expect(browser_access.perform_verification(field_name, value)).to be_true, "Verification failed on #{field_name}"
  end
end

Then(/^Cover Sheet is active$/) do
  browser_access = CoverSheet.instance  
  navigate_in_ehmp '#cover-sheet'
  # deliberate use of wait time other then the DefaultLogin.wait_time
  # This is for tests that don't use
  # Given(/^user searches for and selects "(.*?)"$/)
  expect(browser_access.wait_until_element_present("Cover Sheet Pill", 60)).to be_true  
  expect(browser_access.perform_verification("Cover Sheet Pill", "Coversheet")).to be_true
  expect(browser_access.wait_until_xpath_count("Number of Applets", 9)).to be_true
end

class AppletAccessor < AccessBrowserV2
  include Singleton
  def initialize
    super
  end

  def add_applet(dataapplet_id)
    add_verify(CucumberLabel.new("Panel Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .panel-title"))
    add_action(CucumberLabel.new("Refresh Button"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .applet-refresh-button"))
    add_action(CucumberLabel.new("Filter Button"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] #grid-filter-button-#{dataapplet_id}"))
    add_action(CucumberLabel.new("Expand Button"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .applet-maximize-button"))
    add_action(CucumberLabel.new("Minimize Button"), ClickAction.new, AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .applet-minimize-button"))
  end

  def applet_panel_title(dataapplet_id)
    panel_title_accesser = AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .panel-title")
    return panel_title_accesser
  end
end

class CoverSheetApplets < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("CONDITIONS"), VerifyContainsText.new, applet_panel_title("problems"))
    add_verify(CucumberLabel.new("LAB RESULTS"), VerifyContainsText.new, applet_panel_title("lab_results_grid"))
    add_verify(CucumberLabel.new("VITALS"), VerifyContainsText.new, applet_panel_title("vitals"))
    add_verify(CucumberLabel.new("ACTIVE MEDICATIONS"), VerifyContainsText.new, applet_panel_title("activeMeds"))
    add_verify(CucumberLabel.new("ALLERGIES"), VerifyContainsText.new, applet_panel_title("allergy_grid"))
    add_verify(CucumberLabel.new("IMMUNIZATIONS"), VerifyContainsText.new, applet_panel_title("immunizations"))
    add_verify(CucumberLabel.new("ORDERS"), VerifyContainsText.new, applet_panel_title("orders"))
    add_verify(CucumberLabel.new("APPOINTMENTS"), VerifyContainsText.new, applet_panel_title("appointments"))
    add_verify(CucumberLabel.new("CLINICAL REMINDERS"), VerifyContainsText.new, applet_panel_title("clinical_reminders"))
    add_verify(CucumberLabel.new("COMMUNITY HEALTH SUMMARIES"), VerifyContainsText.new, applet_panel_title("ccd_grid"))

    # count the number of applets on the screen
    @@applet_count = AccessHtmlElement.new(:xpath, "//*[@data-appletid]")
    add_verify(CucumberLabel.new("Number of Applets"), VerifyXpathCount.new(@@applet_count), @@applet_count)

    # count the number of rows in the allergy_grid table
    @@vitals_applet_data_grid_rows = AccessHtmlElement.new(:xpath, ".//*[@id='grid-panel-vitals']/div[3]/div/div/div[1]/div/table/tbody/tr")
    add_verify(CucumberLabel.new("Number of Vitals Applet Rows"), VerifyXpathCount.new(@@vitals_applet_data_grid_rows), @@vitals_applet_data_grid_rows)
  end
  
  def applet_panel_title(dataapplet_id)
    panel_title_accesser = AccessHtmlElement.new(:css, "div[data-appletid='#{dataapplet_id}'] .panel-title")
    return panel_title_accesser
  end
end

Then(/^the applets are displayed on the coversheet$/) do |table|
  access_cover_sheet_applets = CoverSheetApplets.instance
  table.rows.each do |field_name|
    single_cell = field_name[0]
    access_cover_sheet_applets.wait_until_element_present(single_cell)
    expect(access_cover_sheet_applets.perform_verification(single_cell, single_cell)).to be_true, "Failed looking for #{field_name}"
  end
end

Then(/^the Vitals applet displays data grid rows$/) do 
  access_cover_sheet_applets = CoverSheetApplets.instance
  expect(access_cover_sheet_applets.wait_until_xpath_count_greater_than("Number of Vitals Applet Rows", 2)).to be_true
end
