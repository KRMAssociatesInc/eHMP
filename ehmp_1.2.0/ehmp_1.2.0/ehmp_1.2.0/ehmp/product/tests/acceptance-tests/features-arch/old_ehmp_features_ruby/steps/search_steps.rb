
When(/^user searches for "(.*?)" for that patient$/) do |search_string|

  #cucumber step: When user types "Eight" in the "Search Field"
  search_term = @test_patient.search_term
  select_patient_from_list = @test_patient.patient_name
  AccessPatientStepReuse.user_types_in_the(search_term, "Search Field")

  #cucumber step: Then the patient list displays "38" results
  num_results =  @test_patient.search_result_count
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length(num_results, DefaultLogin.wait_time)
  expect(verification_passed).to be_true

  #cucumber step: And user selects "Eight,Patient" from the patient list
  AccessPatientStepReuse.user_selects_from_patient_list(select_patient_from_list)
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.wait_until_action_element_visible("Search Tab", DefaultLogin.wait_time)
  patient_details.perform_action("Search Tab", search_string)

  search_elements = SearchElements.instance
  search_elements.wait_until_action_element_visible("Search Field", DefaultLogin.wait_time)
  search_elements.perform_action("Search Field", search_string)
end

When(/^user searches for "(.*?)"$/) do |search_string|
  search_elements = SearchElements.instance
  search_elements.wait_until_action_element_visible("Search Tab", DefaultLogin.wait_time)
  search_elements.perform_action("Search Tab", search_string)
  search_elements.wait_until_action_element_visible("Search Field", DefaultLogin.wait_time)
  search_elements.perform_action("Search Field", search_string)
end

Then(/^search results displays "(.*?)" titles$/) do |num_titles|
  search_elements = SearchElements.instance
  search_elements.wait_until_xpath_count("Number of result titles", num_titles, DefaultLogin.wait_time)
  expect(search_elements.perform_verification("Number of result titles", num_titles)).to be_true
end

When(/^user opens title "(.*?)"$/) do |title_text|
  search_elements = SearchElements.instance
  html_access = AccessHtmlElement.new(:xpath, search_elements.build_title_xpath(title_text))
  search_elements.add_action(CucumberLabel.new("Open Title"), OpenTitle.new, html_access)
  search_elements.wait_until_action_element_visible("Open Title", DefaultLogin.wait_time)
  search_elements.perform_action("Open Title", title_text)
end

Then(/^search results displays "(.*?)" summaries$/) do |num_summaries_under_title, table|
  expect(SearchElements.instance.perform_verification("Number of result summaries", num_summaries_under_title)).to be_true
  all_found = true
  table.rows.each do | row|
    summary_found = SearchElements.instance.summary_displayed? row[0]
    all_found = all_found && summary_found
  end
  expect(all_found).to be true
end

Then(/^search results include$/) do |table|
  all_found = true
  table.rows.each do | summary, summary_date|
    summary_found = SearchElements.instance.result_displayed? summary, summary_date
    all_found = all_found && summary_found
  end
  expect(all_found).to be true
end
