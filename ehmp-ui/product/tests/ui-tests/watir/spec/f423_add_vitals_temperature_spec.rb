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
describe 'F423: f423_add_vitals_temperature_spec.rb', debug: true do
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

  context 'F423,US6477: Validate temperature Form Field minimum in F' do
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
      common_page.addVitals_element.when_visible(LARGE_TIMEOUT)
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    it 'And the user clicks on Modal Popup Page ' do
      modal_popup_page.mainModalHeader_element.when_visible(LARGE_TIMEOUT)
      modal_popup_page.get_appointment_row(0, 'Comp and Pen')
      modal_popup_page.proceed_to_confirm
    end

    it 'User enters 45 on Temperature in F' do
      temperature = [{ temperature: '45', temperature_location: 'CORE' }]
      vital_page.temperature_element.when_visible(SMALL_TIMEOUT)
      vital_page.temperatureLocation_element.when_visible(SMALL_TIMEOUT)
      vital_page.fahrenheit_element.click
      temperature.each do |tem_value|
        vital_page.temperature = tem_value[:temperature]
        vital_page.temperatureLocation = tem_value[:temperature_location]
        vital_page.temperatureLocation_element.send_keys :tab
        expect(vital_page.temperature).to eq(tem_value[:temperature])
        expect(vital_page.temperatureLocation).to eq(tem_value[:temperature_location])
      end
      vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
      vital_page.submitBtn
    end
  end

  context 'F423,US6477: Validate temperature Form Field maxmum in F' do
    # full_patient_name = 'eight,imagepatient'

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end
    # it "When user is viewing data for patient #{full_patient_name}" do
    #   overview.patientSearchDiv_element.when_visible(EXTENDED_TIMEOUT)
    #   overview.patientSearchDiv_element.click
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end

    # it 'And the user is on overview' do
    #   overview.screenNm_element.when_visible(EXTENDED_TIMEOUT)
    #   expect(overview.screenNm_element.text).to eq('Overview')
    # end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible(SMALL_TIMEOUT)
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible(LARGE_TIMEOUT)
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    # it 'And the user clicks on Modal Popup Page ' do
    #   modal_popup_page.mainModalHeader_element.when_visible(LARGE_TIMEOUT)
    #   modal_popup_page.get_appointment_row(0, 'Comp and Pen')
    #   modal_popup_page.proceed_to_confirm
    # end

    it 'User enters 120 on Temperature in F' do
      temperature = [{ temperature: '120', temperature_location: 'CORE' }]
      vital_page.temperature_element.when_visible(APPLET_LOAD_TIME)
      vital_page.temperatureLocation_element.when_visible(EXTENDED_TIMEOUT)
      vital_page.fahrenheit_element.click
      temperature.each do |tem_value|
        vital_page.temperature = tem_value[:temperature]
        vital_page.temperatureLocation = tem_value[:temperature_location]
        vital_page.temperatureLocation_element.send_keys :tab
        expect(vital_page.temperature).to eq(tem_value[:temperature])
        expect(vital_page.temperatureLocation).to eq(tem_value[:temperature_location])
      end
      vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
      vital_page.submitBtn
    end
  end

  context 'F423,US6477: Validate temperature Form Field maxmum in C' do
    # full_patient_name = 'eight,imagepatient'

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end
    # it "When user is viewing data for patient #{full_patient_name}" do
    #   overview.patientSearchDiv_element.when_visible(EXTENDED_TIMEOUT)
    #   overview.patientSearchDiv_element.click
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end

    # it 'And the user is on overview' do
    #   overview.screenNm_element.when_visible
    #   expect(overview.screenNm_element.text).to eq('Overview')
    # end

    it 'And the user is on New Objservation' do
      common_page.newObservation_element.when_visible(SMALL_TIMEOUT)
      expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
      common_page.newObservation_element.click
    end

    it 'And the user clicks on Vital' do
      common_page.addVitals_element.when_visible(LARGE_TIMEOUT)
      expect(common_page.vitalHeader.strip).to eq('Add Vitals')
      common_page.addVitals_element.click
      # sleep 3
    end

    # it 'And the user clicks on Modal Popup Page ' do
    #   modal_popup_page.mainModalHeader_element.when_visible(EXTENDED_TIMEOUT)
    #   modal_popup_page.get_appointment_row(0, 'Comp and Pen')
    #   modal_popup_page.proceed_to_confirm
    # end

    it 'User enters 120 on Temperature in C' do
      temperature = [{ temperature: '120', temperature_location: 'CORE' }]
      vital_page.temperature_element.when_visible(LARGE_TIMEOUT)
      vital_page.temperatureLocation_element.when_visible(SMALL_TIMEOUT)
      vital_page.celsius_element.click
      temperature.each do |tem_value|
        vital_page.temperature = tem_value[:temperature]
        vital_page.temperatureLocation = tem_value[:temperature_location]
        vital_page.temperatureLocation_element.send_keys :tab
        expect(vital_page.temperature).to eq(tem_value[:temperature])
        expect(vital_page.temperatureLocation).to eq(tem_value[:temperature_location])
      end
      vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
      vital_page.submitBtn
    end
  end

  context 'F423,US6477: Validate temperature Form Field minimum in C' do
    # full_patient_name = 'eight,imagepatient'

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # # end
    # it "When user is viewing data for patient #{full_patient_name}" do
    #   overview.patientSearchDiv_element.when_visible(EXTENDED_TIMEOUT)
    #   overview.patientSearchDiv_element.click
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end

    # it 'And the user is on overview' do
    #   overview.screenNm_element.when_visible(EXTENDED_TIMEOUT)
    #   expect(overview.screenNm_element.text).to eq('Overview')
    # end

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

    # it 'And the user clicks on Modal Popup Page ' do
    #   modal_popup_page.mainModalHeader_element.when_visible(APPLET_LOAD_TIME)
    #   modal_popup_page.get_appointment_row(0, 'Comp and Pen')
    #   modal_popup_page.proceed_to_confirm
    # end

    it 'User enters 45 on Temperature in C' do
      temperature = [{ temperature: '45', temperature_location: 'CORE' }]
      vital_page.temperature_element.when_visible(SMALL_TIMEOUT)
      vital_page.temperatureLocation_element.when_visible(SMALL_TIMEOUT)
      vital_page.celsius_element.click
      temperature.each do |tem_value|
        vital_page.temperature = tem_value[:temperature]
        vital_page.temperatureLocation = tem_value[:temperature_location]
        vital_page.temperatureLocation_element.send_keys :tab
        expect(vital_page.temperature).to eq(tem_value[:temperature])
        expect(vital_page.temperatureLocation).to eq(tem_value[:temperature_location])
      end
      vital_page.submitBtn_element.when_visible(SMALL_TIMEOUT)
      vital_page.submitBtn
    end
  end
end
