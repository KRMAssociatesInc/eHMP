require 'rubygems'
require 'watir-webdriver'
require 'page-object'
require 'chronic'
require 'date'

require_relative 'common_elements_page'

# ClinicTimeFrameFilterSearch Page Object for Clinic search
class ClinicTimeFrameFilterSearch
  include PageObject

  a(:clinic_search_tab, css: '#clinics')
  text_field(:clinic_filter_input, css: '#location-list-filter-input input')
  button(:past_month_btn, id: 'past-month-clinicDate')
  button(:past_week_btn, id: 'past-week-clinicDate')
  button(:yesterday_btn, id: 'yesterday-clinicDate')
  button(:today_btn, id: 'today-clinicDate')
  button(:tomorrow_btn, id: 'tomorrow-clinicDate')
  button(:next_week_btn, id: 'next-week-clinicDate')
  button(:apply_btn, id: 'custom-range-apply')
  button(:cardiology, css: '#location-list-results .list-group a:nth-of-type(2) p')
  text_field(:date_from, id: 'filter-from-date-clinic')
  text_field(:date_to, id: 'filter-to-date-clinic')
  span(:date_from_cal_btn, css: '#custom-date-from-clinic .input-group-addon')
  span(:date_to_cal_btn, css: '#custom-date-to-clinic .input-group-addon')
  element(:table_days_header, :th, css: '.datepicker-days th:nth-of-type(2)')
  element(:table_months_header, :th, css: '.datepicker-months th:nth-of-type(2)')
  element(:table_years_header, :th, css: '.datepicker-years th:nth-of-type(2)')
  a(:patient_location_first_result, css: '#patient-search-results div a:nth-of-type(1)')
  a(:patient_location_second_result, css: '#patient-search-results div a:nth-of-type(2)')
  p(:no_results_message, css: '#patient-search-results div > p')
  elements(:clinic_filter_results_list, :a, css: '#location-list-results div a')
  a(:clinic_filter_first_result, css: '#location-list-results div a:nth-of-type(1)')
  a(:cardiology_clinic, css: '#location-list-results .list-group a:nth-of-type(2)')
  a(:audiology_clinic, css: '#location-list-results .list-group a:nth-of-type(1)')
  a(:name, css: '.results-table .list-group a:nth-of-type(1) div div:nth-of-type(1)')
  a(:SSN, css: '.results-table .list-group a:nth-of-type(1) div div:nth-of-type(2)')
  a(:date_and_time, css: '.results-table .list-group a:nth-of-type(1) div div:nth-of-type(3)')
  a(:DOB, css: '.results-table .list-group a:nth-of-type(1) div div:nth-of-type(4)')
  a(:gender, css: '.results-table .list-group a:nth-of-type(1) div div:nth-of-type(5)')
  a(:name_second_in_list, css: '.results-table .list-group a:nth-of-type(2) div div:nth-of-type(1)')
  a(:SSN_second_in_list, css: '.results-table .list-group a:nth-of-type(2) div div:nth-of-type(2)')
  a(:date_and_time_second_in_list, css: '.results-table .list-group a:nth-of-type(2) div div:nth-of-type(3)')
  a(:DOB_second_in_list, css: '.results-table .list-group a:nth-of-type(2) div div:nth-of-type(4)')
  a(:gender_second_in_list, css: '.results-table .list-group a:nth-of-type(2) div div:nth-of-type(5)')

  def enter_clinic_from_date(dateStr)
    # dateStr must be in "mm/dd/yyyy" format
    self.date_from = dateStr
  end

  def enter_clinic_to_date(dateStr)
    # dateStr must be in "mm/dd/yyyy" format
    self.date_to = dateStr
  end

  def select_day_from_cal(trNum, tdNum)
    self.class.element(:day_from_cal, :td, css: '.datepicker-days tbody tr:nth-of-type('" #{trNum} "') td:nth-of-type('" #{tdNum} "')')
    day_from_cal_element.click
  end

  def select_month_from_cal(monthNum)
    self.class.element(:month_from_cal, :span, css: '.datepicker-months tbody span:nth-of-type('" #{monthNum} "')')
    month_from_cal_element.click
  end

  def select_year_from_cal(yearNum)
    self.class.element(:year_from_cal, :span, css: '.datepicker-years tbody span:nth-of-type('" #{yearNum} "')')
    year_from_cal_element.click
  end

  def get_day_from_cal(trNum, tdNum)
    self.class.element(:day_from_cal, :td, css: '.datepicker-days tbody tr:nth-of-type('" #{trNum} "') td:nth-of-type('" #{tdNum} "')')
    day_from_cal_element.text.strip
  end

  def get_month_from_cal(monthNum)
    self.class.element(:month_from_cal, :span, css: '.datepicker-months tbody span:nth-of-type('" #{monthNum} "')')
    month_from_cal_element.text.strip
  end

  def get_year_from_cal(yearNum)
    self.class.element(:year_from_cal, :span, css: '.datepicker-years tbody span:nth-of-type('" #{yearNum} "')')
    year_from_cal_element.text.strip
  end

  def select_location_from_list(locationNum)
    self.class.element(:location_btn, :a, css: '#location-list-results div a:nth-of-type('" #{ locationNum } "')')
    location_btn_element.when_visible(30)
    location_btn_element.click
  end

  def get_location_text(locationNum)
    self.class.element(:location, :span, css: '#location-list-results div a:nth-of-type('" #{ locationNum } "') span:nth-of-type(1)')
    location_element.text.strip
  end

  def patient_location_result_count(resultNum)
    self.class.elements(:patient_location_result_list, :a, css: '#patient-search-results .list-group a:nth-of-type('"#{resultNum}"')')
    count = 0
    patient_location_result_list_elements.each do |result|
      if result.text.strip == ''
        count = 0
        break
      else
        count += 1
      end
    end
    count
  end

  def patient_location_results(resultNum)
    self.class.elements(:patient_location_result_list, :a, css: '#patient-search-results .list-group a:nth-of-type('"#{resultNum}"')')
    total_result = patient_location_result_count(resultNum)
    if total_result > 0
      return 'Clinic custom search returned data'
    else
      return 'No results found'
    end
  end

  def get_result_column_header(headerColumnNum)
    self.class.div(:result_column_header, css: '#columnHeader div:nth-of-type('"#{headerColumnNum}"')')
    result_column_header_element.text.strip
  end

  def select_year_header
    table_days_header_element.when_visible(30)
    table_days_header_element.click
    table_months_header_element.when_visible(30)
    table_months_header_element.click
  end

  def clinic_filter_results_text(clinicNum)
    self.class.a(:clinic_list, css: '#location-list-results div a:nth-of-type('" #{clinicNum} " ')')
    clinic_list_element.text.strip
  end

  def button_disabled?
    disabled = false
    disabled = true if apply_btn_element.attribute('disabled')
    disabled
  end

  def button_active?(dateRangeBtn)
    active = false
    active = true if dateRangeBtn.attribute('class').include?('active-range')
    active
  end

  def select_start_date(year_num, month_num, cal_table_row, cal_table_data)
    date_from_element.when_visible(30)
    date_from_cal_btn_element.click
    select_year_header

    yr = (DateTime.strptime(get_year_from_cal(year_num), '%Y')).strftime('%Y')
    select_year_from_cal(year_num)
    table_months_header_element.when_visible(10)

    mth = (Chronic.parse(get_month_from_cal(month_num))).strftime('%m')
    select_month_from_cal(month_num)

    table_days_header_element.when_visible(10)
    day = (DateTime.strptime(get_day_from_cal(cal_table_row, cal_table_data), '%d')).strftime('%d')
    select_day_from_cal(cal_table_row, cal_table_data)
    date_selected = ("#{mth}/#{day}/#{yr}")
    date_selected
  end

  def select_end_date(year_num, month_num, cal_table_row, cal_table_data)
    date_to_element.when_visible(30)
    date_to_cal_btn_element.click
    select_year_header

    yr = (DateTime.strptime(get_year_from_cal(year_num), '%Y')).strftime('%Y')
    select_year_from_cal(year_num)
    table_months_header_element.when_visible(10)

    mth = (Chronic.parse(get_month_from_cal(month_num))).strftime('%m')
    select_month_from_cal(month_num)

    table_days_header_element.when_visible(10)
    day = (DateTime.strptime(get_day_from_cal(cal_table_row, cal_table_data), '%d')).strftime('%d')
    select_day_from_cal(cal_table_row, cal_table_data)
    date_selected = ("#{mth}/#{day}/#{yr}")
    date_selected
  end
end
