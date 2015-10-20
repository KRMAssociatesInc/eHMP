#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'rspec'
require 'watir-webdriver'

require_relative 'rspec_helper'
require_relative '../lib/pages/login_page'
require_relative '../lib/pages/common_test_page'
require_relative '../lib/pages/notes_write_back_page'
require_relative '../lib/pages/visit_information_page'
require_relative '../lib/pages/modal_popup_page'
require_relative '../lib/pages/search_page'
require_relative '../lib/common/ehmp_constants'

# Team: Saturn
# New Note created, Saved and the list refreshed
# Edit New note and the list refreshed

describe 'F226 US6431, US8370, US7735, US8336 f226_add_unsigned_note_spec.rb', future: true do |today|
  include DriverUtility
  before(:all) do
    initialize_configurations(BASE_URL, BROWSER_NAME)
    @login = LoginPage.new(@driver)
  end

  after(:all) do
    @driver.close
  end

  let(:common_test) { CommonTest.new(@driver) }
  let(:notes) { NotesWriteBackPage.new(@driver) }
  let(:visit_info) { VisitInformationPage.new(@driver) }
  let(:modal) { ModalPage.new(@driver) }
  let(:search) { SearchPage.new(@driver) }

  context 'TC#380, TC#434 Create, Save and Edit Notes' do |note_date_time|
    it '. Login as default and search by TWELVE,Patient' do
      common_test.login_with_default
      common_test.mysite_patient_search('Twelve,Patient', 'Twelve,Patient')
      common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '12/23/1993 09:45')
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it '. Click the Notes button and  New Note button ' do
      notes.notesbtn_element.when_visible(MEDIUM_TIMEOUT)
      notes.notesbtn
      notes.newNotebtn_element.when_visible(MEDIUM_TIMEOUT)
      notes.newNotebtn
    end

    it '. Verify presence of input field Date' do
      notes.dateField_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.dateField?).to eq(true), 'Date input field is not present'
    end

    it '. Verify presence of input field Time and type Future Time' do
      notes.timeField_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.timeField?).to eq(true), 'Time input field is not present'
      common_test.enter_into_time_field(notes.timeField_element, '23:59')
    end

    it '. Type in the Note body text ' do
      notes.noteBody_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.noteBody?).to eq(true), 'Note text area is not present'
      notes.noteBody = 'Agilex builds innovative digital government solutions to enable a healthier
      more prosperous America. As part of Accenture Federal Services (AFS), Agilex can help address the nation largest and most
      complex challenges, using its leadership in agile development to deliver mission results and performance improvements faster.
      Together with Accenture global resources and broad portfolio of offerings and the government expertise and delivery excellence of AFS,
      Agilex helps federal agencies capitalize on digital technologies – including analytics, cloud and mobile computing – to advance their mission.'
    end

    it '. Select Note Title from the drop down list' do
      notes.newNoteLabel_element.when_visible
      expect(notes.newNoteLabel.strip).to eq('New Note')
      notes.select_this_note('ADVANCE DIRECTIVE')
    end

    it '. US8336: Select Close button with future time' do
      notes.closeBtn_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.closeBtn?).to eq(true), 'Close button is not present'
      notes.closeNewNoteBttn
      notes.errorMessage_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.errorMessage_element.text.strip).to eq('Time must not be in the future')
    end

    it '. US8336: Select Close button with future date' do
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      tomorrow = get_date_nth_days_from_now(1, '%m/%d/%Y')
      common_test.enter_into_date_field(notes.dateField_element, tomorrow)
      notes.closeNewNoteBttn
      notes.errorMessage_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.errorMessage_element.text.strip).to eq('Reference Date must not be in the future')
    end

    it '. Select Close button with Valid data' do
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      today = get_date_nth_days_from_now(0, '%m/%d/%Y')
      common_test.enter_into_date_field(notes.dateField_element, today)
      current_time = get_date_nth_days_from_now(0, '%H:%M')
      # puts 'current_time =' + current_time
      common_test.enter_into_time_field(notes.timeField_element, current_time)
      # Retrieve the final date/time value being set
      note_date_time = notes.dateField + ' - ' + notes.timeField
      # puts 'note_date_time=' + note_date_time
      notes.closeBtn_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.closeBtn?).to eq(true), 'Close button is not present'
      notes.closeBtn
      notes.closeBtn_element.when_not_visible(MEDIUM_TIMEOUT)
    end

    #    it '. US8370 - Verify the New Notes list refreshed, and select Note' do
    #      single_note = notes.search_unsigned_notes('ADVANCE DIRECTIVE', '04/30/2015 - 23:59', 'Status: Unsigned')
    #      single_note.click if single_note
    #    end

    it '. US7735 TC#740 Edit existing Note' do
      notes.open_notes_form
      single_note = notes.search_unsigned_notes('ADVANCE DIRECTIVE', note_date_time, 'Status: Unsigned')
      # single_note = notes.find_selected_note('ADVANCE DIRECTIVE', '04/30/2015 - 23:59')
      single_note[0].click if single_note
      notes.editButton_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.editButton?).to eq(true), 'Sign button is not present'
      notes.editButton
      expect(notes.newNoteLabel_element.text.strip).to eq('Edit Note')
      # Edit title
      notes.select_this_note('ANESTHESIA POSTOP ASSESSMENT')
      # edit date
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      # puts 'today=' + today
      common_test.enter_into_date_field(notes.dateField_element, today)
      note_date_time = notes.dateField + ' - ' + notes.timeField
      # Close modal
      notes.closeNewNoteBttn
      notes.closeNewNoteBttn_element.when_not_visible(MEDIUM_TIMEOUT)
    end

    it '. US8370 -Verify the Edit Note list refreshed' do
      notes.open_notes_form
      single_note = notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time, 'Status: Unsigned')
      # single_note = notes.find_selected_note('CRISIS NOTE', '05/30/2015 - 23:59')
      single_note[0].click if single_note
      # verify that found the newly edited note
      expect(single_note).not_to eq(nil)
    end

    it '. Adding new note again to test the null date field' do
      notes.newNotebtn_element.when_visible(MEDIUM_TIMEOUT)
      notes.newNotebtn
    end

    it '. Type in the Note body text ' do
      notes.noteBody_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.noteBody?).to eq(true), 'Note text area is not present'
      notes.noteBody = 'Agilex builds innovative digital government solutions to advance their mission.'
    end

    it '. Select Note Title from the drop down list' do
      notes.newNoteLabel_element.when_visible
      expect(notes.newNoteLabel.strip).to eq('New Note')
      notes.select_this_note('ADVANCE DIRECTIVE COMPLETED')
    end

    it '. Select Close button with valid empty date' do
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      notes.closeBtn_element.when_visible(MEDIUM_TIMEOUT)
      expect(notes.closeBtn?).to eq(true), 'Close button is not present'
      notes.closeNewNoteBttn
      notes.closeNewNoteBttn_element.when_not_visible(MEDIUM_TIMEOUT)
      notes.growlMsg_element.when_visible(SMALL_TIMEOUT)
      expect(notes.growlMsg?).to eq(true), 'Success message did not display'
      expect(notes.growlMsg_element.text.strip.include?('Success!')).to eq(true)
    end

    it '. US8370 -TC#1403 Verify the New Note list refreshed wthout date and time' do
      notes.open_notes_form
      single_note = notes.search_unsigned_note_with_this_title('ADVANCE DIRECTIVE COMPLETED')
      single_note[0].click if single_note
    end
  end
end
