require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/vital_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/modal_popup_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/common/ehmp_error_messages'

# @US3669
describe 'F423: f423_add_vitals_respiration_spec.rb', debug: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:overview) { PatientOverview.new(@driver) }
  let(:vital_page) { VitalPage.new(@driver) }
  let(:common_page) { CommonElementsPage.new(@driver) }
  let(:modal_popup_page) { ModalPage.new(@driver) }

  context 'F423,US8587: Validate respiration Form Field' do
    full_patient_name = 'eight,imagepatient'

    it 'When user is viewing data for patient #{full_patient_name}' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible(SMALL_TIMEOUT)
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible(SMALL_TIMEOUT)
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible(MEDIUM_TIMEOUT)
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
    end

    it 'And the user clicks Visit Context ' do
      # common_test.select_visit_info_with_a_location('Comp and Pen', '06/16/1994 14:15')
      # expect(login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
      modal_popup_page.mainModalHeader_element.when_visible(LARGE_TIMEOUT)
      modal_popup_page.get_appointment_row(0, 'Comp and Pen')
      modal_popup_page.proceed_to_confirm
    end

    it 'User enters 45 on Respiration measurement method position in F' do
      respiration = [{ respiration: '10', respiration_method: 'MONITOR', respiration_position: 'LYING' }]
      vital_page.respirationMeasurement_element.when_visible(SMALL_TIMEOUT)
      vital_page.respirationMethod_element.when_visible(SMALL_TIMEOUT)
      vital_page.respirationPosition_element.when_visible(SMALL_TIMEOUT)
      respiration.each do |resp_value|
        vital_page.respirationMeasurement = resp_value[:respiration]
        vital_page.respirationMethod = resp_value[:respiration_method]
        vital_page.respirationPosition = resp_value[:respiration_position]
        vital_page.respirationPosition_element.send_keys :tab
        expect(vital_page.respirationMeasurement).to eq(resp_value[:respiration])
        expect(vital_page.respirationMethod).to eq(resp_value[:respiration_method])
        expect(vital_page.respirationPosition).to eq(resp_value[:respiration_position])
      end
      vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
      vital_page.submitBtn
    end
  end

  context 'F423,US8587: Validate error message respiration Form Field ' do
    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible(SMALL_TIMEOUT)
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible(SMALL_TIMEOUT)
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    it 'User enters 45 on Respiration measurement method position in F' do
      respiration = [{ respiration: '105', respiration_method: 'MONITOR', respiration_position: 'LYING' },
                     { respiration: '-5', respiration_method: 'MONITOR', respiration_position: 'STANDING' }]
      vital_page.respirationMeasurement_element.when_visible(SMALL_TIMEOUT)
      vital_page.respirationMethod_element.when_visible(SMALL_TIMEOUT)
      vital_page.respirationPosition_element.when_visible(SMALL_TIMEOUT)
      respiration.each do |resp_value|
        vital_page.respirationMeasurement = resp_value[:respiration]
        vital_page.respirationPosition_element.send_keys :tab
        vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
        vital_page.submitBtn
        # vital_page.respirationErrorMessage_element.when_visible(SMALL_TIMEOUT)
        expect(vital_page.respirationMeasurement).to eq(resp_value[:respiration])
        expect(vital_page.validate_respiration_value.strip).to eq(RESPIRATION_ERROR)
      end
      vital_page.respirationMeasurement_element.clear
      vital_page.respirationMeasurement = 'abc'
      vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
      vital_page.submitBtn
      vital_page.respirationErrorMessage_element.when_visible(SMALL_TIMEOUT)
      expect(vital_page.validate_respiration_value.strip).to eq(RESPIRATION_NUMERIC_ERROR)
    end
  end
end
