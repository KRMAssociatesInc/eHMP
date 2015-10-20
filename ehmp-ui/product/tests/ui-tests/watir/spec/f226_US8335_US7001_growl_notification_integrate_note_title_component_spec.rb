#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/notes_write_back_page'
require_relative '../lib/pages/modal_popup_page'
require_relative '../lib/common/ehmp_constants.rb'

# Team: Saturn

describe 'F226 US8335 f226_US8335_US7001_growl_notification_integrate_note_title_component_spec.rb', future: true do |note_date_time|
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
    @common_test = CommonTest.new(@driver)
    @notes = NotesWriteBackPage.new(@driver)
    @modal = ModalPage.new(@driver)
  end

  after(:all) do
    @driver.close
  end

  context 'US8335|TC#1170: Growl Notification verification from New Note form and choosing close button ' do
    it 'login and set visit information' do
      @common_test.login_with_default
      @common_test.mysite_patient_search('thirteen', 'thirteen,PATIENT')
      @common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '09/07/1994 08:00')
      @notes.growlMsg_element.when_not_visible(MEDIUM_TIMEOUT)
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it '. Verify presence of the Notes Button and select Notes button' do
      @notes.notesbtn_element.when_visible(MEDIUM_TIMEOUT)
      expect(@notes.notesbtn?).to eq(true), 'Note button is not present'
      @notes.notesbtn
    end

    it '. Create a Note from New Note Form and verify growl success notification' do
      @notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      @notes.newNotebtn
      # note_date_time = @notes.add_a_new_note('CLINICAL WARNING', '01/01/2015', '')
      note_date_time = @notes.add_a_new_note('ADVANCE DIRECTIVE', '', '')
      @notes.growlMsg_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.growlMsg?).to eq(true), 'Success message did not display'
      expect(@notes.growlMsg_element.text.strip.include?('Success!')).to eq(true)
      #      @notes.allNoteHeader_element.when_visible(SMALL_TIMEOUT)
      #      expect(@notes.allNoteHeader_element.text.strip).to eq('All Notes')
    end
  end

  context 'US8335|TC#1199: Growl Notification verification from Edit Note form and choosing Sign button ' do
    it '. From Edit Note Form choose sign option and verify growl success notification' do
      @notes.open_notes_form
      single_note = @notes.search_unsigned_notes('ADVANCE DIRECTIVE', note_date_time, 'Status: Unsigned')
      single_note[0].click if single_note
      @notes.editButton_element.when_visible(SMALL_TIMEOUT)
      @notes.editButton
      @notes.noteTitleDropDown_element.when_visible(SMALL_TIMEOUT)
      @notes.select_this_note('ANESTHESIA POSTOP ASSESSMENT')
      @notes.noteBody_element.when_visible(SMALL_TIMEOUT)
      @notes.noteBody = 'This is a ANESTHESIA POSTOP ASSESSMENT note'
      @notes.signFormBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.signFormBtn
      @notes.signCancelBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.growlMsg_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.growlMsg?).to eq(true), 'Success message did not display'
      expect(@notes.growlMsg_element.text.strip.include?('Success!')).to eq(true)
      @notes.signCancelBtn
      @notes.formCloseBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.formCloseBtn
    end
  end

  # COMMENT OUT THIS CONTEXT BLOCK DUE TO US7001 IS PUT ON HOLD UNTIL MARS RELEASE THE READY COMPONENT FOR US.
  # context 'US7001|TC#605: Integrate the Unsigned Notes Title field component from Mercury' do
  #   it '. Verify that the Title defaults to the previously selected Title' do
  #     @notes.open_notes_form
  #     @notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
  #     @notes.newNotebtn
  #     expect(@notes.defaultNoteTitle.strip).to eq('CLINICAL WARNING')
  #   end
  #
  #   it '. Verify that title can be changed by selecting another one from the list' do
  #     select_this_note('EMERGENCY DEPARTMENT NOTE')
  #     @notes.defaultNoteTitle_element.when_visible(SMALL_TIMEOUT)
  #     expect(@notes.defaultNoteTitle.strip).to eq('EMERGENCY DEPARTMENT NOTE')
  #   end
  #
  #   it '. Verify when type in one or two character, no matches return; When type in three or more characters, the matches start return' do
  #     @notes.noteTitleDropDown_element.click
  #
  #     title_search_scenario = [
  #       { title_begins: 'ad', expected_result: 'ASI-ADDICTION SEVERITY INDEX|ADVANCE DIRECTIVE|NURSING ADMISSION ASSESSMENT' },
  #       { title_begins: 'add', expected_result: 'ASI-ADDICTION SEVERITY INDEX' },
  #       { title_begins: 'ing', expected_result: 'CLINICAL WARNING|NURSING ADMISSION ASSESSMENT' },
  #       { title_begins: 'q', expected_result: 'No results found' }
  #     ]
  #
  #     title_search_scenario.each do |scenario|
  #       @notes.noteTitleDropDown_element.click
  #       @notes.titleSearchField_element.when_visible(SMALL_TIMEOUT)
  #       @notes.titleSearchField = scenario[:title_begins]
  #       Watir::Wait.until(SMALL_TIMEOUT) { @notes.noResultFoundMsg? || notes.highlightedTitle? }
  #
  #       if scenario[:expected_result] != 'No results found'
  #         return_title_arry = scenario[:expected_result].split('|')
  #         judge_flag = 1
  #         j = 0
  #         return_title_arry.each do |record|
  #           found_it = @notes.title_in_the_list?(record[j], j + 1)
  #           judge_flag *= found_it
  #           j += 1
  #         end
  #         expect(judge_flag).not_to eq(0), 'Returned results not in the right order'
  #       else
  #         expect(@notes.noResultFoundMsg.strip).to eq(scenario[:expected_result])
  #       end
  #     end
  #   end
  # end
end
