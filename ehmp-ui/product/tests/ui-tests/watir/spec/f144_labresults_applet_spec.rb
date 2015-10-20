require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/labresults_expanded_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/global_date_filter_page'
require_relative '../lib/pages/table_verifier'
# Team: Andromeda

describe 'F144 - eHMP Viewer GUI - Lab Results - coversheet', acceptance: true do
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
  let(:coversheet) { Coversheet.new(@driver) }
  let(:search) { SearchPage.new(@driver) }
  let(:globalDateFilter) { GlobalDateFilter.new(@driver) }
  let(:table_verifier) { TableVerifier.new(@driver) }
  context 'When the user views the coversheet' do
    applet_title = 'LAB RESULTS'
    expected_total_rows = 373
    it 'Verify the lab results applet is present' do
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::LAB_RESULTS_GRID_APPLET).to eq(true)
    end
    it "US2038: Verify the lab results applet title is correct (#{applet_title})" do
      expect(applet.title).to eq(applet_title)
    end
    it 'TA5030: Verify the lab results headers' do
      coversheet.labResultHeaderDate_element.when_visible
      expect(coversheet.labResultHeaderDate?).to eq(true)
      expect(coversheet.labResultHeaderTest?).to eq(true)
      expect(coversheet.labResultHeaderFlag?).to eq(true)
      expect(coversheet.labResultHeaderResult?).to eq(true)
    end
    it 'Verify infinate scrolling adds new rows' do
      # f144_1a_lab_results_base_applet_cover_sheet: F144_LabResultsApplet.feature
      globalDateFilter.select_all
      Watir::Wait.until { applet.finished_loading }
      initial_row_count = applet.labResults_elements.length
      expect(initial_row_count).to be < (expected_total_rows), 'Lab Results should not load all expected rows, only a subset (infinate scrolling)'

      applet.scroll_table
      expect(applet.labResults_elements.length).to be >= (expected_total_rows)
    end
    xit 'US2038: Verify received subset of expected rows' do
      rows = []
      rows.push(['05/07/2013 - 10:43', 'Sodium, Blood Quantitative - PLASMA', '', '139 mmol/L'])
      rows.push(['05/05/2013 - 14:10', 'Chloride, Serum or Plasma Quantitative - PLASMA', '', '101 mmol/L'])
      rows.push(['05/05/2013 - 14:10', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.4 mmol/L'])
      rows.push(['05/04/2013 - 08:25', 'Glucose, Serum or Plasma Quantitative - PLASMA', 'H', '100 mg/dL'])
      rows.push(['05/04/2013 - 08:25', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.1 mmol/L'])
      rows.push(['05/03/2013 - 12:28', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'L*', '2.2 mmol/L'])
      rows.push(['05/03/2013 - 11:37', 'Cholesterol, Serum or Plasma Quantitative - PLASMA', '', '160 mg/dL'])
      rows.push(['04/11/2013 - 14:05', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.4 mmol/L'])
      rows.push(['04/11/2013 - 08:49', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.3 mmol/L'])
      rows.push(['04/11/2013 - 08:23', 'Calcium, Serum or Plasma Quantitative - PLASMA', 'H', '10.5 mg/dL'])
      expect(table_verifier.table_contains_rows(applet.labResults_elements, rows)).to be_truthy
    end
    it 'US2493: Verify user can sort lab results by flag' do
      # assumption that the results are not currently sorted by flag
      applet.flagHeader_element.scroll_into_view
      applet.flagHeader
      applet.sortedAscendFlagHeader_element.when_visible
      expect(applet.table_sorted_flag_ascending applet.coversheetFlagColumn_elements).to eq(true)
      # p 'trying something'
      applet.flagHeader
      applet.sortedDesendFlagHeader_element.when_visible
      expect(applet.table_sorted_flag_descending applet.coversheetFlagColumn_elements).to eq(true)
    end
  end
end
