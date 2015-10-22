#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/common_elements_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/vitals_gist_page'
require_relative '../lib/pages/visit_information_page'

describe 'Story#7613: Visit Management Form', debug: true do
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
  let(:vital) { VitalsGistPage.new(@driver) }
  let(:overview) { PatientOverview.new(@driver) }
  let(:comm_elem) { CommonElementsPage.new(@driver) }

  context 'TC#482: Visit Management: Clinical Appointments' do
    include DriverUtility

    patient_name = 'Ten,Patient'
    visit_name = 'location_appointment_6'
    location_name = 'General Medicine'

    it 'TC626: select and add visit', acceptance: true do
      @common_test.mysite_patient_search(patient_name, patient_name)
    end

    it 'select and confirm the visit added succefully' do
      visit_button_click = %w(Cancel Confirm)

      visit_name = 'location_appointment_6'
      location_name = 'General Medicine'

      visit_button_click.each do |scenario|
        overview.navigate_to_overview
        vital.vitals_gist_applet_finish_loading?
        visit.selVisitInfo_element.when_visible(20)
        visit.selVisitInfo_element.click
        visit.visitApts_element.when_visible(20)
        expect(visit.setVisit_element.disabled?).to be_truthy
        visit.click_the_visit_tobe_added(visit_name)
        visit.encounterLoc_element.when_visible(20)
        expect(visit.encounterLoc_element.text).to include(location_name)
        visit.setVisit_element.when_visible(20)
        expect(visit.setVisit_element.enabled?).to be_truthy

        if scenario == 'Cancel'
          visit.visitCan_element.when_visible(20)
          visit.visitCan
          visit.selVisitInfo_element.when_visible(20)
        else
          visit.setVisit_element.when_visible(20)
          expect(visit.setVisit_element.enabled?).to be_truthy
          visit.setVisit
        end
      end
    end
  end

  context 'TC#482: Visit Management : Hospital Admissions' do
    visit_name = 'location_visit_4'
    location_name = 'Gen Med'

    it 'select and confirm the visit added succefully' do
      visit_button_click = %w(Cancel Confirm)

      visit_button_click.each do |scenario|
        visit.selVisitInfo_element.when_visible(20)
        visit.selVisitInfo_element.click
        visit.visitAdmts_element.when_visible(20)
        visit.visitAdmts
        expect(visit.visitAdmts_element).to be_truthy
        visit.click_the_visit_tobe_added(visit_name)
        visit.encounterLoc_element.when_visible(20)
        expect(visit.encounterLoc_element.text).to include(location_name)
        visit.setVisit_element.when_visible(20)
        expect(visit.setVisit_element.enabled?).to be_truthy

        if scenario == 'Cancel'
          visit.visitCan_element.when_visible(20)
          visit.visitCan
          visit.selVisitInfo_element.when_visible(20)
        else
          expect(visit.setVisit_element.enabled?).to be_truthy
          visit.setVisit_element.when_visible(20)
          visit.setVisit
        end
      end
    end
  end
end
