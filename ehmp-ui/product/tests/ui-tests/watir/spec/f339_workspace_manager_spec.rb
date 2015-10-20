#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative '../lib/module/util.rb'
require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/workspace_manager_page'
require_relative '../lib/pages/screen_editor_page'

include Util

describe 'Feature No. 339: f339_workspace_manager_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    # @driver = Util.login
    @common_test = CommonTest.new(@driver)
    @search = SearchPage.new(@driver)
    @common_test.login_with('pu1234', 'pu1234!!', 'PANORAMA')
  end

  after(:all) do
    # Util.quit
    @driver.close
  end

  let(:workspace_manager) { WorkspaceManagerPage.new(@driver) }
  let(:common_elements) { CommonElementsPage.new(@driver) }
  let(:screen_editor) { ScreenEditorPage.new(@driver) }

  context 'US5719: Delete alert should appear when a workspace is deleted', us5719: true do
    it 'TC457: User logs in and searches for Eight, Patient' do
      patient_name = 'Eight,Patient'
      @common_test.patient_search(patient_name)
      @search.patientInTheList_element.when_visible
      @search.click_the_right_patient_from_table(patient_name)
      @search.firstConfirm_element.when_visible
      @search.firstConfirm
      @search.secondConfirmBtn_element.when_visible
      @search.secondConfirmBtn
    end

    it 'TC457: User adds a user defined screen in the workspace manager' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
      orginal_rows_count = workspace_manager.udw_rows_elements.length
      workspace_manager.add_workspace_element.when_visible
      workspace_manager.add_workspace
      expect(workspace_manager.udw_rows_elements.length).to eq(orginal_rows_count + 1)
    end

    it 'TC457: User launches newly added user defined screen' do
      workspace_manager.customize_workspace(workspace_manager.udw_rows_elements.length)
      screen_editor.done_editing_element.when_visible
      screen_editor.done_editing
    end

    it 'TC457: User navigates to workspace manager' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
    end

    it 'TC457: Verify that pop up window asks for confirmation when user attempts to delete and preform deletion' do
      orginal_rows_count = workspace_manager.udw_rows_elements.length
      workspace_manager.delete_workspace(workspace_manager.udw_rows_elements.length)
      expect(workspace_manager.udw_rows_elements.length).to eq(orginal_rows_count - 1)
    end
  end

  context 'US5244: Use the preview button in the workspace manager to view a preview', us5244: true do
    xit 'TC460: User logs in and searches for Eight, Patient' do
      patient_name = 'Eight,Patient'
      @common_test.patient_search(patient_name)
      @search.patientInTheList_element.when_visible
      @search.click_the_right_patient_from_table(patient_name)
      @search.firstConfirm_element.when_visible
      @search.firstConfirm
      @search.secondConfirmBtn_element.when_visible
      @search.secondConfirmBtn
    end

    it 'TC460: User clicks the workspace manager launch button' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
    end

    it 'TC460: User views the preview for "Hypertension CBW"' do
      workspace_manager.hypertension_cbw_preview_element.when_visible
      workspace_manager.hypertension_cbw_preview
    end

    it 'TC460: Validate that the preview modal says "Hypertension CBW Layout"' do
      workspace_manager.hypertension_preview_title_element.when_visible
      expect(workspace_manager.hypertension_preview_title).to eq(' Hypertension CBW Layout')
    end

    it 'TC460: Validate that Hypertension CBW Layout has the same number of applets as the Hypertension screen' do
      number_of_previews = workspace_manager.applet_previews_elements.length
      workspace_manager.exit_preview
      workspace_manager.hypertension_cbw_launch_element.when_visible
      workspace_manager.hypertension_cbw_launch
      common_elements.launch_workspace_manager_element.when_visible
      expect(workspace_manager.hypertension_cbw_applets_elements.length).to eq(number_of_previews)
    end
  end

  context 'US4490: Verify that the cloning works', us4490: true do
    xit 'TC458: User logs in and searches for Eight, Patient' do
      patient_name = 'Eight,Patient'
      @common_test.patient_search(patient_name)
      @search.patientInTheList_element.when_visible
      @search.click_the_right_patient_from_table(patient_name)
      @search.firstConfirm_element.when_visible
      @search.firstConfirm
      @search.secondConfirmBtn_element.when_visible
      @search.secondConfirmBtn
    end

    xit 'TC458: User creates a copy of the "Coversheet" workspace' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
    end

    xit 'TC458: User creates a new UDS and clones it and verify using the previews' do
      number_of_rows = workspace_manager.udw_rows_elements.length
      workspace_manager.add_workspace_element.when_visible
      workspace_manager.add_workspace
      expect(workspace_manager.udw_rows_elements.length).to eq(number_of_rows + 1)
      org_workspace = workspace_manager.udw_rows_elements.length
      workspace_manager.customize_workspace(workspace_manager.udw_rows_elements.length)
      screen_editor.allergies_carousel_applet_element.when_visible
      screen_editor.allergies_carousel_applet_element.send_keys(:return)
      screen_editor.trend_view_selection_element.when_visible
      screen_editor.trend_view_selection
      number_of_applets = screen_editor.screen_editor_applets_elements.length
      screen_editor.done_editing
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
      workspace_manager.add_workspace_element.when_visible
      workspace_manager.duplicate_workspace(org_workspace)
      workspace_manager.preview_workspace("#{org_workspace}-copy")
      expect(workspace_manager.applet_previews_elements.length).to eq(number_of_applets)
      workspace_manager.exit_preview
      workspace_manager.delete_workspace(org_workspace)
      workspace_manager.delete_workspace("#{org_workspace}-copy")
    end
  end

  context 'US5276: Use the workspace manager filter functionality', us5276: true do
    xit 'TC463: User logs in and searches for Eight, Patient' do
      patient_name = 'Eight,Patient'
      @common_test.patient_search(patient_name)
      @search.patientInTheList_element.when_visible
      @search.click_the_right_patient_from_table(patient_name)
      @search.firstConfirm_element.when_visible
      @search.firstConfirm
      @search.secondConfirmBtn_element.when_visible
      @search.secondConfirmBtn
    end

    xit 'TC463: User filters for a workspace' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
      workspace_manager.show_filter_element.when_visible
      workspace_manager.show_filter
      workspace_manager.filter_element.when_visible
      workspace_manager.filter = 'coversheet'
      expect(workspace_manager.workspace_rows_elements.length).to eq(1)
    end
  end

  context 'US5275: User tests for workspace launch and customize functionality', us5275: true do
    xit 'TC464: User logs in and searches for Eight, Patient' do
      patient_name = 'Eight,Patient'
      @common_test.patient_search(patient_name)
      @search.patientInTheList_element.when_visible
      @search.click_the_right_patient_from_table(patient_name)
      @search.firstConfirm_element.when_visible
      @search.firstConfirm
      @search.secondConfirmBtn_element.when_visible
      @search.secondConfirmBtn
    end

    xit 'TC464: User adds a new workspace' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
      workspace_manager.add_workspace_element.when_visible
      workspace_manager.add_workspace
    end

    xit 'TC464: The newly added, empty workspace has a "customize" option' do
      workspace_manager.customize_workspace(workspace_manager.workspace_rows_elements.length)
      screen_editor.allergies_carousel_applet_element.when_visible
      screen_editor.allergies_carousel_applet_element.send_keys(:return)
      screen_editor.trend_view_selection_element.when_visible
      screen_editor.trend_view_selection
      screen_editor.done_editing
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
    end

    xit 'TC464: The customize option is changed too "launch" after applets are added' do
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
      workspace_manager.launch_workspace_manager(workspace_manager.workspace_rows_elements.length)
      common_elements.launch_workspace_manager_element.when_visible
      common_elements.launch_workspace_manager
      workspace_manager.add_workspace_element.when_visible
      workspace_manager.delete_workspace(workspace_manager.workspace_rows_elements.length)
    end
  end
end
