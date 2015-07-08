When(/^user selects all patient tab$/) do
  @ehmp = PatientSearch.new
  @ehmp.load
  @ehmp.wait_for_btn_allpatient(20)
  @ehmp.btn_allpatient.click
end

And(/^user searches for last_name "(.*?)" and ssn "(.*?)"$/) do |lastname, ssn|
  @ehmp = PatientSearch.new
  @ehmp.wait_for_fld_search_lastname
  @ehmp.wait_for_fld_search_ssn
  @ehmp.fld_search_lastname.set lastname
  @ehmp.fld_search_ssn.click
  @ehmp.fld_search_ssn.set ssn
  @ehmp.btn_search.click
end

When(/^user searches for last_name "(.*?)" and first_name "(.*?)"$/) \
do |lastname, firstname|
  @ehmp = PatientSearch.new
  @ehmp.wait_for_fld_search_lastname
  @ehmp.fld_search_lastname.set lastname
  @ehmp.fld_search_firstname.set firstname
  @ehmp.btn_search.click
end

When(/^user searches for last_name "(.*?)" and dob "(.*?)"$/) do |lastname, dob|
  @ehmp = PatientSearch.new
  @ehmp.wait_for_fld_search_lastname
  @ehmp.fld_search_lastname.set lastname
  @ehmp.fld_search_dob.click
  @ehmp.fld_search_dob.set dob
  @ehmp.btn_search.click
end

#When(/^user searches for first_name "(.*?)", ssn "(.*?)" and dob "(.*?)"$/) \
#do |firstname, ssn, dob|
#     @ehmp = PatientSearch.new
#     @ehmp.wait_for_fld_search_lastname
#     @ehmp.fld_search_firstname.set firstname
#     @ehmp.fld_search_ssn.click
#     @ehmp.fld_search_ssn.set ssn
#     @ehmp.fld_search_dob.click
#     @ehmp.fld_search_dob.set dob
#     expect(@ehmp.btn_search).disabled?
#     # @ehmp.btn_Search.click
# end

When(/^user searches for last_name "(.*?)", ssn "(.*?)"$/) \
do |lastname, ssn|
  @ehmp = PatientSearch.new
  @ehmp.wait_for_fld_search_lastname
  @ehmp.fld_search_lastname.set lastname
  @ehmp.fld_search_ssn.click
  @ehmp.fld_search_ssn.set ssn
  @ehmp.btn_search.click
end

And(/^patient search screen displays the "(.*?)" message$/) do |record|
  @ehmp.wait_for_dlg_wand_panel
  expect(@ehmp.dlg_wand_panel).to have_text record
end

Then(/^patient search screen displays "(.*?)"$/) do |error|
  @ehmp.wait_for_err_message1
  expect(@ehmp.err_message1).to have_text error
end

When(/^it displays "(.*?)" on acknowledgement confirm section$/) do |record|
  @ehmp.wait_for_dlg_ack_panel(20)
  expect(@ehmp.dlg_ack_panel).to have_text record
end

When(/^user acknowledges message$/) do
  @ehmp.btn_ack.click
end

