require 'page-object'
# require_relative './basic_page'
require_relative './base'
# This is the patient search page object
class PatientSearchPage < Base
  
  set_page_url "#patient-search-screen"

  # Patient Search / Landing Page page objects My Site/All is default
  text_field(:patient_search_input, id: 'patientSearchInput')
  link(:my_cprs_list, id: 'myCPRSList')
  link(:my_Site_list, id: 'mySite')
  link(:global_list, id: 'global')

  list_item(:all, id: 'all')
  list_item(:clinics, id: 'clinics')
  list_item(:wards, id: 'wards')
  div(:patient_search_results, id: 'patient-search-results')

  indexed_property(:list_group, [[:link, :arrow,
                                  { id: 'list-group-item[%s].arrow' },
                                  # id does not exist[:span, :name,
                                  { id: 'list-group-item[%s].name' }],
                                 # id does not exist
                                 [:span, :ssn,
                                  { id: 'list-group-item[%s].ssn' }],
                                 # id does not exist
                                 [:span, :dob,
                                  { id: 'list-group-item_[%s].dob' }],
                                 # id does not exist
                                 [:span, :gender,
                                  { id: 'list-group-item[%s].gender' }]
                                ]
                )
  div(:patient_name, :class => 'patientName')
  # div(:patient_name, :class => 'confirmHeader row')
  div(:confirm_section, id: 'confirmSection')
  button(:confirmation_button, id: 'confirmationButton')
  indexed_property(:column_header, id: 'column_header')

  # My Site Wards

  text_field(:filter_wards, id: 'patientFilterWards') # id does not exist
  indexed_property(:list_wards, id: [[:link, :arrow,
                                      { id: 'list_ward_item[%s].arrow' }],
                                     # id does not exist
                                     [:span, :name,
                                      { id: 'list_ward_item[%s].name' }]
                                    ]
                  )

  # My Site clinics
  text_field(:filter_clinics, id: 'patientFilterClinics') # id does not exist
  button(:past_year_clinicDate, id: 'past-year-clinicDate')
  button(:past_month_clinicDate, id: 'past-month-clinicDate')
  button(:past_week_clinicDate, id: 'past-week-clinicDate')
  button(:yesterday_clinicDate, id: 'yesterday-clinicDate')
  button(:today_clinicDate, id: 'today-clinicDate')
  button(:tomorrow_clinicDate, id: 'tomorrow-clinicDate')

  # Global

  text_field(:global_search_last_name, id: 'globalSearchLastName')
  text_field(:global_search_first_name, id: 'globalSearchFirstName')
  text_field(:global_search_dob, id: 'globalSearchDob')
  text_field(:global_search_ssn, id: 'globalSearchSsn')
  button(:global_search_button, id: 'globalSearchButton')

  # Bottom region
  div(:bottom_region, id: 'bottom-region')
  span(:app_version, id: 'appVersion')

  ###########################################
  # should be uncommented once id is created
  # list is name of list array(list_group)  name = text to br searched
  # def get_index_by_text(name)
  #
  #   # check for a specific patient in the list and set index
  #   list = self.list_group
  #   table_row_count = 0
  #   # element_found = false
  #   puts list[0].name
  #   list-group-item = list[0]
  #   # puts list-group-item
  #   #
  #   # expect(list-group-item.name).to eq (name)
  #   # while list[table_row_count].name? do
  #   #     puts list[table_row_count].name
  #   #     if list[table_row_count].name_element.text == name
  #   #       element_found = true
  #   #       break
  #   #     end
  #   #     table_row_count += 1
  #   # end
  #   #
  #   # unless element_found
  #   #   table_row_count = -1
  #   # end
  #   table_row_count
  # end

  ##########################################
  def go_bottom_region
    bottom_region_element.text
  end

  def goto_cover_sheet_page
    cover_sheer_page = CoverSheetPage.new @browser, true
    # coverSheerPage.waitForLoadingToClear
    # pageLoadWait = Selenium::WebDriver::Wait.new('timeout => 60)
    cover_sheer_page
  end
end
