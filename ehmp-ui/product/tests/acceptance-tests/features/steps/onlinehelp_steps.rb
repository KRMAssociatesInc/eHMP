Given(/^the On-line Help icon on login page of eHMP\-UI$/) do
  p "running test #{TestSupport.test_counter} #{TestSupport.test_counter % 20}"
  if ENV.keys.include?('LOCAL') || TestSupport.test_counter % 20 == 0
    p 'refresh the app'
    TestSupport.navigate_to_url(DefaultLogin.ehmpui_url)
  else
    TestSupport.navigate_to_url(DefaultLogin.ehmpui_url + "/#patient-search-screen")
  end

  begin
    TestSupport.driver.manage.window.maximize
  rescue
    p "Unable to maximize window - continuing anyway"
  end

  wait_until_dom_has_signin_or_signout

  login_elements = LoginHTMLElements.instance
  if login_elements.static_dom_element_exists?("Signout")
    perform_signout_steps login_elements
  end
  driver = TestSupport.driver
  expect(driver.find_element(:id, "linkHelp-logon")).to be_true

end

Then(/^the On-line Help icon is present on Patient Search page$/) do
  driver = TestSupport.driver
  expect(driver.find_element(:id, "linkHelp-patient_search")).to be_true
end

Given(/^user searches for patient "(.*?)"$/) do |search_value|
  patient_search = PatientSearch.instance
  driver = TestSupport.driver

  # if patient search button is found, click it to go to patient search
  patient_search.perform_action("patientSearch") if patient_search.static_dom_element_exists? "patientSearch"

  #verify icon help on My CPRS List
  patient_search.wait_until_element_present("myCPRSList", DefaultLogin.wait_time)
  expect(patient_search.perform_action("myCPRSList")).to be_true
  expect(driver.find_element(:id, "linkHelp-myCPRSList")).to be_true

  patient_search.wait_until_element_present("mySite", DefaultLogin.wait_time)
  expect(patient_search.perform_action("mySite")).to be_true

  patient_search.wait_until_element_present("mySiteAll", DefaultLogin.wait_time)
  expect(patient_search.perform_action("mySiteAll")).to be_true
  expect(patient_search.perform_action("patientSearchInput", search_value)).to be_true

  expect(patient_search.wait_until_xpath_count_greater_than("Patient Search Results", 0)).to be_true

  results = TestSupport.driver.find_elements(:xpath, "//span[contains(@class, 'patientDisplayName')]")
  patient_search.select_patient_in_list(0)

  driver = TestSupport.driver
  
  patient_search.wait_until_element_present("Confirm", DefaultLogin.wait_time)

  expect(driver.find_element(:id, "linkHelp-patient_search_confirm")).to be_true
  expect(driver.find_element(:id, "linkHelp-mySite")).to be_true
end

And(/^selects it$/) do
  patient_search = PatientSearch2.instance
  driver = TestSupport.driver

  patient_search.wait_until_element_present("Confirm", DefaultLogin.wait_time)
  expect(patient_search.static_dom_element_exists? "Confirm").to be_true

  results = TestSupport.driver.find_element(:css, "#patient-search-confirmation div.patientName")
  expect(patient_search.perform_action("Confirm")).to be_true

  patient_search.wait_until_element_present("Confirm Flag", DefaultLogin.wait_time)
  expect(driver.find_element(:id, "linkHelp-patient_search_restricted")).to be_true
  # deliberate use of wait time other then the DefaultLogin.wait_time
  #expect(patient_search.wait_until_element_present("patientSearch", 60)).to be_true
  wait_until_dom_has_confirmflag_or_patientsearch
end

Then(/^the On-line Help icon is present on "(.*?)" page$/) do |panel|
  driver = TestSupport.driver

  if panel == "Overview"
    expect(driver.find_element(:id, "help-button-cds_advice")).to be_true
    expect(driver.find_element(:id, "help-button-encounters")).to be_true
    expect(driver.find_element(:id, "help-button-reports")).to be_true
  else
    expect(driver.find_element(:id, "help-button-ccd_grid")).to be_true
    expect(driver.find_element(:id, "help-button-appointments")).to be_true
    expect(driver.find_element(:id, "help-button-orders")).to be_true
  end

  expect(driver.find_element(:id, "help-button-problems")).to be_true
  expect(driver.find_element(:id, "help-button-activeMeds")).to be_true
  expect(driver.find_element(:id, "help-button-vitals")).to be_true
  expect(driver.find_element(:id, "help-button-immunizations")).to be_true
  expect(driver.find_element(:id, "help-button-lab_results_grid")).to be_true
  expect(driver.find_element(:id, "linkHelp-status_bar")).to be_true
  expect(driver.find_element(:id, "linkHelp-patient_search_button")).to be_true
  #expect(driver.find_element(:id, "linkHelp-ehmp_header")).to be_true
  expect(driver.find_element(:id, "linkHelp-user_info")).to be_true
  expect(driver.find_element(:id, "linkHelp-coversheet")).to be_true
end

Then(/^the On-line Help icon is present on Documents page$/) do
  driver = TestSupport.driver
  expect(driver.find_element(:id, "help-button-documents")).to be_true
end

Then(/^the On-line Help icon is present on Timeline page$/) do
  driver = TestSupport.driver
  expect(driver.find_element(:id, "help-button-newsfeed")).to be_true
end

Then(/^the On-line Help page is opened by clicking on the On-line Help icon$/) do
  driver = TestSupport.driver

  pagehelp = driver.find_element(:id, "linkHelp-patient_search")
  pagehelp.click

  driver.switch_to.window(driver.window_handles.last) {
    begin
      wait = Selenium::WebDriver::Wait.new(:timeout => 15)
      wait.until {
        expect(driver.find_element(:class, "WordSection3")).to be_true
      }
    rescue Exception => e
      p "Error: #{e}"
    end
  }
end

Then(/^the tooltip is present on "(.*?)"$/) do |tooltip_type|
  driver = TestSupport.driver
  case tooltip_type
  when "Column header"
    column_tltip = driver.find_elements(:xpath, "//div[@id='vitals-observations-gist']/div/span[@tooltip-data-key]")
    #p column_tltip
    expect(column_tltip.length).to eq(3)

  when "Letter symbol"
    letter_tltip = driver.find_elements(:xpath, "//div[@id='patientDemographic-cwad']/span[@tooltip-data-key]")
    #p letter_tltip
    expect(letter_tltip.length).to eq(5)

  when "Icons from toolbar"
    driver.find_element(:id, "vitals_problem_name_BPS").click
    tlbr_icon_tltip = driver.find_elements(:xpath, "//div[@id='vitals-observations-gist-items']//a[@tooltip-data-key]")
    #p tlbr_icon_tltip
    expect(tlbr_icon_tltip.length).to eq(30)

  when "Timeline"
    timeln_tltip = driver.find_elements(:xpath, "//div[@id='globalDatePicker-compact']//*[@tooltip-data-key]")
    #p timeln_tltip
    expect(timeln_tltip.length).to eq(2)

  when "Status bar"
    status_tltip = driver.find_elements(:xpath, "//div[@id='patientSyncStatusRegion']/div/span[@data-toggle='tooltip']")
    p status_tltip
    expect(status_tltip.length).to eq(3)
  else
    p "Can not find option!"
  end
end
