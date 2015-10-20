#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/notes_write_back_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/common/ehmp_constants.rb'

# Team: Saturn

describe 'F226 US6437, US6428, US6429, f226_notes_write_back_spec.rb', future: true do
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)
    @notes = NotesWriteBackPage.new(@driver)
    @search = SearchPage.new(@driver)
  end

  after(:all) do
    @driver.close
  end

  context 'TC#591, TC#436, TC#367 : Validate fields, labels, and buttons ' do
    it 'login and set visit information' do
      @common_test.login_with_default
      @common_test.mysite_patient_search('thirteen', 'thirteen,PATIENT')
      @common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '09/07/1994 08:00')
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it '. Open new Note form' do
      @notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      @notes.notesbtn
      @notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      @notes.newNotebtn
    end

    it '. Verify presence of the label New Note' do
      @notes.newNoteLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.newNoteLabel_element.text.strip).to eq('New Note')
    end

    it '. Verify presence of the label Note Title' do
      @notes.noteTitleLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.noteTitleLabel_element.text.strip).to eq('Title *')
    end

    it '. Verify presence of select list Note Title' do
      @notes.noteTitleDropDown_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.noteTitleDropDown?).to eq(true), 'Note Title select list is not present'
      @notes.select_this_note('ADVANCE DIRECTIVE')
    end

    it '. Verify presence of label Date' do
      @notes.dateLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.dateLabel_element.text.strip).to eq('Date *')
    end

    it '. Verify presence of input field Date' do
      @notes.dateField_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.dateField?).to eq(true), 'Date input field is not present'
      @notes.dateField_element.clear
      @common_test.enter_into_date_field(@notes.dateField_element, '06/13/2015')
    end

    it '. Verify presence of label Time' do
      @notes.timeLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.timeLabel_element.text.strip).to eq('Time *')
    end

    it '. US6437 - Verify presence of input field Time' do
      @notes.timeField_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.timeField?).to eq(true), 'Time input field is not present'
      @common_test.enter_into_date_field(@notes.timeField_element, '11:00')
    end

    it '. Verify presence of the label Note' do
      @notes.noteBodyLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.noteBodyLabel_element.text.strip).to eq('Note *')
    end

    it '. Verify presence of Note text area' do
      @notes.noteBody_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.noteBody?).to eq(true), 'Note text area is not present'
      @notes.noteBody = 'This is a crisis note'
    end

    it '. Verify presence of button Sign' do
      @notes.signFormBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signFormBtn?).to eq(true), 'Sign button is not present'
    end

    it '. Verify presence of button Close' do
      @notes.closeBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.closeBtn?).to eq(true), 'Close button is not present'
      @notes.closeBtn
    end
  end
end
