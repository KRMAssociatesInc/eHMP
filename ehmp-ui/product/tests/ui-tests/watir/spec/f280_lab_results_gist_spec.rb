#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'

require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/lab_results_gist_page'
require_relative '../lib/pages/global_date_filter_page'

describe 'Story#7613: Lab Results Gist', acceptance: true do
  include DriverUtility

  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:search) { SearchPage.new(@driver) }
  let(:visit) { VisitInformationPage.new(@driver) }
  let(:lrgist) { LabResultsGistPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:comm_elem) { CommonElementsPage.new(@driver) }
  let(:global_date) { GlobalDateFilter.new(@driver) }

  context 'TC#482: Visit Management: Clinical Appointments' do
    patient_name = 'Ten,Patient'

    it 'TC626: select and add visit' do
      @common_test.mysite_patient_search(patient_name, patient_name)
    end

    it '. Lab Results Gist is present' do
      overview.screenNm_element.when_visible(20)
      expect(overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
      lrgist.labresGistTitle_element.when_visible(20)
      expect(lrgist.labresGistTitle_element.text.strip.include?('LAB RESULTS')).to eq(true)
    end

    it '. Lab Results Gist has the headers Lab Test, Result and Last' do
      lrgist.typeHeader_element.when_visible(20)
      expect(lrgist.typeHeader_element.text.strip).to eq('Lab Test')
      expect(lrgist.resultHeader_element.text.strip).to eq('Result')
      expect(lrgist.lastHeader_element.text.strip).to eq('Last')
    end

    it '. Verify the details of the Lab Results Gist View' do
      lrgist.typeHeader_element.when_visible(20)
    end

    it '. Verify that Lab Test column header can be sorted in ascending when clicked first time' do
      lrgist.typeHeader_element.when_visible(20)
      lrgist.typeHeader_element.click
      expect(lrgist.verify_sort_ascending('Lab Test')).to be_truthy
    end

    it '. Verify that Lab Test column header can be sorted in descending when clicked again' do
      lrgist.typeHeader_element.when_visible(20)
      lrgist.typeHeader_element.click
      expect(lrgist.verify_sort_descending('Lab Test')).to be_truthy
    end
  end # end Context : Quick view of Lab Results
end # end describe block
