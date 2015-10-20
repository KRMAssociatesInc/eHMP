require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'

describe 'F144: Crisis Notes, Warnings, Allergies, Directives (CWAD): f144_cwad_spec.rb', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:overview) { PatientOverview.new(@driver) }
  let(:search) { SearchPage.new(@driver) }

  context 'When user views patient with a crisis note flag' do
    full_patient_name = 'Eight,Patient'
    it 'Verify the crisis note posting is active' do
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      overview.cwad_element.when_visible

      expect(overview.crisisNotesCwad_element.class_name.include? 'label-danger').to eq(true)
    end

    it 'DE1045: Verify the cwad details view contains crisis note details' do
      overview.crisisNotesCwad_element.click

      Watir::Wait.until { (overview.cwadDetails_element.class_name.include? 'hidden') == false }
      expect(overview.cwadTitle).to eq('Crisis Notes')
      overview.cwadDetailTitle_element.when_visible
      expect(overview.cwadDetailTitle).to eq('Crisis Note 05/21/2000')

      expect(overview.cwad_detail(1, 2, 1)).to eq('Local Title')
      expect(overview.cwad_detail(1, 2, 2)).to eq('CRISIS NOTE')
      expect(overview.cwad_detail(1, 2, 3)).to eq('Standard Title')
      expect(overview.cwad_detail(1, 2, 4)).to eq('')

      expect(overview.cwad_detail(1, 3, 1)).to eq('Date of Note')
      expect(overview.cwad_detail(1, 3, 2)).to eq('05/21/2000 12:01')
      expect(overview.cwad_detail(1, 3, 3)).to eq('Entry Date')
      expect(overview.cwad_detail(1, 3, 4)).to eq('05/21/2000 12:01')

      expect(overview.cwad_detail(1, 4, 1)).to eq('Author')
      expect(overview.cwad_detail(1, 4, 2)).to eq('VEHU TWENTYONE')
    end
  end # context
  context 'When user views patient with an allergies flag' do
    it 'Verify the allergies posting is active' do
      expect(overview.allergiesCwad_element.class_name.include? 'label-danger').to eq(true)
    end

    it 'DE1045: Verify the cwad details view contains allergies details' do
      overview.allergiesCwad_element.click

      Watir::Wait.until { (overview.cwadDetails_element.class_name.include? 'hidden') == false }
      expect(overview.cwadTitle).to eq('Allergies')
      expect(overview.cwadDetailTitle).to eq('PENICILLIN ITCHING,WATERING EYES')

      expect(overview.cwad_detail(1, 4, 3)).to eq('Originated')
      expect(overview.cwad_detail(1, 4, 4)).to eq('03/17/2005 20:09')

      expect(overview.cwad_detail(1, 5, 1)).to eq('Verified')
      expect(overview.cwad_detail(1, 5, 2)).to eq('03/17/2005')

      expect(overview.cwad_detail(1, 3, 1)).to eq('Nature of reaction')
      expect(overview.cwad_detail(1, 3, 2)).to eq('Adverse Reaction')

      expect(overview.cwad_detail(1, 5, 3)).to eq('Observed/Historical')
      expect(overview.cwad_detail(1, 5, 4)).to eq('Historical')
    end
  end # context
  context 'When user views patient with an Directives flag' do
    it 'Verify the Directives posting is active' do
      expect(overview.directivesCwad_element.class_name.include? 'label-danger').to eq(true)
    end

    it 'DE1045: Verify the cwad details view contains Directives details' do
      overview.directivesCwad_element.click

      Watir::Wait.until { (overview.cwadDetails_element.class_name.include? 'hidden') == false }
      expect(overview.cwadTitle).to eq('Directives')
      expect(overview.cwadDetailTitle).to eq('Advance Directive 05/16/2007')

      expect(overview.cwad_detail(1, 2, 1)).to eq('Local Title')
      expect(overview.cwad_detail(1, 2, 2)).to eq('ADVANCE DIRECTIVE COMPLETED')

      expect(overview.cwad_detail(1, 3, 1)).to eq('Date of Note')
      expect(overview.cwad_detail(1, 3, 2)).to eq('05/16/2007 09:50')
      expect(overview.cwad_detail(1, 3, 3)).to eq('Entry Date')
      expect(overview.cwad_detail(1, 3, 4)).to eq('05/16/2007 09:50')
    end
  end # context

  context 'When the user views patient with a Patient Flag' do
    it 'Verify the Patient Flag posting is active' do
      expect(overview.patientFlagCwad_element.class_name.include? 'label-danger').to eq(true)
    end

    it 'Verify the cwad details view contains Patient Flag details' do
      overview.patientFlagCwad_element.click

      Watir::Wait.until { (overview.cwadDetails_element.class_name.include? 'hidden') == false }
      expect(overview.cwadTitle).to eq('Patient Flags')
    end
  end

  context 'When the user views patient a without any postings' do
    # verified in CPRS that patient sixhundred has no postings

    it 'Verify the crisis note posting is inactive' do
      search.navigate_to_patient_search_screen
      # search for patient
      full_patient_name = 'Sixhundred,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      overview.cwad_element.when_visible

      expect(overview.crisisNotesCwad_element.class_name.include? 'label-danger').to eq(false)
    end
    it 'Verify the allergies posting is inactive' do
      expect(overview.allergiesCwad_element.class_name.include? 'label-danger').to eq(false)
    end
    it 'Verify the Directives posting is inactive' do
      expect(overview.directivesCwad_element.class_name.include? 'label-danger').to eq(false)
    end
    it 'Verify the warning posting is inactive' do
      expect(overview.warningsCwad_element.class_name.include? 'label-danger').to eq(false)
    end
    it 'Verify the patient flag posting is inactive' do
      expect(overview.patientFlagCwad_element.class_name.include? 'label-danger').to eq(false)
    end
  end

  context 'When the user views patient with postings ( secondary test )' do
    it 'US3584_3_cwad: Verify correct postings are active' do
      search.navigate_to_patient_search_screen
      # search for patient
      full_patient_name = 'Eight,Inpatient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      overview.cwad_element.when_visible

      expect(overview.crisisNotesCwad_element.class_name.include? 'label-danger').to eq(false)
      expect(overview.allergiesCwad_element.class_name.include? 'label-danger').to eq(true)
      expect(overview.directivesCwad_element.class_name.include? 'label-danger').to eq(true)
      expect(overview.warningsCwad_element.class_name.include? 'label-danger').to eq(false)
      expect(overview.patientFlagCwad_element.class_name.include? 'label-danger').to eq(false)
    end
  end
end # describe
