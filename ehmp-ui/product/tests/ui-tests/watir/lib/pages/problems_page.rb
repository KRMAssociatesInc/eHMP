require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# ProblemsPage: Page-Object for problems on coversheet page and expanded appointment page
class ProblemsPage < CommonElementsPage
  include PageObject

  # conditions / problems
  PROBLEMS_TABLE_ID = 'data-grid-problems'
  element(:problemsHeaders, :thead, css: "##{PROBLEMS_TABLE_ID} thead")
  element(:problemsHeaderDescription, :th, id: 'problems-problemText')
  element(:problemsHeaderAcuity, :th, id: 'problems-acuityName')
  table(:problemTable, id: "#{PROBLEMS_TABLE_ID}")
  elements(:problemRows, :tr, css: "##{PROBLEMS_TABLE_ID} tbody tr")
  button(:problemsHB, id: 'help-button-problems')

  def problem_applet_finish_loading?
    return true if contains_empty_row? PROBLEMS_TABLE_ID
    return true if problemRows_elements.length > 0
    false
  end
end
