#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/table_verifier'
require_relative '../lib/pages/careteam_details_page'

describe 'US5260, DE1205: f302_careteam_details_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @table_verifier = TableVerifier.new(@driver)
    @careteam = CareTeamDetailsPage.new(@driver)
    @overview = PatientOverview.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
    @common_test.mysite_patient_search('TWENTYTHREE', 'TWENTYTHREE,INPATIENT')
  end

  after(:all) do
    @driver.close
  end

  context 'TC513-Patient Information: Quicklook Inpatient Care Team verification' do
    it '. Overview screen is active' do
      @overview.screenNm_element.when_visible(20)
      expect(@overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
    end

    it '. Then user selects "Care Team Information" drop down' do
      @careteam.careTeamDropDown_element.when_visible(20)
      @careteam.careTeamDropDown_element.click
    end

    it '.And the "Care Team Details" table contains headers' do
      expected_headers = ['Provider Title', 'Name', 'Analog Pager', 'Digital Pager', 'Office Phone']
      expect(@table_verifier.table_contains_headers(@careteam.careTeamTableHeaders_elements, expected_headers)).to be_truthy
    end

    it '. And the "Care Team Details" table contains rows' do
      row1 = ['Primary Care Provider', 'Provider, Fifteen', '(843) 555-5455', '(843) 555-5456', '(843) 555-5454']
      row2 = ['Primary Care Assoc Provider', 'Pcmm-resident, One', '(555) 555-8843', '(555) 555-8876', '(555) 555-8837']
      row3 = ['Inpatient Attending Provider', 'Provider, One', '(555) 555-7677', '(555) 555-7688', '(555) 555-7678']
      row4 = ['Inpatient Provider', 'Provider, One', '(555) 555-7677', '(555) 555-7688', '(555) 555-7678']
      row5 = ['MH Treatment Team', 'Mh Team', 'not specified', 'not specified', '(555) 555-4324']
      row6 = ['MH Treatment Coordinator', 'Vehu, One', '(555) 555-5654', '(555) 555-3242', '(555) 555-5453']
      rows = []
      rows.push(row1)
      rows.push(row2)
      rows.push(row3)
      rows.push(row4)
      rows.push(row5)
      rows.push(row6)
      expect(@table_verifier.table_contains_rows(@careteam.careTeamTable_elements, rows)).to be_truthy
    end

    it '. Then user selects row "Care Team Inpatient Attending Provider" drop down' do
      @careteam.careTeamQuickLook_element.when_visible(20)
      @careteam.careTeamQuickLook_element.click
    end

    it '. And the "Care Team Quicklook" table contains headers' do
      expected_headers = ['Facility', 'Name', 'Analog Pager', 'Digital Pager', 'Office Phone']
      expect(@table_verifier.table_contains_headers(@careteam.careTeamQuickLookTableHeaders_elements, expected_headers)).to be_truthy
    end

    it '. And the "Care Team Quicklook" table contains rows' do
      row1 = ['KODAK', 'Provider, One', '(555) 888-0001', '(555) 888-0002', '(555) 888-0000']
      row2 = ['HDR', 'Provider, One', '(555) 555-7677', '(555) 555-7688', '(555) 555-7678']
      row3 = ['VLER', 'Provider, One', '(555) 555-7677', '(555) 555-7688', '(555) 555-7678']
      rows = []
      rows.push(row1)
      rows.push(row2)
      rows.push(row3)
      expect(@table_verifier.table_contains_rows(@careteam.careTeamQuickLookTable_elements, rows)).to be_truthy
    end
  end
end
