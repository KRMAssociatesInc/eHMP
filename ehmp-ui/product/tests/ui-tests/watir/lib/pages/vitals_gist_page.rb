require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# VitalsGistPage: Page-Object for vitals gist on overview page and expanded vitals gist
class VitalsGistPage
  include PageObject

  span(:vitalsGistTitle, css: '[data-appletid=vitals] .panel-title')
  span(:typeHeader, css: '#vitals-observations-gist #name-header')
  span(:lastHeader, css: '#vitals-observations-gist #age-header')
  span(:resultHeader, css: '#vitals-observations-gist #results-header')

  # VITALS GIST elements accesible from overview screen
  VITALS_HEADER = 'vitals-observations-gist'
  div(:vitalsGrid, id: "#{VITALS_HEADER}")
  span(:vitalsHeaderType, css: "##{VITALS_HEADER} #name-header")
  span(:vitalsHeaderResult, css: "##{VITALS_HEADER} #results-header")
  span(:vitalsHeaderLast, css: "##{VITALS_HEADER} #age-header")
  span(:vitalsHeaderGraph, css: "##{VITALS_HEADER} #graph-header")
  elements(:vitalsGistItems, :div, css: "##{VITALS_HEADER} .gistItemInner")

  # Vitals gist name
  div(:nameBPS, id: 'vitals_problem_name_BPS')
  div(:nameBPD, id: 'vitals_problem_name_BPD')
  div(:nameP, id: 'vitals_problem_name_P')
  div(:nameR, id: 'vitals_problem_name_R')
  div(:nameT, id: 'vitals_problem_name_T')
  div(:nameSPO, id: 'vitals_problem_name_PO2')
  div(:namePN, id: 'vitals_problem_name_PN')
  div(:nameWT, id: 'vitals_problem_name_WT')
  div(:nameHT, id: 'vitals_problem_name_HT')
  div(:nameBMI, id: 'vitals_problem_name_BMI')

  # Vitals Gist results
  div(:resultBPS, id: 'vitals_problem_result_BPS')
  div(:resultBPD, id: 'vitals_problem_result_BPD')
  div(:resultP, id: 'vitals_problem_result_P')
  div(:resultR, id: 'vitals_problem_result_R')
  div(:resultT, id: 'vitals_problem_result_T')
  div(:resultSPO, id: 'vitals_problem_result_PO2')
  div(:resultPN, id: 'vitals_problem_result_PN')
  div(:resultWT, id: 'vitals_problem_result_WT')
  div(:resultHT, id: 'vitals_problem_result_HT')
  div(:resultBMI, id: 'vitals_problem_result_BMI')

  def vitals_gist_applet_finish_loading?
    return true if vitalsGistItems_elements.length > 0
    false
  end

  def verify_sort_ascending(column_name)
    column_values_array = []

    case column_name
    when 'Type'
      self.class.elements(:vitalsList, :div, css: '#vitals-observations-gist-items div.col-sm-12.problem-name')
    else
      fail '**** No function found! Check your script ****'
    end

    vitalsList_elements.each do |row|
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
    when 'Type'
      self.class.elements(:vitalsList, :div, css: '#vitals-observations-gist-items div.col-sm-12.problem-name')
    else
      fail '**** No function found! Check your script ****'
    end

    vitalsList_elements.each do |row|
      column_values_array << row.text.downcase
    end

    if (column_values_array == column_values_array.sort { |x, y| y <=> x })
      return true
    else
      return false
    end
  end
end
