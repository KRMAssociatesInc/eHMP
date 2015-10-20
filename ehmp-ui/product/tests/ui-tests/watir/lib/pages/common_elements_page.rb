# encoding: utf-8

require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# CommonElements, source for commonly used elements across all applets
class CommonElementsPage
  include PageObject

  # Header region
  div(:patientSearchDiv, id: 'patientSearchButton')
  button(:myWorkspace_btn, css: '.navbar-default #provider-centric-view-nav-header-tab')
  button(:acc_btn, css: '#access-control-coordinator-nav-header-tab')
  a(:eHMPCurrentUser, id: 'eHMP-CurrentUser')
  a(:logoutButton, id: 'logoutButton')
  div(:headerRegion, id: 'header-region')
  unordered_list(:drop_down, class: 'dropdown-menu')
  button(:launch_workspace_manager, id: 'workspace-manager-button')
  span(:patientName, css: '#patientDemographic-patientInfo-detail h6 span')
  text_field(:searchtext, id: 'searchtext')
  button(:submit_btn, id: 'submit')
  div(:search_results,  id: 'search-results-message')
  b(:results, id: 'numberOfResults')
  # CWAD elements
  div(:cwad, id: 'patientDemographic-cwad')
  div(:cwadDetails, id: 'cwad-details')
  h5(:cwadTitle, css: '.cwadContainer-title h5')
  span(:crisisNotesCwad, css: "#patientDemographic-cwad span[data-original-title='Crisis Notes'] span")
  span(:warningsCwad, css: "#patientDemographic-cwad span[data-original-title='Warnings'] span")
  span(:allergiesCwad, css: "#patientDemographic-cwad span[data-original-title='Allergies'] span")
  span(:directivesCwad, css: "#patientDemographic-cwad span[data-original-title='Directives'] span")
  span(:patientFlagCwad, css: "#patientDemographic-cwad span[data-original-title='Patient Flags'] span")

  # specific cwad test elements
  div(:cwadDetailTitle, css: '#cwad-detail-list .cwad-detail:nth-child(1) .cwad-title')

  # New objservation
  div(:patientDemographicNewObservation, id: 'patientDemographic-newObservation')
  div(:newObservation, id: 'new-observation')
  span(:vitalHeader, css: '#patientDemographic-newObservation #addVitals span')
  list_item(:addActiveProblem, css: '#patientDemographic-newObservation #addActiveProblem')
  list_item(:addAllergy, css: '#patientDemographic-newObservation #addAllergy')
  list_item(:addVitals, css: '#patientDemographic-newObservation #addVitals')
  list_item(:addSignature, css: '#patientDemographic-newObservation #addSignature')

  # Bottom region
  div(:patientSyncStatusRegion, id: 'patientSyncStatusRegion')
  span(:syncPatientData, id: 'sync-patient-data')
  span(:refreshPatientData, id: 'refresh-patient-data')
  span(:mySite, css: 'div.patientSyncStatusRegion > div > span:nth-of-type(3)')
  span(:allVA, css: 'div.patientSyncStatusRegion > div > span:nth-of-type(4)')
  span(:dOD, css: 'div.patientSyncStatusRegion > div > span:nth-of-type(5)')
  span(:community, css: 'div.patientSyncStatusRegion > div > span:nth-of-type(6)')
  span(:openSyncModal, id: 'open-sync-modal')
  div(:helpIconLinkRightDown, id: 'helpIconLinkRightDown')
  a(:linkHelpStatusBar, id: 'linkHelp-status_bar')
  span(:appVersion, id: 'appVersion')

  # modal title
  h4(:modalTitle, id: 'mainModalLabel')
  # close modal
  button(:closeModal, id: 'modal-close-button')

  # Common controls in each applet

  # user guide elem
  a(:saveButton, id: 'save_as_pdf')

  def cwad_detail(block, row, column)
    detail_css = "#cwad-detail-list .cwad-detail:nth-child(#{block}) .row:nth-child(#{row}) div:nth-child(#{column})"
    # p "CSS: #{detail_css}"
    self.class.div(:cwadDetail, css: detail_css)
    cwadDetail
  end

  def contains_empty_gist_list?(dataapplet_id)
    self.class.div(:emptyGistList, css: "[data-appletid='#{dataapplet_id}'] .emptyGistList")
    self.emptyGistList?
  end

  def show_filter_button_visible?(appletName)
    self.class.button(:showFilterButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-filter-button')
    self.showFilterButton?
  end

  def click_show_filter_button(appletName)
    self.class.button(:showFilterButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-filter-button')
    showFilterButton
  end

  def retrieve_show_filter_button_element(appletName)
    self.class.button(:showFilterButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-filter-button')
    showFilterButton_element
  end

  def maximize_applet_button_visible?(appletName)
    self.class.button(:expandAppletButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-maximize-button')
    self.expandAppletButton?
  end

  def click_maximize_applet_button(appletName)
    self.class.button(:expandAppletButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-maximize-button')
    expandAppletButton
  end

  def click_minimize_applet_button(appletName)
    self.class.button(:minimizeAppletButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-minimize-button')
    minimizeAppletButton
  end

  def retrieve_maximize_applet_button_element(appletName)
    self.class.button(:expandAppletButton, css: 'div[data-appletid='" #{ appletName } "'] .applet-maximize-button')
    expandAppletButton_element
  end

  def expand_applet_button_element(appletName)
    button_element(css: 'div[data-appletid='" #{ appletName } "'] .applet-maximize-button')
  end

  def minimize_applet_button_element(appletName)
    button_element(css: 'div[data-appletid='" #{ appletName } "'] .applet-minimize-button')
  end

  def write_back_plus_button_element(appletName)
    button_element(css: 'div[data-appletid='" #{ appletName } "'] .applet-add-button')
  end

  def refresh_applet_button_element(dataAppletIdStr)
    # Available methods to be called in Rspec:
    # refresh_applet_button_element.when_visible
    # refresh_applet_button_element.click
    # button_element(:refreshAppletButton, css: 'div[data-appletid="' + dataAppletIdStr + '"] ..applet-refresh-button')
    self.class.button(:refreshAppletButton, css: "div[data-appletid=#{dataAppletIdStr}] .applet-refresh-button")
    refreshAppletButton
  end

  def contains_empty_row?(table_id)
    self.class.element(:emptyRow, :tr, css: "##{table_id} tr.empty")
    emptyRow_element.visible?
  end

  def applet_title_element(appletName)
    span_element(css: 'div[data-appletid='" #{ appletName } "'] .panel-title-label')
  end
end
