# This class holds functions that can be reused by different steps
class AccessPatientStepReuse
  # cucumber step example: Then user selects "Eight,Patient" from the patient list
  def self.user_selects_from_patient_list(chosen_patient)
    access_patient_picker = PatientPickerElements.instance
    access_patient_picker.select_patient_from_list(chosen_patient)
    access_patient_picker.confirm_patient_selection_change
    TestSupport.wait_for_page_loaded
  end

  # cucumber step example: When user types "Eight" in the "Search Field"
  def self.user_types_in_the(search_value, search_field)
    TestSupport.wait_for_page_loaded
    access_patient_picker = PatientPickerElements.instance
    access_patient_picker.perform_action(search_field, search_value)
  end

  def self.wait_for_patientlist_length(num_expected_results, num_seconds)
    access_patient_picker = PatientPickerElements.instance
    return access_patient_picker.wait_until_xpath_count("Patient List Length", num_expected_results, num_seconds)
    #    seconds_to_wait = num_seconds.to_i
    #    i = 0
    #    verification_passed = false
    #    while i < seconds_to_wait
    #      begin
    #        verification_passed = access_patient_picker.perform_verification("Patient List Length", num_expected_results)
    #      rescue
    #        verification_passed = false
    #      end
    #      if verification_passed
    #        i = seconds_to_wait
    #      else
    #        sleep 1
    #        p "List hasn't updated, wait 1 second"
    #      end
    #      i = i + 1
    #    end
    #    return verification_passed
  end
end

Given(/^user is viewing patient with clinical procedure data$/) do
  # cucumber step: When user types "Eight" in the "Search Field"
  AccessPatientStepReuse.user_types_in_the("Ten", "Search Field")

  # cucumber step: Then the patient list displays "38" results
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length("4", 5)
  expect(verification_passed).to be_true

  # cucumber step: And user selects "Eight,Patient" from the patient list
  AccessPatientStepReuse.user_selects_from_patient_list("Ten,Patient")
end
Given(/^user is viewing patient Eight,Patient$/) do
  # cucumber step: When user types "Eight" in the "Search Field"
  AccessPatientStepReuse.user_types_in_the("Eight", "Search Field")

  # cucumber step: Then the patient list displays "38" results
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length("38", 5)
  expect(verification_passed).to be_true

  # cucumber step: And user selects "Eight,Patient" from the patient list
  AccessPatientStepReuse.user_selects_from_patient_list("Eight,Patient")
end

When(/^user selects "(.*?)" from the patient list$/) do |chosen_patient|
  AccessPatientStepReuse.user_selects_from_patient_list(chosen_patient)
end

When(/^user searches in the "(.*?)" patient set$/) do |arg1|
  access_patient_picker = PatientPickerElements.instance
  access_patient_picker.perform_action(arg1)
end

When(/^user types "(.*?)" in the "(.*?)"$/) do |search_value, search_field|
  AccessPatientStepReuse.user_types_in_the(search_value, search_field)
end

Then(/^matching patients are displayed in the patient list$/) do |table|
  TestSupport.wait_for_page_loaded
  access_patient_picker = PatientPickerElements.instance
  table.rows.each do | patient |
    access_patient_picker.find_in_patient_list(patient[0])
  end
end

Then(/^the patient list displays "(.*?)" results$/) do |num_expected_results|
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length(num_expected_results, 5)
  expect(verification_passed).to be_true
end

Then(/^the patient list displays "(.*?)" results within "(.*?)" seconds$/) do |num_expected_results, num_seconds|
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length(num_expected_results, num_seconds)
  expect(verification_passed).to be_true
end

Then(/^the patient details for "(.*?)" displays$/) do |patient, table|
  patient_details = TransPatientBarHTMLElements.instance
  header_xpath = patient_details.build_header_xpath(patient)
  error_messages = []

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

Then(/^the page displays the "(.*?)" popup$/) do | search_box_text |
  clinic_search_elements = SearchElements.instance
  clinic_search_elements.wait_until_element_present(search_box_text, 10)
end

Then(/^user chooses the "(.*?)"$/) do |arg1|
  SearchElements.instance.perform_action(arg1)
end
