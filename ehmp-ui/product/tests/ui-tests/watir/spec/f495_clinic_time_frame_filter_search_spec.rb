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

# POC: Team Pluto
describe ClinicTimeFrameFilterSearch, acceptance: true do
  include DriverUtility

  describe 'F495_US6212, US7830: Clinic Time Frame Search: Custom Date Range and Show Appts for Clinics' do
    before(:all) do
      initialize_configurations(BASE_URL, BROWSER_NAME)
      @common_test = CommonTest.new(@driver)
      @common_test.login_with_default
    end

    let(:clinicSearch) { described_class.new(@driver) }

    after(:all) do
      @driver.close
    end

    context 'TC774: when filtering the clinic results' do
      it 'TC774: Verify Clinic tab is selected' do
        clinicSearch.clinic_search_tab_element.when_visible(SMALL_TIMEOUT)
        clinicSearch.clinic_search_tab
        expect(clinicSearch.clinic_search_tab_element.text.strip).to eq('Clinics')
      end

      it 'TC774: Verify entering filter text is filtering the clinic location results' do
        filter_text = 'Diabetic'
        clinicSearch.clinic_filter_input_element.when_visible(SMALL_TIMEOUT)
        expect(clinicSearch.clinic_filter_input_element.attribute('placeholder')).to eq('Filter clinics')
        clinic_list_length = clinicSearch.clinic_filter_results_list_elements.length
        clinicSearch.clinic_filter_input = filter_text
        Watir::Wait.until { clinicSearch.clinic_filter_results_list_elements.length != clinic_list_length }
        clinicSearch.clinic_filter_input_element.when_visible(MEDIUM_TIMEOUT)
        clinicSearch.clinic_filter_first_result_element.when_visible(SMALL_TIMEOUT)
        expect(clinicSearch.clinic_filter_input_element.value).to eq(filter_text)
        clinic_number = 1
        clinicSearch.clinic_filter_results_list_elements.each do
          break if clinic_number == (clinicSearch.clinic_filter_results_list_elements.length + 1)
          expect(clinicSearch.clinic_filter_results_text(clinic_number)).to include(clinicSearch.clinic_filter_input_element.value)
          clinic_number += 1
        end
      end
    end

    context 'when start and end date are entered' do
      it 'TC772: Verify the default selected is Today' do
        # clear the filter from the previous it-do
        clinicSearch.clinic_filter_input_element.when_visible(SMALL_TIMEOUT)
        filter_text = ''
        clinicSearch.clinic_filter_input = filter_text

        expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(true)
      end

      it 'TC399: Verify start date is selected' do
        # Test from date 12/11/2014
        date_selected = clinicSearch.select_start_date(5, 12, 2, 6)
        expect(clinicSearch.date_from_element.value).to eq(date_selected)
      end

      it 'TC399: Verify end date is selected' do
        # Test to date 04/11/2015
        date_selected = clinicSearch.select_end_date(7, 4, 2, 7)
        expect(clinicSearch.date_to_element.value).to eq(date_selected)
      end

      it 'TC3771: Verify none of the Predefined date filters are selected while a custom date range is selected' do
        clinicSearch.apply_btn
        expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(false)
        expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(false)
        expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(false)
        expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(false)
        expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(false)
      end

      it 'TC399: Verify the Custom date Clinic search displays correct results' do
        # View results in Cardiology clinic
        clinic_number = 2
        expect(clinicSearch.get_location_text(clinic_number)).to eq('Cardiology')
        clinicSearch.select_location_from_list(clinic_number)
        clinicSearch.patient_location_first_result_element.when_visible(XLARGE_TIMEOUT)
        expect(clinicSearch.patient_location_results(clinic_number)).to eq('Clinic custom search returned data')
      end

      it 'TC985, TC986: Verify that there are column headers are in the correct order and that appointment times are present.' do
        expect(clinicSearch.name_element.text.strip).to include('ONEHUNDRED,OUTPATIENT')
        expect(clinicSearch.SSN_element.text.strip).to include('***-**-0700')
        expect(clinicSearch.date_and_time_element.text.strip).to include('10:00')
        expect(clinicSearch.DOB_element.text.strip).to include('03/09/1945')
        expect(clinicSearch.gender_element.text.strip).to include('Male')
      end

      it 'TC985, TC986: Verify that *SENSITIVE* is in place of SSN and DOB for sensitive patients' do
        # Move from viewing results in Cardiology clinic to viewing results in Audiology clinic
        date_selected = clinicSearch.select_start_date(5, 12, 2, 6)
        expect(clinicSearch.date_from_element.value).to eq(date_selected)
        date_selected = clinicSearch.select_end_date(5, 12, 2, 6)
        expect(clinicSearch.date_from_element.value).to eq(date_selected)

        clinic_number = 1
        expect(clinicSearch.get_location_text(clinic_number)).to eq('Audiology')
        clinicSearch.select_location_from_list(clinic_number)
        clinicSearch.patient_location_second_result_element.when_visible(XLARGE_TIMEOUT)
        expect(clinicSearch.patient_location_results(clinic_number)).to eq('Clinic custom search returned data')
        expect(clinicSearch.name_second_in_list_element.text.strip).to include('EHMP,SIX')
        expect(clinicSearch.SSN_second_in_list_element.text.strip).to include('*SENSITIVE*')
        expect(clinicSearch.date_and_time_second_in_list_element.text.strip).to include('12/06/2013 10:30')
        expect(clinicSearch.DOB_second_in_list_element.text.strip).to include('*SENSITIVE*')
        expect(clinicSearch.gender_second_in_list_element.text.strip).to include('Male')
      end

      # Placeholder for future tests, once testing data needs allow for appointment times to be changed.
      # it 'TC1102: Verify patient Data is sorted in the display by Date then Time in chronological order (1200am - 1159pm)' do

      # end

      it 'TC399: Verify the Custom date Clinic search displays no results for different Clinic' do
        clinic_number = 4
        expect(clinicSearch.get_location_text(clinic_number)).to eq('Cwt Clinic')
        clinicSearch.select_location_from_list(clinic_number)
        clinicSearch.no_results_message_element.when_visible(SMALL_TIMEOUT)
        expect(clinicSearch.patient_location_results(clinic_number)).to eq('No results found')
        expect(clinicSearch.no_results_message_element.text.strip).to eq('No results found.')
      end
    end

    context 'When selecting apply button' do
      it 'TC770: Verify the Apply button does NOT become enabled until both Start and End date is entered' do
        expect(clinicSearch.apply_btn_element.text.strip).to eq('Apply')
        clinicSearch.date_from_element.clear
        clinicSearch.date_to_element.clear
        expect(clinicSearch.button_disabled?).to eq(true)
        clinicSearch.select_start_date(3, 3, 2, 7)
        clinicSearch.select_end_date(4, 4, 2, 7)
        expect(clinicSearch.button_disabled?).to eq(false)
        clinicSearch.date_to_element.clear
        expect(clinicSearch.button_disabled?).to eq(true)
      end
      it 'TC773: Verify the custom filter resets when a user clicks on one of the other date range button' do
        clinicSearch.past_month_btn_element.when_visible(SMALL_TIMEOUT)
        clinicSearch.past_month_btn
        expect(clinicSearch.date_from_element.value).to eq('')
        expect(clinicSearch.date_to_element.value).to eq('')
      end
    end
  end
end
