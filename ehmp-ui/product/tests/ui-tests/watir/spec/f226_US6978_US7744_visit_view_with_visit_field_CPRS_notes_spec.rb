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

# POC: Team Saturn
describe 'Story#US6978|#US7744: f226_US6978_US7744_visit_view_with_visit_field_CPRS_notes_spec.rb', future: true do
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

  context 'TC#601: Add a new note when the Encounters Location has not been pre-set' do
    it '. Login as default and search by Ten,Patient' do
      common_test.login_with_default
      common_test.mysite_patient_search('ten,p', 'TEN,PATIENT')
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it '. Click the Notes button and then click Add a New Note button from the slide out tray' do
      notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      notes.notesbtn
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      notes.newNotebtn
    end

    it '. Verify that the Warning modal shows up' do
      modal.modalHeader_element.when_visible(SMALL_TIMEOUT)
      expect(modal.modalHeader.strip).to eq('Missing encounter information')
    end

    it '. Click No, verify that user is returned to the overview page' do
      modal.noBttn_element.when_visible(SMALL_TIMEOUT)
      modal.noBttn
      modal.noBttn_element.when_not_visible(SMALL_TIMEOUT)
      expect(notes.notesbtn?).to eq(true), 'User did not return to the Overview page'
    end

    it '. Click the Notes button and then click Add a New Note button, Click Yes from the modal, verify that the Visit Information page shows up' do
      notes.notesbtn_element.when_visible(SMALL_TIMEOUT)
      notes.notesbtn
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      notes.newNotebtn
      modal.modalHeader_element.when_visible(SMALL_TIMEOUT)
      expect(modal.modalHeader.strip).to eq('Missing encounter information')
      # Click Yes from the Modal
      modal.yesBttn_element.when_visible(SMALL_TIMEOUT)
      modal.yesBttn
      visit_info.visitInfoHeader_element.when_visible(SMALL_TIMEOUT)
      expect(visit_info.visitInfoHeader).to eq('Provider & Location for Current Activities')
    end

    it '. From the Visit Information page, select a Encounter location then click Confirm. Verify the New Notes form displays. Then select a title and close it.' do
      visit_info.choose_encounter_location('PRIMARY CARE/MEDICINE', '10/13/1993 14:00')
      notes.open_notes_form
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      notes.newNotebtn
      notes.newNoteLabel_element.when_visible(SMALL_TIMEOUT)
      expect(notes.newNoteLabel.strip).to eq('New Note')
      notes.noteBody = 'Test'
      notes.dateField_element.clear
      notes.dateField_element.send_keys :enter
      common_test.enter_into_date_field(notes.dateField_element, '04/30/2015')
      notes.select_this_note('ADVANCE DIRECTIVE')
      notes.closeNewNoteBttn
      notes.closeNewNoteBttn_element.when_not_visible(MEDIUM_TIMEOUT)
    end
  end

  context 'TC#705: Add a new note when the Encounters Location has been pre-set' do
    it '. Now that the Encounter Location is set, click Notes->Add New Note. Verify that the warning modal does not pop up' do
      notes.open_notes_form
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      notes.newNotebtn
      expect(modal.modalHeader?).to eq(false), 'Modal pops up even if the Encounter Location is pre-set'
    end

    it '. Verify the New Notes form displays' do
      notes.newNoteLabel_element.when_visible(SMALL_TIMEOUT)
      expect(notes.newNoteLabel.strip).to eq('New Note')
      notes.noteBody = 'Test'
      notes.select_this_note('ADIR <ADVANCE DIRECTIVE>')
      Watir::Wait.until { notes.noteBody != '' }
      notes.closeNewNoteBttn
      notes.closeNewNoteBttn_element.when_not_visible(SMALL_TIMEOUT)
    end
  end

  context 'TC#841: Handle unsigned Notes from VistA' do
    it '. Return to the search and search by Twelve,Patient again' do
      notes.notes_tray_closed?
      search.returnToPatientSrch_element.when_visible(SMALL_TIMEOUT)
      search.returnToPatientSrch_element.click
      common_test.mysite_patient_search('twelve,p', 'TWELVE,PATIENT')
      @login.currentUser_element.when_visible(MEDIUM_TIMEOUT)
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end
  end

  # Comment it out due to the lack of test data from Team Risa 07/24/2015
  # context 'Story#7744|TC#841: Handle unsigned Notes from VistA' do
  #   it '. Return to the search and search by Twelve,Patient again' do
  #     notes.notes_tray_closed?
  #     search.returnToPatientSrch_element.when_visible(SMALL_TIMEOUT)
  #     search.returnToPatientSrch_element.click
  #     common_test.mysite_patient_search('twelve,p', 'TWELVE,PATIENT')
  #     @login.currentUser_element.when_visible(MEDIUM_TIMEOUT)
  #     expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
  #   end
  #
  #   it '. Edit button is not available for the CPRS Unsigned Note. Select a Unsigned Note, that the Title, Date/Time Signed Status match with the tray. ' do
  #     notes.open_notes_form
  #     return_value = notes.search_unsigned_note_with_this_title('PRIMARY CARE GENERAL NOTE')
  #     return_value[0].click unless return_value.nil?
  #     notes.viewBtn_element.when_visible(SMALL_TIMEOUT)
  #     expect(notes.viewBtn?).to eq(true)
  #     expect(notes.extract_attribute_value_for_button('edit').include?('hide')).to eq(true), 'The Edit button appeared to be visible for a CPRS Unsigned Note.'
  #
  #     title_on_list = notes.unsigned_note_element('title', 1).text.strip
  #     date_on_list = notes.unsigned_note_element('date', 1).text.strip
  #     status_on_list = notes.unsigned_note_element('status', 1).text.strip.split(': ')[1].upcase
  #     notes.viewBtn_element.when_visible(SMALL_TIMEOUT)
  #     notes.viewBtn
  #     notes.previewWarningMsg_element.when_visible(SMALL_TIMEOUT)
  #     expect(notes.previewTitle.strip).to eq(title_on_list)
  #     expect(notes.previewDateTime.strip).to eq(date_on_list)
  #     expect(notes.previewStatus.strip).to eq(status_on_list)
  #   end
  #
  #   it '. Verify that as a Unsigned Note from CPRS it has a correct warning message displayed' do
  #     expect(notes.previewWarningMsg).to eq('This is an Unsigned note created in CPRS. Please edit the note in CPRS.')
  #   end
  # end
end
