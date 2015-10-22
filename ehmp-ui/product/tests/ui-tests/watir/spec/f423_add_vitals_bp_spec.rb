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

  context 'F423,US6473: Add Blood pressure Form Field successfully with all qualifier' do
    full_patient_name = 'eight,imagepatient'

    it 'When user is viewing data for patient #{full_patient_name}' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm).to eq('Overview')
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
      # modal_popup_page.setVisitBtn?
      # # puts returned_row
      # # expect(returned_row_element.include?('Comp and Pen')).to eq(true)
      # modal_popup_page.setVisitBttn
      # sleep 3
    end

    it 'User enters 120/80 on blood pressure measurement and all qualifier ' do
      # bp_val = '120/80'
      bp_measures = [
        { bp: '120/80', loc: 'R ARM', method: 'DOPPLER', position: 'STANDING', cuffsize: 'PEDIATRIC' }]
      # { bp: '300/300', loc: 'R ARM',position: '',method: '',cuffsize: ''},
      # { bp: '0/0/0', loc: 'L ARM',method: 'MONITOR',position: '',cuffsize: ''},
      # { bp: '300/300/300', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''},
      # { bp: '120/100/80', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''}]
      vital_page.blood_pressure_element.when_visible
      vital_page.bpLocation_element.when_visible
      vital_page.bpMethod_element.when_visible
      vital_page.bpPosition_element.when_visible
      vital_page.bpCuffsize_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        vital_page.bpLocation = bp_val[:loc]
        vital_page.bpMethod = bp_val[:method]
        vital_page.bpCuffsize = bp_val[:cuffsize]
        vital_page.bpPosition = bp_val[:position]
        vital_page.bpPosition_element.send_keys :tab
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        expect(vital_page.bpLocation).to eq(bp_val[:loc])
        expect(vital_page.bpMethod).to eq(bp_val[:method])
        expect(vital_page.bpPosition).to eq(bp_val[:position])
        expect(vital_page.bpCuffsize).to eq(bp_val[:cuffsize])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end

  context 'F423,US6473: Add Blood pressure Form Field successfully with 1 qualifier' do
    full_patient_name = 'eight,imagepatient'
    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm).to eq('Overview')
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
      text_filter = 'GENERAL MEDICINE'
      modal_popup_page.visitTabNew_element.when_visible
      modal_popup_page.visitTabNew
      modal_popup_page.location = text_filter
      modal_popup_page.location_element.send_keys :tab
      modal_popup_page.get_location_row('GENERAL MEDICINE')
      expect(modal_popup_page.location.strip.include?(text_filter)).to eq(true)
      modal_popup_page.dateVisit_element.when_visible
      modal_popup_page.enter_date_visit('06/22/2015')
      modal_popup_page.proceed_to_confirm
      # sleep 3
    end
    it 'User enters 120/80 on blood pressure measurement and 1 qualifier ' do
      # bp_val = '120/80'
      bp_measures = [
        # { bp: '120/80', loc: 'R ARM', method: 'DOPPLER', position: 'STANDING',cuffsize: 'PEDIATRIC'}
        { bp: '300/300', loc: 'R ARM', position: '', method: '', cuffsize: '' }]
      # { bp: '0/0/0', loc: 'L ARM',method: 'MONITOR',position: '',cuffsize: ''},
      # { bp: '300/300/300', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''},
      # { bp: '120/100/80', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''}]
      vital_page.blood_pressure_element.when_visible
      vital_page.bpLocation_element.when_visible
      vital_page.bpMethod_element.when_visible
      vital_page.bpPosition_element.when_visible
      vital_page.bpCuffsize_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        vital_page.bpLocation = bp_val[:loc]
        vital_page.bpMethod = bp_val[:method]
        vital_page.bpCuffsize = bp_val[:cuffsize]
        vital_page.bpPosition = bp_val[:position]
        vital_page.bpPosition_element.send_keys :tab
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        expect(vital_page.bpLocation).to eq(bp_val[:loc])
        expect(vital_page.bpMethod).to eq(bp_val[:method])
        expect(vital_page.bpPosition).to eq(bp_val[:position])
        expect(vital_page.bpCuffsize).to eq(bp_val[:cuffsize])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end
  context 'F423,US6473: Add Blood pressure Form Field successfully with 2 qualifier' do
    full_patient_name = 'eight,imagepatient'
    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm).to eq('Overview')
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
      text_filter = 'GENERAL MEDICINE'
      modal_popup_page.visitTabNew_element.when_visible
      modal_popup_page.visitTabNew
      modal_popup_page.location = text_filter
      modal_popup_page.location_element.send_keys :tab
      modal_popup_page.get_location_row('GENERAL MEDICINE')
      expect(modal_popup_page.location.strip.include?(text_filter)).to eq(true)
      modal_popup_page.dateVisit_element.when_visible
      modal_popup_page.enter_date_visit('06/22/2015')
      modal_popup_page.proceed_to_confirm
      # sleep 3
    end
    it 'User enters 120/80 on blood pressure measurement and 2 qualifier ' do
      # bp_val = '120/80'
      bp_measures = [
        # { bp: '120/80', loc: 'R ARM', method: 'DOPPLER', position: 'STANDING',cuffsize: 'PEDIATRIC'}
        # { bp: '300/300', loc: 'R ARM',position: '',method: '',cuffsize: ''}]
        { bp: '0/0/0', loc: 'L ARM', method: 'MONITOR', position: '', cuffsize: '' }]
      # { bp: '300/300/300', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''},
      # { bp: '120/100/80', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''}]
      vital_page.blood_pressure_element.when_visible
      vital_page.bpLocation_element.when_visible
      vital_page.bpMethod_element.when_visible
      vital_page.bpPosition_element.when_visible
      vital_page.bpCuffsize_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        vital_page.bpLocation = bp_val[:loc]
        vital_page.bpMethod = bp_val[:method]
        vital_page.bpCuffsize = bp_val[:cuffsize]
        vital_page.bpPosition = bp_val[:position]
        vital_page.bpPosition_element.send_keys :tab
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        expect(vital_page.bpLocation).to eq(bp_val[:loc])
        expect(vital_page.bpMethod).to eq(bp_val[:method])
        expect(vital_page.bpPosition).to eq(bp_val[:position])
        expect(vital_page.bpCuffsize).to eq(bp_val[:cuffsize])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end
  context 'F423,US6473: Add Blood pressure Form Field successfully with 3 qualifier' do
    full_patient_name = 'eight,imagepatient'
    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm).to eq('Overview')
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
      text_filter = 'GENERAL MEDICINE'
      modal_popup_page.visitTabNew_element.when_visible
      modal_popup_page.visitTabNew
      modal_popup_page.location = text_filter
      modal_popup_page.location_element.send_keys :tab
      modal_popup_page.get_location_row('GENERAL MEDICINE')
      expect(modal_popup_page.location.strip.include?(text_filter)).to eq(true)
      modal_popup_page.dateVisit_element.when_visible
      modal_popup_page.enter_date_visit('06/22/2015')
      modal_popup_page.proceed_to_confirm
      # sleep 3
    end
    it 'User enters 120/80 on blood pressure measurement and 3 qualifier ' do
      # bp_val = '120/80'
      bp_measures = [
        # { bp: '120/80', loc: 'R ARM', method: 'DOPPLER', position: 'STANDING',cuffsize: 'PEDIATRIC'}
        # { bp: '300/300', loc: 'R ARM',position: '',method: '',cuffsize: ''}]
        # { bp: '0/0/0', loc: 'L ARM',method: 'MONITOR',position: '',cuffsize: ''}]
        { bp: '300/300/300', loc: 'L LEG', method: 'DOPPLER', position: 'STANDING', cuffsize: '' }]
      # { bp: '120/100/80', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''}]
      vital_page.blood_pressure_element.when_visible
      vital_page.bpLocation_element.when_visible
      vital_page.bpMethod_element.when_visible
      vital_page.bpPosition_element.when_visible
      vital_page.bpCuffsize_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        vital_page.bpLocation = bp_val[:loc]
        vital_page.bpMethod = bp_val[:method]
        vital_page.bpCuffsize = bp_val[:cuffsize]
        vital_page.bpPosition = bp_val[:position]
        vital_page.bpPosition_element.send_keys :tab
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        expect(vital_page.bpLocation).to eq(bp_val[:loc])
        expect(vital_page.bpMethod).to eq(bp_val[:method])
        expect(vital_page.bpPosition).to eq(bp_val[:position])
        expect(vital_page.bpCuffsize).to eq(bp_val[:cuffsize])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end
  context 'F423,US6473: Add Blood pressure Form Field successfully with no qualifier' do
    full_patient_name = 'eight,imagepatient'
    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm).to eq('Overview')
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
      text_filter = 'GENERAL MEDICINE'
      modal_popup_page.visitTabNew_element.when_visible
      modal_popup_page.visitTabNew
      modal_popup_page.location = text_filter
      modal_popup_page.location_element.send_keys :tab
      modal_popup_page.get_location_row('GENERAL MEDICINE')
      expect(modal_popup_page.location.strip.include?(text_filter)).to eq(true)
      modal_popup_page.dateVisit_element.when_visible
      modal_popup_page.enter_date_visit('06/22/2015')
      modal_popup_page.proceed_to_confirm
      # sleep 3
    end
    it 'User enters 120/80 on blood pressure measurement and no qualifier ' do
      # bp_val = '120/80'
      bp_measures = [
        # { bp: '120/80', loc: 'R ARM', method: 'DOPPLER', position: 'STANDING',cuffsize: 'PEDIATRIC'}
        # { bp: '300/300', loc: 'R ARM',position: '',method: '',cuffsize: ''}]
        # { bp: '0/0/0', loc: 'L ARM',method: 'MONITOR',position: '',cuffsize: ''}]
        # { bp: '300/300/300', loc: 'L LEG',method: 'DOPPLER', position: 'STANDING',cuffsize: ''}]
        { bp: '120/100/80', loc: '', position: '', method: '', cuffsize: '' }]
      vital_page.blood_pressure_element.when_visible
      vital_page.bpLocation_element.when_visible
      vital_page.bpMethod_element.when_visible
      vital_page.bpCuffsize_element.when_visible
      vital_page.bpPosition_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        vital_page.bpLocation = bp_val[:loc]
        vital_page.bpMethod = bp_val[:method]
        vital_page.bpCuffsize = bp_val[:cuffsize]
        vital_page.bpPosition = bp_val[:position]
        vital_page.bpPosition_element.send_keys :tab
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        expect(vital_page.bpLocation).to eq(bp_val[:loc])
        expect(vital_page.bpMethod).to eq(bp_val[:method])
        expect(vital_page.bpPosition).to eq(bp_val[:position])
        expect(vital_page.bpCuffsize).to eq(bp_val[:cuffsize])
      end
      vital_page.submitBtn_element.when_visible
      vital_page.submitBtn
    end
  end
  context 'F423,US6473: BP Error Validation ' do
    full_patient_name = 'eight,imagepatient'
    it "When user is viewing data for patient #{full_patient_name}" do
      overview.patientSearchDiv_element.when_visible
      overview.patientSearchDiv_element.click
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    # it 'When user is viewing data for patient #{full_patient_name}' do
    #   @common_test.mysite_patient_search full_patient_name, full_patient_name
    # end # it

    it 'And the user is on overview' do
      overview.screenNm_element.when_visible
      expect(overview.screenNm).to eq('Overview')
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
      text_filter = 'GENERAL MEDICINE'
      modal_popup_page.visitTabNew_element.when_visible
      modal_popup_page.visitTabNew
      modal_popup_page.location = text_filter
      modal_popup_page.location_element.send_keys :tab
      modal_popup_page.get_location_row('GENERAL MEDICINE')
      expect(modal_popup_page.location.strip.include?(text_filter)).to eq(true)
      modal_popup_page.dateVisit_element.when_visible
      modal_popup_page.enter_date_visit('06/22/2015')
      modal_popup_page.proceed_to_confirm
      # sleep 3
    end
    #  this is sample for error
    it 'User enters invalid Diastolic range on blood pressure measurement and 1 qualifier ' do
      bp_measures = [
        { bp: '0/301' },
        { bp: '300/100/305' }]

      vital_page.blood_pressure_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        vital_page.submitBtn_element.when_visible
        vital_page.submitBtn
        expect(vital_page.validate_bp_value.strip).to eq(BP_DIASTOLIC_ERROR)
      end
    end

    it 'User enters invalid Systolic range on blood pressure measurement' do
      bp_measures = [
        { bp: '301/300' },
        { bp: '-5/100/120' },
        { bp: '301/120/120' }]

      vital_page.blood_pressure_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        vital_page.submitBtn_element.when_visible
        vital_page.submitBtn
        expect(vital_page.validate_bp_value.strip).to eq(BP_SYSTOLIC_ERROR)
      end
    end
    it 'User enters invalid Intermediate range on blood pressure measurement' do
      bp_measures = [
        { bp: '100/-5/120' },
        { bp: '100/310/120' }]

      vital_page.blood_pressure_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        vital_page.submitBtn_element.when_visible
        vital_page.submitBtn
        expect(vital_page.validate_bp_value.strip).to eq(BP_INTERMEDIATE_ERROR)
      end
    end
    it 'User enters invalid format on blood pressure measurement' do
      bp_measures = [
        { bp: 'abc/300' },
        { bp: '120/abc/120' },
        { bp: '100/80/hgf' }]

      vital_page.blood_pressure_element.when_visible
      bp_measures.each do |bp_val|
        vital_page.blood_pressure = bp_val[:bp]
        expect(vital_page.blood_pressure).to eq(bp_val[:bp])
        vital_page.submitBtn_element.when_visible
        vital_page.submitBtn
        expect(vital_page.validate_bp_value.strip).to eq(BP_FORMAT_ERROR)
      end
    end

    # it 'User enters location on blood pressure' do
    #   localtion_val = 'R ARM'
    #   # vital_page.bpLocation_element.when_visible
    #   vital_page.bpLocation = localtion_val
    #   # vital_page.bpMethod = method_val
    #   vital_page.bpLocation_element.send_keys :tab
    #   expect(vital_page.bpLocation).to eq(localtion_val)
    # end
    # it 'User enters method on blood pressure' do
    #   method_val = 'DOPPLER'
    #   # vital_page.bpMethod_element.when_visible
    #   vital_page.bpMethod = method_val
    #   vital_page.bpMethod_element.send_keys :tab
    #   expect(vital_page.bpMethod).to eq(method_val)
    # end
    # it 'User enters Position on blood pressure' do
    #   position_val = 'STANDING'
    #   # vital_page.bpPosition_element.when_visible
    #   vital_page.bpPosition = position_val
    #   vital_page.bpPosition_element.send_keys :tab
    #   expect(vital_page.bpPosition).to eq(position_val)
    # end
    # it 'User enters Cuff size on blood pressure' do
    #   cuffsize_val = 'PEDIATRIC'
    #   # vital_page.bpCuffsize_element.when_visible
    #   vital_page.bpCuffsize = cuffsize_val
    #   vital_page.bpCuffsize_element.send_keys :tab
    #   expect(vital_page.bpCuffsize).to eq(cuffsize_val)
    # end

    # it 'User enters submit' do
    #   # error_msg = 'Blood Pressure value must be a valid format: nnn/nnn or nnn/nnn/nnn'
    #   vital_page.submitBtn_element.when_visible
    #   vital_page.submitBtn
    #   expect(vital_page.validate_bp_value.strip).to eq(BP_FORMAT_ERROR)

    #   # puts vital_page.blood_pressure
    #   # expect(vital_page.alertMessage.strip.include?('You will lose progress if you delete')).to eq(true)
    #   # vital_page.cancelAlertBttn
    # end

    # it 'User enters cancles' do
    #   vital_page.cancelBtn_element.when_visible
    #   vital_page.cancelBtn
    #   vital_page.cancelAlertBttn_element.when_visible
    #   expect(vital_page.alertMessage.strip.include?('You will lose progress if you delete')).to eq(true)
    #   vital_page.cancelAlertBttn
    # end

    # it 'Verify inches radio button is checked' do
    # end
    # it 'User clicks on Add' do
    # end
  end

  # context 'F423,US6473: Validate Circumference/girth Form Field in inches' do
  #   full_patient_name = 'eight,imagepatient'

  #   it 'When user is viewing data for patient #{full_patient_name}' do
  #     @common_test.mysite_patient_search full_patient_name, full_patient_name
  #   end # it

  #   it 'And the user is on overview' do
  #     overview.screenNm_element.when_visible
  #     expect(overview.screenNm_element.text).to eq('Overview')
  #   end

  #   it 'And the user is on New Objservation' do
  #     common_page.newObservation_element.when_visible
  #     expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
  #     common_page.newObservation_element.click
  #   end

  #   it 'And the user clicks on Vital' do
  #     common_page.addVitals_element.when_visible
  #     expect(common_page.addVitals.strip).to eq('Add Vitals')
  #     common_page.addVitals_element.click
  #     sleep 3
  #   end

  # it 'User enters 250 on Circumference/girth' do
  # end

  # it 'User enters 0 on Circumference/girth' do
  # end

  # it 'User clicks on Add' do
  # end

  # it 'User enters abc  on Circumference/girth' do
  # end

  # it 'User enters 200 on Circumference/girth' do
  # end

  # it 'User clicks on Add' do
  # end

  # it 'Verify inches radio button is checked' do
  # end
  # end
  # context 'F423,US6473: Add Circumference/girth Form Field successfully in centimeter' do
  #   full_patient_name = 'eight,imagepatient'

  #   it 'When user is viewing data for patient #{full_patient_name}' do
  #     @common_test.mysite_patient_search full_patient_name, full_patient_name
  #   end # it

  #   it 'And the user is on overview' do
  #     overview.screenNm_element.when_visible
  #     expect(overview.screenNm_element.text).to eq('Overview')
  #   end

  #   it 'And the user is on New Objservation' do
  #     common_page.newObservation_element.when_visible
  #     expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
  #     common_page.newObservation_element.click
  #   end

  #   it 'And the user clicks on Vital' do
  #     common_page.addVitals_element.when_visible
  #     expect(common_page.vitalHeader.strip).to eq('Add Vitals')
  #     common_page.addVitals_element.click
  #     sleep 3
  #   end

  #   it 'User Clicks on Centimeter' do
  #   end

  #   it 'User enters 100 on Circumference/girth' do
  #   end

  #   it 'User clicks on Add' do
  #   end
  # end

  # context 'F423,US6473: Validate Circumference/girth Form Field in centimeter' do
  #   full_patient_name = 'eight,imagepatient'

  #   it 'When user is viewing data for patient #{full_patient_name}' do
  #     @common_test.mysite_patient_search full_patient_name, full_patient_name
  #   end # it

  #   it 'And the user is on overview' do
  #     overview.screenNm_element.when_visible
  #     expect(overview.screenNm_element.text).to eq('Overview')
  #   end

  #   it 'And the user is on New Objservation' do
  #     common_page.newObservation_element.when_visible
  #     expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
  #     common_page.newObservation_element.click
  #   end

  #   it 'And the user clicks on Vital' do
  #     common_page.addVitals_element.when_visible
  #     expect(common_page.vitalHeader.strip).to eq('Add Vitals')
  #     common_page.addVitals_element.click
  #     sleep 3
  #   end

  #   it 'User Clicks on Centimeter' do
  #   end

  #   it 'User enters 550 on Circumference/girth' do
  #   end

  #   it 'User clicks on Add' do
  #   end

  #   it 'User enters 0 on Circumference/girth' do
  #   end

  #   it 'User clicks on Add' do
  #   end

  #   it 'User enters abc  on Circumference/girth' do
  #   end

  #   it 'User clicks on Add' do
  #   end

  #   it 'User enters 508 on Circumference/girth' do
  #   end

  #   it 'User clicks on Add' do
  #   end
  # end

  # context 'F423,US6473: Add qualifier on  Circumference/girth Form Field in inches' do
  #   full_patient_name = 'eight,imagepatient'

  #   it 'When user is viewing data for patient #{full_patient_name}' do
  #     @common_test.mysite_patient_search full_patient_name, full_patient_name
  #   end # it

  #   it 'And the user is on overview' do
  #     overview.screenNm_element.when_visible
  #     expect(overview.screenNm_element.text).to eq('Overview')
  #   end

  #   it 'And the user is on New Objservation' do
  #     common_page.newObservation_element.when_visible
  #     expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
  #     common_page.newObservation_element.click
  #   end

  #   it 'And the user clicks on Vital' do
  #     common_page.addVitals_element.when_visible
  #     expect(common_page.vitalHeader.strip).to eq('Add Vitals')
  #     common_page.addVitals_element.click
  #     sleep 3
  #   end

  #   it 'User enters 2.54 on Circumference/girth' do
  #   end

  #   it 'User selects Ankle option from Location drop down menu' do
  #   end

  #   it 'User selects left option from Site drop down menu' do
  #   end

  #   it 'User clicks on Add' do
  #   end
  # end
  # context 'F423,US6473: Verify Data on Circumference/girth Form Field in inches' do
  #   full_patient_name = 'eight,imagepatient'

  #   it 'When user is viewing data for patient #{full_patient_name}' do
  #     @common_test.mysite_patient_search full_patient_name, full_patient_name
  #   end # it

  #   it 'And the user is on overview' do
  #     overview.screenNm_element.when_visible
  #     expect(overview.screenNm_element.text).to eq('Overview')
  #   end

  #   it 'And the user is on New Objservation' do
  #     common_page.newObservation_element.when_visible
  #     expect(common_page.newObservation.include?('+ NEW OBSERVATION')).to eq(true)
  #     common_page.newObservation_element.click
  #   end

  #   it 'And the user clicks on Vital' do
  #     common_page.addVitals_element.when_visible
  #     expect(common_page.vitalHeader.strip).to eq('Add Vitals')
  #     common_page.addVitals_element.click
  #     sleep 3
  #   end

  #   it 'Verify 2.54 on circuference/girth' do
  #   end

  #   it 'Verify Ankle option is saved for Location qualifier' do
  #   end

  #   it 'Verify left option is saved on Site qualifier' do
  #   end
  # end
  # Repeat the preconditions

  # Repeat the preconditions.
  # 23.   User enters 2.54 on Circumference/Girth
  # 24.   User selects Ankle option from Location drop down menu
  # 25.   User selects left  option from Site drop down menu
  # 26.   User clicks on Add.
  # Repeat the preconditions.
  # 27.  User clicks on  unavailable  on Circumference/Girth Vital.

  # 28.  Verify all fields are greyed out.
  # 29.  User uncheck  on  unavailable  on Circumference/Girth Vital.
  # 30.  Verify all fields are available.
  # 31.  User clicks on  refused  on Circumference/Girth Vital.
  # 32. Verify all fields are greyed out.
end
