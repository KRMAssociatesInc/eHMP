path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'singleton'

class Documents < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Coversheet Dropdown"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
    add_verify(CucumberLabel.new("Drop Down Menu"), VerifyText.new, AccessHtmlElement.new(:class, "dropdown-menu"))
    add_action(CucumberLabel.new("Documents"), ClickAction.new, AccessHtmlElement.new(:link_text, "Documents"))
    add_verify(CucumberLabel.new("Is Table Visible"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-documents"))
    add_action(CucumberLabel.new("Discharge Summary"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-9E7A-65-300']/td[1]"))
    add_action(CucumberLabel.new("Progress Note"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-9E7A-65-747']/td[1]"))
    add_action(CucumberLabel.new("Progress Note DoD*"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-DOD-0000000011-1000003813']/td[1]"))
    add_action(CucumberLabel.new("Procedure"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-procedure-9E7A-65-5-MCAR(699,']/td[1]"))
    add_action(CucumberLabel.new("Surgery"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-surgery-9E7A-65-28']/td[1]"))
    add_action(CucumberLabel.new("Consult Report"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*[@id='urn-va-consult-9E7A-100012-563']/td[1]"))
    add_action(CucumberLabel.new("Advance Directive"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-9E7A-100012-3944']/td[1]"))
    add_action(CucumberLabel.new("Crisis Note"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-9E7A-231-1693']/td[1]"))
    add_action(CucumberLabel.new("Lab Report"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-9E7A-17-CY-7049593']/td[1]"))
    add_action(CucumberLabel.new("Administrative Note"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-document-DOD-0000000014-1000004202']/td[1]"))
    add_action(CucumberLabel.new("Imaging"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='urn-va-image-9E7A-17-7028886-8889-1']/td[1]"))
    add_verify(CucumberLabel.new("Details Title"), VerifyText.new, AccessHtmlElement.new(:css, "h3.docDetailTitle.col-md-9.capitalize"))
    add_verify(CucumberLabel.new("Is Detail Panel Text visible"), VerifyText.new, AccessHtmlElement.new(:id, "doc-detail-region"))
    add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "bottomDetailCloseBtn"))
    add_verify(CucumberLabel.new("Surgery Count"), VerifyText.new, AccessHtmlElement.new(:id, "Surgery_groupCount"))
    add_action(CucumberLabel.new("Surgery Row"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*//td[contains(string(),'Surgery')]"))
    add_action(CucumberLabel.new("Documents Filter input"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "input[name='q-documents']"))
    add_action(CucumberLabel.new("Search Filter"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-documents"))
    add_verify(CucumberLabel.new("No Records Found"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*//td[contains(string(),'No Records Found')]"))
    add_action(CucumberLabel.new("August 1992"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*//td[contains(string(),'August 1992')]"))
    add_verify(CucumberLabel.new("August 1992 Count"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*[@id='199208_groupCount']"))
    add_verify(CucumberLabel.new("Document Modal Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, "doc-detail-region"))
    add_verify(CucumberLabel.new("DoD* Content Details"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//body"))

    @@documents_applet_data_grid_rows = AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*//table[@id='data-grid-documents']/descendant::tr")
    add_verify(CucumberLabel.new("Number of Documents Applet Rows"), VerifyXpathCount.new(@@documents_applet_data_grid_rows), @@documents_applet_data_grid_rows)         
  end
end

class DocumentsDateFilter < ADKContainer
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Control - Applet - Date Filter"), ClickAction.new, AccessHtmlElement.new(:css, "#navigation-date #date-region-minimized"))
    add_action(CucumberLabel.new("Control - Applet - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "#globalDate-region #filter-from-date-global"))
    add_action(CucumberLabel.new("Control - Applet - To Date"), SendKeysAction.new, AccessHtmlElement.new(:id, "filter-to-date-global"))
    add_action(CucumberLabel.new("Control - Applet - Apply"), ClickAction.new, AccessHtmlElement.new(:id, "custom-range-apply-global"))
  end
end

class DocumentsColumnHeader < ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Documents Page Title"), VerifyText.new, AccessHtmlElement.new(:css, ".panel-title-label"))
    add_verify(CucumberLabel.new("Header2"), VerifyText.new, AccessHtmlElement.new(:id, "documents-localTitle"))
    add_verify(CucumberLabel.new("Header1"), VerifyText.new, AccessHtmlElement.new(:id, "documents-dateDisplay"))
    add_verify(CucumberLabel.new("Header3"), VerifyText.new, AccessHtmlElement.new(:id, "documents-kind"))
    add_verify(CucumberLabel.new("Header5"), VerifyText.new, AccessHtmlElement.new(:id, "documents-facilityName"))
    add_verify(CucumberLabel.new("Header4"), VerifyText.new, AccessHtmlElement.new(:id, "documents-authorDisplayName"))

    add_action(CucumberLabel.new("Date/Time"), ClickAction.new, AccessHtmlElement.new(:link_text, "Date"))
    add_action(CucumberLabel.new("Type"), ClickAction.new, AccessHtmlElement.new(:link_text, "Type"))
    add_action(CucumberLabel.new("Facility"), ClickAction.new, AccessHtmlElement.new(:link_text, "Facility"))
    add_action(CucumberLabel.new("Entered By"), ClickAction.new, AccessHtmlElement.new(:link_text, "Entered By"))
    add_action(CucumberLabel.new("Description"), ClickAction.new, AccessHtmlElement.new(:link_text, "Description"))
  end
end

class DocumentsGroup < ADKContainer
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("date_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='center-region']/descendant::*//td[contains(string(),'April 1999')]/b"))
    add_verify(CucumberLabel.new("date_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'April 1998')]/b"))
    add_verify(CucumberLabel.new("date_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'February 1994')]/b"))
    add_verify(CucumberLabel.new("date_group4"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'August 1992')]/b"))
    add_verify(CucumberLabel.new("date_group5"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'January 1992')]/b"))

    add_verify(CucumberLabel.new("type_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Discharge Summary')]"))
    add_verify(CucumberLabel.new("type_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Procedure')]"))
    add_verify(CucumberLabel.new("type_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Progress Note')]"))
    add_verify(CucumberLabel.new("type_group4"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Surgery')]"))

    add_verify(CucumberLabel.new("facility_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'CAMP MASTER')]"))
    add_verify(CucumberLabel.new("facility_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'TROY')]"))

    add_verify(CucumberLabel.new("enteredBy_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'None')]"))
    add_verify(CucumberLabel.new("enteredBy_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Programmer,Twenty')]"))
    add_verify(CucumberLabel.new("enteredBy_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Provider,Prf')]"))
    add_verify(CucumberLabel.new("enteredBy_group4"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Radtech,Twenty')]"))

    add_verify(CucumberLabel.new("description_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'BIOSPY')]"))
    add_verify(CucumberLabel.new("description_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'Discharge Summary')]"))
    add_verify(CucumberLabel.new("description_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'LAPARASCOPY')]"))
    add_verify(CucumberLabel.new("description_group4"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'RMS-OCCUPATIONAL THERAPY')]"))
    add_verify(CucumberLabel.new("description_group5"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='center-region']/descendant::*//td[contains(string(),'ASI-ADDICTION SEVERITY INDEX')]"))
  end
end

When(/^user selects Documents from Coversheet dropdown$/) do
  aa = Documents.instance
  expect(aa.wait_until_action_element_visible("Coversheet Dropdown", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Coversheet Dropdown", "")).to be_true, "Could not click on drop down menu"
  expect(aa.wait_until_element_present("Drop Down Menu")).to be_true, "Could not see the drop down menu"
  expect(aa.perform_action("Documents", "")).to be_true, "could not click on Documents link from drop down menu"
end

When(/^user navigates to Documents Applet$/) do
  navigate_in_ehmp '#documents-list'
end

Then(/^title of the Documents Applet says "(.*?)"$/) do |page_title|
  aa = DocumentsColumnHeader.instance
  expect(aa.perform_verification("Documents Page Title", page_title)).to be_true
end

When(/^user clicks on a "(.*?)" link$/)do |element|
  aa = Documents.instance
  expect(aa.perform_action(element, "")).to be_true
end

Then(/^the Documents Applet table contains headers$/) do |table|
  aa = DocumentsColumnHeader.instance
  expect(aa.wait_until_action_element_visible("Header1", DefaultLogin.wait_time)).to be_true
  verify_documents_table_headers(aa, table)
end

def verify_documents_table_headers(access_browser_instance, table)
  table.rows.each do |key, value|
    expect(access_browser_instance.perform_verification(key, value)).to be_true
  end #verify_documents_table_headers
end

Then(/^the Document Applet table contains specific rows$/) do |table|
  verify_table_rows_documents(table)
end

Then(/^the Document Applet table contains rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  con = VerifyTableValue.new 
  driver = TestSupport.driver
  wait.until {  
    #'[data-appletid=documents] #data-grid-documents'
    browser_elements_list = driver.find_elements(:css, "#data-grid-documents tbody tr")  
    con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-documents']", table)
  }
end

Then(/^the user selects the "(.*?)" row in Documents Applet$/) do |kind|
  driver = TestSupport.driver
  aa = Documents.instance
  # expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true, "Expected 6 but didn't find that in the application"
  expect(aa.perform_action(kind, "")).to be_true
end

Then(/^the Documents Applet detail "(.*?)" page title says "(.*?)"$/) do |_not_used, details_title|
  aa = Documents.instance
  expect(aa.wait_until_action_element_visible("Details Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("Details Title", details_title)).to be_true
end

Then(/^the Documents Applet detail "(.*?)" view contains fields$/) do |_type, table|
  aa = Documents.instance
  expect(aa.wait_until_action_element_visible("Is Detail Panel Text visible", DefaultLogin.wait_time)).to be_true
  table.rows.each do |row|
    expect(aa.perform_verification('Document Modal Details', row[0])).to be_true, "The value #{row[0]} is not present in the document modal details"
    expect(aa.perform_verification('Document Modal Details', row[1])).to be_true, "The value #{row[1]} is not present in the document modal details"
  end
end

Then(/^the Documents Applet detail "(.*?)" view content contains$/) do |_type, table|
  aa = Documents.instance
  expect(aa.wait_until_action_element_visible("Is Detail Panel Text visible", DefaultLogin.wait_time)).to be_true
  table.rows.each do |row|
    expect(aa.perform_verification('Document Modal Details', row[0])).to be_true, "The value #{row[0]} is not present in the document modal details"
  end
end

Then(/^the Documents Applet detail view closes when user clicks the close button$/) do
  aa = Documents.instance
  driver = TestSupport.driver
  close_button = driver.find_element(:id, "bottomDetailCloseBtn")
  close_button.location_once_scrolled_into_view
  expect(aa.perform_action("Close", "")).to be_true

  # Add verification that the detail view closes when user clicks the close button
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { driver.find_element(:id, 'doc-detail-wrapper').displayed? == false }
end

Then(/^the user clicks on search filter in Documents Applet$/) do
  aa = Documents.instance
  expect(aa.wait_until_action_element_visible("Search Filter", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Search Filter", "")).to be_true
end

Then(/^the user types "(.*?)" in search box of the Documents Applet$/) do |search_field|
  aa = Documents.instance
  expect(aa.wait_until_action_element_visible("Documents Filter input", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Documents Filter input", search_field)).to be_true
end

Then(/^only (?:these|this) (\d+) (?:row|rows) (?:is|are) visible in Document Applet$/) do |expected_rows|
  driver = TestSupport.driver
  aa = Documents.instance
  displayed = false
  expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 2)).to be_true

  #browser_elements_list = driver.find_elements(:xpath, "//*[@id='data-grid-documents']/descendant::tr[contains(@class, 'selectable')]")
  browser_elements_list = driver.find_elements(:css, "#data-grid-documents tr.selectable")
  expect(browser_elements_list.length).to eq(expected_rows.to_i), "Expected 1 row but #{browser_elements_list.length} are shown"
end

Then(/^the search results say "(.*?)" in Documents Applet$/) do |search_result_text|
  aa = Documents.instance
  #expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 1)).to be_true
  expect(aa.perform_verification("No Records Found", search_result_text, DefaultTiming.default_table_row_load_time)).to be_true, "No Records Found is not displayed"
end

When(/^user clicks on "(.*?)" column header in Documents Applet$/) do |groupBy|
  aa = DocumentsColumnHeader.instance
  cc = Documents.instance
  expect(cc.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true
  expect(aa.perform_action(groupBy, "")).to be_true
end

Then(/^the user sees the following groups in Documents Applet$/) do |table|
  aa = DocumentsGroup.instance
  cc = Documents.instance
  expect(cc.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true
  table.rows.each do |key, value|
    expect(aa.perform_verification(key, value)).to be_true
  end #table
end

When(/^the user clicks on date\/time "(.*?)" in the Documents Applet$/) do |dateTime|
  aa = Documents.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true
  expect(aa.perform_action(dateTime, "")).to be_true
end

Then(/^the date\/time collapses and shows "(.*?)" result for "(.*?)" in the Documents Applet$/) do |visit_count, visit_year|
  aa = Documents.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true
  count_text = visit_year + " Count"
  expect(aa.perform_verification(count_text, visit_count)).to be_true
end

Then(/^the default sorting by Date\/Time is in descending in Documents Applet$/) do
  aa = DocumentsGroup.instance
  cc = Documents.instance
  driver = TestSupport.driver
  expect(cc.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 8)).to be_true
  element_first = driver.find_element(:xpath, ".//*[@id='center-region']/descendant::*[@id='data-grid-documents']/tbody/tr[1]/descendant::td")
  element_last = driver.find_element(:xpath, ".//*[@id='center-region']/descendant::*[@id='data-grid-documents']/tbody/tr[9]/descendant::td")
  expect(aa.perform_verification("date_group1", element_first.text)).to be_true
  expect(aa.perform_verification("date_group5", element_last.text)).to be_true
end

Then(/^the sorting by Date\/Time is in ascending in Documents Applet$/) do
  aa = DocumentsGroup.instance
  cc = Documents.instance
  driver = TestSupport.driver
  expect(cc.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 8)).to be_true
  element_first = driver.find_element(:xpath, ".//*[@id='center-region']/descendant::*[@id='data-grid-documents']/tbody/tr[1]/descendant::td")
  element_last = driver.find_element(:xpath, ".//*[@id='center-region']/descendant::*[@id='data-grid-documents']/tbody/tr[9]/descendant::td")
  expect(aa.perform_verification("date_group5", element_first.text)).to be_true
  expect(aa.perform_verification("date_group1", element_last.text)).to be_true
end

Then(/^the first row is as below when grouped by "(.*?)" in Documents Applet$/) do |_groupBy, table|
  aa = Documents.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true
  verify_table_rows_documents(table)
end

Then(/^the last row is as below when grouped by "(.*?)" in Documents Applet$/) do |_groupBy, table|
  aa = Documents.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 6)).to be_true
  verify_table_rows_documents(table)
end

When(/^the "(.*?)" row is visible on the screen$/) do |_arg1|
  aa = Documents.instance
  driver = TestSupport.driver
  expect(aa.wait_until_xpath_count_greater_than("Number of Documents Applet Rows", 10)).to be_true
  crisis_note_row = driver.find_element(:id, "urn-va-document-9E7A-231-1693")
  crisis_note_row.location_once_scrolled_into_view
end

Then(/^the Documents Applet detail DoD\* Content view content contains$/) do |table|
  aa = Documents.instance
  driver = TestSupport.driver
  driver.switch_to.frame(0)
  expect(aa.wait_until_action_element_visible("DoD* Content Details", DefaultLogin.wait_time)).to be_true, "wait for element failed"
  table.rows.each do |row|
    expect(aa.perform_verification("DoD* Content Details", row[0])).to be_true, "The value #{row[0]} is not present in the DoD Content details"
  end
  driver.switch_to.default_content
end

def verify_table_rows_documents(table)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  wait.until { VerifyTableValue.compare_specific_row(table, '[data-appletid=documents] #data-grid-documents') }
end

Then(/^take screenshot for comparison purposes with name "(.*?)"$/) do |screenshot_name|
  screenshot_name = "#{ENV['SCREENSHOTS_FOLDER']}/#{screenshot_name}" if ENV.keys.include?('SCREENSHOTS_FOLDER')
  screenshot_name_png = "#{screenshot_name}.png"
  p "saving screenshot with name #{screenshot_name_png}"
  TestSupport.driver.save_screenshot(screenshot_name_png)
end

class DocumentsSpecificRows < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new('LR CYTOPATHOLOGY REPORT - TROY'), VerifyText.new, AccessHtmlElement.new(:id, 'urn-va-document-9E7A-17-SP-7049692-8548'))
    add_verify(CucumberLabel.new('RADIOLOGIC EXAMINATION, CHEST; SINGLE VIEW, FRONTAL - CAMP MASTER'), VerifyText.new, AccessHtmlElement.new(:id, 'urn-va-image-9E7A-17-7028886-8889-1'))
    add_verify(CucumberLabel.new('Administrative Note - DoD'), VerifyText.new, AccessHtmlElement.new(:id, 'urn-va-document-DOD-0000000014-1000004201'))
  end
end

Then(/^the Document applet contains "([^"]*)" row "([^"]*)"$/) do |descriptor, row|
  docs = DocumentsSpecificRows.instance
  expect(docs.wait_until_element_present(row)).to be_true
end

