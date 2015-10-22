#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/table_verifier'
require_relative '../lib/pages/immunization_gist_page'
require_relative '../lib/pages/common_elements_page'

describe 'US3382, DE1267: f281_immunization_gist_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @table_verifier = TableVerifier.new(@driver)
    @immune_gist = ImmunizationGistPage.new(@driver)
    @overview = PatientOverview.new(@driver)
    @common_element = CommonElementsPage.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
    @common_test.mysite_patient_search('FORTYSIX', 'FORTYSIX,PATIENT')
  end

  after(:all) do
    @driver.close
  end

  context 'TC527-Immunization Gist display verification' do
    it '. Overview screen is active' do
      @overview.screenNm_element.when_visible(20)
      expect(@overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
    end

    it '. Immunization gist is present on the overview screen' do
      @immune_gist.immunizationGistTitle_element.when_visible(20)
      expect(@immune_gist.immunizationGistTitle_element.text.strip.include?('IMMUNIZATIONS')).to eq(true)
    end

    it '. Verify immunization details' do
      @immune_gist.pillPneumococcal_element.when_visible
      expect(@immune_gist.pillPneumococcal_element.text.strip.include?('PNEUMOCOCCAL')).to eq(true)
      expect(@immune_gist.pillHebB_element.text.strip.include?('HEP B, ADULT')).to eq(true)
      expect(@immune_gist.pillInfluenza_element.text.strip.include?('INFLUENZA, UNSPECIFIED FORMULATION')).to eq(true)
      expect(@immune_gist.pillDtp_element.text.strip.include?('DTP')).to eq(true)
      expect(@immune_gist.pillPneumococcalUnspecified_element.text.strip.include?('PNEUMOCOCCAL, UNSPECIFIED FORMULATION')).to eq(true)
    end

    it '. Verify immunization modal pop-up detail for pill pneumococcal' do
      @immune_gist.pillPneumococcal_element.click
      @immune_gist.detailViewIcon_element.when_visible(20)
      @immune_gist.detailViewIcon
      @common_element.modalTitle_element.when_visible(20)
      expect(@common_element.modalTitle_element.text.strip.include?('Vaccine - PNEUMOCOCCAL')).to eq(true)
      @common_element.closeModal
    end

    it '. Verify immunization expand view details' do
      @immune_gist.immuneMaximize_element.when_visible(20)
      @immune_gist.immuneMaximize
      expect(@immune_gist.immuneMaximizeAppletTitle_element.text.strip.include?('IMMUNIZATIONS')).to eq(true)
      row1 = ['PNEUMOCOCCAL', 'pneumococcal polysaccharide vaccine, 23 valent', '', '', 'No', '04/04/2000', 'NJS', '']
      row2 = ['HEP B, ADULT', '', 'NONE', 'COMPLETE', 'No', '10/15/1998', 'TST1', '']
      rows = []
      rows.push(row1)
      rows.push(row2)
      expect(@table_verifier.table_contains_rows(@immune_gist.immuneTable_elements, rows)).to be_truthy if @immune_gist.immunization_table_finish_loading?
      @immune_gist.immuneMinimize
    end

    it '. Able to filter on any particular text in Immunization Gist Applet' do
      prefilter_count = @immune_gist.immPills_elements.length
      @immune_gist.filterButton_element.when_visible(20)
      @immune_gist.filterButton
      @immune_gist.filterInput_element.when_visible(20)
      @immune_gist.input_into_search_filter_immune_gist('PNEUMOCOCCAL')
      Watir::Wait.until { @immune_gist.immPills_elements.length != prefilter_count }
      @immune_gist.pillPneumococcal_element.when_visible(20)
      expect(@immune_gist.pillPneumococcal_element.text.strip.include?('PNEUMOCOCCAL')).to eq(true)
      @immune_gist.pillPneumococcalUnspecified_element.when_visible(20)
      expect(@immune_gist.pillPneumococcalUnspecified_element.text.strip.include?('PNEUMOCOCCAL, UNSPECIFIED FORMULATION')).to eq(true)
      @immune_gist.filterButton
    end

    it '. Verify quick view when hovering over a particular immunization' do
      @immune_gist.pillPneumococcal_element.when_visible(20)
      @immune_gist.pillPneumococcal_element.hover
      expected_headers = %w(Date Series Reaction Since)
      if @immune_gist.immunization_quick_view_table_finish_loading?
        expect(@table_verifier.table_contains_headers(@immune_gist.immuneQuickLookTableHeaders_elements, expected_headers)).to be_truthy
      end
      row1 = ['04/04/2000', '', 'No', '15y']
      rows = []
      rows.push(row1)
      expect(@table_verifier.table_contains_rows(@immune_gist.immuneQuickLookTable_elements, rows)).to be_truthy if @immune_gist.immunization_quick_view_table_finish_loading?
      # unhover to ensure pop up goes away, hovering over patient gender which has no pop up
      @overview.oVGender_element.hover
    end
  end
end
