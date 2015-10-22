require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# EncountersPage: Page-Object for encounters gist on overview page
class EncountersGistPage
  include PageObject

  span(:encounterGistTitle, css: '[data-appletid=encounters] .panel-title')
  span(:descriptionHeader, css: '#encGistGrid #Description-header')
  span(:lastHeader, css: '#encGistGrid #Age-header')
  span(:HxOccurrenceHeader, css: '#encGistGrid #Event-header')
  div(:visits, css: '.encGistItem #panel--Visits #Visits')
  div(:appointments, css: '.encGistItem #panel--Appointments #Appointments')
  div(:admissions, css: '.encGistItem #panel--Admissions #Admissions')
  div(:procedures, css: '.encGistItem #panel--Procedures #Procedures')
  button(:encounterMaximize, css: '[data-appletid=encounters] .applet-maximize-button')
  span(:encounterMaximizeAppletTitle, css: '[data-appletid=newsfeed] .panel-title-label')
  button(:filterButton, id: 'grid-filter-button-encounters')
  text_field(:filterInput, css: '[data-appletid=encounters] #input-filter-search')
  button(:timelineMinimize, css: '[data-appletid=newsfeed] .applet-minimize-button.btn.btn-xs.btn-link')
  # visits objects page objects
  div(:visitTypeHeader, css: '#encountersVisits-event-gist #name-header')
  div(:visitLastHeader, css: '#encountersVisits-event-gist #count-header2')
  div(:visitHxOccurrenceHeader, css: '#encountersVisits-event-gist #count-header1')
  div(:visitTypeRow1, css: '#encountersVisits-event-gist #event_name_encounters-Visit-GENERALINTERNALMEDICINE')
  div(:visitLastRow1, css: '#encountersVisits-event-gist #time_since_encounters-Visit-GENERALINTERNALMEDICINE')
  div(:visitHxOccurrencRow1, css: '#encountersVisits-event-gist #encounter_count_encounters-Visit-GENERALINTERNALMEDICINE')
  div(:visitTypeRow2, css: '#encountersVisits-event-gist #event_name_encounters-Visit-CARDIOLOGY')
  div(:visitLastRow2, css: '#encountersVisits-event-gist #time_since_encounters-Visit-CARDIOLOGY')
  div(:visitHxOccurrencRow2, css: '#encountersVisits-event-gist #encounter_count_encounters-Visit-CARDIOLOGY')
  #  table(:visitsQuickViewTable, id: 'encounters_tooltip_Visits')
  elements(:visitsTable, :tr, css: '#encounters_tooltip_Visits tbody tr')
  elements(:visitsTableHeaders, :th, css: '#encounters_tooltip_Visits thead tr th')
  elements(:visitTypeTable, :tr, css: '#encounters-Visit-GENERALINTERNALMEDICINE tbody tr')
  elements(:visitTypeTableHeaders, :th, css: '#encounters-Visit-GENERALINTERNALMEDICINE thead tr th')
  div(:visitTypeGeneralInternalMedicine, css: '#event_name_encounters-Visit-GENERALINTERNALMEDICINE')
  a(:quickViewIcon, css: '[data-appletid=encounters] div.toolbarActive #quick-look-button-toolbar')
  a(:detailViewIcon, css: '[data-appletid=encounters] div.toolbarActive #detailView-button-toolbar')
  h4(:modalTitle, id: 'mainModalLabel')
  div(:quickViewTableTitle, css: '.overview .popover-title')

  # ENCOUNTERS GIST elements on overview
  div(:encountersGrid, id: 'encGistGrid')
  div(:encounterVisit, id: 'Visits')
  div(:encounterAppointments, id: 'Appointments')
  div(:encounterAdmissions, id: 'Admissions')
  div(:encounterProcedures, id: 'Procedures')
  elements(:encounterGistItems, :div, css: '.encGistItem')

  def maximize_encounter_gist_view
    encounterMaximize
  end

  def input_into_search_filter_encounter(input_data)
    self.filterInput = input_data
    filterInput_element.send_keys :enter
  end

  def exit_timeline_view
    timelineMinimize
  end

  def expand_object(object_type)
    self.class.span(:encTypeObject, css: '#' + object_type + ' #caret')
    encTypeObject_element.click
  end

  def right_click_object(object_type)
    self.class.div(:encTypeObject, css: '#' + 'button_' + object_type)
    encTypeObject_element.click
  end

  def right_click_object_type(object_type)
    self.class.div(:encTypeObject, css: '#' + 'button_' + object_type)
    encTypeObject_element.click
  end

  def verify_sort_ascending(column_name)
    column_values_array = []

    case column_name
    when 'Visit Type'
      self.class.elements(:visitTypeList, :div, css: '#encountersVisits-event-gist-items div.col-sm-12.problem-name')
    else
      fail '**** No function found! Check your script ****'
    end

    visitTypeList_elements.each do |row|
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
    when 'Visit Type'
      self.class.elements(:visitTypeList, :div, css: '#encountersVisits-event-gist-items div.col-sm-12.problem-name')
    else
      fail '**** No function found! Check your script ****'
    end

    visitTypeList_elements.each do |row|
      column_values_array << row.text.downcase
    end

    if (column_values_array == column_values_array.sort { |x, y| y <=> x })
      return true
    else
      return false
    end
  end

  def encounter_applet_finish_loading?
    return true if encounterGistItems_elements.length > 0
    false
  end
end
