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
require_relative '../lib/common/ehmp_constants'

# Team: Saturn

describe 'F226 US8461 : f226_notes_form_gear_menu_items.rb', acceptance: true do
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

  context 'TC#1125 : Verify notes form Gear menu Save item functionality' do |today, note_date_time1, note_date_time2, note_date_time3|
    it '. Search for patient and set visit info' do
      common_test.login_with_default
      common_test.mysite_patient_search('TWELVE,PATIENT', 'TWELVE,PATIENT')
      common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '12/23/1993 09:45')
    end

    it '. Open new Note form and verify it' do
      notes.open_notes_form
      notes.newNotebtn_element.when_visible(LARGE_TIMEOUT)
      notes.newNotebtn
      expect(notes.newNoteLabel.strip).to eq('New Note')
    end

    it '. Fill up  new form fields to verify Save item' do
      # Set title
      notes.select_this_note('ADVANCE DIRECTIVE')
      # Set date
      notes.dateField_element.when_visible(LARGE_TIMEOUT)
      notes.dateField_element.clear
      today = get_date_nth_days_from_now(0, '%m/%d/%Y')
      common_test.enter_into_date_field(notes.dateField_element, today)
      # Set time
      notes.timeField_element.when_visible(LARGE_TIMEOUT)
      notes.timeField_element.clear
      notes.dateField_element.send_keys :enter
      current_time = get_date_nth_days_from_now(0, '%H:%M')
      common_test.enter_into_date_field(notes.timeField_element, current_time)
      # Set notes text
      notes.noteBody_element.when_visible(LARGE_TIMEOUT)
      notes.noteBody = 'F226 US8461: Testing gear menu Save item'
      note_date_time1 = notes.dateField + ' - ' + notes.timeField
      puts 'note_date_time1=' + note_date_time1
    end

    it '. Verify behaviour of gear menu item - Save' do
      notes.optionsGear_element.when_visible(LARGE_TIMEOUT)
      notes.optionsGear_element.click
      notes.saveActionBtn_element.when_visible(LARGE_TIMEOUT)
      notes.saveActionBtn
      expect(notes.newNoteLabel.strip).to eq('New Note'), 'Notes form should stay open'
      notes.optionsGear_element.when_visible(LARGE_TIMEOUT)
      notes.formCloseBtn_element.when_visible(SMALL_TIMEOUT)
      notes.formCloseBtn
      notes.optionsGear_element.when_not_visible(LARGE_TIMEOUT)
    end

    it '. Update new form fields to verify Close item' do
      notes.open_notes_form
      notes.open_new_note_form
      # Set date
      notes.dateField_element.when_visible(LARGE_TIMEOUT)
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      common_test.enter_into_date_field(notes.dateField_element, today)
      # Set time
      notes.timeField_element.when_visible(LARGE_TIMEOUT)
      notes.timeField_element.clear
      notes.timeField_element.send_keys :enter
      current_time = get_date_nth_days_from_now(0, '%H:%M')
      common_test.enter_into_date_field(notes.timeField_element, current_time)
      # Set notes text
      notes.noteBody_element.when_visible(LARGE_TIMEOUT)
      notes.noteBody = 'F226 US8461: Testing gear menu Close item'
      notes.select_this_note('ANESTHESIA POSTOP ASSESSMENT')
      note_date_time2 = notes.dateField + ' - ' + notes.timeField
      puts 'note_date_time2=' + note_date_time2
    end

    it '. Verify behaviour of gear menu item - Close' do
      notes.optionsGear_element.when_visible(LARGE_TIMEOUT)
      notes.optionsGear_element.click
      notes.closeActionBtn_element.when_visible(LARGE_TIMEOUT)
      notes.closeActionBtn
      notes.closeActionBtn_element.when_not_visible(LARGE_TIMEOUT)
    end

    it '. Verify the note in the Notes list created with Save and updated with Close menu item' do
      #  notes.open_notes_form
      selected_note = notes.search_unsigned_notes('ADVANCE DIRECTIVE', note_date_time1, 'Status: Unsigned')
      expect(selected_note[0].text.strip).to eq('ADVANCE DIRECTIVE')
      selected_note = notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time2, 'Status: Unsigned')
      expect(selected_note[0].text.strip).to eq('ANESTHESIA POSTOP ASSESSMENT')
    end

    it '. Select Note and click Edit button' do
      selected_note = notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time2, 'Status: Unsigned')
      selected_note[0].click
      notes.editButton
    end

    it '. Update Edit form fields to verify Close item' do
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      yesterday = get_date_nth_days_ago(1, '%m/%d/%Y')
      common_test.enter_into_date_field(notes.dateField_element, yesterday)
      # Set time
      notes.timeField_element.clear
      notes.timeField_element.send_keys :enter
      current_time = get_date_nth_days_from_now(0, '%H:%M')
      common_test.enter_into_date_field(notes.timeField_element, current_time)
      # Set notes text
      notes.noteBody_element.when_visible(LARGE_TIMEOUT)
      notes.noteBody = 'F226 US8461: Testing gear menu Close item for Edit Form'
      note_date_time3 = notes.dateField + ' - ' + notes.timeField
      puts 'note_date_time3=' + note_date_time3
    end

    it '. Verify behaviour of gear menu item - Close (Edit Form)' do
      notes.optionsGear_element.when_visible(LARGE_TIMEOUT)
      notes.optionsGear_element.click
      notes.closeActionBtn_element.when_visible(LARGE_TIMEOUT)
      notes.closeActionBtn
      notes.optionsGear_element.when_not_visible(LARGE_TIMEOUT)
    end

    it '. Verify the note in the Notes list updated with Close menu item (Edit Form)' do
      notes.open_notes_form
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      notes.firstNoteInTray_element.when_visible(SMALL_TIMEOUT)
      selected_note = notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time3, 'Status: Unsigned')
      expect(selected_note[0].text.strip).to eq('ANESTHESIA POSTOP ASSESSMENT')
    end
  end
end
