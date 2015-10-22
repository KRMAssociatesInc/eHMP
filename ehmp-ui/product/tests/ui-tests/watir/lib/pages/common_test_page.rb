# encoding: utf-8

require 'watir-webdriver'
require 'page-object'

require_relative 'search_page'
require_relative 'login_page'
require_relative 'visit_information_page'
require_relative '../common/ehmp_constants.rb'

# CommonTest, source for basic methods used all over the app
class CommonTest
  include PageObject

  def initialize(driver)
    super(driver)
    @driver = driver
    @search = SearchPage.new(driver)
    @login = LoginPage.new(driver)
    @visit_info = VisitInformationPage.new(driver)
    @common_elements = CommonElementsPage.new(driver)
  end

  def login_with_default
    login_with('pu1234', 'pu1234!!', 'PANORAMA')
  end

  def login_with(access_code, verify_code, facility)
    @login.accessCode_element.when_visible(ALLOW_INITIAL_LOAD)
    @login.facility = facility
    @login.accessCode = access_code
    @login.verifyCode = verify_code
    @login.login
    @login.currentUser_element.when_visible(MEDIUM_TIMEOUT)
  rescue => e
    take_screenshot 'login_error'
    raise e
  end

  def logout
    @common_elements.eHMPCurrentUser_element.when_visible
    @common_elements.eHMPCurrentUser
    @common_elements.logoutButton_element.when_visible
    @common_elements.logoutButton
    @login.login_element.when_visible
  end

  def patient_search(patientname)
    @search.patientSearch_element.when_visible(SMALL_TIMEOUT)
    @search.patientSearch_element.clear
    @search.patientSearch_element.click
    @search.patientSearch = patientname
    @search.patientSearch_element.send_keys :enter
  end

  def dom_has_confirmflag_or_patientsearch
    wait_until = 60
    counter = 0
    loop do
      counter += 1
      return true if @search.patientSearchDiv?

      @search.secondConfirmBtn if @search.secondConfirmBtn?
      sleep 1
      break if counter > wait_until
    end # loop
    false
  end

  def mysite_patient_search(search_term, full_patient_name, display_output = false)
    # e.g. mysite_patient_search('Eight,', 'Eight,Patient')
    p "Searching for patient #{search_term}" if display_output
    patient_search search_term

    Watir::Wait.until { @search.this_patient_in_the_patient_list_table?(1, full_patient_name) }

    @search.click_the_right_patient_from_table(full_patient_name)

    @search.firstConfirm_element.when_visible(LARGE_TIMEOUT)
    @search.firstConfirm

    Watir::Wait.until { dom_has_confirmflag_or_patientsearch }
  rescue => e
    take_screenshot 'mysite_patient_search_error'
    raise e
  end

  def all_patient_search(lastName, firstName, dobStr, ssnStr, errMsg)
    # Add the below two lines to clear up any remaining data under the Nationawide tab
    @search.mySiteTab_element.when_visible(SMALL_TIMEOUT)
    @search.mySiteTab_element.click
    @search.allPatientTab_element.when_visible(SMALL_TIMEOUT)
    @search.allPatientTab_element.click

    @search.patientSearchLName_element.when_visible(SMALL_TIMEOUT)

    @search.patientSearchLName_element.clear
    @search.patientSearchLName = lastName

    unless firstName.nil?
      @search.patientSearchFName_element.clear
      @search.patientSearchFName = firstName
    end

    unless dobStr.nil?
      @search.patientSearchDob_element.clear
      @search.patientSearchDob = dobStr
    end

    unless ssnStr.nil?
      @search.patientSearchSsn = ''
      @search.patientSearchSsn_element.clear
      @search.patientSearchSsn = ssnStr
    end

    @search.searchBtn

    if errMsg == '' || errMsg == 'RESTRICTED RECORD'
      Watir::Wait.until { @search.total_count_in_table > 0 }
    else
      @search.patientErrMsg_element.when_visible(SMALL_TIMEOUT)
    end
  end

  def retrieve_table_cell(tableIdStr, rowNum, columnNum)
    # tableIdStr = '#data-grid-newsfeed'
    self.class.elements(:tableRows, :tr, css: '#' + tableIdStr + ' tbody tr td:nth-of-type(' + columnNum.to_s + ')')

    i = 0
    tableRows_elements.each do |record|
      i += 1
      next unless i == rowNum
      return record.text.strip
    end
  end

  def click_table_cell(tableIdStr, rowNum, columnNum)
    # tableIdStr = '#data-grid-newsfeed'
    self.class.elements(:tableRows, :tr, css: '#' + tableIdStr + ' tbody tr td:nth-of-type(' + columnNum.to_s + ')')

    i = 0
    tableRows_elements.each do |record|
      i += 1
      next unless i == rowNum
      record.click
      break
    end
  end

  def get_expected_filter_from_applet(appletName, componentName)
    # This method will return boolean value after providing parameter values.
    # Sample: @page.get_expected_filter_from_applet('dpcbw-documents','rbc')
    self.class.button(:lab_result_filter_button, id: 'grid-filter-button-' + appletName + '-1')

    lab_result_filter_button_element.when_visible(SMALL_TIMEOUT)
    lab_result_filter_button

    # self.class.elements(:components, :span, css: '#grid-filter-' + appletName + '-1 span.udaf-tag span')
    self.class.elements(:components, :span, css: '#' + appletName + '-1 span.udaf-tag span')
    match = false

    Watir::Wait.until { components_elements.length > 0 }

    components_elements.each do |single_component|
      match = single_component.text.strip.include?(componentName)
      break if match
    end
    match
  end

  def select_visit_info_with_a_location(location_name, date_time_str)
    Watir::Wait.until(XLARGE_TIMEOUT) { @visit_info.encounterList_elements.length > 0 }
    # puts 'encounter_list = ' + @visit_info.encounterList_elements.length.to_s
    @visit_info.selVisitInfo_element.when_visible(SMALL_TIMEOUT)
    @visit_info.selVisitInfo_element.click
    @visit_info.visitInfoHeader_element.when_visible(SMALL_TIMEOUT)
    # Wait for all the data to load
    @visit_info.ok_element.when_visible(SMALL_TIMEOUT)
    @visit_info.choose_encounter_location(location_name, date_time_str)
    @visit_info.ok_element.when_not_visible(MEDIUM_TIMEOUT)
  end

  def select_visit_info_to_view_encounters(location_name, date_time_str)
    @visit_info.selVisitInfo_element.when_visible(MEDIUM_TIMEOUT)
    @visit_info.selVisitInfo_element.click
    @visit_info.visitInfoHeader_element.when_visible(10)
    # Wait for all the data to load
    @visit_info.viewEncounters_element.when_visible(MEDIUM_TIMEOUT)
    @visit_info.choose_encounter_location(location_name, date_time_str)
    Watir::Wait.until { @visit_info.displayedEncounterLoc != 'No Location Selected' }
    @visit_info.viewEncounters
  end

  def enter_into_date_field(date_field_element, date_str)
    # ex: common_test.enter_into_date_field(notes.dateField_element, '06/13/2015')
    execute_script('$(arguments[0]).val("' + date_str + '").trigger("change");', date_field_element)
  end

  def enter_into_time_field(time_field_element, time_str)
    # ex: common_test.enter_into_date_field(notes.dateField_element, '06/13/2015')
    execute_script('$(arguments[0]).val("' + time_str + '").trigger("change");', time_field_element)
  end

  def take_screenshot(name)
    build_job_url = ENV['JOB_URL']
    # build_job_number = ENV['BUILD_NUMBER']
    unique = Time.new.strftime('%H:%M:%S.%L')
    screenshot_name = "screenshot-#{name}-#{unique}.png"
    screenshot_dir = 'screenshots'
    screenshot_path = screenshot_dir + "/#{screenshot_name}"

    Dir.mkdir screenshot_dir unless Dir.exist? screenshot_dir

    @driver.screenshot.save screenshot_path

    puts '----Screenshot ------------------------------------------------------------------------'
    puts "\n  Screenshot: #{screenshot_path}\n  " + (!build_job_url.nil? ? build_job_url.to_s : '') + '/ws/acceptance_test/watir/' + screenshot_path
    puts '---------------------------------------------------------------------------------------'
  end
end
