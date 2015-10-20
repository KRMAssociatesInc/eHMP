require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# Modal pop up page
class ModalPage
  include PageObject

  # Warning modal
  h4(:modalHeader, id: 'newNotesModalLabel')
  p(:modalContent, id: 'notes-visit-selection-text')
  button(:noBttn, id: 'btn-notes-visit-conf-no')
  button(:yesBttn, id: 'btn-notes-visit-conf-yes')

  # Main modal provider
  h4(:mainModalHeader, css: '#mainModalDialog #mainModalLabel')
  div(:providerSelect, id: 'provider-select')
  div(:locationTypeHeadList, id: 'location-typeahead-list')
  a(:visitTabApps, id: 'visit-tab-appts')
  a(:visitTabAdmits, id: 'visit-tab-admits')
  a(:visitTabNew, id: 'visit-tab-new')
  elements(:appts, :li, css: '#visitModal #appts .list-group')
  elements(:admits, :li, css: '#visitModal #admits .list-group')
  elements(:locationsLists, :li, css: '#newVisitForm #location-typeahead-list > ul.list-group')
  text_field(:location, css: '#new-visit #location')
  text_field(:dateVisit, css: '#new-visit #dp-visit')
  text_field(:timeVisit, css: '#new-visit #tp-visit')
  button(:visitCancelBttn, id: 'visitCancelBtn')
  button(:setVisitBttn, id: 'setVisitBtn')

  def get_appointment_row(row, appointmentName)
    list_count = appts_elements.length
    Watir::Wait.until { list_count > 0 }
    appts_elements.each do |record|
      next unless record.text.strip.include?(appointmentName)
      self.class.li(:appointmentRecord, css: '#appts  #location_appointment_' + row.to_s)
      appointmentRecord_element.click
    end
  end

  def get_location_row(locationName)
    # puts locationName
    self.class.elements(:locationsLists, :li, css: '#newVisitForm #location-typeahead-list > ul.list-group')
    total_result = locationsLists_elements.length
    puts total_result

    self.class.li(:locationRecord, css: '#location-typeahead-list [data-name="' + locationName  + '"]')
    locationRecord_element.click
  end

  def proceed_to_confirm
    Watir::Wait.until { setVisitBttn_element.enabled? }
    setVisitBttn
  end

  def enter_date_visit(dateStr)
    # dateStr must be in "mm/dd/yyyy" format
    self.dateVisit = dateStr
  end
end
