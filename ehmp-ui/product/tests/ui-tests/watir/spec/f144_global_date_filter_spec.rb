
require 'rubygems'
require 'rspec'
require 'watir-webdriver'
require 'chronic'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/global_date_filter_page'
require_relative '../lib/common/ehmp_constants'

describe 'Feature No. F299: GlobalDateFilter.rb', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @search = SearchPage.new(@driver)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
  end

  after(:all) do
    @driver.close
  end

  let(:login) { LoginPage.new(@driver) }
  let(:search) { SearchPage.new(@driver) }
  let(:globaldate) { GlobalDateFilter.new(@driver) }

  patient_name = 'Ten,Patient'

  context 'F299_3.17: date_menu_only_selects_past_to_present '  do
    it 'Search and select for patient' do
      @common_test.patient_search(patient_name)
      search.patientInTheList_element.when_visible(EXTENDED_TIMEOUT / 2)
      search.click_the_right_patient_from_table(patient_name)
    end

    it 'confirms selection' do
      search.firstConfirm_element.when_visible
      search.firstConfirm
    end

    it 'TC348: globaldate filter is hidden' do
      globaldate.glodate_mini_element.when_visible(EXTENDED_TIMEOUT / 2)
      expect(globaldate.glodate_mini).to be_truthy
    end

    it 'TC348: verify the correct values are displayed for all btn' do
      globaldate.date_sel_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.date_sel_btn_element.click

      globaldate.all_range_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.all_range_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      total_period = Chronic.parse(dateto).year - Chronic.parse(datefrom).year
      selected_range = (total_period.to_s + 'y')
      if '80y'.eql? selected_range
        'tested all successfully'
      else
        'test all fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 2 yr btn' do
      globaldate.two_yr_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.two_yr_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      total_period = Chronic.parse(dateto).year - Chronic.parse(datefrom).year
      selected_range = (total_period.to_s + 'y')
      if '2y'.eql? selected_range
        'tested 2y successfully'
      else
        'test 2y fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 1 yr btn' do
      globaldate.one_yr_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.one_yr_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      total_period = Chronic.parse(dateto).year - Chronic.parse(datefrom).year
      selected_range = (total_period.to_s + 'y')
      if '1y'.eql? selected_range
        'tested 1y successfully'
      else
        'test 1y fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 3 mo btn' do
      globaldate.thr_mon_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.thr_mon_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      total_period = Chronic.parse(dateto).month - Chronic.parse(datefrom).month
      selected_range = (total_period.to_s + 'm')
      if '3m'.eql? selected_range
        'tested 3m successfully'
      else
        'test 3m fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 1 mo btn' do
      globaldate.one_mon_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.one_mon_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      total_period = Chronic.parse(dateto).month - Chronic.parse(datefrom).month
      selected_range = (total_period.to_s + 'm')
      if '1m'.eql? selected_range
        'tested 1m successfully'
      else
        'test 3m fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 7days btn' do
      globaldate.sev_day_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.sev_day_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value
      if Date.today == Chronic.parse(dateto).to_date
        'tested 7d_from successfully'
      else
        'test 7d_from fails'
      end
      if 7.days.ago.to_date == Chronic.parse(datefrom).to_date
        'tested 7d_to successfully'
      else
        'test 7d_to fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 72 h btn' do
      globaldate.sev_two_hr_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.sev_two_hr_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      if Date.today == Chronic.parse(dateto).to_date
        'tested 72h_to successfully'
      else
        'test 72h_to fails'
      end

      if 72.hours.ago.to_date == Chronic.parse(datefrom).to_date
        'tested 72h_from successfully'
      else
        'test 72h_from fails'
      end
    end

    it 'TC348: verify the correct values are displayed for 24 h btn' do
      globaldate.twe_four_hr_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      globaldate.twe_four_hr_btn

      globaldate.date_from_element.when_visible(EXTENDED_TIMEOUT / 2)
      datefrom = globaldate.date_from_element.value

      globaldate.date_to_element.when_visible(EXTENDED_TIMEOUT / 2)
      dateto = globaldate.date_to_element.value

      if Date.today == Chronic.parse(dateto).to_date
        'tested 24h_to successfully'
      else
        'test 24h_to fails'
      end

      if 24.hours.ago.to_date == Chronic.parse(datefrom).to_date
        'tested 24h_from successfully'
      else
        'test 24h_from fails'
      end
    end

    it 'select apply button' do
      globaldate.apply_btn_element.when_visible(EXTENDED_TIMEOUT / 2)
      expect(globaldate.apply_btn_element.enabled?).to be(true)
      globaldate.apply_btn
    end
  end
end
