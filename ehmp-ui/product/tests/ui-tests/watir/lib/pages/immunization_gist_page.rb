require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# ImmunizationGistPage: Page-Object for immunization gist on overview page and expanded immunization gist
class ImmunizationGistPage < CommonElementsPage
  include PageObject

  # IMMUNIZATIONS
  IMMUNIZATIONS = 'immunizations'
  IMMUNIZATIONS_GIST_HEADER = 'immunizations-pill-gist'
  div(:immPillGist, id: "#{IMMUNIZATIONS_GIST_HEADER}")
  elements(:immGistItems, :div, css: '#immunizations-pill-gist-items .gistItem')
  elements(:immPills, :div, css: '[data-appletid=immunizations] [data-infobutton-class=info-button-pill]')

  # immunizations coversheet items
  IMMUNIZATION_TABLE_ID = 'data-grid-immunizations'
  element(:immHeaders, :thead, css: "##{IMMUNIZATION_TABLE_ID} thead")
  element(:immHeaderVacName, :th, id: 'immunizations-name')
  element(:immHeaderReaction, :th, id: 'immunizations-reactionName')
  element(:immHeaderDate, :th, id: 'immunizations-administeredFormatted')
  element(:immHeaderFacility, :th, id: 'immunizations-facilityMoniker')
  table(:immTable, id: "#{IMMUNIZATION_TABLE_ID}")
  elements(:immRows, :tr, css: "##{IMMUNIZATION_TABLE_ID} tbody tr")
  button(:immunizationsHB, id: 'help-button-immunizations')

  def immunization_gist_applet_finish_loading?
    return true if contains_empty_gist_list? IMMUNIZATIONS
    return true if immGistItems_elements.length > 0
    false
  end

  def immunization_applet_table_finish_loading?
    return true if contains_empty_row? IMMUNIZATION_TABLE_ID
    return true if immRows_elements.length > 0
  end

  span(:immunizationGistTitle, css: '[data-appletid=immunizations] .panel-title')
  div(:pillHebB, id: 'pill-gist-popover-urn:va:immunization:9E7A:301:36')
  #  div(:pillPneumococcal, id: 'pill-gist-popover-urn:va:immunization:ABCD:229:44')
  div(:pillPneumococcal, css: "[data-infobutton='PNEUMOCOCCAL']")
  div(:pillInfluenza, id: 'pill-gist-popover-urn:va:immunization:9E7A:301:17')
  div(:pillDtp, id: 'pill-gist-popover-urn:va:immunization:9E7A:301:16')
  div(:pillPneumococcalUnspecified, id: 'pill-gist-popover-urn:va:immunization:9E7A:301:37')
  a(:detailViewIcon, id: 'info-button-sidekick-detailView')
  button(:immuneMaximize, css: '[data-appletid=immunizations] .applet-maximize-button')
  span(:immuneMaximizeAppletTitle, css: '[data-appletid=immunizations] .panel-title-label')
  button(:immuneMinimize, css: '[data-appletid=immunizations] .applet-minimize-button.btn.btn-xs.btn-link')
  elements(:immuneTable, :tr, css: '#data-grid-immunizations tbody tr')
  button(:filterButton, id: 'grid-filter-button-immunizations')
  text_field(:filterInput, css: '[data-appletid=immunizations] #input-filter-search')
  elements(:immuneQuickLookTableHeaders, :th, xpath: "//table[@id='urn:va:immunization:ABCD:229:44']/descendant::th")
  elements(:immuneQuickLookTable, :tr, xpath: "//table[@id='urn:va:immunization:ABCD:229:44']/tbody/descendant::tr")

  def input_into_search_filter_immune_gist(input_data)
    self.filterInput = input_data
    filterInput_element.send_keys :enter
  end

  def immunization_table_finish_loading?
    return true if immuneTable_elements.length > 0
    false
  end

  def immunization_quick_view_table_finish_loading?
    return true if immuneQuickLookTable_elements.length > 0
    false
  end
end
