require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'common_elements_page'

# AppointmentPage: Page-Object for appointment & visits gist on coversheet page and expanded appointment page
class AppointmentPage < CommonElementsPage
  include PageObject
  # appointments / visits
  APPOINTMENT_TABLE_ID = 'data-grid-appointments'
  element(:appointmentHeaders, :thead, css: "##{APPOINTMENT_TABLE_ID} thead")
  element(:appointmentHeaderDate, :th, id: 'appointments-dateTimeFormatted')
  element(:appointmentHeaderDescription, :th, id: 'appointments-formattedDescription')
  element(:appointmentHeaderLocation, :th, id: 'appointments-locationName')
  element(:appointmentHeaderFacility, :th, id: 'appointments-facilityMoniker')
  table(:appointmentTable, id: "#{APPOINTMENT_TABLE_ID}")
  elements(:appointmentRows, :tr, css: "##{APPOINTMENT_TABLE_ID} tbody tr")
  button(:appointmentVisitHB, id: 'help-button-appointments')

  def appointment_applet_finish_loading?
    return true if contains_empty_row? APPOINTMENT_TABLE_ID
    return true if appointmentRows_elements.length > 0
    false
  end
end
