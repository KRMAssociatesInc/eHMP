require 'page-object'
require_relative './basic_page'
# This is the over view  page object
class OverViewPage < RubySelenium
  include PageObject
  page_url ENV['BASE'] # cover-sheet"  # 'timeout'', id: '60'
  span(:screenName, id: 'screenName')
  list_item(:cover_sheet_drop_menu, class: 'cover-sheet-button')
  div(:patient_identifying_traits, id: 'patientDemographic-patientInfo')

  def wait_for_page_to_load # Allow a fairly long time for initial page load
    page_load_wait = Selenium::WebDriver::Wait.new('timeout' => 60) # seconds
    page_load_wait.until do
      patient_identifying_traits_element.visible?
    end
  end
end
