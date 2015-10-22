#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/vitals_gist_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/global_date_filter_page'

describe 'Story#US3138: f280_vitals_gist_spec.rb' do
  # Team Venus
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @common_test.login_with_default
  end

  after(:all) do
    @driver.close
  end

  let(:vg) { VitalsGistPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:global_date) { GlobalDateFilter.new(@driver) }

  context 'Feature No. 280: Vitals Gist View', acceptance: true do
    patient_name = 'Ten,Patient'

    it '. Search for a patient' do
      @common_test.mysite_patient_search(patient_name, patient_name)
    end

    it '. Vitals Gist is present on Overview', tc47: true do
      overview.screenNm_element.when_visible(20)
      expect(overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
      vg.vitalsGistTitle_element.when_visible(20)
      expect(vg.vitalsGistTitle_element.text.strip.include?('VITALS')).to eq(true)
    end

    it '. Vitals Gist has the headers Type, Result and Last', tc47: true do
      vg.typeHeader_element.when_visible(20)
      expect(vg.typeHeader_element.text.strip).to eq('Type')
      expect(vg.resultHeader_element.text.strip).to eq('Result')
      expect(vg.lastHeader_element.text.strip).to eq('Last')
    end

    it '. Selects all from GDT' do
      global_date.select_all
    end

    it '. Verify the details of the Vitals Gist View.', tc47: true do
      vg.typeHeader_element.when_visible(20)
      row1 = ['BPS', '151 mm[Hg]']
      row2 = ['BPD', '74 mm[Hg]']
      row3 = ['Pulse', '94 /min']
      row4 = ['RR', '14 /min']
      row5 = ['Temp', '98.7 F 37.1 C']
      row6 = ['SpO2', '99 %']
      row7 = %w(Pain 2)
      row8 = ['Wt', '157 lb 71.36 kg']
      row9 = ['Ht', '71 in 180.34 cm']
      row10 = ['BMI', '21.9']
      rows = []
      rows.push(row1)
      rows.push(row2)
      rows.push(row3)
      rows.push(row4)
      rows.push(row5)
      rows.push(row6)
      rows.push(row7)
      rows.push(row8)
      rows.push(row9)
      rows.push(row10)
      table = []
      table.push([vg.nameBPS, vg.resultBPS])
      table.push([vg.nameBPD, vg.resultBPD])
      table.push([vg.nameP, vg.resultP])
      table.push([vg.nameR, vg.resultR])
      table.push([vg.nameT, vg.resultT])
      table.push([vg.nameSPO, vg.resultSPO])
      table.push([vg.namePN, vg.resultPN])
      table.push([vg.nameWT, vg.resultWT])
      table.push([vg.nameHT, vg.resultHT])
      table.push([vg.nameBMI, vg.resultBMI])
      expect(table == rows).to be_truthy
    end

    it '. Verify that Type column header can be sorted in ascending when clicked first time', tc47: true do
      vg.typeHeader_element.when_visible(20)
      vg.typeHeader_element.click
      expect(vg.verify_sort_ascending('Type')).to be_truthy
    end

    it '. Verify that Type column header can be sorted in descending when clicked again', tc47: true do
      vg.typeHeader_element.when_visible(20)
      vg.typeHeader_element.click
      expect(vg.verify_sort_descending('Type')).to be_truthy
    end
  end # end Context : Quick view of Vitals type
end # end describe block
