#!/bin/env ruby
# encoding: utf-8
##########################################################################
# This test is the rewrite of the following feature files:
# @F333-1.1_DemographicSecondaryPatientDoD @US5720 @DE1203
# @F333-1.2_DemographicSecondaryPatientICN @US5720 @debug @DE1203
# @F333-2.1_WriteBackDisabledCoversheet @US5082 @US5070
# @F333-2.1_WriteBackDisabledMaxView @US5082 @US5070
##########################################################################

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/common/ehmp_constants.rb'

describe 'feature#f333|defects#DE1205,DE1203: f333_nationwide_patient_search_spec.rb (DE1491, DE1722)', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)
  end

  after(:all) do
    @driver.close
  end

  let(:search) { SearchPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:common_element) { CommonElementsPage.new(@driver) }

  context 'TC#TC561: Verify that the Demographic information for secondary patients displays in demographic detail drop-down' do
    it '. Type in all credentials to login' do
      @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    patient_search_scenario = [
      { lName: 'Dodonly', fName: 'Patient', hPhone: '(301) 222-3333', hAddressLn1: 'Lost Street', hAddressLn2: 'Norfolk, VA, 20152', errMsg: '' },
      { lName: 'Icnonly', fName: 'Patient', hPhone: '(301) 222-3334', hAddressLn1: 'Icn Street', hAddressLn2: 'Norfolk, VA, 20152', errMsg: '' }
    ]

    patient_search_scenario.each do |scenario|
      it '. Type in patient name, click the search, select the patient from the table. Then verify that the patient full name displays in the Confirmation Section header' do
        @common_test.all_patient_search(scenario[:lName], scenario[:fName], '', '', '')
        patient_name = "#{scenario[:lName].strip},#{scenario[:fName]}"
        search.click_the_right_patient_from_table(patient_name)
        expect(search.patientFullNameInConfirm.strip).to eq(patient_name.upcase)
        search.firstConfirm_element.when_visible(SMALL_TIMEOUT)
        search.firstConfirm
      end

      it '. Keep clicking the patient and click Confirm Selection, until patient data is loaded from JDS, then verify user lands on the overview screen' do
        i = 0

        search.firstConfirm_element.when_not_visible(120)
        while search.errorMsgAfterFirstConfirm? && (search.errorMsgAfterFirstConfirm.include?('record is not yet accessible'))
          search.click_the_right_patient_from_table("#{scenario[:lName].strip},#{scenario[:fName]}")
          search.firstConfirm_element.when_visible(SMALL_TIMEOUT)
          search.firstConfirm
          sleep 2
          i += 1
          # puts "I AM HERE. i= #{i}"
          next unless i > 90
        end

        overview.patientNameDropDown_element.when_visible(120)
        expect(overview.screenNm?).to eq(true)
        overview.patientNameDropDown_element.click
      end

      part1 = '. Patient Name: '" #{scenario[:lName].strip},#{scenario[:fName]} "
      part2 = '| Click the patient name drop down and verify that the following fields display the correct patient information: Home Phone, Home Address Line1, Home Address Line2 '
      it part1 + part2 do
        overview.patientHomePhone_element.when_visible(SMALL_TIMEOUT)
        expect(overview.patientHomePhone.strip).to eq(scenario[:hPhone])
        expect(overview.patientAddrLine1.strip).to eq(scenario[:hAddressLn1])
        expect(overview.patientAddrLine2.strip).to eq(scenario[:hAddressLn2])
        # Return to the search screen to run the next scenario
        search.returnToPatientSrch_element.when_visible(SMALL_TIMEOUT)
        search.returnToPatientSrch_element.click
        search.allPatientTab_element.when_visible(SMALL_TIMEOUT)
      end
    end
  end

  context 'TC#TC560: Verify that the Write Back is disabled from CoverSheet for Non-Vista patient.' do
    it '. Search by "dodonly,patient" and navigate to the CoverSheet' do
      @common_test.all_patient_search('dodonly', 'patient', '', '', '')
      patient_name = 'dodonly,patient'
      search.click_the_right_patient_from_table(patient_name)
      search.firstConfirm_element.when_visible(SMALL_TIMEOUT)
      search.firstConfirm
      overview.patientNameDropDown_element.when_visible(SMALL_TIMEOUT)
      expect(overview.screenNm?).to eq(true)
    end

    applet_name = [
      { appletName: PatientOverview::ALLERGIES, logText: 'AllergyPlusButton' },
      { appletName: PatientOverview::CONDITIONS, logText: 'ConditionPlusButton' },
      { appletName: PatientOverview::IMMUNIZATIONS, logText: 'ImmunizationsPlusButton' },
      { appletName: PatientOverview::VITALS, logText: 'VitalsPlusButton' }
    ]

    applet_name.each do |scenario|
      it '. Verify that the '" #{scenario[:logText]} "' is not visible' do
        common_element.applet_title_element(scenario[:appletName]).when_visible(MEDIUM_TIMEOUT)
        expect(common_element.write_back_plus_button_element(scenario[:appletName]).exists?).to eq(false)
      end
    end

    it '. Verify that the New Observation button is not visible' do
      expect(overview.newObservationBttn?).to eq(false)
    end
  end

  context 'TC#TC560: Verify that the Write Back is disabled from the expanded applet view for Non-Vista patient.' do
    it '. Search by "ICNONLY,PATIENT" and navigate to the CoverSheet' do
      # Return to the search screen to prepare for the next scenario
      search.returnToPatientSrch_element.when_visible(SMALL_TIMEOUT)
      search.returnToPatientSrch_element.click
      search.allPatientTab_element.when_visible(SMALL_TIMEOUT)
      @common_test.all_patient_search('Icnonly', 'patient', '', '', '')
      patient_name = 'Icnonly,patient'
      search.click_the_right_patient_from_table(patient_name)
      search.firstConfirm_element.when_visible(SMALL_TIMEOUT)
      search.firstConfirm
      overview.patientNameDropDown_element.when_visible(SMALL_TIMEOUT)
      expect(overview.screenNm?).to eq(true)
    end

    applet_name = [
      { appletName: PatientOverview::ALLERGIES, logText: 'AllergyPlusButton' },
      { appletName: PatientOverview::CONDITIONS, logText: 'ConditionPlusButton' },
      { appletName: PatientOverview::IMMUNIZATIONS, logText: 'ImmunizationsPlusButton' },
      { appletName: PatientOverview::VITALS, logText: 'VitalsPlusButton' }
    ]

    applet_name.each do |scenario|
      it '. Expand the applet: '"#{scenario[:appletName]}"'. Verify that the '" #{scenario[:logText]} "' is not visible on the applet expanded view' do
        common_element.applet_title_element(scenario[:appletName]).when_visible(MEDIUM_TIMEOUT)
        common_element.expand_applet_button_element(scenario[:appletName]).click
        # Wait until the expanded view is loaded
        common_element.minimize_applet_button_element(scenario[:appletName]).when_visible(MEDIUM_TIMEOUT)
        expect(common_element.write_back_plus_button_element(scenario[:appletName]).exists?).to eq(false)
        # Click the minimize button to return to coversheet
        common_element.minimize_applet_button_element(scenario[:appletName]).click
        common_element.expand_applet_button_element(scenario[:appletName]).when_visible(MEDIUM_TIMEOUT)
      end
    end

    it '. Verify that the New Observation button is not visible from the Expanded view' do
      expect(overview.newObservationBttn?).to eq(false)
    end
  end
end
