require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# AllergiesGistPage: Page-Object for allergies gist on overview page and expanded allergies page
class AllergiesGistPage < CommonElementsPage
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
  end

  # ALLERGIES
  span(:screenNm, id: 'screenName')
  ALLERGIES = 'allergy_grid'
  ALLERGIES_GIST_HEADER = 'allergy_grid-pill-gist'
  div(:allergyPillGist, id: "#{ALLERGIES_GIST_HEADER}")
  elements(:allergyGistItems, :div, css: '#allergy_grid-pill-gist-items [data-infobutton-class=info-button-pill]')

  ALLERGY_GIST = 'allergy_grid-pill-gist-items'
  div(:allergyGist, id: "#{ALLERGY_GIST}")
  elements(:allergyPills, :div, css: "##{ALLERGY_GIST} [data-infobutton-class=info-button-pill]")
  div(:emptyAllergyGist, css: "##{ALLERGY_GIST} .emptyGistList")

  element(:errorMessage, :span, css: '[data-appletid=allergy_grid] .fa-exclamation-circle')
  # coversheet applet buttons
  button(:refresh_button, css: '[data-appletid=allergy_grid] .applet-refresh-button')
  button(:allergyHB, id: 'help-button-allergy_grid')
  button(:maximize_button, css: '[data-appletid=allergy_grid] .applet-maximize-button')
  button(:filter_button, css: '[data-appletid=allergy_grid] .applet-filter-button')

  # allergy_grid
  ALLERGY_GRID_TABLE_ID = 'data-grid-allergy_grid'
  elements(:rows, :tr, css: "##{ALLERGY_GRID_TABLE_ID} tbody tr.selectable")
  button(:minimize_button, css: '[data-appletid=allergy_grid] .applet-minimize-button')
  # allergy grid headers
  element(:allergenNameHeader, :a, css: '#allergy_grid-summary a')
  element(:standardizedNameHeader, :a, css: '#allergy_grid-standardizedName a')
  element(:reactionHeader, :a, css: '#allergy_grid-reaction a')
  element(:severityHeader, :a, css: '#allergy_grid-acuityName a')
  element(:drugClassHeader, :a, css: '#allergy_grid-drugClassesNames a')
  element(:enteredByHeader, :a, css: '#allergy_grid-originatorName a')
  element(:facilityHeader, :a, css: '#allergy_grid-facilityName a')

  element(:allergenNameSortedAscending, :th, css: '#allergy_grid-summary.ascending')
  element(:standardizedNameHeaderSortedAscending, :th, css: '#allergy_grid-standardizedName.ascending')

  elements(:allergenNameColumnValues, :td, css: "##{ALLERGY_GRID_TABLE_ID} tbody td:nth-child(1)")
  elements(:standardizedNameColumnValues, :td, css: "##{ALLERGY_GRID_TABLE_ID} tbody td:nth-child(2)")
  elements(:facilityColumnValues, :td, css: "##{ALLERGY_GRID_TABLE_ID} tbody td:nth-child(7)")
  a(:detailViewButton, id: 'info-button-sidekick-detailView')

  def allergy_gist_applet_finish_loading?
    return true if contains_empty_gist_list? ALLERGIES
    return true if allergyGistItems_elements.length > 0
    false
  end

  def grid_view_finish_loading?
    return true if contains_empty_row? ALLERGY_GRID_TABLE_ID
    return true if rows_elements.length > 0
    false
  end

  def navigate_to_expanded_allergies
    @driver.goto(BASE_URL + '##allergy-grid-full')
    screenNm_element.when_visible(@default_timeout)
    Watir::Wait.until { screenNm == 'Allergies' }
  end

  def verify_sort_descending(elements)
    column_values_array = []
    elements.each do |row|
      column_values_array << row.text.downcase
    end

    return true if (column_values_array == column_values_array.sort { |x, y| y <=> x })
    false
  end

  def verify_sort_ascending(elements)
    column_values_array = []
    elements.each do |row|
      column_values_array << row.text.downcase
    end

    return true if (column_values_array == column_values_array.sort { |x, y| x <=> y })
    false
  end

  def unique_sites
    sites = Set.new
    facilityColumnValues_elements.each do |facility_element|
      sites.add(facility_element.text)
    end
    sites
  end

  def unique_sites_rows(sites)
    rows = {}
    sites.each do |site|
      xpath = "//table[@id='#{ALLERGY_GRID_TABLE_ID}']/descendant::td[contains(string(), '#{site}')]/ancestor::tr"
      self.class.elements(:siteSpecificRows, :tr, xpath: xpath)
      rows[site] = siteSpecificRows_elements[0].id
    end
    rows
  end

  def get_cell_data(row_id, td_index)
    css = "##{ALLERGY_GRID_TABLE_ID} ##{row_id} td:nth-child(#{td_index})"
    self.class.element(:cell, :td, css: css)
    cell_element.text
  end

  def get_comment(row_id)
    css = "##{ALLERGY_GRID_TABLE_ID} ##{row_id} td:nth-child(8) span"
    self.class.element(:cell, :span, css: css)
    cell_element.class_name
  end
end
