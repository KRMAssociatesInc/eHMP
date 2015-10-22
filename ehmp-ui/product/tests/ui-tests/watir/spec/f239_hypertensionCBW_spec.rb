require 'rubygems'
require 'rspec'
require 'watir-webdriver'
# require 'Chronic'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/global_date_filter_page'
require_relative '../lib/pages/hypertensionCBW_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/labresults_expanded_page'

describe 'F239-11: f239_hypertensionCBW-spec.rb', debug: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @search = SearchPage.new(@driver)
    @common_test = CommonTest.new(@driver)
    @over_view = PatientOverview.new(@driver)
    @global_date = GlobalDateFilter.new(@driver)
    @hyper = HypertensionPage.new(@driver)
    @covesheet = Coversheet.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
    @login.currentUser_element.when_visible(20)
  end

  after(:all) do
    @driver.close
  end

  context 'US7259: Verify condition workspace is created and working as expected' do
    full_patient_name = 'Seven,Patient'
    it "views data for patient #{full_patient_name}" do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end # it

    it 'TC:XXX selects all from GDT' do
      @global_date.glodate_collapsed_element.when_visible(10)
      @global_date.glodate_collapsed
      @global_date.all_range_btn_element.when_visible(10)
      @global_date.all_range_btn
      @global_date.apply_btn
    end

    it 'navigates to hypertension CBW' do
      @driver.goto(BASE_URL + '#hypertension-cbw')
      Watir::Wait.until { @over_view.screenNm == 'Hypertension CBW' }
      Watir::Wait.until { @covesheet.applets_elements.length >= 8 }
      # redundant
      expect(@covesheet.applets_elements.length).to eq(8)
    end

    it 'and verifies correct applets are displayed in hypertension CBW' do
      expect(@hyper.condition_applet?).to eq(true)
      expect(@hyper.vitals_applet?).to eq(true)
      expect(@hyper.documents_applet?).to eq(true)
      expect(@hyper.lab_result_applet?).to eq(true)
      expect(@hyper.clinical_reminders_applet?).to eq(true)
      expect(@hyper.timeline_applet?).to eq(true)
      expect(@hyper.med_review_applet?).to eq(true)
      expect(@hyper.appointment_applet?).to eq(true)
    end

    it 'verifies lab result applet displays udaf BMP' do
      expect(@common_test.get_expected_filter_from_applet('htcbw-lab_results_grid', 'BMP')).to eq(true)
    end
  end # context
end # describe
