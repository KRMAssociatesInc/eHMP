require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/vital_page'
require_relative '../lib/pages/modal_popup_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/common/ehmp_error_messages'

# @US3669
describe 'F423: f423_add_vitals_circum_girth_spec.rb', debug: true do
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

  context 'F423,US6473: Validate Circumference/girth Form Field maxmum in inches' do
    full_patient_name = 'eight,imagepatient'

    it 'When user is viewing data for patient #{full_patient_name}' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
    end

    it 'And the user clicks on Modal Popup Page ' do
      modal_popup_page.mainModalHeader_element.when_visible
      modal_popup_page.get_appointment_row(0, 'Comp and Pen')
      modal_popup_page.proceed_to_confirm
    end

    it 'User enters 200 on Circumference/girth maxmum in Inches' do
      circumference = [{ value: '200', site: 'LEFT', location: 'OTHER' }]
      vital_page.site_element.when_visible
      vital_page.location_element.when_visible
      vital_page.circumValueIn_element.click
      circumference.each do |circum_value|
        vital_page.value = circum_value[:value]
        vital_page.site = circum_value[:site]
        vital_page.location = circum_value[:location]
        vital_page.location_element.send_keys :tab
        expect(vital_page.value).to eq(circum_value[:value])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end

  context 'F423,US6473: Validate Circumference/girth Form Field minimum in inches' do
    full_patient_name = 'eight,imagepatient'

    it 'When user is viewing data for patient #{full_patient_name}' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    it 'And the user clicks on Modal Popup Page ' do
      modal_popup_page.mainModalHeader_element.when_visible
      modal_popup_page.get_appointment_row(0, 'Comp and Pen')
      modal_popup_page.proceed_to_confirm
    end

    it 'User enters 1 on Circumference/girth minimumin Inches' do
      circumference = [{ value: '1', site: 'LEFT', location: 'OTHER' }]
      vital_page.site_element.when_visible
      vital_page.location_element.when_visible
      vital_page.circumValueIn_element.click
      circumference.each do |circum_value|
        vital_page.value = circum_value[:value]
        vital_page.site = circum_value[:site]
        vital_page.location = circum_value[:location]
        vital_page.location_element.send_keys :tab
        expect(vital_page.value).to eq(circum_value[:value])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end

  context 'F423,US6473: Validate Circumference/girth Form Field minimum in centimeters' do
    full_patient_name = 'eight,imagepatient'

    it 'When user is viewing data for patient #{full_patient_name}' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    it 'And the user clicks on Modal Popup Page ' do
      modal_popup_page.mainModalHeader_element.when_visible
      modal_popup_page.get_appointment_row(0, 'Comp and Pen')
      modal_popup_page.proceed_to_confirm
    end

    it 'User enters 2.54 on Circumference/girth minimumin centimeters' do
      circumference = [{ value: '2.54', site: 'LEFT', location: 'OTHER' }]
      vital_page.site_element.when_visible
      vital_page.location_element.when_visible
      vital_page.circumValueCm_element.click
      circumference.each do |circum_value|
        vital_page.value = circum_value[:value]
        vital_page.site = circum_value[:site]
        vital_page.location = circum_value[:location]
        vital_page.location_element.send_keys :tab
        expect(vital_page.value).to eq(circum_value[:value])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end

  context 'F423,US6473: Validate Circumference/girth Form Field maxmum in centimeters' do
    full_patient_name = 'eight,imagepatient'

    it 'When user is viewing data for patient #{full_patient_name}' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm_element.text).to eq('Overview')
    end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    it 'And the user clicks on Modal Popup Page ' do
      modal_popup_page.mainModalHeader_element.when_visible
      modal_popup_page.get_appointment_row(0, 'Comp and Pen')
      modal_popup_page.proceed_to_confirm
    end

    it 'User enters 508 on Circumference/girth maxmum centimeters' do
      circumference = [{ value: '508', site: 'LEFT', location: 'OTHER' }]
      vital_page.site_element.when_visible
      vital_page.location_element.when_visible
      vital_page.circumValueCm_element.click
      circumference.each do |circum_value|
        vital_page.value = circum_value[:value]
        vital_page.site = circum_value[:site]
        vital_page.location = circum_value[:location]
        vital_page.location_element.send_keys :tab
        expect(vital_page.value).to eq(circum_value[:value])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end
end
