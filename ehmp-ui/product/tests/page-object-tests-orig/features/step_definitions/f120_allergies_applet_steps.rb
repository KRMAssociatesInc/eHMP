require 'rspec/expectations'
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'selenium-webdriver'
require_relative './pages/login_page'
require_relative './pages/patient_search'
require_relative './pages/basic_page'
require_relative './pages/cover_sheet_page'

World(RSpec::Matchers)
World(PageObject::PageFactory)

And(/^user searches for and selects "(.*?)" and confirms selection$/) \
do |patientName|
  page = PatientSearchPage.new @browser
  page.patient_search_input_element.wait_until do
    page.patient_search_input = patientName
    expect(page.patient_search_input).to eql patientName
    page.patient_search_input_element.send_keys [:enter]
  end
  page.wait_until { page.text.include?(patientName.upcase) }
  page.div_element('class' => 'list-group').link_element.when_present.click
  page.confirmation_button_element.when_present.click
  sleep 2
end

Then(/^Cover Sheet is active$/) do \
  # $cover_sheet_page = CoverSheetPage.new @browser, true
  page = CoverSheetPage.new @browser
  # page.wait_for_page_to_load
  page.screenName_element.wait_until do
    expect(page.screenName_element.visible?).to be true
  end
end

Then(/^Overview is active$/) do \
  # $cover_sheet_page = CoverSheetPage.new @browser, true
  page = OverViewPage.new @browser
  # page.wait_for_page_to_load
  page.wait_until(5, 'Call not returned within 5 seconds') do
    page.text.include? 'Overview'
  end
  page.screenName_element.when_present.click
  page.cover_sheet_drop_menu_element.link_element.when_present.click
end

# Then(/^the patient is displayed with information/) do |table| \
Then(/^the "(.*?)" is displayed in Patient search/) do |expected_text, table|
  page = CoverSheetPage.new @browser
  # page.wait_for_page_to_load
  page.patient_identifying_traits_element.when_present do
    expect(page.send(expected_text)).to be true
  end
  table.rows.each do |_field, value|
    page.wait_until(5, 'Call not returned within 5 seconds') do
      page.text.include? "#{value}"
    end
  end
end

Then(/^the applets are displayed on the coversheet$/) do |table|
  page = CoverSheetPage.new @browser
  page.patient_identifying_traits_element.when_present do
    table.rows.each do |field_name|
      single_cell = field_name[0]
      expect(page.send(single_cell)).to be true
    end
  end
  sleep 2
end
