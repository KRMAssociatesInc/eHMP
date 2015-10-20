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

describe 'F144 Lab Results - Modal - Lab History ( f144_US2326_lab_results_spec.rb )', acceptance: true do
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
  context 'US2498: Lab Results | Non numeric lab types are not being group or displayed together in the modal table' do
    it 'When the user views a non-numeric lab result in the modal table' do
      full_patient_name = 'Bcma,Eight'
      @common_test.mysite_patient_search full_patient_name, full_patient_name, true
      applet.navigate_to_labresults_expanded
      applet.allDateFilter
      Watir::Wait.until { applet.finished_loading }

      applet.scroll_table
      applet.BCMA_HEP_C_ANTIBODY_BLOOD_element.when_visible
      applet.BCMA_HEP_C_ANTIBODY_BLOOD_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.modalTitle_element.when_visible

      applet.modalAllRange
      Watir::Wait.until { applet.finished_loading_modal? }
    end
    it 'Verify Lab History table displays non-numeric results' do
      results = applet.labHistoryResultColumn_elements
      expect(results.length).to be > 0
      is_alpha = false
      results.each do |td|
        result = td.text
        is_alpha = result.match(/^[[:alpha:]]+$/)
        p "column data is #{is_alpha}"
        break unless is_alpha.nil?
      end
      expect(is_alpha).to_not be_nil
    end

    it 'Verify graph does not display' do
      expect(applet.labHistoryGraph_element.visible?).to eq(false)
    end
  end
end
