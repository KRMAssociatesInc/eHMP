#!/bin/env ruby
# encoding: utf-8
# Team-Venus

require 'rspec'
require 'rubygems'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/coversheet_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/appointments_page'
require_relative '../lib/pages/immunization_gist_page'
require_relative '../lib/pages/orders_page'
require_relative '../lib/pages/problems_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/workspace_manager_page'

describe 'Feature No. 538: f538_onlinehelp_enhance_spec.rb', debug: true do
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
  let(:coversheet) { Coversheet.new(@driver) }
  let(:appointments) { AppointmentPage.new(@driver) }
  let(:immunization) { ImmunizationGistPage.new(@driver) }
  let(:orders) { OrdersPage.new(@driver) }
  let(:problems) { ProblemsPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:comm_elem) { CommonElementsPage.new(@driver) }
  let(:my_workspace) { WorkspaceManagerPage.new(@driver) }

  context 'US7588: Online Help enhancement: reveal help icon for all applicable contexts' do
    it 'TC626: User logs in and searches for Ten,Patient', tc626: true do
      patient_name = 'Ten,Patient'
      @common_test.mysite_patient_search(patient_name, patient_name)
    end

    it 'TC626: Verify Help icon exists on Overview', tc626: true do
      overview.navigate_to_overview
      expect(overview.clinicaRemindersHB_element).to be_present
      expect(overview.problemsHB_element).to be_present
      expect(overview.immunizationsHB_element).to be_present
      expect(overview.activeMedsHB_element).to be_present
      expect(overview.encountersHB_element).to be_present
      expect(overview.allergyHB_element).to be_present
      expect(overview.reportsHB_element).to be_present
      expect(overview.vitalsHB_element).to be_present
      expect(overview.labResultsHB_element).to be_present
    end

    it 'TC626: Verify Help icon exists on Coversheet', tc626: true do
      coversheet.navigate_to_coversheet
      expect(coversheet.vitalsHB_element).to be_present
      expect(coversheet.activeMedsHB_element).to be_present
      expect(problems.problemsHB_element).to be_present
      expect(appointments.appointmentVisitHB_element).to be_present
      expect(immunization.immunizationsHB_element).to be_present
      expect(orders.ordersHB_element).to be_present
      expect(coversheet.labResultsHB_element).to be_present
      expect(coversheet.communityHealthSummHB_element).to be_present
      expect(coversheet.allergyHB_element).to be_present
    end

    it 'TC626: Click Help icon with information', tc626: true do
      coversheet.vitalsHB
      switch_window_to_window_handle_last
      Watir::Wait.until { @driver.url == (BASE_URL + 'help/eHMP_User%20Guide_v2%202_03262015_WORKING.htm#_Toc415212142') }
      expect(@driver.url).to eq(BASE_URL + 'help/eHMP_User%20Guide_v2%202_03262015_WORKING.htm#_Toc415212142')
      switch_window_to_window_handle_first
    end

    it 'TC626: Verify Save-to-pdf button exists on the UserGuide page' do
      coversheet.vitalsHB
      switch_window_to_window_handle_last
      expect(comm_elem.saveButton_element).to be_present
      switch_window_to_window_handle_first
    end

    it 'TC626: Click Help icon without information', tc626: true do
      coversheet.myWorkspace_btn
      my_workspace.myWorkspaceHelp_element.when_visible(20)
      my_workspace.myWorkspaceHelp
      switch_window_to_window_handle_last
      expect(@driver.url).to eq(BASE_URL + 'help/eHMP_Help%20Content%20Not%20Available.htm')
      switch_window_to_window_handle_first
    end
  end
end
