require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# Lab Results page object
class OrdersFormPage
  include PageObject
  h4(:order_form_title, id: 'main-workflow-label')
  element(:available_lab_tests_input, :input, id: 'availableLabTests')
  element(:urgency_select, :select,  id: 'urgency')
  element(:collection_date_select, :select,  id: 'collectionDate')
  element(:collection_time_select, :select,  id: 'collectionTime')
  element(:how_often_select, :select, id: 'howOften')
  element(:how_long_select, :input, id: 'howLong')
  element(:collection_sample_select, :select,  id: 'collectionSample')
  element(:collection_type_select, :select,  id: 'collectionType')
  element(:specimen_select, :select,  id: 'specimen')
  button(:close_button, id: 'form-close-btn')
  button(:accept_order, css: 'div.col-xs-1.acceptBtnContainer > div > button')
  button(:x_button, css: 'div.workflow-header > div > div > div.col-md-2.col-xs-2 > button')
  button(:trash_can_button, id: 'form-delete-btn')

  def check_if_order_form_inputs_present
    available_lab_tests_input_element.when_visible
    urgency_select_element.when_visible
    how_often_select_element.when_visible
    how_long_select_element.when_visible
    collection_sample_select_element.when_visible
    collection_type_select_element.when_visible
    specimen_select_element.when_visible
    close_button_element.when_visible
    x_button_element.when_visible
    trash_can_button_element.when_visible
  end
end
