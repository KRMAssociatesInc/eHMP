Given(/^I am logged into EHMP\-UI "(.*?)" as "(.*?)" with password "(.*?)" successfully$/) \
do |facility, user, pwd|
  @ehmp = LoginPage.new
  @ehmp.load
  @ehmp.wait_for_ddl_facility(10)
  @ehmp.login_with(facility, user, pwd)
  @ehmp = PatientSearch.new
  @ehmp.displayed?
  @ehmp.wait_for_fld_patient_search
end

Given(/^I am logged into EHMP\-UI "(.*?)" as "(.*?)" with password "(.*?)" unsuccessfully$/) \
do |facility, user, pwd|
  @ehmp = LoginPage.new
  @ehmp.load
  @ehmp.wait_for_ddl_facility(10)
  @ehmp.login_with(facility, user, pwd)
end

Then(/^log me out$/) do
  @ehmp = PatientSearch.new
  @ehmp.load
  @ehmp.displayed?
  @ehmp.wait_for_fld_patient_search
  @ehmp.wait_for_ddl_ehmp_current_user
  @ehmp.ddl_ehmp_current_user.click
  @ehmp.btn_logout.click
end