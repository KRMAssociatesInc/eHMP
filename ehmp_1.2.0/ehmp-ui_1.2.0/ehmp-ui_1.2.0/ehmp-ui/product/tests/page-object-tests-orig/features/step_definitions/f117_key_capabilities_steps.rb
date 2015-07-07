#require 'debugger'
require 'rspec/expectations'
require 'selenium-webdriver'
require_relative './pages/login_page'
require_relative './pages/patient_search2'
require_relative './pages/basic_page'
require_relative './pages/cover_sheet_page'

World(RSpec::Matchers)
World(PageObject::PageFactory)
 
When(/^User searches for "(.*?)"$/) do |patientName|
    # @browser.save_screenshot 'screenshots/PatientSearch1.png'
    page = PatientSearchPage.new @browser, true
    page.wait_until do
      not page.patient_search_input_element.nil? and page.patient_search_input_element.visible?
      # @browser.save_screenshot 'screenshots/PatientSearch2.png'
    end
  page.wait_until do
    page.patient_search_input_element.visible?
  end
    page.patient_search_input = patientName

  # @browser.save_screenshot 'screenshots/PatientSearch3.png'
  page.patient_search_input_element.send_keys [:enter]
  expect(page.patient_search_input.eql? patientName).to be_truthy
end
And(/^User selects "(.*?)"$/) do |patientName|
 page = PatientSearchPage.new @browser
  page.wait_until do
    page.text.include?(patientName.upcase)
    # @browser.save_screenshot 'screenshots/PatientSearch4.png'
  end
  # sleep  (90)
  page.div_element('class' => 'list-group').link_element.when_present.click
end
Then(/^"(.*?)" displays information/) do |patientName|
  page = PatientSearchPage.new @browser
  page.wait_until do
    not page.confirmation_button_element.nil? and page.confirmation_button_element.enabled? 
  # @browser.save_screenshot 'screenshots/ConfirmationButton.png'
  end
 # debugger

 # sleep(40)
  # page.wait_until do
  #   not page.div_element('class' => 'patientName').nil? and page.div_element('class' => 'patientName').visible?
  # end
   # page.patient_name_element.class_name = patientName
   #  puts page.patient_name_div_element
   # # debugger
   # expect(page.div_element('class' => 'patientName')).text.eql? patientName.to be_truthy

   sleep 5
   text = page.div_element('class' => 'patientName').text
   puts text   
   expect(text).to eq(patientName)
  # page.confirmation_button_element.when_present.click
  # page.wait_until do
  #   unless page.patient_search_input_element.visible?
  #     puts 'Hello'
  #     not page.confirmation_button_element.nil? and page.confirmation_button_element.visible?
  #   end
  # end
  # expect(page.patient_search_input.eql? patientName).to be_truthy
  page.confirmation_button_element.when_present.click
end

# Then(/^the "(.*?)" is displayed with information/) do |arg1, _table| \
#   page = PatientSearchPage.new @browser
#   page.wait_until(5, 'Patient Name not found on page') do
#     page.text.include?("#{arg1}")
#   end
# end

# Then(/^"(.*?)" contains "(.*?)"$/) do |location, expected_text|
#   page = PatientSearchPage.new @browser
#   page.wait_until(10, 'Patient Name not found on page') do
#     expect(page.bottom_region_element.visible?).to be true
#   end
#   expect("#{location}" == 'Bottom Region').to be true
#   page.text.include?(expected_text)
# end

# # Then the navigation bar displays the Patient Search Button
# # # this should change to confirm selection
# Then(/^the navigation bar displays the Patient Search Button/) do \
#   page = PatientSearchPage.new @browser
#   page.wait_until(5, 'Patient Name not found on page') do
#     expect(page.confirmation_button_element.visible?).to be true
#   end
#   page.confirmation_button_element.when_present.click
# end

# Then(/^the "(.*?)" screen is displayed/) do |expected_text|
#   page = CoverSheetPage.new @browser
#   sleep 3
#   page.wait_until(5, 'Patient Name not found on page') do
#     expect(page.send(expected_text)).to be true
#   end
# end

# After do
#   @browser.quit unless @browser.nil?
# end
# And user searches for and selects "Ten,Patient"
# @page = PatientSearchPage.new @browser

# When (/^User searches for "(.*?)"$/) \
# do |patientName|
#   page = PatientSearchPage.new @browser

#   page.patient_search_input_element.wait_until do
#     page.patient_search_input = patientName
#     expect(page.patient_search_input).to eql patientName
#     page.patient_search_input_element.send_keys [:enter]
#   end
# #   page.wait_until { page.text.include?(patientName.upcase) }
#   page.div_element('class' => 'list-group').link_element.when_present.click
# end


