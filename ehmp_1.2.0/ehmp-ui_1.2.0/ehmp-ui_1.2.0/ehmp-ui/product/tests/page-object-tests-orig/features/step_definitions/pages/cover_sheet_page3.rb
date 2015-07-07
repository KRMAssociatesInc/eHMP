require 'page-object'
require_relative './basic_page'
# This is the cover sheet  page object
class CoverSheetPage3 < RubySelenium
  include PageObject
  page_url ENV['BASE'] # cover-sheet"  #'timeout'', id: '60'
  div('patient_search_button', id: 'patientSearchButton')
  span('patientDemographic_patientInfo_dob', id:
  'patientDemographic-patientInfo-dob')
  span('patientDemographic_patientInfo_dob', id:
           'patientDemographic-patientInfo-dob')
  span('patientDemographic_patientInfo_gender', id:
           'patientDemographic-patientInfo-gender')
  div('patientDemographic_cwad', id: 'patientDemographic-cwad')
  div('patientDemographic_visitInfo', id: 'patientDemographic-visitInfo')
  div('patientDemographic_providerInfo', id: 'patientDemographic-providerInfo')
  div('patientDemographic_providerInfo', id: 'patientDemographic-providerInfo')
  div('left', id: 'left')
  button('patientDemographic_btn', id: 'patientDemographic-btn')
  button('new_observation', id: 'new-observation')
  button('navigation_dateButton', id: 'navigation-dateButton')
  div('navigation_date', id: 'navigation-date')
  button('date_region', id: 'date-region')
  button('date_region2', id: 'date-region2')
  button('all_range_global', id: 'all-range-global')
  button('yr2_range_global', id: '2yr-range-global')
  button('yr1_range_global', id: '1yr-range-global')
  button('mo3_range_global', id: '3mo-range-global')
  button('mo1_range_global', id: '1mo-range-global')
  button('d7_range_global', id: '7d-range-global')
  button('hr72_range_global', id: '72hr-range-global')
  button('hr24_range_global', id: '24hr-range-global')

  button('workspace_manager_button', id: 'workspace-manager-button')
  button('d7_range_global', id: '7d-range-global')
  button('hr72_range_global', id: '72hr-range-global')
  button('hr24_range_global', id: '24hr-range-global')
  text_field('filter_from_date_global', id: 'filter-from-date-global')
  text_field('filter_to_date_global', id: 'filter-to-date-global')
  button('custom_range_apply_global', id: 'custom-range-apply-global')
  button('plus_button', id: 'plus-button')

  button('grid_options_button_', id: 'grid-options-button-')
  button('applet-maximize-button', id: 'applet-maximize-button')

  text_field('search', id: 'search')  # need to change
  text_field('filter_to_date_global', id: 'filter-to-date-global')
  # active problems
  button('grid_filter_button_problems', id: 'grid-filter-button-problems')
  table('data_grid_problems', id: 'data-grid-problems')

  # appointment

  button('grid_filter_button_appointments', id:
             'grid-filter-button-appointments')
  table('data_grid_appointments', id: 'data-grid-appointments')

  # immunizations
  button('grid_add_button', id:
      'grid_add_button-immunizations')
  button('grid_filter_button', id:
      'grid-filter-button-immunizations')
  table('data_grid_immunizations', id: 'data-grid-immunizations')
  def wait_for_page_load
    # Allow a fairly long time for initial page load
    # (mae to agilexhealth takes a long time for first secured request)
    page_load_wait = Selenium::WebDriver::Wait.new('timeout' => 120) # seconds
    # pageLoadWait.until { self.get_link_by_text('nav-about') }
    page_load_wait.until { left_element }
    # pageLoadWait.until { self.about_element }
  end
end
