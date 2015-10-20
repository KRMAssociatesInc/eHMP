require 'rubygems'
require 'selenium-webdriver'
require 'watir-webdriver'
require 'rspec'

require_relative '../common/ehmp_constants.rb'
require_relative '../../lib/pages/common_test_page.rb'
require_relative '../common/ehmp_error_messages.rb'
require_relative '../../lib/pages/search_page'
require_relative '../../lib/pages/login_page.rb'

# utility module for utility classes - login/search
module Util
  # search util class
  class SearchUtil
    # require_relative '../../lib/pages/common_test_page.rb'
    def initialize(driver)
      @search_page = SearchPage.new(driver)
      @common_test = CommonTest.new(driver)
    end

    def patient_search(patient_name)
      @common_test.patient_search patient_name
      # @search.patientSearch_element.when_visible
      # @search.patientSearch_element.clear
      # @search.patientSearch = name
      # @search.patientSearch_element.send_keys :enter
    end

    def patient_overiew(patient_name)
      @common_test.patient_search patient_name
      @search_page.patientInTheList_element.when_visible
      @search_page.click_the_right_patient_from_table(patient_name)
      @search_page.firstConfirm_element.when_visible
      @search_page.firstConfirm
      @search_page.secondConfirmBtn_element.when_visible
      @search_page.secondConfirmBtn
    end
  end

  # login util class
  class LoginUtil
    attr_reader :driver, :login_page, :common_test

    def initialize
      @driver_util = DriverUtil.new
      @driver = @driver_util.driver
      @common_test = CommonTest.new(driver)
      # @login_page = LoginPage.new(@driver)
    end

    def login_with(access_code, verify_code, facility)
      @common_test.login_with(access_code, verify_code, facility)
      # @login_page.accessCode_element.when_visible
      # @login_page.facility = facility
      # @login_page.accessCode = access_code
      # @login_page.verifyCode = verify_code
      # @login_page.login
    end
  end

  # driver util class
  class DriverUtil
    attr_reader :driver

    def initialize
      browser_name = ENV['BROWSER'] || 'firefox'
      @base_url = ENV['BASE']
      @driver = Watir::Browser.new browser_name
      clear_max_base(@base_url)
      goto_base_url
    end

    def goto_base_url
      @driver.goto @base_url
    end

    def clear_max_base(base_url)
      @driver.cookies.clear
      @driver.goto(base_url)
      @driver.driver.manage.window.maximize
    end
  end

  # login as panorama by default
  def self.login
    login_as(FACILITY_PANORAMA)
  end

  def self.login_as(user)
    if user.eql? FACILITY_PANORAMA
      Util.login_with(ACCESS_CODE_PANORAMA, VERIFY_CODE_PANORAMA, FACILITY_PANORAMA)
    elsif user.eql? FACILITY_KODAK
      Util.login_with(ACCESS_CODE_KODAK, VERIFY_CODE_KODAK, FACILITY_KODAK)
    else
      fail UNAUTHORIZED_USER
    end
  end

  def self.login_with(access_code = ACCESS_CODE_PANORAMA, verify_code = VERIFY_CODE_PANORAMA, facility)
    login_util = LoginUtil.new
    login_util.login_with(access_code, verify_code, facility)
    @driver = login_util.driver
  end

  def self.quit
    @driver.quit
  end

  # SEARCH

  def self.patient_search(name)
    search_util = SearchUtil.new(@driver)
    search_util.patient_search name
  end

  # OVERVIEW
  def patient_overview(_patient_name = EIGHT_PATIENT)
    search_util = SearchUtil.new(Util.driver)
    search_util.patient_overview
  end
end
