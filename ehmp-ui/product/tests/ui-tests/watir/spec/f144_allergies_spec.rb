require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'rspec_helper'
require_relative '../lib/common/ehmp_constants'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/allergies_page'
require_relative '../lib/pages/global_date_filter_page'

describe '(F120, F144) US2801: Verify allergy applet. ( f144_allergies_spec.rb )', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
    full_patient_name = 'Bcma,Eight'
    p "performing patient search for #{full_patient_name}"
    @common_test.mysite_patient_search full_patient_name, full_patient_name
  end

  after(:all) do
    @driver.close
  end

  let(:coversheet) { Coversheet.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:applet) { AllergiesGistPage.new(@driver) }
  let(:globaldate) { GlobalDateFilter.new(@driver) }

  context 'The overview screen should load without issue. ' do
    it 'When the user views the overview screen' do
      overview.navigate_to_overview unless applet.screenNm == 'Overview'
      expect(applet.screenNm).to eq('Overview')
    end # it

    it 'TC421: Verify the allergy gist applet is displayed' do
      expect(overview.applet_visible? PatientOverview::ALLERGIES).to be(true)

      applet.allergyPillGist_element.when_visible(APPLET_LOAD_TIME)
      expect(applet.allergy_gist_applet_finish_loading?).to eq(true)
    end # it

    it " Verify 'An error has occured' is not displayed" do
      expect(applet.errorMessage?).to be false
    end # it
    it 'Verify applet displays expected buttons' do
      expect(applet.refresh_button?).to eq(true)
      expect(applet.allergyHB?).to eq(true)
      expect(applet.maximize_button?).to eq(true)
    end

    it 'DE1478, DE1095: Verify applet does not display filter buttons' do
      expect(applet.filter_button?).to be false
    end

    it 'Verify applet can be refreshed' do
      applet.refresh_button
      Watir::Wait.until { applet.allergy_gist_applet_finish_loading? }
      expect(applet.errorMessage?).to eq(false)
    end

    it 'Verify applet can be expanded' do
      applet.maximize_button
      Watir::Wait.until { applet.grid_view_finish_loading? }
      expect(applet.minimize_button?).to eq(true)
      expect(applet.screenNm).to eq('Allergies')
    end

    it 'Verify expanded applet returns to overview' do
      expect(applet.minimize_button?).to eq(true), 'Prerequestite for test is not met'
      applet.minimize_button
      applet.maximize_button_element.when_visible
      expect(applet.screenNm).to eq('Overview')
    end
  end # context

  context 'The Allergy Applet should load on the cover sheet screen without issue. ' do
    it 'When the user views the cover sheet screen' do
      coversheet.navigate_to_coversheet
      expect(applet.screenNm).to eq('Coversheet')
    end # it

    it 'TC406: Verify the allergy applet is displayed' do
      expect(coversheet.applet_visible? Coversheet::ALLERGY_GRID_APPLET).to eq(true)
      coversheet.allergyGist_element.when_visible(APPLET_LOAD_TIME)
      expect(coversheet.allergy_gist_applet_finish_loading?).to eq(true)
    end # it

    it "Verify 'An error has occured' is not displayed" do
      expect(applet.errorMessage?).to be false
    end # it

    it 'Verify applet displays expected buttons' do
      expect(applet.refresh_button?).to eq(true)
      expect(applet.allergyHB?).to eq(true)
      expect(applet.maximize_button?).to eq(true)
    end

    it 'DE1478, DE1095: Verify applet does not display filter buttons' do
      expect(applet.filter_button?).to be false
    end

    it 'Verify applet can be refreshed' do
      applet.refresh_button
      Watir::Wait.until { applet.allergy_gist_applet_finish_loading? }
      expect(applet.errorMessage?).to eq(false)
    end

    it 'Verify applet can be expanded' do
      expect(applet.maximize_button?).to eq(true), 'Prerequestite for test is not met'
      applet.maximize_button
      Watir::Wait.until { applet.grid_view_finish_loading? }
      expect(applet.minimize_button?).to eq(true)
    end

    it 'Verify expanded applet returns to coversheet' do
      expect(applet.minimize_button?).to eq(true), 'Prerequestite for test is not met'
      applet.minimize_button
      applet.maximize_button_element.when_visible
      expect(applet.screenNm).to eq('Coversheet')
    end

    it 'DE234: Verify applet is not affected by GDF' do
      Watir::Wait.until { applet.allergy_gist_applet_finish_loading? }
      pill_count = applet.allergyPills_elements.length

      globaldate.select_all
      Watir::Wait.until { applet.allergy_gist_applet_finish_loading? }
      expect(applet.allergyPills_elements.length).to eq(pill_count)

      globaldate.select_24h
      Watir::Wait.until { applet.allergy_gist_applet_finish_loading? }
      expect(applet.allergyPills_elements.length).to eq(pill_count)
    end
  end # context

  context 'The extended Allergy applet should load without issue. ' do
    it 'When the user views the extended allergy applet screen' do
      applet.navigate_to_expanded_allergies
      Watir::Wait.until { applet.grid_view_finish_loading? }
      expect(applet.minimize_button?).to eq(true)
    end

    it "Verify 'An error has occured' is not displayed" do
      expect(applet.errorMessage?).to be false
    end

    it 'Verify applet displays expected buttons' do
      expect(applet.refresh_button?).to eq(true)
      expect(applet.allergyHB?).to eq(true)
      expect(applet.minimize_button?).to eq(true)
      expect(applet.maximize_button?).to be false
    end

    it 'DE1478, DE1095: Verify applet does not display filter buttons' do
      expect(applet.filter_button?).to be false
    end

    it 'Verify applet displays expected headers' do
      expect(applet.allergenNameHeader?).to eq(true)
      expect(applet.allergenNameHeader_element.text).to eq('Allergen Name')
      expect(applet.standardizedNameHeader?).to eq(true)
      expect(applet.standardizedNameHeader_element.text).to eq('Standardized Allergen')
      expect(applet.reactionHeader?).to eq(true)
      expect(applet.reactionHeader_element.text).to eq('Reaction')
      expect(applet.severityHeader?).to eq(true)
      expect(applet.severityHeader_element.text).to eq('Severity')
      expect(applet.drugClassHeader?).to eq(true)
      expect(applet.drugClassHeader_element.text).to eq('Drug Class')
      expect(applet.enteredByHeader?).to eq(true)
      expect(applet.enteredByHeader_element.text).to eq('Entered By')
      expect(applet.facilityHeader?).to eq(true)
      expect(applet.facilityHeader_element.text).to eq('Facility')
    end

    it 'US2169, DE939: Verify the grid can be sorted' do
      expect(applet.allergenNameSortedAscending?).to be false
      applet.allergenNameHeader_element.click
      applet.allergenNameSortedAscending_element.when_visible(SMALL_TIMEOUT)
      expect(applet.verify_sort_ascending(applet.allergenNameColumnValues_elements)).to eq(true)

      expect(applet.standardizedNameHeaderSortedAscending?).to eq(false)
      applet.standardizedNameHeader_element.click
      applet.standardizedNameHeaderSortedAscending_element.when_visible(SMALL_TIMEOUT)
      expect(applet.verify_sort_ascending(applet.standardizedNameColumnValues_elements)).to eq(true)
    end

    it 'US2169: Verify the grid can be refreshed' do
      row_count = applet.rows_elements.length
      applet.refresh_button
      Watir::Wait.until { applet.grid_view_finish_loading? }
      expect(applet.errorMessage?).to eq(false)
      expect(applet.rows_elements.length).to eq(row_count)
    end
  end
end # describe
