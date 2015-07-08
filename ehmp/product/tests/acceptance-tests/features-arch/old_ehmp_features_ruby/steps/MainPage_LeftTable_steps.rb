When(/^user requests "(.*?)" for the patient "(.*?)"$/) do |arg1, patient_name|

  setup_env = SetupEnv.new

  unless SeleniumCommand.driver.current_url.include? "/app/cpe;staging"
    SeleniumCommand.navigate_to_url(setup_env.url + "app/cpe;staging")
  end

  search_option = "CPRS Default"
  HMPCommands.perform_action(search_option)

  field = "Search Field"
  HMPCommands.perform_action(field, patient_name)

  patient_selected_lactor = patient_name
  HMPCommands.call_locator_with_arg(patient_selected_lactor)
  # check if the element is not selected before
  if HMPCommands.perform_verification("Patient Name Selected").empty?
    HMPCommands.perform_action("Patient Name")
    HMPCommands.perform_action("Confirm Change the Selected Button")
  end
end
