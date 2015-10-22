require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/labresults_expanded_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/pages/search_page'

describe 'F144 - eHMP Viewer GUI - Lab Results - Filtering ( f144_lab_results_filter_defect_spec.rb ) DEBUG WITH DE1540', debug: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @applet = LabResultsExpanded.new(@driver)

    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:search) { SearchPage.new(@driver) }

  context 'DE1383: Filter should reset results after filter text removed' do
    pre_filter_row_count = -1
    it 'After a user performs a text filter' do
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      @applet.navigate_to_labresults_expanded

      pre_filter_row_count = @applet.labResults_elements.length
      @applet.textfilter = 'noResults'
      @applet.emptyRow_element.when_visible(@default_timeout)
    end

    xit 'TC759: Verify results are displayed after removal of text filter' do
      @applet.clear_filter
      Watir::Wait.until { @applet.labResults_elements.length == pre_filter_row_count }
    end
  end

  context 'DE185: Filter should not persist after switching patients' do
    active_indicator_class = 'active-range'
    it 'Verify Text Filter does not persist after switching patients.' do
      search.navigate_to_patient_search_screen
      # search for patient
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::LAB_RESULTS_GRID_APPLET).to eq(true)

      @applet.click_show_filter_button(LabResultsExpanded::APPLET_ID) unless @applet.daterangefilter_element.visible?
      @applet.textfilter_element.when_visible(APPLET_LOAD_TIME)

      pre_filter_row_count = @applet.labResults_elements.length
      @applet.textfilter = 'Sodium'
      Watir::Wait.until { @applet.labResults_elements.length != pre_filter_row_count }

      secondary_patient = 'Seven,Patient'
      search.navigate_to_patient_search_screen
      @common_test.mysite_patient_search secondary_patient, secondary_patient, true
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::LAB_RESULTS_GRID_APPLET).to eq(true)
      @applet.click_show_filter_button(LabResultsExpanded::APPLET_ID) unless @applet.daterangefilter_element.visible?
      @applet.textfilter_element.when_visible(APPLET_LOAD_TIME)

      expect(@applet.textfilter).to eq('')
    end
    it 'Verify Date Filter does not persist after switching patients.' do
      # search for patient
      search.navigate_to_patient_search_screen
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name

      # navigate to lab results expanded
      @applet.navigate_to_labresults_expanded
      @applet.click_show_filter_button(LabResultsExpanded::APPLET_ID) unless @applet.daterangefilter_element.visible?
      @applet.filter_3mo_element.when_visible(APPLET_LOAD_TIME)

      @applet.filter_3mo
      expect(@applet.filter_3mo_element.class_name).to include(active_indicator_class)

      # switch to a different patient
      secondary_patient = 'Seven,Patient'
      search.navigate_to_patient_search_screen
      @common_test.mysite_patient_search secondary_patient, secondary_patient

      # navigate to lab results expanded
      @applet.navigate_to_labresults_expanded
      @applet.click_show_filter_button(LabResultsExpanded::APPLET_ID) unless @applet.daterangefilter_element.visible?
      @applet.filter_3mo_element.when_visible(APPLET_LOAD_TIME)

      expect(@applet.filter_3mo_element.class_name).not_to include(active_indicator_class)
    end
  end
end
