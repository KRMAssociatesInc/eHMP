require 'rspec/expectations'
require 'selenium-webdriver'
require_relative './pages/login_page'
require_relative './pages/patient_search'
require_relative './pages/basic_page'
require_relative './pages/cover_sheet_page'

World(RSpec::Matchers)
World(PageObject::PageFactory)


Given (/^The user confirms to "(.*?)" meds review/) \
do |patientName|
  page = PatientSearchPage.new @browser, true
  page.patient_search_input_element.wait_until do
    page.patient_search_input = patientName
    expect(page.patient_search_input).to eql patientName
    page.patient_search_input_element.send_keys [:enter]
  end
  page_load_wait = Selenium::WebDriver::Wait.new('timeout' => '60')
  page_load_wait.until { page.text.include?(patientName.upcase) }
  page.div_element('class' => 'list-group').link_element.click
  page.wait_until(10, 'Patient Name not found on page') do
    expect(page.confirmation_button_element.visible?).to be true
  end
   sleep 3
  page.confirmation_button_element.click
  sleep 1
end

When (/^user selects the meds review from the drop-down list/) do \

    page = CoverSheetPage.new @browser, false

      page.wait_until(5, 'Patient Name not found on page')do

      expect(page.screenName_element.visible?).to be true

      page.screenName_element.click

 end

  page.wait_until(5, 'Patient Name not found on page') do

  expect(page.medicationreviewbutton_element.visible?).to be true

  expect(page.medicationreviewbutton_element.link_element.visible?).to be true

  end

  page.medicationreviewbutton_element.link_element.click

end

Then (/^clinician is able to see the combined view/) do \

  page = CoverSheetPage.new @browser

  page.wait_until(5, 'Patient Name not found on page')do

    expect(page.med_Group_Type_element.visible?).to be true

    page.med_Group_Type_element.click

  end
  end