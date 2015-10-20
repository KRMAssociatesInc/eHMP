# encoding: utf-8

require 'rubygems'
require 'watir-webdriver'
require 'page-object'
# require_relative 'common_elements'
# PatientOveriew page for $BASE/#overview
class GlobalDateFilter
  include PageObject

  div(:glodate_mini, id: 'globalDatePicker-compact')
  button(:glodate_collapsed, id: 'date-region-minimized')
  button(:cancel_btn, id: 'cancel-global')
  button(:apply_btn, id: 'custom-range-apply-global')
  span(:date_sel_btn, id: 'navigation-dateButton')
  button(:all_range_btn, id: 'all-range-global')
  button(:two_yr_btn, id: '2yr-range-global')
  button(:one_yr_btn, id: '1yr-range-global')
  button(:thr_mon_btn, id: '3mo-range-global')
  button(:one_mon_btn, id: '1mo-range-global')
  button(:sev_day_btn, id: '7d-range-global')
  button(:sev_two_hr_btn, id: '72hr-range-global')
  button(:twe_four_hr_btn, id: '24hr-range-global')
  text_field(:date_from, id: 'filter-from-date-global')
  text_field(:date_to, id: 'filter-to-date-global')
  button(:date_range_btn, id: 'date-region-minimized') # click this button to open the global date filter

  def enter_global_from_date(dateStr)
    # dateStr must be in "mm/dd/yyyy" format
    self.date_from = dateStr
  end

  def enter_global_to_date(dateStr)
    # dateStr must be in "mm/dd/yyyy" format
    self.date_to = dateStr
  end

  def select_all
    glodate_collapsed_element.when_visible(10)
    glodate_collapsed
    all_range_btn_element.when_visible(10)
    all_range_btn
    apply_btn
    glodate_collapsed_element.when_visible(10)
  end

  def select_24h
    glodate_collapsed_element.when_visible(10)
    glodate_collapsed
    twe_four_hr_btn_element.when_visible(10)
    twe_four_hr_btn
    apply_btn
    glodate_collapsed_element.when_visible(10)
  end
end
