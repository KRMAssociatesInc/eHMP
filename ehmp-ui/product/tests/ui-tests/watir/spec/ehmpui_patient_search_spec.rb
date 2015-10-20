
# !/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'

describe 'Story#:1100: ehmpui_patient_search_spec.rb', acceptance: false do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)

    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')

    @login.currentUser_element.when_visible(20)
    expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
  end

  after(:all) do
    @driver.close
  end

  let(:search) { SearchPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }

  context "AC#1001|TC#1201: Global Search happy path and negative scenarios. \n" do
    patient_search_scenario = [
      { facility: 'PANORAMA', lName: 'Eight', fName: 'Patient|Patient', dob: '|04/07/1935', ssn: '|666-00-0008', gender: 'Male', errMsg: '' },
      { facility: 'PANORAMA', lName: 'Eight', fName: '|Patient', dob: '|04/07/1935', ssn: '666-00-0008|666-00-0008', gender: 'Male', errMsg: '' },
      { facility: 'PANORAMA', lName: 'Eight', fName: '|Patient', dob: '04/07/1935|04/07/1935', ssn: '|666-00-0008', gender: 'Male', errMsg: '' },
      { facility: 'PANORAMA', lName: 'Eight', fName: '|Patient', dob: '04/07/1935|04/07/1935', ssn: '666-00-0008|666-00-0008', gender: 'Male', errMsg: '' },
      { facility: 'PANORAMA', lName: 'Eight', fName: 'Patient|Patient', dob: '04/07/1935|04/07/1935', ssn: '666-00-0008|666-00-0008', \
        gender: 'Male', errMsg: '' },
      { facility: 'PANORAMA', lName: 'Eight', fName: '|Patient', dob: '|04/07/1935', ssn: '0008|666-00-0008', gender: 'Male', \
        errMsg: 'Error: SSN must match the format: 123-45-6789 or 123456789.' },
      { facility: 'PANORAMA', lName: 'Smith', fName: 'John|', dob: '|n', ssn: '|n', gender: 'Male', \
        errMsg: 'Search returned too many results please refine your search criteria and try again.' },
      { facility: 'PANORAMA', lName: 'Unknown', fName: 'Patient|', dob: '|n', ssn: '|n', gender: 'Male', \
        errMsg: 'No results were found.' },
      { facility: 'PANORAMA', lName: 'zzzretfivefifty', fName: 'Patient|', dob: '|04/07/1935', ssn: '|666-21-2121', gender: 'Male', \
        errMsg: 'RESTRICTED RECORD' },
      # # { facility: 'PANORAMA', lName: 'BCMA', fName: 'Eighteen-Patient', dob: '', ssn: '', gender: 'Male', errMsg: 'yes' },
      { facility: 'PANORAMA', lName: ' Eight ', fName: ' Patient |Patient', dob: '|04/07/1935', ssn: '|666-00-0008', gender: 'Male', errMsg: '' }
      # { facility: 'KODAK', lName: 'DODONLY', fName: 'PATIENT|Patient', dob: '|09/09/1969', ssn: '|666-33-0018', gender: 'Male', errMsg: '' },
      # { facility: 'KODAK', lName: 'BCMA', fName: 'Eighteen-Patient', dob: '', ssn: '', gender: 'Male', errMsg: 'yes' }
    ]

    pre_facility = 'PANORAMA'
    i = 1
    patient_search_scenario.each do |scenario|
      if scenario[:errMsg] == ''
        log_text = ". Verify that global search returned the correct patient and after confirm selection, patient's information accurately displayed in overview. \n Meta data: "
        meta_data = "#{scenario[:facility].upcase} | #{scenario[:lName]} | #{scenario[:fName].split('|')[0]} | #{scenario[:dob].split('|')[0]} | #{scenario[:ssn].split('|')[0]}"
      else
        log_text = '. Verify that the correct error message displayed resulted from this global search.'
        meta_data = "#{scenario[:facility].upcase} | #{scenario[:lName]} | #{scenario[:fName].split('|')[0]}"\
        " | #{scenario[:dob].split('|')[0]} | #{scenario[:ssn].split('|')[0]} | #{scenario[:errMsg]}"
      end

      it log_text + meta_data do
        refresh_page if scenario[:errMsg] != ''

        if scenario[:facility].upcase != pre_facility
          @login.currentUser
          @login.logout_element.when_visible
          @login.logout
          @common_test.login_with('pu1234', 'pu1234!!', scenario[:facility].upcase)
          @login.currentUser_element.when_visible(20)
        end

        @common_test.all_patient_search(scenario[:lName], scenario[:fName].split('|')[0], scenario[:dob].split('|')[0], scenario[:ssn].split('|')[0], scenario[:errMsg])
        patient_name = "#{scenario[:lName].strip},#{scenario[:fName].split('|')[0].strip}"
        if scenario[:errMsg] == '' || scenario[:errMsg] == 'RESTRICTED RECORD'
          expect(search.this_patient_in_the_patient_list_table?(1, patient_name)).to eq(true)
          search.click_the_right_patient_from_table(patient_name)
          if scenario[:errMsg] != 'RESTRICTED RECORD'
            search.firstConfirm_element.when_visible(10)
            search.firstConfirm
            search.secondConfirmBtn_element.when_visible(20)
            search.secondConfirmBtn
          else
            search.restrictRecrdConf_element.when_visible(10)
            expect(search.restrictedTitle_element.text.strip.upcase.include?(scenario[:errMsg]))
            search.restrictRecrdConf
            # This is actually the 2nd confirm button for the Restricted Record
            search.firstConfirm_element.when_visible(10)
            search.firstConfirm
          end

          overview.screenNm_element.when_visible(20)
          # Verify that the data displayed in Overview are accurate
          temp_arry =  overview.oVDoB.split(' (')
          expect(temp_arry[0]).to eq(scenario[:dob].split('|')[1])
          pdob = DateTime.strptime(scenario[:dob].split('|')[1], '%m/%d/%Y')
          expected_age = calculate_patient_age(pdob).to_s + 'y)'
          expect(temp_arry[1]).to eq(expected_age)

          expect(overview.oVSsn.include?(scenario[:ssn].split('|')[1])).to eq(true)
          expect(overview.oVGender).to eq(scenario[:gender])

        else
          expect(search.patientErrMsg).to eq(scenario[:errMsg])
        end

        pre_facility = scenario[:facility].upcase
        i += 1

        if  overview.screenNm?
          search.returnToPatientSrch_element.when_visible
          search.returnToPatientSrch_element.click
          search.allPatientTab_element.when_visible(10)
        end
      end
    end
  end
end
