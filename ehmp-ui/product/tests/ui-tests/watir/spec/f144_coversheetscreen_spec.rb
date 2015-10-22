require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/coversheet_page'

describe 'Feature No. F144: f144_coversheetscreen_spec.rb', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:login) { LoginPage.new(@driver) }
  let(:coversheet) { Coversheet.new(@driver) }

  context 'US2145, DE130, DE160: User views the cover sheet' do
    full_patient_name = 'Bcma,Eight'
    it "When the user searches for and selects #{full_patient_name}" do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end

    it 'and the user makes the coversheet screen active' do
      @driver.goto(BASE_URL + '#cover-sheet')
      coversheet.screenNm_element.when_visible(@default_timeout)
      expect(coversheet.screenNm).to eq('Coversheet')
    end

    it 'Then the patient identifying traits displays the patient name' do
      expect(coversheet.patientName).to eq(full_patient_name)
    end

    it 'and the expected applets are displayed on the coversheet' do
      expect(coversheet.applets_elements.length).to eq(Coversheet::TOTAL_APPLETS_ON_SCREEN)
      expect(coversheet.applet_visible? Coversheet::PROBLEM_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::LAB_RESULTS_GRID_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::VITALS_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::ACTIVE_MEDICATION_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::ALLERGY_GRID_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::IMMUNIZATION_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::ORDER_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::APPOINTMENT_APPLET).to eq(true)
      expect(coversheet.applet_visible? Coversheet::CH_SUMMARIES).to eq(true)
    end

    it 'and at least one applet (Vitals) contains data' do
      # we have other tests for vitals, what does this accomplish in terms of coversheet?
      # Needs to wait for data to be loaded
      Watir::Wait.until(MEDIUM_TIMEOUT, 'Vitals applet failed to load data') { coversheet.vitals_applet_finish_loading? }
      expect(coversheet.vitalGistRows_elements.length).to be > 2
    end
  end # context
end # describe
