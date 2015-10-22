require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# Lab Results page object
class LabResultsGistPage
  include PageObject
  span(:labresGistTitle, css: '[data-appletid=lab_results_grid] .panel-title')
  span(:typeHeader, css: '#lab_results_grid-observations-gist #name-header')
  span(:lastHeader, css: '#lab_results_grid-observations-gist #age-header')
  span(:resultHeader, css: '#lab_results_grid-observations-gist #results-header')

  # Lab Results GIST elements accesible from overview screen

  LABRESULTS_HEADER = 'lab_results_grid-observations-gist'
  div(:labResGrid, id: "#{LABRESULTS_HEADER}")
  span(:labresHeaderType, css: "##{LABRESULTS_HEADER} #name-header")
  span(:labresHeaderResult, css: "##{LABRESULTS_HEADER} #results-header")
  span(:labresHeaderLast, css: "##{LABRESULTS_HEADER} #age-header")
  span(:labresHeaderGraph, css: "##{LABRESULTS_HEADER} #graph-header")
  elements(:labresGistItems, :div, css: "##{LABRESULTS_HEADER} .gistItemInner")

  # Lab Results gist name
  div(:nameSEGS, id: 'labs_problem_name_SEGS')
  div(:nameBANDS, id: 'labs_problem_name_BANDS')
  div(:nameLYMPHS, id: 'labs_problem_name_LYMPHS__')
  div(:nameMONOS, id: 'labs_problem_name_MONOS')
  div(:nameEOSINO, id: 'labs_problem_name_EOSINO')
  div(:nameBASO, id: 'labs_problem_name_BASO')
  div(:nameMETA, id: 'labs_problem_name_META')
  div(:namePROS, id: 'labs_problem_name_PROS')
  div(:nameBLASTS, id: 'labs_problem_name_BLASTS')
  div(:nameWBC, id: 'labs_problem_name_NUCLEATED_RBC_100WBC')

  # Lab Results Gist results
  div(:resultSEGS, id: 'labs_problem_result_SEGS')
  div(:resultBANDS, id: 'labs_problem_result_BANDS')
  div(:resultLYMPHS, id: 'labs_problem_result_LYMPHS__')
  div(:resultMONOS, id: 'labs_problem_result_MONOS')
  div(:resultEOSINO, id: 'labs_problem_result_EOSINO')
  div(:resultBASO, id: 'labs_problem_result_BASO')
  div(:resultMETA, id: 'labs_problem_result_META')
  div(:resultMYELO, id: 'labs_problem_result_MYELO')
  div(:resultPROS, id: 'labs_problem_result_PROS')
  div(:resultBLASTS, id: 'labs_problem_result_BLASTS')
  div(:resultWBC, id: 'labs_problem_result_NUCLEATED_RBC_100WBC')

  button(:lab_results_gist_plus_button, css: '#a4fcd86f8715 .applet-add-button.btn.btn-xs.btn-link')
  button(:glucose_result, css: '#observations_GLUCOSE .row.equalHeights.noMargin.border-vertical')
  button(:add_order, css: '#ordersView-button-toolbar')
  button(:lab_results_coversheet_plus_button, css: '#\39 dc9f289d846 .applet-add-button.btn.btn-xs.btn-link')
  def vitals_gist_applet_finish_loading?
    return true if vitalsGistItems_elements.length > 0
    false
  end

  def verify_sort_ascending(column_name)
    column_values_array = []

    case column_name
    when 'Lab Test'
      self.class.elements(:labResultsList, :div, css: '#lab_results_grid-observations-gist-items div.col-sm-12.problem-name')
    else
      fail '**** No function found! Check your script ****'
    end

    labResultsList_elements.each do |row|
      column_values_array << row.text.downcase
    end

    if (column_values_array == column_values_array.sort { |x, y| x <=> y })
      return true
    else
      return false
    end
  end

  def verify_sort_descending(column_name)
    column_values_array = []

    case column_name
    when 'Lab Test'
      self.class.elements(:labResultsList, :div, css: '#lab_results_grid-observations-gist-items div.col-sm-12.problem-name')
    else
      fail '**** No function found! Check your script ****'
    end

    labResultsList_elements.each do |row|
      column_values_array << row.text.downcase
    end

    if (column_values_array == column_values_array.sort { |x, y| y <=> x })
      return true
    else
      return false
    end
  end
end
