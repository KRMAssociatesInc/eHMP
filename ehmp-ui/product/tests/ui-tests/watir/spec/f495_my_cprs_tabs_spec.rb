require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/my_cprs_tabs'

# POC: Team Pluto
describe MyCPRSTabs, acceptance: true do
  include DriverUtility

  describe 'F495_US7510, US7507, US8138, US7828: My CPRS List Button, Clinics, Wards, and Patient Selection Bubble' do
    before(:all) do
      initialize_configurations(BASE_URL, BROWSER_NAME)
      @common_test = CommonTest.new(@driver)
      @common_test.login_with_default
    end

    let(:myCprsTabs) { described_class.new(@driver) }

    after(:all) do
      @driver.close
    end

    context 'when Select Patient Text field' do
      it 'TC980: Verify the focus is not on Patient Selection bubble' do
        myCprsTabs.my_cprs_list_link
        myCprsTabs.patient_search_input_element.when_visible(SMALL_TIMEOUT)
        expect(myCprsTabs.textfield_hasfocus?(myCprsTabs.patient_selection_focus_element)).to eq(false)
      end

      it 'TC859: Verify Select Patient is displayed in the bubble field' do
        expect(myCprsTabs.patient_search_input_element.attribute('placeholder')).to eq('Select Patient')
      end
    end

    context 'TC532: when My CPRS List removed from the tabs above search patient' do
      mysite_group_tabs = ['My Site', 'Nationwide']

      it 'Verify that list of tabs in mysite tab groups are in the following order: My Site, Nationwide' do
        search_tab_index = 1
        mysite_group_tabs.each do |tab|
          expect(myCprsTabs.get_mysite_tabs_group_text(search_tab_index)).to include(tab)
          search_tab_index += 1
        end
      end

      it 'Verify that the tabs in mysite tab groups does not contain My CPRS List. ' do
        search_tab_index = 1
        mysite_group_tabs.each do
          expect(myCprsTabs.get_mysite_tabs_group_text(search_tab_index)).to_not include('My CPRS List')
          search_tab_index += 1
        end
      end
    end

    context 'TC468, TC983: when My CPRS List is in the bottom tabs' do
      all_group_tabs = ['My CPRS List', 'Clinics', 'Wards']

      it 'Verify that the all tabs group list has order All, My CPRS List, Clinics, Wards' do
        search_tab_index = 1
        all_group_tabs.each do |tab|
          expect(myCprsTabs.get_all_tabs_group_text(search_tab_index)).to include(tab)
          search_tab_index += 1
        end
      end

      it 'Verify ALL tab from Patient Selection menu pane is not visible' do
        search_tab_index = 1
        all_group_tabs.each do |_tab|
          expect(myCprsTabs.get_all_tabs_group_text(search_tab_index)).not_to include('All Tab')
          search_tab_index += 1
        end
      end
    end

    context 'TC980: Patient Selection bubble clears/resets when user clicks on sub tabs' do
      it 'Verify focus moves to the selected sub-tab My Cprs List ' do
        myCprsTabs.my_cprs_list_tab_element.when_visible(SMALL_TIMEOUT)
        myCprsTabs.my_cprs_list_link
        expect(myCprsTabs.textfield_hasfocus?(myCprsTabs.patient_selection_focus_element)).to eq(false)
        expect(myCprsTabs.tab_active?(myCprsTabs.my_cprs_list_tab_element)).to eq(true)
      end

      it 'Verify focus moves to the selected sub-tab Clinics' do
        myCprsTabs.clinics_tab_element.when_visible(SMALL_TIMEOUT)
        myCprsTabs.clinics_link
        expect(myCprsTabs.textfield_hasfocus?(myCprsTabs.patient_selection_focus_element)).to eq(false)
        expect(myCprsTabs.tab_active?(myCprsTabs.clinics_tab_element)).to eq(true)
      end

      it 'Verify focus moves to the selected sub-tab Wards' do
        myCprsTabs.wards_tab_element.when_visible(SMALL_TIMEOUT)
        myCprsTabs.wards_link
        expect(myCprsTabs.textfield_hasfocus?(myCprsTabs.patient_selection_focus_element)).to eq(false)
        expect(myCprsTabs.tab_active?(myCprsTabs.wards_tab_element)).to eq(true)
      end
    end

    context 'TC981: when Text is entered in Patient Selection text field' do
      it 'Verify focus moves to the selected sub-tab when user enters text and clears text' do
        search_text = 'eight'
        myCprsTabs.patient_search_input = search_text
        expect(myCprsTabs.patient_search_input_element.value).to eq(search_text)
        myCprsTabs.clinics_link
        expect(myCprsTabs.patient_search_input_element.value).to eq('')
        expect(myCprsTabs.textfield_hasfocus?(myCprsTabs.patient_selection_focus_element)).to eq(false)
        expect(myCprsTabs.tab_active?(myCprsTabs.clinics_tab_element)).to eq(true)
      end
    end

    context 'TC982: when persisting text in patient search' do
      it 'Verify the text is persisting in the patient selection text area when user enters text and clicks on sub-tab' do
        myCprsTabs.my_cprs_list_link
        search_text = 'eight'
        expect(myCprsTabs.tab_active?(myCprsTabs.my_site_element)).to eq(true)
        myCprsTabs.patient_search_input_element.when_visible(SMALL_TIMEOUT)
        myCprsTabs.patient_search_input_element.click
        myCprsTabs.patient_search_input = search_text
        expect(myCprsTabs.patient_search_input_element.value).to eq(search_text)
        myCprsTabs.nationwide_link_element.when_visible(MEDIUM_TIMEOUT)
        myCprsTabs.nationwide_link
        expect(myCprsTabs.tab_active?(myCprsTabs.nationwide_element)).to eq(true)
        myCprsTabs.my_site_link_element.when_visible(MEDIUM_TIMEOUT)
        myCprsTabs.my_site_link
        expect(myCprsTabs.tab_active?(myCprsTabs.nationwide_element)).to eq(false)
        myCprsTabs.patient_search_input_element.when_visible(SMALL_TIMEOUT)
        expect(myCprsTabs.patient_search_input_element.value).to eq(search_text)
      end
    end
  end
end
