#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/table_verifier'
require_relative '../lib/pages/global_date_filter_page'
require_relative '../lib/pages/timeline_page'

describe 'DE1328: f144_timeline_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @table_verifier = TableVerifier.new(@driver)
    @timeline = TimelinePage.new(@driver)
    @overview = PatientOverview.new(@driver)
    @global_date = GlobalDateFilter.new(@driver)

    @common_test.login_with_default
    @common_test.mysite_patient_search('Onehundredsixteen', 'Onehundredsixteen,PATIENT')
  end

  after(:all) do
    @driver.close
  end

  context 'TC590-Timline Applet - DoD encounters display' do
    it '. Navigate to timeline applet' do
      @timeline.navigate_to_timeline
    end

    it '. Selects all from GDT' do
      @global_date.glodate_collapsed_element.when_visible(10)
      @global_date.glodate_collapsed
      @global_date.all_range_btn_element.when_visible(10)
      @global_date.all_range_btn
      @global_date.apply_btn
      Watir::Wait.until { @timeline.finished_loading? }
    end

    it '. Timeline applet title says TIMELINE' do
      @timeline.appletTitle_element.when_visible(@default_timeout)
      expect(@timeline.appletTitle_element.text.strip.include?('TIMELINE')).to eq(true)
    end

    it '. Timeline applet is completly loaded' do
      expect(@timeline.finished_loading?).to be_truthy
    end

    it '. Then timeline applet contains headers' do
      expect(@timeline.dateHeader_element.text.strip.include?('Date & Time')).to eq(true)
      expect(@timeline.activityHeader_element.text.strip.include?('Activity')).to eq(true)
      expect(@timeline.typeHeader_element.text.strip.include?('Type')).to eq(true)
      expect(@timeline.enteredByHeader_element.text.strip.include?('Entered By')).to eq(true)
      expect(@timeline.facilityHeader_element.text.strip.include?('Facility')).to eq(true)
    end

    it '. Then timeline applet table contains rows' do
      row1 = ['09/10/2012 - 14:21', 'Visit OUTPATIENT', 'DoD Encounter', '', 'DOD']
      rows = []
      rows.push(row1)
      expect(@table_verifier.table_contains_rows(@timeline.tableRows_elements, rows)).to be_truthy
    end
  end
end
