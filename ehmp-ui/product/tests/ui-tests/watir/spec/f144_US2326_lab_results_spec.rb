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

describe 'F144 Lab Results - Modal - Filtering ( f144_US2326_lab_results_spec.rb )', acceptance: true do
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
  context 'US2326: To / From Date Filter in modal' do
    it 'When the user is viewing a non panel Lab Result detail modal' do
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      applet.navigate_to_labresults_expanded
      applet.clear_filter_and_refresh_applet
      applet.allDateFilter
      Watir::Wait.until { applet.finished_loading }
      applet.scroll_table
      applet.NONPANEL_C877_LDL_CHOLESTEROL_element.scroll_into_view
      applet.NONPANEL_C877_LDL_CHOLESTEROL_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView
    end
    it 'Verify the selectable options' do
      expect(applet.modalAllRange?).to eq(true)
      expect(applet.modal2yrRange?).to eq(true)
      expect(applet.modal1yrRange?).to eq(true)
      expect(applet.modal3moRange?).to eq(true)
      expect(applet.modal1moRange?).to eq(true)
      expect(applet.modal7dRange?).to eq(true)
      expect(applet.modal72hrRange?).to eq(true)
      expect(applet.modal24hrRange?).to eq(true)
      expect(applet.modalFilterFromDate?).to eq(true)
      expect(applet.modalFilterToDate?).to eq(true)
      expect(applet.modalApply?).to eq(true)
    end
    xit 'Verify custom date fields and apply button are disabled by default. ( This requirement seems to have changed )' do
      expect(applet.modalFilterFromDate_element.disabled?).to eq(true)
      expect(applet.modalFilterToDate_element.disabled?).to eq(true)
      expect(applet.modalApply_element.disabled?).to eq(true)
    end

    it 'Verify Apply button should be disabled unless valid dates are entered' do
      @common_test.enter_into_date_field(applet.modalFilterFromDate_element, '')
      @common_test.enter_into_date_field(applet.modalFilterToDate_element, '')
      expect(applet.modalApply_element.disabled?).to eq(true)
      # 01/01/2010
      @common_test.enter_into_date_field(applet.modalFilterFromDate_element, '01/01/2010')
      @common_test.enter_into_date_field(applet.modalFilterToDate_element, '01/01/2013')

      expect(applet.modalApply_element.disabled?).to eq(false)

      @common_test.enter_into_date_field(applet.modalFilterFromDate_element, '')
      @common_test.enter_into_date_field(applet.modalFilterToDate_element, '')
      expect(applet.modalApply_element.disabled?).to eq(true)
    end
    it 'Verify Custom filters should NOT retain their values' do
      @common_test.enter_into_date_field(applet.modalFilterFromDate_element, '01/01/2010')
      @common_test.enter_into_date_field(applet.modalFilterToDate_element, '01/01/2013')
      expect(applet.modalApply_element.disabled?).to eq(false)
      applet.modal2yrRange

      expect(applet.modalApply_element.disabled?).to eq(true)
      expect(applet.modalFilterFromDate.strip).to eq('')
      expect(applet.modalFilterToDate.strip).to eq('')
    end
    it 'Verify custom date filter' do
      from_date_string = '01/01/2007'
      to_date_string = '06/01/2007'
      pre_filter_row_count = applet.modalLabResults_elements.length
      @common_test.enter_into_date_field(applet.modalFilterFromDate_element, from_date_string)
      @common_test.enter_into_date_field(applet.modalFilterToDate_element, to_date_string)
      applet.modalApply

      Watir::Wait.until { applet.modalLabResults_elements.length != pre_filter_row_count }
      Watir::Wait.until { applet.finished_loading_modal? }
      from_chronic = Date.strptime(from_date_string, '%m/%d/%Y')
      to_chronic = Date.strptime(to_date_string, '%m/%d/%Y')
      # p "length: #{applet.modalDateColumn_elements.length}"
      applet.modalDateColumn_elements.each do |lab_date|
        column_date_chronic = Date.strptime(lab_date.text, '%m/%d/%Y')
        expect(column_date_chronic).to be >= from_chronic
        expect(column_date_chronic).to be <= to_chronic
        # p "lab_date: #{lab_date.text}"
      end
    end
  end
end
