require 'active_support/time'
require 'rubygems'
require 'selenium-webdriver'
require 'watir-webdriver'
require 'rspec'

# Driver Utility methods for basic page-object functionality
module DriverUtility
  def initialize_configurations(base_url, browser_name)
    @driver = Watir::Browser.new browser_name
    @driver.cookies.clear
    @driver.goto(base_url)
    @driver.driver.manage.window.maximize
  end

  def goto_here(baseUrl)
    @driver.goto(baseUrl)
  end

  def current_url
    @driver.url
  end

  def quit_driver
    @driver.quit
  end

  def resize_window_to(width = 1100, height = 850)
    @driver.window.resize_to width, height
    sleep 1
  end

  def parse(val)
    JSON.parse(val)
  end

  def version_from_version_file
    version_json_path = File.dirname(__FILE__) + '/../../../../dist/version.json'
    # puts versionJsonPath

    json_file = File.open(version_json_path).read
    version_json = parse(json_file.to_s)

    # puts 'version json:  ' +versionJson.to_s()
    'v' + version_json['version']
  end

  def switch_window_to_window_handle_last
    @driver.driver.switch_to.window @driver.driver.window_handles.last
  end

  def switch_window_to_window_handle_first
    @driver.driver.switch_to.window @driver.driver.window_handles.first
  end

  def refresh_page
    @driver.refresh
  end

  def calculate_patient_age(dob)
    today = Date.today
    age = today.year - dob.year
    age - 1 if dob.strftime('%m%d').to_i > today.strftime('%m%d').to_i
    age
  end

  #### Date Functions #######

  # format=%Y-%m-%d"
  def get_date_nth_days_ago(number_of_days_ago, format_str)
    number_of_days_ago.day.ago.strftime(format_str)
  end

  def get_date_nth_days_from_now(number_of_days_from_now, format_str)
    number_of_days_from_now.day.from_now.strftime(format_str)
  end

  def get_date_nth_months_from_now(number_of_days_from_now, format_str)
    number_of_days_from_now.month.from_now.strftime(format_str)
  end

  def get_date_nth_years_from_now(number_of_days_from_now, format_str)
    number_of_days_from_now.year.from_now.strftime(format_str)
  end

  def get_date_nth_years_ago(number_of_years_ago, format_str)
    number_of_years_ago.year.ago.strftime(format_str)
  end

  def get_day_of_week(date_str)
    date_str_array = date_str.split('/')
    time = Time.parse(date_str_array[2] + '-' + date_str_array[0] + '-' + date_str_array[1] + ' 09:00 AM')
    puts 'time=' + time.to_s
    time.strftime('%A')
  end

  ###### End of Date functions ###########
end
