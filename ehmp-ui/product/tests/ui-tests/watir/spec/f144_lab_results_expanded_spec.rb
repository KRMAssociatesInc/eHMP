require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/labresults_expanded_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/table_verifier'

describe 'F144: Lab Results Expanded (f144_lab_results_expanded_spec.rb)', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
    @login.currentUser_element.when_visible(20)
  end

  after(:all) do
    @driver.close
  end

  let(:table_verifier) { TableVerifier.new(@driver) }
  let(:coversheet) { Coversheet.new(@driver) }
  let(:applet) { LabResultsExpanded.new(@driver) }
  let(:search) { SearchPage.new(@driver) }

  context 'US2033: The Lab Results expanded applet is accessable from Coversheet' do
    full_patient_name = 'Seven,Patient'
    it "When user is viewing data for patient #{full_patient_name}" do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end # it

    it 'And the user is on coversheet' do
      coversheet.navigate_to_coversheet
      expect(coversheet.labresults_applet?).to eq(true)
      expect(coversheet.labresults_expand?).to eq(true)
    end

    it 'AC7: then the lab results applet can be expanded' do
      coversheet.labresults_expand
      Watir::Wait.until { applet.screenNm == 'Lab Results' }
    end

    it 'then the lab results expanded applet contains buttons refresh, filter and minimize' do
      expect(applet.refresh?).to eq(true)
      expect(applet.filter?).to eq(true)
      expect(applet.minimize?).to eq(true)
    end

    it 'TA5449: the the lab results is displayed in a table with expected headers' do
      applet.labTestHeader_element.when_visible(@default_timeout)
      expect(applet.dateHeader?).to eq(true)
      expect(applet.dateHeader_element.text).to eq('Date')
      expect(applet.labTestHeader?).to eq(true)
      expect(applet.labTestHeader_element.text).to eq('Lab Test')
      expect(applet.flagHeader?).to eq(true)
      expect(applet.flagHeader_element.text).to eq('Flag')
      expect(applet.resultHeader?).to eq(true)
      expect(applet.resultHeader_element.text).to eq('Result')
      expect(applet.unitHeader?).to eq(true)
      expect(applet.unitHeader_element.text).to eq('Unit')
      expect(applet.refRangeHeader?).to eq(true)
      expect(applet.refRangeHeader_element.text).to eq('Ref Range')
      expect(applet.facilityHeader?).to eq(true)
      expect(applet.facilityHeader_element.text).to eq('Facility')
    end

    it 'When the user minimizes the lab results applet' do
      applet.minimize
      Watir::Wait.until { applet.screenNm != 'Lab Results' }
    end

    it 'AC7: Then the user is returned to coversheet' do
      expect(coversheet.screenNm).to eq('Coversheet')
      expect(coversheet.labresults_applet?).to eq(true)
      expect(coversheet.labresults_expand?).to eq(true)
    end
  end # context

  context 'Lab Results expanded view' do
    full_patient_name = 'Eight,Patient'
    expected_total_rows = 373
    it 'When the user is viewing the lab results expanded applet' do
      search.navigate_to_patient_search_screen
      @common_test.mysite_patient_search full_patient_name, full_patient_name
      applet.navigate_to_labresults_expanded
      applet.view_all_lab_results
    end
    xit 'Verify applet only displays a subset of rows on load' do
      initial_row_count = applet.labResults_elements.length
      expect(initial_row_count).to be < (expected_total_rows), 'Lab Results should not load all expected rows, only a subset (infinate scrolling)'
    end
    it 'Verify infinate scrolling adds new rows' do
      # F144_LabResultsApplet.feature, f144_3b_lab_results_base_applet_single_page @US2033 @TA5445 @DE1251
      applet.scroll_table
      expect(applet.labResults_elements.length).to be >= (expected_total_rows)
    end
    xit 'US2038: Verify received subset of expected rows' do
      rows = []
      # | Date               | Lab Test                                           | Flag | Result | Unit   | Ref Range | Facility |
      # | 05/07/2013 - 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139    | mmol/L | 134-146   | DOD      |
      # | 05/05/2013 - 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101    | mmol/L | 98-107    | DOD      |
      # | 05/05/2013 - 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.4    | mmol/L | 3.5-4.7   | DOD      |
      # | 05/04/2013 - 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |   H  | 100    | mg/dL  | 70-99     | DOD      |
      # | 05/04/2013 - 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.1    | mmol/L | 3.5-4.7   | DOD      |
      # | 05/03/2013 - 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |   L* | 2.2    | mmol/L | 3.5-4.7   | DOD      |
      # | 05/03/2013 - 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160    | mg/dL  | 0-240     | DOD      |
      # | 04/11/2013 - 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.4    | mmol/L | 3.5-4.7   | DOD      |
      # | 04/11/2013 - 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.3    | mmol/L | 3.5-4.7   | DOD      |
      # | 04/11/2013 - 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |   H  | 10.5   | mg/dL  | 8.5-10.1  | DOD      |
      rows.push(['05/07/2013 - 10:43', 'Sodium, Blood Quantitative - PLASMA', '', '139', 'mmol/L', '134-146', 'DOD'])
      rows.push(['05/05/2013 - 14:10', 'Chloride, Serum or Plasma Quantitative - PLASMA', '', '101', 'mmol/L', '98-107', 'DOD'])
      rows.push(['05/05/2013 - 14:10', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.4', 'mmol/L', '3.5-4.7', 'DOD'])
      rows.push(['05/04/2013 - 08:25', 'Glucose, Serum or Plasma Quantitative - PLASMA', 'H', '100', 'mg/dL', '70-99', 'DOD'])
      rows.push(['05/04/2013 - 08:25', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.1', 'mmol/L', '3.5-4.7', 'DOD'])
      rows.push(['05/03/2013 - 12:28', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'L*', '2.2', 'mmol/L', '3.5-4.7', 'DOD'])
      rows.push(['05/03/2013 - 11:37', 'Cholesterol, Serum or Plasma Quantitative - PLASMA', '', '160', 'mg/dL', '0-240', 'DOD'])
      rows.push(['04/11/2013 - 14:05', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.4', 'mmol/L', '3.5-4.7', 'DOD'])
      rows.push(['04/11/2013 - 08:49', 'Potassium, Serum or Plasma Quantitative - PLASMA', 'H', '5.3', 'mmol/L', '3.5-4.7', 'DOD'])
      rows.push(['04/11/2013 - 08:23', 'Calcium, Serum or Plasma Quantitative - PLASMA', 'H', '10.5', 'mg/dL', '8.5-10.1', 'DOD'])
      expect(table_verifier.table_contains_rows(applet.labResults_elements, rows)).to be_truthy
    end
    it 'DE250: Verify panels are seperated by facilities. ( Panels with same name but from different facilities are not grouped together )' do
      # Verify data is displayed as coming from each facility ( not )
      # |5| 06/01/2006 - 23:56 | Panel COAG PROFILE BLOOD PLASMA WC LB #2988 | H    |        |      |           | TST1     |
      # |6| 06/01/2006 - 23:56 | Panel COAG PROFILE BLOOD PLASMA WC LB #2988 | H    |        |      |           | TST2     |
      rows = []
      rows.push(['06/01/2006 - 23:56', 'Panel COAG PROFILE BLOOD PLASMA WC LB #2988', 'H', '', '', '', 'TST1'])
      rows.push(['06/01/2006 - 23:56', 'Panel COAG PROFILE BLOOD PLASMA WC LB #2988', 'H', '', '', '', 'TST2'])
      # |7| 03/17/2005 - 01:59 | Panel CHEM 7 BLOOD SERUM SP LB #2681        | H*   |        |      |           | TST1     |
      # |9| 03/17/2005 - 01:59 | Panel CHEM 7 BLOOD SERUM SP LB #2681        | H*   |        |      |           | TST2     |
      rows.push(['03/17/2005 - 01:59', 'Panel CHEM 7 BLOOD SERUM SP LB #2681', 'H*', '', '', '', 'TST1'])
      rows.push(['03/17/2005 - 01:59', 'Panel CHEM 7 BLOOD SERUM SP LB #2681', 'H*', '', '', '', 'TST2'])
      expect(table_verifier.table_contains_rows(applet.labResults_elements, rows)).to be_truthy
    end
    it 'US5709: Verify user can filter on LOINC' do
      applet.filter unless applet.textfilter_element.visible?
      applet.textfilter_element.when_visible

      pre_filter_row_count = applet.labResults_elements.length
      applet.textfilter = '736-9'
      Watir::Wait.until { applet.labResults_elements.length != pre_filter_row_count }
      # | 06/21/2007 - 10:26 | Lymphocytes/100 Leukocytes, Blood Quantitative Automated Count - BLOOD |  H   | 52.0   |   %  | 16.1-44.7 | DOD       |
      rows = []
      rows.push(['06/21/2007 - 10:26', 'Lymphocytes/100 Leukocytes, Blood Quantitative Automated Count - BLOOD', 'H', '52.0', '%', '16.1-44.7', 'DOD'])
      expect(table_verifier.table_contains_rows(applet.labResults_elements, rows)).to be_truthy
    end
  end
end # describe
