require 'rubygems'
require 'watir-webdriver'
require 'page-object'

require_relative 'common_test_page'
require_relative '../common/ehmp_constants.rb'

# LoginPage: Page-Object for root page of site, $BASE/
class NotesWriteBackPage
  include PageObject

  def initialize(driver)
    super(driver)
    @common_test = CommonTest.new(driver)
  end

  button(:closeNewNoteBttn, id: 'close-form-btn')
  h4(:newNoteLabel, id: 'main-workflow-label')
  label(:dateLabel, css: 'label[for="derivReferenceDate"]')
  label(:timeLabel, css: 'label[for="derivReferenceTime"]')
  label(:noteTitleLabel, css: 'label[for="documentDefUidUnique"]')
  label(:noteBodyLabel, css: 'label[for="text-0-content"]')
  text_field(:dateField, id: 'derivReferenceDate')
  text_field(:timeField, id: 'derivReferenceTime')
  # select_list(:noteTitle, id: 'documentDefUid')
  # elements(:noteTitleOptions, :option, css: '#documentDefUid > option')
  textarea(:noteBody, id: 'text-0-content')
  text_field(:encounter, id: 'encounter')
  button(:cancelBtn, id: 'note-cancel-btn')
  button(:closeBtn, id: 'close-form-btn')
  button(:signBtn, id: 'tray-sign-note-btn')
  button(:signFormBtn, id: 'sign-form-btn')
  button(:notesbtn, id: 'notes-list-btn')
  div(:allNoteHeader, css: '#notes-tray-header div.col-sm-6')
  button(:newNotebtn, id: 'add-note-btn')
  span(:titleMessage, css: 'span.help-block.error')
  span(:errorMessage, css: 'span.help-block.error')
  # Unsigned notes
  div(:unsignedHeader, id: 'unsigned-notes-header')
  div(:unsigned_title1, id: 'Unsigned-note-list-title-0')
  div(:unsigned_title2, id: 'Unsigned-note-list-title-1')
  div(:unsigned_title3, id: 'Unsigned-note-list-title-2')
  div(:unsigned_date1, id: 'Unsigned-note-list-date-0')
  div(:unsigned_date2, id: 'Unsigned-note-list-date-1')
  div(:unsigned_date3, id: 'Unsigned-note-list-date-2')
  div(:unsigned_status1, id: 'Unsigned-note-list-status-0')
  div(:unsigned_status2, id: 'Unsigned-note-list-status-1')
  div(:unsigned_status3, id: 'Unsigned-note-list-status-2')
  button(:editButton, id: 'tray-edit-note-btn')
  # signed notes
  div(:signedHeader, id: 'signed-notes-header')
  div(:signed_title1, id: 'Completed-note-list-title-0')
  div(:signed_title2, id: 'Completed-note-list-title-1')
  div(:signed_title3, id: 'Completed-note-list-title-2')
  div(:signed_date1, id: 'Completed-note-list-date-0')
  div(:signed_date2, id: 'Completed-note-list-date-1')
  div(:signed_date3, id: 'Completed-note-list-date-2')
  div(:signed_status1, id: 'Completed-note-list-status-0')
  div(:signed_status2, id: 'Completed-note-list-status-1')
  div(:signed_status3, id: 'Completed-note-list-status-2')
  # uncosigned notes
  div(:uncosignedHeader, id: 'uncosigned-notes-header')
  button(:viewBtn, id: 'tray-preview-note-btn')
  div(:previewBody, id: 'note-preview-body')
  div(:previewTitle, id: 'note-preview-title')
  div(:previewDateTime, id: 'note-preview-datetime')
  div(:previewAuthor, id: 'note-preview-author')
  div(:previewStatus, id: 'note-preview-status')
  div(:previewEncounter, id: 'note-preview-encounter')
  element(:previewContent, :pre, css: 'pre.note-preview-content')
  div(:previewSigDateTime, id: 'note-preview-signature-date')
  div(:previewSigner, id: 'note-preview-signer')
  div(:previewModalContent, css: 'div.modal-content')
  button(:previewCloseBtn, id: 'preview-close-btn')
  link(:previewActionBtn, id: 'preview-note-action-btn')
  link(:saveActionBtn, id: 'save-note-action-btn')
  link(:closeActionBtn, id: 'close-note-action-btn')
  span(:optionsGear, id: 'actions-note-form-btn')
  div(:previewWarningMsg, css: '#note-preview-body .label-danger')
  div(:growlMsg, css: '.growl-alert')
  div(:primaryCareNote, css: 'div[data-uid="urn:va:document:9E7A:8:8964"]')
  button(:formCloseBtn, class: 'close')
  # e-signature
  h4(:mainModalLabel, id: 'mainModalLabel')
  div(:signatureBody, css: 'div.description')
  div(:signatureTitle, css: 'div.signature-title')
  text_field(:signatureCode, id: 'SignatureCode')
  button(:signCancelBtn, id: 'CancelSignBtn')
  button(:signatureSignBtn, id: 'SignBtn')
  # notes list
  elements(:notesList, :li, css: '#unsigned-notes-container li')
  li(:firstNoteInTray, css: '#unsigned-notes-container li:nth-of-type(1)')
  li(:selectedNoteInTray, css: '#notes-accordion  ul li.list-item-selected')
  h5(:selectedNoteInTrayTitle, css: '#notes-accordion  ul li.list-item-selected h5')
  span(:selectedNoteInTrayDateTime, css: '#notes-accordion  ul li.list-item-selected span')
  div(:notesTrayLoaded, id: 'notes-list-container')

  # note title drop down arrow
  span(:noteTitleDropDown, class: 'select2-selection__arrow')
  # note title subgroup names
  element(:lastSelectedNoteTitleLabel, :strong, css: 'li[class="select2-results__option"][aria-label="Last Selected Note Title"] strong')
  element(:allNoteTitlesLabel, :strong, css: 'li[class="select2-results__option"][aria-label="All Note Titles"] strong')

  # default displayed note title
  span(:defaultNoteTitle, css: '.select2-selection__rendered')
  # search field to free type the title
  text_field(:titleSearchField, css: '.select2-search__field')
  # no result found
  li(:noResultFoundMsg, css: 'li[role="treeitem"]')
  # a title that's highlighted
  li(:highlightedTitle, class: 'select2-results__option--highlighted')

  def select_this_note(note_title)
    # all note titles
    self.class.elements(:allNotesTitle, :li, css: 'li.select2-results__option[aria-selected="false"]')
    self.class.li(:firstNoteInList, css: 'li.select2-results__option[aria-selected="false"]:nth-of-type(1)')
    defaultNoteTitle_element.when_visible(MEDIUM_TIMEOUT)
    noteTitleDropDown_element.when_visible(SMALL_TIMEOUT)
    noteTitleDropDown_element.click
    Watir::Wait.until do
      if allNotesTitle_elements.length > 0
        puts 'allNotesTitle_elements.length=' + allNotesTitle_elements.length.to_s
        break
      end
    end
    firstNoteInList_element.when_visible(MEDIUM_TIMEOUT)
    allNotesTitle_elements.each do |record|
      if record.text.strip == note_title
        record.click
        break
      end
    end
  end

  def title_in_the_list_in_right_order?(note_title, position)
    search_result = 0
    i = 0
    allNotesTitle_elements.each do |record|
      i += 1
      until (record.text.strip == note_title) && (i == position)
        search_result = 1
      end
    end
    search_result
  end

  def retrieve_note_title_referene_id(note_title)
    # p note_title.text
    note_title.attribute('value')
  end

  def unsigned_note_element(type, seq_num)
    # e.g. unsigned_note_element('title')
    # e.g. unsigned_note_element('date')
    # e.g. unsigned_note_element('status')
    case type
    when 'title'
      h5_element(css: "#unsigned-notes-container li:nth-of-type(#{ seq_num }) h5.note-tray-title")
    when 'date'
      span_element(css: "#unsigned-notes-container li:nth-of-type(#{ seq_num }) span[id*='Unsigned-note-list-date']")
    when 'status'
      span_element(css: "#unsigned-notes-container li:nth-of-type(#{ seq_num }) span[id*='Unsigned-note-list-status']")
    end
  end

  def unsigned_edit_element(seq_num)
    # e.g. unsigned_edit_element(0)
    button_element(id: "Unsigned-edit-btn-#{ seq_num }")
  end

  def signed_note_element(type, seq_num)
    # e.g. signed_note_element('title', 0)
    # e.g. signed_note_element('date', 0)
    # e.g. signed_note_element('status', 0)
    div_element(id: "Completed-note-list-#{ type }-#{ seq_num }")
  end

  def extract_attribute_value_for_button(button_type)
    case button_type
    when 'edit'
      editButton_element.class_name
    when 'sign'
      signBtn_element.class_name
    when 'view'
      viewBtn_element.class_name
    when 'sign form'
      signFormBtn_element.class_name
    end
  end

  def add_a_new_note(note_title, date_str, time_str)
    newNoteLabel_element.when_visible(SMALL_TIMEOUT)

    # Set the title
    select_this_note(note_title)

    # Enter the Note body
    self.noteBody = "This is a #{note_title} note"
    Watir::Wait.until { noteBody != '' }

    # Set the date
    if date_str != ''
      dateField_element.clear
      dateField_element.send_keys :enter
      @common_test.enter_into_date_field(dateField_element, date_str)
    end

    # Set the time
    if time_str != ''
      timeField_element.clear
      @common_test.enter_into_date_field(timeField_element, time_str)
    end

    # Retrieve the final date/time value being set
    note_date_time = dateField + ' - ' + timeField

    # Click Close to Save it
    closeBtn
    closeBtn_element.when_not_visible(MEDIUM_TIMEOUT)

    note_date_time
  end

  def find_selected_note(note_title, date_time_str)
    p 'find selected note ' + note_title + '  ' + date_time_str
    notesTrayLoaded_element.when_visible(SMALL_TIMEOUT)
    Watir::Wait.until { notes_list_finish_loading? }
    firstNoteInTray_element.when_visible(SMALL_TIMEOUT) { notes_list_finish_loading? }
    p notesList_elements.length
    i = 0
    notesList_elements.each do |record|
      if record == selectedNoteInTray_element
        # print 'found '
        # p i
        title_element = selectedNoteInTrayTitle_element
        date_element = selectedNoteInTrayDateTime_element
        the_title = title_element.text.strip
        the_date = date_element.text.strip
        p '*** wrong title: ' + the_title if the_title != note_title.upcase
        p '*** wrong date: ' + the_date if the_date != date_time_str
        # return [selectedNoteInTray_element, i]
        if the_title == note_title.upcase && the_date == date_time_str
          # print 'found '
          # p i
          # @common_test.take_screenshot('note_item')
          # p ' found ' + title_element.text.strip + ' ' + date_element.text.strip + ' '  + status_element.text.strip
          return [selectedNoteInTray_element, i]
        end
      end
      i += 1
    end
    print 'No match found.  Returning null'
    nil
  end

  def search_unsigned_notes(note_title, date_time_str, status_str)
    j = 0
    last_total_count = notesList_elements.length
    # puts 'last_total_count=' + last_total_count.to_s
    while j < 10
      # puts 'j=' + j.to_s
      # puts 'notesList_elements.length=' + notesList_elements.length.to_s
      if notesList_elements.length == last_total_count
        j += 1
      else
        sleep 1
        last_total_count = notesList_elements.length
        # puts 'j, last_total_count=' + j.to_s + ' ' + last_total_count.to_s
      end
    end

    firstNoteInTray_element.when_visible(SMALL_TIMEOUT) { notes_list_finish_loading? }
    # print 'notes length: '
    # p notesList_elements.length
    i = 1
    notesList_elements.each do |_record|
      title_element = unsigned_note_element('title', i)
      date_element = unsigned_note_element('date', i)
      status_element = unsigned_note_element('status', i)
      title_element.when_visible(LARGE_TIMEOUT)
      # p i
      # p 'a=' + title_element.text + ', exp=' + note_title.upcase
      # p 'a=' + date_element.text + ', exp=' + date_time_str
      # p 'a=' + status_element.text + ', exp=' + status_str
      # p '*********************'
      if title_element.text.strip == note_title.upcase && date_element.text.strip == date_time_str && status_element.text.strip == status_str
        return [title_element, i]
      end
      i += 1
    end
    p 'No match found.  Returning null at item '
    nil
  end

  def search_unsigned_note_with_this_title(note_title)
    notesTrayLoaded_element.when_visible(SMALL_TIMEOUT)
    Watir::Wait.until { notes_list_finish_loading? }
    firstNoteInTray_element.when_visible(SMALL_TIMEOUT) { notes_list_finish_loading? }
    i = 1
    notesList_elements.each do |_record|
      title_element = unsigned_note_element('title', i)
      if title_element.text.strip.upcase == note_title.upcase
        return [title_element, i]
      end
      i += 1
    end
    p 'No match found.  Returning null.'
    nil
  end

  def notes_list_finish_loading?
    return true if notesList_elements.length > 0
    false
  end

  def open_notes_form
    if newNotebtn_element.visible?
      return
    else
      notesbtn_element.when_visible(SMALL_TIMEOUT)
      notesbtn until newNotebtn_element.visible?
    end
  end

  def notes_tray_closed?
    if allNoteHeader_element.visible?
      notesbtn while allNoteHeader_element.visible?
    else
      return
    end
  end

  def open_new_note_form
    newNotebtn_element.when_visible(SMALL_TIMEOUT)
    newNotebtn
    newNoteLabel_element.when_visible(SMALL_TIMEOUT)
  end
end
