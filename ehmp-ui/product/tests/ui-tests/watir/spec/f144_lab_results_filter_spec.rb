require 'rubygems'
require 'rspec'
require 'watir-webdriver'
require 'chronic'
require 'date'

require_relative 'rspec_helper'
require_relative '../lib/pages/labresults_expanded_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/common/ehmp_constants'

# Team: Andromeda

describe 'F144 - eHMP Viewer GUI - Lab Results - Filtering (f144_lab_results_filter_spec.rb )', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)

    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end
  let(:applet) { LabResultsExpanded.new(@driver) }
  context 'US2033, US2221: User can hide and display filter controls' do
    it 'When the user views the expanded lab results' do
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      applet.navigate_to_labresults_expanded
    end

    it 'Verify the Date Filter is displayed by default' do
      expect(applet.daterangefilter_element.visible?).to eq(true)
      expect(applet.allDateFilter_element.visible?).to eq(true)
      expect(applet.filter_2yr_element.visible?).to eq(true)
      expect(applet.filter_1yr_element.visible?).to eq(true)
      expect(applet.filter_3mo_element.visible?).to eq(true)
      expect(applet.filter_1mo_element.visible?).to eq(true)
      expect(applet.filter_7d_element.visible?).to eq(true)
      expect(applet.filter_72hr_element.visible?).to eq(true)
      expect(applet.filter_24hr_element.visible?).to eq(true)
    end
    it 'US2481: Verify Default from date of the applet is 18 months past' do
      expected_date = Chronic.parse('18 months before now').strftime('%m/%d/%Y')
      expect(applet.fromDate).to eq(expected_date)
    end

    it 'US2481: Verify Default to date of the applet is 6 months in the future' do
      expected_date = Chronic.parse('6 months hence').strftime('%m/%d/%Y')
      expect(applet.toDate).to eq(expected_date)
    end
    it 'Verify the Text Filter is displayed by default' do
      expect(applet.textfilter_element.visible?).to eq(true)
    end

    it 'Verify the user can hide the filter' do
      applet.click_show_filter_button(LabResultsExpanded::APPLET_ID)
      expect(applet.textfilter_element.visible?).to eq(false)
      expect(applet.daterangefilter_element.visible?).to eq(false)
      expect(applet.allDateFilter_element.visible?).to eq(false)
    end

    it 'Verify the table correctly reports when filter produces no results' do
      applet.click_show_filter_button(LabResultsExpanded::APPLET_ID) unless applet.daterangefilter_element.visible?
      applet.allDateFilter
      applet.dateHeader_element.when_visible(APPLET_LOAD_TIME)
      expect(applet.finished_loading).to eq(true)
      # pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = 'noResults'
      applet.emptyRow_element.when_visible(@default_timeout)
    end
  end

  context 'US2552: User can filter lab results' do
    lab_type = 'hematocrit'
    lab_type_with_num = 'a1c'
    facility_dod = 'DOD'
    facility_vista = 'TST1'
    results = '185'
    ref_range = '134-146'

    it "Verify user can filter by lab type (#{lab_type})" do
      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = lab_type
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      expect(applet.column_contains_substring(applet.labTestColumn_elements, lab_type)).to eq(true)
    end

    it "Verify user can filter by a lab type that contains a number (#{lab_type_with_num})" do
      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = lab_type_with_num
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      expect(applet.column_contains_substring(applet.labTestColumn_elements, lab_type_with_num)).to eq(true)
    end

    it 'Verify user can filter by facility' do
      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = facility_dod
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      expect(applet.column_contains_substring(applet.facilityColumn_elements, facility_dod)).to eq(true)

      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = facility_vista
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      expect(applet.column_contains_substring(applet.facilityColumn_elements, facility_vista)).to eq(true)
    end

    it "Verify user can filter by ref range (#{ref_range})" do
      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = ref_range
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      expect(applet.column_contains_substring(applet.refRangeColumn_elements, ref_range)).to eq(true)
    end

    it "Verify user can filter by lab results (#{results})" do
      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = results
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      expect(applet.column_contains_substring(applet.resultColumn_elements, results)).to eq(true)
    end
  end

  context 'US2221: Create a To / From Date Filter' do
    it 'US2481: Verify Date filtering using the Custom button' do
      from_date_string = '04/11/2013'
      to_date_string = '05/04/2013'

      applet.clear_filter_and_refresh_applet
      pre_filter_row_count = applet.labResults_elements.length
      @common_test.enter_into_date_field(applet.fromDate_element, from_date_string)
      @common_test.enter_into_date_field(applet.toDate_element, to_date_string)
      Watir::Wait.until { applet.apply_element.enabled? }
      applet.apply
      Watir::Wait.until { applet.finished_loading }
      expect(applet.labResults_elements.length).to_not eq(pre_filter_row_count)

      from_chronic = Date.strptime(from_date_string, '%m/%d/%Y')
      to_chronic = Date.strptime(to_date_string, '%m/%d/%Y')
      applet.dateColumn_elements.each do |lab_date|
        column_date_chronic = Date.strptime(lab_date.text, '%m/%d/%Y')
        expect(column_date_chronic).to be >= from_chronic
        expect(column_date_chronic).to be <= to_chronic
      end
    end
  end
end
