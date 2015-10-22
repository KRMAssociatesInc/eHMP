# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'
require 'page-object'
require 'chronic'
require 'date'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/clinic_time_frame_filter_search_page'
require_relative '../lib/common/ehmp_constants'

describe 'F495_US8462: Handling Sensitive/Flagged Patients in PT Selection List', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  let(:search) { SearchPage.new(@driver) }
  let(:common) { CommonTest.new(@driver) }
  let(:patient_search) { patientSearch.new(@driver) }

  after(:all) do
    @driver.close
  end

  context 'TC1140: Verify that sensitive patient SSN and DOB information are displayed as "Sensitive" in the patient selection list' do
    it 'Verifies that SSN and DOB are displayed as  *SENSITIVE* for sensitive patients ' do
      common.patient_search('employee,one')

      # Ensures that the results list is displayed before moving into the expect statements
      search.patient_gender_element.when_visible(SMALL_TIMEOUT)

      # Verifies
      expect(search.patient_name_element.text.strip).to include('EMPLOYEE,ONE')
      expect(search.patient_SSN_element.text.strip).to include('*SENSITIVE*')
      expect(search.patient_DOB_element.text.strip).to include('*SENSITIVE*')
    end
  end
end
