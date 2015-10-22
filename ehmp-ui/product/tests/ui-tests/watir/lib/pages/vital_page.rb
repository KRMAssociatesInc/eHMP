require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# LoginPage: Page-Object for root page of site, $BASE/
class VitalPage
  include PageObject

  text_field(:dateTaken, css: '#date-taken-calendar-container #date-taken')
  text_field(:timeTaken, css: '#date-taken-calendar-container #time-taken')

  checkbox(:pass, id: 'facility-name-pass-po')
  button(:saveCloseBtn, id: 'form-saveAndClose-btn')
  button(:submitBtn, id: 'form-submit-btn')
  button(:cancelBtn, id: 'form-cancel-btn')
  text_field(:facility_name, id: 'facility_name')

  text_field(:blood_pressure, id: 'bpInputValue')
  select_list(:bpLocation, id: 'bp-location-po')
  select_list(:bpMethod, id: 'bp-method-po')
  select_list(:bpPosition, id: 'bp-position-po')
  select_list(:bpCuffsize, id: 'bp-cuff-size-po')
  checkbox(:bpUnavail, id: 'bp-unavailable-po')
  checkbox(:bpRefused, id: 'bp-refused-po')

  text_field(:pulseValue, id: 'pulseInputValue')
  select_list(:pulseLocation, id: 'pulse-location-po')
  select_list(:pulseMethod, id: 'pulse-method-po')
  select_list(:pulsePosition, id: 'pulse-position-po')
  select_list(:pulseSite, id: 'pulse-site-po')
  checkbox(:pulseUnavail, id: 'pulse-unavailable-po')
  checkbox(:pulseRefused, id: 'pulse-refused-po')

  text_field(:respirationMeasurement, id: 'respirationInputValue')
  select_list(:respirationMethod, id: 'respiration-method-po')
  select_list(:respirationPosition, id: 'respiration-position-po')
  checkbox(:respirationUnavail, id: 'respiration-unavailable-po')
  checkbox(:respirationRefused, id: 'respiration-refused-po')

  text_field(:temperature, id: 'temperatureInputValue')
  select_list(:temperatureLocation, id: 'temperature-location-po')
  radio_button(:fahrenheit, id: 'temperatureInputValue-f-radio')
  radio_button(:celsius, id: 'temperatureInputValue-c-radio')
  checkbox(:temperatureUnavail, id: 'temperature-unavailable-po')
  checkbox(:temperatureRefused, id: 'temperature-refused-po')

  text_field(:poMeasurement, id: 'suppO2InputValue')
  text_field(:poConcentration, id: 'O2InputValue')
  select_list(:poMethod, id: 'po-method-po')
  checkbox(:poUnavail, id: 'po-unavailable-po')
  checkbox(:poRefused, id: 'po-refused-po')

  text_field(:hightValue, id: 'heightInputValue')
  select_list(:hight_quality, id: 'heightQuality')
  radio_button(:hightIn, id: 'height-value-po-in-radio')
  radio_button(:hightCm, id: 'height-value-po-cm-radio')
  checkbox(:hightUnavail, id: 'height-unavailable-po')
  checkbox(:hightRefused, id: 'height-refused-po')

  text_field(:weight, id: 'weightInputValue')
  select_list(:weightMethod, id: 'weight-method-po')
  select_list(:weightQuality, id: 'weight-quality-po')
  radio_button(:weightLb, id: 'weight-value-po-lb-radio')
  radio_button(:weightKg, id: 'weight-value-po-kg-radio')
  checkbox(:weightUnavail, id: 'weight-unavailable-po')
  checkbox(:weightRefused, id: 'weight-refused-po')

  text_field(:painInput, id: 'painValueSlider')  # graph?
  checkbox(:painUnavailToResponse, id: 'pain-checkbox-po')
  checkbox(:painUnavail, id: 'pain-unavailable-po')
  checkbox(:painRefused, id: 'pain-refused-po')

  text_field(:circumValue, id: 'circumValue')
  select_list(:site, id: 'cg-site-po')
  select_list(:location, id: 'cg-location-po')
  radio_button(:circumValueIn, id: 'circumValue-in-radio')
  radio_button(:circumValueCm, id: 'circumValue-cm-radio')
  checkbox(:circumUnavail, id: 'cg-unavailable-po')
  checkbox(:circumrRefused, id: 'cg-refused-po')

  div(:alertRegion, id: 'alert-region')
  div(:dateTakenCalendarContainer, id: 'date-taken-calendar-container')
  p(:alertMessage, css: '#alert-region p')
  button(:cancelAlertBttn, css: '#alert-region p.alert-buttons > div:nth-of-type(1) > .btn')
  button(:continuelAlertBttn, css: '#alert-region p.alert-buttons > div:nth-of-type(2) > .btn')
  # span(:bpErrorMessage, css: 'control.form-group.bpInputValue.col-xs-6.has-error > .help-block error')
  span(:bpErrorMessage, css: '.bpInputValue .help-block.error')
  span(:pulseErrorMessage, css: '.pulseInputValue .help-block.error')
  span(:respirationErrorMessage, css: '.respirationInputValue .help-block.error')
  span(:temperatureErrorMessage, css: '.temperatureInputValue .help-block.error')
  span(:suppO2ErrorMessage, css: '.suppO2InputValue .help-block.error')
  span(:O2ErrorMessage, css: '.O2InputValue .help-block.error')
  span(:heightErrorMessage, css: '.heightInputValue .help-block.error')
  span(:weightErrorMessage, css: '.weightInputValue .help-block.error')
  # span(:bpErrorMessage, css: '.weightInputValue .help-block.error')

  # def validate_circumValue
  #   error = circumValue_element.attribute(title)
  #   if circumValue_element.attribute(title).length > 0
  #     return circumValue_element.attribute(title)
  #   end
  #   return error
  # end

  def validate_bp_value
    bpErrorMessage_element.when_visible
    bpErrorMessage
  end

  def validate_pulse_value
    pulseErrorMessage_element.when_visible
    pulseErrorMessage
  end

  def validate_respiration_value
    respirationErrorMessage_element.when_visible
    respirationErrorMessage
  end

  def validate_temperature_value
    temperatureErrorMessage_element.when_visible
    temperatureErrorMessage
  end

  def validate_suppo2_value
    suppO2ErrorMessage_element.when_visible
    suppO2ErrorMessage
  end

  def validate_o2_value
    O2ErrorMessage_element.when_visible
    O2ErrorMessage
  end

  def validate_height_value
    heightErrorMessage_element.when_visible
    heightErrorMessage
  end

  def validate_weight_value
    weightErrorMessage_element.when_visible
    weightErrorMessage
  end

  def enter_date_taken(dateStr)
    Watir::Wait.until { dateTakenCalendarContainer_element.when_visible? }
    self.dateTaken = dateStr
    dateTaken_element.send_keys :tab
  end
end
