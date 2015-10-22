class ClinicalReminderCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Clinical Reminder"), ClickAction.new, AccessHtmlElement.new(:id, "clinical_reminders-title"))
    add_verify(CucumberLabel.new("Clinical Reminder"), VerifyText.new, AccessHtmlElement.new(:id, "clinical_reminders-title"))
    add_verify(CucumberLabel.new("Due Date"), VerifyText.new, AccessHtmlElement.new(:id, "clinical_reminders-dueDateFormatted"))
  end
end #ClinicalReminderCoverSheet

#Find ClinicalReminder Coversheet Headers 
Then(/^the ClinicalReminder coversheet table contains headers$/) do |table|
  verify_clinical_reminder_headers(ClinicalReminderCoverSheet.instance, table)
end

class ClinicalReminderSecondary < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Clinical Reminder"), VerifyText.new, AccessHtmlElement.new(:id, "clinical_reminders-title"))
    add_verify(CucumberLabel.new("Due Date"), VerifyText.new, AccessHtmlElement.new(:id, "clinical_reminders-dueDateFormatted"))
    add_verify(CucumberLabel.new("Done Date"), VerifyText.new, AccessHtmlElement.new(:id, "clinical_reminders-doneDateFormatted"))
  end
end #ClinicalReminderSecondary

#Find ClinicalReminder Secondary view Headers 
Then(/^the ClinicalReminder secondary view contains headers$/) do |table|
  verify_clinical_reminders_headers(ClinicalReminderSecondary.instance, table)
end

def verify_clinical_reminder_headers(access_browser_instance, table)
  driver = TestSupport.driver
  con = ClinicalReminderCoverSheet.instance
  con.wait_until_action_element_visible("Clinical Reminder", 30)
  expect(con.static_dom_element_exists?("Clinical Reminder")).to be_true
  #headers = driver.find_elements(:css, "#grid-panel-clinical_reminders th")
  headers = driver.find_elements(:css, "#data-grid-clinical_reminders th")
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

#Find rows in the ClinicalReminders Coversheet
Then(/^the ClinicalReminder table contains rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-clinical_reminders>tbody>tr")
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
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
  end #do loop  
end #Clinical Reminders coversheet

class CommunityHealthSummariesCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super   
    #add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "ccd_grid-referenceDateTime"))
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "ccd_grid-referenceDateDisplay"))
    add_verify(CucumberLabel.new("Authoring Institution"), VerifyText.new, AccessHtmlElement.new(:id, "ccd_grid-authorDisplayName"))
  end
end #CommunityHealthSummariesCoverSheet

Then(/^the CommunityHealthSummaries coversheet table contains headers$/) do |table|
  verify_communityhealthsummary_table_headers(CommunityHealthSummariesCoverSheet.instance, table)
end

class CommunityHealthSummariesSinglePage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "ccd_grid-referenceDateTimeDisplay"))
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "ccd_grid-summary"))
    add_verify(CucumberLabel.new("Authoring Institution"), VerifyText.new, AccessHtmlElement.new(:id, "ccd_grid-authorDisplayName")) 
    add_verify(CucumberLabel.new("communityhealthsummariesTable"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-ccd_grid")) 
    data_grid_row_count = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-ccd_grid']/descendant::tr")
    add_verify(CucumberLabel.new("Number of rows"), VerifyXpathCount.new(data_grid_row_count), data_grid_row_count) 
  end
end #CommunityHealthSummariesSecondary

Then(/^the CommunityHealthSummaries Single Page table contains headers$/) do |table|
  verify_communityhealthsummaries_table_headers(CommunityHealthSummariesSinglePage.instance, table)
end

def verify_communityhealthsummary_table_headers(access_browser_instance, table)  
  driver = TestSupport.driver
  con = CommunityHealthSummariesCoverSheet.instance
  con.wait_until_action_element_visible("Date", 40)
  expect(con.static_dom_element_exists?("Date")).to be_true
  #con.perform_verification("Description", "Outpatient Visit")
  headers = driver.find_elements(:css, "#data-grid-ccd_grid th")
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

#Find rows in Community Health Summaries table
Then(/^user sees Community Health Summaries table display$/) do |table|
  driver = TestSupport.driver
  aa = CommunityHealthSummariesSinglePage.instance
  #aa.wait_until_action_element_visible("communityhealthsummariesTable", 60)
  expect(aa.wait_until_action_element_visible("communityhealthsummariesTable", 30)).to be_true
  #TestSupport.wait_for_page_loaded
  #TestSupport.wait_for_jquery_completed
  aa.wait_until_xpath_count_greater_than("Number of rows", 2)
  browser_elements_list = driver.find_elements(:xpath, "//table[@id='data-grid-ccd_grid']/descendant::tr")
  con = VerifyTableValue.new 
  #  print "list size : " 
  #  p browser_elements_list.length     
  matched = con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-ccd_grid']", table)
  expect(matched).to be_true
end

class CommunityHealthSummariesModalPage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Close"), VerifyText.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("ModalBody"), ClickAction.new, AccessHtmlElement.new(:id, "modal-body")) 
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='modal-body']/div/div/div[1]"))
    add_verify(CucumberLabel.new("VLER"), VerifyText.new, AccessHtmlElement.new(:xpath, "..//*[@id='modal-body']/div/div/div[2]"))
    #add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='modal-body']/div/div/div[1]"))  
  end
end # ccd  modal View

Then(/^user sees Community Health Summaries Modal table display$/) do |table|
  driver = TestSupport.driver
  aa = CommunityHealthSummariesModalPage.instance
  aa.wait_until_action_element_visible("ModalBody", 30)
  table.rows.each do |column1, column2|
    xpath = xpath_to_modal_row(column1, column2)
    p "looking for #{xpath}"
    expect(driver.find_elements(:xpath, xpath).length > 0).to be_true, "could not find row with #{column1}, #{column2}"
  end
end

class AllergiesCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Allergen Name"), VerifyText.new, AccessHtmlElement.new(:id, "grid-panel-allergy_grid"))
    add_verify(CucumberLabel.new("Reaction"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-reaction"))
    add_verify(CucumberLabel.new("Severity"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-acuityName"))     
  end
end # AllergiesCoverSheet

Then(/^the Allergies coversheet table contains headers$/) do |table|
  verify_allergy_table_headers(AllergiesCoverSheet.instance, table)
end

class AllergiesSinglePage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Allergen Name"), VerifyText.new, AccessHtmlElement.new(:id, "grid-panel-allergy_grid"))
    add_verify(CucumberLabel.new("Standardized Allergen"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-standardizedName"))
    add_verify(CucumberLabel.new("Reaction"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-reaction"))
    add_verify(CucumberLabel.new("Severity"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-acuityName"))  
    add_verify(CucumberLabel.new("Drug Class"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-drugClassesNames"))
    add_verify(CucumberLabel.new("Entered By"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-originatorName"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-facilityMoniker"))
    add_verify(CucumberLabel.new("allergiesTable"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-allergy_grid"))
    add_verify(CucumberLabel.new(""), VerifyText.new, AccessHtmlElement.new(:id, "allergy_grid-"))       
    data_grid_row_count = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-allergy_grid']/descendant::tr")
    add_verify(CucumberLabel.new("Number of rows"), VerifyXpathCount.new(data_grid_row_count), data_grid_row_count)     
    # @@allergies_applet_data_grid_rows = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-allergy_grid']/descendant::tr")
    # add_verify(CucumberLabel.new("Number of Allergies Applet Rows"), VerifyXpathCount.new(@@allergies_applet_data_grid_rows), @@allergies_applet_data_grid_rows)
  end
end # AllergiesExpandedView

Then(/^the Allergies Single Page contains headers$/) do |table|
  verify_allergies_table_headers(AllergiesSinglePage.instance, table)
end

class AllergiesModalPage < AccessBrowserV2
  include Singleton
  def initialize
    super
    #add_verify(CucumberLabel.new("Close"), VerifyText.new, AccessHtmlElement.new(:id, "modal-close-button"))
    #add_action(CucumberLabel.new("Close"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    #add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    #add_verify(CucumberLabel.new("Close"), VerifyText.new, AccessHtmlElement.new(:xpath, //*[@id='modal-footer']/div/div[2]/button))
    #add_action(CucumberLabel.new("Close"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:xpath, //*[@id='modal-footer']/div/div[2]/button))
    #add_action(CucumberLabel.new("Modal Close Button"), ClickAction.new, AccessHtmlElement.new(:css,.btn.btn-default)
    #add_verify(CucumberLabel.new("Modal Close Button"), VerifyText.new, AccessHtmlElement.new(:xpath, //*[@id='modal-footer']/div/div[2]/button))   
    #add_action(CucumberLabel.new("Occasional, uncontrolled chest pain (ICD-9-CM 411.1)"), ClickAction.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("ModalBody"), ClickAction.new, AccessHtmlElement.new(:id, "modal-body")) 
    add_verify(CucumberLabel.new("Drug Classes:"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-body']/div/div[3]/div[1]"))
  end
end # Allergies Modal View

def verify_allergy_table_headers(access_browser_instance, table)
  driver = TestSupport.driver
  con = AllergiesCoverSheet.instance
  con.wait_until_action_element_visible("Allergen Name", 30)
  expect(con.static_dom_element_exists?("Allergen Name")).to be_true
  #con.perform_verification("Allergen Name", "CHOCOLATE")
  #headers = driver.find_elements(:css, "#grid-panel-allergy_grid th")
  headers = driver.find_elements(:css, "#data-grid-allergy_grid th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

def verify_allergies_table_headers(access_browser_instance, table)
  con = AllergiesCoverSheet.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Allergen Name", 60)
  expect(con.static_dom_element_exists?("Allergen Name")).to be_true
  con.perform_verification("Allergen Name", "CHOCOLATE") 
  #driver = TestSupport.driver
  #TestSupport.wait_for_page_loaded
  #TestSupport.wait_for_jquery_completed
  headers = driver.find_elements(:css, "#grid-panel-allergy_grid th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers2

#Find rows in Allergies table
Then(/^user sees Allergies table display$/) do |table|
  driver = TestSupport.driver
  aa = AllergiesSinglePage.instance
  #aa.wait_until_action_element_visible("allergiesTable", 50)
  expect(aa.wait_until_action_element_visible("allergiesTable", 50)).to be_true
  #expect(aa.wait_until_xpath_count_greater_than("Number of Allergies Applet Rows", 10)).to be_true
  #browser_elements_list = driver.find_elements(:xpath, "//table[@id='data-grid-allergy_grid']/descendant::tr")
  aa.wait_until_xpath_count_greater_than("Number of rows", 2)
  full_path= "//table[@id='data-grid-allergy_grid']"
  browser_elements_list = driver.find_elements(:xpath, "#{full_path}/descendant::tr")
  con = VerifyTableValue.new 
  print "list size : " 
  p browser_elements_list.length 
  matched = con.perform_table_verification(browser_elements_list, full_path, table)    
  #matched = con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-allergy_grid']", table)
  expect(matched).to be_true
end

#full_path = "//table[@id='data-grid-newsfeed']"
#browser_elements_list = driver.find_elements(:xpath, "//table[@id='data-grid-newsfeed']/descendant::tr")
#browser_elements_list = driver.find_elements(:xpath, "#{full_path}/descendant::tr") 
#matched = con.perform_table_verification(browser_elements_list, full_path, table)

#Find rows in the Allergies Coversheet
Then(/^the Allergies coversheet table contains rows$/) do |table|
  con = AllergiesSinglePage.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded  
  con.wait_until_action_element_visible("Allergen Name", 60)
  expect(con.static_dom_element_exists?("Allergen Name")).to be_true
  con.perform_verification("Allergen Name", "SOY MILK")
  num_of_rows = driver.find_elements(:css, "#data-grid-allergy_grid>tbody>tr")
  #num_of_rows = driver.find_elements(:xpath, "//*[@id='data-grid-allergy_grid']/descendant::tr")
  #p num_of_rows.length
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-allergy_grid']/tbody/tr[#{i}]/td")
      #p "row data #{row_data}"
      if row_defined_in_cucumber.length != row_data.length
        p "columns did not match"
        matched = false
      #p "The number of columns in the UI is #{row_data.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)
      end
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    expect(matched).to be_true
  end #do loop  
end #Allergies coversheet

#Check to make sure rows are not in the Problems Coversheet
Then(/^the Allergies coversheet does not contains rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-problems>tbody>tr")
  p num_of_rows.length
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-problems']/tbody/tr[#{i}]/td")
      if row_defined_in_cucumber.length != row_data.length
        matched = false
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)
      end
      if matched
        break 
      end
    end # for loop  
    #p "Found a match for: #{row_defined_in_cucumber}" unless !matched  
    expect(matched).to be_false
  end #do loop  
end #Allergies coversheet

class AppointmentsCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-dateTimeFormatted"))
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-formattedDescription"))
    add_verify(CucumberLabel.new("Location"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-locationName"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-providerDisplayName"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-facilityMoniker"))
  end
end #AppointmentCoverSheet

Then(/^the Appointments coversheet table contains headers$/) do |table|
  verify_appointment_table_headers(AppointmentsCoverSheet.instance, table)
end

class AppointmentsSinglePage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-dateTimeFormatted"))
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-categoryName"))
    add_verify(CucumberLabel.new("Location"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-locationName"))
    add_verify(CucumberLabel.new("Type"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-typeDisplayName"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-providerDisplayName"))
    add_verify(CucumberLabel.new("Reason"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-reasonName"))
    add_verify(CucumberLabel.new("Facility"), VerifyText.new, AccessHtmlElement.new(:id, "appointments-facilityCode"))
    add_verify(CucumberLabel.new("appointmentsTable"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-appointments"))
    add_action(CucumberLabel.new("applet - Appointments Type dropdowns"), ClickAction.new, AccessHtmlElement.new(:css,  "[data-appletid=appointments] .dropdown-menu li"))
    add_action(CucumberLabel.new("Control - applet - Appointments Type dropdown"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=appointments] #appts-filter-bar button[data-toggle]"))
    add_action(CucumberLabel.new("ScrollDown Button"), ClickAction.new, AccessHtmlElement.new(:id, "appts-dropdown-menu-site")) 
    add_verify(CucumberLabel.new("Table - Appointments Applet"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#data-grid-appointments tbody tr"))
    #add_action(CucumberLabel.new("ALL VA+DOD Link"), ClickAction.new, AccessHtmlElement.new(:link, "link=All VA + DOD"))
    add_action(CucumberLabel.new("All VA+DOD Link"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='ALL']/a"))
    add_action(CucumberLabel.new("All VA+DOD Link"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='ALL']/a"))
    add_verify(CucumberLabel.new("ALL VA+DOD Link"), VerifyText.new, AccessHtmlElement.new(:xpath, "//a[contains(@href, '#')])[11"))
    add_action(CucumberLabel.new("ALL VA+DOD Link"), ClickAction.new, AccessHtmlElement.new(:xpath, "//a[contains(@href, '#')])[11")) 
    #add_action(CucumberLabel.new("ScrollDown Button"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='appts-dropdown-menu-site']"))
    data_grid_row_count = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-appointments']/descendant::tr")
    add_verify(CucumberLabel.new("Number of rows"), VerifyXpathCount.new(data_grid_row_count), data_grid_row_count)
  end
end #AppointmentCoverSheet

Before do
  @apc = AppointmentsSinglePage.instance
end

Then(/^the Appointments Single Page table contains headers$/) do |table|
  verify_appointments_table_headers(AppointmentsSinglePage.instance, table)
end

class AppointmentsModalPage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Close"), VerifyText.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("ModalBody"), ClickAction.new, AccessHtmlElement.new(:id, "modal-body")) 
    add_verify(CucumberLabel.new("Category:"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='modal-body']/div/div[3]/div[1]"))
  end
end # Appointments modal View

#Then(/^the Active Problems Modal Page contains headers$/) do |table|
#verify_problems_table_headers(ActiveProblemsSinglePage.instance, table)
#end

Then(/^user sees Appointments Modal table display$/) do |table|
  driver = TestSupport.driver
  aa = ActiveProblemsModalPage.instance
  aa.wait_until_action_element_visible("ModalBody", 10)
  table.rows.each do |column1, column2|
    xpath = xpath_to_modal_row(column1, column2)
    p "looking for #{xpath}"
    expect(driver.find_elements(:xpath, xpath).length > 0).to be_true, "could not find row with #{column1}, #{column2}"
  end
end

Then(/^user selects "(.*?)"$/) do |_search_value|
  close_button = AppointmentsModalPage.instance
  close_button = AppointmentsModalPage.instance

  # if patient search button is found, click it to go to patient search
  close_button.perform_action("Close") if close_button.static_dom_element_exists? "Close"

  close_button.wait_until_element_present("Close", DefaultLogin.wait_time)
  
  expect(close_button.perform_action("Close")).to be_true
  #patient_search.wait_until_element_present("mySiteAll", DefaultLogin.wait_time)
  #expect(patient_search.perform_action("mySiteAll")).to be_true
  #expect(patient_search.perform_action("patientSearchInput", search_value)).to be_true
  # expect(patient_search.wait_until_xpath_count_greater_than("Patient Search Results", 0)).to be_true
  #results = TestSupport.driver.find_elements(:xpath, "//span[contains(@class, 'patientDisplayName')]")
  #patient_search.select_patient_in_list(0)
  close_button.wait_until_element_present("Close", DefaultLogin.wait_time)
  expect(close_button.static_dom_element_exists? "Close").to be_true
  #results = TestSupport.driver.find_element(:css, "#patient-search-confirmation div.patientName")
  #expect(patient_search.perform_action("Confirm")).to be_true
  #expect(patient_search.wait_until_element_present("patientSearch")).to be_true
end

def verify_appointment_table_headers(access_browser_instance, table)  
  driver = TestSupport.driver
  con = AppointmentsCoverSheet.instance
  con.wait_until_action_element_visible("Description", 50)
  expect(con.static_dom_element_exists?("Description")).to be_true
  #con.perform_verification("Description", "Outpatient Visit")
  # headers = driver.find_elements(:css, "#grid-panel-appointments th")
  headers = driver.find_elements(:css, "#data-grid-appointments th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

def verify_appointments_table_headers(access_browser_instance, table)
  con = AppointmentsSinglePage.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Description", 60)
  expect(con.static_dom_element_exists?("Description")).to be_true
  con.perform_verification("Description", "Outpatient Visit") 
  #driver = TestSupport.driver
  #TestSupport.wait_for_page_loaded
  #TestSupport.wait_for_jquery_completed
  headers = driver.find_elements(:css, "#grid-panel-appointments th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers2

#Find rows in Appointments table
Then(/^user sees Appointments table display$/) do |table|
  driver = TestSupport.driver
  aa = AppointmentsSinglePage.instance
  aa.wait_until_action_element_visible("appointmentsTable", 30)
  #TestSupport.wait_for_page_loaded
  #TestSupport.wait_for_jquery_completed
  aa.wait_until_xpath_count_greater_than("Number of rows", 2)
  browser_elements_list = driver.find_elements(:xpath, "//table[@id='data-grid-appointments']/descendant::tr")
  con = VerifyTableValue.new 
  #  print "list size : " 
  #  p browser_elements_list.length     
  matched = con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-appointments']", table)
  expect(matched).to be_true
end

#Find rows in the Appointments Coversheet
Then(/^the Appointments coversheet table contains rows$/) do |table|
  con = AppointmentsSinglePage.instance  
  driver = TestSupport.driver      
  con.wait_until_action_element_visible("Category", 60)
  expect(con.static_dom_element_exists?("Category")).to be_true
  con.perform_verification("Category", "Outpatient Visit")  
  num_of_rows = driver.find_elements(:css, "#data-grid-appointments>tbody>tr")
  #num_of_rows = driver.find_elements(:xpath, "//*[@id='data-grid-allergy_grid']/descendant::tr")
  #p num_of_rows.length
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-appointments']/tbody/tr[#{i}]/td")
      #p "row data #{row_data}"
      if row_defined_in_cucumber.length != row_data.length
        p "columns did not match"
        matched = false
      #p "The number of columns in the UI is #{row_data.length}"
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)
      end
      if matched
        break 
      end
    end # for loop  
    p "could not match data: #{row_defined_in_cucumber}" unless matched  
    expect(matched).to be_true
  end #do loop  
end #Appointments coversheet

class ScreenManager < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Allergies Applet"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[1]/p"))
    #add_verify(CucumberLabel.new("sourceElement"), VerifyText.new, AccessHtmlElement.new(:xpath, " .//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[1]"))  
    #add_verify(CucumberLabel.new("targetElement"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='66d03000bc49']/div[2]/p[1]"))
    add_verify(CucumberLabel.new("message"), VerifyText.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.addEditFormRegion > div > div > div:nth-child(2) > form.col-md-12 > div"))
    add_verify(CucumberLabel.new("carousel"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]"))
    add_action(CucumberLabel.new("Workspace Manager Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-manager-button']"))
    add_action(CucumberLabel.new("Add New WorkSheet"), ClickAction.new, AccessHtmlElement.new(:id, "addScreen"))
    add_action(CucumberLabel.new("Title"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "screen-title"))
    add_action(CucumberLabel.new("Description"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "screen-description"))
    #add_action(CucumberLabel.new("AddLoadButton"), ClickAction.new, AccessHtmlElement.new(:css, ".btn.btn-primary.addLoadButton"))
    add_action(CucumberLabel.new("Done Button"), ClickAction.new, AccessHtmlElement.new(:css, "#doneEditing")) 
    add_action(CucumberLabel.new("User Defined Screen"), ClickAction.new, AccessHtmlElement.new(:id, ".//*[@id='screens-carousel']/div[1]/div[2]/div/div[6]"))
    add_action(CucumberLabel.new("Delete Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-delete']"))
    add_action(CucumberLabel.new("Confirm Delete Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='workspace-delete']"))  
    add_action(CucumberLabel.new("Workspace Manager Delete Button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.addEditFormRegion > div > div > div:nth-child(4) > div.col-md-2 > button")) 
    #add_action(CucumberLabel.new("Confirm Delete"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.deleteActiveRegion > div > div > div:nth-child(2) > div.col-md-40.text-right > button.btn.btn-danger.deleteActiveScreen"))
    add_action(CucumberLabel.new("Confirm Delete"), ClickAction.new, AccessHtmlElement.new(:id, "workspace-delete")) 
    # add_action(CucumberLabel.new("Save Button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.addEditFormRegion > div > div > div:nth-child(4) > div.col-md-10 > button"))
    #add_action(CucumberLabel.new("Save and Load Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='mainOverlayRegion']/div/div/div[3]/div/div/div[4]/div[2]/button[2]"))
    add_action(CucumberLabel.new("Cancel Button"), ClickAction.new, AccessHtmlElement.new(:xpath, " .//*[@id='mainOverlayRegion']/div/div/div[3]/div/div/div[3]/div/button[1]"))
    add_action(CucumberLabel.new("Close Button"), ClickAction.new, AccessHtmlElement.new(:xpath, " .//*[@id='doneEditing']"))      
    add_verify(CucumberLabel.new("Workspace Manager Filter Field"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='searchScreens']"))
    add_action(CucumberLabel.new("Workspace Manager Filter Field"), SendKeysAndEnterAction, AccessHtmlElement.new(:xpath, ".//*[@id='searchScreens']"))  
    #add_action(CucumberLabel.new("workspace1"), ClickAction.new, AccessHtmlElement.new(:css, "#screens-carousel [data-screen-id=workspace1]"))  
    add_verify(CucumberLabel.new("test"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='screens-carousel']/div[1]/div[2]/div/div"))
    add_verify(CucumberLabel.new("Coversheet"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='cover-sheet']/div/div[1]/div[2]"))
    add_verify(CucumberLabel.new("Workspace Manager Title"), VerifyText.new, AccessHtmlElement.new(:xpath, ".//*[@id='mainOverlayRegion']/div/div/h1"))
    add_action(CucumberLabel.new("Filter Button"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-button-workspace-manager > span"))
    add_verify(CucumberLabel.new("Filter Field"), VerifyText.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.col-sm-10.grid-filter.hiddenRow > div.col-xs-offset-6.col-xs-4.filterRegion"))
    add_action(CucumberLabel.new("Filter Value"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "searchScreens"))
    #add_action(CucumberLabel.new("Add New Button"), ClickAction.new, AccessHtmlElement.new(:xpath, ".//*[@id='mainOverlayRegion']/div/div/div[1]/div[1]/button"))
    #add_action(CucumberLabel.new("Plus Button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div> div >div > div.col-xs-2 > button>i.fa-plus"))
    #add_action(CucumberLabel.new("Plus Button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div:nth-child(3) > div.col-xs-offset-6.col-xs-4 > button.btn.addScreen"))
    add_action(CucumberLabel.new("Plus Button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div:nth-child(3) > div.col-xs-1.no-padding>button.btn.addScreen"))   
    add_action(CucumberLabel.new("UDS Preview Button"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div.col-xs-2"))   
    add_action(CucumberLabel.new("Menu Button UDS"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div.col-xs-1 > i.fa-ellipsis-v"))
    add_action(CucumberLabel.new("Menu Button UDS2"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 > div > div.col-xs-5 > div.col-xs-1 > i"))
    #add_action(CucumberLabel.new("Make Default"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div > div > i.showDefault"))
    add_action(CucumberLabel.new("Make Default"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-7.no-padding > div.col-xs-6.no-padding > div.col-xs-1.default-row.border-right.no-padding > i"))    
    #add_action(CucumberLabel.new("Duplicate"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div > div > div.duplicate-worksheet"))
    add_action(CucumberLabel.new("Duplicate"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(1) > div > i"))    
    #add_action(CucumberLabel.new("Rearrange"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1> div > div.manageOptions.manager-open > ul > li.rearrange-worksheet"))
    add_action(CucumberLabel.new("Rearrange"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(2) > div > i"))
    #add_action(CucumberLabel.new("Delete"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.manageOptions.manager-open > ul > li.delete-worksheet"))
    add_action(CucumberLabel.new("Delete"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div > i"))
    add_action(CucumberLabel.new("UDS Preview Link"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-3 > div.col-xs-4.border-right.previewWorkspace.preview"))   
    add_action(CucumberLabel.new("Close Link"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.previewRegion > div > div > div > div.closePreview > i")) 
    #add_action(CucumberLabel.new("Customize"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div > i.customize-screen"))
    add_action(CucumberLabel.new("Customize"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-3 > div.col-xs-4.customize-screen"))      
    add_action(CucumberLabel.new("Delete2"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div > i"))
    add_action(CucumberLabel.new("Delete3"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-3 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div > i"))
    add_action(CucumberLabel.new("Delete4"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-4 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div > i"))
    add_action(CucumberLabel.new("Delete5"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-5 > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div > i"))
    add_action(CucumberLabel.new("Launch"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-3 > div.col-xs-4.launch-screen"))
    add_action(CucumberLabel.new("User Defined Workspace 1"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1")) 
    add_action(CucumberLabel.new("Menu Button UDS Copy"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy > div > div.col-xs-5 > div.col-xs-1 > i.fa-ellipsis-v"))
    add_action(CucumberLabel.new("User Defined Workspace 1 Copy"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy")) 
    add_action(CucumberLabel.new("Delete User Defined Workspace 1 Copy Link"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy > div > div.col-xs-3 > div.col-xs-4.border-left.no-padding > div:nth-child(3) > div > i"))   
  end
end # Screen Manager View

class NewList < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Coversheet"), ClickAction.new, AccessHtmlElement.new(:id, "cover-sheet"))
    add_verify(CucumberLabel.new("Timeline"), ClickAction.new, AccessHtmlElement.new(:id, "news-feed"))
    add_action(CucumberLabel.new("Meds Review"), ClickAction.new, AccessHtmlElement.new(:id, "medication-review"))
    add_action(CucumberLabel.new("Documents"), ClickAction.new, AccessHtmlElement.new(:id, "documents-list"))  
    add_action(CucumberLabel.new("Overview"), ClickAction.new, AccessHtmlElement.new(:id, "overview"))
    add_action(CucumberLabel.new("User Defined Workspace 1"), ClickAction.new, AccessHtmlElement.new(:id, "user-defined-workspace-1"))
  end
end

class CopyList < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Coversheet"), ClickAction.new, AccessHtmlElement.new(:id, "cover-sheet"))
    add_verify(CucumberLabel.new("Timeline"), ClickAction.new, AccessHtmlElement.new(:id, "news-feed"))
    add_action(CucumberLabel.new("Meds Review"), ClickAction.new, AccessHtmlElement.new(:id, "medication-review"))
    add_action(CucumberLabel.new("Documents"), ClickAction.new, AccessHtmlElement.new(:id, "documents-list"))  
    add_action(CucumberLabel.new("Overview"), ClickAction.new, AccessHtmlElement.new(:id, "overview"))
    add_action(CucumberLabel.new("User Defined Workspace 1"), ClickAction.new, AccessHtmlElement.new(:id, "user-defined-workspace-1"))
    add_action(CucumberLabel.new("User Defined Workspace 1 Copy"), ClickAction.new, AccessHtmlElement.new(:id, "user-defined-workspace-1-copy"))
  end
end

Then(/^the user sees following list of screens$/) do |_table|
  driver = TestSupport.driver
  con = NewList.instance
  con.wait_until_action_element_visible("Coversheet", 60)
  con.wait_until_action_element_visible("Timeline", 60)
  con.wait_until_action_element_visible("Meds Review", 60)
  con.wait_until_action_element_visible("Documents", 60)
  con.wait_until_action_element_visible("Overview", 60)
  con.wait_until_action_element_visible("User Defined Workspace 1", 60)
end

class Applets < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Allergies Applet"), VerifyText.new, AccessHtmlElement.new(:css, "#gridsterPreview >ul >li >div")) 
    #add_action(CucumberLabel.new("Close Link"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div.previewRegion > div > div > div > div.closePreview > i"))          
  end
end # Applets

Then(/^the user sees following applets$/) do |_table|
  driver = TestSupport.driver
  con = Applets.instance
  con.wait_until_action_element_visible("Allergies Applet", 60)
  #  con.wait_until_action_element_visible("Timeline", 60)
  #  con.wait_until_action_element_visible("Meds Review", 60)
  #  con.wait_until_action_element_visible("Documents", 60)
  #  con.wait_until_action_element_visible("Overview", 60)
  #  con.wait_until_action_element_visible("User Defined Workspace 1", 60)
end

Then(/^the user sees copy of user defined screen in the list of screens$/) do |_table|
  driver = TestSupport.driver
  con = CopyList.instance
  con.wait_until_action_element_visible("Coversheet", 60)
  con.wait_until_action_element_visible("Timeline", 60)
  con.wait_until_action_element_visible("Meds Review", 60)
  con.wait_until_action_element_visible("Documents", 60)
  con.wait_until_action_element_visible("Overview", 60)
  con.wait_until_action_element_visible("User Defined Workspace 1", 60)
  con.wait_until_action_element_visible("User Defined Workspace 1 Copy", 60)
end

Then(/^the user sees User Defined Workspace 1 flyout menu contains$/) do |table|
  driver = TestSupport.driver
  menu = driver.find_elements(:css, "#user-defined-workspace-1 > div > div.manageOptions.manager-open > ul > li")
  items = menu.length 
  expect(items).to_not eq(0)
  expect(items).to eq(table.rows.length)
  elements = ScreenManager.instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end 
end 

#Perform any selection or button click
When(/^the user clicks "(.*?)"$ for "(.*?)"$/) do |html_action_element|
  navigation = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.driver.manage.window.resize_to(1600, 900)
  navigation.wait_until_action_element_visible(html_action_element, 20)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

#Perform any selection or button click
When(/^the user clicks "(.*?)"$ for User Defined Workspace 1 Copy$/) do |html_action_element|
  navigation = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.driver.manage.window.resize_to(1300, 900)
  navigation.wait_until_action_element_visible(html_action_element, 10)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

#Enter Search Term
When(/^the user enters "(.*?)" in the "(.*?)"$/) do |text, html_element|
  navigation = ScreenManager.instance
  navigation.wait_until_action_element_visible(html_element, DefaultLogin.wait_time)
  expect(navigation.perform_action(html_element, text)).to be_true, "Error when attempting to enter '#{text}' into #{html_element}"
end
#Then(/^the user click on Workspace Manager Button and enters "([^"]*)"$/) do |element|
#  con = ScreenManager.instance
#  driver = TestSupport.driver
#  TestSupport.wait_for_page_loaded
#  @i = 0
#   while @i < 1
#     @i +=1
#     con.perform_action('Workspace Manager Button')
#     con.perform_action('Add New WorkSheet')
#     #sleep(2)
#     con.perform_action("Title", element + @i.to_s )
#     #sleep(2)
#     con.perform_action("Description", element + @i.to_s)
#     #sleep(2)
#     con.perform_action('AddLoadButton')
#     sleep(2)
#     con.perform_action('Done Button')
#   end
#end

When(/^the user delete the test screen$/) do
  screen = ScreenManager.instance
  screen.wait_until_action_element_visible("Workspace Manager Button", 20)
  expect(screen.perform_action("Workspace Manager Button")).to be_true, "Error when attempting to open Workspace Manager"
  TestSupport.driver.manage.window.maximize
  screen.wait_until_action_element_visible("workspace1", 20)
  expect(screen.perform_action("workspace1")).to be_true, "Error when attempting to click on workspace 1"
  screen.wait_until_action_element_visible("Delete Button", 20)
  expect(screen.perform_action("Delete Button")).to be_true, "Error when attempting to click on Workspace Manager Delete Button"
  screen.wait_until_action_element_visible("Confirm Delete Button", 20)
  expect(screen.perform_action("Confirm Delete Button")).to be_true, "Error when attempting to click on Confirm Delete"
  expect(screen.perform_action("Close")).to be_true, "Workspace Manager Close"
end

When(/^update the test screen$/) do
  screen = ScreenManager.instance
  screen.wait_until_action_element_visible("Workspace Manager Button", 40)
  expect(screen.perform_action("Workspace Manager Button")).to be_true, "Error when attempting to open Workspace Manager"
  #TestSupport.driver.manage.window.maximize
  screen.wait_until_action_element_visible("workspace1", 40)
  expect(screen.perform_action("workspace1")).to be_true, "Error when attempting to click on workspace 1"
  #screen.wait_until_action_element_visible("Workspace Manager Delete Button", 40)
end

#Perform any selection or button click
When(/^the user clicks "(.*?)"$/) do |html_action_element|
  navigation = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.driver.manage.window.resize_to(1300, 900)
  navigation.wait_until_action_element_visible(html_action_element, 60)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

#Perform any selection or button click
When(/^the user clicks "(.*?)" Link$/) do |html_action_element|
  navigation = Applets.instance
  driver = TestSupport.driver
  TestSupport.driver.manage.window.resize_to(1300, 900)
  navigation.wait_until_action_element_visible(html_action_element, 60)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

Then(/^the user enters "([^"]*)" on workspace page filter field$/) do |element|
  con = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  con.wait_until_action_element_visible("Filter Value", 20)
  con.perform_action("Filter Value", element)   
end 

Then(/^the user sees workspace manager page display screen with the title "([^"]*)"$/) do |_test|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  aa = ScreenManager.instance
  #aa.wait_until_element_visible("test", 10)
  aa.wait_until_element_present("User Defined Workspace 1", 10)
  expect(aa.static_dom_element_exists?("User Defined Workspace 1")).to be_true
end
  
Then(/^the user sees workspace manager page display screen with title "([^"]*)"$/) do |_test|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  aa = ScreenManager.instance
  #aa.wait_until_element_visible("test", 10)
  aa.wait_until_element_present("test", 10)
  expect(aa.static_dom_element_exists?("test")).to be_true
end

Then(/^the user sees workspace manager page display screen with description "([^"]*)"$/) do |_test|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  aa = ScreenManager.instance
  aa.wait_until_element_present("test", 10)
  expect(aa.static_dom_element_exists?("test")).to be_true
end

Then(/^the user enters "([^"]*)" on title field$/) do |element|
  con = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  con.wait_until_action_element_visible("Title", 20)
  con.perform_action("Title", element)   
end 
   
Then(/^the user enters "([^"]*)" on description field$/) do |element|
  con = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  con.perform_action("Description", element)
  #sleep(5)
end

Then(/^the user removes "([^"]*)" on title field$/) do |_element|
  con = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  con.wait_until_action_element_visible("Title", 20)
  con.perform_action("Title", "")   
end  

Then(/^the user adds "([^"]*)" on title field$/) do |element|
  con = ScreenManager.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  con.wait_until_action_element_visible("Title", 20)
  con.perform_action("Title", element)  
end 

# When(/^the user enters text "(.*?)" in the "(.*?)" control (?:on|in) the "(.*?)"$/) do |input_text, control_name, parent_name|
#   container_key = get_container_key(control_name, parent_name)
#   input_and_enter_into_control(container_key.container, container_key.modal_or_applet, container_key.control_name, input_text)
# end

# def input_and_enter_into_control(container, modal_or_applet, control_name, input_text)
#   attempts ||= 0

#   control_key = "Control - #{modal_or_applet} - #{control_name}"
#   #p "control_key is #{control_key}"
#   wait = Selenium::WebDriver::Wait.new(:timeout => 15)
#   wait.until { container.get_element(control_key) }

#   input_element = container.get_element(control_key)

#   # need to clear what is currently in the input
#   # clear() seems to not work correctly with placeholders
#   for i in 0...input_element.attribute("value").size
#     input_element.send_keys(:backspace)
#   end

#   # if you just want to clear the input (empty input text)
#   unless input_text.strip.empty?
#     input_element.send_keys(input_text)
#     input_element.submit

#     # because of race conditions, sometimes the value doesn't get input correctly
#     if input_element.attribute("value") != input_text
#       fail
#     end
#   end # unless
# rescue => e
#   attempts += 1

#   if attempts < 3
#     p "Attemping retry of input."
#     sleep 2
#     retry
#   else
#     p "!! Error attempting input on - #{control_name} !!"
#     raise e
#   end # if/else
# #else # succesful begin
# #  p "Input - #{control_name}"
# end
  
Then(/^the user enters "([^"]*)" for title and enters "([^"]*)" for description and verify add and load button is "([^"]*)"$/) do |element1, element2, disable_or_enable|
  con = ScreenManager.instance
  driver = TestSupport.driver
  #con.wait_until_action_element_visible("AddLoadButton")
  expect(con.static_dom_element_exists?("AddLoadButton")).to be_true
  con.perform_action("Title", element1) unless element1.length==0
  p element1.length
  p element2.length
  con.perform_action("Description", element2) unless element2.length==0
  #con.perform_verify('Add and Load Screen Button' is_disabled())
  if (element1.length == 0) || (element2.length == 0)
    disable_or_enable = "disable"      
    element = con.get_element("AddLoadButton")
    t = verify_element_enabled(element, disable_or_enable)
    p t
  else
    disable_or_enable = "enable"
    element = con.get_element("AddLoadButton")
    t = verify_element_enabled(element, disable_or_enable)
    p t    
    con.perform_action('AddLoadButton')
    TestSupport.wait_for_page_loaded
    con.perform_action('Done Button')
    exit
  end
end
# Then user sees validation message
  
Then(/the user enters values for both fields "([^"]*)" for title and enters "([^"]*)" for description and verify add and load button is "([^"]*)"$/) do |element1, element2, _disable_or_enable|   
  con = ScreenManager.instance
  driver = TestSupport.driver
  #con.wait_until_action_element_visible("AddLoadButton")
  expect(con.static_dom_element_exists?("AddLoadButton")).to be_true
  con.perform_action("Title", element1) 
  con.perform_action("Description", element2) 
  #con.perform_verify('Add and Load Screen Button' is_disabled())
  p element1.length
  p element2.length
  if (element1.length >> 0) && (element2.length >> 0)   
    con.perform_action('AddLoadButton')
    TestSupport.wait_for_page_loaded
    #con.perform_action('Done Button')
  end
end
  
Then(/^the "(.*?)" is not listed in the workspace manager page$/) do |arg1|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultTiming.default_wait_time)
  wait.until { !ScreenManager.instance.static_dom_element_exists? arg1  }
end  
#Then(/^the user click on Workspace Manager Button and deletes the screen$/) do
#  con = ScreenManager.instance
#  driver = TestSupport.driver
#  TestSupport.wait_for_page_loaded
#     @i = 0
#     while @i < 2  do
#       @i +=1
#       con.perform_action('Workspace Manager Button')
#      # sleep(5)
#       con.perform_action("First Applet" )
#       sleep(2)
#       con.perform_action("Delete Button")
#       sleep(2)
#       con.perform_action('Close')
#       sleep(2)
#       #con.perform_action('Done Button')
#    end
#end
     
And(/^the user drags and drops Allergies$/) do
  dragAndDrop(ScreenManager.instance)
end
 
def mouse_move(_access_browser_instance)
  con = ScreenManager.instance
  driver = TestSupport.driver
  #mouseMove(access_browser_instance)
  #Actions builder = new Actions (driver);  
  #       builder.keyDown(Keys.CONTROL)
  #           .click(someElement)
  #           .click(someOtherElement)
  #           .keyUp(Keys.CONTROL);
    
  #       Action selectMultiple = builder.build(); 
  #       selectMultiple.perform();
  #       
  #    Actions builder = new Actions(driver);
  #  
  #    Action dragAndDrop = builder.clickAndHold(someElement)
  #        .moveToElement(otherElement)
  #        .release(otherElement)
  #        .build();
  #    dragAndDrop.perform();
end
    
def xpath_to_modal(_column1)
  #xpath = "//div[@id='modal-body']/descendant::div[contains(string(), '#{column1}')]/following-sibling::div[contains(string(), '#{column2}')]"
  xpath = "//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[1]"
  return xpath
end

Then(/^user sees validation message "(.*?)"$/) do |_message|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  aa = ScreenManager.instance
  expect(aa.static_dom_element_exists?("message")).to be_true
end    
  
Then(/^user sees carousel display$/) do |sourceElement|
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded
  aa = ScreenManager.instance
  #aa.wait_until_element_visible("Allergies Applet", 10)
  #p column1
  #aa.wait_until_element_present("sourceElement",10)
  #  aa.wait_until_action_element_visible("carousel", 10)
  #  expect(aa.static_dom_element_exists?("carousel")).to be_true
  expect(aa.static_dom_element_exists?("sourceElement")).to be_true
  #  WebElement draggable = @driver.find_element(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]")
  #      new Actions(browser).dragAndDropBy(draggable, 200, 10).build().perform(); 

  
  action=Actions.new("driver")  
  @browser.action.click_and_hold(sourceElement).perform 
  @browser.action.move_to(targetElement).release.perform    
  @browser.action.drag_and_drop(sourceElement, targetElement).perform
  #    el1 = @driver.find_element(:css, "div.captcha div.sliderCaptcha div.arrow")
  #    
  #    el_in_between = @driver.find_element(:css, "div.something")
  #    
  #    @browser.action.click_and_hold(el1).perform
  #    
  #    sleep 0.5
  #    
  #    @browser.action.move_to(el_in_between).perform
  #    
  #    el2 = @driver.find_element(:css, "div.captcha div.sliderCaptcha div.dottedBorder")
  #    
  #    @browser.action.move_to(el2).release.perform          
   
  #new Actions(browser).dragAndDrop(draggable, to).build().perform(); 
  #  p sourceElement
  #  Actions dragAndDrop = builder.clickAndHold(sourceElement).perform()
  #    builder.mouseMove(sourceElement)
  #     WebElement otherElement 
  #            moveToElement(otherElement)
  #            release(otherElement)
  #           build();
  #            dragAndDrop.perform();
  #actions=Actions.new("driver");
  #driver.get("http://10.1.1.150/#workspace1)
  # sourceElement = driver.find_element(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[1]/p")

  #actions.clickAndHold(sourceElement).perform()
  #driver.get("http://10.1.1.150/#workspace1")
  #WebElement draggable = driver.find_element(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[1]")
  #draggable.highlight
  #new Actions(driver).dragAndDropBy(draggable, 200, 10).build().perform(); 

  #    WebElement draggable = @driver.findElement(By.xpath(".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]/p"));
  #    new Actions(browser).dragAndDropBy(draggable, 200, 10).build().perform(); 
  # 
  #    new Actions(browser).dragAndDrop(draggable, to).build().perform(); 
  #   
    
  #    actions=Actions.new("driver");
  #    actions.clickAndHold(sourceElement).perform();
  #    dispatchMouseEvent(sourceElement, "dragstart");
  #    # Target element exists only after 'dragstart' event so we locate it here.
  #    #WebElement targetElement = getElement(targetElementLocator);
  #    WebElement targetElement = sourceElement[120,30];
  #    actions.moveToElement(targetElement).perform();
  #    dispatchMouseEvent(targetElement, "drop");
  #    dispatchMouseEvent(sourceElement, "dragend");
  #    actions.release().perform();
  #    sleep(10)
  #table.rows.each do | column1 |
  #      xpath = xpath_to_modal(column1)
  #      p "looking for #{xpath}"
  #      expect(driver.find_elements(:xpath, xpath).length > 0).to be_true, "could not find row with #{column1}"
end

def drag_and_drop(_access_browser_instance)    
  con = ScreenManager.instance      
  expect(con.static_dom_element_exists?("sourceElement")).to be_true
  action = Actions.new("driver")
  WebElement draggable = driver.find_element(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]")
  #new Actions(driver).dragAndDropBy(draggable, 200, 10).build().perform(); 
  #    WebElement draggable = browser.findElement(By.xpath(".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]/p"));
  #    new Actions(browser).dragAndDropBy(draggable, 200, 10).build().perform();  
  #    WebElement draggable = @driver.findElement(By.xpath(".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]/p"));
  #    new Actions(browser).dragAndDropBy(draggable, 200, 10).build().perform(); 
  # 
  #    new Actions(browser).dragAndDrop(draggable, to).build().perform(); 
  #   
  #        action = Actions.new("driver")
  #    action.DragAndDrop(draggable, to).Release(draggable).Build().Perform();
  #    action.ClickAndHold(draggable).MoveToElement(to).Release(draggable).Build().Perform();
  #
     
  #    Action dragAndDrop = builder.clickAndHold(sourceElement)
  #    builder.mouseMove(sourceElement)
  #    WebElement otherElement 
  #           moveToElement(otherElement)
  #           release(otherElement)
  #           build();
  #           dragAndDrop.perform();
           
  #p @web_driver
  #Code for drag and drop looks like this 
  
  #  selenium.type("id=screenName", "screen"); 
  #  selenium.mouseOver("//*[@id ='screenToolIcons']"); // object default position 
  #  selenium.mouseOver("//*[@id='inputbox']"); // object id 
  #  selenium.focus("//*[@id='inputbox']"); 
  #  selenium.mouseDown("//*[@id='inputbox']"); 
  #  selenium.mouseMoveAt("//*[@id='inputbox']","// 
  #  *[@id='droppableCanvas']"); // moving between layers 
  #  selenium.mouseDownAt("//*[@id='inputbox']", "200,200"); 
  #  selenium.mouseUpAt("//*[@id='droppableCanvas']", "200,200"); //place 
  #  object in specified location 
  #  selenium.click("//*[@id='droppableCanvas']"); 
  
      
  driver = TestSupport.driver
  p driver
  driver.get("http://10.1.1.150/#Workspace1")
          
  #    con.perform_action('Done Button')
  #  p '----------------'
  #  ts = driver.find_elements(:xpath, "//*")
  #  ts.each do |t|
  #    p t
  #    t.highlight()
  #  end
  
  p source_element = driver.find_element(:css, "#doneEditing")
  sourceElement.click
  p '----------------'
  #sleep(10)
  #   p sourceElement = driver.find_element(:xpath, ".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]/p")
  #    targetElement = @driver.find_element(:xpath, ".//*[@id='66d03000bc49']/div[2]/p[1]")  
  #    @browser.action.click_and_hold(sourceElement).perform 
  #    @browser.action.move_to(targetElement).release.perform    
  #@browser.action.drag_and_drop(sourceElement, targetElement).perform
  #    el1 = @driver.find_element(:css, "div.captcha div.sliderCaptcha div.arrow")
  #    
  #    el_in_between = @driver.find_element(:css, "div.something")
  #    
  #    @browser.action.click_and_hold(el1).perform
  #    
  #    sleep 0.5
  #    
  #    @browser.action.move_to(el_in_between).perform
  #    
  #    el2 = @driver.find_element(:css, "div.captcha div.sliderCaptcha div.dottedBorder")
  #    
  #    @browser.action.move_to(el2).release.perform          
  #    driver.get("http://10.1.1.150/#trial1");
  #    #driver=Browser.new("http://10.1.1.150/#trial1")
  #    WebElement draggable = driver.findElement(By.xpath(".//*[@id='applets-carousel']/div[1]/div[2]/div[1]/div[2]/p"))
  #      draggable.click
  #      sleep(8)
  #    WebElement to = driver.findElement(By.xpath(".//*[@id='66d03000bc49']/div[2]/p[1]"))
  #    
  #    builder = Actions.new("driver");  
  #       builder.keyDown(Keys.CONTROL)
  #           click(sourceElement)
  #           #click(someOtherElement)
  #           keyUp(Keys.CONTROL);
  #
  #       
  #    builder1 = new Actions.new("driver");
  #  
  #    Action dragAndDrop = builder.clickAndHold(draggable)
  #        moveToElement(to)
  #        release(to)
  #        build();
  #        dragAndDrop.perform();
        
  actions=Actions.new("driver")
  actions.clickAndHold(sourceElement).perform
  dispatchMouseEvent(sourceElement, "dragstart")
  # Target element exists only after 'dragstart' event so we locate it here.
  #WebElement targetElement = getElement(targetElementLocator);
  WebElement target_element = source_element[120, 30]
  actions.moveToElement(targetElement).perform
  dispatchMouseEvent(targetElement, "drop")
  dispatchMouseEvent(sourceElement, "dragend")
  actions.release.perform
  #sleep(10)
end
   
#    def dispatchMouseEvent(eventTarget, eventType)
#      #int halfWidth = eventTarget.getSize().getWidth() / 2;
#      #int halfHeight = eventTarget.getSize().getHeight() / 2;
#      #Point locationOnScreen = ((Locatable) eventTarget).getCoordinates().onScreen();
#      #Calculate the coordinates of the center of the element.
#      int screenX = 132
#      int screenY = 90
#      #int clientX = halfWidth + eventTarget.getLocation().x;
#      #int clientY = halfHeight + eventTarget.getLocation().y;
#   
#      JavascriptExecutor javascriptExecutor = (JavascriptExecutor) getDriver();
#      javascriptExecutor.executeScript("var e = document.createEvent(\"MouseEvents\");"
#          + "e.initMouseEvent(\"" + eventType
#          + "\", true, true, arguments[0].ownerDocument.defaultView, 0, " + screenX + ", " + screenY
#          + ", " + clientX + ", " + clientY + ", " + "false, false, false, false, 0, null);"
#          + "arguments[0].dispatchEvent(e);", eventTarget);
#    end 
    
Then(/^the user click on Allergies Filter Button$/) do 
  con= Navigation.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('Allergies Filter Button')
end

When(/^the user enters in the allergies search field "(.*?)"$/) do
  con= AllergiesCoverSheet.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('allergiesFilterSearch', 'ALBUMIN')
end

Then(/^the user click on Pagination$/) do 
  con= PatientSearch.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('Pagination')
  #sleep(10)
end

Given(/^user enter "(.*?)" in the search box$/) do |_search_value|
  driver = TestSupport.driver
  con = Ehmpui.instance
  TestSupport.wait_for_page_loaded
  login_elements = Search.instance
  login_elements.perform_action("search") if login_elements.static_dom_element_exists? "search"
  con.perform_action('Search')
  #expect(login_elements.static_dom_element_exists? "search").to be_true
end

#Click a button 
#When(/^the user click the "(.*?)"$/) do |arg1|
#  aa = Navigation.instance
#  TestSupport.wait_for_page_loaded
#  aa.wait_until_action_element_visible(arg1, 10)
#  aa.perform_action(arg1)
#  TestSupport.wait_for_page_loaded
#end

#Perform any selection or button click
When(/^the user click the "(.*?)"$/) do |html_action_element|
  navigation = AllergiesModalPage.instance
  navigation.wait_until_action_element_visible(html_action_element, 40)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

Then(/^the user click on Appointments ScrollDown Button$/) do 
  con= AppointmentsSinglePage.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('ScrollDown Button')
end

#When (/^the user selects "(.*?)"$/) do |arg1|
#  con= AppointmentsSinglePage.instance
#  TestSupport.wait_for_page_loaded
#  aa.wait_until_action_element_visible(arg1, 10)
#  aa.perform_action(arg1)
#  sleep 15
#end

#Then(/^the user selects "(.*?)" in the "(.*?)" dropdown$/) do |selection, control_name|
#  driver = TestSupport.driver
#  sleep 0.2
#  #@apc.wait_until_element_present("Table - Appointments Applet", 15)
#  wait_and_perform(@apc, "applet - Appointments Type dropdown")
#  wait = Selenium::WebDriver::Wait.new(:timeout => 5)
#  sleep 0.2
#  wait.until { @apc.get_elements("applet - Appointments Type dropdowns").size > 1 }
#  dropdown_elements = [@apc.get_elements("applet - Appointments Type dropdowns")]
#  desired_element = nil
#
##  dropdown_elements.each do |element|
##  p element
#  for i in 1..dropdown_elements.length
#  element=[driver.find_elements(:id, "appts-dropdown-menu-site")]
#    if element.include?(selection)
#      p element.text
#      desired_element = element
#      break
#    end
#  end
#  if desired_element == nil
#    fail
#  else
#    desired_element.click
#  end
#end

Then(/^the user selects "(.*?)"$/) do |html_element|
  navigation = AppointmentsSinglePage.instance
  navigation.wait_until_element_visible(html_element, 10)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
  #sleep 10
end

#Then(/^the user selects "(.*?)"$/) do |search_value|
#  vadod_button = AppointmentsSinglePage.instance
#  vadod_button = AppointmentsSinglePage.instance
#  vadod_button.perform_action("ALL VA+DOD Link") if vadod_button.static_dom_element_exists? "ALL VA+DOD Link"
#  vadod_button.wait_until_element_present("ALL VA+DOD Link", DefaultLogin.wait_time)  
#  expect(vadod_button.perform_action("ALL VA+DOD Link")).to be_true
#  vadod_button.wait_until_element_present("ALL VA+DOD Link", DefaultLogin.wait_time)
#  expect(vadod_button.static_dom_element_exists? "ALL VA+DOD Link").to be_true
#end

#Enter Search Term
When(/^the user enter "(.*?)" into the "(.*?)"$/) do |arg1, arg2|
  aa = Navigation.instance
  driver = TestSupport.driver
  TestSupport.wait_for_page_loaded 
  aa.wait_until_action_element_visible(arg2, 10)
  aa.perform_action(arg2, arg1)
  #TestSupport.wait_for_jquery_completed  
  #TestSupport.driver.save_screenshot("after_filter.png")
end

#Wait until the rows of the table are visible
When(/^the "(.*?)" contains (\d+) rows$/) do |arg1, arg2|
  aa = Navigation.instance
  TestSupport.wait_for_page_loaded
  expect(aa.wait_until_xpath_count(arg1, arg2, 20)).to be_true
end

class CoversheetDropdown < AccessBrowserV2
  include Singleton
  def initialize
    super
    #add_verify(CucumberLabel.new("Coversheet"), VerifyText.new, AccessHtmlElement.new(:css, "#cover-sheet-button>a"))
    #add_verify(CucumberLabel.new("Coversheet"), VerifyText.new, AccessHtmlElement.new(:css, "#navigation-navbar > ul > li.btn-group.open > ul > li.cover-sheet-button.active > a"))
    add_verify(CucumberLabel.new("Coversheet"), VerifyText.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect > div > ul > div > li.cover-sheet-button > a")) 
    add_verify(CucumberLabel.new("Timeline"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect > div > ul > div > li.news-feed-button>a"))
    add_action(CucumberLabel.new("Meds Review"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect > div > ul > div > li.medication-review-button>a"))
    add_action(CucumberLabel.new("Documents"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect > div > ul > div > li.documents-list-button>a"))  
    add_action(CucumberLabel.new("Overview"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect > div > ul > div > li.overview-button>a"))
  end
end

Then(/^the CoversheetDropdown table contains headers$/) do |table|
  verify_coversheet_dropdown_headers(CoversheetDropdown.instance, table)
end

def verify_coversheet_dropdown_headers(_access_browser_instance, _table)
  driver = TestSupport.driver
  con = CoversheetDropdown.instance
  con.wait_until_action_element_visible("Coversheet", 60)
  expect(con.static_dom_element_exists?("Coversheet")).to be_true
  #con.wait_until_action_element_visible("Timeline", 60)
  #expect(con.static_dom_element_exists?("Timeline")).to be_true
  #con.wait_until_action_element_visible("Meds Review, 60)
  #expect(con.static_dom_element_exists?("Meds Review")).to be_true
  #con.wait_until_action_element_visible("Documents, 60)
  #expect(con.static_dom_element_exists?("Documents")).to be_true
  #con.wait_until_action_element_visible("Overview, 60)
  #expect(con.static_dom_element_exists?("Overview")).to be_true
  #con.perform_verification("Description", "Hyperlipidemia")
  # headers = driver.find_elements(:xpath, "//*[@id='data-grid-problems']")
  #headers = driver.find_elements(:css, "#grid-panel-problems th") 
  #headers = driver.find_elements(:css, "#grid-panel- th") 
  #expect(headers.length).to_not eq(0)
  #expect(headers.length).to eq(table.rows.length)
  #elements = access_browser_instance
  #table.rows.each do | header_text |
  # does_exist = elements.static_dom_element_exists? header_text[0]
  #p "#{header_text[0]} was not found" unless does_exist
  #expect(does_exist).to be_true
  #end #table
end

class ActiveProblemsCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "problems-problemText"))
    add_verify(CucumberLabel.new("Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problems-acuityName"))
    add_verify(CucumberLabel.new("Status"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problems-statusName"))
    add_action(CucumberLabel.new("Problems Filter Button"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-problems"))
    add_action(CucumberLabel.new("Problems Filter Field"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, ".grid-filter input"))  
    add_action(CucumberLabel.new("problemsFilterSearch"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "#grid-filter-problems input"))
    add_action(CucumberLabel.new("problemsFilterSearch"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:xpath, "//div[@data-appletid='problems']/descendant::a[@id='grid-filter-problems']"))
    add_verify(CucumberLabel.new("filterSearch"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-filter']/form/input"))
    add_action(CucumberLabel.new("filterSearch"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-filter']/form/input"))
    add_action(CucumberLabel.new("Problems Expand View"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=problems] .applet-maximize-button"))
  end
end # ProblemsCoverSheet

Then(/^the Active Problems coversheet table contains headers$/) do |table|
  verify_problem_table_headers(ActiveProblemsCoverSheet.instance, table)
end

class ActiveProblemsSinglePage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:id, "problems-problemText"))
    add_verify(CucumberLabel.new("Standardized Description"), VerifyText.new, AccessHtmlElement.new(:id, "problems-standardizedDescription"))
    add_verify(CucumberLabel.new("Acuity"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problems-acuityName")) 
    add_verify(CucumberLabel.new("Status"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problems-statusName"))
    add_verify(CucumberLabel.new("Onset Date"), VerifyText.new, AccessHtmlElement.new(:id, "problems-onsetFormatted"))
    add_verify(CucumberLabel.new("Last Updated"), VerifyText.new, AccessHtmlElement.new(:id, "problems-updatedFormatted"))
    add_verify(CucumberLabel.new("Provider"), VerifyText.new, AccessHtmlElement.new(:id, "problems-providerDisplayName"))
    add_verify(CucumberLabel.new("Facility"), VerifyContainsText.new, AccessHtmlElement.new(:id, "problems-facilityMoniker"))
    add_verify(CucumberLabel.new("Comments"), VerifyText.new, AccessHtmlElement.new(:id, "problems-"))  
    add_action(CucumberLabel.new("Pagination"), SendKeysAction.new, AccessHtmlElement.new(:css, ".grid-footer"))
    add_verify(CucumberLabel.new("problemsTable"), VerifyText.new, AccessHtmlElement.new(:id, "data-grid-problems"))
    add_verify(CucumberLabel.new("Comments"), VerifyText.new, AccessHtmlElement.new(:id, "problems-"))
    data_grid_row_count = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-problems']/descendant::tr")
    add_verify(CucumberLabel.new("Number of rows"), VerifyXpathCount.new(data_grid_row_count), data_grid_row_count)
    #add_action(CucumberLabel.new("Diabetes Mellitus Type II or unspecified"), ClickAction.new, AccessHtmlElement.new(:css, "#urn-va-problem-9E7A-3-183"))
    
    
  end
end # Active Problems Maximize/Expanded View

Then(/^the Active Problems Single Page contains headers$/) do |table|
  verify_problems_table_headers(ActiveProblemsSinglePage.instance, table)
end

class ActiveProblemsModalPage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Close"), VerifyText.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Close"), ClickAction.new, AccessHtmlElement.new(:id, "modal-close-button"))
    add_action(CucumberLabel.new("Occasional, uncontrolled chest pain (ICD-9-CM 411.1)"), ClickAction.new, AccessHtmlElement.new(:id, "mainModalLabel"))
    add_action(CucumberLabel.new("ModalBody"), ClickAction.new, AccessHtmlElement.new(:id, "modal-body")) 
    add_verify(CucumberLabel.new("Primary ICD-9-CM:"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='modal-body']/div/div[1]/div[1]"))
  end
end # Active Problems Modal View

#Then(/^the Active Problems Modal Page contains headers$/) do |table|
#verify_problems_table_headers(ActiveProblemsSinglePage.instance, table)
#end
class AllergiesOverlay < AccessBrowserV2
  include Singleton
  def initialize
    super
    #add_verify(CucumberLabel.new("Gist View"), VerifyText.new, AccessHtmlElement.new(:css, ".click-gist"))
    add_verify(CucumberLabel.new("Gist View"), VerifyText.new, AccessHtmlElement.new(:css, "#grid-panel-allergy_grid .options-box"))
    add_verify(CucumberLabel.new("Summary View"), VerifyText.new, AccessHtmlElement.new(:css, "#grid-panel-allergy_grid .options-box-summary"))
    add_verify(CucumberLabel.new("Expand View"), VerifyText.new, AccessHtmlElement.new(:css, "#grid-panel-allergy_grid .options-box-expanded"))
  end
end

Then(/^the Allergies Overlay Page contains headers$/) do |table|
  verify_allergies_overlay_headers(AllergiesOverlay.instance, table)
end

def xpath_to_modal_row(column1, column2)
  #xpath = "//div[@id='modal-body']/descendant::div[contains(string(), '#{column1}')]/following-sibling::div[contains(string(), '#{column2}')]"
  xpath = "//div[@id='modal-body']/descendant::div[contains(@class, 'row')]/descendant::div[contains(string(), '#{column1}')]/following-sibling::div[contains(string(), '#{column2}')]"
  return xpath
end

Then(/^user sees Active Problems Modal table display$/) do |table|
  driver = TestSupport.driver
  aa = ActiveProblemsModalPage.instance
  aa.wait_until_action_element_visible("ModalBody", 10)
  table.rows.each do |column1, column2|
    xpath = xpath_to_modal_row(column1, column2)
    p "looking for #{xpath}"
    expect(driver.find_elements(:xpath, xpath).length > 0).to be_true, "could not find row with #{column1}, #{column2}"
  end
end

def verify_allergies_overlay_headers(_access_browser_instance, _table)
  driver = TestSupport.driver
  con = AllergiesOverlay.instance
  con.wait_until_action_element_visible("Gist View", 60)
  expect(con.static_dom_element_exists?("Gist View")).to be_true
  con.wait_until_action_element_visible("Summary View", 30)
  expect(con.static_dom_element_exists?("Summary View")).to be_true
  con.wait_until_action_element_visible("Expand View", 30)
  expect(con.static_dom_element_exists?("Expand View")).to be_true
  #con.perform_verification("Description", "Hyperlipidemia")
  # headers = driver.find_elements(:xpath, "//*[@id='data-grid-problems']")
  #headers = driver.find_elements(:css, "#grid-panel-problems th") 
  #headers = driver.find_elements(:css, "#grid-panel- th") 
  #expect(headers.length).to_not eq(0)
  #expect(headers.length).to eq(table.rows.length)
  #elements = access_browser_instance
  #table.rows.each do | header_text |
  # does_exist = elements.static_dom_element_exists? header_text[0]
  #p "#{header_text[0]} was not found" unless does_exist
  #expect(does_exist).to be_true
  #end #table
end #verify_table_headers

Then(/^user sees Allergies Modal table display$/) do |table|
  driver = TestSupport.driver
  aa = AllergiesModalPage.instance
  aa.wait_until_action_element_visible("ModalBody", 30)
  table.rows.each do |column1, column2|
    xpath = xpath_to_modal_row(column1, column2)
    p "looking for #{xpath}"
    expect(driver.find_elements(:xpath, xpath).length > 0).to be_true, "could not find row with #{column1}, #{column2}"
  end
end

#Then(/^user sees Active Problems Modal table display$/) do |table| 
#  driver = TestSupport.driver
#    #num_of_rows = driver.find_elements(:css, "#modal-header div")
#    num_of_rows = driver.find_elements(:id, "modal-body")
#    #Loop through rows in cucumber   
#    table.rows.each do | row_defined_in_cucumber |
#      matched = false
#      #Loop through UI rows
#      for i in 1..num_of_rows.length
#        row_data = driver.find_elements(:id, "modal-body")     
#        if row_defined_in_cucumber.length != row_data.length
#          matched = false
#        else 
#          matched = avoid_block_nesting(row_defined_in_cucumber, row_data)            
#        end         
#        if matched
#          break 
#        end
#      end # for loop  
#      p "could not match data: #{row_defined_in_cucumber}" unless matched  
#      driver.save_screenshot("incorrect_rows.png") unless matched
#      expect(matched).to be_true
#    end#do loop  
#end

When(/^the user enters in the search field "(.*?)"$/) do
  con= ActiveProblemsCoverSheet.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('problemsFilterSearch', 'Diabetes Mellitus Type II or unspecified')
end

#When(/^user enters "(.*?)" in the search box$/) do |search_value|
When(/^use enters "(.*?)" in the search box$/) do |_search_value|
  driver = TestSupport.driver
  con = ActiveProblemsCoverSheet.instance
  TestSupport.wait_for_page_loaded

  #login_elements = Search.instance
  login_elements = ActiveProblemsCoverSheet.instance
  login_elements.perform_action("Problems Filter Field") if login_elements.static_dom_element_exists? "Problems Filter Field"
  #con.perform_action('Search')
  #expect(login_elements.static_dom_element_exists? "search").to be_true
end

Then(/^the user click on Problems Expand View$/) do 
  con= ActiveProblemsCoverSheet.instance
  TestSupport.wait_for_page_loaded
  con.perform_action('Problems Expand View')
end

def verify_problem_table_headers(access_browser_instance, table)
  driver = TestSupport.driver
  con = ActiveProblemsCoverSheet.instance
  con.wait_until_action_element_visible("Description", 60)
  expect(con.static_dom_element_exists?("Description")).to be_true
  #con.perform_verification("Description", "Hyperlipidemia")
  # headers = driver.find_elements(:xpath, "//*[@id='data-grid-problems']")
  #headers = driver.find_elements(:css, "#grid-panel-problems th") 
  headers = driver.find_elements(:css, "#data-grid-problems th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

def verify_problems_table_headers(access_browser_instance, table)
  con = ActiveProblemsSinglePage.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Description", 60)
  expect(con.static_dom_element_exists?("Description")).to be_true
  con.perform_verification("Description", "Hyperlipidemia")
  # headers = driver.find_elements(:xpath, "//*[@id='data-grid-problems']")
  #headers = driver.find_elements(:css, "#grid-panel-problems th") 
  headers = driver.find_elements(:css, "#data-grid-problems th") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

#Find rows in Active Problems table
Then(/^user sees Active Problems table display$/) do |table|
  driver = TestSupport.driver
  aa = ActiveProblemsSinglePage.instance
  aa.wait_until_action_element_visible("problemsTable", 30)
  #TestSupport.wait_for_page_loaded
  #TestSupport.wait_for_jquery_completed
  aa.wait_until_xpath_count_greater_than("Number of rows", 2)
  browser_elements_list = driver.find_elements(:xpath, "//table[@id='data-grid-problems']/descendant::tr")
  con = VerifyTableValue.new 
  #  print "list size : " 
  #  p browser_elements_list.length     
  matched = con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-problems']", table)
  expect(matched).to be_true
end

#Find rows in the Problems Coversheet
Then(/^the Active Problems coversheet contains rows$/) do |table|
  driver = TestSupport.driver
  con = ActiveProblemsSinglePage.instance
  con.wait_until_action_element_visible("Description", 60)
  expect(con.static_dom_element_exists?("Description")).to be_true
  #con.perform_verification("Description", "Hypertension")
  num_of_rows = driver.find_elements(:css, "#data-grid-problems>tbody>tr")
  p num_of_rows.length
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-problems']/tbody/tr[#{i}]/td")
      if row_defined_in_cucumber.length != row_data.length
        matched = false
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)
      end
      if matched
        break 
      end
    end # for loop  
    # p "could not match data: #{row_defined_in_cucumber}" unless matched  
    expect(matched).to be_true
  end #do loop  
end #Problems coversheet

#Check to make sure rows are not in the Problems Coversheet
Then(/^the Active Problems coversheet does not contains rows$/) do |table|
  driver = TestSupport.driver
  num_of_rows = driver.find_elements(:css, "#data-grid-problems>tbody>tr")
  p num_of_rows.length
  #Loop through rows in cucumber   
  table.rows.each do |row_defined_in_cucumber|
    matched = false
    p "Checking new row"
    #Loop through UI rows
    for i in 1..num_of_rows.length
      row_data = driver.find_elements(:xpath, ".//*[@id='data-grid-problems']/tbody/tr[#{i}]/td")
      if row_defined_in_cucumber.length != row_data.length
        matched = false
      else 
        matched = avoid_block_nesting(row_defined_in_cucumber, row_data)
      end
      if matched
        break 
      end
    end # for loop  
    #p "Found a match for: #{row_defined_in_cucumber}" unless !matched  
    expect(matched).to be_false
  end #do loop  
end #Problems coversheet



