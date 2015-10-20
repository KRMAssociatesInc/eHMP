require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# require_relative 'common_elements'

# PatientOveriew page for $BASE/#overview
class PatientOverview < CommonElementsPage
  include PageObject

  span(:oVDoB, id: 'patientDemographic-patientInfo-dob')
  span(:oVSsn, id: 'patientDemographic-patientInfo-ssn')
  span(:oVGender, id: 'patientDemographic-patientInfo-gender')
  span(:screenNm, id: 'screenName')
  list_item(:coverSheetDropMenu, class: 'cover-sheet-button')
  button(:patientSearchButton, id: 'patientSearchButton')
  div(:active_meds_applet, css: '[data-appletid=activeMeds]')

  # information under the patient name drop down screen
  element(:patientNameDropDown, :i, css: '.media-body .fa-caret-right')
  div(:patientHomePhone, id: 'demo-home-phone-val')
  div(:patientAddrLine1, id: 'demo-haddress-line1')
  div(:patientAddrLine2, id: 'demo-haddress-line4')

  # observation button and notes button
  div(:newObservationBttn, id: 'new-observation')

  # error message icon associated with 'An error has occured'
  elements(:errorMessage, :span, css: '.fa-exclamation-circle')

  # element( :coverSheetDropMenu, "a[href='#cover-sheet']"
  # span(:screenNm, id: 'screenName')
  elements(:applets, :div, css: '[data-appletid]')
  TOTAL_APPLETS_ON_SCREEN = 9
  CLINICAL_REMINDERS = 'cds_advice'
  CONDITIONS = 'problems'
  IMMUNIZATIONS = 'immunizations'
  ENCOUNTERS = 'encounters'
  MEDICATIONS = 'activeMeds'
  ALLERGIES = 'allergy_grid'
  REPORTS = 'reports'
  VITALS = 'vitals'
  LAB_RESULTS = 'lab_results_grid'

  # active medications applet headers
  div(:activeMedMedicationHeader, css: '#activeMeds #Name-header')
  div(:activeMedRefillHeader, css: '#activeMeds #Severity-header')
  div(:activeMedChangeHeader, css: '#activeMeds #Graphic-header')
  div(:activeMedLastHeader, css: '#activeMeds #Age-header')

  # CLINICAL REMINDERS
  # CLINICAL_REMINDERS_TABLE_ID = 'data-grid-cds_advice'
  # element(:crHeaders, :thead, css: "##{CLINICAL_REMINDERS_TABLE_ID} thead")
  # element(:crHeaderPriority, :th, id: 'cds_advice-undefined')
  # element(:crHeaderTitle, :th, id: 'cds_advice-title')
  # element(:crHeaderType, :th, id: 'cds_advice-typeText')
  # element(:crHeaderDueDate, :th, id: 'cds_advice-dueDateFormatted')
  # table(:crTable, id: "#{CLINICAL_REMINDERS_TABLE_ID}")
  # elements(:crRows, :tr, css: "##{CLINICAL_REMINDERS_TABLE_ID} tbody tr")

  # LAB RESULTS
  LAB_RESULTS_GIST_HEADER = 'lab_results_grid-observations-gist'
  div(:labResultHeader, id: "#{LAB_RESULTS_GIST_HEADER}")
  span(:labResultHeaderName, css: "##{LAB_RESULTS_GIST_HEADER} #name-header")
  span(:labResultHeaderResult, css: "##{LAB_RESULTS_GIST_HEADER} #results-header")
  span(:labResultHeaderLast, css: "##{LAB_RESULTS_GIST_HEADER} #age-header")
  elements(:labResultsGistItems, :div, css: '#lab_results_grid-observations-gist-items .gistItemInner')

  # Online Help Buttons
  button(:clinicaRemindersHB, id: 'help-button-cds_advice')
  button(:problemsHB, id: 'help-button-problems')
  button(:immunizationsHB, id: 'help-button-immunizations')
  button(:encountersHB, id: 'help-button-encounters')
  button(:activeMedsHB, id: 'help-button-activeMeds')
  button(:allergyHB, id: 'help-button-allergy_grid')
  button(:reportsHB, id: 'help-button-reports')
  button(:vitalsHB, id: 'help-button-vitals')
  button(:labResultsHB, id: 'help-button-lab_results_grid')

  ############ local functions ##################
  def initialize(driver)
    super
    @driver = driver
  end

  def navigate_to_overview
    @driver.goto(BASE_URL + '#overview')
    screenNm_element.when_visible(@default_timeout)
    Watir::Wait.until { screenNm == 'Overview' }
    Watir::Wait.until { applets_elements.length == TOTAL_APPLETS_ON_SCREEN }
  end

  def applet_visible?(dataapplet_id)
    # p "applet_visible? [data-appletid='#{dataapplet_id}'] .panel-title-label"
    self.class.span(:applet_panel_title, css: "[data-appletid='#{dataapplet_id}'] .panel-title-label")
    self.applet_panel_title?
  end

  def labresults_gist_applet_finish_loading?
    return true if contains_empty_gist_list? LAB_RESULTS
    return true if labResultsGistItems_elements.length > 0
    false
  end
end
