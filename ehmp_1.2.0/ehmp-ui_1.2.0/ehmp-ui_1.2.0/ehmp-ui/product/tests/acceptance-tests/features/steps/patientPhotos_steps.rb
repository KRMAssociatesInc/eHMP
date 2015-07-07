And(/^the coversheet patient photo is displayed$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 10).until {
    element = driver.find_element(:css, "#patientDemographic-patientInfo-detail img[src*=jpeg]")
    element.displayed?
  }
end

When(/^user searches for "(.*?)" to validate patient photo$/) do |search_value|
  patient_search = PatientSearch.instance
  driver = TestSupport.driver

  # if patient search button is found, click it to go to patient search
  patient_search.perform_action("patientSearch") if patient_search.static_dom_element_exists? "patientSearch"
  patient_search.wait_until_element_present("mySite", DefaultLogin.wait_time)
  expect(patient_search.perform_action("mySite")).to be_true
  patient_search.wait_until_element_present("mySiteAll", DefaultLogin.wait_time)
  expect(patient_search.perform_action("mySiteAll")).to be_true
  expect(patient_search.perform_action("patientSearchInput", search_value)).to be_true
  expect(patient_search.wait_until_xpath_count_greater_than("Patient Search Results", 0)).to be_true
  results = TestSupport.driver.find_elements(:xpath, "//span[contains(@class, 'patientDisplayName')]")
  patient_search.select_patient_in_list(0)
  patient_search.wait_until_element_present("Confirm", DefaultLogin.wait_time)
  expect(patient_search.static_dom_element_exists? "Confirm").to be_true
end

Then(/^the patient search photo is displayed$/) do
  driver = TestSupport.driver
  element = nil
  Selenium::WebDriver::Wait.new(:timeout => 20).until {
    element = driver.find_element(:css, ".col-md-4 img[src*=jpeg]")
    element.displayed?
  }
end

Then(/^the coversheet is refreshed$/) do
  driver = TestSupport.driver
  driver.navigate.refresh
end
