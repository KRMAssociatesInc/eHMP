require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_test_page'
require_relative 'common_elements_page'
require_relative '../common/ehmp_constants.rb'

# LabResultsExpanded
class LabResultsExpanded < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @common_test = CommonTest.new(driver)
    @driver = driver
  end

  APPLET_ID = 'lab_results_grid'
  span(:screenNm, id: 'screenName')
  span(:title, css: "[data-appletid=#{APPLET_ID}] .panel-title-label")
  button(:refresh, css: '[data-appletid=lab_results_grid] button.applet-refresh-button')
  button(:filter, id: 'grid-filter-button-lab_results_grid')
  button(:minimize, css: '.applet-minimize-button')

  text_field(:textfilter, css: "[data-appletid=#{APPLET_ID}] #input-filter-search")
  div(:daterangefilter, css: "[data-appletid=#{APPLET_ID}] .grid-filter-daterange")
  button(:allDateFilter, id: 'all-range-lab_results_grid')
  button(:filter_2yr, id: '2yr-range-lab_results_grid')
  button(:filter_1yr, id: '1yr-range-lab_results_grid')
  button(:filter_3mo, id: '3mo-range-lab_results_grid')
  button(:filter_1mo, id: '1mo-range-lab_results_grid')
  button(:filter_7d, id: '7d-range-lab_results_grid')
  button(:filter_72hr, id: '72hr-range-lab_results_grid')
  button(:filter_24hr, id: '24hr-range-lab_results_grid')
  text_field(:fromDate, id: 'filter-from-date-lab_results_grid')
  text_field(:toDate, id: 'filter-to-date-lab_results_grid')
  button(:apply, id: 'custom-range-apply-lab_results_grid')

  element(:emptyRow, :tr, css: '#data-grid-lab_results_grid tr.empty')
  elements(:labResults, :tr, css: '#data-grid-lab_results_grid tbody tr')
  elements(:labTestColumn, :td, css: '#data-grid-lab_results_grid td:nth-child(2)')
  elements(:dateColumn, :td, css: '#data-grid-lab_results_grid td:nth-child(1)')
  elements(:facilityColumn, :td, css: '#data-grid-lab_results_grid td:nth-child(7)')
  elements(:resultColumn, :td, css: '#data-grid-lab_results_grid td:nth-child(4)')
  elements(:refRangeColumn, :td, css: '#data-grid-lab_results_grid td:nth-child(6)')

  elements(:coversheetFlagColumn, :td, css: '#data-grid-lab_results_grid td:nth-child(3)')

  table(:labResultsTable, css: '#data-grid-lab_results_grid')

  # headers
  a(:dateHeader, css: '#lab_results_grid-observed a')
  a(:labTestHeader, css: '#lab_results_grid-typeName a')
  a(:flagHeader, css: '#lab_results_grid-flag a')
  element(:sortedAscendFlagHeader, :th, css: '#lab_results_grid-flag.ascending')
  element(:sortedDesendFlagHeader, :th, css: '#lab_results_grid-flag.descending')
  a(:resultHeader, css: '#lab_results_grid-result a')
  a(:unitHeader, css: '#lab_results_grid-units a')
  a(:refRangeHeader, css: '#lab_results_grid-referenceRange a')
  a(:facilityHeader, css: '#lab_results_grid-facilityMoniker a')

  # row tool bar
  a(:openDetailView, id: 'info-button-sidekick-detailView')

  # specific rows
  element(:TRIGLYCERIDESERUM_9E7A, :tr, id: 'urn-va-lab-9E7A-253-CH-6899693-88-47')
  element(:HEMOGLOBIN_A1CBLOOD_9E7A, :tr, id: 'urn-va-lab-9E7A-253-CH-6899693-9-462')
  element(:PANEL_9E7A, :tr, id: 'COAGPROFILEBLOODPLASMAWCLB2987_urn-va-accession-9E7A-253-CH-6939397-7644')
  element(:PANEL_10108_2988, :tr, id: 'COAGPROFILEBLOODPLASMAWCLB2988_urn-va-accession-9E7A-3-CH-6939397-7644')
  element(:PANEL_DETAIL_ROW, :tr, css: "[data-infobutton='PROTIME - PLASMA']")
  element(:PANEL_9E7A_detail, :td, id: 'details-COAGPROFILEBLOODPLASMAWCLB2987_urnvaaccession9E7A253CH69393977644')
  element(:NONPANEL_ROW, :tr, id: 'urn-va-lab-9E7A-3-MI-6849795-877557')
  element(:NONPANEL_C877_LDL_CHOLESTEROL, :tr, id: 'urn-va-lab-C877-3-CH-6929683-925491-291')
  element(:BCMA_HEP_C_ANTIBODY_BLOOD, :tr, id: 'urn-va-lab-9E7A-100022-CH-6929469-848386-500009')

  # lab result modal
  div(:labResultModal, id: 'mainModalDialog')
  button(:modalCloseButton, id: 'modal-close-button')
  element(:modalTitle, :h4, id: 'mainModalLabel')
  div(:highChart, css: '#chart-container .highcharts-container')
  button(:previous_button, id: 'labss-previous')
  button(:next_button, id: 'labss-next')
  button(:dataDismiss, css: "[data-dismiss='modal']")
  text_field(:modalFilterFromDate, id: 'filter-from-date')
  text_field(:modalFilterToDate, id: 'filter-to-date')
  button(:modalAllRange, id: 'all-range')
  button(:modal2yrRange, id: '2yr-range')
  button(:modal1yrRange, id: '1yr-range')
  button(:modal3moRange, id: '3mo-range')
  button(:modal1moRange, id: '1mo-range')
  button(:modal7dRange, id: '7d-range')
  button(:modal72hrRange, id: '72hr-range')
  button(:modal24hrRange, id: '24hr-range')
  div(:labHistoryGraph, id: 'lr-graph')
  # Lab result modal detail headers
  element(:detailDateHeader, :th, css: 'thead #date')
  element(:detailLabTestHeader, :th, css: 'thead #lab-test')
  element(:detailFlagHeader, :th, css: 'thead #flag')
  element(:detailResultHeader, :th, css: 'thead #result')
  element(:detailUnitHeader, :th, css: 'thead #unit')
  element(:detailRefRangeHeader, :th, css: 'thead #reference-range')
  element(:detailSiteHeader, :th, css: 'thead #site')
  # lab result modal history
  span(:totalTests, css: '#total-tests span')
  element(:labHistoryDateHeader, :th, id: 'lab_results_grid-modalView-observed')
  element(:labHistoryFlagHeader, :th, id: 'lab_results_grid-modalView-flag')
  element(:labHistoryResultHeader, :th, id: 'lab_results_grid-modalView-result')
  element(:labHistorySiteHeader, :th, id: 'lab_results_grid-modalView-facilityMoniker')
  a(:labHistoryPrevious, css: 'div.backgrid-paginator [title=Previous]')
  a(:labHistoryNext, css: 'div.backgrid-paginator [title=Next]')
  elements(:labHistoryDateColumn, :td, css: '#data-grid-lab_results_grid-modalView td:nth-child(1)')
  elements(:labHistoryResultColumn, :td, css: '#data-grid-lab_results_grid-modalView td:nth-child(3)')

  # Lab result modal detail columns
  element(:detailDate, :td, css: 'tbody #date')
  element(:detailLabTest, :td, css: 'tbody #lab-test')
  element(:detailFlag, :td, css: 'tbody #flag')
  element(:detailResult, :td, css: 'tbody #result')
  element(:detailUnit, :td, css: 'tbody #unit')
  element(:detailRefRange, :td, css: 'tbody #reference-range')
  element(:detailSite, :td, css: 'tbody #site')

  button(:modalApply, id: 'custom-range-apply')
  elements(:modalLabResults, :tr, css: '#data-grid-lab_results_grid-modalView tbody tr')
  # data-grid-lab_results_grid-modalView
  element(:emptyModalRow, :tr, css: '#data-grid-lab_results_grid-modalView tr.empty')
  elements(:modalDateColumn, :td, css: '#data-grid-lab_results_grid-modalView tbody td:nth-child(1)')

  def finished_loading
    # p 'finished_loading'
    return true if emptyRow_element.visible?
    return true if labResults_elements.length > 0
    false
  end

  def finished_loading_modal?
    return true if emptyModalRow_element.visible?
    return true if modalLabResults_elements.length > 0
    false
  end

  def contains_data_rows?
    return false if emptyRow_element.visible?
    return true if labResults_elements.length > 0
  end

  def column_contains_substring(columns, substring)
    # p "columns: #{columns.length}"
    (0..columns.length - 1).each do |i|
      text_includes_substring = columns[i].element.text.downcase.include? substring.downcase
      p "#{columns[i].element.text} did not contain substring #{substring}" unless text_includes_substring
      return false unless text_includes_substring
    end
    true
  end

  def table_in_alpha_order(column_index, a_z)
    for_error_message = a_z ? 'is not greater then' : 'is not less then'
    table_id = 'data-grid-lab_results_grid'
    css_string = "##{table_id} tbody td:nth-child(#{column_index})"
    self.class.elements(:rows, :td, css: css_string)
    columns = rows_elements

    p "columns: #{columns.length}"
    # p columns
    p columns[0].element.text

    higher = table_cell_without_panel columns[0].element
    # p "higher: #{higher}"
    (1..columns.length - 1).each do |i|
      lower = table_cell_without_panel columns[i].element
      check_alpha = a_z ? ((higher <=> lower) <= 0) : ((higher <=> lower) >= 0)
      p "#{higher} #{for_error_message} #{lower}" unless check_alpha
      return false unless check_alpha
      higher = lower
    end # loop
    return true
  rescue Watir::Exception::ObsoleteElementError => e
    p "verify_alphabetic_sort: #{e}"
    return false
  end # table_in_alpha_order

  def table_cell_without_panel(element)
    text = element.text
    p "text: #{text}"
    p "start With: #{text.start_with?('Panel')}"
    text = text.slice(6, text.length - 1) if text.start_with?('Panel')
    p text
  end

  def navigate_to_labresults_expanded
    @driver.goto(BASE_URL + '#lab-results-grid-full')
    screenNm_element.when_visible(@dfault_timeout)
    # @common_test.navigate_to_screen('#lab-results-grid-full', 1)
    Watir::Wait.until { screenNm == 'Lab Results' }
    Watir::Wait.until(EXTENDED_TIMEOUT) { finished_loading }
  end

  def view_all_lab_results
    allDateFilter
    Watir::Wait.until { contains_data_rows? }
    # p 'might have to put scroll in'
    # p 'this is a copy paste job'
  end

  def reset_labresults_expanded
    p 'reset labresults'
    navigate_to_labresults_expanded unless screenNm == 'Lab Results'
    close_open_labresult_modal
    clear_filter
    view_all_lab_results
  end

  def close_open_labresult_modal
    p 'close open labresult modal'
    modalCloseButton if labResultModal?
    Watir::Wait.until { labResultModal? == false }
  end

  def clear_filter_and_refresh_applet
    clear_filter
    refresh_applet_button_element(APPLET_ID)
    Watir::Wait.until { finished_loading }
  end

  def clear_filter
    # p 'clear filter'
    filter unless textfilter_element.visible?
    textfilter_element.when_visible
    # textfilter = '' # this line did not work for the lab results expanded filter
    textfilter_string = textfilter
    (0..textfilter_string.length).each do
      textfilter_element.send_keys :backspace
    end
    finished_loading
  end

  def scroll_table
    found_bottom = false
    number_of_attempts = 0
    until found_bottom && number_of_attempts > 2
      count1 =  labResults_elements.length
      # p "scroll row #{count1} into view"
      labResults_elements.last.scroll_into_view
      count2 = labResults_elements.length
      found_bottom = (count1 == count2)
      number_of_attempts = found_bottom ? number_of_attempts + 1 : 0
      sleep 1 if found_bottom
    end
    found_bottom
  end

  def table_sorted_flag_ascending(elements)
    table_sorted_flag elements, true
  end

  def table_sorted_flag_descending(elements)
    table_sorted_flag elements, false
  end

  def table_sorted_flag(elements, ascending)
    flag_hash = {
      'H*' => 1,
      'L*' => 2,
      'H' => 3,
      'L' => 4,
      '' => 5
    }
    last_element_num = flag_hash[elements.first.text]
    coversheetFlagColumn_elements.each do |row|
      # coversheetFlagColumn_elements.each_with_index do |row, index|
      # current_flag = row.text
      # p "#{index}: #{current_flag}"
      current_element_num = flag_hash[row.text]

      check_order = current_element_num >= last_element_num if ascending
      check_order = current_element_num <= last_element_num unless ascending
      return false unless check_order
      last_element_num = current_element_num
    end
    true
  end
end
