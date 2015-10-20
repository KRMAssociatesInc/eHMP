require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative '../common/ehmp_constants.rb'

# VitalsGistPage: Page-Object for vitals gist on overview page and expanded vitals gist
class VisitInformationPage
  include PageObject

  # Visit Management elements accesible from overview screen
  button(:addbtnVitals, css: '[data-appletid=vitals] button.applet-add-button')
  button(:addbtnProb, css: '[data-appletid=problems] button.applet-add-button')
  a(:visitApts, id: 'visit-tab-appts')
  a(:visitAdmts, id: 'visit-tab-admits')
  a(:visitNew, id: 'visit-tab-new')
  div(:selVisitInfo, id: 'setVisitContextBtn')
  div(:encounterLoc, id: 'innerVisit')
  button(:visitCan, id: 'visitCancelBtn')
  button(:ok, id: 'ok-btn')
  button(:changeBtn, id: 'add-vital-visit-btn')
  span(:noVisitSet, id: 'text-muted')
  div(:addVisit, id: 'modal-header')
  button(:vitalCan, id: 'btn-add-vital-cancel')
  text_field(:enterLoc, id: 'location')
  text_field(:enterVisDate, id: 'dp-visit')
  div(:selInfo, id: 'selectedInfo')
  text_field(:enterVisTime, id: 'tp-visit')
  checkbox(:histVisit, id: 'visit-historical')
  div(:list, id: 'location-typeahead-list')

  # select the item from list

  div(:list, id: 'location-typeahead-list')
  # h4(:visitInfoHeader, id: 'mainModalLabel')
  h4(:visitInfoHeader, class: 'modal-title')
  span(:displayedEncounterLoc, id: 'encounters-location')

  # From the Visit Information area on the Overivew
  div(:locationInfo, css: '#setVisitContextBtn div div:nth-of-type(1)')
  div(:providerInfo, css: '#setVisitContextBtn div div:nth-of-type(2)')

  # select the item from list
  def click_the_visit_tobe_added(visit_name)
    self.class.elements(:visitInListGroup, :li, class: 'list-group-item')
    visitInListGroup_elements.each do |name|
      next unless name.id.strip.include?(visit_name)
      self.class.li(:visitRecord, id: visit_name)
      visitRecord_element.when_visible(20)
      visitRecord_element.click
      break
    end
  end

  elements(:encounterList, :div, class: 'encGistItem')

  def location_list_column_element(column_seq, row_seq)
    span_element(css: "#selectableTableAppointments a:nth-of-type( #{ row_seq } ) div:nth-of-type( #{ column_seq } ) span")
  end

  def choose_encounter_location(details_name, date_time_str)
    # e.g. date_time_str: 05/21/2000, 09:00
    # Watir::Wait.until(XLARGE_TIMEOUT) { locationList_elements.length > 0 }
    self.class.elements(:locationList, :a, css: '#selectableTableAppointments a')
    self.class.span(:firstLocation, css: '#selectableTableAppointments a:nth-of-type(1) span:nth-of-type(1)')
    j = 1
    until locationList_elements.length > 0
      sleep 1
      j += 1
      break if j > LARGE_TIMEOUT
    end
    firstLocation_element.when_visible(LARGE_TIMEOUT)
    # wait for the first and the last record to load
    location_list_column_element(1, 1).when_visible(XLARGE_TIMEOUT)

    i = 1
    locationList_elements.each do |record|
      # puts 'actual=' + location_list_column_element(1, i).text.strip + ', expected=' + date_time_str
      location_list_column_element(1, i).when_visible(SMALL_TIMEOUT)
      # location_list_column_element(2, i).when_visible(SMALL_TIMEOUT)
      if location_list_column_element(1, i).text.strip == date_time_str && location_list_column_element(2, i).text.strip == details_name
        record.click
        Watir::Wait.until(SMALL_TIMEOUT) { record.attribute('class').include?('active') == true }
        ok
        p 'found'
        return
      end
      i += 1
    end
    p 'No match found.  Returning null.'
    nil
  end
end
