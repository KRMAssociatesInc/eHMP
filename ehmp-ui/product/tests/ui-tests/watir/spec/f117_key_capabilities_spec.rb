#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/coversheet_page'

describe 'Feature No. F117: f117_key_capabilities_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
  end

  after(:all) do
    @driver.close
  end

  version = 'eHMP version 1.3.'
  patient_search =  'Patient Selection'
  let(:search) { SearchPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:coversheet) { Coversheet.new(@driver) }

  context 'DE1151: When user is logged in and choose patient with one confirmation' do
    patient_name = 'Ten,Patient'
    patient_dob = '04/07/1935'
    patient_ssn = '666-00-0010'
    patient_gender = 'Male'
    it 'Search for a Patient on My Site' do
      @common_test.patient_search(patient_name)
      search.patientInTheList_element.when_visible
      search.click_the_right_patient_from_table(patient_name)
      search.firstConfirm_element.when_visible(30)
      search.firstConfirm
      overview.oVDoB_element.when_visible(30)
      temp_arry = overview.oVDoB.split(' (')
      expect(temp_arry[0]).to eq(patient_dob)
      pdob = DateTime.strptime(patient_dob, '%m/%d/%Y')
      expected_age = calculate_patient_age(pdob).to_s + 'y)'
      expect(temp_arry[1]).to eq(expected_age)
      expect(overview.oVSsn.include?(patient_ssn)).to eq(true)
      expect(overview.oVGender).to eq(patient_gender)
      overview.screenNm_element.click
      overview.coverSheetDropMenu_element.when_visible(10)
      overview.coverSheetDropMenu_element.link_element.click
      # the above action takes user to coversheet, now wait until the page is done loading
      Watir::Wait.until { coversheet.screenNm == 'Coversheet' }
      Watir::Wait.until { coversheet.applets_elements.length == Coversheet::TOTAL_APPLETS_ON_SCREEN }
    end
    it 'User navigates to patient search page' do
      search.patientSearchDiv_element.when_visible
      expect(search.patientSearchDiv_element.text.strip.include?(patient_search)).to eq(true)
      search.patientSearchDiv_element.click
    end
    it 'Verify Bottom Region contains application version' do
      search.appVersion_element.when_visible
      expect(search.appVersion_element.text.strip.include?(version)).to eq(true)
    end
  end

  context 'When user is logged in and choose patient with two confirmations' do
    patient_name = 'EIGHT,PATIENT'
    patient_dob = '04/07/1935'
    patient_ssn = '666-00-0008'
    patient_gender = 'Male'
    it 'Search for a Patient on My Site' do
      @common_test.patient_search(patient_name)
      search.patientInTheList_element.when_visible(20)
      search.click_the_right_patient_from_table(patient_name)
      search.firstConfirm_element.when_visible(30)
      search.firstConfirm
      search.secondConfirmBtn_element.when_visible(30)
      search.secondConfirmBtn
      overview.screenNm_element.when_visible(10)
      overview.oVDoB_element.when_visible(10)
      temp_arry = overview.oVDoB.split(' (')
      expect(temp_arry[0]).to eq(patient_dob)
      pdob = DateTime.strptime(patient_dob, '%m/%d/%Y')
      expected_age = calculate_patient_age(pdob).to_s + 'y)'
      expect(temp_arry[1]).to eq(expected_age)
      expect(overview.oVSsn.include?(patient_ssn)).to eq(true)
      expect(overview.oVGender).to eq(patient_gender)
      overview.screenNm_element.click
      overview.coverSheetDropMenu_element.when_visible(10)
      overview.coverSheetDropMenu_element.link_element.click
      # the above action takes user to coversheet, now wait until the page is done loading
      Watir::Wait.until { coversheet.screenNm == 'Coversheet' }
      Watir::Wait.until { coversheet.applets_elements.length == Coversheet::TOTAL_APPLETS_ON_SCREEN }
    end
    it 'User navigates to patient search page' do
      search.patientSearchDiv_element.when_visible
      expect(search.patientSearchDiv_element.text.strip.include?(patient_search)).to eq(true)
      search.patientSearchDiv_element.click
    end
    it 'Verify Bottom Region contains application version' do
      search.appVersion_element.when_visible
      expect(search.appVersion_element.text.strip.include?(version)).to eq(true)
    end
  end
end
