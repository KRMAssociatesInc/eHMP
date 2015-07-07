require 'watir-webdriver'
require 'page-object'

require_relative 'search'
require_relative 'login_page'

# CommonTest, source for basic methods used all over the app
class CommonTest
  include PageObject

  def initialize(driver)
    super(driver)
    @search = SearchPage.new(driver)
    @login = LoginPage.new(driver)
  end

  def login_with(access_code, verify_code, facilityStr)
    @login.accessCode_element.when_visible
    @login.facility = facilityStr
    @login.accessCode = access_code
    @login.verifyCode = verify_code
    @login.login
    @login.currentUser_element.when_visible(20)
  end

  def patient_search(patientName)
    @search.patientSearch_element.when_visible
    @search.patientSearch_element.clear
    @search.patientSearch = patientName
    @search.patientSearch_element.send_keys :enter
  end

  def all_patient_search(lastName, firstName, dobStr, ssnStr, errMsg)
    @search.allPatientTab_element.when_visible(10)
    @search.allPatientTab_element.click

    @search.patientSearchLName_element.when_visible(10)

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
    puts 'recordsCount=' + @search.total_count_in_table.to_s

    if errMsg == '' || errMsg == 'RESTRICTED RECORD'
      Watir::Wait.until { @search.total_count_in_table > 0 }
    else
      @search.patientErrMsg_element.when_visible(10)
    end
  end
end
