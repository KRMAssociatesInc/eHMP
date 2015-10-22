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

describe 'F226-12 US6979 f226-12_notes_preview_spec.rb', future: true do
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

  context 'TC#599: Notes preview view verification ' do |note_date_time, dummy_text|
    it '. Search for patient and set visit info' do
      @common_test.login_with_default
      @common_test.mysite_patient_search('thirteen', 'thirteen,PATIENT')
      @common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '09/07/1994 08:00')
    end

    it '. Verify presence of the Notes Button and select Notes button and then create a note' do
      @notes.open_notes_form
      @notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      @notes.firstNoteInTray_element.when_visible(SMALL_TIMEOUT)
      @notes.newNotebtn
      note_date_time = @notes.add_a_new_note('ADVANCE DIRECTIVE', '', '')
    end

    it '. Verify from all notes user can select a note for viewing in preview' do
      @notes.open_notes_form
      puts 'note_date_time=' + note_date_time
      single_note = @notes.search_unsigned_notes('ADVANCE DIRECTIVE', note_date_time, 'Status: Unsigned')
      single_note[0].click if single_note
      @notes.viewBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.viewBtn?).to eq(true), 'cannot locate view button'
      @notes.viewBtn
      @notes.previewBody_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.previewBody?).to eq(true), 'preview modal did not open'
    end

    it '. Verify The Note Title, Date and Time of Note, Author, and Status items are displayed in the header, followed by a separator and the Note Body ' do
      @notes.previewModalContent_element.when_visible(SMALL_TIMEOUT)
      @notes.previewBody_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.previewTitle_element.text.strip).to eq('ADVANCE DIRECTIVE')
      expect(@notes.previewDateTime_element.text.strip).to eq(note_date_time)
      expect(@notes.previewAuthor_element.text.strip).to eq('USER,PANORAMA')
      expect(@notes.previewEncounter_element.text.strip).to eq('General Medicine: 09/07/1994')
      expect(@notes.previewStatus_element.text.strip).to eq('UNSIGNED')
      expect(@notes.previewContent_element.text.strip).to eq('This is a ADVANCE DIRECTIVE note')
      @notes.previewCloseBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.previewCloseBtn
      @notes.previewCloseBtn_element.when_not_visible(SMALL_TIMEOUT)
    end

    #    Singature block can't be verified through automation, as only notes more than 30 days old are not shown.
    #    it '. Verify signature block and when another Note is chosen for preview then previous preview is closed ' do
    #    end

    it '. Verify from New Note user can choose options icon and preview current note from there' do
      @notes.open_notes_form
      @notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      @notes.firstNoteInTray_element.when_visible(SMALL_TIMEOUT)
      @notes.newNotebtn
      @notes.noteTitleDropDown_element.when_visible(SMALL_TIMEOUT)
      @notes.select_this_note('ANESTHESIA POSTOP ASSESSMENT')
      dummy_text = 'This is dummy data to test the options gear and preview button functionality'
      @notes.noteBody_element.when_visible(SMALL_TIMEOUT)
      @notes.noteBody = dummy_text
      Watir::Wait.until { @notes.noteBody != '' }
      note_date_time = @notes.dateField + ' - ' + @notes.timeField
      @notes.optionsGear_element.when_visible(SMALL_TIMEOUT)
      @notes.optionsGear_element.click
      @notes.previewActionBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.previewActionBtn
      @notes.previewModalContent_element.when_visible(SMALL_TIMEOUT)
      @notes.previewContent_element.when_visible(SMALL_TIMEOUT)
      content_string = @notes.previewContent_element.text.strip
      expect(content_string).to eq(dummy_text)
      @notes.previewCloseBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.previewCloseBtn
      # explicitly close the NewNote so Edit in the next it block works.  To be fixed later
      @notes.closeBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.closeBtn
      @notes.closeBtn_element.when_not_visible(SMALL_TIMEOUT)
    end

    it '. Verify from Edit Note user can choose options icon and preview current note from there' do
      #      @notes.allNoteHeader_element.when_visible(SMALL_TIMEOUT)
      #     expect(@notes.allNoteHeader_element.text.strip).to eq('All Notes')
      @notes.open_notes_form
      single_note = @notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time, 'Status: Unsigned')
      single_note[0].click if single_note
      @notes.editButton_element.when_visible(SMALL_TIMEOUT)
      @notes.editButton
      expect(@notes.newNoteLabel_element.text.strip).to eq('Edit Note')
      @notes.optionsGear_element.when_visible(SMALL_TIMEOUT)
      @notes.optionsGear_element.click
      @notes.previewActionBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.previewActionBtn
      @notes.previewModalContent_element.when_visible(SMALL_TIMEOUT)
      @notes.previewContent_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.previewContent_element.text.strip).to eq(dummy_text)
      @notes.previewCloseBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.previewCloseBtn
      @notes.closeBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.closeBtn
      @notes.closeBtn_element.when_not_visible(SMALL_TIMEOUT)
    end
  end
end
