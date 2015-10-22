require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# ConditionsGistPage: Page-Object for conditions gist on overview page and expanded conditions gist
class ConditionsGistPage < CommonElementsPage
  include PageObject

  # CONDITIONS GIST
  CONDITIONS = 'problems'
  div(:conditionsGrid, id: 'eventGistGrid')
  div(:conditionsHeaderName, id: 'name-header')
  div(:conditionsHeaderAcuity, id: 'comment-header')
  div(:conditionsHeaderLast, id: 'count-header2')
  div(:conditionsHeaderHxOccur, id: 'count-header1')
  div(:conditionsHeaderGraph, id: 'graph-header')
  elements(:conditionsGistItems, :div, css: '#problems-event-gist-items .gistItemInner')
  span(:conditionsGistTitle, css: '[data-appletid=problems] .panel-title')
  div(:manicProblem, id: 'quickLook_urn_va_problem_9E7A_711_141')
  div(:essenProblem, id: 'quickLook_urn_va_problem_9E7A_711_79')
  elements(:probQuickViewTable, :tr, css: '#urn_va_problem_9E7A_711_141 tbody tr')
  elements(:probQuickViewTableHeaders, :th, css: '#urn_va_problem_9E7A_711_141 thead tr th')
  #  elements(:probQuickViewTable, :tr, css: '#urn_va_problem_9E7A_711_79 tbody tr')
  #  elements(:probQuickViewTableHeaders, :th, css: '#urn_va_problem_9E7A_711_79 thead tr th')
  div(:essentialHypertensionProblem, id: 'event_name_urn_va_problem_9E7A_711_79')
  element(:ciwIcon, :i, css: '#problems-event-gist-items div.toolbarActive [button-type=submenu-button-toolbar] i')
  link(:workspace1Link, css: 'a[href="#user-defined-workspace-1"]')
  link(:workspace2Link, css: 'a[href="#user-defined-workspace-2"]')
  element(:popup, :tr, css: '#urn_va_problem_9E7A_711_141 > thead > tr')
  div(:manicProblemLeftClick, id: 'event_name_urn_va_problem_9E7A_711_141')
  link(:detailsViewButton, css: '[data-appletid=problems] #problems-event-gist-items div.toolbarActive [button-type=detailView-button-toolbar]')
  link(:quickViewButton, css: '[data-appletid=problems] #problems-event-gist-items div.toolbarActive [button-type=quick-look-button-toolbar]')

  button(:filter, id: 'grid-filter-button-problems')
  text_field(:filterText, css: '#grid-filter-problems #input-filter-search')
  elements(:problemRows, :div, css: '#problems-event-gist-items .gistItemInner')
  elements(:acuityColumnValues, :div, css: '.eventsAcuity')
  def conditions_applet_finish_loading?
    return true if contains_empty_gist_list? CONDITIONS
    return true if conditionsGistItems_elements.length > 0
    false
  end

  def quickview_table_finish_loading?
    return true if contains_empty_row? 'urn_va_problem_9E7A_711_141'
    return true if probQuickViewTable_elements.length > 0
    false
  end

  def filtered?(expected_column, filter_text, display_error_msgs = true)
    # first check specific column for filter_text
    indexes = columns_that_do_not_contain_substring(expected_column, filter_text)
    return true if indexes.length == 0

    # check the rows that did not have the filter_text in the specific column just in case
    # the filter applied to more then 1 column
    indexes.each do |i|
      self.class.elements(:allColumnsInRow, :td, xpath: "//div[@id='problems-event-gist']/descendant::div[contains(@class, 'gistItemInner')][#{i + 1}]/descendant::div")
      return false unless row_contains_substring(allColumnsInRow_elements, filter_text, display_error_msgs)
    end
    true
  end

  def row_contains_substring(columns, substring, display_error_msgs)
    error_msg = []
    (0..columns.length - 1).each do |i|
      text_includes_substring = columns[i].element.text.downcase.include? substring.downcase
      error_msg.push(columns[i].element.text)
      return true if text_includes_substring
    end
    p "The columns did not contain expected filter value '#{substring}': #{error_msg}" if display_error_msgs
    false
  end

  def columns_that_do_not_contain_substring(columns, substring)
    indexes = []
    (0..columns.length - 1).each_with_index do |i, index|
      # p columns[i].element.text.downcase
      text_includes_substring = columns[i].element.text.downcase.include? substring.downcase
      indexes.push(index) unless text_includes_substring
    end
    indexes
  end
end
