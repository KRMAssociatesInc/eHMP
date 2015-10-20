require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/labresults_expanded_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/table_verifier'
require_relative '../lib/pages/global_date_filter_page'

describe 'F144: ( f144_lab_results_modal_spec.rb )', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    # @applet = LabResultsExpanded.new(@driver)

    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
    @login.currentUser_element.when_visible(20)
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:applet) { LabResultsExpanded.new(@driver) }
  let(:global_date_filter) { GlobalDateFilter.new(@driver) }
  let(:search) { SearchPage.new(@driver) }

  context 'US2034: Applet Single Record Modal for Lab Panels' do
    full_patient_name = 'Eight,Patient'
    it "TC8.2: When user is viewing data for patient #{full_patient_name}" do
      @common_test.mysite_patient_search full_patient_name, full_patient_name
    end # it

    it 'TC8.3: and the user is viewing the coversheet' do
      coversheet.navigate_to_coversheet
      expect(coversheet.applet_visible? Coversheet::LAB_RESULTS_GRID_APPLET).to eq(true)

      global_date_filter.select_all
      Watir::Wait.until { applet.finished_loading }
      applet.scroll_table
      Watir::Wait.until { applet.finished_loading }
    end
    it 'TC8.6: Verify a non-Panel lab result displays in a modal' do
      applet.NONPANEL_C877_LDL_CHOLESTEROL_element.scroll_into_view
      applet.NONPANEL_C877_LDL_CHOLESTEROL_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.modalTitle_element.when_visible
      expect(applet.modalTitle_element.text.strip).to eq('LDL CHOLESTEROL - SERUM')

      applet.highChart_element.when_visible

      expect(applet.previous_button_element.visible?).to eq(true)
      expect(applet.next_button_element.visible?).to eq(true)
      expect(applet.modalCloseButton_element.visible?).to eq(true)
    end
    it 'TC8.6: Verify a Panel lab result displays in a modal - DE1617' do
      applet.dataDismiss if applet.labResultModal_element.visible?
      applet.labResultModal_element.when_not_visible

      applet.PANEL_10108_2988_element.scroll_into_view
      applet.PANEL_10108_2988_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.PANEL_DETAIL_ROW_element.when_visible
      applet.PANEL_DETAIL_ROW_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.modalTitle_element.when_visible
      expect(applet.modalTitle_element.text.strip).to eq('PROTIME - PLASMA')

      applet.highChart_element.when_visible

      expect(applet.previous_button_element.visible?).to eq(true)
      expect(applet.next_button_element.visible?).to eq(true)
      expect(applet.modalCloseButton_element.visible?).to eq(true)
    end
  end
  context '' do
    it 'When user is viewing Non-panel lab result' do
      full_patient_name = 'Seven,Patient'
      search.navigate_to_patient_search_screen
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      applet.navigate_to_labresults_expanded
      applet.view_all_lab_results
      Watir::Wait.until { applet.finished_loading }

      applet.TRIGLYCERIDESERUM_9E7A_element.scroll_into_view
      applet.TRIGLYCERIDESERUM_9E7A_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.modalTitle_element.when_visible
      expect(applet.modalTitle_element.text.strip).to eq('TRIGLYCERIDE - SERUM')
    end
    it 'Verify the Lab Detail table contains headers' do
      expect(applet.detailDateHeader?).to eq(true)
      expect(applet.detailDateHeader_element.text).to eq('Date')

      expect(applet.detailLabTestHeader?).to eq(true)
      expect(applet.detailLabTestHeader_element.text).to eq('Lab Test')

      expect(applet.detailFlagHeader?).to eq(true)
      expect(applet.detailFlagHeader_element.text).to eq('Flag')

      expect(applet.detailResultHeader?).to eq(true)
      expect(applet.detailResultHeader_element.text).to eq('Result')

      expect(applet.detailUnitHeader?).to eq(true)
      expect(applet.detailUnitHeader_element.text).to eq('Unit')

      expect(applet.detailRefRangeHeader?).to eq(true)
      expect(applet.detailRefRangeHeader_element.text).to eq('Ref Range')

      expect(applet.detailSiteHeader?).to eq(true)
      expect(applet.detailSiteHeader_element.text).to eq('Facility')
    end

    it 'Verify the Lab Detail table contains expected detail data' do
      expect(applet.detailDate?).to eq(true)
      expect(applet.detailDate_element.text).to eq('03/05/2010')

      expect(applet.detailLabTest?).to eq(true)
      expect(applet.detailLabTest_element.text).to eq('TRIGLYCERIDE - SERUM')

      expect(applet.detailFlag?).to eq(true)
      expect(applet.detailFlag_element.text).to eq('')

      expect(applet.detailResult?).to eq(true)
      expect(applet.detailResult_element.text).to eq('162')

      expect(applet.detailUnit?).to eq(true)
      expect(applet.detailUnit_element.text).to eq('mg/dL')

      expect(applet.detailRefRange?).to eq(true)
      expect(applet.detailRefRange_element.text).to eq('0-249')

      expect(applet.detailSite?).to eq(true)
      expect(applet.detailSite_element.text).to eq('TST1')
    end

    it 'Verify Total Tests label' do
      applet.modalAllRange
      Watir::Wait.until { applet.finished_loading_modal? }

      expected_total_test_count = '22'

      # currently the expected test count is 22, allow for the addition of test data
      expect(applet.totalTests).to be >= expected_total_test_count
    end
    it 'Verify lab results history table contains headers' do
      expect(applet.labHistoryDateHeader?).to eq(true)
      expect(applet.labHistoryDateHeader_element.text).to eq('Date')

      expect(applet.labHistoryFlagHeader?).to eq(true)
      expect(applet.labHistoryFlagHeader_element.text).to eq('Flag')

      expect(applet.labHistoryResultHeader?).to eq(true)
      expect(applet.labHistoryResultHeader_element.text).to eq('Result')

      expect(applet.labHistorySiteHeader?).to eq(true)
      expect(applet.labHistorySiteHeader_element.text).to eq('Facility')
    end

    it 'Verify lab results history is in date order' do
      date_column = applet.labHistoryDateColumn_elements
      first = Time.now
      date_column.each do |column|
        second = Date.strptime(column.text, '%m/%d/%Y - %H:%M')
        expect(second).to be <= (first)
        first = second
      end
    end

    it 'Verify lab results history is paginated' do
      expect(applet.labHistoryPrevious?).to eq(true)
      expect(applet.labHistoryNext?).to eq(true)

      applet.class.element(:labHistoryRow1, :td, css: '#data-grid-lab_results_grid-modalView tbody tr:nth-child(1) td:nth-child(1)')
      first_row_first_page = applet.labHistoryRow1_element.text
      p first_row_first_page
      applet.labHistoryNext
      first_row_second_page = applet.labHistoryRow1_element.text
      expect(first_row_first_page).to_not eq(first_row_second_page)
    end

    it 'Verify the Lab Detail flag column contains expected detail data' do
      applet.closeModal if applet.modalTitle?
      applet.HEMOGLOBIN_A1CBLOOD_9E7A_element.scroll_into_view
      applet.HEMOGLOBIN_A1CBLOOD_9E7A_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.modalTitle_element.when_visible
      expect(applet.modalTitle_element.text.strip).to eq('HEMOGLOBIN A1C - BLOOD')

      expect(applet.detailFlagHeader?).to eq(true)
      expect(applet.detailFlag?).to eq(true)
      expect(applet.detailFlag_element.text).to eq('H')
    end
  end
end
