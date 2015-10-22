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

describe 'F226 US7943 : f226-5_notes_action_buttons_spec.rb', future: true do
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

  context 'TC#845 : Verify visibility of action buttons when note is created in ehmp-ui ' do |note_date_time|
    it '. Search for patient and set visit info' do
      @common_test.login_with_default
      @common_test.mysite_patient_search('thirteen', 'thirteen,PATIENT')
      @common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '09/07/1994 08:00')
    end

    it '. Open Note form' do
      @notes.open_notes_form
    end

    it '. Verify Edit, Sign and View are disabled initially when no notes are selected' do
      @notes.editButton_element.when_not_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('edit').include?('hide')).to eq(true), 'Edit button is visible'
      @notes.signBtn_element.when_not_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('sign').include?('hide')).to eq(true), 'Sign Button is present'
      @notes.viewBtn_element.when_not_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('view').include?('hide')).to eq(true), 'View Button is present'
    end

    it '. Create a Note' do
      @notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      @notes.newNotebtn
      note_date_time = @notes.add_a_new_note('ANESTHESIA POSTOP ASSESSMENT', '', '')
      #      @notes.allNoteHeader_element.when_visible(SMALL_TIMEOUT)
      #      expect(@notes.allNoteHeader_element.text.strip).to eq('All Notes')
    end

    it '. Verify Edit, Sign and View are enabled when unsigned note is selected' do
      @notes.open_notes_form
      p note_date_time
      single_note = @notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time, 'Status: Unsigned')
      # single_note = @notes.find_selected_note('CRISIS NOTE', note_date_time)
      single_note[0].click if single_note
      @notes.editButton_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('edit').include?('hide')).to eq(false), 'Edit Button is not present'
      @notes.signBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('sign').include?('hide')).to eq(false), 'Sign Button is not present'
      @notes.viewBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('view').include?('hide')).to eq(false), 'View Button is not present'
    end
  end
  #    context 'TC#997 : Verify visibility of action buttons when note is created in CPRS ' do
  #      it '. Return to the search and search by Ten,Patient again' do
  #        @search.returnToPatientSrch_element.when_visible
  #        @search.returnToPatientSrch_element.click
  #        @common_test.mysite_patient_search('twelve', 'TWELVE,PATIENT')
  #        @login.currentUser_element.when_visible
  #        expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
  #        @common_test.select_visit_info_with_a_location('General Medicine', '05/25/2000 09:00')
  #      end
  #
  #      it '. Open Note form' do
  #        @notes.open_notes_form
  #      end
  #
  #      it '. Verify Edit, Sign and View are disabled initially when no notes are selected' do
  #        @notes.editButton_element.when_not_visible(SMALL_TIMEOUT)
  #        expect(@notes.extract_attribute_value_for_button('edit').include?('hide')).to eq(true), 'Edit button is visible'
  #        @notes.signBtn_element.when_not_visible(SMALL_TIMEOUT)
  #        expect(@notes.extract_attribute_value_for_button('sign').include?('hide')).to eq(true), 'Sign Button is present'
  #        @notes.viewBtn_element.when_not_visible(SMALL_TIMEOUT)
  #        expect(@notes.extract_attribute_value_for_button('view').include?('hide')).to eq(true), 'View Button is present'
  #      end
  #
  #      it '. Verify only View is enabled when unsigned note is selected' do
  #        single_note = @notes.search_unsigned_note_with_this_title('PRIMARY CARE GENERAL NOTE')
  #        single_note[0].click if single_note
  #        @notes.editButton_element.when_not_visible(SMALL_TIMEOUT)
  #        expect(@notes.extract_attribute_value_for_button('edit').include?('hide')).to eq(true), 'Edit button is visible'
  #        @notes.signBtn_element.when_not_visible(SMALL_TIMEOUT)
  #        expect(@notes.extract_attribute_value_for_button('sign').include?('hide')).to eq(true), 'Sign Button is present'
  #        @notes.viewBtn_element.when_visible(SMALL_TIMEOUT)
  #        expect(@notes.extract_attribute_value_for_button('view').include?('hide')).to eq(false), 'View Button is not present'
  #      end
  #    end
end
