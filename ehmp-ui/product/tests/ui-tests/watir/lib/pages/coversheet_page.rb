require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'common_elements_page'

# Coversheet page for $BASE/#cover-sheet
class Coversheet < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end
  TOTAL_APPLETS_ON_SCREEN = 9
  PROBLEM_APPLET = 'problems'
  LAB_RESULTS_GRID_APPLET = 'lab_results_grid'
  VITALS_APPLET = 'vitals'
  ACTIVE_MEDICATION_APPLET = 'activeMeds'
  ALLERGY_GRID_APPLET = 'allergy_grid'
  IMMUNIZATION_APPLET = 'immunizations'
  ORDER_APPLET = 'orders'
  APPOINTMENT_APPLET = 'appointments'
  CH_SUMMARIES = 'ccd_grid'

  # error message icon associated with 'An error has occured'
  elements(:errorMessage, :span, css: '.fa-exclamation-circle')

  span(:screenNm, id: 'screenName')
  div(:labresults_applet, css: '[data-appletid=lab_results_grid]')
  button(:labresults_expand, css: '[data-appletid=lab_results_grid] .applet-maximize-button')
  elements(:applets, :div, css: '#content-region [data-appletid]')

  text_field(:searchField, id: 'searchtext')

  # vitals applet
  VITALS_TABLE_SELECTOR = "[data-appletid='#{VITALS_APPLET}'] .a-table"
  div(:vitalATable, css: "[data-appletid='#{VITALS_APPLET}'] .a-table")
  elements(:vitalGistRows, :div, css: '#grid-panel-vitals tbody tr')
  button(:vitalsHB, id: 'help-button-vitals')

  # active medications applet headers
  ACTIVE_MED_TABLE_ID = 'data-grid-activeMeds'
  element(:activeMedHeaders, :thead, css: '#data-grid-activeMeds thead')
  element(:activeMedHeaderMedication, :th, id: 'activeMeds-summary')
  element(:activeMedHeaderFacility, :th, id: 'activeMeds-facilityMoniker')
  table(:activeMedTable, id: 'data-grid-activeMeds')
  elements(:activeMedRows, :tr, css: '#data-grid-activeMeds tbody tr')
  button(:activeMedsHB, id: 'help-button-activeMeds')
  # lab results
  LAB_RESULTS_TABLE_ID = 'data-grid-lab_results_grid'
  element(:labResultHeaders, :thead, css: "##{LAB_RESULTS_TABLE_ID} thead")
  element(:labResultHeaderDate, :th, id: 'lab_results_grid-observed')
  element(:labResultHeaderTest, :th, id: 'lab_results_grid-typeName')
  element(:labResultHeaderFlag, :th, id: 'lab_results_grid-flag')
  element(:labResultHeaderResult, :th, id: 'lab_results_grid-result')
  table(:labResultTable, id: "#{LAB_RESULTS_TABLE_ID}")
  elements(:labResultRows, :tr, css: "##{LAB_RESULTS_TABLE_ID} tbody tr")
  button(:labResultsHB, id: 'help-button-lab_results_grid')

  # community health summaries
  COMMUNITYHS_TABLE_ID = 'data-grid-ccd_grid'
  element(:chsHeaders, :thead, css: "##{COMMUNITYHS_TABLE_ID} thead")
  element(:chsHeaderDate, :th, id: 'ccd_grid-referenceDateDisplay')
  element(:chsHeaderAuthor, :th, id: 'ccd_grid-authorDisplayName')
  table(:chsTable, id: "#{COMMUNITYHS_TABLE_ID}")
  elements(:chsRows, :tr, css: "##{COMMUNITYHS_TABLE_ID} tbody tr")
  button(:communityHealthSummHB, id: 'help-button-ccd_grid')

  # allergy applet
  ALLERGY_GIST = 'allergy_grid-pill-gist-items'
  div(:allergyGist, id: "#{ALLERGY_GIST}")
  elements(:allergyPills, :div, css: "##{ALLERGY_GIST} [data-infobutton-class=info-button-pill]")
  div(:emptyAllergyGist, css: "##{ALLERGY_GIST} .emptyGistList")
  button(:allergyHB, id: 'help-button-allergy_grid')

  # orders applet
  ORDERS_TABLE_ID = 'data-grid-ccd_grid'
  element(:chsHeaders, :thead, css: "##{COMMUNITYHS_TABLE_ID} thead")
  element(:chsHeaderDate, :th, id: 'ccd_grid-referenceDateDisplay')
  element(:chsHeaderAuthor, :th, id: 'ccd_grid-authorDisplayName')
  table(:chsTable, id: "#{COMMUNITYHS_TABLE_ID}")
  elements(:chsRows, :tr, css: "##{COMMUNITYHS_TABLE_ID} tbody tr")
  button(:communityHealthSummHB, id: 'help-button-ccd_grid')

  def allergy_gist_applet_finish_loading?
    return true if emptyAllergyGist_element.visible?
    return true if allergyPills_elements.length > 0
    false
  end

  def community_health_summaries_applet_finish_loading?
    return true if contains_empty_row? COMMUNITYHS_TABLE_ID
    return true if chsRows_elements.length > 0
    false
  end

  def lab_results_applet_finish_loading?
    return true if contains_empty_row? LAB_RESULTS_TABLE_ID
    return true if labResultRows_elements.length > 0
    false
  end

  def active_med_applet_finish_loading?
    return true if contains_empty_row? ACTIVE_MED_TABLE_ID
    return true if activeMedRows_elements.length > 0
    false
  end

  def vitals_applet_finish_loading?
    return true if vitals_contains_empty_row? VITALS_TABLE_SELECTOR
    return true if vitalGistRows_elements.length > 0
    false
  end

  def contains_empty_row?(table_id)
    self.class.element(:emptyRow, :tr, css: "##{table_id} tr.empty")
    emptyRow_element.visible?
  end

  def vitals_contains_empty_row?(selector)
    self.class.element(:emptyRow, :tr, css: "#{selector} tr.empty")
    emptyRow_element.visible?
  end

  def applet_visible?(dataapplet_id)
    self.class.span(:applet_panel_title, css: "[data-appletid='#{dataapplet_id}'] .panel-title-label")
    self.applet_panel_title?
  end

  def navigate_to_coversheet
    @driver.goto(BASE_URL + '#cover-sheet')
    screenNm_element.when_visible(@default_timeout)
    Watir::Wait.until { screenNm == 'Coversheet' }
    Watir::Wait.until { applets_elements.length == TOTAL_APPLETS_ON_SCREEN }
  end
end
