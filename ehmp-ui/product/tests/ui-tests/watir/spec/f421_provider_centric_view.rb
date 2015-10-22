require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/pages/providerCentricView_page'

describe 'Feature No. F421: f421_provider_centric_view.rb', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @overview = PatientOverview.new(@driver)
    @covesheet = Coversheet.new(@driver)
    @common_element = CommonElementsPage.new(@driver)
    @provider_view = ProviderCentricViewPage.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
    @common_test.mysite_patient_search('FORTYSIX', 'FORTYSIX,PATIENT')
  end

  after(:all) do
    @driver.close
  end

  context 'US7006: Create Entry Point for Provider View' do
    it 'User navigates to Provider View - My Workspace and views task list' do
      @common_element.myWorkspace_btn_element.when_visible(20)
      @common_element.myWorkspace_btn
      Watir::Wait.until { @overview.screenNm == 'My Workspace' }
      expect(@overview.screenNm_element.text.strip.include?('My Workspace')).to eq(true)
      Watir::Wait.until { @covesheet.applets_elements.length >= 1 }
      expect(@provider_view.tasklist_applet?).to eq(true)
    end
  end # context
end # describe
