class NewsFeedApplet < ADKContainer
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Coversheet Dropdown"), ClickAction.new, AccessHtmlElement.new(:id, "screenName"))
    add_verify(CucumberLabel.new("Drop Down Menu"), VerifyText.new, AccessHtmlElement.new(:class, "dropdown-menu"))
    add_action(CucumberLabel.new("Timeline"), ClickAction.new, AccessHtmlElement.new(:link_text, "Timeline"))
    add_verify(CucumberLabel.new("TIMELINE"), VerifyText.new, AccessHtmlElement.new(:css, "span.center-block.text-center.panel-title"))    
    add_verify(CucumberLabel.new("NewsFeed Page Title"), VerifyText.new, AccessHtmlElement.new(:css, "span.center-block.text-center.panel-title"))    
    add_verify(CucumberLabel.new("isTableVisible"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-newsfeed"))
    add_verify(CucumberLabel.new("Providers"), VerifyText.new, AccessHtmlElement.new(:id, "providerSection"))
    add_verify(CucumberLabel.new("Movements"), VerifyText.new, AccessHtmlElement.new(:id, "movementSection"))
    add_verify(CucumberLabel.new("modalPopUpTitle"), VerifyText.new, AccessHtmlElement.new(:id, "mainModalLabel"))      
    add_action(CucumberLabel.new("NewsFeed Filter input"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-panel-newsfeed input"))
    add_action(CucumberLabel.new("Search Filter"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-newsfeed"))      

    add_action(CucumberLabel.new("Visit 1996"), ClickAction.new, AccessHtmlElement.new(:css, "[data-instanceid='newsfeed'] #urn-va-visit-9E7A-164-677 td:nth-child(2)"))
    add_action(CucumberLabel.new("Discharged 1993"), ClickAction.new, AccessHtmlElement.new(:css, "[data-instanceid='newsfeed'] #urn-va-visit-9E7A-164-H918 td:nth-child(2)"))
    add_action(CucumberLabel.new("Admitted 1995"), ClickAction.new, AccessHtmlElement.new(:css, "[data-instanceid='newsfeed'] #urn-va-visit-9E7A-164-H2303 td:nth-child(2)"))
    add_action(CucumberLabel.new("Immunization 2000"), ClickAction.new, AccessHtmlElement.new(:css, "[data-instanceid='newsfeed'] #urn-va-immunization-9E7A-287-45 td:nth-child(2)"))
    add_action(CucumberLabel.new("Surgery 1994"), ClickAction.new, AccessHtmlElement.new(:css, "[data-instanceid='newsfeed'] #urn-va-surgery-9E7A-65-28 td:nth-child(2)"))
    add_action(CucumberLabel.new("Consult 1995"), ClickAction.new, AccessHtmlElement.new(:css, "[data-instanceid='newsfeed'] #urn-va-consult-9E7A-164-70 td:nth-child(2)"))

    # had to use xpath instead of css, suspect the css didn't like the comma in the id
    add_action(CucumberLabel.new("Procedure 2005"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='urn-va-procedure-9E7A-100599-8-MDD(702,']/td[2]"))

    add_verify(CucumberLabel.new("CloseButton"), VerifyText.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))  
    add_action(CucumberLabel.new("May 1996"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'May 1996')]"))
    add_action(CucumberLabel.new("December 1995"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'December 1995')]")) 
    add_verify(CucumberLabel.new("May 1996 Count"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='199605_groupCount']"))  

    add_verify(CucumberLabel.new("December 1995 Count"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='199512_groupCount']"))  
    add_verify(CucumberLabel.new("title1"), VerifyText.new, AccessHtmlElement.new(:id, "tl_time_title"))
    add_verify(CucumberLabel.new("title2"), VerifyText.new, AccessHtmlElement.new(:id, "tl_time_range"))
    add_verify(CucumberLabel.new("No Records Found"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'No Records Found')]"))
    add_action(CucumberLabel.new("Search Spinner"), ClickAction.new, AccessHtmlElement.new(:id, "searchSpinner")) 
    add_action(CucumberLabel.new("DoD Appointment"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='urn-va-appointment-DOD-0000000011-1000000717']/td[2]"))
    add_action(CucumberLabel.new("Lab 1998"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='urn-va-lab-9E7A-17-CH-7018878-8366-7']/td[2]"))
    add_action(CucumberLabel.new("DoD Encounter 2012"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='urn-va-visit-DOD-0000000011-1000000721']/td[2]"))
    add_verify(CucumberLabel.new("Newsfeed Modal Details"), VerifyContainsText.new, AccessHtmlElement.new(:id, "modal-body"))
      
    @@newsfeed_applet_data_grid_rows = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-newsfeed']/descendant::tr")
    add_verify(CucumberLabel.new("Number of Newsfeed Applet Rows"), VerifyXpathCount.new(@@newsfeed_applet_data_grid_rows), @@newsfeed_applet_data_grid_rows)
  end
end

class NewsFeedDateFilter < ADKContainer
  include Singleton
  def initialize
    super 
    add_action(CucumberLabel.new("Control - Applet - Date Filter"), ClickAction.new, AccessHtmlElement.new(:css, "#navigation-date #date-region-minimized"))
    add_action(CucumberLabel.new("Control - Applet - From Date"), SendKeysAction.new, AccessHtmlElement.new(:css, "#globalDate-region #filter-from-date-global"))
    add_action(CucumberLabel.new("Control - Applet - To Date"), SendKeysAction.new, AccessHtmlElement.new(:id, "filter-to-date-global"))
    add_action(CucumberLabel.new("Control - Applet - Apply"), ClickAction.new, AccessHtmlElement.new(:id, "custom-range-apply-global"))
  end
end

class NewsFeedColumnHeader < ADKContainer
  include Singleton
  def initialize
    super 
    # Start section
    # Had to change accessor from css to xpath, css accessor was working locally but failing on jenkins
    # add_verify(CucumberLabel.new("Header1"), VerifyText.new, AccessHtmlElement.new(:css, "[data-instanceid=newsfeed] #newsfeed-activityDateTime"))
    # add_verify(CucumberLabel.new("Header2"), VerifyText.new, AccessHtmlElement.new(:css, "[data-instanceid=newsfeed] #newsfeed-activity"))
    # add_verify(CucumberLabel.new("Header3"), VerifyText.new, AccessHtmlElement.new(:css, "[data-instanceid=newsfeed] #newsfeed-displayType"))
    # add_verify(CucumberLabel.new("Header4"), VerifyText.new, AccessHtmlElement.new(:css, "[data-instanceid=newsfeed] #newsfeed-primaryProviderDisplay"))
    # add_verify(CucumberLabel.new("Header5"), VerifyText.new, AccessHtmlElement.new(:css, "[data-instanceid=newsfeed] #newsfeed-facilityName"))
    add_verify(CucumberLabel.new("Header1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='newsfeed-activityDateTime']"))
    add_verify(CucumberLabel.new("Header2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='newsfeed-activity']"))
    add_verify(CucumberLabel.new("Header3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='newsfeed-displayType']"))
    add_verify(CucumberLabel.new("Header4"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='newsfeed-primaryProviderDisplay']"))
    add_verify(CucumberLabel.new("Header5"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='newsfeed-facilityName']"))
    # End Section   
    add_action(CucumberLabel.new("Date/Time"), ClickAction.new, AccessHtmlElement.new(:link_text, "Date & Time"))
    add_action(CucumberLabel.new("Type"), ClickAction.new, AccessHtmlElement.new(:link_text, "Type"))  
    add_action(CucumberLabel.new("Facility"), ClickAction.new, AccessHtmlElement.new(:link_text, "Facility"))    
  end
end

class NewsFeedGroup < ADKContainer
  include Singleton
  def initialize
    super   
    add_verify(CucumberLabel.new("date_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'May 1996')]"))
    add_verify(CucumberLabel.new("date_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'December 1995')]")) 
    add_verify(CucumberLabel.new("date_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'September 1995')]"))
    add_verify(CucumberLabel.new("date_group4"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'July 1995')]")) 
    add_verify(CucumberLabel.new("date_group5"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'June 1995')]"))
    add_verify(CucumberLabel.new("date_group6"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'January 1995')]"))
    add_verify(CucumberLabel.new("date_group7"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'May 1993')]"))
    add_verify(CucumberLabel.new("row_first"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'November 2006')]/b"))
    add_verify(CucumberLabel.new("row_last"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'February 2005')]/b"))  
      
    add_verify(CucumberLabel.new("type_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'Procedure')]"))
    add_verify(CucumberLabel.new("type_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'Visit')]"))
    add_verify(CucumberLabel.new("type_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'Appointment')]"))
      
    add_verify(CucumberLabel.new("facility_group1"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'ABILENE (CAA)')]"))
    add_verify(CucumberLabel.new("facility_group2"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'CAMP MASTER')]"))
    add_verify(CucumberLabel.new("facility_group3"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@data-instanceid='newsfeed']/descendant::td[contains(string(),'FT. LOGAN')]"))
  end
end

When(/^user selects Timeline from Coversheet dropdown$/) do
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("Coversheet Dropdown", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Coversheet Dropdown", "")).to be_true, "Could not click on Dropdown menu"
  expect(aa.wait_until_element_present("Drop Down Menu", 60)).to be_true, "Could not see the drop down menu"
  expect(aa.perform_action("Timeline", "")).to be_true, "Could not click on Timeline link form drop down menu"
end

When(/^user navigates to Timeline Applet$/) do
  navigate_in_ehmp '#news-feed'
end

Then(/^the Timeline page title is "(.*?)"$/) do |page_title|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("NewsFeed Page Title", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification("NewsFeed Page Title", page_title)).to be_true
end

def debug_on_jenkins
  driver = TestSupport.driver
  headers = driver.find_elements(:xpath, "//*[@data-instanceid='newsfeed']/descendant::th")
  p "number of headers #{headers.length}"
  headers.each do | th |
    p "header: #{th.attribute('id')} with value #{th.attribute('value')} #{th.text}"
  end
end

Then(/^the newsfeed table contains headers$/) do |table|
  aa = NewsFeedColumnHeader.instance
  table.rows.each do | key, value |
    result_of_verification = aa.perform_verification(key, value)
    debug_on_jenkins unless result_of_verification
    expect(result_of_verification).to be_true
  end #table
end

Then(/^the user sees "(.*?)" and "(.*?)" highlighted in orange$/) do |admitted, discharged|
  driver = TestSupport.driver
  matched = false
  text_color = ""
  admitted_element = driver.find_element(:id, "admittedVisit")
  discharged_element = driver.find_element(:id, "discharged")
  admitted_element_color = admitted_element.css_value("background-color")
  discharged_element_color = discharged_element.css_value("background-color") 
  if admitted_element_color && discharged_element_color  == "rgba(240, 173, 78, 1)"
    matched = true
  else
    matched = false
  end

  expect(matched).to be_true, "color in browser: #{text_color} found in feature file orange"
end

Then(/^the user clicks on newsfeed search filter$/) do
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("Search Filter", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Search Filter", "")).to be_true
end

Then(/^when the user types "(.*?)" in input box$/) do |search_field|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("NewsFeed Filter input", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("NewsFeed Filter input", search_field)).to be_true
end

Then(/^the user clicks on the event "(.*?)" in NewsFeedApplet$/) do | table_cell |
  driver = TestSupport.driver  
  aa = NewsFeedApplet.instance
  #expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true
  expect(aa.perform_action(table_cell, "")).to be_true
end

Then(/^the user sees modal pop\-up title "(.*?)"$/) do |modal_popup_title|
  driver = TestSupport.driver
  aa = NewsFeedApplet.instance
#  aa.wait_until_element_present("Search Spinner")
#  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
#  wait.until { driver.find_element(:id, "searchSpinner").attribute("style").strip =="display: none;" } # wait until specific list element is NOT
  
  expect(aa.wait_until_action_element_visible("modalPopUpTitle", DefaultLogin.wait_time)).to be_true
  #loading_text = aa.perform_verification("modalPopUpTitle", "Loading...")
  #loading_text = aa.perform_verification("modalPopUpTitle", "Loading...") until !loading_text
  expect(aa.perform_verification("modalPopUpTitle", modal_popup_title)).to be_true 
end

Then(/^the user sees the modal pop\-up$/) do |table|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("CloseButton", DefaultLogin.wait_time)).to be_true
  table.rows.each do | row |
    expect(aa.perform_verification('Newsfeed Modal Details', row[0])).to be_true, "The value #{row[0]} is not present in the newsfeed modal details"
    expect(aa.perform_verification('Newsfeed Modal Details', row[1])).to be_true, "The value #{row[1]} is not present in the newsfeed modal details"
  end 
end

Then(/^the user sees modal details$/) do |table|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("CloseButton", DefaultLogin.wait_time)).to be_true
  table.rows.each do | row |
    expect(aa.perform_verification('Newsfeed Modal Details', row[0])).to be_true, "The value #{row[0]} is not present in the newsfeed modal details"
  end
end

Then(/^the user sees the section header "(.*?)"$/) do |header_type|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible(header_type, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(header_type, header_type)).to be_true
end

Then(/^user clicks on the Close button$/) do 
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("Close", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Close", "")).to be_true
end

Then(/^the detail view in NewsFeed Applet closes$/) do
  wait_until_modal_is_not_displayed
end

Then(/^the user sees the following groups in Newsfeed Applet$/) do |table|
  aa = NewsFeedGroup.instance
  cc = NewsFeedApplet.instance
  expect(cc.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true
  table.rows.each do | key, value |
    expect(aa.perform_verification(key, value)).to be_true
  end #table
end

When(/^the user clicks on date\/time "(.*?)" in the newsfeed applet$/) do |dateTime|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 8)).to be_true
  expect(aa.perform_action(dateTime, "")).to be_true
end

Then(/^the date\/time collapses and shows "(.*?)" result for "(.*?)" in the newsfeed applet$/) do |visit_count , visit_year|
  aa = NewsFeedApplet.instance
  driver = TestSupport.driver
  #expect(aa.wait_until_action_element_visible("isTableVisible", DefaultLogin.wait_time)).to be_true
  expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 10)).to be_true
  count_text = visit_year + " Count"
  #expect(aa.wait_until_action_element_visible(count_text, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(count_text, visit_count)).to be_true
end

Then(/^the default sorting by Date\/Time is in descending in Newsfeed Applet$/) do
  expect(true).to be_true
  aa = NewsFeedGroup.instance
  cc = NewsFeedApplet.instance
  driver = TestSupport.driver
  expect(cc.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 8)).to be_true
  element_first = driver.find_element(:xpath, ".//*[@data-instanceid='newsfeed']/descendant::*[@id='data-grid-newsfeed']/tbody/tr[1]/descendant::td")
  element_last = driver.find_element(:xpath, ".//*[@data-instanceid='newsfeed']/descendant::*[@id='data-grid-newsfeed']/tbody/tr[4]/descendant::td")
  expect(aa.perform_verification("row_first", element_first.text)).to be_true
  expect(aa.perform_verification("row_last", element_last.text)).to be_true
end

When(/^user clicks on "(.*?)" column header in Newsfeed Applet$/) do | groupBy |
  aa = NewsFeedColumnHeader.instance
  cc = NewsFeedApplet.instance
  expect(cc.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true
  expect(aa.perform_action(groupBy, "")).to be_true
end

Then(/^the sorting by Date\/Time is in ascending in Newsfeed Applet$/) do
  expect(true).to be_true
  aa = NewsFeedGroup.instance
  cc = NewsFeedApplet.instance
  driver = TestSupport.driver
  expect(cc.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 8)).to be_true
  #//*[@data-instanceid='newsfeed']/
  element_first = driver.find_element(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='data-grid-newsfeed']/tbody/tr[1]/descendant::td")
  element_last = driver.find_element(:xpath, "//*[@data-instanceid='newsfeed']/descendant::*[@id='data-grid-newsfeed']/tbody/tr[6]/descendant::td")
  expect(aa.perform_verification("row_last", element_first.text)).to be_true
  expect(aa.perform_verification("row_first", element_last.text)).to be_true
end

Then(/^the user sees title "(.*?)", "(.*?)" in Newsfeed Applet$/) do |title1, title2|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_action_element_visible("isTableVisible", DefaultLogin.wait_time)).to be_true
  expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true
  expect(aa.perform_verification("title1", title1)).to be_true
  expect(aa.perform_verification("title2", title2)).to be_true
end

Then(/^the first row is as below when grouped by "(.*?)" in Newsfeed Applet$/) do |groupBy, table|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true
  verify_table_rows_newsfeed(table)
end

Then(/^the last row is as below when grouped by "(.*?)" in Newsfeed Applet$/) do |groupBy, table|
  aa = NewsFeedApplet.instance
  expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true
  verify_table_rows_newsfeed(table)
end

Then(/^the search results say "(.*?)" in NewsFeed Applet$/) do |search_result_text|
  aa = NewsFeedApplet.instance
  #expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 1)).to be_true
  #expect(aa.static_dom_element_exists?("No Records Found")).to be_true, "No Records Found is not displayed"
  #expect(aa.wait_until_action_element_visible("No Records Found", 60)).to be_true   
  expect(aa.perform_verification("No Records Found", search_result_text)).to be_true
end

Then(/^only (?:these|this) (\d+) (?:row|rows) (?:is|are) visible in Newfeed Applet$/) do |expected_rows | 
  driver = TestSupport.driver
  aa = NewsFeedApplet.instance
  displayed = false
  expect(aa.wait_until_xpath_count_greater_than("Number of Newsfeed Applet Rows", 2)).to be_true

  browser_elements_list = driver.find_elements(:css, "#center-region #data-grid-newsfeed tr.selectable")
  expect(browser_elements_list.length).to eq(expected_rows.to_i), "Expected 1 row but #{browser_elements_list.length} are shown"
end

#Then(/^the user sees the modal pop\-up order$/) do |table|
#  driver = TestSupport.driver
#  aa = NewsFeedApplet.instance
#  expect(aa.wait_until_action_element_visible("CloseButton", 60)).to be_true
#  browser_elements_list = driver.find_elements(:xpath, "//div[@id='order-modal-content']/descendant::div[contains(@class,'row')]/descendant::div[contains(string(), 'Order #')]/following-sibling::div")
#  p browser_elements_list.length 
#  matched = false
#  con = VerifyTableValue.new
#  matched = con.verify_name_value(browser_elements_list, table)
#  expect(matched).to be_true 
#end
#
#Then(/^the user sees the modal pop\-up Attending Physician$/) do |table|
#  driver = TestSupport.driver
#  aa = NewsFeedApplet.instance
#  expect(aa.wait_until_action_element_visible("CloseButton", 60)).to be_true
#  browser_elements_list = driver.find_elements(:xpath, "//div[@id='order-modal-content']/descendant::div[contains(@class,'row')]/descendant::div[contains(string(), 'Attending Physician')]/following-sibling::div")
#  p browser_elements_list.length 
#  matched = false
#  con = VerifyTableValue.new
#  matched = con.verify_name_value(browser_elements_list, table)
#  expect(matched).to be_true 
#end

Then(/^the NewsFeed Applet table contains specific rows$/) do |table|
  verify_table_rows_newsfeed(table)
end

def verify_table_rows_newsfeed(table)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time * 2)
  wait.until { VerifyTableValue.compare_specific_row(table, '[data-instanceid=newsfeed] #data-grid-newsfeed') }
end
