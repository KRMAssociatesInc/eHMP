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

describe 'F144 Lab Results - Modal ( f144_US2339_labresults_spec.rb )', future: true do
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
  context 'US2339: As a user I can step through the labs in a list from within a modal' do
    modal_title = 'none yet'
    it '' do
      full_patient_name = 'Eight,Patient'
      @common_test.mysite_patient_search full_patient_name, full_patient_name
      applet.navigate_to_labresults_expanded
      applet.view_all_lab_results
      Watir::Wait.until { applet.finished_loading }
      applet.scroll_table

      applet.NONPANEL_C877_LDL_CHOLESTEROL_element.scroll_into_view
      applet.NONPANEL_C877_LDL_CHOLESTEROL_element.click

      applet.openDetailView_element.when_visible
      applet.openDetailView

      applet.modalTitle_element.when_visible
      expect(applet.modalTitle_element.text.strip).to eq('LDL CHOLESTEROL - SERUM')
    end
    it 'Verify data within modal is updated when stepping from one modal to next' do
      modal_title = applet.modalTitle_element.text
      p "#{applet.modalTitle_element.text} : #{modal_title}"
      applet.next_button
      Watir::Wait.until { applet.finished_loading_modal? }
      expect(applet.modalTitle_element.text).to_not eq(@modal_title)
    end
    it 'Verify data within modal is updated when stepping from one modal to previous' do
      applet.previous_button
      Watir::Wait.until { applet.finished_loading_modal? }
      p "#{applet.modalTitle_element.text} : #{@modal_title}"
      expect(applet.modalTitle_element.text).to_not eq(modal_title)
    end
  end
end
