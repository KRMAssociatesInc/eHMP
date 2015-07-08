

class PatientSearch < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("patientSearch"), ClickAction.new, AccessHtmlElement.new(:id, "patientSearchButton"))
    add_action(CucumberLabel.new("myCPRSList"), ClickAction.new, AccessHtmlElement.new(:id, "myCPRSList"))
    add_action(CucumberLabel.new("defaultSearchInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "patientFilterInput"))
    add_action(CucumberLabel.new("patientSearchInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "patientSearchInput"))
    add_action(CucumberLabel.new("mySite"), ClickAction.new, AccessHtmlElement.new(:id, "mySite"))
    add_action(CucumberLabel.new("global"), ClickAction.new, AccessHtmlElement.new(:id, "global"))
    add_action(CucumberLabel.new("mySiteClinics"), ClickAction.new, AccessHtmlElement.new(:id, "mySiteClinics"))
    add_action(CucumberLabel.new("mySiteWards"), ClickAction.new, AccessHtmlElement.new(:id, "mySiteWards"))
    add_action(CucumberLabel.new("mySiteAll"), ClickAction.new, AccessHtmlElement.new(:css, "#all > a"))
    add_action(CucumberLabel.new("patientSearchInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "patientSearchInput"))
    add_action(CucumberLabel.new("center"), ClickAction.new, AccessHtmlElement.new(:id, "patient-search-main"))
    add_action(CucumberLabel.new("Search Tab"), ClickAction.new,  AccessHtmlElement.new(:class, "patientDisplayName"))
    #add_action(CucumberLabel.new("Confirm"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@id, 'patient-search-confirmation')]/div/button"))
    add_action(CucumberLabel.new("Confirm"), ClickAction.new, AccessHtmlElement.new(:id, "confirmationButton"))
    add_verify(CucumberLabel.new("panel-heading"), VerifyContainsText.new, AccessHtmlElement.new(:class, "panel-title"))
    @@patient_search_count = AccessHtmlElement.new(:xpath, "//*[@id='patient-search-results']/descendant::a")
    add_verify(CucumberLabel.new("Patient Search Results"), VerifyXpathCount.new(@@patient_search_count), @@patient_search_count)
    @@global_search_count = AccessHtmlElement.new(:xpath, "//*[@id='global-search-results']/descendant::a")
    add_verify(CucumberLabel.new("Global Search Results"), VerifyXpathCount.new(@@global_search_count), @@global_search_count)
    add_action(CucumberLabel.new("globalSearchLastName"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "globalSearchLastName"))
    add_action(CucumberLabel.new("globalSearchFirstName"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "globalSearchFirstName"))
    add_action(CucumberLabel.new("globalSearchDob"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "globalSearchDob"))
    add_action(CucumberLabel.new("globalSearchSsn"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "globalSearchSsn"))
    add_action(CucumberLabel.new("globalSearch"), ClickAction.new, AccessHtmlElement.new(:id, "globalSearchButton"))
    
    add_verify(CucumberLabel.new("acknowledgement message"), VerifyContainsText.new, AccessHtmlElement.new(:id, "ackMessagePanel"))
    add_action(CucumberLabel.new("Patient Result"), ClickAction.new,  AccessHtmlElement.new(:xpath, "//div[@id='location-list-results']/descendant::div[contains(@class, 'list-group')]/descendant::p[contains(@class, 'list-group-item row-layout active')]"))
    add_verify(CucumberLabel.new("Error Message"), VerifyContainsText.new, AccessHtmlElement.new(:id, "error-message"))
    add_verify(CucumberLabel.new("Error Message patient"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@class='results-table']/descendant::div[contains(@class, 'list-group')]/descendant::p[contains(@class, 'error-message padding')]"))
    #add_verify(CucumberLabel.new("Global Error Message"), VerifyContainsText.new, AccessHtmlElement.new(:class, "error-message"))
    add_verify(CucumberLabel.new("Global Error Message"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@class='results-table']/descendant::div[contains(@class, 'list-group')]/descendant::p[contains(@class, 'error-message padding')]"))
    @@applet_count = AccessHtmlElement.new(:xpath, "//*[@data-appletid]")
    add_verify(CucumberLabel.new("Number of Applets"), VerifyXpathCount.new(@@applet_count), @@applet_count)
    add_action(CucumberLabel.new("clinics"), ClickAction.new, AccessHtmlElement.new(:css, "#clinics>a"))
    add_action(CucumberLabel.new("patientSearchKeyword"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#location-list-filter-input input.form-control"))
    add_action(CucumberLabel.new("locationDisplayName"), ClickAction.new, AccessHtmlElement.new(:css, ".locationDisplayName"))
    add_action(CucumberLabel.new("patientFilterInput"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "patientFilterInput"))
    add_action(CucumberLabel.new("Ward"), ClickAction.new, AccessHtmlElement.new(:css, "#wards>a"))
    add_verify(CucumberLabel.new("error message padding"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='location-list-results']/descendant::div[contains(@class, 'list-group')]/descendant::p[contains(@class, 'error-message padding')]"))
    add_verify(CucumberLabel.new("unAuthorized"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".unAuthorized"))
    add_action(CucumberLabel.new("ackButton"), ClickAction.new, AccessHtmlElement.new(:id, "ackButton"))

    location_list_result_count = AccessHtmlElement.new(:xpath, "//div[@id='location-list-results']/descendant::a")
    add_verify(CucumberLabel.new("Number of Location List Results"), VerifyXpathCount.new(location_list_result_count), location_list_result_count)
    #CONFIRM SECTION
    add_verify(CucumberLabel.new("patient identifying name"), VerifyText.new, AccessHtmlElement.new(:css, "#confirmSection div.patientName"))

    add_verify(CucumberLabel.new("no patient error message"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//div[@id='confirmSection']/p"))

    confirm_section = AccessHtmlElement.new(:css, "#confirmSection div.patientInfo")
    add_verify(CucumberLabel.new("patient identifying traits"), VerifyText.new, confirm_section)
    #add_verify(CucumberLabel.new("patient name"), VerifyContainsText.new, confirm_section)
    add_verify(CucumberLabel.new("dob"), VerifyContainsText.new, confirm_section)
    add_verify(CucumberLabel.new("age"), VerifyContainsText.new, confirm_section)
    add_verify(CucumberLabel.new("gender"), VerifyContainsText.new, confirm_section)
    add_verify(CucumberLabel.new("ssn"), VerifyContainsText.new, confirm_section)
    add_verify(CucumberLabel.new("alert"), VerifyContainsText.new, confirm_section)
  end

  def patient_search_count
    return @@patient_search_count
  end

  def select_patient_in_list(index)
    driver = TestSupport.driver

    how = patient_search_count.how
    location = patient_search_count.locator
    patientlist = driver.find_elements(how, location)
    patientlist[index.to_i].click
    TestSupport.wait_for_page_loaded
  end

  def select_default_patient_name_in_list(name)
    full_xpath = "//div[@id='my-cprs-search-results']/descendant::div[contains(@class, 'list-group-item-text')]/descendant::div[contains(string(), '#{name}')]"
    p full_xpath
    add_action(CucumberLabel.new("My Patient Name"), ClickAction.new, AccessHtmlElement.new(:xpath, full_xpath))

    # deliberate use of wait time other then the DefaultLogin.wait_time
    return false unless wait_until_element_present("My Patient Name", 60)
    return perform_action("My Patient Name")
  end

  def select_global_patient_name_in_list(name)
    full_xpath = "//div[@id='global-search-results']/descendant::div[contains(@class, 'list-group-item-text')]/descendant::div[contains(string(), '#{name}')]"
    #p full_xpath
    add_action(CucumberLabel.new("My Patient Name"), ClickAction.new, AccessHtmlElement.new(:xpath, full_xpath))

    # deliberate use of wait time other then the DefaultLogin.wait_time
    return false unless wait_until_element_present("My Patient Name", 60)
    return perform_action("My Patient Name")
  end

  def select_patient_name_in_list(name)
    #full_xpath = "div.col-md-6.no-padding-right.patientDisplayName"
    #add_action(CucumberLabel.new("My Patient Name"), ClickAction.new, AccessHtmlElement.new(:css, full_xpath))
    full_xpath = "//div[@id='patient-search-results']/descendant::div[contains(@class, 'list-group-item-text')]/descendant::div[contains(string(), '#{name}')]"
    p full_xpath
    add_action(CucumberLabel.new("My Patient Name"), ClickAction.new, AccessHtmlElement.new(:xpath, full_xpath))
    
    # deliberate use of wait time other then the DefaultLogin.wait_time
    return false unless wait_until_element_present("My Patient Name", 60)
    return perform_action("My Patient Name")
  end
end

class PatientSearch2 < PatientSearch
  include Singleton
  def initialize
    super
    p 'here'
    add_action(CucumberLabel.new("Confirm Flag"), ClickAction.new, AccessHtmlElement.new(:id, "confirmFlaggedPatinetButton"))
  end
end

Then(/^the User selects mysite and All$/) do
  patient_search= PatientSearch.instance
  wait_until_present_and_perform_action(patient_search, 'mySite')
  wait_until_present_and_perform_action(patient_search, 'mySiteAll')
end

#MyCPRSList or Default tab
Then(/^the User selects MyCPRSList$/) do
  con= PatientSearch.instance
  wait_until_present_and_perform_action(con, 'myCPRSList')
end

#Default search
Then(/^user enters full last name in default search "(.*?)"$/) do  |search_value|
  patient_search= PatientSearch.instance
  wait_until_present_and perform_action(patient_search, 'defaultSearchInput', search_value)
end

Then(/^the User selects All Patient$/) do
  con= PatientSearch.instance
  wait_until_present_and_perform_action(con, "global")
end

#Global search firstName
Then(/^user enters first name in all patient search "(.*?)"$/) do  |search_value|
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('globalSearchFirstName', search_value)
end

#Global search lastName
Then(/^user enters full last name in all patient search "(.*?)"$/) do  |search_value|
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('globalSearchLastName', search_value)
end

#Global search DOB MMDDYYYY
Then(/^user enters date of birth in all patient search "(.*?)"$/) do  |search_value|
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('globalSearchDob', search_value)
end

#Global search SSN
Then(/^user enters ssn in all patient search "(\d+)"$/) do  |search_value|
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('globalSearchSsn', search_value)
end

#Global search button
Then(/^the user click on All Patient Search$/) do
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('globalSearch')
end

#Global patient search count
Then(/^the Global Patient Search contains (\d+) rows$/) do |num_rows|
  count = PatientSearch.instance
  count.wait_until_xpath_count("Global Search Results", num_rows.to_i)
  expect(count.perform_verification("Global Search Results", num_rows.to_i)).to be_true, "expected #{num_rows}"
end

Then(/^the user verifies the "(.*?)"$/) do  |error|
  con = PatientSearch.instance
  #driver = TestSupport.driver
  con.wait_until_action_element_visible("Global Error Message", 60)
  expect(con.static_dom_element_exists?("Global Error Message")).to be_true
  expect(con.perform_verification("Global Error Message", error)).to be_true
end

Then(/^the user verifies the no patient found error "(.*?)"$/) do  |error|
  con = PatientSearch.instance
  con.wait_until_action_element_visible("no patient error message", 60)
  expect(con.static_dom_element_exists?("no patient error message")).to be_true
  expect(con.perform_verification("no patient error message", error)).to be_true
end

Then(/^user enters full last name "(.*?)"$/) do  |search_value|
  con= PatientSearch.instance
 # TestSupport.wait_for_page_loaded
  wait_until_present_and_perform_action(con, 'patientSearchInput', search_value)
  wait_until_present_and_perform_action(con, 'center')
end

Then(/^the user select default result patient name "(.*?)"$/) do  |name|
  patient_search= PatientSearch.instance
  expect(patient_search.select_default_patient_name_in_list(name)).to be_true
end

Then(/^the user select patient name "(.*?)"$/) do  |name|
  patient_search= PatientSearch.instance
  expect(patient_search.select_patient_name_in_list(name)).to be_true
end

Then(/^the user select all patient result patient name "(.*?)"$/) do  |name|
  patient_search= PatientSearch.instance
  expect(patient_search.select_global_patient_name_in_list(name)).to be_true
end

Then(/^the all patient "(.*?)" is displayed on confirm section header$/) do |arg1, table|
  con = PatientSearch.instance
  con.wait_until_element_present(arg1)
  expect(con.static_dom_element_exists? arg1).to be_true
  table.rows.each do |field_name, value|
    con.wait_until_element_present(field_name)
    expect(con.perform_verification(field_name, value)).to be_true, "Verification failed on #{field_name}"
  end
end

Then(/^the all patient "(.*?)" is displayed on confirm section$/) do |arg1, table|
  con = PatientSearch.instance
  con.wait_until_element_present(arg1)
  expect(con.static_dom_element_exists? arg1).to be_true

  table.rows.each do |field_name, value|
    con.wait_until_element_present(field_name)
    expect(con.perform_verification(field_name, value)).to be_true, "Verification failed on #{field_name}"
  end
end

Then(/^the all patient "(.*?)" is displayed on acknowledgement confirm section$/) do |arg1, table|
  con = PatientSearch.instance
  con.wait_until_element_present(arg1)
  expect(con.static_dom_element_exists? arg1).to be_true
  
  table.rows.each do |field_name, value|
    con.wait_until_element_present(field_name)
    expect(con.perform_verification(field_name, value)).to be_true, "Verification failed on #{field_name}"
  end
end

Then(/^user cannot find patient name "(.*?)"$/) do  |name|
  con= PatientSearch.instance
 # TestSupport.wait_for_page_loaded
  con.wait_until_element_present("Search Tab", 10)
  wait_until_present_and_perform_action('Search Tab', name)
  TestSupport.wait_for_page_loaded
  con.add_verify(CucumberLabel.new("Search Tab"), VerifyText.new, AccessHtmlElement.new(:class, "patientDisplayName"))
  expect(con.static_dom_element_exists?("Search Tab")).to eq(false)
end

Then(/^the user click on Confirm Selection$/) do
  patient_search= PatientSearch.instance
  wait_until_present_and_perform_action(patient_search, "Confirm")
end

Then(/^the user looks for "(.*?)"$/) do  |name|
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  expect(con.static_dom_element_exists? name).to be_true
end

Given(/^user attempt to click on Patient search$/) do
  con= PatientSearch.instance
  if con.static_dom_element_exists?("patientSearch")
    TestSupport.wait_for_page_loaded
    con.perform_action('patientSearch')
  else
    login_screen = Login.instance
  end
end

Then(/^user looks for  My site$/) do
  con= PatientSearch.instance
  wait_until_present_and_perform_action(con, 'mySite')
end

Then(/^On my site User looks for All$/) do
  con= PatientSearch.instance
  wait_until_present_and_perform_action(con, 'mySite')
  wait_until_present_and_perform_action(con, 'mySiteAll')
end

Then(/^the VPR results for "(.*?)" contain:$/) do |patient, table|
  error_messages=[]
  patient_details = TransPatientBarHTMLElements.instance
  ps = PatientSearch.instance
#  TestSupport.wait_for_jquery_completed
  header_xpath = patient_details.build_header_xpath(patient)
  p header_xpath
  expect(ps.wait_until_action_element_visible("patient identifying name", DefaultLogin.wait_time)).to be_true
  element_found = (patient_details.dynamic_dom_element_exists?("xpath", header_xpath))
  error_messages.push("Header for #{patient} was not element_found") unless element_found
  table.rows.each do | row|
    table_xpath = patient_details.build_table_contents_xpath(header_xpath, row[0])
    table_element_found = patient_details.dynamic_dom_element_exists?("xpath", table_xpath)
    error_messages.push("#{row[0]} was not element_found") unless table_element_found
    element_found = table_element_found && element_found
  end
  error_messages.each do | message |
    p message
  end
  expect(element_found).to be_true
end

Then(/^no results are displayed in patient search$/) do
  con= PatientSearch.instance
#  TestSupport.wait_for_page_loaded
  #con.wait_until_action_element_visible("Patient Result", 60)
 # expect(con.static_dom_element_exists?("Patient Result")).to eq(false)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { con.static_dom_element_exists?("Patient Result") == false }
end

Then(/^no results are displayed in word$/) do
  con= PatientSearch.instance
  #TestSupport.wait_for_page_loaded
 # expect(!con.static_dom_element_exists?("locationDisplayName")).to eq(true)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { con.static_dom_element_exists?("locationDisplayName") == false }
end

Then(/^the navigation bar displays the Patient Search Button$/) do
  patient_search= PatientSearch.instance
  expect(patient_search.wait_until_element_present("patientSearch")).to be_true
end

When(/^the user clicks the Patient Search Button$/) do
  patient_search= PatientSearch.instance
  expect(patient_search.perform_action("patientSearch")).to be_true
end

Given(/^user attempt to filter by keyword "(.*?)"$/) do |keyword|
  patient_search= PatientSearch.instance
  wait_until_present_and_perform_action(patient_search, 'patientSearchKeyword', keyword)
end

Given(/^the user select keyword "(.*?)"$/) do |name|
  patient_search= PatientSearch.instance
  label = "Ward #{name}"
  patient_search.add_action(CucumberLabel.new(label), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[@id='location-list-results']/descendant::span[contains(string(), '#{name}')]"))
  wait_until_present_and_perform_action(patient_search, label)
end

Given(/^user enters patient "(.*?)" in the patient filter$/) do |patient|
  patient_search = PatientSearch.instance
  wait_until_present_and_perform_action(patient_search, "patientFilterInput", patient)
end

Then(/^the User selects mysite and clinics$/) do
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  wait_until_present_and_perform_action(con, 'mySite')
  wait_until_present_and_perform_action(con, 'clinics')
end

Then(/^the user verifies word "(.*?)"$/)  do  |error|
  patient_search = PatientSearch.instance
 # driver = TestSupport.driver 
  expect(patient_search.wait_until_action_element_visible("error message padding", 60)).to be_true
  expect(patient_search.static_dom_element_exists?("error message padding")).to be_true
  expect(patient_search.perform_verification("error message padding", error)).to be_true
end

Then(/^the user verifies patient "(.*?)"$/) do  |error|
  con = PatientSearch.instance
  expect(con.perform_verification("Error Message patient", error)).to be_true
end

def wait_until_present_and_perform_action(access_browser_instance, cucumber_label, action_extra = nil)
  #expect(access_browser_instance.wait_until_element_present(cucumber_label)).to be_true, "#{cucumber_label} did not display"
  expect(access_browser_instance.perform_action(cucumber_label, action_extra)).to be_true, "Error performing action on #{cucumber_label}"
end

Then(/^the User selects mysite and Ward$/) do
  patient_search_elements = PatientSearch.instance
  wait_until_present_and_perform_action(patient_search_elements, 'mySite')
  wait_until_present_and_perform_action(patient_search_elements, 'Ward')
end

Then(/^the user should not have Confirm Selection$/) do
  con= PatientSearch.instance

  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) 
  wait.until { con.static_dom_element_exists?("Confirm") == false } 
end

Given(/^the user verifies unAuthorized "(.*?)"$/) do |arg1|
  con = PatientSearch.instance
  expect(con.wait_until_action_element_visible("unAuthorized", 20)).to be_true
  expect(con.static_dom_element_exists?("unAuthorized")).to be_true
  expect(con.perform_verification("unAuthorized", arg1)).to be_true
end

Then(/^the user click on acknowledge restricted record$/) do
  patient_search = PatientSearch.instance
  expect(wait_until_present_and_perform_action(patient_search, "ackButton")).to be_true
end

Then(/^the location list results displays (\d+) results$/) do |num_results|
  patient_search = PatientSearch.instance
  expect(patient_search.wait_until_element_present)
  #expect(patient_search.wait_until_xpath_count("Number of Location List Results", num_results.to_i)).to be_true
  expect(patient_search.perform_verification("Number of Location List Results", num_results.to_i)).to be_true
end

def verify_table_headers_parient(access_browser_instance, table)
  driver = TestSupport.driver
  headers = driver.find_elements(:xpath, "//div[@id='columnHeader']/descendant::div")
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do | header_text |
    does_exist = elements.dynamic_dom_element_exists?("xpath", "//div[@id='columnHeader']/descendant::div[contains(string(), '#{header_text[0]}')]") 
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

class ColumnHeader < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("columnName"), VerifyText.new, AccessHtmlElement.new(:css, ".columnName.no-padding-right.col-md-2"))
  end
end 

Given(/^the user looks for columnHeader$/) do  |table|
  patient_search =ColumnHeader.instance
  expect(verify_table_headers_parient(patient_search, table)).to be_true
end

When(/^the user clears though the Confirm Flag$/) do
  patient_search = PatientSearch2.instance
  expect(patient_search.perform_action("Confirm Flag")).to be_true
end

Then(/^the user waits 10 seconds for sync to complete$/) do
  sleep 10
end

