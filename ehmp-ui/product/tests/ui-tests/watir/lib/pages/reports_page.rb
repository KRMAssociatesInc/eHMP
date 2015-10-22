require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# ReportsPage: Page-Object for reports on overview page and expanded reports page
class ReportsPage < CommonElementsPage
  include PageObject
  # REPORTS
  REPORTS_TABLE_ID = 'data-grid-reports'
  element(:reportHeaders, :thead, css: "##{REPORTS_TABLE_ID} thead")
  element(:reportHeaderDate, :th, id: 'reports-dateDisplay')
  element(:reportHeaderType, :th, id: 'reports-kind')
  element(:reportHeaderEnteredBy, :th, id: 'reports-authorDisplayName')
  table(:reportTable, id: "#{REPORTS_TABLE_ID}")
  elements(:reportRows, :tr, css: "##{REPORTS_TABLE_ID} tbody tr")
  elements(:data_reportRows, :tr, css: "##{REPORTS_TABLE_ID} tbody tr.selectable")

  # filter
  button(:show_filter, id: 'grid-filter-button-reports')
  text_field(:filter_on, css: '[data-instanceid=reports] #input-filter-search')
  elements(:typeColumn, :td, css: '#data-grid-reports tr.selectable td:nth-child(2)')

  def report_applet_finish_loading?
    return true if contains_empty_row? REPORTS_TABLE_ID
    return true if reportRows_elements.length > 0
    false
  end

  def filtered?(expected_column, filter_text)
    # first check specific column for filter_text
    indexes = columns_that_do_not_contain_substring(expected_column, filter_text)
    return true if indexes.length == 0

    # check the rows that did not have the filter_text in the specific column just in case
    # the filter applied to more then 1 column
    indexes.each do |i|
      self.class.elements(:allColumnsInRow, :td, xpath: "//*[@id='data-grid-reports']/tbody/descendant::tr[contains(@class, 'selectable')][#{i + 1}]/td")
      return false unless row_contains_substring(allColumnsInRow_elements, filter_text)
    end
    true
  end

  def row_contains_substring(columns, substring)
    error_msg = []
    (0..columns.length - 1).each do |i|
      text_includes_substring = columns[i].element.text.downcase.include? substring.downcase
      error_msg.push(columns[i].element.text)
      return true if text_includes_substring
    end
    p "The columns did not contain expected filter value '#{substring}': #{error_msg}"
    false
  end

  def columns_that_do_not_contain_substring(columns, substring)
    indexes = []
    (0..columns.length - 1).each_with_index do |i, index|
      text_includes_substring = columns[i].element.text.downcase.include? substring.downcase
      indexes.push(index) unless text_includes_substring
    end
    indexes
  end
end
