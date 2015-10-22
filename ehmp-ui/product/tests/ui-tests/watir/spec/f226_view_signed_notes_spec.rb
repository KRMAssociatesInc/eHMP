#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/notes_write_back_page'
require_relative '../lib/pages/patient_overview_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/common/ehmp_constants.rb'

# Team: Saturn

describe 'F226: US7467, US7739 File: f226_view_signed_notes_spec.rb', future: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
  end

  after(:all) do
    @driver.close
  end

  let(:overview) { PatientOverview.new(@driver) }
  let(:common_test) { CommonTest.new(@driver) }
  let(:notes) { NotesWriteBackPage.new(@driver) }
  let(:visit_info) { VisitInformationPage.new(@driver) }
  let(:modal) { ModalPage.new(@driver) }
  let(:search) { SearchPage.new(@driver) }

  context 'F226: US7941, TC#627, TC#733 - Recently Signed Notes' do
    it '. Login as default and search by eight,Patient' do
      common_test.login_with_default
      common_test.mysite_patient_search('eight,PATIENT', 'Eight,PATIENT')
    end

    it '. Overview screen is active' do
      overview.screenNm_element.when_visible(SMALL_TIMEOUT)
      expect(overview.screenNm_element.text.strip.include?('Overview')).to eq(true)
    end

    it '. Click the Notes button' do
      notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      notes.notesbtn
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
    end

    it '. Verify presence of All Notes header' do
      notes.allNoteHeader_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.allNoteHeader?).to eq(true), 'All Note header is not present'
    end

    it '. Verify presence of Recently Signed header' do
      notes.signedHeader_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.signedHeader?).to eq(true), 'Recently Signed header is not present'
      expect(notes.signedHeader.strip.include?('RECENTLY SIGNED')).to eq(true)
    end

    it '. Verified Recently signed section does not displays notes since no notes were signed in last 30 days ' do
      expect(notes.signed_title1?).to eq(false), 'Signed Title  is  present'
      expect(notes.signed_date1?).to eq(false), 'Signed Date/time is  present'
      expect(notes.signed_status1?).to eq(false), 'Signed Status is  present'
    end

    it '. Search by Twelve,Patient' do
      search.returnToPatientSrch_element.when_visible
      search.returnToPatientSrch_element.click
      common_test.mysite_patient_search('twelve', 'TWELVE,PATIENT')
      @login.currentUser_element.when_visible
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it '. Select Visit' do
      common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '12/23/1993 09:45')
    end

    it '. Click the Notes button and then click Add a New Note button from the slide out tray' do
      notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      notes.notesbtn
      notes.newNotebtn_element.when_visible(MEDIUM_TIMEOUT)
      notes.newNotebtn
      notes.noteTitleDropDown_element.when_visible(LARGE_TIMEOUT)
      notes.select_this_note('ADVANCE DIRECTIVE')
    end

    it '. Verify presence of input field Date' do
      notes.dateField_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.dateField?).to eq(true), 'Date input field is not present'
    end

    it '. Verify presence of input field Time' do
      notes.timeField_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.timeField?).to eq(true), 'Time input field is not present'
      common_test.enter_into_time_field(notes.timeField_element, '23:59')
    end

    it '. Type text in the Note field' do
      notes.noteBody_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.noteBody?).to eq(true), 'Note text area is not present'
      notes.noteBody = 'Agilex builds innovative digital government solutions to enable a healthier
      more prosperous America. As part of Accenture Federal Services (AFS), Agilex can help address the nation largest and most
      complex challenges, using its leadership in agile development to deliver mission results and performance improvements faster.
      Together with Accenture global resources and broad portfolio of offerings and the government expertise and delivery excellence of AFS,
      Agilex helps federal agencies capitalize on digital technologies – including analytics, cloud and mobile computing – to advance their mission.'
    end

    it '. US8336: Select Sign button with future time' do
      notes.signFormBtn
      notes.errorMessage_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.errorMessage_element.text.strip).to eq('Time must not be in the future')
    end

    it '. US8336: Select Sign button with future date' do
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      common_test.enter_into_date_field(notes.dateField_element, '04/30/2025')
      notes.signFormBtn
      notes.errorMessage_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.errorMessage_element.text.strip).to eq('Reference Date must not be in the future')
    end

    it '. End of the Test' do
      # End of Test
    end
  end
end
