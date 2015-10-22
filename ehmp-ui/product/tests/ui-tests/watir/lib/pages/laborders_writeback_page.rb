require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# LoginPage: Page-Object for root page of site, $BASE/
class LabOrdersWriteBackPage
  include PageObject

  button(:plusButton, css: 'div[data-appletid=orders]>div>div>span.pull-right.right-button-region > div > span:nth-child(2) > span > span > button > span')
  label(:location, css: '#mainModalLabel')
  label(:clinicAppointments, css: '#visit-tab-appts')
  label(:generalMedicine, css: '#location_appointment_0 > span:nth-child(1)')
  span(:generalMedicine, css: '#location_appointment_0 > span:nth-child(1)')
  button(:confirmButton, css: '#setVisitBtn')
  button(:cancelButton, css: '#visitCancelBtn')
  label(:availableLabTestLabel, css: '#top-row-table > div.row.row-buffer.labTests > div.col-md-6.grid-filter > div.col-md-12.gutter > label')
  text_field(:availableLabTestField, css: '#lab-tests-form')
  label(:howOftenLabel, css: '#top-row-table > div.row.row-buffer.labTests > div:nth-child(2) > div:nth-child(1) > label')
  label(:urgencyLabel, css: '#top-row-table > div.row.row-buffer.labTests > div.col-md-6.grid-filter > div:nth-child(2) > label')
  label(:collectionDateTimeLabel, css: '#top-row-table > div.row.row-buffer.labTests > div.col-md-6.grid-filter > div:nth-child(3) > label')
  label(:howLongLabel, css: '<label for="onset-date-select">How Long</label>')
  label(:collectionSampleLabel, css: '#top-row-table > div.col-sm-9 > div.col-md-4.gutter > label')
  label(:collectionTypeLabel, css: '#top-row-table > div.col-sm-9 > div:nth-child(2) > label')
  label(:specimenLabel, css: '#top-row-table > div.col-sm-9 > div:nth-child(3) > label')
  label(:orderPreviewLabel, css: '#top-row-table > div:nth-child(6) > div > label')
  text_field(:availableLabTestField, css: '#lab-tests-form')
  button(:acceptOrderButton, css: '#btn-add-orders-accept')
  button(:cancelOrderButton, css: '#btn-add-orders-cancel')
  button(:closeButton, css: '#modal-header > div > button > span')
  button(:addButton, css: '#btn-add-orders-accept')
  button(:closeButton, css: '#btn-add-orders-cancel')
  #  select_list(:noteTitle, id: 'localTitle')
  #  elements(:noteTitleOptions, :option, css: '#localTitle > option')
  #  textarea(:noteBody, id: 'derivBody')
  h4(:order_form_title, css: '#mainModalLabel')
  element(:available_lab_tests_input, :input, id: 'lab-tests-form')
  element(:frequency_select, :select, id: 'frequency-select')
  element(:frequency_length_select, :input, id: 'frequency-length')
  element(:urgency_select, :select,  id: 'urgency-select')
  element(:collection_date_time_select, :select,  id: 'collection-datetime-select')
  element(:collection_sample_select, :select,  id: 'collection-sample-select')
  element(:collection_type_select, :select,  id: 'collection-type-select')
  element(:specimen_select, :select,  id: 'specimen-select')
  button(:cancel, id: 'btn-add-orders-cancel')
  button(:accept_order, id: 'btn-add-orders-accept')
  button(:close_button, css: '#modal-header > div > button')

  def check_if_order_form_inputs_present
    available_lab_tests_input_element.when_visible
    frequency_select_element.when_visible
    frequency_length_select_element.when_visible
    urgency_select_element.when_visible
    collection_date_time_select_element.when_visible
    collection_sample_select_element.when_visible
    collection_type_select_element.when_visible
    specimen_select_element.when_visible
    cancel_element.when_visible
    accept_order_element.when_visible
    close_button_element.when_visible
  end
end
