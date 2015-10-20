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
require_relative '../lib/pages/documents_page'
require_relative '../lib/common/ehmp_constants'

# Team: Saturn

describe 'F226 Story#US8033: f226_add_note_from_documents_spec.rb, DE1783 or 1786', debug: true do
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
  let(:documents) { Documents.new(@driver) }

  context 'TC#998: Add a new note from documents; the Encounters Location has not been pre-set' do
    it '. Login as default and search by Twelve,Patient' do
      common_test.login_with_default
      common_test.mysite_patient_search('Twelve,p', 'TWELVE,PATIENT')
      expect(@login.currentUser_element.text.strip.include?('USER, PANORAMA')).to eq(true)
    end

    it '. Navigate to documents page and click new note button' do
      documents.navigate_to_documents
      documents.appletTitle_element.when_visible(SMALL_TIMEOUT)
      documents.addNote_element.when_visible(SMALL_TIMEOUT)
      documents.addNote
    end

    it '. Verify that the Encounter Location modal shows up and click yes' do
      modal.modalHeader_element.when_visible(SMALL_TIMEOUT)
      expect(modal.modalHeader.strip).to eq('Missing encounter information')
      modal.yesBttn_element.when_visible(SMALL_TIMEOUT)
      modal.yesBttn
    end

    it '. From the Visit Information page, select a Encounter location then click Confirm. Verify that the New Notes form is present ' do
      visit_info.visitInfoHeader_element.when_visible(MEDIUM_TIMEOUT)
      expect(visit_info.visitInfoHeader.strip).to eq('Provider & Location for Current Activities')
      visit_info.choose_encounter_location('GENERAL INTERNAL MEDICINE', '12/23/1993 09:45')
      notes.growlMsg_element.when_not_visible(MEDIUM_TIMEOUT)
    end

    it '. Verify the New Notes form displays. Then select a title and close it.' do
      notes.open_notes_form
      notes.newNotebtn_element.when_visible(SMALL_TIMEOUT)
      notes.firstNoteInTray_element.when_visible(SMALL_TIMEOUT)
      Watir::Wait.until { notes.notesList_elements.length > 0 }
      notes.newNotebtn
      notes.newNoteLabel_element.when_visible(SMALL_TIMEOUT)
      expect(notes.newNoteLabel.strip).to eq('New Note')
      notes.select_this_note('ADVANCE DIRECTIVE')
      notes.closeNewNoteBttn
      notes.closeNewNoteBttn_element.when_not_visible(SMALL_TIMEOUT)
    end
  end
  context 'TC#705: Add a new note when the Encounters Location has been pre-set' do
    it '. Now that the Encounter Location is set, click Documents->Add New Note. Verify that the warning modal does not pop up' do
      documents.navigate_to_documents
      documents.appletTitle_element.when_visible(SMALL_TIMEOUT)
      documents.addNote_element.when_visible(SMALL_TIMEOUT)
      documents.addNote
      expect(modal.modalHeader?).to eq(false), 'Modal pops up even if the Encounter Location is pre-set'
    end

    it '. Verify the New Notes form displays' do
      notes.newNoteLabel_element.when_visible(SMALL_TIMEOUT)
      expect(notes.newNoteLabel.strip).to eq('New Note')
      notes.select_this_note('ANESTHESIA POSTOP ASSESSMENT')
      notes.closeNewNoteBttn
      notes.closeNewNoteBttn_element.when_not_visible(SMALL_TIMEOUT)
    end
  end
end
