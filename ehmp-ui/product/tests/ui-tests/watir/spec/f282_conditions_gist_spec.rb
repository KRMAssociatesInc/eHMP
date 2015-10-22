#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/table_verifier'
require_relative '../lib/pages/conditions_gist_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/pages/global_date_filter_page'

describe 'DE1321, DE1400: f282_conditions_gist_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @table_verifier = TableVerifier.new(@driver)
    @cond_gist = ConditionsGistPage.new(@driver)
    @overview = PatientOverview.new(@driver)
    @common_element = CommonElementsPage.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
    @common_test.mysite_patient_search('ZZZRETFOURFIFTYEIGHT', 'ZZZRETFOURFIFTYEIGHT,PATIENT')
  end

  after(:all) do
    @driver.close
  end

  let(:globaldate) { GlobalDateFilter.new(@driver) }

  context 'TC559-Conditions Applet Gist - quick view of problems' do
    it '. Overview screen is active' do
      @overview.screenNm_element.when_visible(20)
      expect(@overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
    end

    it '. Conditions Gist is present' do
      @cond_gist.conditionsGistTitle_element.when_visible(20)
      expect(@cond_gist.conditionsGistTitle_element.text.strip.include?('CONDITIONS')).to eq(true)
    end

    it '. hovering over the histogram of a manic disorder problem and selecting the quick view pop-up link' do
      @cond_gist.manicProblem_element.when_visible(20)
      @cond_gist.manicProblem_element.scroll_into_view
      until @cond_gist.quickview_table_finish_loading?
        @cond_gist.manicProblem_element.click
      end
    end

    it '.  Then the "Manic Problem Quick View Table" table contains headers' do
      expected_headers = %w(Date Description Facility)
      Watir::Wait.until { @cond_gist.quickview_table_finish_loading? }
      expect(@table_verifier.table_contains_headers(@cond_gist.probQuickViewTableHeaders_elements, expected_headers)).to be_truthy
    end

    it '. Then the "Manic Problem Quick View Table" table contains rows' do
      row1 = ['04/22/1999', 'MANIC DISORDER-MILD', 'CAMP MASTER']
      row2 = ['04/22/1999', 'MANIC DISORDER-MILD', 'CAMP BEE']
      row3 = ['03/22/1999', 'MANIC DISORDER-MILD', 'FT. LOGAN']
      row4 = ['03/22/1999', 'MANIC DISORDER-MILD', 'FT. LOGAN']
      row5 = ['02/03/1999', 'MANIC DISORDER-MILD', 'FT. LOGAN']
      rows = []
      rows.push(row1)
      rows.push(row2)
      rows.push(row3)
      rows.push(row4)
      rows.push(row5)
      Watir::Wait.until { @cond_gist.quickview_table_finish_loading? }
      expect(@table_verifier.table_contains_rows(@cond_gist.probQuickViewTable_elements, rows)).to be_truthy
    end
  end

  context 'TC#900 - Verify that Menu appears and detail view modal opens' do
    it '. clicking on the left hand side of manic disorder problem displays the menu bar' do
      @cond_gist.manicProblemLeftClick_element.when_visible(20)
      @cond_gist.manicProblemLeftClick_element.click
      @cond_gist.detailsViewButton_element.when_visible(20)
      expect(@cond_gist.detailsViewButton?).to eq(true), 'Detail view icon is not present'
      @cond_gist.quickViewButton_element.when_visible(20)
      expect(@cond_gist.quickViewButton?).to eq(true), 'Quick view icon is not present'
    end

    it '. selecting the detail view icon shows the detail view of the most recent occurrence of the above problem' do
      @cond_gist.detailsViewButton_element.when_visible(20)
      @cond_gist.detailsViewButton_element.click
      @common_element.modalTitle_element.when_visible(20)
      expect(@common_element.modalTitle_element.text.strip.include?('MANIC DISORDER-MILD (ICD-9-CM 296.01)')).to eq(true)
      @common_element.closeModal
    end
  end

  context 'F282-4: Conditions Applet Gist - filter problems' do
    filter_text = 'Acute'
    it 'When the user filters the data on Conditions Gist' do
      expect(@cond_gist.filtered?(@cond_gist.acuityColumnValues_elements, filter_text, false)).to eq(false), 'Cannot check filtering, The visible rows all meet the filter criteria'

      @overview.navigate_to_overview unless @overview.screenNm == 'Overview'
      Watir::Wait.until { @cond_gist.conditions_applet_finish_loading? }
      globaldate.select_all
      Watir::Wait.until { @cond_gist.conditions_applet_finish_loading? }

      prefilter_row_count = @cond_gist.problemRows_elements.length
      @cond_gist.filter unless @cond_gist.filterText_element.visible?
      @cond_gist.filterText_element.when_visible
      @cond_gist.filterText = filter_text
      error_message = "Condition Gist row count did not change after a text filter #{prefilter_row_count} != #{@cond_gist.problemRows_elements.length}"
      Watir::Wait.until(APPLET_LOAD_TIME, error_message) { @cond_gist.problemRows_elements.length != prefilter_row_count }
    end

    it 'Then the Conditions Gist is filtered by text' do
      expect(@cond_gist.contains_empty_gist_list? ConditionsGistPage::CONDITIONS).to eq(false), 'Cannot check filtering, there are no rows to verify'
      expect(@cond_gist.filtered?(@cond_gist.acuityColumnValues_elements, filter_text)).to eq(true)
    end
  end
end
