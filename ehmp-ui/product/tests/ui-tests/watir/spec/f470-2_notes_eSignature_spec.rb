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

describe 'F470-2 US7032 : f470-2_notes_eSignature_spec.rb', future: true do |note_date_time|
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

  context 'TC#1003 : Verify e-Signature for unsigned notes created in ehmp-ui' do
    it '. Search for patient and set visit info' do
      @common_test.login_with_default
      @common_test.mysite_patient_search('thirteen', 'thirteen,PATIENT')
      @common_test.select_visit_info_with_a_location('GENERAL INTERNAL MEDICINE', '09/07/1994 08:00')
    end

    it '. Select an unsigned note and sign it' do
      @notes.open_notes_form
      @notes.open_new_note_form
      note_date_time = @notes.add_a_new_note('ADVANCE DIRECTIVE', '', '')
      #  @notes.allNoteHeader_element.when_visible(SMALL_TIMEOUT)
      #  expect(@notes.allNoteHeader_element.text.strip).to eq('All Notes')
      @notes.open_notes_form
      single_note = @notes.search_unsigned_notes('ADVANCE DIRECTIVE', note_date_time, 'Status: Unsigned')
      single_note[0].click if single_note
      @notes.signBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.extract_attribute_value_for_button('sign').include?('hide')).to eq(false), 'Sign Button is not present'
      @notes.signBtn
    end

    it '. Verify e-Signature form opens up' do
      @notes.mainModalLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.mainModalLabel_element.text.strip).to eq('Sign')
      @notes.signatureBody_element.when_visible(SMALL_TIMEOUT)
      new_string = note_date_time.split(' - ')[0] + ' ' + note_date_time.split(' - ')[1]
      puts new_string
      expect(@notes.signatureBody_element.text.strip.include?('ADVANCE DIRECTIVE - ' + new_string)).to eq(true), 'Actual=' + @notes.signatureBody_element.text.strip
      @notes.signatureTitle_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signatureTitle_element.text.strip).to eq('Enter Electronic Signature Code')
      @notes.signatureCode_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signatureCode?).to eq(true), 'Signature code text field not present'
      @notes.signCancelBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signCancelBtn?).to eq(true), 'Cancel Signature code button not present'
      @notes.signatureSignBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signatureSignBtn_element.disabled?).to eq(true), 'Signature sign button is enabled'
    end

    it '. Verify when user clicks cancel user is returned to previous view ' do
      @notes.signCancelBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.signCancelBtn
      @notes.signCancelBtn_element.when_not_visible(MEDIUM_TIMEOUT)
      @notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.notesbtn?).to eq(true)
    end

    it '. Verify when user can enter signature and click the sign button' do
      @notes.open_notes_form
      single_note = @notes.search_unsigned_notes('ADVANCE DIRECTIVE', note_date_time, 'Status: Unsigned')
      single_note[0].click if single_note
      @notes.signBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.signBtn
      @notes.signatureCode_element.when_visible(SMALL_TIMEOUT)
      @notes.signatureCode_element.clear
      @notes.signatureCode = 'e-signature'
      @notes.signatureSignBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signatureSignBtn_element.enabled?).to eq(true)
      @notes.signatureSignBtn
      @notes.signatureSignBtn_element.when_not_visible(MEDIUM_TIMEOUT)
      @notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.notesbtn?).to eq(true)
    end
  end

  context 'TC#1217 : Verify e-signature for New notes created in ehmp-ui ' do
    it '. Verify sign functionality from New Note form' do
      @notes.open_notes_form
      @notes.open_new_note_form
      @notes.noteTitleDropDown_element.when_visible(SMALL_TIMEOUT)
      @notes.select_this_note('ANESTHESIA POSTOP ASSESSMENT')
      @notes.noteBody_element.when_visible(SMALL_TIMEOUT)
      @notes.noteBody = 'Testing e-signature functionality'
      Watir::Wait.until { @notes.noteBody != '' }
      note_date_time = @notes.dateField + ' - ' + @notes.timeField
      @notes.signFormBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.signFormBtn
      @notes.mainModalLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.mainModalLabel_element.text.strip).to eq('Sign')
      @notes.signatureCode_element.when_visible(SMALL_TIMEOUT)
      @notes.signatureCode_element.clear
      @notes.signatureCode = 'e-signature'
      @notes.signatureSignBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signatureSignBtn_element.enabled?).to eq(true)
      @notes.signatureSignBtn
      @notes.signatureSignBtn_element.when_not_visible(MEDIUM_TIMEOUT)
      @notes.formCloseBtn
    end
  end

  context 'TC1218 : Verify e-signature for Edit notes created in ehmp-ui ' do
    it '. Verify sign functionality from New Note form' do
      @notes.open_notes_form
      @notes.open_new_note_form
      single_note = @notes.search_unsigned_notes('ANESTHESIA POSTOP ASSESSMENT', note_date_time, 'Status: Unsigned')
      single_note[0].click if single_note
      @notes.editButton_element.when_visible(SMALL_TIMEOUT)
      @notes.editButton
      @notes.signFormBtn_element.when_visible(SMALL_TIMEOUT)
      @notes.signFormBtn
      @notes.mainModalLabel_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.mainModalLabel_element.text.strip).to eq('Sign')
      @notes.signatureCode_element.when_visible(SMALL_TIMEOUT)
      @notes.signatureCode_element.clear
      @notes.signatureCode = 'e-signature'
      @notes.signatureSignBtn_element.when_visible(SMALL_TIMEOUT)
      expect(@notes.signatureSignBtn_element.enabled?).to eq(true)
      @notes.signatureSignBtn
      @notes.signatureSignBtn_element.when_not_visible(MEDIUM_TIMEOUT)
    end
  end

  context 'TC1350 : Verify sign button is disabled when form fields are missing' do
    it 'Open New Note form and enter form field data' do
      @notes.open_notes_form
      @notes.open_new_note_form
      @notes.select_this_note('ADVANCE DIRECTIVE')
      expect(@notes.extract_attribute_value_for_button('sign form').include?('disabled')).to eq(true), 'Sign Button is enabled'
      @notes.noteBody_element.when_visible(SMALL_TIMEOUT)
      @notes.noteBody = 'Testing sign button enable/disable functionality'
      Watir::Wait.until { @notes.noteBody != '' }
      expect(@notes.extract_attribute_value_for_button('sign form').include?('disabled')).to eq(false), 'Sign Button is disabled'
    end
  end
end
