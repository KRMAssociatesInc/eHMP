require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/orders_page'
require_relative '../lib/pages/global_date_filter_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/reports_page'
require_relative '../lib/pages/common_elements_page'

describe 'F294: Reports Gist: ( f294_US4157_reportsgist_spec.rb )', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with_default
    @login.currentUser_element.when_visible(20)
    full_patient_name = 'ZZZRETFOURFORTYSEVEN,Patient'
    @common_test.mysite_patient_search full_patient_name, full_patient_name, true
  end

  after(:all) do
    @driver.close
  end

  let(:overview) { PatientOverview.new(@driver) }
  let(:applet) { ReportsPage.new(@driver) }
  let(:global_date_filter) { GlobalDateFilter.new(@driver) }

  context 'US4157: Reports View:  Build Summary Screen for Reports' do
    filter_text = 'Procedure'
    prefilter_row_count = -1
    it 'When the user views Reports Gist applet on overview' do
      overview.navigate_to_overview unless overview.screenNm == 'Overview'
      expect(overview.screenNm).to eq('Overview')
      expect(overview.applet_visible? PatientOverview::REPORTS).to be(true)
    end
    it 'And the user views all Reports' do
      Watir::Wait.until(APPLET_LOAD_TIME, 'Report Gist did not finish loading data') { applet.report_applet_finish_loading? }

      global_date_filter.select_all
      Watir::Wait.until(APPLET_LOAD_TIME, 'Report Gist did not finish loading data') { applet.report_applet_finish_loading? }
      expect(applet.contains_empty_row? ReportsPage::REPORTS_TABLE_ID).to eq(false), 'Cannot check filtering, there are no rows to filter on'
    end

    it 'When the user filters the data on Reports Gist ' do
      expect(applet.filtered?(applet.typeColumn_elements, filter_text)).to eq(false), 'Cannot check filtering, The visible rows all meet the filter criteria'

      applet.show_filter unless applet.filter_on_element.visible?
      applet.filter_on_element.when_visible
      prefilter_row_count = applet.reportRows_elements.length
      applet.filter_on = filter_text
      error_message = "Report Gist row count did not change after a text filter #{prefilter_row_count} != #{applet.reportRows_elements.length}"
      Watir::Wait.until(APPLET_LOAD_TIME, error_message) { applet.reportRows_elements.length != prefilter_row_count }
    end
    it 'Then the reports view is filtered by text' do
      expect(applet.contains_empty_row? ReportsPage::REPORTS_TABLE_ID).to eq(false), 'Cannot check filtering, there are no rows to verify'
      expect(applet.filtered?(applet.typeColumn_elements, filter_text)).to eq(true)
    end
  end
end
