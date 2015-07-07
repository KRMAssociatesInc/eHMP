require 'rubygems'
require 'watir-webdriver'
require 'page-object'

# SearchPage page-object for $BASE/#patient-search-screen
class SearchPage
  include PageObject

  # patient search
  text_field(:patientSearch, id: 'patientSearchInput')

  # global search
  li(:cPRSListTab, id: 'myCPRSList')
  li(:mySiteTab, id: 'mySite')
  li(:allPatientTab, id: 'global')

  h4(:patientSearchTitle, class: 'title')
  span(:returnToPatientSrch, class: 'search-icon-text')

  text_field(:patientSearchLName, id: 'globalSearchLastName')
  text_field(:patientSearchFName, id: 'globalSearchFirstName')
  text_field(:patientSearchDob, id: 'globalSearchDob')
  text_field(:patientSearchSsn, id: 'globalSearchSsn')

  link(:searchBtn, id: 'globalSearchButton')
  div(:listTable, class: 'list-group')

  button(:firstConfirm, id: 'confirmationButton')
  button(:secondConfirmBtn, id: 'confirmFlaggedPatinetButton')
  button(:restrictRecrdConf, id: 'ackButton')
  link(:restrictedTitle, css: '.panel-title > a')
  p(:patientErrMsg, class: 'error-message')

  div(:confirmationHeader, :css => 'div.patientName')
	div(:confirmationHeader_dob, :css => 'div.patientInfo > div > div:nth-of-type(2)')
	div(:confirmationHeader_age, :css => 'div.patientInfo > div > div:nth-of-type(4)')
	div(:confirmationHeader_gender, :css => 'div.patientInfo > div > div:nth-of-type(6)')
	div(:confirmationHeader_ssn, :css => 'div.patientInfo > div > div:nth-of-type(8)')
  ############ local functions ##################

  def this_tab_has_focus?
    self.class.a(:patientTabFocus, css: '#global > a')
    patientTabFocus_element.attribute('aria-selected')
  end

  def retrieve_search_data(rawData)
    rawData.split('|')[0]
  end

  def retrieve_verification_data(rawData)
    rawData.split('|')[1]
  end

  def click_the_right_patient_from_table(patientName)
    self.class.elements(:nameInListGroup, :div, class: 'patientDisplayName')

    nameInListGroup_elements.each_with_index do |name, i|
      row = i + 1
      if name.text.strip.include?(patientName.upcase)
        self.class.link(:recordInList, css: '.list-group > a:nth-of-type(' + row.to_s + ')')
        recordInList
        break

      end
    end
  end

  def total_count_in_table
    self.class.elements(:nameInListGroup, :div, class: 'patientDisplayName')
    nameInListGroup_elements.length
  end

  def this_patient_in_the_patient_list_table?(columnNum, patientName)
    found_the_value = false

    self.class.elements(:searchCellValue, :div, css: '.list-group > a > .list-group-item-text > div:nth-of-type(' + columnNum.to_s + ')')

    searchCellValue_elements.each do |record|
      if record.text.strip.include?(patientName.upcase)
        found_the_value = true
        break
      end
    end

    found_the_value
  end
end

