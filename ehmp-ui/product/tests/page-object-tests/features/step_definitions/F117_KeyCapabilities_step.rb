

When(/^user searches for "(.*?)"$/) do |patient|
  @ehmp = PatientSearch.new
  @ehmp.load
  expect(@ehmp).to be_displayed
  @ehmp.wait_for_fld_patient_search
  @ehmp.fld_patient_search.set patient
  @ehmp.fld_patient_search.native.send_keys(:return)
end

When(/^user confirms selection$/) do
  @ehmp.wait_for_btn_confirmation
  @ehmp.btn_confirmation.click
end

When(/^user confirms flagged messages$/) do
  @ehmp.wait_for_btn_confirm
  @ehmp.btn_confirm.click
end

And(/^user selects "(.*?)"$/) do |patient|
  @ehmp = PatientSearch.new
  @ehmp.wait_for_fld_patient_record
  click_an_object_from_list(@ehmp.fld_patient_record, patient)
end

Then(/^"(.*?)" information is displayed$/) do |patient, table|
  @ehmp = PatientSearch.new
  @ehmp.wait_for_fld_patient_name
  expect(@ehmp.fld_patient_name).to have_text(patient)
  table.rows.each do |field, value|
    @ehmp.tbl_patient_info.text.include? "#{field}" "#{value}"
  end
end

Then(/^"(.*?)" information is displayed in overview$/) do |patient, table|
  @ehmp = OverView.new
  @ehmp.load
  @ehmp.wait_for_fld_patient_search_button(20)
  @ehmp.wait_for_fld_app_version
  @ehmp.wait_for_fld_demo_patientInfo(30)
  expect(@ehmp.fld_demo_patientInfo).to have_text(patient)
  table.rows.each do |field, value|
    @ehmp.fld_demo_patientInfo.text.include? "#{field}" "#{value}"
  end
end

Then(/^"(.*?)" contains "(.*?)"$/) do |location, expected_text|
  values = location.split(' ')
  location_str = 'fld'
  values.each do |value|
    location_str = location_str + '_' + value.downcase
  end
  expect(@ehmp.send("#{location_str}")).to have_text(expected_text)
end

Then(/^the navigation bar displays the "(.*?)" Button$/) do |arg1|
  @ehmp.has_fld_patient_search_button?
  expect(@ehmp.patient_search_text).to have_text(arg1) 
end

When(/^the user clicks the "(.*?)" Button$/) do |arg1|
  @ehmp.patient_search_button(arg1)
end

Then(/^the patient search screen is displayed$/) do
  @ehmp = PatientSearch.new
  @ehmp.load
  expect(@ehmp).to be_displayed
end
