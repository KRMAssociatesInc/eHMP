require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_test_page'
require_relative 'common_elements_page'

# Document Base for Medication
class MedicationExpanded < CommonElementsPage
  include PageObject

  def initialize(driver)
    super
    @common_test = CommonTest.new(driver)
    @driver = driver
  end

  span(:screenNm, id: 'screenName')
  button(:refresh, css: '[data-appletid=activeMeds] button.applet-refresh-button')
  button(:filter, id: 'grid-filter-button-activeMeds')
  button(:minimize, css: '.applet-minimize-button')

  text_field(:textfilter, css: '[data-appletid=activeMeds] #input-filter-search')
  span(:community, css: 'div.patientSyncStatusRegion > div > span:nth-of-type(6)')
  elements(:active_med_results, id: 'activeMeds-interventions-gist-items')
  div(:gist_main_info, id: 'gist-main-info')  # name

  div(:name, css:  '#activeMeds-interventions-gist-items #name')
  elements(:descriptionList, :div, css: '#activeMeds-interventions-gist-items #description')
  elements(:medGraphicList, :div, css: '#activeMeds-interventions-gist-items #graphic')
  divs(:filtered_list, css: '[data-appletid=activeMeds] #activeMeds-interventions-gist-items')

  # MEDICATIONS GIST overview elements
  MEDICATIONS = 'activeMeds'
  MEDICATION_GIST_HEADER = 'activeMeds-interventions-gist'
  div(:medGistHeader, id: "#{MEDICATION_GIST_HEADER}")
  div(:medGistHeaderName, css: "##{MEDICATION_GIST_HEADER} #Name-header")
  div(:medGistHeaderDesc, css: "##{MEDICATION_GIST_HEADER} #Description-header")
  div(:medGistHeaderRefills, css: "##{MEDICATION_GIST_HEADER} #Severity-header")
  div(:medGistHeaderChange, css: "##{MEDICATION_GIST_HEADER} #Graphic-header")
  div(:medGistHeaderLast, css: "##{MEDICATION_GIST_HEADER} #Age-header")
  elements(:medGistItems, css: '#activeMeds-interventions-gist-items .gistItemInner')
  a(:detailViewIcon, css: '#activeMeds-interventions-gist-items .toolbarPopover [button-type="detailView-button-toolbar"]')
  h4(:main_modal_label, id: 'mainModalLabel')
  span(:medMaximizeAppletTitle, css: '[data-appletid=medication_review_v2] .panel-title-label')
  div(:outPatientTitle, id: 'medsReviewApplet_mainContentArea_OUTPATIENTMedications_accordion_medication_review_v2')
  div(:inPatientTitle, id: 'medsReviewApplet_mainContentArea_INPATIENTMedications_accordion_medication_review_v2')
  elements(:medicationNameList, :div, css: '#activeMeds-interventions-gist-items #name')
  elements(:medicationCountList, :div, css: '#activeMeds-interventions-gist-items #count')
  h3(:med_status, id: 'status_urn_va_med_9016_9106_5587940')

  def med_gist_applet_finish_loading?
    return true if contains_empty_gist_list? MEDICATIONS
    return true if medGistItems_elements.length > 0
    false
  end

  def verify_sort_ascending?(column_name)
    column_values_array = []

    case column_name
    when 'Medication'
      medicationNameList_elements.each do |row|
        column_values_array << row.text.downcase
      end
    when 'Refills'
      medicationCountList_elements.each do |row|
        column_values_array << row.text.downcase
      end
    end

    if (column_values_array == column_values_array.sort { |x, y| x <=> y })
      return true
    else
      return false
    end
  end

  def verify_sort_descending?(column_name)
    column_values_array = []

    case column_name
    when 'Medication'
      medicationNameList_elements.each do |row|
        column_values_array << row.text.downcase
      end
    when 'Refills'
      medicationCountList_elements.each do |row|
        column_values_array << row.text.downcase
      end
    end

    if (column_values_array == column_values_array.sort { |x, y| y <=> x })
      return true
    else
      return false
    end
  end

  def this_medication_in_list?(medicationName)
    found_the_value = false

    # case column_name
    name_element.when_visible(10)
    medicationNameList_elements.each do |record|
      next unless record.text.strip.include?(medicationName)
      found_the_value = true
      break if found_the_value
    end
    found_the_value
  end

  def this_count_in_list?(count)
    found_the_value = false
    medicationCountList_elements.each do |record|
      next unless record.text.strip.include?(count)
      found_the_value = true
      break if found_the_value
    end
    found_the_value
  end

  def this_description_in_list?(description)
    found_the_value = false
    descriptionList_elements.each do |record|
      next unless record.text.strip.include?(description)
      found_the_value = true
      break if found_the_value
    end
    found_the_value
  end

  def this_geographic_in_list?(geographic)
    found_the_value = false
    medGraphicList_elements.each do |record|
      next unless record.text.strip.include?(geographic)
      found_the_value = true
      break if found_the_value
    end
    found_the_value
  end
end
