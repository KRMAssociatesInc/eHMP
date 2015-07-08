require 'page-object'
require_relative './basic_page'
# This is the cover sheet  page object
class CoverSheetPage < RubySelenium
  include PageObject
  page_url ENV['BASE'] # cover-sheet"  # 'timeout'', id: '60'

  div(:patient_identifying_traits, id: 'patientDemographic-patientInfo')
  # div('patient_name', id: 'patientDemographic-patientInfo')
  div(:patient_search_button, id: 'patientSearchButton')
  span(:patientDemographic_patientInfo_ssn, id:
      'patientDemographic-patientInfo-ssn')
  span(:patientDemographic_patientInfo_dob, id:
      'patientDemographic-patientInfo-dob')
  span(:patientDemographic_patientInfo_gender, id:
      'patientDemographic-patientInfo-gender')
  span(:screenName, id: 'screenName')
  div(:patientDemographic_cwad, id: 'patientDemographic-cwad')
  div(:patientDemographic_visitInfo, id: 'patientDemographic-visitInfo')
  div(:clickVisitInfo, id: 'setVisitContextBtn')
  div(:patientDemographic_providerInfo, id: 'patientDemographic-providerInfo')
  div(:allergy_grid_items, id: 'allergy_grid-pill-gist-items')
  div(:navigation_navbar, id: 'navigation-navbar')
  div(:Cover_Sheet_Pill, css: '#screenName')
  div(:navigation_region, id: 'navigation-region')
  div(:navigation_panel, id: 'navigationPanel')
  div(:navigation_date, id: 'navigation-date')
  div(:hidden_div, id: 'hiddenDiv')
  button(:date_region, id: 'date-region')
  span(:navigation_dateButton, id:
      'navigation-dateButton')
  div(:input_group_btn, id: 'input-group-btn')
  button(:submit, id: 'submit')
  list_item(:text_search_input, id: 'text-search-input')
  text_field(:search_text, id: 'searchtext')
  button(:cover_sheet_button, id: 'cover-sheet-button')
  list_item(:news_feed_button, id: 'news-feed-button')
  list_item(:overview_button, id: 'overview-button')
  list_item(:cover_sheet_button, id: 'cover-sheet-button')
  list_item(:documents_list_button, id: 'documents-list-button')

  # add_verify(CucumberLabel.new("CLINICAL REMINDERS"),
  # VerifyContainsText.new, applet_panel_title("clinical_reminders"))
  # note: may be discontinued

  # @@applet_count = AccessHtmlElement.new(:xpath, "//*[@data-appletid]") count
  def wait_for_page_to_load
    page_load_wait = Selenium::WebDriver::Wait.new('timeout' => 60) # seconds
    page_load_wait.until do
      patient_identifying_traits_element.visible?
    end
  end

  def patient_identifying_traits
    patient_identifying_traits_element.visible?
  end

  def allergies
    page.text.clude?('Allergies')
  end

  def list_group
    navigation_navbar.unordered_list_element.text
  end

  def cover_sheet
    cover_sheet_button_element.link_element.when_visible.click
  end
end
