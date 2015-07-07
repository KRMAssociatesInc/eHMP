When(/^user selected "(.*?)" from tasks option$/) do |arg_of_lactor1|
  # HMPCommands.perform_action("Confirm Change the Selected Button")

  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action("More Search MedsReiew Tasks", 10)
end

Then(/^user select "(.*?)" from "(.*?)"$/) do |arg_of_lactor1, field|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  HMPCommands.perform_action(field)
end

Then(/^the result are displayed in the "(.*?)"$/) do |arg1, table|

  table_rows_locator = HMPCommands.call_function_method_locator(arg1, 'verify')[2]
  # table_rows_locator = temp_xpath+"/tr"
  SeleniumCommand.perform_table_verification('xpath', table_rows_locator, table)
end

Then(/^user select "(.*?)" from results table$/) do |arg1|
  HMPCommands.perform_action(arg1)
end

When(/^user looked and selected "(.*?)"$/) do |arg1|
  HMPCommands.perform_action("Search Bar", arg1)
  # HMPCommands.call_locator_with_arg(arg1, arg2)
  # HMPCommands.perform_action("Search bar drop list")
end

When(/^user select "(.*?)" from Search Results$/) do |arg1|
  HMPCommands.call_locator_with_arg(arg1)
  HMPCommands.perform_action("Search Results drop list")
end

When(/the results for "(.*?)" are displayed in the "(.*?)"$/) do |click_on_arg1, arg2, table|
  HMPCommands.call_locator_with_arg(click_on_arg1)
  row_locator = HMPCommands.call_function_method_locator("Search Results drop list", 'action')[2]
  SeleniumCommand.wait_until_element_present('xpath', row_locator, 50)
  # # check if the domain is not extend, then click to extend it
  row_extend_locator = row_locator + '/parent::td/parent::tr'
  element = SeleniumCommand.find_element('xpath', row_extend_locator)
  if element.attribute("class").include? "collapsed"
    SeleniumCommand.click('xpath', row_locator)
  end

  table_rows_locator = HMPCommands.call_function_method_locator(arg2, 'verify')[2]
  # table_rows_locator = temp_xpath+"/tr"
  SeleniumCommand.perform_table_verification('xpath', table_rows_locator, table)
end

When(/user selects "(.*?)" from the result list$/) do |arg_of_lactor|
  HMPCommands.call_locator_with_arg(arg_of_lactor)
  HMPCommands.perform_action("Patient Name")
end

Then(/^the patient details displays for "(.*?)" as:$/) do |arg_of_lactor1, table|
  HMPCommands.call_locator_with_arg(arg_of_lactor1)
  table.rows.each do |field, value|
    p runtime_patient_detail = HMPCommands.perform_action(field)
    expect(runtime_patient_detail).to include value
  end
end

Then(/^eHMP returns "(.*?)" DoD result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.uid"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  p source_allvalues
  num_vista_results = 0
  source_dod = /urn:va:.*:DOD/
  source_allvalues.each do | value |
    unless source_dod.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^eHMP returns "(.*?)" VistA result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.uid"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  p source_allvalues
  num_vista_results = 0
  source_panorama = /urn:va:.*:9E7A/
  source_kodak = /urn:va:.*:C877/
  source_allvalues.each do | value |
    #if value.start_with? "urn:va:allergy:B362" #PANORAMA
    unless source_panorama.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
    unless source_kodak.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^eHMP returns "(.*?)" result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  expect(json['total']).to be(number_of_results.to_i)
end
