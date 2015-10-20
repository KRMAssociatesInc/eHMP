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

describe 'F495_US7514, US8352, DE1345: Clinic Time Frame Search: Custom Date Range', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  let(:clinicSearch) { ClinicTimeFrameFilterSearch.new(@driver) }

  after(:all) do
    @driver.close
  end

  context 'TC825, TC651, TC1175' do
    it 'verifies the correct values are displayed for the "Today" and that the "Today" button is activated by default' do
      clinicSearch.clinic_search_tab_element.when_visible(SMALL_TIMEOUT)
      clinicSearch.clinic_search_tab
      expect(clinicSearch.today_btn_element.text.strip).to include('Today')
      expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(true)
      expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.yesterday_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(false)
    end
    it 'verifies the correct values are displayed for the "Last 30d" button' do
      clinicSearch.past_month_btn_element.when_visible(SMALL_TIMEOUT)
      clinicSearch.past_month_btn
      expect(clinicSearch.past_month_btn_element.text.strip).to include('Last 30d')
      expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(true)
      expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.yesterday_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(false)
    end
    it 'verifies the correct values are displayed for the "Last Week" button' do
      clinicSearch.past_week_btn_element.when_visible(SMALL_TIMEOUT)
      clinicSearch.past_week_btn
      expect(clinicSearch.past_week_btn_element.text.strip).to include('Last 7d')
      expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(true)
      expect(clinicSearch.button_active?(clinicSearch.yesterday_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(false)
    end
    it 'verifies the correct values are displayed for the "Yesterday" button' do
      clinicSearch.yesterday_btn_element.when_visible(SMALL_TIMEOUT)
      clinicSearch.yesterday_btn
      expect(clinicSearch.yesterday_btn_element.text.strip).to include('Yesterday')
      expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.yesterday_btn_element)).to eq(true)
      expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(false)
    end
    it 'verifies the correct values are displayed for the "Tomorrow" button' do
      clinicSearch.today_btn_element.when_visible(SMALL_TIMEOUT)
      clinicSearch.tomorrow_btn
      expect(clinicSearch.tomorrow_btn_element.text.strip).to include('Tomorrow')
      expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.yesterday_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(true)
      expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(false)
    end
    it 'verifies the correct values are displayed for the "Next 7d" button' do
      clinicSearch.today_btn_element.when_visible(SMALL_TIMEOUT)
      clinicSearch.next_week_btn
      expect(clinicSearch.next_week_btn_element.text.strip).to include('Next 7d')
      expect(clinicSearch.button_active?(clinicSearch.today_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_month_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.past_week_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.yesterday_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.tomorrow_btn_element)).to eq(false)
      expect(clinicSearch.button_active?(clinicSearch.next_week_btn_element)).to eq(true)
    end
  end
end
