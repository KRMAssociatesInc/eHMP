#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/CIW_page'
require_relative '../lib/pages/conditions_gist_page'
require_relative '../lib/pages/patient_overview_page'

describe 'Story#US7619: f322_CIW_spec.rb', acceptance: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @common_test = CommonTest.new(@driver)
    @cg = ConditionsGistPage.new(@driver)
    @overview = PatientOverview.new(@driver)
    @ciw = CIWPage.new(@driver)

    @common_test.login_with_default
    @common_test.mysite_patient_search('ZZZRETFOURFIFTYEIGHT', 'ZZZRETFOURFIFTYEIGHT,patient')
  end

  after(:all) do
    @ciw.workspaceManager_element.when_visible(@default_timeout)
    @ciw.workspaceManager
    @ciw.delete_workspace('workspace1') if @ciw.workspace1?
    @ciw.delete_workspace('workspace2') if @ciw.workspace2?
    @ciw.closeWorkspaceManager_element.when_visible(@default_timeout)
    @ciw.closeWorkspaceManager_element.click
    @driver.close
  end

  context 'TC#614 : f322_CIW_spec.rb' do
    it '. Overview screen is active' do
      @overview.screenNm_element.when_visible(@default_timeout)
      expect(@overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
    end

    it '. Given user creates workspace and able to see search problem text field' do
      @ciw.workspaceManager_element.when_visible(@default_timeout)
      @ciw.workspaceManager
      @ciw.addNewWorkspace_element.when_visible(@default_timeout)
      @ciw.addNewWorkspace unless @ciw.workspace1?
      @ciw.associationWorkspace1_element.when_visible(@default_timeout)
      @ciw.associationWorkspace1_element.click
      @ciw.searchProblem_element.when_visible(@default_timeout)
      expect(@ciw.searchProblem?).to eq(true), 'Search problem is not present'
    end

    it ' . When user enters "Manic" in the search problems text field then a suggestion list is displayed and user selects problem' do
      @ciw.input_into_search_problem('Manic')
      @ciw.problemResult_element.when_visible(@default_timeout)
      expect(@ciw.problemResult?).to eq(true), 'Problem list is not displayed'
      @ciw.manicBipolarProblem_element.when_visible(@default_timeout)
      @ciw.manicBipolarProblem_element.click
    end

    it ' . And adds "Essential Hypertension" from the suggestion list both problems are added to associated problems list' do
      @ciw.searchProblem_element.when_visible(@default_timeout)
      @ciw.input_into_search_problem('Essen')
      @ciw.hypertensionProblem_element.when_visible(@default_timeout)
      @ciw.hypertensionProblem_element.click
      @ciw.input_into_search_problem('')
      @ciw.associatedProblem_bipolar_element.when_visible(@default_timeout)
      expect(@ciw.associatedProblem_bipolar_element.text.strip.include?('Manic bipolar I disorder')).to eq(true)
      @ciw.associatedProblem_hypertension_element.when_visible(@default_timeout)
      expect(@ciw.associatedProblem_hypertension_element.text.strip.include?('Essential hypertension')).to eq(true)
    end

    it ' . When user searches for text "manic" again the problem "Manic bipolar I disorder" from the suggestion list is disabled' do
      @ciw.input_into_search_problem('Manic')
      @ciw.manicBipolarProblem_element.when_visible(@default_timeout)
      class_name = @ciw.extract_attribute_value_from_problem('Manic bipolar I disorder')
      expect(class_name).to include('disabled'), 'The problem text is not disabled'
    end

    it ' . When user enters "Agilex" in search box then no results are returned; and the User deletes "Manic bipolar I disorder" from workspace1 association' do
      @ciw.searchProblem_element.when_visible(@default_timeout)
      @ciw.input_into_search_problem('Agilex')
      @ciw.noResults_element.when_visible(@default_timeout)
      expect(@ciw.noResults_element.text.strip).to eq('No Results')
      @ciw.workSpaceBanner_element.when_visible(10)
      @ciw.workSpaceBanner_element.click
    end

    it ' . User addes "Essential Hypertension to User defined workspace 2' do
      @ciw.addNewWorkspace_element.when_visible(@default_timeout)
      @ciw.addNewWorkspace unless @ciw.workspace2?
      @ciw.associationWorkspace2_element.when_visible(@default_timeout)
      @ciw.associationWorkspace2_element.click
      @ciw.searchProblem_element.when_visible(@default_timeout)
      @ciw.input_into_search_problem('Essen')
      @ciw.hypertensionProblem_element.when_visible(@default_timeout)
      @ciw.hypertensionProblem_element.click
      @ciw.workSpaceBanner_element.when_visible(@default_timeout)
      @ciw.workSpaceBanner_element.click
      @ciw.searchProblem_element.when_not_visible(@default_timeout)
    end

    it ' . User deletes "Manic bipolar I disorder" from workspace1 association' do
      @ciw.associationWorkspace1_element.when_visible(@default_timeout)
      @ciw.associationWorkspace1_element.click
      @ciw.removeManic_element.when_visible(@default_timeout)
      @ciw.removeManic
      @ciw.workSpaceBanner_element.when_visible(10)
      @ciw.workSpaceBanner_element.click
    end
  end

  context 'TC#762 : f322_CIW_spec.rb' do
    it '. Overview screen is active again' do
      @ciw.closeWorkspaceManager_element.when_visible(@default_timeout)
      @ciw.closeWorkspaceManager_element.click
      @overview.screenNm_element.when_visible(@default_timeout)
      expect(@overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
    end

    it '. Conditions Gist is present' do
      @cg.conditionsGistTitle_element.when_visible(@default_timeout)
      expect(@cg.conditionsGistTitle_element.text.strip.include?('CONDITIONS')).to eq(true)
    end

    it '. From conditions gist problem "Essential Hypertenion" user can navigate to user defined workspace' do
      @cg.essentialHypertensionProblem_element.when_visible(@default_timeout)
      @cg.essentialHypertensionProblem_element.click
      @cg.ciwIcon_element.when_visible(@default_timeout)
      @cg.ciwIcon_element.click
      @overview.screenNm_element.when_visible(@default_timeout)
      @overview.screenNm_element.click
      @cg.workspace1Link_element.when_visible(@default_timeout)
      expect(@cg.workspace1Link_element.text.strip.include?('User Defined Workspace 1')).to eq(true)
      expect(@cg.workspace2Link_element.text.strip.include?('User Defined Workspace 2')).to eq(true)
      @cg.workspace1Link_element.click
      @overview.screenNm_element.when_visible(@default_timeout)
      expect(@overview.screenNm_element.text.strip.include?('User Defined Workspace 1')).to eq(true)
    end
  end
end
